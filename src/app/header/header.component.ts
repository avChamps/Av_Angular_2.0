import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FaServiceService } from '../services/fa-service.service';
import { Modal } from 'bootstrap'; // Import Modal from Bootstrap
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  contactForm!: FormGroup;
  newsletterForm!: FormGroup;
  captchaResolved: boolean = false;
  submitted: boolean = false;
  isHomePage : boolean = true;
  currentSlide = 0;
  carouselTransform = '';
  isNavbarCollapsed = true;
  message: string = '';


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private faService: FaServiceService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      personName: ['', [Validators.required, Validators.minLength(3)]],
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?!([0-9])\1{9})[0-9]{10}$/),
        ],
      ],
      emailId: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      recaptcha: ['', Validators.required],
    });

    this.newsletterForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
    });
    this.updateCarousel();
  }

  testimonials = [
    {
      message: 'The AV Champs EVENTS Calendar tracks trade shows, events, webinars, and training sessions, saving me time.',
      stars: 5,
      author: 'Bharat Dhane',
      role: 'AV Engineer',
      image: 'assets/images/dbharath.jpeg',
    },
    {
      message: 'The VC BAR SIMULATOR on AV Champs is excellent. It helps visualize camera, mic, and speaker coverage.',
      stars: 5,
      author: 'Uday P',
      role: 'AV Engineer',
      image: 'assets/images/udayp.jpg',
    },
    {
      message: ' The directory concept on AV Champs is brilliant. It helps me connect with the right POC from the organization.',
      stars: 5,
      author: 'Vishnu Vardhan',
      role: 'AV Specialist',
      image: 'assets/images/vishnu.jpeg',
    },
  ];

  socialMediaLinks = [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/avchamps/', iconClass: 'fab fa-linkedin-in' },
    { platform: 'Instagram', url: 'https://www.instagram.com/av.champs/', iconClass: 'fab fa-instagram' },
    { platform: 'Twitter', url: 'https://x.com/rgbaudiovideo', iconClass: 'fas fa-x' },
    { platform: 'YouTube', url: 'https://www.youtube.com/@AVChamps', iconClass: 'fab fa-youtube' },
    { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61558649983492', iconClass: 'fab fa-facebook-f' },
  ];

  featureCards = [
    {
      icon: 'fas fa-tools',
      title: 'Tools',
      gradient: '',
      value: '/login-page/profile-dashboard'
    },
    {
      icon: 'fas fa-briefcase',
      title: 'Careers',
      gradient: 'background: linear-gradient(to bottom, #4facfe, #00f2fe);',
      value: '/login-page/jobs-portal'
    },
    {
      icon: 'fas fa-shopping-cart',
      title: 'Kart',
      gradient: 'background: linear-gradient(to bottom, #ff9a9e, #fad0c4);',
      value: '/login-page/ekart-page'
    },
    {
      icon: 'fas fa-users',
      title: 'Community',
      gradient: 'background: linear-gradient(to bottom, #43e97b, #38f9d7);',
      value: '/login-page/community'
    },
    {
      icon: 'fas fa-star',
      title: 'Reviews',
      gradient: 'background: linear-gradient(to bottom, #4facfe, #00f2fe);',
      value: '/login-page/product-list'
    }
  ];

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  @HostListener('window:resize')
  onResize() {
    this.currentSlide = 0;
    this.updateCarousel();
  }

  updateCarousel() {
    const isMobile = window.innerWidth < 768;
    const slideWidth = isMobile ? 100 : 33.333;
    this.carouselTransform = `translateX(-${this.currentSlide * slideWidth}%)`;
  }

  nextSlide() {
    const maxSlides = window.innerWidth < 768 ? this.testimonials.length - 1 : this.testimonials.length - 3;
    this.currentSlide = (this.currentSlide + 1) > maxSlides ? 0 : this.currentSlide + 1;
    this.updateCarousel();
  }

  prevSlide() {
    const maxSlides = window.innerWidth < 768 ? this.testimonials.length - 1 : this.testimonials.length - 3;
    this.currentSlide = (this.currentSlide - 1) < 0 ? maxSlides : this.currentSlide - 1;
    this.updateCarousel();
  }


  resolved(captchaResponse: string | null): void {
    if (captchaResponse) {
      this.captchaResolved = true;
      console.log(`Resolved captcha with response: ${captchaResponse}`);
    } else {
      this.captchaResolved = false;
      console.log('Captcha response is null');
    }
  }

  submitForm(): void {
    this.submitted = true; // Mark form as submitted

    if (this.contactForm.valid && this.captchaResolved) {
      const contactData = this.contactForm.value;

      this.faService.contactUs(contactData).subscribe(
        (response: any) => {
          console.log('Form submitted successfully:', response);
          const modalElement = document.getElementById('successModal');
          const successModal = new bootstrap.Modal(modalElement!);
          successModal.show();
          setTimeout(() => {
            successModal.hide();
          }, 300000);
          this.contactForm.reset();
          this.captchaResolved = false;
          this.submitted = false;
          this.scrollToTop()
        },
        (error: any) => {
          console.error('Error submitting form:', error);
        }
      );
    } else {
      console.log('Form is invalid or captcha not resolved.');
    }
  }

  NewsLetterSubscribe(): void {
    this.submitted = true;

    if (this.newsletterForm.valid) {
      const data = this.newsletterForm.value;

      this.faService.newsLetter(data).subscribe(
        (response: any) => {
          this.message = response.message || 'Thank you for subscribing!';
          this.openSuccessModal();
          this.newsletterForm.reset();
          this.submitted = false;
        },
        (error: any) => {
          console.error('Error subscribing to newsletter:', error);
        }
      );
    } else {
      console.log('Invalid email address');
    }
  }

  openSuccessModal(): void {
    const modalElement = document.getElementById('newsletterSuccessModal');
    const successModal = new bootstrap.Modal(modalElement!);
    successModal.show();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onPrivacyPolicy() {
    this.isHomePage = !this.isHomePage;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
