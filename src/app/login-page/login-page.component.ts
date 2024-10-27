import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { FaServiceService } from '../services/fa-service.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  host: { ngSkipHydration: 'true' },
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  receivedValue: any
  googleUrl: any
  linkedInUrl: any;
  receivedSubValue : any;
  baseUrl = 'https://avchamps.com/nodejs';
  // baseUrl : string = 'http://localhost:3000';
  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private faService: FaServiceService,
    private http: HttpClient
  ) {}

  ngOnInit () {
    this.route.params.subscribe(params => {
      this.receivedValue = params['value'];
      this.receivedSubValue = params['subValue'];
    })
    if (this.faService.hasSession()) {
      this.redirectedPath()
    }
  }

  onClick (type: any) {
   let subvalue;
   if(this.receivedSubValue) {
    subvalue = this.receivedSubValue
   }

    if (type === 'google') {
      window.location.href = `${this.baseUrl}/auth/google?destination=${this.receivedValue + '/' + subvalue}`
    } else if (type === 'linkedIn') {
      window.location.href = `${this.baseUrl}/auth/linkedin?destination=${this.receivedValue + '/' + subvalue}`
    } else if (type === 'facebook') {
      window.location.href = `${this.baseUrl}/auth/facebook?destination=${this.receivedValue + '/' + subvalue}`
    } else if (type === 'microsoft') {
      window.location.href = `${this.baseUrl}/auth/microsoft?destination=${this.receivedValue + '/' + subvalue}`
    }
  }

  redirectedPath () {
    if (this.receivedValue === 'avEngineer-dashboard') {
      this.router.navigate(['/avEngineer-dashboard'])
    } else if (this.receivedValue === 'ekart-page') {
      this.router.navigate(['/ekart-page'])
    } else if (this.receivedValue === 'av-community') {
      this.router.navigate(['/av-community'])
    } else if(this.receivedValue === 'profile-dashboard') {
      this.router.navigate(['/profile-dashboard']);
    }
  }
}
