import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FaServiceService } from '../services/fa-service.service';
import { Modal } from 'bootstrap'; // Import Modal from Bootstrap

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  contactForm: FormGroup;
  url = 'https://avchamps.com/nodejs';
  footertxt!: string;
  message: any;
  newsLetterEmail: any;
  showContact: boolean = false;
  captchaResolved: boolean = false;
  showCaptcha: boolean = false;
  modalInstance: any;

  @ViewChild('applyJob', { static: true }) applyJobModal!: ElementRef;



  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private faService: FaServiceService) {
    // window.location.reload();
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

    this.http.get<any>(`${this.url}/getFooterText`).subscribe(
      (response: any) => {
        if (response.status && response.records) {
          const quotes = response.records.quotes;
          this.footertxt = this.getRandomQuote(quotes);
        } else {
          console.error('Failed to fetch footer text:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching footer text:', error);
      }
    );
  }
  
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  
  openApplyJobModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    } else {
      console.error('Modal instance is not initialized.');
    }
  }

  validatePhoneNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  isMenuCollapsed = true;

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }


  onLogin(option: any) {
    let value;
    if (option === 'ekart') {
      value = 'ekart-page'
    } else if (option === 'jobPortal') {
      value = 'jobs-portal'
    } else if(option === 'profile') {
       value = 'profile-dashboard'
    }
    else {
      value = 'community'
    }

    this.router.navigate(['/login-page', value])
  }

  getRandomQuote(quotes: string[]): string {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }


  ngAfterViewInit() {
    // Initialize modal after the view is initialized
    this.modalInstance = new Modal(this.applyJobModal.nativeElement);
  }

  resolved(captchaResponse: string | null) {
    if (captchaResponse !== null) {
      console.log(`Resolved captcha with response: ${captchaResponse}`);
      this.captchaResolved = true;
      // this.popup.closeDialog();
      this.submitForm();
    } else {
      console.log('Captcha response is null');
    }
  }

  submitForm() {
    if (this.contactForm.valid) {
      let personName = this.contactForm.get('name')?.value;
      let mobileNumber = this.contactForm.get('phone')?.value;
      let emailId = this.contactForm.get('email')?.value;
      let message = this.contactForm.get('message')?.value;
      let subject = '';

      const contactData = {
        personName: personName,
        emailId: emailId,
        mobileNumber: mobileNumber,
        subject: subject,
        message: message,
        jjjh: "hjjhjjj"
      };

      this.faService.contactUs(contactData).subscribe(
        (response: any) => {
          this.message = response.message;
          this.showCaptcha = false;
          this.openApplyJobModal();
          this.scrollToTop();
          setTimeout(() => {
          }, 2000);
          window.location.reload();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }



  NewsLetterSubscribe() {
    const data = {
      emailId: this.newsLetterEmail
    }
    this.faService.newsLetter(data).subscribe(
      (response: any) => {
        this.message = response.message;
        this.showCaptcha = false;
        this.openApplyJobModal();
        this.scrollToTop();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

  headerOptions = [
    { icon: 'fas fa-gear fa-lg', label: 'AV Tools' },
    { icon: 'fas fa-briefcase fa-lg', label: 'AV Career' },
    { icon: 'fas fa-shopping-cart fa-lg', label: 'AV Kart' },
    { icon: 'fas fa-comment fa-lg', label: 'AV Community' }
  ];

  socialIcons = [
    { url: 'https://www.facebook.com/profile.php?id=61558649983492', iconClass: 'fab fa-facebook-f fa-stack-1x' },
    { url: 'https://www.linkedin.com/in/avchamps/', iconClass: 'fab fa-linkedin fa-stack-1x' }
  ];

  socialMediaIcons = [
    { iconClass: 'fab fa-facebook-f', url: 'https://www.facebook.com/profile.php?id=61558649983492' },
    { iconClass: 'fab fa-twitter', url: 'https://x.com/rgbaudiovideo' },
    { iconClass: 'fab fa-instagram', url: 'https://www.instagram.com/av.champs/' },
    { iconClass: 'fab fa-linkedin', url: 'https://www.linkedin.com/in/avchamps/' },
    { iconClass: 'fab fa-youtube', url: 'https://www.youtube.com/@AVChamps' }
  ];

  homeLinks = [
    { label: 'Home', url: '#header' },
    { label: 'About', url: '#about' },
    { label: 'Contact', url: '#contact' }
  ];

  usefulLinks = [
    { label: 'Privacy', url: '#header'},
    { label: 'Terms', url: '#header' },
    { label: 'Disclaimer', url: '#header' }
  ];

  sponsers = [
    {
      imageUrl: 'assets/images/babbler.jpg'
    }, {
      imageUrl: 'assets/images/babbler.jpg'
    },
    {
      imageUrl: 'assets/images/babbler.jpg'
    }
  ]


  testimonials = [
    {
      content: 'The AV Champs EVENTS Calendar tracks trade shows, events, webinars, and training sessions, saving me time.',
      imageUrl: 'assets/images/dbharath.jpeg',
      name: 'Bharat Dhane',
      position: 'AV Engineer'
    },
    {
      content: 'The VC BAR SIMULATOR on AV Champs is excellent. It helps visualize camera, mic, and speaker coverage.',
      imageUrl: 'assets/images/udayp.jpg',
      name: 'Uday P',
      position: 'AV Engineer'
    },
    {
      content: 'The directory concept on AV Champs is brilliant. It helps me connect with the right POC from the organization.',
      imageUrl: 'assets/images/vishnu.jpeg',
      name: 'Vishnu',
      position: 'AV Specialist'
    },
    {
      content: 'The site’s user-friendly design and intuitive navigation, with a clean layout, made it easy to find what I needed.',
      imageUrl: 'assets/images/disendraG.jpg',
      name: 'Disendra G',
      position: 'Programmer'
    }
  ];

}

