import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Send, 
  Gavel, 
  Check, 
  User, 
  Search, 
  Banknote, 
  Landmark, 
  Building2, 
  Receipt, 
  Upload, 
  X, 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Sparkles,
  File
} from 'lucide-react';
import { INITIAL_STUDENTS } from '../data/mockData';
import LoadingScreen from './LoadingScreen';

export default function QuickActionsModal({ 
  mode, 
  student, 
  students = [], 
  feeTypes = [], 
  onClose, 
  onSubmitPayment, 
  onSendReminder, 
  onBulkPenalty 
}) {
  // Use passed students or fallback to INITIAL_STUDENTS
  const studentsList = useMemo(() => {
    return (Array.isArray(students) && students.length > 0) ? students : INITIAL_STUDENTS;
  }, [students]);

  // Record Payment Wizard States (Steps 1 to 4)
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(student || studentsList[0] || null);
  const [studentSearch, setStudentSearch] = useState('');
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);

  // Step 2 Method Selection
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Cash, Cheque, Bank Transfer, Demand Draft

  // Step 3 Payment Details States
  const [amount, setAmount] = useState(selectedStudent?.balanceDue || 25000);
  const [receivedBy, setReceivedBy] = useState('Admin Cashier');
  const [receiptNo, setReceiptNo] = useState(`RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [paymentDateTime, setPaymentDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [feeType, setFeeType] = useState('Tuition Fee (Q2)');

  // Cheque Fields
  const [chequeNo, setChequeNo] = useState('');
  const [chequeDate, setChequeDate] = useState(new Date().toISOString().slice(0, 10));
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');

  // Bank Transfer Fields
  const [utrNo, setUtrNo] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().slice(0, 10));

  // Demand Draft Fields
  const [ddNo, setDdNo] = useState('');
  const [ddIssueDate, setDdIssueDate] = useState(new Date().toISOString().slice(0, 10));

  const [remarks, setRemarks] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Reminder & Bulk Penalty states for other modes
  const [reminderNote, setReminderNote] = useState('Dear Parent, your school fee balance is due. Please settle via UPI or counter.');
  const [penaltyAmount, setPenaltyAmount] = useState('500');

  // Filter students for autocomplete in Step 1
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return studentsList.slice(0, 6);
    const q = studentSearch.toLowerCase();
    return studentsList.filter(s => 
      s.name?.toLowerCase().includes(q) ||
      s.id?.toLowerCase().includes(q) ||
      (s.admissionNo && s.admissionNo.toLowerCase().includes(q)) ||
      s.classGrade?.toLowerCase().includes(q) ||
      s.parentName?.toLowerCase().includes(q)
    );
  }, [studentSearch, studentsList]);

  const handleSelectStudent = (stu) => {
    setSelectedStudent(stu);
    setAmount(stu.balanceDue > 0 ? stu.balanceDue : 25000);
    setIsSearchingStudent(false);
    setStudentSearch('');
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        dataUrl: e.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const validateStep3 = () => {
    setValidationError('');
    if (!amount || parseFloat(amount) <= 0) {
      setValidationError('Please enter a valid payment amount greater than ₹0.');
      return false;
    }

    if (paymentMethod === 'Cash') {
      if (!uploadedFile) {
        setValidationError('Mandatory Receipt Photo Upload is required for Cash payments.');
        return false;
      }
    } else if (paymentMethod === 'Cheque') {
      if (!chequeNo.trim()) {
        setValidationError('Cheque Number is required.');
        return false;
      }
      if (!bankName.trim()) {
        setValidationError('Bank Name is required.');
        return false;
      }
    } else if (paymentMethod === 'Bank Transfer') {
      if (!utrNo.trim()) {
        setValidationError('UTR / Transaction Reference Number is required.');
        return false;
      }
      if (!bankName.trim()) {
        setValidationError('Bank Name is required.');
        return false;
      }
    } else if (paymentMethod === 'Demand Draft') {
      if (!ddNo.trim()) {
        setValidationError('Demand Draft (DD) Number is required.');
        return false;
      }
      if (!bankName.trim()) {
        setValidationError('Issuing Bank Name is required.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedStudent) {
        setValidationError('Please select a student to proceed.');
        return;
      }
      setValidationError('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (validateStep3()) {
        setStep(4);
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = (e) => {
    e && e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === 'recordPayment') {
        let refNo = receiptNo;
        if (paymentMethod === 'Cheque') refNo = chequeNo;
        if (paymentMethod === 'Bank Transfer') refNo = utrNo;
        if (paymentMethod === 'Demand Draft') refNo = ddNo;

        onSubmitPayment({
          studentId: selectedStudent?.id || 'STU-101',
          studentName: selectedStudent?.name || 'Aarav Sharma',
          classGrade: selectedStudent?.classGrade || 'Grade 10-A',
          amount: parseFloat(amount),
          paymentMethod: paymentMethod,
          feeType: feeType || 'Tuition Fee (Q2)',
          chequeNo: paymentMethod === 'Cheque' ? chequeNo : null,
          utrNo: paymentMethod === 'Bank Transfer' ? utrNo : null,
          ddNo: paymentMethod === 'Demand Draft' ? ddNo : null,
          bankName: bankName || null,
          branchName: branchName || null,
          receiptNo: receiptNo,
          receivedBy: receivedBy,
          paymentDateTime: paymentDateTime,
          remarks: remarks || null,
          fileName: uploadedFile ? uploadedFile.name : null
        });
      } else if (mode === 'reminder') {
        onSendReminder(student, reminderNote);
      } else if (mode === 'bulkPenalty') {
        onBulkPenalty(penaltyAmount);
      }
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  if (isSubmitting) {
    return (
      <div className="wizard-overlay fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingScreen 
          fullScreen={false} 
          message="Recording Payment & Generating Official Receipt..." 
          subtext="Broadcasting real-time WebSocket updates to parent ledger" 
        />
      </div>
    );
  }

  // RENDER 4-STEP WIZARD FOR RECORD PAYMENT
  if (mode === 'recordPayment') {
    return (
      <div className="wizard-overlay fade-in" onClick={onClose}>
        <div className="wizard-modal-card" onClick={(e) => e.stopPropagation()}>
          
          {/* MODAL HEADER */}
          <div className="wizard-modal-header">
            <h3>
              <Receipt size={22} style={{ color: 'var(--odoo-purple)' }} />
              Record Counter Cash/Cheque Payment
            </h3>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          {/* TOP STEPPER (1. Select Student -> 2. Payment Method -> 3. Payment Details -> 4. Review & Record) */}
          <div className="wizard-stepper-header">
            <div 
              className={`wizard-step-node ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}
              onClick={() => step > 1 && setStep(1)}
            >
              <div className="wizard-step-badge">
                {step > 1 ? <Check size={15} /> : '1'}
              </div>
              <span>1. Select Student</span>
            </div>

            <div className={`wizard-stepper-line ${step > 1 ? 'completed' : ''}`} />

            <div 
              className={`wizard-step-node ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}
              onClick={() => step > 2 && setStep(2)}
            >
              <div className="wizard-step-badge">
                {step > 2 ? <Check size={15} /> : '2'}
              </div>
              <span>2. Payment Method</span>
            </div>

            <div className={`wizard-stepper-line ${step > 2 ? 'completed' : ''}`} />

            <div 
              className={`wizard-step-node ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}
              onClick={() => step > 3 && setStep(3)}
            >
              <div className="wizard-step-badge">
                {step > 3 ? <Check size={15} /> : '3'}
              </div>
              <span>3. Payment Details</span>
            </div>

            <div className={`wizard-stepper-line ${step > 3 ? 'completed' : ''}`} />

            <div className={`wizard-step-node ${step === 4 ? 'active' : ''}`}>
              <div className="wizard-step-badge">4</div>
              <span>4. Review & Record</span>
            </div>
          </div>

          {/* MODAL BODY */}
          <div className="wizard-modal-body">
            
            {validationError && (
              <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '12px', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{validationError}</span>
              </div>
            )}

            {/* ===== STEP 1: SELECT STUDENT ===== */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Search & Select Student</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Search by Student Name, Admission Number, Student ID, or Class Grade.</p>
                </div>

                {/* Search Bar & Autocomplete */}
                <div className="student-search-container">
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Type Student Name, Admission No (e.g. STU-101), or Class..."
                      value={studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        setIsSearchingStudent(true);
                      }}
                      onFocus={() => setIsSearchingStudent(true)}
                      style={{ height: '48px', paddingLeft: '42px', fontSize: '0.92rem' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {isSearchingStudent && (
                    <div className="student-dropdown-results">
                      {filteredStudents.length === 0 ? (
                        <div style={{ padding: '16px', fontSize: '0.84rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                          No students matching "{studentSearch}"
                        </div>
                      ) : (
                        filteredStudents.map((s) => (
                          <div 
                            key={s.id}
                            className="student-result-item"
                            onClick={() => handleSelectStudent(s)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--odoo-purple-light)', color: 'var(--odoo-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                {s.name?.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{s.name}</div>
                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                  ID: {s.id} &nbsp;·&nbsp; {s.classGrade} &nbsp;·&nbsp; Parent: {s.parentName}
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Due Balance</div>
                              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: s.balanceDue > 0 ? 'var(--status-danger-text)' : 'var(--status-paid-text)' }}>
                                ₹{(s.balanceDue || 0).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Compact Selected Student Summary Card */}
                {selectedStudent && (
                  <div className="student-summary-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: 'var(--shadow-primary)' }}>
                        {selectedStudent.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedStudent.name}</h3>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'var(--odoo-purple-light)', color: 'var(--odoo-purple)', borderRadius: '99px', fontWeight: 700 }}>
                            Academic Year 2025–2026
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span>Admission No: <strong>{selectedStudent.admissionNo || selectedStudent.id}</strong></span>
                          <span>Class: <strong>{selectedStudent.classGrade}</strong></span>
                          <span>Parent: <strong>{selectedStudent.parentName}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div style={{ padding: '8px 14px', borderRadius: '10px', background: selectedStudent.balanceDue > 0 ? '#FEE2E2' : '#DCFCE7', border: `1px solid ${selectedStudent.balanceDue > 0 ? '#FCA5A5' : '#86EFAC'}`, textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: selectedStudent.balanceDue > 0 ? '#991B1B' : '#166534', fontWeight: 700 }}>Outstanding Balance</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: selectedStudent.balanceDue > 0 ? '#991B1B' : '#166534' }}>
                          ₹{(selectedStudent.balanceDue || 0).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="action-btn-secondary" 
                        onClick={() => setIsSearchingStudent(true)}
                        style={{ fontSize: '0.76rem', padding: '4px 10px', height: '28px' }}
                      >
                        Change Student
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== STEP 2: SELECT PAYMENT METHOD ===== */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Select Payment Method</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Choose the payment channel received at the counter.</p>
                </div>

                <div className="payment-methods-grid">
                  {[
                    {
                      id: 'Cash',
                      title: 'Cash Payment',
                      desc: 'Direct counter cash collection with mandatory receipt photo upload.',
                      icon: Banknote,
                      color: '#059669'
                    },
                    {
                      id: 'Cheque',
                      title: 'Cheque Deposit',
                      desc: 'Local or CTS-2010 cheque collection with bank clearance tracking.',
                      icon: Receipt,
                      color: '#D97706'
                    },
                    {
                      id: 'Bank Transfer',
                      title: 'Bank Transfer',
                      desc: 'Direct NEFT / RTGS / IMPS account transfer with UTR reference.',
                      icon: Landmark,
                      color: '#2563EB'
                    },
                    {
                      id: 'Demand Draft',
                      title: 'Demand Draft (DD)',
                      desc: 'Banker Demand Draft collection with issue date & branch details.',
                      icon: Building2,
                      color: '#7C3AED'
                    }
                  ].map((m) => {
                    const IconComp = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <div 
                        key={m.id}
                        className={`payment-method-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(m.id)}
                      >
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isSelected ? 'var(--surface-card)' : 'var(--bg-canvas)', color: isSelected ? 'var(--odoo-purple)' : m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                          <IconComp size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-main)' }}>{m.title}</span>
                            {isSelected && <CheckCircle2 size={18} style={{ color: 'var(--odoo-purple)' }} />}
                          </div>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{m.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== STEP 3: ENTER PAYMENT DETAILS ===== */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Enter {paymentMethod} Details</span>
                    <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '99px', background: 'var(--odoo-purple-light)', color: 'var(--odoo-purple)', fontWeight: 700 }}>
                      Step 3 of 4
                    </span>
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Fill in the required information for {paymentMethod}.</p>
                </div>

                {/* Common top row: Fee Category & Amount */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Fee Head / Category</label>
                    <select className="form-input" value={feeType} onChange={(e) => setFeeType(e.target.value)} style={{ height: '44px' }}>
                      <option value="Tuition Fee (Q2)">Tuition Fee (Q2 2025–26)</option>
                      <option value="Annual Term Fees">Annual Term Fees</option>
                      <option value="Transport & Bus Charge">Transport & Bus Charge</option>
                      <option value="Lab & Sports Levy">Lab & Sports Levy</option>
                      <option value="Full Settlement">Full Outstanding Balance</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Collected Amount (₹) <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 25000"
                      style={{ height: '44px', fontWeight: 800, fontSize: '1rem' }}
                      required
                    />
                  </div>
                </div>

                {/* CASH PAYMENT FIELDS */}
                {paymentMethod === 'Cash' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Received By (Staff Name)</label>
                        <input type="text" className="form-input" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} style={{ height: '44px' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Receipt Number</label>
                        <input type="text" className="form-input" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} style={{ height: '44px', fontFamily: 'monospace', fontWeight: 700 }} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Payment Date & Time</label>
                      <input type="datetime-local" className="form-input" value={paymentDateTime} onChange={(e) => setPaymentDateTime(e.target.value)} style={{ height: '44px' }} />
                    </div>

                    {/* Mandatory Receipt Photo Upload */}
                    <div className="form-group">
                      <label className="form-label">Mandatory Physical Receipt Photo Upload (JPG, PNG, PDF) <span style={{ color: 'red' }}>*</span></label>
                      <div 
                        className={`file-dropzone ${dragActive ? 'dragover' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('cash-receipt-file').click()}
                      >
                        <input 
                          type="file" 
                          id="cash-receipt-file" 
                          accept="image/jpeg,image/png,application/pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                        />
                        <Upload size={28} style={{ color: 'var(--odoo-purple)' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>Drag & Drop physical receipt copy here, or click to browse</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, PDF up to 10MB</div>
                      </div>

                      {uploadedFile && (
                        <div className="file-preview-box">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={20} style={{ color: 'var(--odoo-purple)' }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>{uploadedFile.name}</div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{uploadedFile.size}</div>
                            </div>
                          </div>
                          <button type="button" onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* CHEQUE DEPOSIT FIELDS */}
                {paymentMethod === 'Cheque' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Cheque Number <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" className="form-input" placeholder="e.g. CHQ-991022" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} style={{ height: '44px', fontFamily: 'monospace', fontWeight: 700 }} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cheque Date <span style={{ color: 'red' }}>*</span></label>
                        <input type="date" className="form-input" value={chequeDate} onChange={(e) => setChequeDate(e.target.value)} style={{ height: '44px' }} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Bank Name <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" className="form-input" placeholder="e.g. HDFC Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ height: '44px' }} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Branch Name</label>
                        <input type="text" className="form-input" placeholder="e.g. Connaught Place Branch" value={branchName} onChange={(e) => setBranchName(e.target.value)} style={{ height: '44px' }} />
                      </div>
                    </div>

                    {/* Optional Cheque Photo Upload */}
                    <div className="form-group">
                      <label className="form-label">Optional Cheque Copy Upload (JPG, PNG, PDF)</label>
                      <div className="file-dropzone" onClick={() => document.getElementById('cheque-file').click()}>
                        <input type="file" id="cheque-file" accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                        <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Upload scanned cheque copy (Optional)</div>
                      </div>
                      {uploadedFile && (
                        <div className="file-preview-box">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={18} style={{ color: 'var(--odoo-purple)' }} />
                            <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{uploadedFile.name}</span>
                          </div>
                          <button type="button" onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* BANK TRANSFER FIELDS */}
                {paymentMethod === 'Bank Transfer' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Remitter Bank Name <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" className="form-input" placeholder="e.g. State Bank of India" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ height: '44px' }} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">UTR / Transaction Reference No. <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" className="form-input" placeholder="e.g. UTR-99201488" value={utrNo} onChange={(e) => setUtrNo(e.target.value)} style={{ height: '44px', fontFamily: 'monospace', fontWeight: 700 }} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Transfer Date <span style={{ color: 'red' }}>*</span></label>
                      <input type="date" className="form-input" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} style={{ height: '44px' }} required />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="form-group">
                      <label className="form-label">Payment Screenshot / Advice Upload (JPG, PNG, PDF)</label>
                      <div className="file-dropzone" onClick={() => document.getElementById('utr-file').click()}>
                        <input type="file" id="utr-file" accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                        <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Upload bank payment advice screenshot</div>
                      </div>
                      {uploadedFile && (
                        <div className="file-preview-box">
                          <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{uploadedFile.name}</span>
                          <button type="button" onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* DEMAND DRAFT FIELDS */}
                {paymentMethod === 'Demand Draft' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Demand Draft (DD) Number <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" className="form-input" placeholder="e.g. DD-449102" value={ddNo} onChange={(e) => setDdNo(e.target.value)} style={{ height: '44px', fontFamily: 'monospace', fontWeight: 700 }} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Issuing Bank Name <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" className="form-input" placeholder="e.g. ICICI Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ height: '44px' }} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">DD Issue Date <span style={{ color: 'red' }}>*</span></label>
                      <input type="date" className="form-input" value={ddIssueDate} onChange={(e) => setDdIssueDate(e.target.value)} style={{ height: '44px' }} required />
                    </div>

                    {/* DD Copy Upload */}
                    <div className="form-group">
                      <label className="form-label">DD Scan / Photo Copy Upload (JPG, PNG, PDF)</label>
                      <div className="file-dropzone" onClick={() => document.getElementById('dd-file').click()}>
                        <input type="file" id="dd-file" accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                        <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Upload Demand Draft physical scan</div>
                      </div>
                      {uploadedFile && (
                        <div className="file-preview-box">
                          <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{uploadedFile.name}</span>
                          <button type="button" onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Remarks Field */}
                <div className="form-group">
                  <label className="form-label">Remarks / Accounting Note (Optional)</label>
                  <textarea 
                    className="form-input" 
                    rows={2}
                    placeholder="Enter any internal counter notes..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    style={{ padding: '10px 14px' }}
                  />
                </div>
              </div>
            )}

            {/* ===== STEP 4: REVIEW & RECORD ===== */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Review & Confirm Payment Record</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Verify all details below before writing to permanent ledger records.</p>
                </div>

                {/* Summary Card */}
                <div style={{ padding: '20px', background: 'var(--bg-canvas)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Student Name:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{selectedStudent?.name} ({selectedStudent?.classGrade})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Admission No / ID:</span>
                    <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{selectedStudent?.admissionNo || selectedStudent?.id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                    <span style={{ fontWeight: 800, color: 'var(--odoo-purple)', padding: '2px 10px', background: 'var(--odoo-purple-light)', borderRadius: '99px' }}>{paymentMethod}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                    <strong style={{ fontSize: '1.2rem', color: '#166534', fontWeight: 900 }}>₹{parseFloat(amount || 0).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Reference / Receipt No:</span>
                    <strong style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>
                      {paymentMethod === 'Cheque' ? chequeNo : paymentMethod === 'Bank Transfer' ? utrNo : paymentMethod === 'Demand Draft' ? ddNo : receiptNo}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{paymentDateTime}</strong>
                  </div>

                  {uploadedFile && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Uploaded Document:</span>
                      <span style={{ fontWeight: 700, color: 'var(--odoo-purple)' }}>{uploadedFile.name} ({uploadedFile.size})</span>
                    </div>
                  )}

                  {remarks && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Remarks:</span>
                      <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '65%', textAlign: 'right' }}>"{remarks}"</span>
                    </div>
                  )}
                </div>

                {/* Confirmation Notice Box */}
                <div className="system-impact-notice">
                  <ShieldCheck size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#166534' }} />
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: '2px' }}>Confirmation Notice</div>
                    Recording this payment will automatically update the <strong>Student Ledger, Fee Dashboard, Parent Dashboard, Admin Dashboard, Collection Summary, Reports, and Audit Logs</strong> in real-time.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="wizard-modal-footer">
            <button 
              type="button" 
              className="action-btn-secondary"
              onClick={step > 1 ? () => setStep(step - 1) : onClose}
              style={{ minWidth: '100px' }}
            >
              {step > 1 ? (
                <>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </>
              ) : 'Cancel'}
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {step > 1 && (
                <button type="button" className="action-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button 
                  type="button" 
                  className="btn-submit-primary"
                  onClick={handleNextStep}
                >
                  <span>{step === 1 ? 'Continue to Payment Method' : step === 2 ? 'Enter Details' : 'Review & Record'}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn-submit-primary"
                  onClick={handleFinalSubmit}
                  style={{ background: '#166534', minWidth: '160px', justifyContent: 'center' }}
                >
                  <Check size={18} />
                  <span>Record Payment</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // RENDER SIMPLE MODALS FOR REMINDER & BULK PENALTY (PRESERVED FUNCTIONALITY)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {mode === 'reminder' && `Send Fee Payment Reminder (${student?.studentName || student?.name || 'Defaulter'})`}
            {mode === 'bulkPenalty' && 'Apply Bulk Late Fee Penalty Policy'}
          </h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleFinalSubmit}>
          {mode === 'reminder' && (
            <div className="form-group">
              <label className="form-label">Custom Reminder Message (Email / SMS)</label>
              <textarea 
                className="form-input" 
                rows={4} 
                style={{ height: '100px', padding: '12px' }}
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
              />
            </div>
          )}

          {mode === 'bulkPenalty' && (
            <div className="form-group">
              <label className="form-label">Penalty Amount to Auto-Apply (₹)</label>
              <input 
                type="number" 
                className="form-input" 
                value={penaltyAmount} 
                onChange={(e) => setPenaltyAmount(e.target.value)} 
                required
              />
            </div>
          )}

          <button type="submit" className="btn-submit-primary" style={{ marginTop: '16px' }}>
            <Check size={18} />
            <span>Confirm & Execute Action</span>
          </button>
        </form>
      </div>
    </div>
  );
}
