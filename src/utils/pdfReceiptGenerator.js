// Client-side Vector PDF Generator for Official Fee Receipts
// Generates a fully compliant PDF 1.4 binary file Blob for instant offline download.

function escapePdfText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export function generateReceiptPdfBlob(receipt, student) {
  const receiptNo = receipt?.receiptNo || 'RCP-2026-0891';
  const studentName = receipt?.studentName || student?.name || 'Student Account';
  const classGrade = receipt?.classGrade || student?.classGrade || student?.grade || 'N/A';
  const studentId = receipt?.studentId || student?.id || student?.studentId || 'STU-101';
  const parentName = receipt?.parentName || student?.parentName || 'Parent Account';
  const dateTime = receipt?.dateTime || new Date().toISOString().replace('T', ' ').slice(0, 16);
  const amount = receipt?.amount || 0;
  const paymentMethod = receipt?.paymentMethod || 'UPI';
  const utrNo = receipt?.utrNo || receipt?.chequeNo || 'UTR9821039401';
  const feeType = receipt?.feeType || 'Tuition Fee';
  const items = receipt?.items || [{ name: feeType, amount: amount }];

  const streams = [];

  // Outer Border Box
  streams.push('q');
  streams.push('0.443 0.294 0.404 RG'); // Deep Purple Accent
  streams.push('2 w');
  streams.push('36 36 523.28 769.89 re S');

  // Header Banner Background (#F8F5F8)
  streams.push('0.97 0.96 0.97 rg');
  streams.push('38 725 519.28 78 re f');

  // Header Border Line
  streams.push('0.443 0.294 0.404 RG');
  streams.push('1 w');
  streams.push('38 725 519.28 0 m 557.28 725 l S');

  // School Name Header
  streams.push('BT');
  streams.push('/F2 16 Tf');
  streams.push('0.282 0.180 0.258 rg');
  streams.push('54 772 Td');
  streams.push(`(${escapePdfText('FINLYT INTERNATIONAL SCHOOL')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 9 Tf');
  streams.push('0.35 0.35 0.35 rg');
  streams.push('54 754 Td');
  streams.push(`(${escapePdfText('Affiliated to CBSE Board • School Code: PB-89210 • Official Tax Receipt')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8 Tf');
  streams.push('0.45 0.45 0.45 rg');
  streams.push('54 738 Td');
  streams.push(`(${escapePdfText('Knowledge Park II, Tech City • Support: fees@finlyt.edu')}) Tj`);
  streams.push('ET');

  // "PAID RECEIPT" Badge
  streams.push('0.01 0.52 0.78 rg'); // Accent Blue
  streams.push('410 755 130 24 re f');

  streams.push('BT');
  streams.push('/F2 10 Tf');
  streams.push('1 1 1 rg');
  streams.push('425 762 Td');
  streams.push(`(${escapePdfText('PAID RECEIPT')}) Tj`);
  streams.push('ET');

  // Receipt Number & Date
  streams.push('BT');
  streams.push('/F2 10 Tf');
  streams.push('0.1 0.1 0.1 rg');
  streams.push('410 740 Td');
  streams.push(`(${escapePdfText('#' + receiptNo)}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8 Tf');
  streams.push('0.4 0.4 0.4 rg');
  streams.push('410 728 Td');
  streams.push(`(${escapePdfText('Date: ' + dateTime)}) Tj`);
  streams.push('ET');

  // SECTION 1: Student & Parent Box
  streams.push('0.96 0.97 0.98 rg');
  streams.push('54 625 487.28 85 re f');
  streams.push('0.85 0.88 0.91 RG');
  streams.push('0.75 w');
  streams.push('54 625 487.28 85 re S');

  // Left Column - Student Info
  streams.push('BT');
  streams.push('/F2 8 Tf');
  streams.push('0.4 0.4 0.4 rg');
  streams.push('68 692 Td');
  streams.push(`(${escapePdfText('STUDENT DETAILS')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F2 11 Tf');
  streams.push('0.1 0.15 0.2 rg');
  streams.push('68 676 Td');
  streams.push(`(${escapePdfText(studentName)}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 9 Tf');
  streams.push('0.3 0.3 0.3 rg');
  streams.push('68 660 Td');
  streams.push(`(${escapePdfText('Class / Grade: ' + classGrade)}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8.5 Tf');
  streams.push('0.45 0.45 0.45 rg');
  streams.push('68 646 Td');
  streams.push(`(${escapePdfText('Student ID: ' + studentId)}) Tj`);
  streams.push('ET');

  // Right Column - Parent & Payment Details
  streams.push('BT');
  streams.push('/F2 8 Tf');
  streams.push('0.4 0.4 0.4 rg');
  streams.push('300 692 Td');
  streams.push(`(${escapePdfText('PAYMENT DETAILS')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F2 11 Tf');
  streams.push('0.1 0.15 0.2 rg');
  streams.push('300 676 Td');
  streams.push(`(${escapePdfText(parentName)}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 9 Tf');
  streams.push('0.3 0.3 0.3 rg');
  streams.push('300 660 Td');
  streams.push(`(${escapePdfText('Method: ' + paymentMethod)}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8.5 Tf');
  streams.push('0.45 0.45 0.45 rg');
  streams.push('300 646 Td');
  streams.push(`(${escapePdfText('Ref / UTR: ' + utrNo)}) Tj`);
  streams.push('ET');

  // SECTION 2: Itemized Fee Table Header
  streams.push('0.92 0.94 0.96 rg');
  streams.push('54 580 487.28 22 re f');
  streams.push('0.8 0.83 0.86 RG');
  streams.push('54 580 487.28 22 re S');

  streams.push('BT');
  streams.push('/F2 8.5 Tf');
  streams.push('0.25 0.3 0.35 rg');
  streams.push('68 587 Td');
  streams.push(`(${escapePdfText('#')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F2 8.5 Tf');
  streams.push('0.25 0.3 0.35 rg');
  streams.push('110 587 Td');
  streams.push(`(${escapePdfText('FEE DESCRIPTION')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F2 8.5 Tf');
  streams.push('0.25 0.3 0.35 rg');
  streams.push('440 587 Td');
  streams.push(`(${escapePdfText('AMOUNT (INR)')}) Tj`);
  streams.push('ET');

  // Table Body Rows
  let currentY = 554;
  items.forEach((item, idx) => {
    const itemTitle = item.name || item.title || feeType;
    const itemAmt = Number(item.amount || amount).toLocaleString('en-IN');

    streams.push('0.9 0.92 0.94 RG');
    streams.push(`54 ${currentY - 6} 487.28 0 m 541.28 ${currentY - 6} l S`);

    streams.push('BT');
    streams.push('/F1 9 Tf');
    streams.push('0.4 0.4 0.4 rg');
    streams.push(`68 ${currentY} Td`);
    streams.push(`(${idx + 1}) Tj`);
    streams.push('ET');

    streams.push('BT');
    streams.push('/F2 9.5 Tf');
    streams.push('0.1 0.1 0.15 rg');
    streams.push(`110 ${currentY} Td`);
    streams.push(`(${escapePdfText(itemTitle)}) Tj`);
    streams.push('ET');

    streams.push('BT');
    streams.push('/F2 9.5 Tf');
    streams.push('0.1 0.1 0.15 rg');
    streams.push(`440 ${currentY} Td`);
    streams.push(`(${escapePdfText('Rs. ' + itemAmt)}) Tj`);
    streams.push('ET');

    currentY -= 26;
  });

  // Table Footer Total Row
  streams.push('0.97 0.96 0.97 rg');
  streams.push(`54 ${currentY - 12} 487.28 28 re f`);
  streams.push('0.443 0.294 0.404 RG');
  streams.push('1.5 w');
  streams.push(`54 ${currentY - 12} 487.28 28 re S`);

  streams.push('BT');
  streams.push('/F2 11 Tf');
  streams.push('0.282 0.180 0.258 rg');
  streams.push(`68 ${currentY - 3} Td`);
  streams.push(`(${escapePdfText('TOTAL AMOUNT PAID')}) Tj`);
  streams.push('ET');

  const formattedTotal = Number(amount).toLocaleString('en-IN');
  streams.push('BT');
  streams.push('/F2 12 Tf');
  streams.push('0.443 0.294 0.404 rg');
  streams.push(`440 ${currentY - 3} Td`);
  streams.push(`(${escapePdfText('Rs. ' + formattedTotal)}) Tj`);
  streams.push('ET');

  // SECTION 3: Bottom Footer & Digital Verification
  const bottomY = Math.max(120, currentY - 90);

  streams.push('0.95 0.96 0.98 rg');
  streams.push(`54 ${bottomY} 48 48 re f`);
  streams.push('0.8 0.83 0.86 RG');
  streams.push('1 w');
  streams.push(`54 ${bottomY} 48 48 re S`);

  streams.push('0.4 0.45 0.5 RG');
  streams.push(`60 ${bottomY + 12} 12 12 re s`);
  streams.push(`80 ${bottomY + 12} 12 12 re s`);
  streams.push(`60 ${bottomY + 30} 12 12 re s`);
  streams.push(`78 ${bottomY + 28} 16 16 re f`);

  streams.push('BT');
  streams.push('/F2 9 Tf');
  streams.push('0.1 0.15 0.25 rg');
  streams.push(`114 ${bottomY + 32} Td`);
  streams.push(`(${escapePdfText('Digitally Verified Fee Receipt')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8 Tf');
  streams.push('0.45 0.5 0.55 rg');
  streams.push(`114 ${bottomY + 18} Td`);
  streams.push(`(${escapePdfText('Valid official receipt for CBSE school fee submission & tax records.')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8 Tf');
  streams.push('0.45 0.5 0.55 rg');
  streams.push(`114 ${bottomY + 6} Td`);
  streams.push(`(${escapePdfText('Generated automatically by Finlyt Finance Management System.')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F2 9 Tf');
  streams.push('0.443 0.294 0.404 rg');
  streams.push(`360 ${bottomY + 28} Td`);
  streams.push(`(${escapePdfText('For Finlyt International School')}) Tj`);
  streams.push('ET');

  streams.push('BT');
  streams.push('/F1 8 Tf');
  streams.push('0.4 0.4 0.4 rg');
  streams.push(`360 ${bottomY + 12} Td`);
  streams.push(`(${escapePdfText('Authorized Finance & Accounts Officer')}) Tj`);
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
  addObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj');

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

export function downloadReceiptPDF(receipt, student) {
  try {
    const blob = generateReceiptPdfBlob(receipt, student);
    const receiptNo = receipt?.receiptNo || 'RCP-2026-0891';
    const filename = `Receipt_${receiptNo}.pdf`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('PDF download error:', err);
  }
}
