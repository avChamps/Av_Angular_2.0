import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-ekart',
  templateUrl: './ekart.component.html',
  styleUrls: ['./ekart.component.css']
})
export class EkartComponent implements OnInit {

  userName: any;
  emailId : any;
  title!: string;
  description!: string;
  location: string = '';
  selectedFile: any;
  mobileNumber!: number;
  selectedFileName: string = '';
  slNo!: number;
  price!: number;
  products: any[] = [];
  uploadProducts: any[] = [];
  profileImg: any[] = [];
  showUpload: boolean = false;
  showSpinner: boolean = false;
  showContact: boolean = false;
  showFile: boolean = true;
  showCart: boolean = false;
  showProducts: boolean = true;
  showSearchBox: boolean = true;
  showContactForm: boolean = false;
  showViewMore: boolean = true;
  viewMoreButton: boolean = false;
  showEmptyImg: boolean = false;
  isValid : boolean = true;
  displayScrollIcon : boolean = true;
  selectedItem: any;
  offset: number = 0;
  searchKeyword: string = '';
  sellerButton: string = 'Upload';
  productCategory: string = '';

  @ViewChild('seller') sellerForm!: TemplateRef<any>;
  @ViewChild('contact', { static: true }) contactModal!: ElementRef;
  insertionType: any;

  constructor(
    private userService: UserServicesService,
    private router: Router,
    private faService: FaServiceService,
    private authService: AuthServiceService,
    private authGuard: AuthGuardService
  ) {}

  ngOnInit(): void {
    this.emailId = localStorage.getItem('emailId')
    this.userName = localStorage.getItem('userName');
    this.getCartData(this.offset);
    this.getProfileImage();
  }

  itemCategory = [
    { label: 'Audio', value: 'audio' },
    { label: 'Video', value: 'video' },
    { label: 'UCC', value: 'ucc' },
    { label: 'Control', value: 'control' },
    { label: 'Accessors', value: 'accessors' }
  ];

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
  ];

  loadMoreCartData() {
    this.offset += 5;
    this.getCartData(this.offset);
  }

  loadMoreUploadData() {
    this.offset += 5;
    this.getUploadProducts(this.offset);
  }

  onSelect(option: string): void {
    // this.products = [];
    if (option === 'myPosts') {
      this.location = '';
      this.productCategory = '';
      this.searchKeyword = '';
      this.showCart = true;
      this.showProducts = false;
      this.showContactForm = false;
      this.displayScrollIcon = true;
      this.getUploadProducts(0);
    } else if (option === 'products') {
      window.location.reload();
    } else if (option === 'contact') {
      this.showSearchBox = false;
      this.showContactForm = true;
      this.displayScrollIcon = false;
      this.showCart = false;
      this.showProducts = false;
    } else {
      this.logOut();
    }
  }

  getUploadProducts(offset: number) {
    this.showSpinner = true;
    this.isValid = true;
    this.userService.getUploadData(this.emailId, offset).subscribe(response => {
      this.uploadProducts = this.uploadProducts.concat(response.records);
      this.getRecords(response);
      this.showSpinner = false;
    });
  }

  getCartData(offset: number) {
    this.showSpinner = true;
    this.userService.getCartData(offset, this.searchKeyword, this.productCategory, this.location)
      .subscribe((response: any) => {
        this.products = this.products.concat(response.records);
        this.getRecords(response);
        this.showSpinner = false;
      });
  }

  getProfileImage() {
    this.showSpinner = true;
    this.userService.getProfileImage(this.emailId).subscribe((response: any) => {
      this.profileImg = response.records;
      this.showSpinner = false;
    });
  }

  onSearch() {
    this.products = [];
    this.getCartData(0);
  }

  getImageSource(): string {
    return this.profileImg.length > 0 ? this.profileImg[0].imagePath : '../assets/img/blank-user-directory.png';
  }

  selectFile(): void {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('File input element not found.');
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile ? this.selectedFile.name : '';
  }

  onUpload() {
    if (this.insertionType === 'insertProduct') {
      this.uploadProduct();
    } else {
      this.updateProducts();
    }
  }

  uploadProduct() {
    this.showSpinner = true;
    const formData = new FormData();
    formData.append('emailId', this.emailId);
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('location', this.location);
    formData.append('productCategory', this.productCategory);
    formData.append('mobileNumber', this.mobileNumber.toString());
    formData.append('price', this.price.toString());
    formData.append('image', this.selectedFile);
    formData.append('userName', this.userName);

    this.userService.insertCart(formData).subscribe((response: any) => {
      this.showSpinner = false;
      if (response && response.status) {
        this.userService.refreshData();
        alert(response.message);
        window.location.reload();
      } else {
        alert('An error occurred. Please try again later.');
      }
    });
  }

  updateProducts() {
    this.showSpinner = true;
    const formData = new FormData();
    formData.append('emailId', this.emailId);
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('productCategory', this.productCategory);
    formData.append('location', this.location);
    formData.append('mobileNumber', this.mobileNumber.toString());
    formData.append('price', this.price.toString());
    formData.append('image', this.selectedFile);
    formData.append('slNo', this.slNo.toString());

    this.userService.updateCartData(formData).subscribe((response: any) => {
      this.showSpinner = false;
      if (response && response.status) {
        this.userService.refreshData();
        alert(response.message);
        this.getUploadProducts(this.offset);
        window.location.reload();
      } else {
        alert('An error occurred. Please try again later.');
      }
    });
  }

  toggleChanged(event: Event, item: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      const confirmation = confirm('Are you sure that product is Sold Out?');
      if (!confirmation) {
        inputElement.checked = false;
        return;
      }
      const soldOutData = { slNo: item.slNo, productStatus: 'soldOut' };
      this.userService.soldOut(soldOutData).subscribe((response: any) => {
        this.userService.refreshData();
        alert(response.message);
        window.location.reload();
      });
    }
  }

  deleteItem(item: any) {
    this.showSpinner = true;
    const productData = {
      emailId: item.emailId,
      postedDate: item.postedDate,
      title: item.title
    };
    const confirmation = confirm('Are you sure you want to delete the Product?');
    if (!confirmation) {
      return;
    }
    this.userService.deleteCartData(productData).subscribe((response: any) => {
      this.showSpinner = false;
      if (response && response.status) {
        this.userService.refreshData();
        alert(response.message);
        this.getUploadProducts(this.offset);
        window.location.reload();
      } else {
        alert('An error occurred. Please try again later.');
      }
    });
  }

  editItem(item: any) {
    this.sellerButton = 'Update';
    this.emailId = item.emailId;
    this.title = item.title;
    this.description = item.description;
    this.location = item.location;
    this.mobileNumber = item.mobileNumber;
    this.price = item.price;
    this.slNo = item.slNo;
    this.onCart('updateProduct');
  }

  selectedProduct(index: any) {
    this.selectedItem = [index];
  }

  onCart(type: string) {
    this.insertionType = type;
    if (type === 'insertProduct') {
      this.sellerButton = 'Upload';
      this.clearInputs();
    } else {
      this.sellerButton = 'Update';
    }
  }

  isValidMobileNumber(): void {
    if (this.mobileNumber) {
      const mobileStr = this.mobileNumber.toString();
      if (mobileStr.length > 10) {
        this.mobileNumber = parseInt(mobileStr.substring(0, 10), 10);
      }      
      const repeatedPattern = /(\d)\1{9}/;
      this.isValid = mobileStr.length === 10 && !repeatedPattern.test(mobileStr);
    } else {
      this.isValid = false;
    }
  } 

  scrollToTop() {
    window.scrollTo({
      top : 0,
      behavior : 'smooth'
    })
  }

  getRecords(response: any) {
    this.viewMoreButton = response.records.length === 5;
    this.showEmptyImg = response.records.length === 0;
  }

  clearInputs() {
    this.title = '';
    this.description = '';
    this.price = 0;
    this.mobileNumber = 0;
    this.location = '';
    this.selectedFileName = '';
  }

  onBack() {
    window.location.reload();
  }

  reloadPage() {
    window.location.reload();
  }

  logOut() {
    this.faService.clearSession();
    this.router.navigate(['']);
    window.location.reload();
  }
}
