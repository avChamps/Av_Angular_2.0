import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-power-calculator',
  templateUrl: './power-calculator.component.html',
  styleUrls: ['./power-calculator.component.css']
})
export class PowerCalculatorComponent {
  totalPowerCol: number = 0;
  total: number = 0;
  totalkWh: number = 0;

  constructor(private userService: UserServicesService) { }

  powerCalRows = [
    { equipment: '', current: 0, voltage: 0, watt: 0 },
    { equipment: '', current: 0, voltage: 0, watt: 0 }
  ]

  calculateTotalWatt() {
    this.totalPowerCol = this.powerCalRows.reduce((sum, row) => {
      row.current = Number(row.current) || 0;
      row.voltage = Number(row.voltage) || 0;
      row.watt = row.current * row.voltage;
      return sum + row.watt;
    }, 0);

    this.totalkWh = this.totalPowerCol / 1000;
}


  addRow() {
    this.powerCalRows.push({ equipment: '', current: 0, voltage: 0, watt: 0 })
    this.calculateTotalWatt()
  }

  removeRow() {
    if (this.powerCalRows.length > 1) {
      this.powerCalRows.pop();
      this.calculateTotalWatt();
    }

  }

  clearDefaultZero(type : any) {
    if(type === 'current') {
    this.powerCalRows.forEach((row) => {
      if (row.current === 0) {
        row.current = undefined as any;
      }
    });
  } else {
    this.powerCalRows.forEach((row) => {
      if (row.voltage === 0) {
        row.voltage = undefined as any;
      }
    });
  }
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  refreshValues() {
    this.powerCalRows = [
      { equipment: '', current: 0, voltage: 0, watt: 0 },
      { equipment: '', current: 0, voltage: 0, watt: 0 },
    ]
  }

  onBack() {
    this.userService.onBack();
  }

  downloadRack() {
    const doc = new jsPDF();
    const col = ['equipment', 'current', 'voltage', 'watt'];
    const rows = this.powerCalRows.map((room, index) => [
      index + 1,
      room.equipment,
      room.current,
      room.voltage,
      room.watt
    ]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Power Calculator', 105, 16, { align: 'center' });

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

    doc.setFontSize(12);
    doc.setFont('helvetica', '400');
    doc.text(`Total Watts(W): ${this.totalkWh}`, 175, finalY + 10, { align: 'right' });
    doc.text(`kWh: ${this.totalPowerCol}`, 175, finalY + 15, { align: 'right' });
    doc.save('Power_Calculator.pdf');
  }

}

