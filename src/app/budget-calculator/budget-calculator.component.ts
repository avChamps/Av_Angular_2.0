import { Component, Renderer2 } from '@angular/core';
import * as bootstrap from 'bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserServicesService } from '../services/user-services.service';

interface SavedRoom {
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
    { type: 'Licenses' }
  ];

  budgetCalculator = [
    { roomType: '', quantity: '', cost: 0, total: 0 },
    { roomType: '', quantity: '', cost: 0, total: 0 }
  ];


  selectedRoomType = this.roomTypes[0].type;

  removeRow() {
    if (this.budgetCalculator.length > 0) {
      this.savedRooms.pop();
      this.showRemoveIcon = this.budgetCalculator.length > 1;
      this.calculateTotalBudget();
    } else {
      this.showBudgetTable = false;
    }
  }

  getRowClass(index: number): string {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  get totalCost(): number {
    return this.roomQuantity * this.costPerRoom;
  }

  saveRoomDetails() {
    const total = this.roomQuantity * this.costPerRoom;
    const roomDetail = {
      roomType: this.selectedRoomType,
      quantity: this.roomQuantity,
      price: this.costPerRoom,
      total: total
    };
    this.savedRooms.push(roomDetail);
    this.showBudgetTable = true;
    this.calculateTotalBudget();
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

  downloadRack(elementId: string) {
    const element = document.getElementById(elementId);
    const buttons = document.querySelectorAll('.disabled_Button');
    let fileName = 'budgetCalculator';

    if (element) {
      buttons.forEach(button => {
        (button as HTMLElement).style.display = 'none';
      });

      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
        buttons.forEach(button => {
          (button as HTMLElement).style.display = '';
        });

        // Hide the modal if open
        const modalElement = document.getElementById('myModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modalInstance.hide();
        }
      }).catch((error) => {
        console.error('Error capturing content:', error);
      });
    } else {
      console.error('Element not found');
    }
  }

  onBack() {
    this.userService.onBack();
  }

}
