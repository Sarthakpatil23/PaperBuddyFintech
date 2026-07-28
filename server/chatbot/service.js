// Groq Llama Chatbot Service Layer
import dotenv from 'dotenv';
import { buildSystemPrompt } from './groundingContext.js';
import { getToolsForRole } from './toolDefinitions.js';
import { executeAdminTool, executeParentTool } from './toolHandlers.js';

dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const ADMIN_CONTACT = {
  name: process.env.ADMIN_OFFICE_NAME || 'PaperBuddy Accounts & Support Office',
  email: process.env.ADMIN_OFFICE_EMAIL || 'fees@paperbuddy.edu',
  phone: process.env.ADMIN_OFFICE_PHONE || '+91 (080) 4567-8900'
};

export async function processChatbotMessage({ message, history = [], role = 'parent', studentId = null }) {
  try {
    const systemPrompt = buildSystemPrompt(role, ADMIN_CONTACT);
    const tools = getToolsForRole(role);

    // Format conversation history for Groq
    const formattedHistory = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text || msg.message || ''
    }));

    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    // 1. Initial Call to Groq Llama API
    let response = await callGroqAPI({
      model: GROQ_MODEL,
      messages,
      tools,
      tool_choice: 'auto',
      temperature: 0.2
    });

    let choice = response.choices && response.choices[0];
    let assistantMsg = choice ? choice.message : null;

    if (!assistantMsg) {
      throw new Error('No valid response choices returned from Groq API');
    }

    let toolExecResults = [];

    // 2. Handle Tool Calling Loop if Model requests a function call
    if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
      messages.push(assistantMsg);

      for (const toolCall of assistantMsg.tool_calls) {
        const funcName = toolCall.function.name;
        let funcArgs = {};
        const rawArgs = toolCall.function.arguments;
        
        if (rawArgs && rawArgs !== 'null') {
          try {
            funcArgs = JSON.parse(rawArgs);
          } catch (e) {
            console.warn('Failed to parse tool arguments:', e.message);
          }
        }
        if (!funcArgs || typeof funcArgs !== 'object') {
          funcArgs = {};
        }

        let result = null;
        try {
          if (role === 'admin') {
            result = await executeAdminTool(funcName, funcArgs);
          } else {
            result = await executeParentTool(funcName, funcArgs, studentId);
          }
        } catch (err) {
          console.error(`Error executing tool ${funcName}:`, err.message);
          result = { error: err.message };
        }

        toolExecResults.push({ toolName: funcName, args: funcArgs, result });

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: funcName,
          content: JSON.stringify(result)
        });
      }

      // 3. Second call to Groq to generate final user-facing text with tool results attached
      const secondResponse = await callGroqAPI({
        model: GROQ_MODEL,
        messages,
        temperature: 0.2
      });

      if (secondResponse.choices && secondResponse.choices[0]) {
        assistantMsg = secondResponse.choices[0].message;
      }
    }

    const replyText = assistantMsg.content || 'I have retrieved your requested information.';

    // 4. Determine Response Type & Payload (Structured Content)
    return formatStructuredResponse({
      role,
      userMessage: message,
      replyText,
      toolExecResults,
      adminContact: ADMIN_CONTACT
    });

  } catch (error) {
    console.error('Chatbot Processing Error (attempting local DB fallback):', error.message);
    
    try {
      const fallbackResult = await handleLocalFallback({ message, role, studentId });
      if (fallbackResult) {
        return fallbackResult;
      }
    } catch (fallbackErr) {
      console.error('Local fallback processing error:', fallbackErr.message);
    }

    // Return structured response with error details and support escalation contact
    return {
      type: 'escalation',
      message: `The AI assistant API service is currently unavailable (${error.message}). Please contact our accounts support team or update your GROQ_API_KEY in .env.`,
      payload: {
        adminContact: ADMIN_CONTACT,
        reason: error.message
      }
    };
  }
}

async function handleLocalFallback({ message, role, studentId }) {
  const lower = (message || '').toLowerCase();

  if (role === 'admin') {
    if (lower.includes('defaulter') || lower.includes('overdue') || lower.includes('unpaid') || lower.includes('pending')) {
      const defaulters = await executeAdminTool('getDefaulters', {});
      return {
        type: 'list',
        message: `### Overdue Defaulters List\nHere is the current list of students with overdue fee assignments retrieved directly from the database:`,
        payload: {
          title: 'Overdue Defaulters List',
          items: defaulters
        }
      };
    }

    if (lower.includes('revenue') || lower.includes('collection') || lower.includes('total') || lower.includes('efficiency') || lower.includes('summary')) {
      const summary = await executeAdminTool('getRevenueSummary', {});
      return {
        type: 'data_card',
        message: `### School Revenue Overview\nHere is the real-time financial collection breakdown:`,
        payload: {
          title: 'School Revenue Overview',
          collected: summary.totalCollected,
          outstanding: summary.outstandingDues,
          efficiency: summary.collectionEfficiency
        }
      };
    }

    if (lower.includes('reconcil') || lower.includes('bank') || lower.includes('cheque')) {
      const status = await executeAdminTool('getReconciliationStatus', {});
      return {
        type: 'text',
        message: `### Reconciliation Status Overview\n- **Pending Entries**: ${status.pendingCount} (₹${status.pendingAmount.toLocaleString('en-IN')})\n- **Flagged Discrepancies**: ${status.flaggedCount}\n- **Reconciled Entries**: ${status.reconciledCount}`
      };
    }

    if (lower.includes('transaction') || lower.includes('recent') || lower.includes('history')) {
      const txns = await executeAdminTool('getTransactions', {});
      const txnListStr = txns.map(t => `- **${t.receiptNo}**: ${t.studentName} — ₹${t.amount.toLocaleString('en-IN')} (${t.method}, ${t.status})`).join('\n');
      return {
        type: 'text',
        message: `### Recent Transactions\n${txnListStr || 'No recent transactions found.'}`
      };
    }

    if (lower.includes('ledger') || lower.includes('student')) {
      const ledger = await executeAdminTool('getStudentLedger', { studentId: 'STU-101' });
      if (!ledger.error) {
        return {
          type: 'text',
          message: `### Student Ledger for ${ledger.studentName} (${ledger.studentId})\n- **Class/Grade**: ${ledger.classGrade}\n- **Total Billed**: ₹${ledger.totalBilled.toLocaleString('en-IN')}\n- **Total Waived**: ₹${ledger.totalWaived.toLocaleString('en-IN')}\n- **Total Paid**: ₹${ledger.totalPaid.toLocaleString('en-IN')}\n- **Balance Due**: ₹${ledger.balanceDue.toLocaleString('en-IN')}`
        };
      }
    }
  } else {
    // Parent Role Fallback
    if (lower.includes('fee') || lower.includes('due') || lower.includes('balance') || lower.includes('outstanding') || lower.includes('owe') || lower.includes('amount')) {
      const fees = await executeParentTool('getOutstandingFees', {}, studentId);
      if (!fees.error) {
        return {
          type: 'data_card',
          message: `### Outstanding Fees Summary\nHere are the active fee dues for **${fees.studentName}**:`,
          payload: {
            title: `Outstanding Fees for ${fees.studentName}`,
            amount: fees.totalOutstanding,
            status: fees.totalOutstanding > 0 ? 'OVERDUE' : 'PAID',
            items: fees.items || []
          }
        };
      }
    }

    if (lower.includes('history') || lower.includes('paid') || lower.includes('receipt') || lower.includes('past')) {
      const history = await executeParentTool('getPaymentHistory', {}, studentId);
      if (Array.isArray(history) && history.length > 0) {
        const histStr = history.map(h => `- **Receipt #${h.receiptNo}**: ${h.feeTitle} — ₹${h.amount.toLocaleString('en-IN')} via ${h.method} on ${h.date}`).join('\n');
        return {
          type: 'text',
          message: `### Recent Payment History\n${histStr}`
        };
      }
    }

    if (lower.includes('pay') || lower.includes('checkout') || lower.includes('online')) {
      return {
        type: 'navigation_link',
        message: `You can proceed to clear outstanding fee dues using our secure zero-fee payment checkout:`,
        payload: {
          isNavigation: true,
          url: '/parent/pay',
          buttonText: 'Proceed to Payment Checkout'
        }
      };
    }
  }

  return null;
}

async function callGroqAPI(payload) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.includes('your_') || apiKey.trim() === '') {
    throw new Error('GROQ_API_KEY is not configured or is invalid in .env');
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error (${res.status}): ${errText}`);
  }

  return await res.json();
}

function formatStructuredResponse({ role, userMessage, replyText, toolExecResults, adminContact }) {
  const lowerMsg = userMessage.toLowerCase();

  // 1. Escalation check
  if (
    lowerMsg.includes('refund') ||
    lowerMsg.includes('dispute') ||
    lowerMsg.includes('complaint') ||
    lowerMsg.includes('wrong bill') ||
    lowerMsg.includes('talk to human') ||
    lowerMsg.includes('speak to admin')
  ) {
    return {
      type: 'escalation',
      message: replyText,
      payload: { adminContact }
    };
  }

  // 2. Check for proposed admin action (proposeAction tool)
  const proposalResult = toolExecResults.find(t => t.toolName === 'proposeAction');
  if (proposalResult && proposalResult.result?.isProposal) {
    return {
      type: 'proposed_action',
      message: replyText,
      payload: proposalResult.result
    };
  }

  // 3. Check for payment navigation proposal
  const navResult = toolExecResults.find(t => t.toolName === 'proposePaymentNavigation');
  if (navResult && navResult.result?.isNavigation) {
    return {
      type: 'navigation_link',
      message: replyText,
      payload: navResult.result
    };
  }

  // 4. Data Card (Outstanding fees or revenue summary)
  const feesResult = toolExecResults.find(t => t.toolName === 'getOutstandingFees');
  if (feesResult && feesResult.result?.totalOutstanding !== undefined) {
    return {
      type: 'data_card',
      message: replyText,
      payload: {
        title: `Outstanding Fees for ${feesResult.result.studentName || 'Student'}`,
        amount: feesResult.result.totalOutstanding,
        status: feesResult.result.totalOutstanding > 0 ? 'OVERDUE' : 'PAID',
        items: feesResult.result.items || []
      }
    };
  }

  const revenueResult = toolExecResults.find(t => t.toolName === 'getRevenueSummary');
  if (revenueResult && revenueResult.result?.totalCollected !== undefined) {
    return {
      type: 'data_card',
      message: replyText,
      payload: {
        title: 'School Revenue Overview',
        collected: revenueResult.result.totalCollected,
        outstanding: revenueResult.result.outstandingDues,
        efficiency: revenueResult.result.collectionEfficiency
      }
    };
  }

  // 5. List Result (Defaulters or Transactions)
  const defaultersResult = toolExecResults.find(t => t.toolName === 'getDefaulters');
  if (defaultersResult && Array.isArray(defaultersResult.result)) {
    return {
      type: 'list',
      message: replyText,
      payload: {
        title: 'Overdue Defaulters List',
        items: defaultersResult.result
      }
    };
  }

  // Default: Text Markdown Response
  return {
    type: 'text',
    message: replyText
  };
}

