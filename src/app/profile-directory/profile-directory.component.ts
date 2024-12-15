import { Component } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-directory',
  templateUrl: './profile-directory.component.html',
  styleUrls: ['./profile-directory.component.css']
})
export class ProfileDirectoryComponent {
  twitterUrl: string | null = null;
  facebookUrl: string | null = null;
  instagramUrl: string | null = null;
  linkedInUrl: string | null = null;
  userEmailId: string | null = null;
  imagePath: string | null = null;
  userData: any[] = [];
  pagedUserData: any[] = [];
  clickedUserData: any[] = [];
  profileData: any[] = [];
  pageSize: number = 10;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  pageInput: number = 1;
  maxVisiblePages: number = 5;
  visiblePages: number[] = [];
  companyName!: string;
  profileImage: any[] = [];
  showClickedData: boolean = false;
  showFilters: boolean = true;
  searchBox: boolean = true;
  showSpinner: boolean = false;
  filterTerm: string = '';
  constructor(
    private faService: FaServiceService,
    private userService: UserServicesService,
    private authService: AuthServiceService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params['search']) {
        this.filterTerm = params['search'];
        console.log(this.filterTerm);
      }
    });
    this.getData(0, this.pageSize);
    let language = localStorage.getItem('selectedLanguage') || 'english';
    this.translate.setDefaultLang(language);
  }

  getData(offset: number, limit: number): void {
    this.showSpinner = true;
    this.faService.getUserDetails(offset / limit + 1, limit, this.filterTerm).subscribe((response: any) => {
      console.log('Response from server:', response);
      this.userData = response.records;
      this.totalRecords = response.totalCount;
      this.pagedUserData = this.userData;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      this.updateVisiblePages();
      this.showSpinner = false;
    });
  }

  applyFilter(): void {
    this.getData(0, this.pageSize);
  }


  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageInput = page; // Sync the input with the current page
      this.getData((page - 1) * this.pageSize, this.pageSize);
      this.updateVisiblePages(); // Update the visible pages
    }
  }



  goToPage(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(this.currentPage - Math.floor(this.maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + this.maxVisiblePages - 1, this.totalPages);

    // Adjust startPage if the endPage goes beyond totalPages
    const adjustedStartPage = Math.max(1, endPage - this.maxVisiblePages + 1);

    for (let i = adjustedStartPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }


  goToPageInput(): void {
    if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
      this.changePage(this.pageInput);
    }
  }


  updateVisiblePages(): void {
    const pages: number[] = [];
    const maxVisible = this.maxVisiblePages;

    // Calculate the start and end of the visible range
    let startPage = Math.max(this.currentPage - Math.floor(maxVisible / 2), 1);
    let endPage = startPage + maxVisible - 1;

    // Adjust if endPage exceeds totalPages
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    // Generate the visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    this.visiblePages = pages;
  }


  showDetails(item: any): void {
    this.searchBox = false;
    this.showSpinner = true;
    this.showClickedData = true;
    console.log('Clicked Item Details:', item);
    const emailId = item.emailId;
    this.imagePath = item.imagePath;
    this.userService.getSocialMediaProfile(emailId).subscribe((response: any) => {
      this.showSpinner = false;
      if (response.records.length !== 0) {
        const records = response.records[0];
        this.twitterUrl = records.twitter || null;
        this.facebookUrl = records.faceBook || null;
        this.instagramUrl = records.instagram || null;
        this.linkedInUrl = records.linkedIn || null;
      }
    });

    this.clickedUserData = [item];
  }

  // scrollToTop() {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth'
  //   })
  // }

  clearFilter() {
    this.filterTerm = '';
    this.applyFilter();
  }

  onBack(): void {
    this.companyName = '';
    this.instagramUrl = '';
    this.facebookUrl = '';
    this.twitterUrl = '';
    this.linkedInUrl = '';
    this.searchBox = true;
    this.showClickedData = false;
    this.imagePath = '';
  }
}
