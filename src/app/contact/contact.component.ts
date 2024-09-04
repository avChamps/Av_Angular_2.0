import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { FaServiceService } from '../services/fa-service.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit {
  contactForm: FormGroup;
  message: any;
  SuccessMessage: any;
  showCaptcha: boolean = true;
  captchaResolved: boolean = false;
  modalInstance: any;

  @ViewChild('ContactModal') applyJobModal!: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private faService: FaServiceService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/),this.sameDigitValidator]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

sameDigitValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const phoneNumber = control.value;
  if (phoneNumber && phoneNumber.length === 10) {
    const firstDigit = phoneNumber[0];
    if (phoneNumber.split('').every((digit: any) => digit === firstDigit)) {
      return { 'sameDigit': true };
    }
  }
  return null;
}

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.applyJobModal.nativeElement);
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
          this.SuccessMessage = response.message;
          this.showCaptcha = false;
          this.openApplyJobModal();
          this.scrollToTop();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

  resolved(captchaResponse: string | null) {
    if (captchaResponse !== null) {
      console.log(`Resolved captcha with response: ${captchaResponse}`);
      this.captchaResolved = true;
      this.submitForm();
    } else {
      console.log('Captcha response is null');
    }
  }
}
