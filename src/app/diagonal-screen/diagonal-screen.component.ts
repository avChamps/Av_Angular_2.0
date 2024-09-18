import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { an } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-diagonal-screen',
  templateUrl: './diagonal-screen.component.html',
  styleUrls: ['./diagonal-screen.component.css']
})
export class DiagonalScreenComponent {
  width: number = 0;
  height: number = 0;
  diagonalSize: number = 0;
  showSpinner: boolean = false;

  constructor(private userService: UserServicesService) { }

  calculateDiagonalSize() {
    this.showSpinner = true;
    setTimeout(() => {
      if (this.width > 0 && this.height > 0) {
        this.diagonalSize = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
      } else {
        this.diagonalSize = 0;
      }
      this.showSpinner = false;
    }, 700);
  }

  onReset() {
    this.width = 0;
    this.height = 0;
  }

  clearDefaultZero(type: 'width' | 'height') {
    if (type === 'width' && this.width === 0) {
      this.width = undefined as any;
    } else if (type === 'height') {
      this.height = undefined as any;
    }
  }

  preventNegative(event: KeyboardEvent, inputValue: string) {
    const maxLength = 4;
    if (event.key === '-' || event.key === 'e' || inputValue.length >= maxLength) {
      event.preventDefault();
    }
  }
  

  onBack() {
    this.userService.onBack();
  }
}
