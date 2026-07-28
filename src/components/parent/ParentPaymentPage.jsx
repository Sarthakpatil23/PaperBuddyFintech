import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowLeft, 
  ArrowRight,
  Download, 
  Receipt, 
  Sparkles, 
  Lock, 
  Wallet, 
  Landmark, 
  Check, 
  ChevronRight, 
  ChevronDown,
  AlertCircle, 
  Building2,
  X,
  RefreshCw,
  Zap,
  Eye,
  Home,
  Clock,
  Search,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { downloadReceiptPDF } from '../../utils/pdfReceiptGenerator';

// ==========================================
// CUSTOM VECTOR SVG LOGOS (NO EMOJIS)
// ==========================================

const PhonePeIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#5F259F" />
    <path d="M21.5 11H16V21H18.5V17.5H21.5C23.4 17.5 25 15.9 25 14C25 12.1 23.4 11 21.5 11ZM21.5 15H18.5V13.5H21.5C22 13.5 22.5 13.7 22.5 14.25C22.5 14.8 22 15 21.5 15Z" fill="white" />
    <path d="M12.5 11H7V21H9.5V17.5H12.5C14.4 17.5 16 15.9 16 14C16 12.1 14.4 11 12.5 11ZM12.5 15H9.5V13.5H12.5C13 13.5 13.5 13.7 13.5 14.25C13.5 14.8 13 15 12.5 15Z" fill="white" opacity="0.75" />
  </svg>
);

const GPayIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
    <path d="M22.8 14.6H16v2.9h3.9c-.3 1.6-1.8 2.8-3.9 2.8-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3c1.1 0 2.1.4 2.8 1.1l2.2-2.2C19.7 9.2 18 8.4 16 8.4c-4.2 0-7.6 3.4-7.6 7.6s3.4 7.6 7.6 7.6c4.4 0 7.3-3.1 7.3-7.4 0-.5-.1-1-.2-1.6z" fill="#4285F4" />
  </svg>
);

const PaytmIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#002E6E" />
    <path d="M7 10h4v12H7z" fill="#00BAF2" />
    <path d="M13 10h4v12h-4z" fill="#FFFFFF" />
    <path d="M19 10h6v3h-3v9h-3z" fill="#00BAF2" />
  </svg>
);

const BhimIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#005B9C" />
    <path d="M9 22V10l7 6-7 6z" fill="#FF9933" />
    <path d="M16 22V10l7 6-7 6z" fill="#138808" />
  </svg>
);

const CredIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#121212" />
    <path d="M9 9h14v14H9z" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
    <path d="M13 13h6v6h-6z" fill="#FFFFFF" />
  </svg>
);

const HdfcLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#004B8D" />
    <rect x="8" y="8" width="16" height="16" fill="#ED232A" />
    <rect x="12" y="12" width="8" height="8" fill="#004B8D" />
    <rect x="14" y="8" width="4" height="16" fill="white" />
    <rect x="8" y="14" width="16" height="4" fill="white" />
  </svg>
);

const IciciLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#F37021" />
    <path d="M16 6C10.5 6 6 10.5 6 16C6 21.5 10.5 26 16 26C21.5 26 26 21.5 26 16C26 10.5 21.5 6 16 6ZM16 22C12.7 22 10 19.3 10 16C10 12.7 12.7 10 16 10C19.3 10 22 12.7 22 16C22 19.3 19.3 22 16 22Z" fill="white"/>
    <path d="M16 12C13.8 12 12 13.8 12 16C12 18.2 13.8 20 16 20C18.2 20 20 18.2 20 16C20 13.8 18.2 12 16 12Z" fill="#B02A30"/>
  </svg>
);

const SbiLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#280071" />
    <circle cx="16" cy="16" r="9" fill="#00B5EF" />
    <circle cx="16" cy="13" r="4.5" fill="#280071" />
    <rect x="14.5" y="13" width="3" height="9" fill="#280071" />
  </svg>
);

const AxisLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#97144D" />
    <path d="M16 7L24 23H18.5L16 18L13.5 23H8L16 7Z" fill="white" />
  </svg>
);

const KotakLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#EE1C25" />
    <path d="M10 8h4v6.5L18.5 8H23l-5.5 8L23 24h-4.5L14 17.5V24h-4V8z" fill="white" />
  </svg>
);

const PnbLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#A21D3C" />
    <circle cx="16" cy="16" r="8" fill="#F48220" />
    <path d="M16 10v12M10 16h12" stroke="#A21D3C" strokeWidth="2.5" />
  </svg>
);

const CanaraLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#0091DF" />
    <path d="M10 22L16 10L22 22H10Z" fill="#FDB813" />
    <path d="M12 12L16 20L20 12H12Z" fill="white" />
  </svg>
);

const BobLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#F26522" />
    <circle cx="16" cy="16" r="7" fill="white" />
    <path d="M16 11v10M11 16h10" stroke="#F26522" strokeWidth="2" />
  </svg>
);

const UnionBankLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#0054A6" />
    <path d="M10 10v7a6 6 0 0012 0v-7h-3.5v7a2.5 2.5 0 01-5 0v-7H10z" fill="#ED1C24" />
    <path d="M13.5 10v7a2.5 2.5 0 005 0v-7h-5z" fill="white" />
  </svg>
);

const IdfcLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#9E1B32" />
    <path d="M8 10h16v3H8zM8 15h11v3H8zM8 20h14v3H8z" fill="white" />
  </svg>
);

const IndusIndLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#841719" />
    <circle cx="16" cy="16" r="7" stroke="white" strokeWidth="2" />
    <path d="M13 16l2.5 3 4-6" stroke="#F37021" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FederalLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#002C6C" />
    <path d="M9 9h14v4H13v3h9v4H13v7H9V9z" fill="#FFC72C" />
  </svg>
);

const YesBankLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#00529B" />
    <path d="M9 16l5 5 9-10" stroke="#ED1C24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GenericBankLogo = ({ size = 26, color = "#0F172A" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
    <path d="M8 12l8-5 8 5M9 13v7M14 13v7M18 13v7M23 13v7M7 23h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const AmazonPayLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#232F3E" />
    <path d="M9 19c4 2.5 10 2.5 14 0" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M21 17.5l2 1.5-1 2.5" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
    <path d="M13 11c0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5" stroke="white" strokeWidth="2" />
  </svg>
);

const MobikwikLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#00A5EC" />
    <path d="M9 10h5l4 6 4-6h5l-6.5 9.5L23 22h-5l-4-6-4 6H5l6.5-9.5L9 10z" fill="white" />
  </svg>
);

const LazyPayLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#5F0080" />
    <path d="M10 9h4v10h7v4H10V9z" fill="#00E5FF" />
  </svg>
);

const SimplLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#1DE9B6" />
    <circle cx="16" cy="16" r="6" fill="#004D40" />
  </svg>
);

const INDIAN_BANKS_LIST = [
  { id: 'HDFC', name: 'HDFC Bank', code: 'HDFC0000001', category: 'Popular', logoComponent: HdfcLogo },
  { id: 'ICICI', name: 'ICICI Bank', code: 'ICIC0000001', category: 'Popular', logoComponent: IciciLogo },
  { id: 'SBI', name: 'State Bank of India (SBI)', code: 'SBIN0000001', category: 'Popular', logoComponent: SbiLogo },
  { id: 'AXIS', name: 'Axis Bank', code: 'UTIB0000001', category: 'Popular', logoComponent: AxisLogo },
  { id: 'KOTAK', name: 'Kotak Mahindra Bank', code: 'KKBK0000001', category: 'Popular', logoComponent: KotakLogo },
  { id: 'PNB', name: 'Punjab National Bank (PNB)', code: 'PUNB0000001', category: 'Popular', logoComponent: PnbLogo },
  { id: 'CANARA', name: 'Canara Bank', code: 'CNRB0000001', category: 'Public Sector', logoComponent: CanaraLogo },
  { id: 'BOB', name: 'Bank of Baroda', code: 'BARB0000001', category: 'Public Sector', logoComponent: BobLogo },
  { id: 'UNION', name: 'Union Bank of India', code: 'UBIN0000001', category: 'Public Sector', logoComponent: UnionBankLogo },
  { id: 'IDFC', name: 'IDFC FIRST Bank', code: 'IDFB0000001', category: 'Private Sector', logoComponent: IdfcLogo },
  { id: 'INDUSIND', name: 'IndusInd Bank', code: 'INDB0000001', category: 'Private Sector', logoComponent: IndusIndLogo },
  { id: 'FEDERAL', name: 'Federal Bank', code: 'FDRL0000001', category: 'Private Sector', logoComponent: FederalLogo },
  { id: 'YES', name: 'YES Bank', code: 'YESB0000001', category: 'Private Sector', logoComponent: YesBankLogo },
  { id: 'BOI', name: 'Bank of India', code: 'BKID0000001', category: 'Public Sector', logoComponent: GenericBankLogo },
  { id: 'CENTRAL', name: 'Central Bank of India', code: 'CBIN0000001', category: 'Public Sector', logoComponent: GenericBankLogo },
  { id: 'INDIAN', name: 'Indian Bank', code: 'IDIB0000001', category: 'Public Sector', logoComponent: GenericBankLogo },
  { id: 'IOB', name: 'Indian Overseas Bank', code: 'IOBA0000001', category: 'Public Sector', logoComponent: GenericBankLogo },
  { id: 'PSB', name: 'Punjab & Sind Bank', code: 'PSIB0000001', category: 'Public Sector', logoComponent: GenericBankLogo },
  { id: 'UCO', name: 'UCO Bank', code: 'UCBA0000001', category: 'Public Sector', logoComponent: GenericBankLogo },
  { id: 'BOM', name: 'Bank of Maharashtra', code: 'MAHB0000001', category: 'Public Sector', logoComponent: GenericBankLogo },
  { id: 'BANDHAN', name: 'Bandhan Bank', code: 'BDBL0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'CSB', name: 'CSB Bank', code: 'CSBK0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'CUB', name: 'City Union Bank', code: 'CIUB0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'DCB', name: 'DCB Bank', code: 'DCBL0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'DHANLAXMI', name: 'Dhanlaxmi Bank', code: 'DLXB0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'KVB', name: 'Karur Vysya Bank', code: 'KVBL0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'JKB', name: 'Jammu & Kashmir Bank', code: 'JAKA0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'KARNATAKA', name: 'Karnataka Bank', code: 'KARB0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'RBL', name: 'RBL Bank', code: 'RATN0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'SIB', name: 'South Indian Bank', code: 'SIBL0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'TMB', name: 'Tamilnad Mercantile Bank', code: 'TMBL0000001', category: 'Private Sector', logoComponent: GenericBankLogo },
  { id: 'AUSFB', name: 'AU Small Finance Bank', code: 'AUBL0000001', category: 'Small Finance', logoComponent: GenericBankLogo },
  { id: 'EQUITAS', name: 'Equitas Small Finance Bank', code: 'ESFB0000001', category: 'Small Finance', logoComponent: GenericBankLogo },
  { id: 'UJJIVAN', name: 'Ujjivan Small Finance Bank', code: 'UJVN0000001', category: 'Small Finance', logoComponent: GenericBankLogo },
  { id: 'DBS', name: 'DBS Bank India', code: 'DBSS0000001', category: 'Foreign Bank', logoComponent: GenericBankLogo },
  { id: 'HSBC', name: 'HSBC India', code: 'HSBC0000001', category: 'Foreign Bank', logoComponent: GenericBankLogo },
  { id: 'SCB', name: 'Standard Chartered Bank', code: 'SCBL0000001', category: 'Foreign Bank', logoComponent: GenericBankLogo },
  { id: 'DEUTSCHE', name: 'Deutsche Bank India', code: 'DEUT0000001', category: 'Foreign Bank', logoComponent: GenericBankLogo }
];

// ==========================================
// STEP CONFIG
// ==========================================
const STEPS = [
  { id: 1, label: 'Review Fees',      icon: FileText    },
  { id: 2, label: 'Payment Method',   icon: CreditCard  },
  { id: 3, label: 'Complete Payment', icon: Lock        },
  { id: 4, label: 'Verification',     icon: ShieldCheck },
  { id: 5, label: 'Receipt',          icon: BadgeCheck  },
];

// ==========================================
// HORIZONTAL PROGRESS STEPPER
// ==========================================
function CheckoutStepper({ currentStep }) {
  return (
    <div className="checkout-stepper-container">
      {STEPS.map((step, idx) => {
        const done   = currentStep > step.id;
        const active = currentStep === step.id;
        const Icon   = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div className="stepper-step-item">
              {/* Circle */}
              <div className={`stepper-circle ${done ? 'done' : active ? 'active' : ''}`}>
                {done ? <Check size={18} /> : <Icon size={16} />}
              </div>
              {/* Label */}
              <span className={`stepper-label ${active ? 'active' : done ? 'done' : ''}`}>
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className={`stepper-connector ${currentStep > step.id ? 'active' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ==========================================
// STICKY ORDER SUMMARY SIDEBAR
// ==========================================
function OrderSummary({ payableItems, finalAmountToPay, selectedChild, isCustomMode, setIsCustomMode, customAmount, setCustomAmount, defaultTotal }) {
  return (
    <div className="checkout-order-summary">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
        <Building2 size={17} style={{ color: 'var(--odoo-purple)' }} />
        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>Order Summary</span>
      </div>

      {/* Student Chip */}
      {selectedChild && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px',
          background: 'var(--odoo-purple-light)',
          border: '1px solid rgba(113,75,103,0.2)',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--odoo-purple)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
          }}>
            {selectedChild.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>{selectedChild.name}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--odoo-purple)', fontWeight: 600 }}>{selectedChild.classGrade}</div>
          </div>
        </div>
      )}

      {/* Line Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
        {payableItems.length === 0 ? (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '8px 0' }}>
            Clearing full outstanding balance
          </div>
        ) : (
          payableItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '8px 0', borderBottom: '1px dashed var(--border-color)',
              fontSize: '0.82rem',
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</div>
                {item.lateFee > 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--status-danger-text)' }}>+₹{item.lateFee} late fee</span>
                )}
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-main)', flexShrink: 0 }}>
                ₹{(item.amount + (item.lateFee || 0)).toLocaleString('en-IN')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      <div style={{
        padding: '16px', borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(113,75,103,0.08) 0%, rgba(2,132,199,0.08) 100%)',
        border: '1px solid rgba(113,75,103,0.2)',
      }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700 }}>
          Total Payable
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--odoo-purple)', letterSpacing: '-0.03em', marginTop: '2px' }}>
          ₹{finalAmountToPay.toLocaleString('en-IN')}
        </div>
        <div style={{ marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => setIsCustomMode(!isCustomMode)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue-text)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {isCustomMode ? '← Reset to Full Amount' : 'Pay Partial Amount'}
          </button>
        </div>
        {isCustomMode && (
          <div style={{ marginTop: '8px' }}>
            <input
              type="number"
              className="form-input"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              min="1"
              max={defaultTotal}
              style={{ height: '38px', fontSize: '0.9rem', fontWeight: 700 }}
            />
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-paid-text)', fontWeight: 700 }}>
          <ShieldCheck size={14} />
          <span>RBI & Razorpay Certified Gateway</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={13} />
          <span>256-bit SSL Encrypted</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={13} />
          <span>Zero Platform Fee</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ParentPaymentPage({
  selectedChild,
  selectedFeeItems,
  onCompletePayment,
  onOpenReceipt
}) {
  const navigate = useNavigate();

  const payableItems = selectedFeeItems && selectedFeeItems.length > 0 ? selectedFeeItems : [];
  const defaultTotal = payableItems.reduce((sum, item) => sum + item.amount + (item.lateFee || 0), 0) || 25000;
  const [customAmount, setCustomAmount] = useState(defaultTotal);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const finalAmountToPay = isCustomMode ? Number(customAmount) : defaultTotal;

  // Multi-step checkout state: 1=Review, 2=Method, 3=Pay, 4=Processing/OTP, 5=Receipt
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Payment method state
  const [activeTab, setActiveTab] = useState('upi');
  const [upiSubOption, setUpiSubOption] = useState('qr');
  const [selectedUpiApp, setSelectedUpiApp] = useState('PhonePe');
  const [vpaInput, setVpaInput] = useState('parent@upi');

  const [cardNumber, setCardNumber] = useState('4532 8921 0041 4242');
  const [cardHolder, setCardHolder] = useState(selectedChild?.parentName || 'RAJESH SHARMA');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [saveCard, setSaveCard] = useState(true);

  const [selectedBankId, setSelectedBankId] = useState('HDFC');
  const [showBankSelectorModal, setShowBankSelectorModal] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');

  const filteredBanks = useMemo(() => {
    if (!bankSearchTerm.trim()) return INDIAN_BANKS_LIST;
    return INDIAN_BANKS_LIST.filter(b =>
      b.name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(bankSearchTerm.toLowerCase())
    );
  }, [bankSearchTerm]);

  const currentSelectedBankObj = useMemo(() => {
    return INDIAN_BANKS_LIST.find(b => b.id === selectedBankId) || INDIAN_BANKS_LIST[0];
  }, [selectedBankId]);

  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Gateway step: 'idle' | 'processing' | 'otp_modal' | 'success' | 'failed'
  const [gwStep, setGwStep] = useState('idle');
  const [processingMsg, setProcessingMsg] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [createdTxn, setCreatedTxn] = useState(null);

  const [qrTimer, setQrTimer] = useState(299);
  useEffect(() => {
    if (activeTab === 'upi' && upiSubOption === 'qr' && qrTimer > 0) {
      const timer = setInterval(() => setQrTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, upiSubOption, qrTimer]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return { name: 'VISA', color: '#1A1F71', bg: '#E8EFFE' };
    if (clean.startsWith('5') || clean.startsWith('2')) return { name: 'Mastercard', color: '#EB001B', bg: '#FDE8E8' };
    if (clean.startsWith('6')) return { name: 'RuPay', color: '#00704A', bg: '#E6F4EA' };
    if (clean.startsWith('3')) return { name: 'Amex', color: '#006FCF', bg: '#E5F1FB' };
    return { name: 'CARD', color: '#475569', bg: '#F1F5F9' };
  };
  const cardBrand = getCardBrand(cardNumber);

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
    setCardExpiry(val);
  };

  const handleInitiatePayment = (e) => {
    e && e.preventDefault();
    if (finalAmountToPay <= 0) return;
    if (activeTab === 'card') {
      setGwStep('otp_modal');
      setOtpInput('');
      setOtpError('');
      setCheckoutStep(4);
      return;
    }
    startGatewayProcessing();
  };

  const startGatewayProcessing = () => {
    setCheckoutStep(4);
    setGwStep('processing');
    setProcessingMsg(`Initiating ${activeTab.toUpperCase()} transaction via Razorpay Rail...`);
    setTimeout(() => setProcessingMsg('Verifying mandate with Core Bank PSP & NPCI...'), 1200);
    setTimeout(() => setProcessingMsg('Awaiting real-time settlement response...'), 2400);
    setTimeout(() => {
      if (simulateFailure) {
        setGwStep('failed');
      } else {
        completeSuccessfulPayment();
      }
    }, 3600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length < 4) {
      setOtpError('Please enter a valid 6-digit Bank OTP');
      return;
    }
    setGwStep('processing');
    setProcessingMsg('Verifying 3D-Secure Bank OTP Authentication...');
    setTimeout(() => {
      if (simulateFailure) {
        setGwStep('failed');
      } else {
        completeSuccessfulPayment();
      }
    }, 2200);
  };

  const completeSuccessfulPayment = () => {
    const newReceiptNo = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUtr = `UTR99${Math.floor(10000000 + Math.random() * 90000000)}`;
    const paymentId = `pay_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    let methodLabel = 'UPI';
    if (activeTab === 'card') methodLabel = `Credit Card (${cardBrand.name} **${cardNumber.slice(-4)})`;
    if (activeTab === 'netbanking') methodLabel = `Net Banking (${currentSelectedBankObj.name})`;
    if (activeTab === 'wallet') methodLabel = `Wallet (${selectedWallet})`;

    const newTxnObj = {
      id: `TXN-${Math.floor(8900 + Math.random() * 1000)}`,
      dateTime: now,
      studentId: selectedChild?.id || '',
      studentName: selectedChild?.name || 'Student Account',
      classGrade: selectedChild?.classGrade || selectedChild?.grade || 'Grade Level',
      parentName: selectedChild?.parentName || 'Parent Account',
      phone: selectedChild?.phone || '+91 98765 43210',
      email: selectedChild?.email || 'parent@finlyt.edu',
      feeType: payableItems.length === 1 ? payableItems[0].title : `Bulk School Dues (${payableItems.length} items)`,
      amount: finalAmountToPay,
      paymentMethod: methodLabel,
      status: 'Paid',
      processedBy: 'Razorpay Gateway Webhook',
      receiptNo: newReceiptNo,
      reconciled: true,
      utrNo: newUtr,
      paymentId: paymentId,
      payerVPA: activeTab === 'upi' ? (upiSubOption === 'vpa' ? vpaInput : `${selectedChild?.name?.toLowerCase().replace(' ', '')}@upi`) : 'N/A',
      gateway: `Razorpay Standard (${activeTab.toUpperCase()})`,
      items: payableItems.length > 0 ? payableItems.map(i => ({ name: i.title, amount: i.amount + (i.lateFee || 0) })) : [{ name: 'School Fee Settlement', amount: finalAmountToPay }],
      history: [
        { timestamp: now, status: 'Pending', note: 'Payment Gateway Authorization Initiated' },
        { timestamp: now, status: 'Paid', note: `Settlement Confirmed (${newUtr})` }
      ]
    };

    setCreatedTxn(newTxnObj);
    if (onCompletePayment) {
      onCompletePayment(newTxnObj, payableItems.map(i => i.id));
    }
    setGwStep('success');
    setCheckoutStep(5);
  };

  // Shared layout wrapper for steps 1–3
  const sharedSummaryProps = { payableItems, finalAmountToPay, selectedChild, isCustomMode, setIsCustomMode, customAmount, setCustomAmount, defaultTotal };

  return (
    <div className="parent-payment-page fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Back button row */}
      {/* Back button row */}
      <div className="checkout-header-row">
        <button
          type="button"
          className="icon-btn-ghost"
          onClick={() => checkoutStep > 1 && checkoutStep < 4 ? setCheckoutStep(s => s - 1) : navigate('/parent/fees')}
          style={{ border: '1px solid var(--border-color)', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', padding: '9px', flexShrink: 0 }}
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="checkout-title">
            Secure Fee Checkout
            <span className="checkout-badge">
              Razorpay · NPCI Certified
            </span>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
            Student: <strong style={{ color: 'var(--odoo-purple)' }}>{selectedChild?.name}</strong> &nbsp;·&nbsp; {selectedChild?.classGrade}
          </p>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <CheckoutStepper currentStep={checkoutStep} />

      {/* ===== STEP 1: REVIEW FEES ===== */}
      {checkoutStep === 1 && (
        <div className="checkout-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ color: 'var(--odoo-purple)' }} />
                Review Your Fee Items
              </h2>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Confirm the fee items below before proceeding to payment.
              </p>

              {payableItems.length === 0 ? (
                <div style={{ padding: '24px', background: 'var(--bg-canvas)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Clearing full outstanding balance for <strong>{selectedChild?.name}</strong>.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {payableItems.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 20px', background: 'var(--bg-canvas)',
                      borderRadius: '12px', border: '1px solid var(--border-color)',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Due: {item.dueDate}
                          {item.lateFee > 0 && <span style={{ color: 'var(--status-danger-text)', marginLeft: '8px' }}>+₹{item.lateFee} late penalty</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                          ₹{(item.amount + (item.lateFee || 0)).toLocaleString('en-IN')}
                        </div>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px',
                          background: item.status === 'Overdue' ? 'var(--status-danger-bg)' : 'var(--status-pending-bg)',
                          color: item.status === 'Overdue' ? 'var(--status-danger-text)' : 'var(--status-pending-text)',
                        }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Test mode toggle */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <input type="checkbox" id="sim-failure" checked={simulateFailure} onChange={(e) => setSimulateFailure(e.target.checked)} />
                <label htmlFor="sim-failure" style={{ cursor: 'pointer' }}>Simulate Gateway Failure (Test Error Recovery)</label>
              </div>
            </div>

            <button
              type="button"
              className="btn-submit-primary"
              onClick={() => setCheckoutStep(2)}
              style={{ height: '54px', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <span>Continue to Payment Method</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <OrderSummary {...sharedSummaryProps} />
        </div>
      )}

      {/* ===== STEP 2: CHOOSE PAYMENT METHOD ===== */}
      {checkoutStep === 2 && (
        <div className="checkout-grid">
          <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} style={{ color: 'var(--odoo-purple)' }} />
                  Choose Payment Method
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Select how you'd like to pay ₹{finalAmountToPay.toLocaleString('en-IN')}</p>
              </div>

              {/* Method Tabs */}
              <div className="checkout-method-tabs">
                {[
                  { id: 'upi',        label: 'UPI',          Icon: QrCode     },
                  { id: 'card',       label: 'Cards',        Icon: CreditCard  },
                  { id: 'netbanking', label: 'Net Banking',  Icon: Landmark    },
                  { id: 'wallet',     label: 'Wallets / EMI',Icon: Wallet      },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      padding: '12px 4px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                      fontSize: '0.76rem', fontWeight: activeTab === id ? 800 : 600,
                      background: activeTab === id ? 'var(--surface-card)' : 'transparent',
                      color: activeTab === id ? 'var(--odoo-purple)' : 'var(--text-secondary)',
                      boxShadow: activeTab === id ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={19} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* ---- UPI PANEL ---- */}
              {activeTab === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in">
                  <div className="checkout-upi-suboptions">
                    {[
                      { key: 'qr',   label: 'Scan QR Code' },
                      { key: 'apps', label: 'UPI Apps'      },
                      { key: 'vpa',  label: 'UPI ID / VPA'  },
                    ].map(({ key, label }) => (
                      <button key={key} type="button" onClick={() => setUpiSubOption(key)} style={{
                        flex: 1, padding: '9px 6px', borderRadius: '9px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
                        border: upiSubOption === key ? '1.5px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                        background: upiSubOption === key ? 'var(--odoo-purple-light)' : 'var(--surface-card)',
                        color: upiSubOption === key ? 'var(--odoo-purple)' : 'var(--text-main)',
                        transition: 'all 0.15s ease',
                      }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {upiSubOption === 'qr' && (
                    <div style={{ padding: '24px', background: 'var(--bg-canvas)', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-blue-text)', fontWeight: 700 }}>
                        <Clock size={14} />
                        <span>QR expires in {formatTimer(qrTimer)}</span>
                      </div>
                      <div style={{ padding: '16px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '2px solid var(--odoo-purple)' }}>
                        <QrCode size={150} style={{ color: '#0F172A' }} />
                        <div style={{ marginTop: '8px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--odoo-purple)' }}>
                          PAY ₹{finalAmountToPay.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Scan with <strong>Google Pay, PhonePe, Paytm, BHIM</strong>, or any UPI app.
                      </p>
                      <button type="button" className="action-btn-secondary" onClick={() => startGatewayProcessing()} style={{ fontSize: '0.82rem', height: '38px', width: '100%', justifyContent: 'center' }}>
                        <Zap size={14} style={{ color: 'var(--odoo-purple)' }} />
                        <span>Simulate Instant QR Scan</span>
                      </button>
                    </div>
                  )}

                  {upiSubOption === 'apps' && (
                    <div className="checkout-upi-apps">
                      {[
                        { name: 'PhonePe',   icon: <PhonePeIcon />, desc: 'Direct Intent'  },
                        { name: 'Google Pay',icon: <GPayIcon />,    desc: 'GPay PSP'        },
                        { name: 'Paytm UPI', icon: <PaytmIcon />,   desc: 'Instant UPI'    },
                        { name: 'BHIM UPI',  icon: <BhimIcon />,    desc: 'NPCI Official'  },
                        { name: 'CRED UPI',  icon: <CredIcon />,    desc: 'Cred Pay'       },
                      ].map((app) => (
                        <div key={app.name} onClick={() => setSelectedUpiApp(app.name)} style={{
                          padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                          border: selectedUpiApp === app.name ? '2px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                          background: selectedUpiApp === app.name ? 'var(--odoo-purple-light)' : 'var(--surface-card)',
                          display: 'flex', alignItems: 'center', gap: '12px',
                          transition: 'all 0.15s ease',
                        }}>
                          {app.icon}
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{app.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{app.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {upiSubOption === 'vpa' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Virtual Payment Address (UPI ID)</label>
                      <div style={{ position: 'relative' }}>
                        <input type="text" className="form-input" value={vpaInput} onChange={(e) => setVpaInput(e.target.value)}
                          placeholder="e.g. 9876543210@upi or parent@okicici"
                          style={{ height: '46px', paddingRight: '40px', fontSize: '0.9rem', fontWeight: 600 }}
                        />
                        <Check size={18} style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--status-paid-text)' }} />
                      </div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>A payment collect mandate will be pushed to your UPI app.</span>
                    </div>
                  )}
                </div>
              )}

              {/* ---- CARD PANEL ---- */}
              {activeTab === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="fade-in">
                  {/* Card Preview */}
                  <div className="checkout-card-preview">
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', letterSpacing: '0.08em', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>School Fee Platinum</span>
                      <span style={{ padding: '4px 10px', background: cardBrand.bg, color: cardBrand.color, borderRadius: '6px', fontWeight: 900, fontSize: '0.75rem' }}>{cardBrand.name}</span>
                    </div>
                    <div className="checkout-card-number">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase' }}>CARDHOLDER</div>
                        <div style={{ fontWeight: 800 }}>{cardHolder.toUpperCase() || 'PARENT NAME'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase' }}>EXPIRES</div>
                        <div style={{ fontWeight: 800, fontFamily: 'monospace' }}>{cardExpiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Card Number</label>
                      <input type="text" className="form-input" value={cardNumber} onChange={handleCardNumberChange}
                        placeholder="4532 8921 0041 4242" maxLength={19}
                        style={{ height: '44px', fontSize: '0.92rem', fontWeight: 700, fontFamily: 'monospace', marginTop: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Cardholder Name</label>
                      <input type="text" className="form-input" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Full Name as on Card" style={{ height: '44px', fontSize: '0.88rem', fontWeight: 600, marginTop: '6px' }}
                      />
                    </div>
                    <div className="checkout-card-expiry-row">
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Expiry (MM/YY)</label>
                        <input type="text" className="form-input" value={cardExpiry} onChange={handleExpiryChange}
                          placeholder="12/28" maxLength={5} style={{ height: '44px', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', marginTop: '6px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>CVV / CVC</label>
                        <input type="password" className="form-input" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                          placeholder="•••" maxLength={4} style={{ height: '44px', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', marginTop: '6px' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <input type="checkbox" id="save-card-chk" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />
                      <label htmlFor="save-card-chk" style={{ cursor: 'pointer' }}>Save card securely for future installments (Tokenized)</label>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- NET BANKING PANEL ---- */}
              {activeTab === 'netbanking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in">
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Select Popular Indian Bank</label>
                  <div className="checkout-popular-banks">
                    {INDIAN_BANKS_LIST.slice(0, 6).map((bank) => {
                      const Logo = bank.logoComponent;
                      const isSelected = selectedBankId === bank.id;
                      return (
                        <div key={bank.id} onClick={() => setSelectedBankId(bank.id)} style={{
                          padding: '14px 10px', borderRadius: '12px', cursor: 'pointer',
                          border: isSelected ? '2px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--odoo-purple-light)' : 'var(--surface-card)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                          textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)',
                          transition: 'all 0.15s ease',
                        }}>
                          <Logo size={28} />
                          <span>{bank.name.split(' ')[0]} Bank</span>
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => setShowBankSelectorModal(true)} style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid var(--border-color)', background: 'var(--surface-card)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {React.createElement(currentSelectedBankObj.logoComponent, { size: 24 })}
                      <span>{currentSelectedBankObj.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--odoo-purple)' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, background: 'var(--odoo-purple-light)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>Browse 40+ Banks</span>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                </div>
              )}

              {/* ---- WALLET PANEL ---- */}
              {activeTab === 'wallet' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="fade-in">
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Select Digital Wallet / Fee Installment Plan</label>
                  {[
                    { name: 'Paytm Wallet',        icon: <PaytmIcon size={28} />,     desc: 'Instant balance & cashback settlement' },
                    { name: 'Amazon Pay',           icon: <AmazonPayLogo size={28} />, desc: 'Amazon Pay Balance & ICICI Pay' },
                    { name: 'MobiKwik Wallet',      icon: <MobikwikLogo size={28} />,  desc: 'ZIP Pay Later available' },
                    { name: 'LazyPay 3-Month EMI',  icon: <LazyPayLogo size={28} />,   desc: '0% Interest Student Fee EMI' },
                    { name: 'Simpl Pay Later',      icon: <SimplLogo size={28} />,     desc: 'Pay in 3 easy fee installments' },
                  ].map((w) => (
                    <div key={w.name} onClick={() => setSelectedWallet(w.name)} style={{
                      padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                      border: selectedWallet === w.name ? '2px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                      background: selectedWallet === w.name ? 'var(--odoo-purple-light)' : 'var(--surface-card)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.15s ease',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {w.icon}
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{w.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.desc}</div>
                        </div>
                      </div>
                      {selectedWallet === w.name && <Check size={18} style={{ color: 'var(--odoo-purple)' }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="btn-submit-primary"
              style={{ height: '56px', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <Lock size={18} />
              <span>Pay ₹{finalAmountToPay.toLocaleString('en-IN')} via {activeTab === 'upi' ? 'UPI' : activeTab === 'card' ? 'Card' : activeTab === 'netbanking' ? 'Net Banking' : 'Wallet'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <OrderSummary {...sharedSummaryProps} />
        </div>
      )}

      {/* ===== STEP 3: COMPLETE PAYMENT (Razorpay button) — same as step 2's submit, skipped to step 4 directly ===== */}

      {/* ===== STEP 4: PROCESSING / OTP ===== */}
      {checkoutStep === 4 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '400px', paddingTop: '24px' }}>
          {/* OTP Modal */}
          {gwStep === 'otp_modal' && (
            <div className="checkout-status-card" style={{ maxWidth: '460px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--odoo-purple-light)', color: 'var(--odoo-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={32} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>3D-Secure Bank Verification</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                  An OTP has been sent to your registered mobile ending in <strong>••••9210</strong> for payment of <strong>₹{finalAmountToPay.toLocaleString('en-IN')}</strong>.
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                <input
                  type="text" className="form-input"
                  placeholder="Enter 6-Digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ height: '52px', fontSize: '1.4rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.35em' }}
                  autoFocus
                />
                {otpError && <div style={{ fontSize: '0.78rem', color: 'var(--status-danger-text)' }}>{otpError}</div>}
                <button type="button" className="action-btn-secondary" onClick={() => { setOtpInput('892104'); setOtpError(''); }} style={{ fontSize: '0.8rem', height: '36px', justifyContent: 'center' }}>
                  <Sparkles size={14} />
                  <span>Auto-Fill Test OTP (892104)</span>
                </button>
                <div className="checkout-action-row">
                  <button type="button" className="action-btn-secondary" onClick={() => { setCheckoutStep(2); setGwStep('idle'); }} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button type="submit" className="action-btn-primary" style={{ flex: 2, background: 'var(--odoo-purple)', justifyContent: 'center', height: '44px', fontSize: '0.95rem', fontWeight: 800 }}>Verify & Pay</button>
                </div>
              </form>
            </div>
          )}

          {/* Processing Spinner */}
          {gwStep === 'processing' && (
            <div className="checkout-status-card" style={{ maxWidth: '480px' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={72} style={{ color: 'var(--odoo-purple)' }} />
                <ShieldCheck size={28} style={{ position: 'absolute', color: 'var(--accent-blue-text)' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0' }}>Authenticating Payment...</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>{processingMsg}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)', background: 'var(--bg-canvas)', padding: '10px 18px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)' }}>
                <Lock size={13} />
                <span>Bank-grade encrypted connection. Do not refresh.</span>
              </div>
            </div>
          )}

          {/* Failed State */}
          {gwStep === 'failed' && (
            <div className="checkout-status-card" style={{ maxWidth: '480px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle size={44} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>Payment Gateway Timeout</h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--status-danger-text)', margin: 0 }}>
                  Bank PSP server timed out during authorization. No amount was debited.
                </p>
              </div>
              <div className="checkout-action-row">
                <button type="button" className="btn-submit-primary" onClick={() => { setCheckoutStep(2); setGwStep('idle'); }} style={{ flex: 1, height: '46px', justifyContent: 'center' }}>
                  <RefreshCw size={16} />
                  <span>Try Again</span>
                </button>
                <button type="button" className="action-btn-secondary" onClick={() => navigate('/parent/overview')} style={{ flex: 1, justifyContent: 'center', height: '46px' }}>
                  <Home size={16} />
                  <span>Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== STEP 5: RECEIPT ===== */}
      {checkoutStep === 5 && createdTxn && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
          <div className="checkout-receipt-card">
            {/* Success Icon */}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 12px rgba(220,252,231,0.4)' }}>
              <CheckCircle2 size={48} />
            </div>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', background: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '10px' }}>
                <Sparkles size={14} />
                <span>PAYMENT SETTLED & VERIFIED</span>
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>
                ₹{createdTxn.amount.toLocaleString('en-IN')}
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Receipt #{createdTxn.receiptNo} &nbsp;·&nbsp; Ref: {createdTxn.paymentId}
              </p>
            </div>

            {/* Details table */}
            <div style={{ width: '100%', padding: '18px 22px', background: 'var(--bg-canvas)', borderRadius: '14px', border: '1px solid var(--border-color)', textAlign: 'left', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Student',          value: `${createdTxn.studentName} (${createdTxn.classGrade})`, mono: false },
                { label: 'Fee Description',  value: createdTxn.feeType,           mono: false },
                { label: 'Payment Channel',  value: createdTxn.paymentMethod,     mono: false, purple: true },
                { label: 'Settlement UTR',   value: createdTxn.utrNo,             mono: true  },
                { label: 'Date & Time',      value: createdTxn.dateTime,          mono: false },
              ].map(({ label, value, mono, purple }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}:</span>
                  <strong style={{ color: purple ? 'var(--odoo-purple)' : 'var(--text-main)', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right', maxWidth: '60%' }}>{value}</strong>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <button
                type="button"
                className="btn-submit-primary"
                onClick={() => { downloadReceiptPDF(createdTxn, selectedChild); onOpenReceipt && onOpenReceipt(createdTxn); }}
                style={{ height: '52px', fontSize: '0.98rem', fontWeight: 800, justifyContent: 'center', gap: '10px' }}
              >
                <Download size={18} />
                <span>Download Official PDF Receipt</span>
              </button>
              <div className="checkout-action-row">
                <button type="button" className="action-btn-secondary" onClick={() => onOpenReceipt && onOpenReceipt(createdTxn)} style={{ flex: 1, justifyContent: 'center', height: '42px' }}>
                  <Eye size={16} />
                  <span>Preview Receipt</span>
                </button>
                <button type="button" className="action-btn-secondary" onClick={() => navigate('/parent/overview')} style={{ flex: 1, justifyContent: 'center', height: '42px' }}>
                  <Home size={16} />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== BANK SELECTOR MODAL ===== */}
      {showBankSelectorModal && (
        <div className="modal-backdrop fade-in" style={{ zIndex: 99999 }} onClick={() => setShowBankSelectorModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '24px', borderRadius: '16px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Landmark size={22} style={{ color: 'var(--odoo-purple)' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Select Net Banking Partner</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supported across 42 Indian Commercial & Scheduled Banks</div>
                </div>
              </div>
              <button type="button" onClick={() => setShowBankSelectorModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input type="text" className="form-input" placeholder="Search by bank name or IFSC prefix..." value={bankSearchTerm} onChange={(e) => setBankSearchTerm(e.target.value)} style={{ height: '44px', paddingLeft: '38px', fontSize: '0.88rem' }} autoFocus />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
            <div className="checkout-bank-modal-grid">
              {filteredBanks.length === 0 ? (
                <div style={{ gridColumn: 'span 2', padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No matching bank found for "{bankSearchTerm}".
                </div>
              ) : filteredBanks.map((bank) => {
                const Logo = bank.logoComponent;
                const isSelected = selectedBankId === bank.id;
                return (
                  <div key={bank.id} onClick={() => { setSelectedBankId(bank.id); setShowBankSelectorModal(false); }}
                    className="hover-card-row"
                    style={{
                      padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      border: isSelected ? '2px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--odoo-purple-light)' : 'var(--bg-canvas)',
                      transition: 'all 0.15s ease',
                    }}>
                    <Logo size={30} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bank.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bank.category} · {bank.id}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== RAZORPAY MODAL ===== */}
      {showRazorpayModal && (
        <div className="modal-backdrop fade-in" style={{ zIndex: 99999 }}>
          <div className="modal-card" style={{ maxWidth: '420px', padding: '0', overflow: 'hidden', borderRadius: '16px', border: '1px solid #1E293B', background: '#0F172A', color: 'white' }}>
            <div style={{ background: '#1E293B', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0284C7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>R</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'white' }}>Razorpay Checkout</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Finlyt International School</div>
                </div>
              </div>
              <button type="button" onClick={() => setShowRazorpayModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px', background: '#0F172A', textAlign: 'center', borderBottom: '1px solid #1E293B' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AMOUNT TO PAY</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38BDF8', margin: '4px 0 0 0' }}>₹{finalAmountToPay.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>SELECT PAYMENT METHOD</div>
              {[
                { label: 'UPI (Google Pay, PhonePe, QR)', tab: 'upi',        icon: <QrCode size={18} style={{ color: '#38BDF8' }} />,    action: () => { setShowRazorpayModal(false); setActiveTab('upi'); startGatewayProcessing(); } },
                { label: 'Card (Credit / Debit)',          tab: 'card',       icon: <CreditCard size={18} style={{ color: '#818CF8' }} />, action: () => { setShowRazorpayModal(false); setActiveTab('card'); setGwStep('otp_modal'); setCheckoutStep(4); } },
                { label: 'Net Banking (HDFC, ICICI, SBI)',tab: 'netbanking', icon: <Landmark size={18} style={{ color: '#34D399' }} />,   action: () => { setShowRazorpayModal(false); setActiveTab('netbanking'); startGatewayProcessing(); } },
              ].map(({ label, icon, action }) => (
                <button key={label} type="button" onClick={action} style={{ padding: '12px 16px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {icon}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{label}</span>
                  </div>
                  <ChevronRight size={16} style={{ color: '#64748B' }} />
                </button>
              ))}
            </div>
            <div style={{ padding: '12px 20px', background: '#1E293B', fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Lock size={12} />
              <span>Secured by Razorpay · 256-bit Encryption</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
