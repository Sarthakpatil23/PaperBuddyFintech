// Groq Function Calling Tool Definitions for Admin and Parent Roles

export const ADMIN_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'getDefaulters',
      description: 'Get overdue student accounts with outstanding fee balances, days overdue, and severity levels.',
      parameters: {
        type: 'object',
        properties: {
          classGrade: { type: 'string', description: 'Filter by grade/class e.g. "Grade 10"' },
          severity: { type: 'string', enum: ['mild', 'moderate', 'severe'], description: 'Filter by overdue severity' },
          minDaysOverdue: { type: 'number', description: 'Minimum number of days past due' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getStudentLedger',
      description: 'Fetch the complete financial ledger, billed fee assignments, payment history, and waivers for a student by studentId.',
      parameters: {
        type: 'object',
        properties: {
          studentId: { type: 'string', description: 'Student ID e.g. "STU-101" or student name' }
        },
        required: ['studentId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getRevenueSummary',
      description: 'Get high-level school revenue metrics: total collected, outstanding dues, collection efficiency %, and today\'s collection.',
      parameters: {
        type: 'object',
        properties: {
          dateRange: { type: 'string', enum: ['today', '7days', '30days', 'all'], description: 'Timeframe for revenue calculations' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getReconciliationStatus',
      description: 'Get status of offline cash/cheque counter payment reconciliation, pending bank deposit slips, and flagged anomalies.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getTransactions',
      description: 'Fetch recent fee payment transactions with filtering by status, payment method, or student name/receipt number.',
      parameters: {
        type: 'object',
        properties: {
          searchQuery: { type: 'string', description: 'Search string e.g. receipt number, student name, UTR' },
          status: { type: 'string', enum: ['SUCCESS', 'PENDING', 'FAILED', 'BOUNCED', 'RECONCILED', 'REFUNDED'] },
          method: { type: 'string', enum: ['UPI', 'CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER'] }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'proposeAction',
      description: 'Propose a financial admin action (send payment reminder, apply late penalty, or apply waiver). DOES NOT execute; returns a confirmation proposal for human approval.',
      parameters: {
        type: 'object',
        properties: {
          actionType: { type: 'string', enum: ['send_reminder', 'apply_penalty', 'apply_waiver'], description: 'Type of administrative action to propose' },
          targetStudentId: { type: 'string', description: 'Student ID e.g. "STU-101"' },
          targetStudentName: { type: 'string', description: 'Name of student' },
          amount: { type: 'number', description: 'Amount for penalty or waiver in INR' },
          reason: { type: 'string', description: 'Reason for reminder, penalty, or waiver' }
        },
        required: ['actionType', 'targetStudentId']
      }
    }
  }
];

export const PARENT_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'getOutstandingFees',
      description: 'Get itemized list of outstanding, pending, or overdue fee bills for the logged-in parent\'s student.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getPaymentHistory',
      description: 'Get chronological history of verified fee payments made for the logged-in parent\'s student.',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Maximum number of transactions to return (default 5)' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getFeeExplanation',
      description: 'Get itemized breakdown explaining why a specific fee bill is owed (original bill, applied discounts, late penalties, payments made).',
      parameters: {
        type: 'object',
        properties: {
          feeAssignmentId: { type: 'string', description: 'Fee assignment ID' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'proposePaymentNavigation',
      description: 'Propose a quick navigation link to the fee payment checkout page.',
      parameters: {
        type: 'object',
        properties: {
          feeAssignmentId: { type: 'string', description: 'Fee assignment ID to pay' }
        }
      }
    }
  }
];

export function getToolsForRole(role) {
  return role === 'admin' ? ADMIN_TOOLS : PARENT_TOOLS;
}
