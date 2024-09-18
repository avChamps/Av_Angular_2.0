import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import html2canvas from 'html2canvas';
import { AuthServiceService } from '../services/auth-service.service';
import { UserServicesService } from '../services/user-services.service'
import * as CryptoJS from 'crypto-js'
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-bussiness-card',
  templateUrl: './bussiness-card.component.html',
  styleUrls: ['./bussiness-card.component.css']
})
export class BussinessCardComponent {
  qrdata: any
  linkCopied: boolean = false
  showSpinner: boolean = false
  showErrorMsg: boolean = false
  displayButtons: boolean = false;
  currentRoute: string = ''
  urlLink: any
  userName: any
  mobileNumber!: number
  designation!: string
  companyName!: string
  emailId: any
  key = 'encrypt!135790';
  linkedIn: string = 'https://www.linkedin.com/in/disendra-yadav-b6b1a9220'
  instagram: string = 'https://www.instagram.com/'

  constructor(
    public router: Router,
    private authSerice: AuthServiceService,
    private userService: UserServicesService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['emailId']) {
        const encodedString = params['emailId'];
        const decryptedString = this.decrypt(decodeURIComponent(encodedString));
        this.emailId = decryptedString;
        this.displayButtons = true;
      } else {
        // this.emailId = this.authSerice.getLoggedInEmail();
        this.emailId = localStorage.getItem('emailId');
      }
      this.getBussinessData();
    });

    const encryptedString = encodeURIComponent(this.encrypt(this.emailId));
    this.urlLink = this.document.location.origin + '/bussiness-card/' + encryptedString;
  }

  onProfile() {
    this.router.navigateByUrl('profile-dashboard/about');
  }

  encrypt(emailId: string): string {
    return CryptoJS.AES.encrypt(emailId, this.key).toString();
  }

  decrypt(passwordToDecrypt: string): string {
    return CryptoJS.AES.decrypt(passwordToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }

  copyToClipboard(): void {
    if (this.urlLink) {
      navigator.clipboard.writeText(this.urlLink).then(
        () => {
          this.linkCopied = true;
          setTimeout(() => {
            this.linkCopied = false;
          }, 2000);
        },
        (err) => {
          console.error('Could not copy text: ', err);
        }
      );
    }
  }

  getBussinessData() {
    this.showSpinner = true;
    this.userService.getProfile(this.emailId).subscribe(
      response => {
        this.showSpinner = false
        if (response && response.records && response.records.length > 0) {
          let records = response.records[0]
          if (
            records.fullName &&
            records.emailId &&
            records.companyName &&
            records.designation &&
            records.mobileNumber
          ) {
            this.emailId = records.emailId
            this.userName = records.fullName
            this.companyName = records.companyName
            this.designation = records.designation
            this.mobileNumber = records.mobileNumber
            this.qrCodeData()
          } else {
            // alert("Some properties in the records are null or undefined.");
            this.showErrorMsg = true
          }
        } else {
          console.log('No records found.');
          this.showErrorMsg = true;
        }
      },
      error => {
        console.error('Error fetching business card data:', error)
      }
    )
  }

  qrCodeData() {
    let qrDataParts = []
    if (this.userName) {
      qrDataParts.push(this.userName)
    }
    if (this.mobileNumber) {
      qrDataParts.push(this.mobileNumber)
    }
    if (this.emailId) {
      qrDataParts.push(this.emailId)
    }
    if (this.designation) {
      qrDataParts.push(this.designation)
    }
    this.qrdata = qrDataParts.join('\n')
  }

  downloadCard(elementId: string) {
    const element = document.getElementById(elementId);
    const buttons = document.querySelectorAll('.disabled_Button');

    if (element) {
      buttons.forEach(button => {
        (button as HTMLElement).style.display = 'none';
      });

      html2canvas(element).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${this.userName + '_Card'}.png`;
        link.click();

        buttons.forEach(button => {
          (button as HTMLElement).style.display = '';
        });

        // Close the modal after download
        const modalElement = document.getElementById('myModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modalInstance.hide();
        }
      });
    } else {
      console.error('Element not found');
    }
  }

  onBack() {
    this.userService.onBack();
  }

}
