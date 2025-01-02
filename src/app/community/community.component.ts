import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthServiceService } from '../services/auth-service.service';
import { CommunityService } from '../services/community.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['../job-portal/job-portal.component.css', './community.component.css']
})
export class CommunityComponent implements OnInit {
  itemForm!: FormGroup;
  showSpinner: boolean = true;
  isDisplayCoins: boolean = false;
  isMenuVisible: boolean = false;
  isMobileView: boolean = false;
  displayDeleteBtn: boolean = false;
  isLoading: boolean = false;
  searchQuery: string = '';
  questionType: string = '';
  location: string = '';
  limit: number = 1000;
  offset: number = 0;
  totalRecords: number = 0;
  postedBy: string = '';
  selectedLocation: string = '';
  sortBy: string = 'newest'
  // emailId: string = 'disendra889@gmail.com';
  // userName: string = 'Disendra';
  isEditing: boolean = false;
  selectedFile: File | null = null;
  selectedImagePath: string | null = null;
  emailId: string = ''; // Initialize as null
  userName: string = ''; // Initialize as null
  profileImg: any;
  profileData: any = [];
  postedJobs: any = [];
  displayCoins: number = 0;
  selectedProduct: any;
  msgType: string = 'Post Job';
  btnType: string = 'apply'
  uniqueLocations: any;
  selectedQuestionId: any;
  comments: any;
  newCommentText: any;
  //  selectedQuestionId: number | null = null; // To store the selected question ID for deletion
  newQuestion: {
    questionId: number;
    emailId: string;
    userName: string;
    questionText: string;
    questionType: string; // Add questionType property
  } = {
      questionId: 0, // Default to 0 when no question is selected
      emailId: this.emailId || '',
      userName: this.userName || '',
      questionText: '',
      questionType: '', // Default to an empty string
    };



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

  itemCategory = [
    { label: 'Error', value: 'audio' },
    { label: 'Audio', value: 'video' },
    { label: 'Video', value: 'ucc' },
    { label: 'Control', value: 'control' },
    { label: 'Hardware', value: 'accessors' }
  ];

  //  newQuestion: { emailId: string; userName: string; questionText: string } = {
  //   emailId: '',
  //   userName: '',
  //   questionText: '',
  // };

  constructor(private communityService: CommunityService, private faService: FaServiceService, private cdr: ChangeDetectorRef, private userService: UserServicesService,
    private router: Router, private toastr: ToastrService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.isMobileView = window.innerWidth < 768;
    this.emailId = localStorage.getItem('emailId') || ''
    this.userName = localStorage.getItem('userName') || '';
    this.getProfileImage();
    this.getPostedJobs();
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


  addComment(questionId: number, commentText: string) {
    if (!commentText.trim()) {
      alert('Comment text cannot be empty');
      return;
    }

    const newComment = {
      questionId: questionId,
      emailId: this.emailId,
      userName: this.userName,
      commentText: commentText,
    };

    this.communityService.addComment(newComment).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {
          // Refresh the comments after adding
          this.getComments(questionId);
          this.getPostedJobs();
          this.newCommentText = ''; // Clear the input field
        }
      },
      (error: any) => {
        console.error('Error adding comment:', error);
      }
    );
  }


  likeItem(questionId?: number, commentId?: number) {
    const payload = {
      questionId: questionId || undefined,
      commentId: commentId || undefined,
      emailId: this.emailId,
    };

    this.communityService.addLike(payload).subscribe(
      (response: any) => {
        if (response.status) {
          this.getPostedJobs();
          // Update the like count dynamically
          if (questionId) {
            const likedQuestion = this.postedJobs.find((job: { questionId: number; }) => job.questionId === questionId);
            if (likedQuestion) {
              likedQuestion.questionLikes++;
              likedQuestion.alreadyLiked = true;
            }

          } else if (commentId) {
            const likedComment = this.comments.find((comment: { commentId: number; }) => comment.commentId === commentId);
            if (likedComment) {
              likedComment.likes++;
              likedComment.alreadyLiked = true;
            }
          }
        }
      },
      (error: any) => {
        if (error.status === 400 && error.error.error === 'You have already liked this item') {
          console.log('User has already liked this item.');
        } else {
          console.error('Error liking item:', error);
        }
      }
    );
  }

  postQuestion(): void {
    const formData = new FormData();
    formData.append('emailId', this.newQuestion.emailId);
    formData.append('userName', this.newQuestion.userName);
    formData.append('questionText', this.newQuestion.questionText);
    formData.append('questionType', this.newQuestion.questionType);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile); // Attach the file
    }
    this.showSpinner = true;

    this.communityService.postQuestion(formData).subscribe(
      (response: any) => {
        if (response.status) {
          console.log('Question posted successfully:', response);
          this.getPostedJobs(); // Refresh the questions list
          this.newQuestion = { questionId: 0, emailId: this.emailId, userName: this.userName, questionText: '', questionType: '' };
          this.selectedFile = null; // Reset the file input
          this.isDisplayCoins = true;
          this.displayCoins = 50;
          this.showSpinner = false;
        }
      },
      (error: any) => {
        console.error('Error posting question:', error);
        this.showSpinner = false;
      }
    );
    this.showSpinner = false;
  }



  onEdit() {
    this.isMenuVisible = false;
    this.btnType = 'Edit'
    this.msgType = 'Edit Job';
    this.displayDeleteBtn = true;
    this.getPostedJobs('', '', this.emailId)
  }

  openPostModal() {
    this.isEditing = false; // Set the posting mode
    this.newQuestion = { questionId: 0, emailId: this.emailId, userName: this.userName, questionText: '', questionType: '' };
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
      this.showSpinner = false;
  }


  getPostedJobs(sortBy: string = 'newest', location: string = '', email = '') {
    this.showSpinner = true;
    this.selectedLocation = location;
    this.communityService.getCommunityData(this.limit, this.offset, this.searchQuery, location, this.questionType, this.postedBy, sortBy, email)
      .subscribe((response: any) => {
        console.log(response)
        this.showSpinner = false;
        this.totalRecords = response.totalRecords;
        this.postedJobs = response.records;
      })
      this.showSpinner = false;
  }

  getComments(questionId: number) {
    this.selectedQuestionId = questionId;
    this.showSpinner = true;

    this.communityService.getComments(questionId).subscribe(
      (response: any) => {
        console.log(response);
        this.showSpinner = false;
        this.comments = response.comments; // Assign fetched comments to the local array
      },
      (error: any) => {
        this.showSpinner = false;
        console.error('Error fetching comments:', error);
      }
    );
    this.showSpinner = false;
  }



  updateSelectedJobTypes(event: Event, type: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.questionType = type.label;
    } else {
      this.questionType = '';
    }

    this.isMenuVisible = false;
    this.onfilter();
    this.getPostedJobs();
  }


  updateQuestion(): void {
    if (!this.newQuestion.questionId || this.newQuestion.questionId === 0) {
      this.toastr.error('Invalid question ID for update.');
      return;
    }
    this.showSpinner = true;
    const formData = new FormData();
    formData.append('questionId', this.newQuestion.questionId.toString());
    formData.append('questionText', this.newQuestion.questionText);
    formData.append('emailId', this.newQuestion.emailId);
    formData.append('userName', this.newQuestion.userName);
    formData.append('questionType', this.newQuestion.questionType);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile); // Attach the file if selected
    }

    console.log('Payload for update:', this.newQuestion); // Debug log

    this.communityService.updateQuestion(formData).subscribe(
      (response: any) => {
        if (response.status) {
          this.showSpinner = false;
          this.toastr.success('Question updated successfully.');
          this.getPostedJobs(); // Refresh the question list
          this.newQuestion = { questionId: 0, emailId: this.emailId, userName: this.userName, questionText: '', questionType: '' }; // Reset the form
          this.selectedFile = null; // Reset the file input
        }
      },
      (error: any) => {
        this.showSpinner = false;
        this.toastr.error('Error updating question.');
        console.error('Error updating question:', error);
      }
    );
    this.showSpinner = false;
  }



  openDeleteModal(questionId: number) {
    this.selectedQuestionId = questionId;
  }


  deleteQuestion() {
    if (!this.selectedQuestionId) {
      this.toastr.error('Invalid question ID for deletion.');
      return;
    }

    this.communityService.deleteQuestion(this.selectedQuestionId).subscribe(
      (response: any) => {
        if (response.status) {
          this.toastr.success('Question deleted successfully.');
          this.getPostedJobs(); // Refresh the question list
        }
      },
      (error: any) => {
        this.toastr.error('Error deleting question.');
        console.error('Error deleting question:', error);
      }
    );
  }



  openEditModal(job: { questionId: number; questionText: string, questionType: string }) {
    debugger;
    this.isEditing = true;
    this.newQuestion = {
      questionId: job.questionId,
      emailId: this.emailId,
      userName: this.userName,
      questionText: job.questionText,
      questionType: job.questionType
    };
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

  isChecked(questionType: { label: string }): boolean {
    return this.questionType === questionType.label;
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

  openImageModal(imagePath: string): void {
    this.selectedImagePath = imagePath;
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // Safe because we've ensured modalElement is not null
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }


}

