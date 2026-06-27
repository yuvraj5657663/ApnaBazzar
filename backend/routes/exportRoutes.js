const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Transaction = require('../models/ExpenseModel');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @route  GET /api/exports/excel
// @desc   Download all transactions as Excel file
// @access Private/Admin
router.get('/excel', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('voId', 'name')
      .populate('shgId', 'name')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Jivika Suite';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 18 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'VO Name', key: 'vo', width: 20 },
      { header: 'SHG Name', key: 'shg', width: 20 },
      { header: 'Title / Description', key: 'title', width: 30 },
      { header: 'Amount (Rs.)', key: 'amount', width: 16 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' }
    };
    headerRow.height = 24;

    transactions.forEach(t => {
      worksheet.addRow({
        date: new Date(t.createdAt).toLocaleDateString('en-IN'),
        type: t.type,
        vo: t.voId ? t.voId.name : 'N/A',
        shg: t.shgId ? t.shgId.name : 'N/A',
        title: t.title,
        amount: t.amount
      });
    });

    // Color income rows green, expense rows red
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const typeCell = row.getCell('type');
      if (typeCell.value === 'INCOME') {
        row.getCell('amount').font = { color: { argb: 'FF16A34A' }, bold: true };
      } else {
        row.getCell('amount').font = { color: { argb: 'FFDC2626' }, bold: true };
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Jivika_Transactions.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/exports/pdf
// @desc   Download all transactions as PDF file
// @access Private/Admin
router.get('/pdf', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('voId', 'name')
      .populate('shgId', 'name')
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Jivika_Transactions.pdf"');
    doc.pipe(res);

    // Header
    doc.fillColor('#1E293B').fontSize(20).font('Helvetica-Bold')
      .text('Jivika Suite — Transaction Report', { align: 'center' });
    doc.fontSize(11).fillColor('#64748B').font('Helvetica')
      .text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
    doc.moveDown(1.5);

    // Table headers
    const colWidths = [70, 55, 110, 110, 120, 75];
    const headers = ['Date', 'Type', 'VO Name', 'SHG Name', 'Title', 'Amount'];
    const startX = 40;
    let currentX = startX;

    doc.fillColor('#1E293B').fontSize(9).font('Helvetica-Bold');
    headers.forEach((h, i) => {
      doc.text(h, currentX, doc.y, { width: colWidths[i], continued: i < headers.length - 1 });
      currentX += colWidths[i];
    });
    doc.moveDown(0.5);

    // Divider
    const lineY = doc.y;
    doc.moveTo(startX, lineY).lineTo(555, lineY).strokeColor('#CBD5E1').stroke();
    doc.moveDown(0.3);

    // Rows
    doc.font('Helvetica').fontSize(8);
    transactions.forEach((t, idx) => {
      if (doc.y > 750) {
        doc.addPage();
        doc.moveDown(1);
      }
      currentX = startX;
      const rowColor = idx % 2 === 0 ? '#0F172A' : '#334155';
      doc.fillColor(rowColor);

      const row = [
        new Date(t.createdAt).toLocaleDateString('en-IN'),
        t.type,
        t.voId ? t.voId.name : 'N/A',
        t.shgId ? t.shgId.name : 'N/A',
        t.title,
        `Rs. ${t.amount.toFixed(2)}`
      ];

      row.forEach((val, i) => {
        doc.text(String(val), currentX, doc.y, { width: colWidths[i], continued: i < row.length - 1 });
        currentX += colWidths[i];
      });
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
