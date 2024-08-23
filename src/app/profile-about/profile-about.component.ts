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
export class ProfileAboutComponent implements OnInit{
  emailId: any
  dateOfBirth: any
  gender!: string
  mobileNumber: any
  userCity!: string
  companyName: any
  userEmailId: any
  jobTitle: any;
  signupDate : any;
  userName: any
  imagePath: any
  products: any[] = []
  showSpinner: boolean = false
  editMode: boolean = false

  constructor (
    private userService: UserServicesService,
    private authService: AuthServiceService,
    private faService: FaServiceService,
    private datePipe: DatePipe
  ) {
    // this.emailId = localStorage.getItem('emailId');
    this.emailId= 'disendra889@gmail.com';
  }

  ngOnInit (): void {
    this.getProfileData()
  }

  toggleEditMode () {
    this.editMode = !this.editMode
    if (!this.editMode) {
      this.saveProfileData()
    }
  }
  getProfileData () {
    this.showSpinner = true;
    this.userService.getProfile(this.emailId).subscribe((response: any) => {
      console.log(response)
      if (response.records.length !== 0) {
        const record = response.records[0]
        this.imagePath = record.imagePath;
        this.signupDate = record.signupDate || 'not updated'
        this.userName = record.fullName || 'not updated'
        this.companyName = record.companyName || 'not updated'
        this.emailId = record.emailId || 'not updated'
        this.mobileNumber = record.mobileNumber || 'not updated'
        this.dateOfBirth = record.dob || 'not updated'
        this.gender = record.gender || 'not updated'
        this.userCity = record.location || 'not updated'
        this.jobTitle = record.designation || 'not updated'
        this.gender = record.gender || 'not updated'
      }
      this.showSpinner = false;
    })
  }

  saveProfileData () {
    this.showSpinner = true;
    const profileData = new FormData()
    if (this.emailId !== 'not updated')
      profileData.append('emailId', this.emailId || '');
    if (this.companyName !== 'not updated')
      profileData.append('companyName', this.companyName || '')
    if (this.mobileNumber !== 'not updated')
      profileData.append('mobileNumber', this.mobileNumber || '')
    if (this.jobTitle !== 'not updated')
      profileData.append('designation', this.jobTitle || '')
    if (this.dateOfBirth !== 'not updated')
      profileData.append('dob', this.dateOfBirth || '')
    if (this.userCity !== 'not updated')
      profileData.append('location', this.userCity || '')
    if (this.gender !== 'not updated')
      profileData.append('gender', this.gender || '')

    console.log(profileData)

    this.userService.updateProfile(profileData).subscribe(
      (response: any) => {
        console.log(response)
        this.showSpinner = false;
        window.location.reload()
      },
      (error: any) => {
        this.showSpinner = false;
        console.error('Error occurred while saving profile:', error)
      }
    )
  }

  formattedDate() {
    return this.datePipe.transform(this.signupDate, 'yyyy-MM-dd');
  }

  formatDOB (dob: any) {
    if(dob === 'not updated') {
      return;
    } else if (dob) {
      return this.datePipe.transform(dob, 'yyyy-MM-dd')
    }
    return ''
  }
}