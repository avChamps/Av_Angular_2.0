import { DatePipe } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthServiceService } from '../services/auth-service.service';
import { CommunityService } from '../services/community.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent {
  expandedQuestion: any
  searchQuetion: any
  userQuestion: any
  replyAnswer: any
  emailId: any;
  feedbackInfo : any;
  pageType : any; 
  userName: any
  currentPage : any;
  pageSize : any;
  selectedFile: any
  selectedFileName: any;
  likedQuestion : any;
  questionURl: any;
  profileImg: any[] = []
  mainQuestions: any[] = []
  additionalAnswers: any[] = []
  likedQuestionIds: number[] = [];
  expanded: boolean = false
  searchKeyword : string = '';
  productCategory : string = '';
  location : any;
  showUrlBox: boolean = false
  showSearch: boolean = false;
  isSearchActive : boolean = false;
  isHeader : boolean = true;
  showContactForm: boolean = false
  additionalAnswersVisible: boolean = false;
  showHomepage: boolean = false;
  showMyposts: boolean = false;
  showFullQuestion : boolean = false;
  showSearchBox : boolean = true;
  updateQid: any
  buttonType: string = 'Save'
  showSpinner: boolean = false;
  @ViewChild('myDialog') myDialog!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  additionalAnswersVisibility: { [key: string]: boolean } = {}
  additionalAnswersData: { [key: string]: any[] } = {}
  showFullContent : { [key: string]: boolean } = {}
  questionStates: {[key: string]: boolean} = {};

  constructor (
    private router: Router,
    private authService: AuthServiceService,
    private commintyService: CommunityService,
    private faService : FaServiceService,
    private userService: UserServicesService,
    private datePipe: DatePipe,
    private authGuard : AuthGuardService
  ) {}

  ngOnInit (): void {
    // this.emailId = localStorage.getItem('emailId');
    // this.userName = localStorage.getItem('userName');
    this.emailId = 'gdisendra@gmail.com';
    this.userName = 'Disendra';
    this.getProfileImage()
    this.onSelect('homePage');
  }


  onSelect(option: any): void {
    this.showHomepage = false;
    this.showMyposts = false;
    this.showContactForm = false;
    this.pageType = option;
    this.currentPage = 1;
    this.pageSize = 5;
    if (option === 'homePage') {
        this.mainQuestions = [];
        this.showHomepage = true;
        this.getQuestions();
        this.getLikesInfo();
    } else if (option === 'contact') {
        this.showSearchBox = false;
        this.showContactForm = true;        
    } else if (option === 'myPosts') {
        this.mainQuestions = [];
        this.getUploadedQuestions();
        this.showMyposts = true;
    } else {
        this.logOut();
    }
}

  //Image
  getProfileImage () {
    this.showSpinner = true
    this.userService
      .getProfileImage(this.emailId)
      .subscribe((response: any) => {
        console.log(response)
        this.showSpinner = false
        this.profileImg = response.records
      })
  }

  getImageSource (): string {
    if (this.profileImg && this.profileImg.length > 0) {
      return this.profileImg[0].imagePath
    } else {
      return '../assets/img/blank-user-directory.png'
    }
  }
  

  getSearchQuestions() {
    this.currentPage = 1
    this.pageSize = 5
    this.mainQuestions = [];
    if(this.pageType === 'homePage') {
    this.getQuestions();
    } else if (this.pageType === 'myPosts') {
     this.getUploadedQuestions();
    }
  }


  //Questions
 getQuestions() {
  this.showSpinner = true;
  this.commintyService.getCommunityQuestions(this.pageSize, (this.currentPage - 1) * this.pageSize, this.searchQuetion)
    .subscribe((response: any) => {
      const newRecords = response.records.filter((record: any) => 
        !this.mainQuestions.some((question: any) => question.qId === record.qId)
      );

      this.mainQuestions = [...this.mainQuestions, ...newRecords];
      console.log(response);
      this.mainQuestions.forEach(question => {
        question.isLiked = this.likedQuestionIds.includes(question.qId);
        this.showContent(question);
      });
      
      this.showSpinner = false;
    },
    (error: any) => {
      console.error('Error fetching questions:', error);
      this.showSpinner = false;
    });
}

loadMore () {
    if (this.showHomepage) {
      this.currentPage++
      this.getQuestions()
    } else {
      this.currentPage++
      this.getUploadedQuestions()
    }
  }
  //uplaod Questions
  getUploadedQuestions () {
    this.showSpinner = true
    this.commintyService.getUploadedCommunityQuestions(this.emailId,
        this.pageSize,
        (this.currentPage - 1) * this.pageSize,
        this.searchQuetion
      )
      .subscribe((response: any) => {
        this.mainQuestions = [...this.mainQuestions, ...response.records];
        console.log(response);
        this.showSpinner = false;
        response.records.forEach((question: any) => {
          this.showContent(question); // Pass the entire question object
        });
      })
  }

  //Update Question
  updateCommunity () {
    this.showSpinner = true
    const formData = new FormData()
    formData.append('emailId', this.emailId)
    formData.append('question', this.userQuestion)
    formData.append('image', this.selectedFile)
    formData.append('qId', this.updateQid)
    // Check if questionURl exists and is not undefined
    if (this.questionURl && this.questionURl.trim() !== '') {
      formData.append('urlLink', this.questionURl);
  }
    this.commintyService
      .updateCommunity(formData)
      .subscribe((response: any) => {
        console.log('Response from server:', response)
        if (response && response.status) {
          this.userService.refreshData()
          this.showSpinner = false
          alert(response.message);
          this.onSelect('myPosts');
          // window.location.reload()
        } else {
          alert('An error occurred. Please try again later.')
        }
      })
  }

  selectPhoto () {
    this.fileInput.nativeElement.click()
  }

  onFileSelected (event: any) {
    const file = event.target.files[0]
    console.log('Selected file:', file)
    this.selectedFile = file;
  }

  // Upload
  onUpload () {
    if (this.buttonType === 'Save') {
      this.showSpinner = true
      const formData = new FormData()
      formData.append('emailId', this.emailId)
      formData.append('question', this.userQuestion)
      formData.append('image', this.selectedFile)
      formData.append('userName', this.userName)
      if (this.questionURl) {
        formData.append('urlLink', this.questionURl)
      }
      this.commintyService
        .insertCommunity(formData)
        .subscribe((response: any) => {
          console.log('Response from server:', response)
          this.showSpinner = false
          if (response && response.status) {
            alert(response.message)
            window.location.reload()
          } else {
            alert('An error occurred. Please try again later.')
          }
        })
    } else {
      this.updateCommunity()
    }
  }

  uploadAnswer (qId:any,replyAnswer :any) {
    this.showSpinner = true
    const formData = new FormData()
    formData.append('emailId', this.emailId)
    formData.append('answer', replyAnswer)
    formData.append('userName', this.userName)
    formData.append('qId', qId)
    this.commintyService
      .insertCommunityAnswer(formData)
      .subscribe((response: any) => {
        console.log('Response from server:', response)
        this.showSpinner = false
        if (response && response.status) {
          alert(response.message)
          window.location.reload()
        } else {
          alert('An error occurred. Please try again later.')
        }
      })
  }

  //ViewMore
  showAdditionalAnswers(question: any) {
    this.showSpinner = true;
    this.additionalAnswersVisibility[question.qId] = !this.additionalAnswersVisibility[question.qId];
    if (!this.additionalAnswersData[question.qId]) {
        console.log(question);
        this.commintyService.getMoreCommunityAnswers(question.qId).subscribe((response: any) => {
            console.log(response);
            this.additionalAnswersData[question.qId] = response.records;
            console.log( this.additionalAnswersData[question.qId]);
            this.performActions(question, 'view');
            this.showSpinner = false;
        });
    } else {
        // this.performActions(question, 'view');
        this.showSpinner = false;
    }
}

  showContent(question: any) {
    this.commintyService.getFeedback(question.qId)
      .subscribe((response: any) => {
        console.log(response);
        question.feedbackInfo = response.records;
        this.showSpinner = false;
        // this.performActions(question.qId, 'view');
      });
  }
  
  //like operations

  getLikesInfo() {
    this.showSpinner = true;
    this.commintyService.getLikesInfo(this.emailId).subscribe(
      (response: any) => {
        console.log(response);
        // Map the liked question IDs from the response
        this.likedQuestionIds = response.records.map((record: any) => record.qId) || [];
        this.showSpinner = false;
        // Fetch questions only after likes information is retrieved
        this.getQuestions();
      },
      (error: any) => {
        console.error('Error fetching likes info:', error);
        this.likedQuestionIds = [];
        this.showSpinner = false;
      }
    );
  }
  
  toggleSearch () {
    this.showSearch = !this.showSearch;
    this.isSearchActive = !this.isSearchActive; 
  }

  //Expand
  toggleShowFullQuestion(item:any) {
    this.questionStates[item.qId] = !this.questionStates[item.qId];
  }  

  isQuestionOpen(item: any) {
    return this.questionStates[item.qId];
  }

  urlExpand () {
    this.showUrlBox = !this.showUrlBox
  }

  postQuetion () {
    // this.popup.openDialogWithTemplateRef(this.myDialog)
  }

  openModal() {
    const modalElement = new bootstrap.Modal(this.myDialog.nativeElement);
    modalElement.show();
  }
  //edit

  editQuestion (question: any) {
    this.buttonType = 'update'
    console.log('question', question)
    this.userQuestion = question.question
    this.questionURl = question.urlLink
    this.updateQid = question.qId;
    // this.popup.openDialogWithTemplateRef(this.myDialog)
  }

  //delete
  deleteQuestion(question: any) {
    console.log(question);
    this.showSpinner = true;
    const questionData = {
        emailId: question.question_owner_email,
        qId: question.qId,
        imagePath: question.question_owner_imagePath
    };
    const confirmation = confirm('Are you sure you want to delete the Product?');
    if (confirmation) {
        this.commintyService
            .deleteCommunity(questionData)
            .subscribe((response: any) => {
                console.log('Response from server:', response);
                this.showSpinner = false;
                if (response && response.status) {
                    alert(response.message);
                    this.onSelect('myPosts');
                } else {
                    alert('An error occurred. Please try again later.');
                }
            });
    } else {
        this.showSpinner = false;
    }
}

//Like and Dislikes operations
performActions(question: any, type: string) {
  this.showSpinner = true;
  const data = {
    "qId": question.qId,
    "emailId": this.emailId,
    "action": type
  };
  if (type === 'like' && this.likedQuestionIds.includes(question.qId)) {
    this.showSpinner = false;
    return;
  }
  let serviceCall;
  serviceCall = this.commintyService.postFeedback(data);
  serviceCall.subscribe((response:any) => {
      console.log('Response from server:', response);
      this.showContent(question);
      if (type === 'like') {
        question.isLiked = true;
        this.likedQuestionIds.push(question.qId);
      }
      this.showSpinner = false;
    },
    (error:any) => {
      this.handleError(error);
    }
  );
}


private handleError(error: any) {
  console.error('Error:', error);
  this.showSpinner = false;
}


  closePopup () {
    // this.popup.closeDialog()
    this.showUrlBox = false
  }

  get filteredquestions (): any[] {
    if (!this.searchQuetion || this.searchQuetion.trim() === '') {
      return this.mainQuestions // Return all questions directly
    }
    return this.mainQuestions.filter(
      question =>
        question.question
          .toLowerCase()
          .includes(this.searchQuetion.toLowerCase()) ||
        (question.answer &&
          question.answer
            .toLowerCase()
            .includes(this.searchQuetion.toLowerCase()))
    )
  }

  onBack () {
   window.location.reload();
  }

  formatDOB (dob: any) {
    if (dob) {
      return this.datePipe.transform(dob, 'dd MMMM yyyy')
    }
    return ''
  }

  logOut () {
    this.faService.clearSession();
    this.router.navigate(['/home-page']);
    window.location.reload();
  }
}
