import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserServicesService } from '../services/user-services.service';
import { Router } from '@angular/router';
import { FaServiceService } from '../services/fa-service.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { salaryRangeValidator } from 'src/custom-validators/salaryValidators';

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
  limit: number = 10;
  offset: number = 0;
  totalRecords: number = 0;
  postedBy: string = '';
  sortBy: string = 'newest'
  emailId: string = 'disendra889@gmail.com';
  userName: string = 'Disendra';
  profileImg: any;
  profileData: any = [];
  postedJobs: any = [];
  displayCoins: number = 0;
  selectedJob: any;
  buttonType: string = 'Apply Now';
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

  jobs = [
    {
      title: 'Junior UI/UX Designer',
      company: 'Slack Technologies, LLC',
      description: 'We are looking for a talented designer to create beautiful and functional interfaces...',
      type: 'Fulltime',
      location: 'Hyderabad',
    },
    {
      title: 'Mobile UI Designer',
      company: 'LINE Corporation',
      description: 'A UI Designer is a technical role that focuses on product development in a way...',
      type: 'Fulltime',
      location: 'Pune',
    },
    {
      title: 'Junior UI/UX Designer',
      company: 'Slack Technologies, LLC',
      description: 'We are looking for a talented designer to create beautiful and functional interfaces...',
      type: 'Fulltime',
      location: 'Chennai',
    },
    {
      title: 'Mobile UI Designer',
      company: 'LINE Corporation',
      description: 'A UI Designer is a technical role that focuses on product development in a way...',
      type: 'Fulltime',
      location: 'Hyderabad',
    }
  ];


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

  locations = [
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Pune", value: "Pune" },
    { label: "Delhi", value: "Delhi" },
    { label: "Chennai", value: "Chennai" },
    { label: "Bangalore", value: "Bangalore" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Ahmadabad", value: "Ahmadabad" },
    { label: "Kolkata", value: "Kolkata" },
    { label: "Goa", value: "Goa" }
  ]


  constructor(private jobPortaService: UserServicesService, private faService: FaServiceService, private cdr: ChangeDetectorRef, private userService: UserServicesService,
    private router: Router, private toastr: ToastrService, private fb: FormBuilder) {
    this.generateForm();
  }

  ngOnInit(): void {
    this.isMobileView = window.innerWidth < 768;
    // this.emailId = localStorage.getItem('emailId')
    // this.userName = localStorage.getItem('userName');
    this.getProfileImage();
    this.getPostedJobs();
  }

  generateForm() {
    this.jobForm = this.fb.group({
      id: [],
      jobRole: ['', Validators.required],
      companyName: ['', [Validators.pattern(/^[a-zA-Z\s]+$/), Validators.required, Validators.maxLength(50)]], // Max length validation for company name
      description: [''],
      location: ['', Validators.required],
      companyUrl: ['', [Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/),],],
      jobType: ['', Validators.required],
      minSalary: [''],
      maxSalary: [''],
      companyEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: [this.emailId],
      userName: [this.userName],
    },
      { validators: salaryRangeValidator });
  }


  onJobApply(): void {
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
          this.getPostedJobs();
          this.jobForm.reset();
          this.showSpinner = false;
        });
    }
  }


  onEdit() {
    this.buttonType = 'Update Job';
    this.msgType = 'Edit Job';
    this.displayDeleteBtn = true;
  }

  editJob(job: any): void {
    if (this.buttonType == 'Apply Now') {
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
        minSalary: job.minSalary ? parseInt(job.minSalary) : '',
        maxSalary: job.maxSalary ? parseInt(job.maxSalary) : '',
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


  getPostedJobs(sortBy: string = 'newest', location: string = '') {
    this.showSpinner = true
    this.userService.getPostedJobs(this.limit, this.offset, this.searchQuery, location, this.jobType, this.postedBy, sortBy)
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


  updateSelectedJobTypes(type: any) {
    this.jobType = type.label;
    this.getPostedJobs();
  }

  deleteJob(job: any) {
    this.jobForm.patchValue({
      jobRole: job.jobRole,
      id: job.id,
      companyName: job.companyName,
      description: job.description,
      location: job.location,
      companyUrl: job.companyUrl || '',
      jobType: job.jobType,
      minSalary: job.minSalary || '',
      maxSalary: job.maxSalary || '',
      companyEmail: job.companyEmail || '',
      phone: job.phone || ''
    });
    this.userService.deleteJob(this.jobForm.value)
      .subscribe((response: any) => {
        console.log('Job updated:', response);
        this.cancelPopup.nativeElement.click();
        this.getPostedJobs();
        this.showSpinner = false;
        this.jobForm.reset();
      });
  }

  logOut() {
    this.faService.clearSession();
    this.router.navigate(['']);
    window.location.reload();
  }

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

}
