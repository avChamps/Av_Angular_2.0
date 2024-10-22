import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FaServiceService } from '../services/fa-service.service';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { UserServicesService } from '../services/user-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  email: string = '';
  userName: string = '';
  password: string = '';
  sender = 'AV Champs';
  title: any;
  description: any;
  emailId : any;
  eventName: any;
  selectedFile: any;
  eventUrl: any; 
  link: any;
  chart: any;
  totalCount: any;
  startDate!: any;
  eventEndDate: any;
  dltFeedDate!: any;
  eventType: any;
  selectedRating: any = 'All';
  endDate!: Date | null;
  showSpinner: boolean = false;
  showAdminpanel: boolean = false;
  selectedOptions: any;
  @ViewChild('adminPortalModal', { static: true }) adminPortalModal!: ElementRef;

  constructor(private faService: FaServiceService,private router: Router,  private toastr: ToastrService, private userService : UserServicesService) { }

  ngOnInit(): void {
    // this.checkLoginStatus();
    let adminSession = localStorage.getItem('adminSession');
    this.emailId = localStorage.getItem('emailId');
    if(adminSession) {
      this.showAdminpanel = true;
    } else {
      this.router.navigate(['/home'])
      this.showAdminpanel = false;
    }
    // this.showLogin();
    // if (!this.showAdminpanel) {
    //   this.showLogin();
    // }
  }

  eventTypes = [
    { displayName: 'Select Event Type', value: '' },
    { displayName: 'Webinar', value: 'webinar' },
    { displayName: 'Trade Show', value: 'trade_show' },
    { displayName: 'Classroom', value: 'classroom' },
    { displayName: 'Product Launch', value: 'product_launch' }
  ];

  onEventTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.eventType = selectElement.value;
    console.log(selectElement.value);
  }

  // showLogin() {
  //   const modalElement = this.adminPortalModal.nativeElement;
  //   const modal = new bootstrap.Modal(modalElement);
  //   modal.show();
  // }

  // submitForm(emailId: any, userName: any, password: any) {
  //   if (emailId === 'Avchamps1@gmail.com' && userName === 'AvChamps' && password === 'Bl@ckp0ny@24') {
  //     localStorage.setItem('isLoggedIn', 'true');
  //     this.showAdminpanel = true;
  //   } else {
  //     alert('You are not an Admin');
  //   }
  // }

  // checkLoginStatus() {
  //   const isLoggedIn = localStorage.getItem('isLoggedIn');
  //   this.showAdminpanel = isLoggedIn === 'true';
  // }

  onSubmit() {
    this.showSpinner = true;
    const feedData = {
      sender: this.sender,
      title: this.title,
      // dltFeedDate: this.dltFeedDate,
      description: this.description,
      link: this.link
    };
    this.faService.insertFeedData(feedData).subscribe((response: any) => {
      console.log('Form submitted:', response);
      if (response.status) {
        alert(response.message);
        this.showSpinner = false;
        this.onClear();
      } else {
        alert(response.message);
        this.showSpinner = false;
      }
    });
  }

  postEvent() {
    this.showSpinner = true;
    const data = {
      event_name: this.eventName,
      event_date: this.startDate,
      website_Url: this.eventUrl,
      eventType: this.eventType,
      dltFeedDate: this.dltFeedDate,
      eventEndDate: this.dltFeedDate
    };
    this.faService.insertEvent(data).subscribe((response: any) => {
      console.log('Form submitted:', response);
      if (response.status) {
        alert(response.message);
        this.showSpinner = false;
        this.onClear();
      } else {
        alert(response.message);
        this.showSpinner = false;
      }
    });
  }

  postTradeshow() {
    this.showSpinner = true;
    const data = {
      title: this.eventName,
      website_Url: this.eventUrl
    };
    this.faService.insertTradeShow(data).subscribe((response: any) => {
      console.log('Form submitted:', response);
      if (response.status) {
        alert(response.message);
        this.showSpinner = false;
        this.onClear();
      } else {
        alert(response.message);
        this.showSpinner = false;
      }
    });
  }


  onClear() {
    // this.sender = '';
    this.title = '';
    this.description = '';
    this.eventName = '';
    this.eventUrl = '';
    this.link = '';
    this.startDate = null;
    this.endDate = null;;
    this.selectedFile = '';
    this.selectedFile = ''
    this.dltFeedDate = '';
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  }
}
