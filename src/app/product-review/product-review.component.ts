import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserServicesService } from '../services/user-services.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.css']
})
export class ProductReviewComponent implements OnInit {
  showSpinner: boolean = false;
  showEmptyProducts: boolean = false;
  linkCopied: boolean = false;
  emailId: any;
  urlLink: any;
  userName: any;
  displayUserName: any;
  productName!: string;
  reviews: any;
  changeName: string = 'no';
  currentRating: number = 0;
  totalRatings: number = 0;
  rating: number = 0;
  selectedDevice: any;
  averageRating: number = 0;
  reviewData: any[] = []
  ratingsData: any[] = [];
  feedbackData: any[] = [];
  fullStars: number[] = [];
  hasHalfStar = false;
  emptyStars: number[] = [];
  ratingsMap: { [key: number]: { count: number, percentage: number } } = {};
  ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('showRating') showRating!: ElementRef<HTMLButtonElement>;

  constructor(
    private userService: UserServicesService, @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService, private route: ActivatedRoute, private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.productName = params['option'];
      this.selectedDevice = this.devices.find(device => device.clickOption === this.productName);
    });
    this.urlLink = document.location;
  }

  ngOnInit(): void {
    this.emailId = localStorage.getItem('emailId')
    this.userName = localStorage.getItem('userName');
    this.totalRatings = this.ratingsData.reduce((acc, curr) => acc + curr.ratingCount, 0);
    if(!this.emailId && !this.userName) {
      this.router.navigate(['login-page/product-list-review/neatBar']);
    } else {
    this.getRatings();
    this.getProductReview();
    }
    this.setStars();    
  }

  devices = [
    { name: 'Neat Frame', image: 'https://avchamps.com/testing/Product-Images/neat_frame.jpg', clickOption: 'neatFrame' },
    { name: 'Neat Bar', image: 'https://avchamps.com/testing/Product-Images/sound_bar.png', clickOption: 'neatBar' },
    { name: 'Neat Bar Pro', image: 'https://avchamps.com/testing/Product-Images/sound_bar_pro.jpg', clickOption: 'neatBarPro' }
  ];

  setRating(value: number): void {
    this.rating = value;
  }

  setStars() {
    const fullStarCount = Math.floor(this.averageRating);
    const hasHalfStar = this.averageRating % 1 >= 0.5;
    const emptyStarCount = 5 - fullStarCount - (hasHalfStar ? 1 : 0);

    this.fullStars = Array(fullStarCount).fill(0);
    this.hasHalfStar = hasHalfStar;
    this.emptyStars = Array(emptyStarCount).fill(0);
  }

  getProductReview(): void {
    this.showSpinner = true;
    const data = {
      productName: this.productName
    };

    this.userService.getProductReview(data).subscribe(
      (response: any) => {
        console.log(response);
        this.closeButton.nativeElement.click();
        if (response.status === false) {
          this.showEmptyProducts = true;
        }
        if (response && response.status) {
          this.reviewData = response.data;
        } else {
          //  this.displayError();
        }
      }
    );
    this.showSpinner = false;
  }

  getProgressWidth(star: number): number {
    const count = this.getRatingCount(star);
    if (this.totalRatings === 0) return 0;
    return (count / this.totalRatings) * 100;
  }

  getRatings(): void {
    this.showSpinner = true;
    const data = { productName: this.productName };
    console.log('getRatings request payload:', data); // Log to check payload

    this.userService.getRatings(data).subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.status) {
          this.ratingsData = response.data;
          this.feedbackData = response.data;

          if (this.ratingsData.length > 0) {
            this.mapRatingCounts();
            this.totalRatings = this.ratingsData.reduce((acc, curr) => acc + curr.ratingCount, 0);
            this.averageRating = this.ratingsData.reduce(
              (acc, curr) => acc + curr.rating * curr.ratingCount, 0
            ) / this.totalRatings;
            this.setStars();
          } else {
            // If there are no records, set totalRatings and averageRating to 0
            this.totalRatings = 0;
            this.averageRating = 0;
          }
        } else {
          this.totalRatings = 0;
          this.averageRating = 0;
        }
      },
      (error: any) => {
        console.error('Error fetching ratings:', error);
      }
    );
    this.showSpinner = false;
  }

  insertProductReview(reviewForm: NgForm): void {
    this.showSpinner = true;
    if (!reviewForm.valid) {
      return;
    }

    if (!this.displayUserName) {
      this.displayUserName = this.userName
    }
    const data = {
      emailId: this.emailId,
      displayUserName: this.displayUserName,
      productName: this.productName,
      reviews: this.reviews,
      rating: this.rating
    };

    this.userService.insertProductReview(data).subscribe(
      (response: any) => {
        this.closeButton.nativeElement.click();
        this.getRatings();
        this.getProductReview();
        if (response && response.status) {
          this.userService.refreshData();
          this.toastr.success(response.message, 'Success', {
            positionClass: 'toast-custom-position',
            timeOut: 3000,
            closeButton: true,
            progressBar: true
          });
        } else {
          //  this.displayError();
        }
      }
    );
    this.showSpinner = false;
  }

  insertProductFeedback(reviewNumber: any, type: any) {
    const feedbackKey = `productFeedback_${reviewNumber}`;
    const previousFeedback = localStorage.getItem(feedbackKey);

    if (previousFeedback) {
      return;
    }

    let dislike = 0;
    let like = 0;

    if (type === 'dislike') {
      dislike = 1;
    } else if (type === 'like') {
      like = 1;
    }

    const data = {
      emailId: this.emailId,
      displayUserName: this.userName,
      productName: this.productName,
      reviewNumber: reviewNumber,
      likes: like,
      dislike: dislike
    };

    this.userService.insertProductFeedback(data).subscribe(
      (response: any) => {
        this.showSpinner = false;
        this.closeButton.nativeElement.click();
        if (response && response.status) {
          console.log(response);
          localStorage.setItem(feedbackKey, type);
          this.getRatings();
          this.getProductReview();
        } else {
          // this.displayError();
        }
      });
  }

  mapRatingCounts(): void {
    const totalRatings = this.ratingsData.reduce((acc, curr) => acc + curr.ratingCount, 0);
    this.ratingsMap = {
      5: { count: 0, percentage: 0 },
      4: { count: 0, percentage: 0 },
      3: { count: 0, percentage: 0 },
      2: { count: 0, percentage: 0 },
      1: { count: 0, percentage: 0 }
    };

    // Map the response data to the ratingsMap
    this.ratingsData.forEach(ratingObj => {
      const rating = ratingObj.rating;
      const count = ratingObj.ratingCount;
      const percentage = (count / totalRatings) * 100;

      if (this.ratingsMap[rating]) {
        this.ratingsMap[rating].count = count;
        this.ratingsMap[rating].percentage = percentage;
      }
    });
  }


  getRatingCount(star: number): number {
    return this.ratingCounts[star] || 0;
  }

  getProgressBarWidth(star: number): string {
    const totalCount = this.ratingsData.reduce((sum, item) => sum + item.ratingCount, 0);
    const count = this.ratingCounts[star];
    return totalCount ? ((count / totalCount) * 100).toFixed(2) + '%' : '0%';
  }

  // displayError() {
  //   this.toastr.error('Failed to post product review. Please try again later.', 'Error', {
  //     positionClass: 'toast-custom-position',
  //     timeOut: 3000,
  //     closeButton: true,
  //     progressBar: true
  //   });
  // }

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

  displayRating() {
    this.showRating.nativeElement.click();
  }

  onClear() {
    this.reviews = '';
    this.rating = 0;
  }

  onBack() {
    this.showSpinner = true
    setTimeout(() => {
      this.router.navigate(['product-list/sub-page']);
      this.showSpinner = false;
    }, 1000);
  }

}

