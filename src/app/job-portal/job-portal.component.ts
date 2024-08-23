import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserServicesService } from '../services/user-services.service';
import { Router } from '@angular/router';
import { FaServiceService } from '../services/fa-service.service';

@Component({
  selector: 'app-job-portal',
  templateUrl: './job-portal.component.html',
  styleUrls: ['./job-portal.component.css']
})
export class JobPortalComponent implements OnInit {
  jobType: string = 'full-time';
  filteredJobType : any;
  job_role: string = '';
  minSalary = '';
  maxSalary!: number;
  email!: string;
  phone!: number;
  location: string = '';
  company!: string
  pageSize: number = 10;
  currentPage: number = 1;
  searchKeyword: string = '';
  companyUrl!: string;
  postedJobs: any[] = []
  categories: any[] = []
  contactInfo: any = {};
  displayShowPosts: boolean = false;
  displayAllPosts: boolean = true;
  postedBy: string = '';
  buttonType: string = 'Upload';
  userName: any = 'Disendra';
  emailId: any = 'disendra889@gmail.com';
  profileImg: any[] = [];
  jobHeadline: string = 'Post A Job'
  slNo: any;
  isContact: boolean = false;
  ShowJobPrtal: boolean = true;

  jobRoles = [] = [
    { label: "Live Events", value: "live_events" },
    { label: "Installation Professionals", value: "installation_professionals" },
    { label: "Sales & Marketing", value: "sales_marketing" },
    { label: "Project Engineer", value: "project_engineer" },
    { label: "Design Engineer", value: "design_engineer" },
    { label: "CAD Engineer", value: "cad_engineer" },
    { label: "AV Engineer", value: "av_engineer" },
    { label: "Others", value: "others" }
  ];

  jobTypes = [] = [
    { label: 'Full-Time', value: 'full-time', active: true },
    { label: 'Part-Time', value: 'part-time', active: false },
    { label: 'Contract', value: 'contract', active: false },
    { label: 'Internship', value: 'internship', active: false }
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
    private router: Router) { }
  ngOnInit(): void {
    // this.emailId = localStorage.getItem('emailId')
    // this.userName = localStorage.getItem('userName');
    this.userName = 'Disendra'

    this.getProfileImage()
    this.getPostedJobs('search');
  }


  getProfileImage() {
    // this.showSpinner = true
    this.userService
      .getProfileImage(this.emailId)
      .subscribe((response: any) => {
        console.log(response)
        // this.showSpinner = false
        this.profileImg = response.records
      })
  }

  getImageSource(): string {
    if (this.profileImg && this.profileImg.length > 0) {
      return this.profileImg[0].imagePath
    } else {
      return '../assets/img/blank-user-directory.png'
    }
  }

  loadMoreJobs() {
    this.currentPage++
    this.getPostedJobs('more')
  }


  getPostedJobs(type: any) {
    if (type === 'search') {
      this.postedJobs = [];
    }
    this.jobPortaService.getPostedJobs(this.pageSize, (this.currentPage - 1) * this.pageSize, this.searchKeyword, this.location, this.jobType , this.postedBy)
      .subscribe((response: any) => {
        let jobsResponse = response.records;
        this.postedJobs = [...this.postedJobs, ...jobsResponse];
        this.categories = response.jobRolesCount;
        console.log(response);
        this.scrollToBottom();
      })
  }


  myPosts() {
    this.displayShowPosts = true;
    this.displayAllPosts = false;
    this.ShowJobPrtal = true;
    this.isContact = false;
    this.postedJobs = [];
    this.postedBy = this.emailId;
    this.jobPortaService.getPostedJobs(this.pageSize, (this.currentPage - 1) * this.pageSize, this.searchKeyword, this.location, this.jobType, this.postedBy)
      .subscribe((response: any) => {
        this.postedJobs = response.records;
      })
  }

  getJobRoleDisplayName(job_role: string): string {
    const displayNames: { [key: string]: string } = {
      live_events: 'Live Events',
      installation_professionals: 'Installation Professionals',
      sales_marketing: 'Sales & Marketing',
      project_engineer: 'Project Engineer',
      design_engineer: 'Design Engineer',
      cad_engineer: 'CAD Engineer',
      av_engineer: 'AV Engineer',
      others: 'Others'
    };

    return displayNames[job_role] || job_role;
  }


  setActiveTab(selectedTab: any) {
    this.jobTypes.forEach(tab => tab.active = false);
    selectedTab.active = true;
    this.jobType = selectedTab.value;
    this.currentPage = 1;
    this.getPostedJobs('search');
    this.cdr.detectChanges();
  }

  onDropdownChange(event: any) {
    const selectedValue = event.target.value;
  
  this.jobTypes.forEach(tab => {
    if (tab.value === selectedValue) {
      tab.active = true;
    } else {
      tab.active = false;
    }
  });
    // Update the current job type and reload the jobs
    this.jobType = selectedValue;
    this.currentPage = 1;
    // this.getPostedJobs('search');
}

  onSubmit(form: NgForm) {
    if (this.buttonType === 'Upload') {
      if (form.valid) {
        const applicationData = {
          job_role: this.job_role,
          jobType: this.jobType,
          minSalary: this.minSalary,
          maxSalary: this.maxSalary,
          email: this.email,
          phone: this.phone,
          company: this.company,
          location: this.location,
          companyUrl: this.companyUrl,
          postedBy: this.emailId
        };

        this.jobPortaService.submitApplication(applicationData).subscribe(
          response => {
            alert(response.message);
            console.log('Application submitted successfully', response);
            window.location.reload();
          },
          error => {
            console.error('Error submitting application', error);
          }
        );
      } else {
        Object.keys(form.controls).forEach(field => {
          const control = form.control.get(field);
          control?.markAsTouched({ onlySelf: true });
        });
      }
    }
    else {
      this.uploadEditJob()
    }
  }

  applyDetails(details: any) {
    console.log(details);
    this.contactInfo = details;
  }

  editJob(job: any) {
    console.log(job);
    this.buttonType = 'Save';
    this.job_role = job.job_role;
    this.company = job.company;
    this.location = job.location,
      this.jobType = job.job_type;
    this.minSalary = job.min_salary;
    this.maxSalary = job.max_salary;
    this.email = job.email;
    this.phone = job.phone;
    this.companyUrl = job.companyUrl;
    this.slNo = job.slNo;
    this.cdr.detectChanges();
  }


  uploadEditJob() {
    const applicationData = {
      job_role: this.job_role,
      jobType: this.jobType,
      minSalary: this.minSalary,
      maxSalary: this.maxSalary,
      email: this.email,
      phone: this.phone,
      company: this.company,
      location: this.location,
      companyUrl: this.companyUrl,
      postedBy: this.emailId,
      slNo: this.slNo
    };
    this.jobPortaService.editJob(applicationData).subscribe(
      response => {
        alert(response.message);
        console.log('Application submitted successfully', response);
        // this.clearInputs();
        window.location.reload();
      },
      error => {
        console.error('Error submitting application', error);
      }
    );
  }



  deleteJob(job: any) {
    console.log(job)
    // this.showSpinner = true
    const applicationData = {
      job_role: job.job_role,
      company: job.company,
      slNo: job.slNo
    };
    const confirmation = confirm('Are you sure you want to delete the Post?')
    if (!confirmation) {
      return
    }
    this.jobPortaService.deleteJob(applicationData).subscribe((response: any) => {
      console.log('Response from server:', response)
      // this.showSpinner = false
      if (response && response.status) {
        alert(response.message);
        this.refreshPage();
        // window.location.reload();
      } else {
        alert('An error occurred. Please try again later.')
      }
    })
  }

  clearInputs() {
    this.jobType = '';
    this.job_role = '';
    this.minSalary = '';
    this.maxSalary = 0;
    this.email = '';
    this.phone = 0;
    this.location = '';
    this.companyUrl = '';
  }

  refreshPage() {
    window.location.reload();
  }

  logOut() {
    this.faService.clearSession();
    this.router.navigate(['/home-page']);
    window.location.reload();
  }

  contactForm() {
    this.isContact = true;
    this.ShowJobPrtal = false;
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight, // Scrolls to the bottom of the page
      behavior: 'smooth' // Enables smooth scrolling
    });
  }

  scrollToTop() {
    window.scrollTo({
      top : 0,
      behavior : 'smooth'
    })
  }

}