import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-diagonal-screen',
  templateUrl: './diagonal-screen.component.html',
  styleUrls: ['./diagonal-screen.component.css']
})
export class DiagonalScreenComponent {
  width: number = 0;
  height: number = 0;
  diagonalSize: number = 0;
  showSpinner : boolean = false;

  constructor(private userService : UserServicesService) {}

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

  onBack() {
    this.userService.onBack();
  }
}
