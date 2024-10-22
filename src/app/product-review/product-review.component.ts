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
  linkCopied: boolean = false
  emailId: any;
  urlLink: any;
  userName!: string;
  displayUserName: any;
  productName!: string;
  reviews: any;
  changeName: string = '';
  currentRating: number = 0;
  totalRatings: number = 0;
  rating: number = 0;
  selectedDevice: any;
  averageRating: any;
  reviewData: any[] = []
  ratingsData: any[] = [];
  feedbackData: any[] = [];
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
    // this.userName = localStorage.getItem('userName');
    this.totalRatings = this.ratingsData.reduce((acc, curr) => acc + curr.ratingCount, 0);
    this.getRatings();
    this.getProductReview();
  }

  devices = [
    { name: 'Neat Frame', image: 'https://avchamps.com/testing/Product-Images/neat_frame.jpg', clickOption: 'neatFrame' },
    { name: 'Neat Bar', image: 'https://avchamps.com/testing/Product-Images/sound_bar.png', clickOption: 'neatBar' },
    { name: 'Neat Bar Pro', image: 'https://avchamps.com/testing/Product-Images/sound_bar_pro.jpg', clickOption: 'neatBarPro' }
  ];

  setRating(value: number): void {
    this.rating = value;
  }

  getProductReview(): void {
    const data = {
      productName: this.productName
    };

    this.userService.getProductReview(data).subscribe(
      (response: any) => {
        console.log(response);
        this.showSpinner = false;
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
  }

  getProgressWidth(star: number): number {
    const count = this.getRatingCount(star);
    if (this.totalRatings === 0) return 0;
    return (count / this.totalRatings) * 100;
  }




  getRatings(): void {
    const data = { productName: this.productName };
    console.log('getRatings request payload:', data); // Log to check payload

    this.userService.getRatings(data).subscribe(
      (response: any) => {
        console.log(response); // Log the response
        this.showSpinner = false;

        if (response && response.status) {
          this.ratingsData = response.data;
          this.feedbackData = response.data;

          if (this.ratingsData.length > 0) {
            this.mapRatingCounts();
            this.totalRatings = this.ratingsData.reduce((acc, curr) => acc + curr.ratingCount, 0);
            this.averageRating = this.ratingsData.reduce(
              (acc, curr) => acc + curr.rating * curr.ratingCount, 0
            ) / this.totalRatings;
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
        console.error('Error fetching ratings:', error); // Log any errors
        this.showSpinner = false;
      }
    );
  }




  insertProductReview(reviewForm: NgForm): void {
    this.showSpinner = true;
    if (!reviewForm.valid) {
      this.showSpinner = false;
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
        this.showSpinner = false;
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
  }

  insertProductFeedback(reviewNumber: any, type: any) {
    this.showSpinner = true;
    const feedbackKey = `productFeedback_${reviewNumber}`;
    const previousFeedback = localStorage.getItem(feedbackKey);

    if (previousFeedback) {
      this.showSpinner = false;
      alert('You have already provided feedback for this review.');
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
      emailId: 'disendra889@gmail.com',
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
    this.ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.ratingsData.forEach((ratingItem: any) => {
      const star = ratingItem.rating;
      const count = ratingItem.ratingCount;
      if (this.ratingCounts[star] !== undefined) {
        this.ratingCounts[star] = count;
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

  onBack() {
    this.router.navigate(['product-list']);
  }

}

