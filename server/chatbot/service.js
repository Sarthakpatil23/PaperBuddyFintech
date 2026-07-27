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
    console.error('Chatbot Processing Error:', error);
    
    // Return structured response with actual error details
    return {
      type: 'escalation',
      message: `I encountered an issue processing your request (${error.message}). Please contact our accounts support team.`,
      payload: {
        adminContact: ADMIN_CONTACT,
        reason: error.message
      }
    };
  }
}

async function callGroqAPI(payload) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
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
