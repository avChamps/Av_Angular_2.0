import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-material-gatepass',
  templateUrl: './material-gatepass.component.html',
  styleUrls: ['./material-gatepass.component.css']
})
export class MaterialGatepassComponent {
  tableRows: { desc: string; make: string, model: string, slNo: string, quantity: string; problem: string }[] = [
    { desc: '', make: '', model: '', slNo: '', quantity: '', problem: '' },
    { desc: '', make: '', model: '', slNo: '', quantity: '', problem: '' }
  ];

  addRow() {
    this.tableRows.push({ desc: '', make: '', model: '', slNo: '', quantity: '', problem: '' });
  }

  deleteRow(index: number) {
    if (this.tableRows.length > 3) {
      this.tableRows.pop();
    }
  }

  refreshValues() {
    this.tableRows.forEach(row => {
      row.desc = '';
      row.make = '',
        row.model = '',
        row.slNo = '',
        row.quantity = '';
      row.problem = '';
    });
  }


  downloadForm() {
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, A4 size

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const cellPadding = 2; // Padding for cell content
    let yPosition = 20; // Starting Y position

    // Add Full Page Border
    doc.rect(margin - 5, margin - 5, pageWidth - (margin - 5) * 2, pageHeight - (margin - 5) * 2);

    // Header Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MATERIAL GATE PASS', pageWidth / 2, yPosition, { align: 'center' });

    // Address Section
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const addressBoxHeight = 30;
    const addressTextYPosition = yPosition + addressBoxHeight / 2 + 2; // Vertical center
    doc.rect(margin, yPosition, pageWidth / 2 - margin, addressBoxHeight); // Address box
    doc.text('ADDRESS', margin + cellPadding, yPosition + 5);
    const address = (document.getElementById('address') as HTMLTextAreaElement)?.value || '';
    const wrappedAddress = doc.splitTextToSize(address, pageWidth / 2 - margin - cellPadding * 2);
    doc.text(wrappedAddress, margin + cellPadding, addressTextYPosition);

    doc.rect(pageWidth / 2, yPosition, pageWidth / 2 - margin, addressBoxHeight); // Title box
    doc.setFont('helvetica', 'bold');
    doc.text('MATERIAL GATE PASS', pageWidth / 2 + margin + 10, yPosition + addressBoxHeight / 2);

    // Person Name and Date Section
    yPosition += addressBoxHeight + 10;
    const rowHeight = 15; // Row height
    const textYPosition = yPosition + rowHeight / 2 + 3; // Adjust for vertical center

    doc.setFont('helvetica', 'normal');
    doc.rect(margin, yPosition, pageWidth / 2 - margin, rowHeight);
    doc.text('Person Name:', margin + cellPadding, textYPosition);
    const personName = (document.getElementById('personName') as HTMLInputElement)?.value || '';
    doc.text(personName, margin + 40, textYPosition);

    doc.rect(pageWidth / 2, yPosition, pageWidth / 2 - margin, rowHeight);
    doc.text('Date:', pageWidth / 2 + cellPadding, textYPosition);
    const date = (document.getElementById('date') as HTMLInputElement)?.value || '';
    doc.text(date, pageWidth - margin - 50, textYPosition);

    // Gatepass Type and Company Name Section
    yPosition += rowHeight + 5;
    const gatepassTextYPosition = yPosition + rowHeight / 2 + 3;

    doc.rect(margin, yPosition, pageWidth / 2 - margin, rowHeight);
    doc.text('Gatepass Type:', margin + cellPadding, gatepassTextYPosition);
    const gatepassType = (document.querySelector('input[name="gatepassType"]:checked') as HTMLInputElement)?.nextElementSibling?.textContent?.trim() || '';
    doc.text(gatepassType, margin + 40, gatepassTextYPosition); // Display the selected radio button's label

    doc.rect(pageWidth / 2, yPosition, pageWidth / 2 - margin, rowHeight);
    doc.text('Company Name:', pageWidth / 2 + cellPadding, gatepassTextYPosition);
    const companyName = (document.getElementById('companyName') as HTMLInputElement)?.value || '';
    doc.text(companyName, pageWidth - margin - 50, gatepassTextYPosition);

    // Table Header
    yPosition += rowHeight + 10;
    const columnWidths = [10, 100, 30, 50]; // Column widths: SN, Particulars, Qty, Issue
    let xPosition = margin;
    doc.setFont('helvetica', 'bold');
    ['SN', 'Particulars', 'Qty', 'Issue With Hardware'].forEach((header, i) => {
      doc.rect(xPosition, yPosition, columnWidths[i], rowHeight);
      doc.text(header, xPosition + cellPadding, yPosition + rowHeight / 2 + 3); // Centered vertically
      xPosition += columnWidths[i];
    });

    // Table Body
    const tableRows = document.querySelectorAll('.table-custom tbody tr');
    doc.setFont('helvetica', 'normal'); // Change font to normal for table body
    yPosition += rowHeight;
    tableRows.forEach((row, index) => {
      const rowHeight = 20;
      if (yPosition + rowHeight > pageHeight - margin - 20) {
        doc.addPage();
        yPosition = margin;
      }

      xPosition = margin;
      doc.rect(xPosition, yPosition, columnWidths[0], rowHeight); // SN column
      doc.text(String(index + 1), xPosition + cellPadding, yPosition + rowHeight / 2 + 3);

      const particulars = [
        (row.querySelector('input[placeholder="Enter Device Description"]') as HTMLInputElement)?.value || '',
        (row.querySelector('input[placeholder="Enter Device Make"]') as HTMLInputElement)?.value || '',
        (row.querySelector('input[placeholder="Enter Device Model"]') as HTMLInputElement)?.value || '',
        (row.querySelector('input[placeholder="Enter Device SlNO"]') as HTMLInputElement)?.value || ''
      ].join('\n');
      xPosition += columnWidths[0];
      doc.rect(xPosition, yPosition, columnWidths[1], rowHeight); // Particulars column
      const wrappedParticulars = doc.splitTextToSize(particulars, columnWidths[1] - cellPadding * 2);
      doc.text(wrappedParticulars, xPosition + cellPadding, yPosition + 5);

      xPosition += columnWidths[1];
      doc.rect(xPosition, yPosition, columnWidths[2], rowHeight); // Qty column
      doc.text((row.querySelector('.mobile_qty') as HTMLInputElement)?.value || '', xPosition + cellPadding, yPosition + rowHeight / 2 + 3);

      xPosition += columnWidths[2];
      doc.rect(xPosition, yPosition, columnWidths[3], rowHeight); // Issue column
      doc.text((row.querySelector('.table-textarea') as HTMLTextAreaElement)?.value || '', xPosition + cellPadding, yPosition + rowHeight / 2 + 3);

      yPosition += rowHeight;
    });

    // Footer Section with Signatures
    yPosition += 10;

    // Prepared By Section
    doc.rect(margin, yPosition, pageWidth / 2 - margin, 20); // Left box
    doc.text('Prepared by:', margin + cellPadding, yPosition + 10); // Top-aligned text
    const preparedBy = (document.getElementById('preparedBy') as HTMLInputElement)?.value || '';
    doc.text(preparedBy, margin + 40, yPosition + 10); // Name aligned beside the label
    doc.text('Signature: ', margin + cellPadding, yPosition + 18); // Signature line

    // Received By Section
    doc.rect(pageWidth / 2, yPosition, pageWidth / 2 - margin, 20); // Right box
    doc.text('Received by:', pageWidth / 2 + cellPadding, yPosition + 10); // Top-aligned text
    const receivedBy = (document.getElementById('receivedBy') as HTMLInputElement)?.value || '';
    doc.text(receivedBy, pageWidth / 2 + 45, yPosition + 10); // Name aligned beside the label
    doc.text('Signature: ', pageWidth / 2 + cellPadding, yPosition + 18); // Signature line

    // Save PDF
    doc.save('Material_Gate_Pass.pdf');
  }



}