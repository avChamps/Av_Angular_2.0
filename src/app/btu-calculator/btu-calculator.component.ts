import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import jsPDF from 'jspdf';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-btu-calculator',
  templateUrl: './btu-calculator.component.html',
  styleUrls: ['./btu-calculator.component.css']
})
export class BtuCalculatorComponent {
  total: number = 0;
  thermalTotal: number = 0;
  requiredCooling: number = 0 ;

  constructor(private userService: UserServicesService, private decimalPipe: DecimalPipe) { }

  btuRows = [
    { company: '', equipment: '', watt: 0 },
    { company: '', equipment: '', watt: 0 }
  ]


  addRow() {
    this.btuRows.push({ company: '', equipment: '', watt: 0 })
    this.calculateTotalWatt()
  }

  removeRow() {
    if (this.btuRows.length > 1) {
      this.btuRows.pop();
      this.calculateTotalWatt();
    }
    
  }

  clearDefaultZero() {
    this.btuRows.forEach((row) => {
      if (row.watt === 0) {
        row.watt = undefined as any;
      }
    });
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  calculateTotalWatt() {
    this.total = this.btuRows.reduce((sum, row) => {
      const wattValue = Number(row.watt) || 0;
      return sum + wattValue;
  }, 0);
    this.thermalTotal = this.total * 3.4
    this.requiredCooling = this.thermalTotal / 12000;
  }

  refreshValues() {
    this.btuRows = [
      { company: '', equipment: '', watt: 0 },
      { company: '', equipment: '', watt: 0 }
    ]
  }

  onBack() {
    this.userService.onBack();
  }

  downloadRack() {
    const doc = new jsPDF();
    const col = ['Sl.No', 'Equipment', 'Watts'];
    const rows = this.btuRows.map((room, index) => [
      index + 1,
      room.equipment,
      room.watt
    ]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BTU Calculator', 105, 16, { align: 'center' });

    (doc as any).autoTable({
      head: [col],
      body: rows,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 175, 163],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
      },
      margin: { bottom: 40 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 25;
    const requiredCooling = this.decimalPipe.transform(this.requiredCooling, '1.2-2');
    doc.setFontSize(12);
    doc.setFont('helvetica', '400');
    doc.text(`Grand Total: ${this.total}`, 175, finalY + 10, { align: 'right' });
    doc.text(`Thermal Disspansion: ${this.thermalTotal}`, 175, finalY + 17, { align: 'right' });
    doc.text(`Cooling Required: ${requiredCooling }`, 175, finalY + 24, { align: 'right' });
    doc.save('BTU_Calculator.pdf');
  }

}
