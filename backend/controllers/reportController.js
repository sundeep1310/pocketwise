const Transaction = require('../models/Transaction');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const getCurrencySymbol = (currency) => {
  switch(currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'JPY': return '¥';
    case 'INR': return '₹';
    default: return '$';
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const { startDate, endDate, currency = 'USD' } = req.query;
    let query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const transactions = await Transaction.find(query).lean();
    const currencySymbol = getCurrencySymbol(currency);
    
    // Create a PDF document
    const doc = new PDFDocument();
    const filename = `pocketwise-report-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    // Pipe the PDF to a file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Add content to the PDF
    doc.fontSize(20).text('PocketWise Financial Report', { align: 'center' });
    doc.moveDown();
    
    // Add date range if provided
    if (startDate && endDate) {
      doc.fontSize(12).text(`Date Range: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, { align: 'center' });
      doc.moveDown();
    }
    
    // Add summary
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const balance = income - expenses;
    
    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12).text(`Total Income: ${currencySymbol}${income.toFixed(2)}`);
    doc.fontSize(12).text(`Total Expenses: ${currencySymbol}${expenses.toFixed(2)}`);
    doc.fontSize(12).text(`Balance: ${currencySymbol}${balance.toFixed(2)}`);
    doc.moveDown();
    
    // Add transactions table
    doc.fontSize(14).text('Transactions', { underline: true });
    doc.moveDown();
    
    // Table headers
    const tableTop = doc.y;
    const tableHeaders = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const columnWidths = [80, 70, 100, 80, 150];
    let currentY = tableTop;
    
    // Draw headers
    doc.fontSize(10);
    tableHeaders.forEach((header, i) => {
      doc.text(header, doc.x + (i > 0 ? columnWidths.slice(0, i).reduce((a, b) => a + b, 0) : 0), currentY);
    });
    
    currentY += 20;
    doc.moveTo(doc.x, currentY).lineTo(doc.x + 480, currentY).stroke();
    currentY += 10;
    
    // Draw rows
    doc.fontSize(9);
    transactions.forEach(tx => {
      const rowData = [
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        tx.category,
        `${currencySymbol}${parseFloat(tx.amount).toFixed(2)}`,
        tx.note || ''
      ];
      
      // Check if we need a new page
      if (currentY > doc.page.height - 100) {
        doc.addPage();
        currentY = doc.page.margins.top;
      }
      
      // Draw row data
      rowData.forEach((text, i) => {
        doc.text(
          text, 
          doc.x + (i > 0 ? columnWidths.slice(0, i).reduce((a, b) => a + b, 0) : 0), 
          currentY,
          { width: columnWidths[i], ellipsis: true }
        );
      });
      
      currentY += 20;
    });
    
    // Finalize the PDF
    doc.end();
    
    // When the stream is finished, send the file
    stream.on('finish', () => {
      res.download(filePath, `pocketwise-report.pdf`, () => {
        // Delete the file after sending
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
};