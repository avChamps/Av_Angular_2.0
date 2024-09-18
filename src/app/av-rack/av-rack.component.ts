import { Component, Renderer2 } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import * as bootstrap from 'bootstrap';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-av-rack',
  templateUrl: './av-rack.component.html',
  styleUrls: ['./av-rack.component.css']
})
export class AvRackComponent {
  showSpinner: boolean = true;
  isAvrack: boolean = false;
  viewRackImg : boolean = false;
  totalRackHeight: any;
  rackNumbers: any;
  total: number = 0

  constructor(private userService: UserServicesService, private renderer: Renderer2) { }

  btuRows = [
    { company: '', equipment: '', watt: 0 },
    { company: '', equipment: '', watt: 0 }
  ]

  updateRackConfiguration() {
    let totalUnits = 0;
    this.btuRows.forEach(row => {
      totalUnits += (row.watt >= 1 ? row.watt : 0.5);
    });
    this.totalRackHeight = Math.ceil(totalUnits) * 35;
    this.rackNumbers = Array.from({ length: Math.ceil(totalUnits) }, (_, i) => i + 1);
  }

  getRackItemBottom(index: number) {
    let totalRU = 0;
    for (let i = 0; i < index; i++) {
      totalRU += (this.btuRows[i].watt >= 1 ? this.btuRows[i].watt : 0.5);
    }
    return Math.floor(totalRU);
  }

  getHalfRackLeftPosition(index: number) {
    let count = 0;
    for (let i = 0; i < index; i++) {
      if (this.btuRows[i].watt < 1) {
        count++;
      }
    }
    return (count % 2) === 0 ? '0' : '50%';
  }

  getRowClass(index: number): string {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }

  viewRack() {
     this.viewRackImg = true;
  } 

  addRow() {
    this.btuRows.push({ company: '', equipment: '', watt: 0 });
    this.updateRackConfiguration()
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

  removeLastRow() {
    if (this.btuRows.length > 0) {
      this.btuRows.pop();
      this.updateRackConfiguration();
    }
  }

  onClear() {
    this.btuRows = [
      { company: '', equipment: '', watt: 0 },
      { company: '', equipment: '', watt: 0 }
    ]
    this.totalRackHeight = 0;
    this.rackNumbers = [];
    this.updateRackConfiguration();
    this.viewRackImg = false;
  }

  downloadRack(elementId: string) {
    const element = document.getElementById(elementId);
    const buttons = document.querySelectorAll('.disabled_Button');
    let fileName = 'AV-Rack';

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
