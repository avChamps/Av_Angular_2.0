import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserServicesService } from '../services/user-services.service';
import { Router } from '@angular/router';
import { FaServiceService } from '../services/fa-service.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { salaryRangeValidator } from 'src/custom-validators/salaryValidators';
import { event } from 'jquery';

@Component({
  selector: 'app-job-portal',
  templateUrl: './job-portal.component.html',
  styleUrls: ['./job-portal.component.css']
})
export class JobPortalComponent implements OnInit {
  jobForm!: FormGroup;
  showSpinner: boolean = true;
  isDisplayCoins: boolean = false;
  isMenuVisible: boolean = false;
  isMobileView: boolean = false;
  displayDeleteBtn: boolean = false;
  searchQuery: string = '';
  jobType: string = '';
  location: string = '';
  limit: number = 1000;
  offset: number = 0;
  totalRecords: number = 0;
  postedBy: string = '';
  selectedLocation: string = '';
  sortBy: string = 'newest'
  // emailId: string = 'disendra889@gmail.com';
  // userName: string = 'Disendra';
  emailId : any;
  userName : any;
  profileImg: any;
  profileData: any = [];
  postedJobs: any = [];
  displayCoins: number = 0;
  selectedJob: any;
  buttonType: string = 'Apply';
  msgType: string = 'Post Job';
  uniqueLocations: any;
  @ViewChild('cancelPopup') cancelPopup!: ElementRef<HTMLButtonElement>;
  @ViewChild('jobPopup') jobPopup!: ElementRef<HTMLButtonElement>;
  @ViewChild('jobDetais') jobDetailsModal!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobileView = window.innerWidth < 768;
    if (!this.isMobileView) {
      this.isMenuVisible = false;
    }
  }


  jobRoles = [] = [
    { label: "Live Events" },
    { label: "Installation Professionals" },
    { label: "Sales & Marketing" },
    { label: "Project Engineer" },
    { label: "Design Engineer" },
    { label: "CAD Engineer" },
    { label: "AV Engineer" },
    { label: "Others" }
  ];

  jobTypes = [] = [
    { label: 'Full-Time' },
    { label: 'Part-Time' },
    { label: 'Contract' },
    { label: 'Internship' }
  ]


  constructor(private jobPortaService: UserServicesService, private faService: FaServiceService, private cdr: ChangeDetectorRef, private userService: UserServicesService,
    private router: Router, private toastr: ToastrService, private fb: FormBuilder) {
    this.generateForm();
  }

  ngOnInit(): void {
    this.isMobileView = window.innerWidth < 768;
    this.emailId = localStorage.getItem('emailId')
    this.userName = localStorage.getItem('userName');
    this.getProfileImage();
    this.getPostedJobs();
  }

  generateForm() {
    this.jobForm = this.fb.group({
      id: [],
      jobRole: ['', Validators.required],
      companyName: ['', [Validators.pattern(/^[a-zA-Z0-9\s]+$/), Validators.required, Validators.maxLength(50)]],
      description: [''],
      location: ['', Validators.required],
      companyUrl: ['', [Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/),],],
      jobType: ['', Validators.required],
      experience: ['', [Validators.pattern(/^\d{1,2}$/)]],
      package: [''],
      companyEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: [this.emailId],
      userName: [this.userName],
    },
      { validators: salaryRangeValidator });
  }


  onJobApply(): void {
    this.isMenuVisible = false;
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    this.showSpinner = true;

    if (this.buttonType === 'Update Job') {
      // Update job logic
      this.userService.editJob(this.jobForm.value)
        .subscribe((response: any) => {
          console.log('Job updated:', response);
          this.cancelPopup.nativeElement.click();
          this.totalRecords = 0;
          this.postedJobs = [];
          this.onReload();
          this.jobForm.reset();
          this.getPostedJobs();
          this.showSpinner = false;
        });
    } else {
      // Add new job logic
      this.userService.submitApplication(this.jobForm.value)
        .subscribe((response: any) => {
          console.log('Job added:', response);
          this.cancelPopup.nativeElement.click();
          this.isDisplayCoins = true;
          this.displayCoins = 50;
          this.totalRecords = 0;
          this.postedJobs = [];
          this.onReload()
          this.getPostedJobs();
          this.jobForm.reset();
          this.showSpinner = false;
        });
    }
  }


  onEdit() {
    this.isMenuVisible = false;
    this.buttonType = 'Update Job';
    this.msgType = 'Edit Job';
    this.displayDeleteBtn = true;
    this.getPostedJobs('', '', this.emailId)
  }

  onfilter() {
    this.buttonType = 'Apply';
    this.displayDeleteBtn = false;
  }


  editJob(job: any): void {
    debugger;
    if (this.buttonType == 'Apply') {
      this.selectedJob = job;
      const modalElement = this.jobDetailsModal.nativeElement;
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    } else {
      this.jobPopup.nativeElement.click();
      this.jobForm.patchValue({
        jobRole: job.jobRole,
        id: job.id,
        companyName: job.companyName,
        description: job.description,
        location: job.location,
        companyUrl: job.companyUrl || '',
        jobType: job.jobType,
        experience: job.experience,
        package: job.package,
        companyEmail: job.companyEmail || '',
        phone: job.phone || '',
        email: [this.emailId],
        userName: [this.userName]
      });
    }
  }


  allowNumbersOnly(event: KeyboardEvent): boolean {
    const charCode = event.key.charCodeAt(0);
    // Allow only numbers (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }


  getProfileImage() {
    this.showSpinner = true
    this.userService
      .getProfileImage(this.emailId)
      .subscribe((response: any) => {
        console.log(response)
        this.showSpinner = false
        this.profileImg = response.records[0].imagePath;
        this.profileData = response.records[0];
        if (!this.profileImg && this.profileImg.length == 0) {
          this.profileImg = '../assets/img/blank-user-directory.png';
        }
      })
  }


  getPostedJobs(sortBy: string = 'newest', location: string = '', email = '') {
    this.showSpinner = true;
    this.selectedLocation = location;
    this.userService.getPostedJobs(this.limit, this.offset, this.searchQuery, location, this.jobType, this.postedBy, sortBy, email)
      .subscribe((response: any) => {
        console.log(response)
        this.showSpinner = false;
        this.totalRecords = response.totalRecords;
        this.postedJobs = response.records;
        if (!this.uniqueLocations || this.uniqueLocations.length === 0) {
          this.uniqueLocations = Array.from(
            new Set(
              response.records.map((job: { location: string }) => job.location.toLowerCase())
            )
          );
        }
      })
  }


  updateSelectedJobTypes(event: Event, type: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.jobType = type.label;
    } else {
      this.jobType = '';
    }

    this.isMenuVisible = false;
    this.onfilter();
    this.getPostedJobs();
  }

  deleteJob(job: any) {
    debugger;
    this.jobForm.patchValue({
      jobRole: job.jobRole,
      id: job.id,
      companyName: job.companyName,
      description: job.description,
      location: job.location,
      companyUrl: job.companyUrl || '',
      jobType: job.jobType,
      experience: job.experience,
      package: job.package,
      companyEmail: job.companyEmail || '',
      phone: job.phone || '',
      email: job.email,
      userName: job.userName
    });
    this.userService.deleteJob(this.jobForm.value)
      .subscribe((response: any) => {
        console.log('Job updated:', response);
        this.cancelPopup.nativeElement.click();
        this.totalRecords = 0;
        this.postedJobs = [];
        this.onReload();
        this.getPostedJobs();
        this.showSpinner = false;
        this.jobForm.reset();
      });
  }

  // onScroll(event: any): void {
  //   const element = event.target;
  //   if (element.scrollLeft !== 0) {
  //     return;
  //   }
  //   if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) {
  //     console.log('Scrolled to bottom'); 
  //     this.offset++; 
  //     this.getPostedJobs();
  //   }
  // }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  editProfile() {
    window.open('/profile-dashboard/about', '_blank');
  }

  navigateHome() {
    window.open('/profile-dashboard/feed', '_blank');
  }

  isChecked(jobType: { label: string }): boolean {
    return this.jobType === jobType.label;
  }

  setSelectedJob(job: any): void {
    this.selectedJob = job; // Set the selected job
  }

  onReload() {
    this.onfilter();
    this.getPostedJobs();
  }

  sendContact(email: any) {
    window.location.href = `mailto:${email}`;
  }

  formReset() {
    this.jobForm.reset()
  }

  logOut() {
    this.faService.clearSession()
    this.router.navigate([''])
  }

}
