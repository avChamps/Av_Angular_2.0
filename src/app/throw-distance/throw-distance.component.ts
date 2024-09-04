import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-throw-distance',
  templateUrl: './throw-distance.component.html',
  styleUrls: ['./throw-distance.component.css']
})
export class ThrowDistanceComponent {
  width: number = 0;
  projectionDistance: number = 0;
  throughRatio: number = 0;
  showSpinner : boolean = false;

  constructor(private userService: UserServicesService) { }

  onCalculate() {
    this.showSpinner = true;
    setTimeout(() => {
    this.projectionDistance = this.width * this.throughRatio;
    this.showSpinner = false;
    },700)
  }

  onReset() {
    this.width = 0;
    this.throughRatio = 0;
  }

  onBack() {
    this.userService.onBack();
  }

}
