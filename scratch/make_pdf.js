const fs = require('fs');
const path = require('path');

const pdfHeader = '%PDF-1.4\n';
const pdfBody = `1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 350 >>
stream
BT
/F1 24 Tf
50 780 Td
(Al-Quran Al-Kareem - Hidayah Hub) Tj
0 -40 Td
/F1 16 Tf
(Noble Quran Complete Edition) Tj
0 -30 Td
(Bismillah ir-Rahman ir-Rahim) Tj
0 -30 Td
(Complete 114 Surahs Directory & Recitation) Tj
0 -30 Td
(Hidayah Hub - Your Daily Companion for Faith) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000645 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
718
%%EOF`;

const fullPdf = pdfHeader + pdfBody;
const targetPath = path.join(__dirname, '..', 'public', 'quran-pak.pdf');
fs.writeFileSync(targetPath, fullPdf);
console.log('Successfully created local PDF file at public/quran-pak.pdf');
