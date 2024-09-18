import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserServicesService } from '../services/user-services.service';

interface SavedRoom {
  showDelete: boolean;
  roomType: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-budget-calculator',
  templateUrl: './budget-calculator.component.html',
  styleUrls: ['./budget-calculator.component.css']
})


export class BudgetCalculatorComponent {

  totalBudget: any;
  isBudgetCal: boolean = false;
  showRemoveIcon: boolean = true;
  isDisplay: boolean = false;
  showSpinner: boolean = false;
  showBudgetTable: boolean = false;
  roomType: string = 'Huddle Room';
  roomQuantity: number = 0;
  costPerRoom: number = 0;

  constructor(private userService: UserServicesService, private renderer: Renderer2) { }

  savedRooms: SavedRoom[] = [];

  roomTypes = [
    { type: 'Select Room' },
    { type: 'Huddle Room' },
    { type: 'Small Conference Room' },
    { type: 'Medium Conference Room' },
    { type: 'Large Conference Room' },
    { type: 'Boardroom' },
    { type: 'Specialty Spaces' },
    { type: 'Auditorium' },
    { type: 'Digital Signage' },
    { type: 'Music Server' },
    { type: 'Licenses' },
    { type: 'Other Expenses' }
  ];

  budgetCalculator = [
    { roomType: '', quantity: '', cost: 0, total: 0, showDelete: false },
    { roomType: '', quantity: '', cost: 0, total: 0, showDelete: false }
  ];


  selectedRoomType = this.roomTypes[0].type;


  getRowClass(index: number): string {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  get totalCost(): number {
    return this.roomQuantity * this.costPerRoom;
  }

  clearDefaultZero() {
    if (this.costPerRoom === 0) {
      this.costPerRoom = undefined as any;
    }
  }


  toggleActionItems() {
    this.savedRooms.forEach(room => room.showDelete = !room.showDelete);
    this.isDisplay = !this.isDisplay;
  }

  deleteRow(index: number) {
    this.savedRooms.splice(index, 1);
    this.totalBudget = this.calculateTotalBudget();
    this.calculateTotalBudget();
  }

  saveRoomDetails() {
    const total = this.roomQuantity * this.costPerRoom;
    const roomDetail = {
      roomType: this.selectedRoomType,
      quantity: this.roomQuantity,
      price: this.costPerRoom,
      total: total,
      showDelete: false
    };
    this.savedRooms.push(roomDetail);
    this.showBudgetTable = true;
    this.calculateTotalBudget();
    this.selectedRoomType = this.roomTypes[0].type;
    this.roomQuantity = 0;
    this.costPerRoom = 0;
  }

  calculateTotalBudget() {
    this.totalBudget = this.savedRooms.reduce((sum, room) => sum + room.total, 0);
  }

  refreshValues() {
    this.selectedRoomType = this.roomTypes[0].type;
    this.roomQuantity = 0;
    this.costPerRoom = 0;
    this.savedRooms = [];
    this.showBudgetTable = false;
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  restrictDigits(event: any) {
    const inputValue = event.target.value;
    if (inputValue.length > 9) {
      event.target.value = inputValue.slice(0, 9);
      this.costPerRoom = Number(event.target.value);
    }
  }

  validateMaxValue(event: any) {
    const inputValue = event.target.value;
    if (inputValue > 100) {
      event.target.value = 100;
      this.roomQuantity = 100;
    }
  }

  downloadRack() {
    const doc = new jsPDF();
    const col = ['Sl.No', 'Room Type', 'Quantity', 'Price', 'Total'];
    const rows = this.savedRooms.map((room, index) => [
      index + 1,
      room.roomType,
      room.quantity,
      room.price,
      room.total,
    ]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Budget Details', 105, 16, { align: 'center' });

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
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: ${this.totalBudget}`, 175, finalY + 10, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 0, 0);
    doc.text('*Tax is not included in the values shown above.', 105, finalY + 20, { align: 'center' });

    doc.save('Budget_Calculator.pdf');
  }

  onBack() {
    this.userService.onBack();
  }

}
