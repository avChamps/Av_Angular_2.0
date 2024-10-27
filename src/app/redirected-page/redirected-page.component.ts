import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaServiceService } from '../services/fa-service.service';

@Component({
  selector: 'app-redirected-page',
  templateUrl: './redirected-page.component.html',
  styleUrls: ['./redirected-page.component.css']
})
export class RedirectedPageComponent implements OnInit {
  receivedValue: any;
  receivedSubValue : any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private faService: FaServiceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.receivedValue = params['value']
      this.receivedSubValue = params['subvalue'];
    })
    this.setSession();
  }

  setSession() {
    this.faService.getSession().subscribe(response => {
      const token = response.session[0].jwtToken
      const userName = response.session[0].firstName;
      const emailId = response.session[0].emailId;
      this.faService.setSession(token, userName, emailId);
      this.redirectedPath()
    })
    // this.redirectedPath()
  }

  redirectedPath() {
    if (this.receivedValue === 'profile-dashboard') {
      this.router.navigate(['/profile-dashboard'])
    } else if (this.receivedValue === 'ekart-page') {
      this.router.navigate(['/ekart-page'])
    } else if (this.receivedValue === 'community') {
      this.router.navigate(['/community'])
    } else if (this.receivedValue === '') {
    } else if (this.receivedValue === 'jobs-portal') {
      this.router.navigate(['/jobs-portal']);
    } else if(this.receivedValue === 'product-list') {
      this.router.navigate(['/product-list/main-page']);
    } else if(this.receivedValue === 'product-list-review') {   
        this.router.navigate([`/product-list-review/${this.receivedSubValue}`]);
      }
  }
}

