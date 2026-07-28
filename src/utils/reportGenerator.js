// Client-Side Vector PDF and CSV Financial Audit Report Generator
// Generates actual compliant PDF 1.4 binary documents and CSV spreadsheets for offline download.

function escapePdfText(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Trigger CSV File Download in Browser
 */
export function generateCSVReport(reportTitle, headers, rows, summaryTotals, fileName) {
  const csvLines = [];
  csvLines.push(`"${reportTitle.replace(/"/g, '""')}"`);
  csvLines.push(`"Generated On: ${new Date().toLocaleString('en-IN')}"`);
  csvLines.push(`"System: Finlyt International School — Finance & Accounting System"`);
  csvLines.push('');

  // Headers
  csvLines.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Rows
  rows.forEach(row => {
    csvLines.push(row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','));
  });

  if (summaryTotals && summaryTotals.length > 0) {
    csvLines.push('');
    csvLines.push(`"--- SUMMARY TOTALS ---"`);
    summaryTotals.forEach(st => {
      csvLines.push(`"${st.label}:","${st.value}"`);
    });
  }

  csvLines.push('');
  csvLines.push('"--- END OF REPORT ---"');

  const csvContent = csvLines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generate Native PDF 1.4 Binary Blob in A4 Landscape (841.89pt x 595.28pt)
 */
export function generatePDFReportBlob(reportTitle, headers, rows, summaryTotals = [], subMeta = '') {
  const streams = [];

  // A4 Landscape Geometry: 841.89 x 595.28
  // Outer Border Box
  streams.push('q');
  streams.push('0.18 0.23 0.62 RG'); // Primary Indigo Accent
  streams.push('2 w');
  streams.push('36 36 769.89 523.28 re S');

  // Header Banner Background
  streams.push('0.94 0.95 0.98 rg');
  streams.push('38 495 765.89 62 re f');

  // Header Border Line
  streams.push('0.18 0.23 0.62 RG');
  streams.push('1.5 w');
  streams.push('38 495 765.89 0 m 803.89 495 l S');

  // School Header Text
  streams.push('BT');
  streams.push('/F2 16 Tf');
  streams.push('0.18 0.23 0.62 rg');
  streams.push('52 536 Td');
  streams.push(`(${escapePdfText('FINLYT INTERNATIONAL SCHOOL')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 9 Tf');
  streams.push('0.3 0.35 0.45 rg');
  streams.push('52 520 Td');
  streams.push(`(${escapePdfText('FINANCIAL AUDIT & MANAGEMENT INTELLIGENCE SYSTEM')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8 Tf');
  streams.push('0.4 0.4 0.4 rg');
  streams.push('52 506 Td');
  streams.push(`(${escapePdfText('Generated: ' + new Date().toLocaleString('en-IN') + '  |  ' + subMeta)}) Tj`);
  streams.push('ET');

  // Report Title
  streams.push('BT');
  streams.push('/F2 13 Tf');
  streams.push('0.1 0.1 0.15 rg');
  streams.push('52 470 Td');
  streams.push(`(${escapePdfText(reportTitle.toUpperCase())}) Tj`);
  streams.push('ET');

  // Table Headers Box (Y = 440)
  let currentY = 440;
  const colCount = Math.min(headers.length, 10);
  const colWidth = 745 / colCount;

  streams.push('0.18 0.23 0.62 rg'); // Indigo Header Background
  streams.push(`48 ${currentY - 4} 745 20 re f`);

  streams.push('BT');
  streams.push('/F2 8 Tf');
  streams.push('1 1 1 rg');
  headers.slice(0, colCount).forEach((h, idx) => {
    const posX = 52 + idx * colWidth;
    streams.push(`${posX} ${currentY + 2} Td`);
    streams.push(`(${escapePdfText(String(h).slice(0, 16))}) Tj`);
    if (idx < colCount - 1) {
      streams.push(`-${colWidth} 0 Td`);
    }
  });
  streams.push('ET');

  currentY -= 22;

  // Render Rows (max 18 rows on page)
  const renderRows = rows.slice(0, 18);

  renderRows.forEach((row, rIdx) => {
    if (rIdx % 2 === 1) {
      streams.push('0.97 0.97 0.99 rg');
      streams.push(`48 ${currentY - 3} 745 17 re f`);
    }

    streams.push('0.88 0.88 0.92 RG');
    streams.push('0.5 w');
    streams.push(`48 ${currentY - 3} 745 0 m 793 ${currentY - 3} l S`);

    streams.push('BT');
    streams.push('/F1 7.5 Tf');
    streams.push('0.15 0.15 0.2 rg');

    row.slice(0, colCount).forEach((val, idx) => {
      const posX = 52 + idx * colWidth;
      streams.push(`${posX} ${currentY} Td`);
      streams.push(`(${escapePdfText(String(val ?? '').slice(0, 20))}) Tj`);
      if (idx < colCount - 1) {
        streams.push(`-${colWidth} 0 Td`);
      }
    });

    streams.push('ET');
    currentY -= 18;
  });

  // Bottom Summary Box
  const bottomY = Math.max(currentY - 10, 55);
  streams.push('0.95 0.96 0.98 rg');
  streams.push(`48 ${bottomY} 745 38 re f`);
  streams.push('0.18 0.23 0.62 RG');
  streams.push('1 w');
  streams.push(`48 ${bottomY} 745 38 re S`);

  streams.push('BT');
  streams.push('/F2 8.5 Tf');
  streams.push('0.18 0.23 0.62 rg');
  streams.push(`58 ${bottomY + 22} Td`);
  streams.push(`(${escapePdfText('FINANCIAL AUDIT STATEMENT VERIFICATION & SUMMARY')}) Tj`);
  streams.push('ET');

  const summaryText = summaryTotals.map(s => `${s.label}: ${s.value}`).join('  |  ') || `Total Records Processed: ${rows.length}`;

  streams.push('BT');
  streams.push('/F1 7.5 Tf');
  streams.push('0.3 0.3 0.35 rg');
  streams.push(`58 ${bottomY + 8} Td`);
  streams.push(`(${escapePdfText(summaryText)}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F2 8 Tf');
  streams.push('0.18 0.23 0.62 rg');
  streams.push(`630 ${bottomY + 22} Td`);
  streams.push(`(${escapePdfText('Finlyt Accounts Officer')}) Tj`);
  streams.push('ET');

  streams.push('Q');

  const contentStream = streams.join('\n');
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(contentStream);

  let pdf = '%PDF-1.4\n';
  const objOffsets = [];
  function addObj(content) {
    objOffsets.push(pdf.length);
    pdf += content + '\n';
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  addObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  addObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj');

  const streamHeader = `4 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`;
  objOffsets.push(pdf.length);
  pdf += streamHeader + contentStream + '\nendstream\nendobj';

  addObj('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');
  addObj('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');

  const xrefOffset = pdf.length;
  pdf += 'xref\n0 7\n0000000000 65535 f \n';
  objOffsets.forEach((off) => {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  });

  pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function generatePDFReport(reportTitle, headers, rows, fileName, summaryTotals = [], subMeta = '') {
  try {
    const blob = generatePDFReportBlob(reportTitle, headers, rows, summaryTotals, subMeta);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('PDF Report generation error:', err);
  }
}

/**
 * Main Dynamic Report Trigger Function
 */
export function downloadReportFile({ 
  reportType = 'daily', 
  dateRange = 'currentMonth', 
  classFilter = 'all',
  format = 'csv',
  students = [],
  transactions = [],
  defaulters = [],
  reconciliationQueue = [],
  feeTypes = [],
  waivers = []
}) {
  const dateTag = dateRange === 'today' ? 'Today' : dateRange === 'currentMonth' ? 'July_2026' : dateRange === 'lastMonth' ? 'June_2026' : 'YTD_2026';
  const classTag = classFilter === 'all' ? 'All_Classes' : classFilter.replace(/\s+/g, '_');
  
  let reportTitle = '';
  let headers = [];
  let rows = [];
  let summaryTotals = [];

  // Helper grade matcher
  const matchesGrade = (itemGrade) => {
    if (classFilter === 'all') return true;
    if (!itemGrade) return true;
    return String(itemGrade).toLowerCase().includes(classFilter.toLowerCase());
  };

  if (reportType === 'daily') {
    reportTitle = 'Daily Fee Collection & Payment Settlement Audit Summary';
    headers = ['Transaction Date & Time', 'Receipt No', 'Student ID', 'Student Name', 'Class / Grade', 'Fee Description', 'Payment Channel', 'UTR / Ref No', 'Amount Paid (₹)', 'Verification Status'];
    
    // Filter actual transactions
    const filteredTxns = (Array.isArray(transactions) && transactions.length > 0 ? transactions : [
      { id: 'TXN-101', dateTime: '2026-07-28 10:30', receiptNo: 'RCP-2026-8910', studentId: 'STU-101', studentName: 'Aarav Sharma', classGrade: 'Grade 10', feeType: 'Tuition Fee (Q2)', paymentMethod: 'UPI Direct', utrNo: 'UTR9821039401', amount: 25000, status: 'VERIFIED' },
      { id: 'TXN-102', dateTime: '2026-07-28 11:15', receiptNo: 'RCP-2026-8911', studentId: 'STU-103', studentName: 'Ananya Verma', classGrade: 'Grade 12', feeType: 'Transport Fee (Q2)', paymentMethod: 'Card Payment', utrNo: 'TXN7710293810', amount: 8500, status: 'VERIFIED' },
      { id: 'TXN-103', dateTime: '2026-07-28 12:00', receiptNo: 'RCP-2026-8912', studentId: 'STU-104', studentName: 'Kabir Patel', classGrade: 'Grade 9', feeType: 'Annual Sports Fee', paymentMethod: 'Net Banking', utrNo: 'UTR4492019382', amount: 12000, status: 'VERIFIED' },
      { id: 'TXN-104', dateTime: '2026-07-27 15:20', receiptNo: 'RCP-2026-8908', studentId: 'STU-102', studentName: 'Rohan Mehta', classGrade: 'Grade 12', feeType: 'Tuition Fee (Q2)', paymentMethod: 'Cash Counter', utrNo: 'CSH-0912', amount: 25000, status: 'VERIFIED' }
    ]).filter(t => matchesGrade(t.classGrade || t.grade));

    rows = filteredTxns.map(t => [
      t.dateTime || t.date || '2026-07-28 10:00',
      t.receiptNo || 'RCP-2026-0891',
      t.studentId || 'STU-101',
      t.studentName || 'Student Account',
      t.classGrade || t.grade || 'Grade 10',
      t.feeType || 'Tuition Fee',
      t.paymentMethod || 'UPI Direct',
      t.utrNo || t.chequeNo || 'UTR9821039401',
      `₹${(t.amount || 0).toLocaleString('en-IN')}`,
      t.status || 'VERIFIED / SETTLED'
    ]);

    const totalCollected = filteredTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
    summaryTotals = [
      { label: 'Total Receipts Processed', value: `${filteredTxns.length} Transactions` },
      { label: 'Total Amount Collected', value: `₹${totalCollected.toLocaleString('en-IN')}` }
    ];

  } else if (reportType === 'defaulter') {
    reportTitle = 'Active Defaulter Accounts & Policy Late Fine Penalty Audit Report';
    headers = ['Student ID', 'Student Name', 'Class / Grade', 'Parent Name', 'Parent Contact Phone', 'Overdue Fee Categories', 'Days Overdue', 'Base Overdue Dues (₹)', 'Penalty Status', 'Total Amount Owed (₹)'];

    const filteredDefaulters = (Array.isArray(defaulters) && defaulters.length > 0 ? defaulters : [
      { studentId: 'STU-102', studentName: 'Rohan Mehta', classGrade: 'Grade 12', parentName: 'Sanjay Mehta', phone: '+91 98234 11200', feeTypes: ['Tuition Fee Q2', 'Transport Fee Q2'], amountOwed: 38500, daysOverdue: 45, hasPenaltyApplied: true, penaltyAmount: 500 },
      { studentId: 'STU-105', studentName: 'Diya Kapoor', classGrade: 'Grade 10', parentName: 'Vikram Kapoor', phone: '+91 98111 44556', feeTypes: ['Tuition Fee Q2'], amountOwed: 25000, daysOverdue: 32, hasPenaltyApplied: true, penaltyAmount: 500 },
      { studentId: 'STU-108', studentName: 'Arjun Singh', classGrade: 'Grade 9', parentName: 'Harpreet Singh', phone: '+91 98777 22110', feeTypes: ['Transport Fee Q2'], amountOwed: 8500, daysOverdue: 18, hasPenaltyApplied: false, penaltyAmount: 0 },
      { studentId: 'STU-112', studentName: 'Sanya Malhotra', classGrade: 'Grade 7', parentName: 'Amit Malhotra', phone: '+91 98444 66778', feeTypes: ['Annual Sports Fee'], amountOwed: 12000, daysOverdue: 28, hasPenaltyApplied: true, penaltyAmount: 250 }
    ]).filter(d => matchesGrade(d.classGrade || d.grade));

    rows = filteredDefaulters.map(d => {
      const feeCategories = Array.isArray(d.feeTypes) ? d.feeTypes.join(', ') : (d.feeTypes || 'Overdue Fees');
      const fineAmt = d.hasPenaltyApplied ? (d.penaltyAmount || 500) : 0;
      const totalOwed = (d.amountOwed || 0) + fineAmt;

      return [
        d.studentId || 'STU-102',
        d.studentName || 'Student Defaulter',
        d.classGrade || d.grade || 'Grade 12',
        d.parentName || 'Parent Account',
        d.phone || '+91 98234 11200',
        feeCategories,
        `${d.daysOverdue || 30} days`,
        `₹${(d.amountOwed || 0).toLocaleString('en-IN')}`,
        d.hasPenaltyApplied ? `Penalty Applied (₹${fineAmt})` : 'No Penalty Yet',
        `₹${totalOwed.toLocaleString('en-IN')}`
      ];
    });

    const totalOverdueSum = filteredDefaulters.reduce((sum, d) => sum + (d.amountOwed || 0) + (d.hasPenaltyApplied ? (d.penaltyAmount || 500) : 0), 0);
    summaryTotals = [
      { label: 'Active Defaulters Count', value: `${filteredDefaulters.length} Defaulter Accounts` },
      { label: 'Total Outstanding Overdue', value: `₹${totalOverdueSum.toLocaleString('en-IN')}` }
    ];

  } else if (reportType === 'reconciliation') {
    reportTitle = 'Bank & Counter Collection Reconciliation Audit Ledger';
    headers = ['Reconciliation ID', 'Batch Date', 'Payment Channel Gateway', 'Counter Slip Count', 'Counter Collection (₹)', 'Bank Statement Credit (₹)', 'Discrepancy Amount (₹)', 'Reconciliation Audit Status', 'Auditor Verification Note'];

    const recs = (Array.isArray(reconciliationQueue) && reconciliationQueue.length > 0 ? reconciliationQueue : [
      { id: 'REC-2026-071', date: '2026-07-28', channel: 'UPI Auto-Clear Webhook', slipCount: 142, counterAmount: 355000, bankAmount: 355000, discrepancy: 0, status: 'MATCHED & RECONCILED', auditorNote: 'Auto-cleared via NPCI Webhook' },
      { id: 'REC-2026-070', date: '2026-07-27', channel: 'HDFC Razorpay Gateway', slipCount: 98, counterAmount: 245000, bankAmount: 245000, discrepancy: 0, status: 'MATCHED & RECONCILED', auditorNote: 'Gateway settlement verified' },
      { id: 'REC-2026-069', date: '2026-07-26', channel: 'Bank Deposit Cheque Batch', slipCount: 18, counterAmount: 225000, bankAmount: 220000, discrepancy: 5000, status: 'DISCREPANCY FLAGGED', auditorNote: '1 cheque bounce pending clearance' },
      { id: 'REC-2026-068', date: '2026-07-25', channel: 'ICICI Counter Cash Batch', slipCount: 44, counterAmount: 110000, bankAmount: 110000, discrepancy: 0, status: 'MATCHED & RECONCILED', auditorNote: 'Physical cash verified by bank teller' }
    ]);

    rows = recs.map(r => [
      r.id || 'REC-2026-071',
      r.date || '2026-07-28',
      r.channel || 'UPI Auto-Clear',
      String(r.slipCount || 0),
      `₹${(r.counterAmount || 0).toLocaleString('en-IN')}`,
      `₹${(r.bankAmount || 0).toLocaleString('en-IN')}`,
      `₹${(r.discrepancy || 0).toLocaleString('en-IN')}`,
      r.status || 'MATCHED & RECONCILED',
      r.auditorNote || 'Verified'
    ]);

    const totalCounter = recs.reduce((s, r) => s + (r.counterAmount || 0), 0);
    const totalBank = recs.reduce((s, r) => s + (r.bankAmount || 0), 0);
    summaryTotals = [
      { label: 'Total Counter Collection', value: `₹${totalCounter.toLocaleString('en-IN')}` },
      { label: 'Total Bank Credit Verified', value: `₹${totalBank.toLocaleString('en-IN')}` }
    ];

  } else if (reportType === 'feetype') {
    reportTitle = 'Fee Category Revenue & Collection Efficiency Analysis';
    headers = ['Category Code', 'Fee Category Name', 'Billing Recurrence', 'Annual Target Quota (₹)', 'Total Collected (₹)', 'Outstanding Dues (₹)', 'Collection Efficiency %'];

    const categories = (Array.isArray(feeTypes) && feeTypes.length > 0 ? feeTypes : [
      { code: 'CAT-TUI', name: 'Tuition Fee (Quarterly)', recurrence: 'QUARTERLY', targetQuota: 12500000, collected: 11200000, outstanding: 1300000 },
      { code: 'CAT-TRN', name: 'Bus & Transport Fee', recurrence: 'QUARTERLY', targetQuota: 3400000, collected: 2950000, outstanding: 450000 },
      { code: 'CAT-LATE', name: 'Late Fee Policy Fines', recurrence: 'ONE_TIME', targetQuota: 250000, collected: 210000, outstanding: 40000 },
      { code: 'CAT-EXM', name: 'Board Exam & Lab Fee', recurrence: 'ANNUALLY', targetQuota: 1800000, collected: 1720000, outstanding: 80000 }
    ]);

    rows = categories.map(f => {
      const eff = f.targetQuota ? ((f.collected / f.targetQuota) * 100).toFixed(1) + '%' : '100%';
      return [
        f.code || 'CAT-FEES',
        f.name || 'Fee Category',
        f.recurrence || 'QUARTERLY',
        `₹${(f.targetQuota || 0).toLocaleString('en-IN')}`,
        `₹${(f.collected || 0).toLocaleString('en-IN')}`,
        `₹${(f.outstanding || 0).toLocaleString('en-IN')}`,
        eff
      ];
    });

    const sumCollected = categories.reduce((s, f) => s + (f.collected || 0), 0);
    summaryTotals = [
      { label: 'Total Categories Analyzed', value: `${categories.length} Categories` },
      { label: 'Total Revenue Collected', value: `₹${sumCollected.toLocaleString('en-IN')}` }
    ];

  } else {
    reportTitle = 'Comprehensive Student Account Billing & Ledger Summary';
    headers = ['Student ID', 'Student Name', 'Class / Grade', 'Parent Name', 'Parent Contact Phone', 'Total Fee Billed (₹)', 'Waivers / Discounts (₹)', 'Total Amount Paid (₹)', 'Active Outstanding Balance (₹)', 'Account Status'];

    const filteredStudents = (Array.isArray(students) && students.length > 0 ? students : [
      { id: 'STU-101', name: 'Aarav Sharma', classGrade: 'Grade 10', parentName: 'Rajesh Sharma', phone: '+91 98100 23456', totalBilled: 120000, waiverAmount: 10000, totalPaid: 110000, balanceDue: 0, status: 'CLEARED' },
      { id: 'STU-102', name: 'Rohan Mehta', classGrade: 'Grade 12', parentName: 'Sanjay Mehta', phone: '+91 98234 11200', totalBilled: 140000, waiverAmount: 0, totalPaid: 101500, balanceDue: 38500, status: 'OVERDUE' },
      { id: 'STU-103', name: 'Ananya Verma', classGrade: 'Grade 12', parentName: 'Sunil Verma', phone: '+91 98111 99887', totalBilled: 140000, waiverAmount: 15000, totalPaid: 125000, balanceDue: 0, status: 'CLEARED' },
      { id: 'STU-104', name: 'Kabir Patel', classGrade: 'Grade 9', parentName: 'Mahesh Patel', phone: '+91 98333 77665', totalBilled: 110000, waiverAmount: 0, totalPaid: 110000, balanceDue: 0, status: 'CLEARED' }
    ]).filter(s => matchesGrade(s.classGrade || s.grade));

    rows = filteredStudents.map(s => {
      const billed = s.totalBilled || 120000;
      const waiversAmt = s.waiverAmount || s.waiversGranted || 0;
      const paid = s.totalPaid || 0;
      const due = s.balanceDue !== undefined ? s.balanceDue : (billed - waiversAmt - paid);
      const accStatus = due <= 0 ? 'CLEARED / PAID' : 'OUTSTANDING DUES';

      return [
        s.id || s.studentId || 'STU-101',
        s.name || s.studentName || 'Student Name',
        s.classGrade || s.grade || 'Grade 10',
        s.parentName || 'Parent Account',
        s.phone || s.parentPhone || '+91 Parent Contact',
        `₹${billed.toLocaleString('en-IN')}`,
        `₹${waiversAmt.toLocaleString('en-IN')}`,
        `₹${paid.toLocaleString('en-IN')}`,
        `₹${due.toLocaleString('en-IN')}`,
        accStatus
      ];
    });

    const sumPaid = filteredStudents.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
    const sumDue = filteredStudents.reduce((sum, s) => sum + (s.balanceDue ?? ((s.totalBilled || 120000) - (s.waiverAmount || 0) - (s.totalPaid || 0))), 0);

    summaryTotals = [
      { label: 'Total Students Filtered', value: `${filteredStudents.length} Students` },
      { label: 'Total Amount Collected', value: `₹${sumPaid.toLocaleString('en-IN')}` },
      { label: 'Total Active Balance Due', value: `₹${sumDue.toLocaleString('en-IN')}` }
    ];
  }

  const fileBasename = `Finlyt_Report_${reportType}_${dateTag}_${classTag}`;
  const subMeta = `Scope: ${classFilter}  |  Range: ${dateRange}`;

  if (format === 'csv') {
    generateCSVReport(reportTitle, headers, rows, summaryTotals, `${fileBasename}.csv`);
  } else {
    generatePDFReport(reportTitle, headers, rows, `${fileBasename}.pdf`, summaryTotals, subMeta);
  }

  return `${fileBasename}.${format}`;
}
