import { Component } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';

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
  visiblePages: number[] = [];
  companyName!: string;
  profileImage: any[] = [];
  showClickedData: boolean = false;
  showFilters: boolean = true;
  searchBox: boolean = true;
  showSpinner: boolean = false;
  filterTerm: string = '';
  emptyLinks: string = 'The user has not updated';

  constructor(
    private faService: FaServiceService,
    private userService: UserServicesService,
    private authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.getData(0, this.pageSize);
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
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getData((page - 1) * this.pageSize, this.pageSize);
  }

  updateVisiblePages(): void {
    const pages = [];

    if (this.currentPage <= 3) {
      // Show the first few pages
      for (let i = 2; i <= Math.min(4, this.totalPages - 1); i++) {
        pages.push(i);
      }
    } else if (this.currentPage > 3 && this.currentPage < this.totalPages - 2) {
      // Show the pages around the current page
      pages.push(this.currentPage - 1);
      pages.push(this.currentPage);
      pages.push(this.currentPage + 1);
    } else {
      // Show the last few pages
      for (let i = this.totalPages - 3; i < this.totalPages; i++) {
        if (i > 1) pages.push(i);
      }
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
