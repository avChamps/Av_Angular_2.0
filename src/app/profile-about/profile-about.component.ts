import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.css']
})
export class ProfileAboutComponent implements OnInit {
  emailId: any
  dateOfBirth: any
  gender!: string
  mobileNumber: any
  userCity!: string
  companyName: any
  userEmailId: any
  jobTitle: any;
  updatedDate: any;
  userName: any
  imagePath: any;
  emailErrorMessage: string = '';
  mobileErrorMessage: string = '';
  profileImageType : string = '';
  products: any[] = []
  showSpinner: boolean = false
  editMode: boolean = false;
  isEmailValidated: boolean = true;
  isMobileNumberValidated: boolean = true;

  constructor(
    private userService: UserServicesService,
    private authService: AuthServiceService,
    private faService: FaServiceService,
    private datePipe: DatePipe
  ) {
    this.emailId = localStorage.getItem('emailId');
    this.userName = localStorage.getItem('userName');
  }

  ngOnInit(): void {
    this.getProfileData()
  }

  toggleEditMode() {
    this.editMode = !this.editMode
    if (!this.editMode) {
      this.saveProfileData()
    }
  }
  getProfileData() {
    this.showSpinner = true;
    this.userService.getProfile(this.emailId).subscribe((response: any) => {
      console.log(response)
      if (response.records.length !== 0) {
        const record = response.records[0]
        this.imagePath = record.imagePath;
        this.updatedDate = record.updatedDate;
        this.userName = record.fullName;
        this.companyName = record.companyName;
        this.emailId = record.emailId;
        this.mobileNumber = record.mobileNumber;
        this.dateOfBirth = record.dob;
        this.gender = record.gender;
        this.userCity = record.location;
        this.jobTitle = record.designation;
        this.gender = record.gender;
      }
      this.showSpinner = false;
    })
  }

  saveProfileData() {
    this.showSpinner = true;

    if (this.isEmailValidated === true && this.isMobileNumberValidated === true) {
      const profileData = new FormData()
      profileData.append('emailId', this.emailId || '');
      profileData.append('companyName', this.companyName || '')
      profileData.append('mobileNumber', this.mobileNumber || '')
      profileData.append('designation', this.jobTitle || '')
      profileData.append('dob', this.dateOfBirth || '')
      profileData.append('location', this.userCity || '')
      profileData.append('gender', this.gender || '')

      this.userService.updateProfile(profileData).subscribe(
        (response: any) => {
          console.log(response)
          this.showSpinner = false;
          window.location.reload();
        },
        (error: any) => {
          this.showSpinner = false;
          console.error('Error occurred while saving profile:', error)
        }
      )
    }
    else {
      this.showSpinner = false;
      alert();
    }
  }

  formattedDate() {
    return this.datePipe.transform(this.updatedDate, 'yyyy-MM-dd');
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.emailId)) {
      this.isEmailValidated = false;
      this.emailErrorMessage = 'Enter valid email ID.';
    } else {
      this.isEmailValidated = true;
      this.emailErrorMessage = '';
    }
  }

  getImageSource(): string {
    if (this.imagePath) {
      return this.imagePath;
    } else {
      return 'assets/img/empty_Image.png'
    }
  }

  onMobileNumberChange() {
    const regex = /^(?!([0-9])\1{9})[1-9][0-9]{9}$/;
    if (!regex.test(this.mobileNumber)) {
      this.isMobileNumberValidated = false;
      this.mobileErrorMessage = 'Invalid Mobile Number.';
    } else {
      this.isMobileNumberValidated = true;
      this.mobileErrorMessage = '';
    }
  }

  formatDOB(dob: any) {
    if (dob === 'not updated') {
      return;
    } else if (dob) {
      return this.datePipe.transform(dob, 'yyyy-MM-dd')
    }
    return ''
  }
}