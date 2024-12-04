import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthServiceService } from '../services/auth-service.service';
import { CommunityService } from '../services/community.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-coins-blast',
  templateUrl: './coins-blast.component.html',
  styleUrls: ['./coins-blast.component.css']
})
export class CoinsBlastComponent implements OnInit, AfterViewInit {
  @Input() coins: any;
  emailId: any;
  userName: any;
  @ViewChild('modalElement', { static: false }) modalElement!: ElementRef;

  constructor(
    private userService: UserServicesService
  ) { }
  ngAfterViewInit(): void {
    this.displayPopup()
  }

  ngOnInit(): void {
    // this.emailId = localStorage.getItem('emailId');
    // this.userName = localStorage.getItem('userName');
    this.emailId = 'test123@gmail.com';
    this.userName = 'Test'
    this.insertPoints(this.coins)
  }

  insertPoints(points: number) {
    const pointsData = {
      emailId: this.emailId,
      userName: this.userName,
      points: points
    };
    this.userService.insertPoints(pointsData).subscribe((response: any) => {
      console.log('Form submitted:', response);
      console.log(response);
    });
  }

  displayPopup() {
    if (this.modalElement) {
      const modal = new bootstrap.Modal(this.modalElement.nativeElement);
      modal.show();
      setTimeout(() => {
        modal.hide();
      }, 2000);
    }
  }
}

