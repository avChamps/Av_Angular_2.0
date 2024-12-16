import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { salaryRangeValidator } from 'src/custom-validators/salaryValidators';

@Component({
  selector: 'app-ekart',
  templateUrl: './ekart.component.html',
  styleUrls: ['../job-portal/job-portal.component.css', './ekart.component.css',]
})
export class EkartComponent implements OnInit {
  itemForm!: FormGroup;
  showSpinner: boolean = true;
  isDisplayCoins: boolean = false;
  isMenuVisible: boolean = false;
  isMobileView: boolean = false;
  displayDeleteBtn: boolean = false;
  isLoading : boolean = false;
  searchQuery: string = '';
  category: string = '';
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
  selectedProduct: any;
  msgType: string = 'Post Job';
  btnType: string = 'apply'
  uniqueLocations: any;
  selectedFile: any;
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

  itemCategory = [
    { label: 'Audio', value: 'audio' },
    { label: 'Video', value: 'video' },
    { label: 'UCC', value: 'ucc' },
    { label: 'Control', value: 'control' },
    { label: 'Accessors', value: 'accessors' }
  ];

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
    this.itemForm = this.fb.group({
      id: [],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(100)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      image: [''],
      email: [this.emailId],
      userName: [this.userName],
    });
    this.updateImageValidation();
  }
  
  updateImageValidation() {
    if (this.btnType == 'apply') {
      this.itemForm.get('image')?.setValidators([Validators.required]);
    } else {
      this.itemForm.get('image')?.clearValidators(); 
    }
    this.itemForm.get('image')?.updateValueAndValidity();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  clearFileInput(): void {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input
    }
  }

  onItemSubmit(): void {
    this.isMenuVisible = false;
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('title', this.itemForm.get('title')?.value);
    formData.append('description', this.itemForm.get('description')?.value);
    formData.append('category', this.itemForm.get('category')?.value);
    formData.append('location', this.itemForm.get('location')?.value);
    formData.append('mobile', this.itemForm.get('mobile')?.value);
    formData.append('price', this.itemForm.get('price')?.value);
    formData.append('email', this.emailId);
    formData.append('userName', this.userName);

    // Attach the file
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    } else {
      console.error('No file selected.');
    }

    this.showSpinner = true;
    this.isLoading = true;
    if (this.btnType === 'apply') {
    this.userService.insertCart(formData).subscribe(
      (response: any) => {
        console.log('Job added:', response);
        this.cancelPopup.nativeElement.click();
        this.isDisplayCoins = true;
        this.isLoading = false;
        this.displayCoins = 50;
        this.totalRecords = 0;
        this.postedJobs = [];
        this.onReload()
        this.getPostedJobs();
        this.itemForm.reset();
        this.clearFileInput();
        this.showSpinner = false;
      },
      (error: any) => {
        console.error('Error:', error);
        this.showSpinner = false;
        this.isLoading = false;        
      }
    );
  } else {
    this.isLoading = true;
    this.userService.editProduct(this.itemForm.value)
    .subscribe((response: any) => {
      this.isLoading = false;
      console.log('Job updated:', response);
      this.cancelPopup.nativeElement.click();
      this.totalRecords = 0;
      this.postedJobs =  [];
      this.onReload()
      this.itemForm.reset();
      this.getPostedJobs();
      this.showSpinner = false;
    });
  }
}



  onEdit() {
    this.isMenuVisible = false;
    this.btnType = 'Edit'
    this.msgType = 'Edit Job';
    this.displayDeleteBtn = true;
    this.getPostedJobs('', '', this.emailId)
  }

  onfilter() {
    this.btnType = 'apply'
    this.displayDeleteBtn = false;
  }


  editJob(job: any, btnType: any): void {
    debugger;
    if (this.btnType === 'apply') {
      this.selectedProduct = job;
      const modalElement = this.jobDetailsModal.nativeElement;
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    } else {
      this.jobPopup.nativeElement.click();
      this.itemForm.patchValue({
        id: job.id,
        title: job.title,
        description: job.description,
        category: job.category,
        location: job.location,
        mobile: job.mobile || '',
        price: job.price || '',
        image: '',
        email: this.emailId,
        userName: this.userName
      });
      this.updateImageValidation();
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
    this.userService.getPostedproducts(this.limit, this.offset, this.searchQuery, location, this.category, this.postedBy, sortBy, email)
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
      this.category = type.label;
    } else {
      this.category = '';
    }

    this.isMenuVisible = false;
    this.onfilter();
    this.getPostedJobs();
  }

  deleteJob(job: any) {
    this.itemForm.patchValue({
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      location: job.location,
      mobile: job.mobile || '',
      price: job.price || '',
      image: '',
      email: this.emailId,
      userName: this.userName
    });
    this.userService.deleteProduct(this.itemForm.value)
      .subscribe((response: any) => {
        console.log('Job updated:', response);
        this.cancelPopup.nativeElement.click();
        this.totalRecords = 0;
        this.postedJobs = [];
        this.onReload()
        this.getPostedJobs();
        this.showSpinner = false;
        this.itemForm.reset();
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

  isChecked(category: { label: string }): boolean {
    return this.category === category.label;
  }

  setSelectedJob(job: any): void {
    this.selectedProduct = job; // Set the selected job
  }

  logOut() {
    this.faService.clearSession()
    this.router.navigate([''])
  }

  onReload() {
    this.onfilter();
    this.getPostedJobs();
  }
}

