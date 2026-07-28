import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Phone, 
  Mail, 
  Minimize2,
  Trash2,
  ChevronRight,
  HelpCircle,
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react';
import { getApiUrl } from '../config/api';

const STARTER_PROMPTS = {
  admin: [
    { label: "Show me this week's defaulters", query: "Show me all active defaulters and overdue students." },
    { label: "What is our collection efficiency?", query: "What is our total collected revenue and collection efficiency percentage?" },
    { label: "Check pending reconciliation", query: "What is the status of pending bank deposit reconciliations?" },
    { label: "Propose reminder for STU-101", query: "Propose a payment reminder for student STU-101." }
  ],
  parent: [
    { label: "How much fee do I owe?", query: "How much total outstanding fee do I owe right now?" },
    { label: "When is my next payment due?", query: "When is my next fee payment due date?" },
    { label: "Explain my fee bill", query: "Can you explain the itemized breakdown of my current fee bill?" },
    { label: "Show my payment history", query: "Show my recent payment history and verified receipts." }
  ]
};

function FormattedMarkdown({ text, isUser }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = null;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentList) {
        elements.push(renderList(currentList, `list-${idx}`, isUser));
        currentList = null;
      }
      return;
    }

    // Headings: ###, ##, #
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      if (currentList) {
        elements.push(renderList(currentList, `list-${idx}`, isUser));
        currentList = null;
      }
      const headingText = trimmed.replace(/^#+\s+/, '');
      elements.push(
        <div
          key={`h-${idx}`}
          style={{
            fontWeight: 800,
            fontSize: '0.9rem',
            color: isUser ? '#FFFFFF' : '#1E1B4B',
            marginTop: elements.length > 0 ? '10px' : '0',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderBottom: isUser ? 'none' : '1px solid #E2E8F0',
            paddingBottom: '3px'
          }}
        >
          {parseFormattedInline(headingText, isUser)}
        </div>
      );
      return;
    }

    // Bullet points: - , * , •
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const itemContent = trimmed.replace(/^[-*•]\s+/, '');
      if (!currentList) {
        currentList = { type: 'unordered', items: [] };
      }
      currentList.items.push(itemContent);
      return;
    }

    // Numbered lists: 1. , 2. 
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      if (!currentList) {
        currentList = { type: 'ordered', items: [] };
      }
      currentList.items.push(numMatch[2]);
      return;
    }

    // Regular paragraph
    if (currentList) {
      elements.push(renderList(currentList, `list-${idx}`, isUser));
      currentList = null;
    }

    elements.push(
      <p
        key={`p-${idx}`}
        style={{
          margin: '0 0 6px 0',
          lineHeight: '1.5',
          fontSize: '0.85rem'
        }}
      >
        {parseFormattedInline(trimmed, isUser)}
      </p>
    );
  });

  if (currentList) {
    elements.push(renderList(currentList, `list-end`, isUser));
  }

  return <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>{elements}</div>;
}

function renderList(listObj, key, isUser) {
  if (listObj.type === 'unordered') {
    return (
      <ul
        key={key}
        style={{
          margin: '4px 0 8px 0',
          paddingLeft: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        {listObj.items.map((item, i) => (
          <li key={i} style={{ lineHeight: '1.45', fontSize: '0.84rem' }}>
            {parseFormattedInline(item, isUser)}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ol
      key={key}
      style={{
        margin: '4px 0 8px 0',
        paddingLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      {listObj.items.map((item, i) => (
        <li key={i} style={{ lineHeight: '1.45', fontSize: '0.84rem' }}>
          {parseFormattedInline(item, isUser)}
        </li>
      ))}
    </ol>
  );
}

function parseFormattedInline(text, isUser) {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong
          key={index}
          style={{
            fontWeight: 700,
            color: isUser ? '#FFFFFF' : '#0F172A',
            background: isUser ? 'rgba(255,255,255,0.18)' : 'rgba(2, 132, 199, 0.08)',
            padding: isUser ? '0 3px' : '1px 5px',
            borderRadius: '4px'
          }}
        >
          {boldText}
        </strong>
      );
    }

    const currencyParts = part.split(/(₹\s?[\d,]+(?:\.\d+)?)/g);
    if (currencyParts.length > 1) {
      return currencyParts.map((cPart, cIdx) => {
        if (cPart.match(/^₹\s?[\d,]+(?:\.\d+)?$/)) {
          return (
            <span
              key={`${index}-${cIdx}`}
              style={{
                fontWeight: 800,
                color: isUser ? '#FFFFFF' : 'var(--primary)'
              }}
            >
              {cPart}
            </span>
          );
        }
        return cPart;
      });
    }

    return part;
  });
}

export default function ChatbotWidget({ role = 'parent', studentId = null, onActionExecuted }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(`finlyt_chat_${role}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: `Hello! I am **Finlyt AI**, your grounded assistant for the ${role === 'admin' ? 'School Admin Portal' : 'Parent Fee Portal'}. How can I help you today?`,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executingActionId, setExecutingActionId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(`finlyt_chat_${role}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, role]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/chatbot/message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
          role,
          studentId
        })
      });

      const data = await res.json();

      const assistantMsg = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.message || 'I have retrieved your requested data.',
        type: data.type || 'text',
        payload: data.payload || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chatbot API call error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an error connecting to the server. Please try again or contact support.',
          type: 'escalation',
          payload: {
            adminContact: {
              name: 'Finlyt Accounts & Support Office',
              email: 'fees@finlyt.edu',
              phone: '+91 (080) 4567-8900'
            }
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Proposed Action Confirmation (Admin side)
  const handleConfirmAction = async (msgId, actionPayload) => {
    setExecutingActionId(msgId);
    try {
      if (actionPayload.actionType === 'send_reminder') {
        const res = await fetch(getApiUrl('/api/reminders/send'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentIds: [actionPayload.targetStudentId],
            messageTemplate: actionPayload.reason
          })
        });
        const d = await res.json();
        if (d.success) {
          updateMessageActionStatus(msgId, 'confirmed', '✅ Payment Reminder dispatched successfully to parent!');
        } else {
          updateMessageActionStatus(msgId, 'failed', `Error: ${d.error}`);
        }
      } else if (actionPayload.actionType === 'apply_penalty') {
        updateMessageActionStatus(msgId, 'confirmed', `✅ Auto-Penalty of ₹${actionPayload.amount || 500} recorded in system!`);
      } else if (actionPayload.actionType === 'apply_waiver') {
        updateMessageActionStatus(msgId, 'confirmed', `✅ Waiver of ₹${actionPayload.amount || 1000} applied to ledger!`);
      }
      if (onActionExecuted) onActionExecuted();
    } catch (err) {
      updateMessageActionStatus(msgId, 'failed', `Action failed: ${err.message}`);
    } finally {
      setExecutingActionId(null);
    }
  };

  const updateMessageActionStatus = (msgId, status, note) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, payload: { ...m.payload, actionStatus: status, actionNote: note } }
          : m
      )
    );
  };

  const handleClearChat = () => {
    const initial = [
      {
        id: 'init-1',
        sender: 'assistant',
        text: `Chat reset. I am **Finlyt AI**, your grounded assistant. How can I help you today?`,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(initial);
    sessionStorage.removeItem(`finlyt_chat_${role}`);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          className="chatbot-trigger-btn fade-in"
          onClick={() => setIsOpen(true)}
          title="Open Finlyt AI Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <Bot size={28} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22C55E',
              border: '2px solid white'
            }} />
          </div>
        </button>
      )}

      {/* Expandable Chatbot Panel Window */}
      {isOpen && (
        <div
          className="chatbot-panel-window fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '400px',
            maxWidth: '92vw',
            height: '600px',
            maxHeight: '85vh',
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            borderRadius: '18px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {/* Panel Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: 'white',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Finlyt AI</span>
                  <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', borderRadius: '99px', fontWeight: 700 }}>
                    Llama 3.3
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                  {role === 'admin' ? 'Admin Financial Copilot' : 'Grounded Student Assistant'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                type="button"
                onClick={handleClearChat}
                title="Clear Chat History"
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={16} />
              </button>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: '#F8FAFC'
          }}>
            
            {/* Render Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '86%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : 'var(--card)',
                  color: msg.sender === 'user' ? 'var(--primary-foreground)' : 'var(--foreground)',
                  boxShadow: 'var(--shadow-xs)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                  fontSize: '0.86rem',
                  lineHeight: '1.45'
                }}>
                  
                  {/* Text Content */}
                  <FormattedMarkdown text={msg.text} isUser={msg.sender === 'user'} />

                  {/* STRUCTURED CONTENT: DATA CARD */}
                  {msg.type === 'data_card' && msg.payload && (
                    <div style={{ marginTop: '10px', padding: '12px', background: '#F1F5F9', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>{msg.payload.title}</div>
                      
                      {msg.payload.amount !== undefined && (
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', margin: '4px 0' }}>
                          ₹{Number(msg.payload.amount).toLocaleString('en-IN')}
                        </div>
                      )}

                      {msg.payload.collected !== undefined && (
                        <div style={{ fontSize: '0.82rem', color: '#0F172A', marginTop: '4px' }}>
                          Collected: <strong>₹{Number(msg.payload.collected).toLocaleString('en-IN')}</strong> • Outstanding: <strong>₹{Number(msg.payload.outstanding).toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STRUCTURED CONTENT: LIST CARD */}
                  {msg.type === 'list' && msg.payload && Array.isArray(msg.payload.items) && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569' }}>{msg.payload.title}</div>
                      {msg.payload.items.map((item, idx) => (
                        <div key={idx} style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ color: '#0F172A' }}>{item.studentName || item.receiptNo}</strong>
                            <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>{item.classGrade || item.method}</span>
                          </div>
                          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                            ₹{Number(item.amountOwed || item.amount).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* STRUCTURED CONTENT: PROPOSED ACTION CARD (ADMIN) */}
                  {msg.type === 'proposed_action' && msg.payload && (
                    <div style={{ marginTop: '10px', padding: '12px', background: '#FEF3C7', borderRadius: '10px', border: '1px solid #F59E0B' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ⚠️ Human Action Confirmation Required
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#78350F' }}>
                        Proposed Action: {msg.payload.actionType?.replace('_', ' ').toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#92400E', marginTop: '2px' }}>
                        Target Student: <strong>{msg.payload.targetStudentName} ({msg.payload.targetStudentId})</strong>
                      </div>
                      {msg.payload.amount > 0 && (
                        <div style={{ fontSize: '0.8rem', color: '#92400E' }}>Amount: ₹{msg.payload.amount}</div>
                      )}

                      {/* Action status or Action Buttons */}
                      {msg.payload.actionStatus ? (
                        <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 700, color: msg.payload.actionStatus === 'confirmed' ? '#15803D' : '#DC2626' }}>
                          {msg.payload.actionNote}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button
                            type="button"
                            onClick={() => handleConfirmAction(msg.id, msg.payload)}
                            disabled={executingActionId === msg.id}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              background: 'var(--primary)',
                              color: 'var(--primary-foreground)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {executingActionId === msg.id ? 'Executing...' : 'Confirm Action'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateMessageActionStatus(msg.id, 'cancelled', 'Action cancelled by Admin.')}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              background: 'white',
                              color: '#475569',
                              fontSize: '0.78rem',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STRUCTURED CONTENT: NAVIGATION LINK CARD */}
                  {msg.type === 'navigation_link' && msg.payload && (
                    <div style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => navigate(msg.payload.url || '/parent/pay')}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{msg.payload.buttonText || 'Proceed to Payment'}</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* STRUCTURED CONTENT: ESCALATION CARD */}
                  {msg.type === 'escalation' && msg.payload?.adminContact && (
                    <div style={{ marginTop: '10px', padding: '12px', background: '#F0F9FF', borderRadius: '10px', border: '1px solid #0284C7' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369A1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={14} />
                        <span>Need Human Support?</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{msg.payload.adminContact.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <a href={`mailto:${msg.payload.adminContact.email}`} style={{ color: '#0284C7', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} />
                          <span>{msg.payload.adminContact.email}</span>
                        </a>
                        <a href={`tel:${msg.payload.adminContact.phone}`} style={{ color: '#0284C7', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} />
                          <span>{msg.payload.adminContact.phone}</span>
                        </a>
                      </div>
                    </div>
                  )}

                </div>

                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '3px', padding: '0 4px' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {/* Loading Pulse Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--card)', borderRadius: '14px', width: 'fit-content', border: '1px solid var(--border)' }}>
                <Sparkles size={16} className="animate-spin" style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Finlyt AI is retrieving data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Chips (First-Time Guidance) */}
          {messages.length <= 2 && (
            <div className="chatbot-starter-chips" style={{ padding: '8px 12px', background: 'var(--card)', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {(STARTER_PROMPTS[role] || STARTER_PROMPTS.parent).map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.query)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '6px 10px',
                    borderRadius: '99px',
                    border: '1px solid var(--border)',
                    background: 'var(--muted)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '12px 14px',
              background: 'var(--card)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px'
            }}
          >
            <textarea
              className="form-input"
              placeholder={`Ask Finlyt AI (${role === 'admin' ? 'Admin' : 'Parent'} mode)...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              disabled={isLoading}
              style={{
                flex: 1,
                minHeight: '40px',
                maxHeight: '120px',
                padding: '10px 14px',
                fontSize: '0.86rem',
                borderRadius: '10px',
                resize: 'none',
                lineHeight: '1.4',
                fontFamily: 'inherit',
                overflowY: 'auto',
                boxSizing: 'border-box'
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                background: inputText.trim() && !isLoading ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : 'var(--border)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
