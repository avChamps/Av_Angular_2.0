import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as $ from 'jquery';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.css']
})
export class ProfileDashboardComponent implements OnInit {
  userName: any;
  activeMenuItem: any
  CickedsocialMedia: any
  emailId:any;
  showSpinner: boolean = false
  products: any[] = []
  profileWeight!: number
  inputValue!: string
  twitterUrl!: string
  facebookUrl!: string
  instagramUrl!: string
  insertionType!: string
  linkedInUrl!: string
  profileImageType!: string
  socialMediaUrls: { [key: string]: string } = {}
  @ViewChild('sidebarMenu') sidebarMenu!: ElementRef;

  constructor(
    private router: Router,
    private userService: UserServicesService, private renderer  : Renderer2,
    private faService: FaServiceService, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    $('.navbar-toggler').click(function () {
      $('#sidebarMenu').toggleClass('sticky');
    });
    this.userName = localStorage.getItem('userName')
    this.emailId = localStorage.getItem('emailId')
    this.showSpinner = true;
    this.getProfile()
    this.userService
      .getProfileWeight(this.emailId)
      .subscribe((response: any) => {
        this.profileWeight = response.profileWeight
        console.log(response)
        this.showSpinner = false
      })
  }

  closeSidebar() {
    this.renderer.setStyle(this.sidebarMenu.nativeElement, 'display', 'none');
  }

  toggleSidebar() {
    const currentDisplay = this.sidebarMenu.nativeElement.style.display;
    if (currentDisplay === 'none' || currentDisplay === '') {
      this.renderer.setStyle(this.sidebarMenu.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.sidebarMenu.nativeElement, 'display', 'none');
    }
  }

  getProfile() {
    this.showSpinner = true;
    this.userService
      .getSocialMediaProfile(this.emailId)
      .subscribe((response: any) => {
        this.showSpinner = false
        this.userService.refreshData()
        console.log(response)
        if (response.records.length !== 0) {
          const record = response.records[0]
          this.insertionType = 'updateProfile'
          this.linkedInUrl = record.linkedIn
          this.instagramUrl = record.instagram
          this.facebookUrl = record.faceBook
          this.twitterUrl = record.twitter
        } else {
          this.insertionType = 'saveProfile'
        }
      })
    this.userService
      .getProfileImage(this.emailId)
      .subscribe((response: any) => {
        this.showSpinner = false
        this.products = response.records
        console.log(response)
      })
  }


  getImageSource(): string {
    if (this.products && this.products.length > 0) {
      this.profileImageType = 'updateImage'
      return this.products[0].imagePath
    } else {
      this.profileImageType = 'insertImage'
      return 'assets/img/empty_Image.png'
    }
  }
  
  shareOnSocialMedia(media: string) {
    this.CickedsocialMedia = media;
    if (this.CickedsocialMedia === 'twitter') {
      this.inputValue = this.twitterUrl
    } else if (this.CickedsocialMedia === 'facebook') {
      this.inputValue = this.facebookUrl
    } else if (this.CickedsocialMedia === 'instagram') {
      this.inputValue = this.instagramUrl
    } else if (this.CickedsocialMedia === 'linkedin') {
      this.inputValue = this.linkedInUrl
    }
  }

  saveSocialMediaUrl() {
    let urlRegex: RegExp
    switch (this.CickedsocialMedia) {
      case 'twitter':
        urlRegex =
          /^(https?:\/\/)?(www\.)?x\.com\/[a-zA-Z0-9_]{1,15}(\/\w+)*\/?$/
        break
      case 'facebook':
        urlRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/(?:[^/]+|pages\/\w+)$/
        break
      case 'instagram':
        urlRegex =
          /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.\-]+(\/\w+)*\/?$/
        break
      case 'linkedin':
        urlRegex =
          /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.]+(\/\w+)*\/?$/
        break
      default:
        alert('Invalid social media platform')
        return
    }

    if (!this.inputValue || !urlRegex.test(this.inputValue)) {
      alert('Invalid URL')
      return
    }

    this.socialMediaUrls[this.CickedsocialMedia] = this.inputValue
    switch (this.CickedsocialMedia) {
      case 'twitter':
        this.twitterUrl = this.inputValue
        break
      case 'facebook':
        this.facebookUrl = this.inputValue
        break
      case 'instagram':
        this.instagramUrl = this.inputValue
        break
      case 'linkedin':
        this.linkedInUrl = this.inputValue
        break
    }

    this.onSubmit()
  }

  onSubmit() {
    // this.showSpinner = true
    const profileData = new FormData()
    if (this.emailId) profileData.append('emailId', this.emailId)
    if (this.twitterUrl) profileData.append('twitter', this.twitterUrl)
    if (this.facebookUrl) profileData.append('faceBook', this.facebookUrl)
    if (this.linkedInUrl) profileData.append('linkedIn', this.linkedInUrl)
    if (this.instagramUrl) profileData.append('instagram', this.instagramUrl)
    console.log(profileData)
    if (this.insertionType === 'saveProfile') {
      this.userService.uploadSocialMedia(profileData).subscribe(
        (response: any) => {
          // this.showSpinner = false
          console.log(response.message)
          this.userService.refreshData()
          window.location.reload()
        },
        (error: any) => {
          // this.showSpinner = false
          console.error('Error occurred while saving profile:', error)
        }
      )
    } else {
      this.userService.updateSocialMedia(profileData).subscribe(
        (response: any) => {
          // this.showSpinner = false
          console.log(response.message)
          this.userService.refreshData()
          window.location.reload()
        },
        (error: any) => {
          // this.showSpinner = false
          console.error('Error occurred while updating profile:', error)
        }
      )
    }
    this.getProfile()
  }

  logOut() {
    this.faService.clearSession()
    this.router.navigate([''])
    window.location.reload();
  }

}

