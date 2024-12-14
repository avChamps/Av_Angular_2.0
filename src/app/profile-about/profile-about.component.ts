import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';
import { UserServicesService } from '../services/user-services.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.css']
})
export class ProfileAboutComponent implements OnInit {
  emailId: any
  workingEmailId: any;
  dateOfBirth: any
  gender: string = '';
  mobileNumber: any
  userCity!: string
  companyName: any
  userEmailId: any
  jobTitle: any;
  updatedDate: any;
  userName: any
  imagePath: any;
  userPoints: any;
  profileWeight: any;
  emailErrorMessage: string = '';
  emailWorkingErrorMessage: string = '';
  mobileErrorMessage: string = '';
  profileImageType: string = '';
  signupDate: any;
  products: any[] = [];
  countriesDropDown: any = { countries: [], states: [], cities: [] };
  showSpinner: boolean = false
  editMode: boolean = false;
  isEmailValidated: boolean = true;
  isWorkingEmailValidated: boolean = true;
  isMobileNumberValidated: boolean = true;
  selectedCountry: string = "";
  selectedState: string = "";
  selectedCity: string = "";
  address1: any;
  address2: any;
  stdCode: any = "91";
  zipCode: any;
  activeTab = 1;
  // activeTab: string = 'personal-details';

  constructor(
    private userService: UserServicesService,
    private authService: AuthServiceService,
    private faService: FaServiceService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.emailId = localStorage.getItem('emailId');
    this.userName = localStorage.getItem('userName');
    let language = localStorage.getItem('selectedLanguage') || 'english';
    this.translate.setDefaultLang(language);
  }

  ngOnInit(): void {
    this.getProfileData();
    this.getProfileWeight();
    this.getCountries();
    if (this.selectedCountry) {
      this.fetchStatesOnLoad();
    }

    if (this.selectedState) {
      this.fetchCitiesOnLoad();
    }
    if (!this.stdCode) {
      this.stdCode = "91";
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode
    if (!this.editMode) {
      this.saveProfileData()
    }
  }
  getProfileData() {
    this.showSpinner = true;
    this.userService.getProfile(this.emailId).subscribe((response: any) => {
      this.showSpinner = false;
      console.log(response);
      if (response.records.length !== 0) {
        const record = response.records[0]
        this.imagePath = record.imagePath;
        this.updatedDate = record.updatedDate;
        this.signupDate = record.signupDate;
        this.userName = record.fullName;
        this.companyName = record.companyName;
        this.emailId = record.emailId;
        this.workingEmailId = record.workingEmailId;
        this.mobileNumber = record.mobileNumber;
        this.dateOfBirth = record.dob;
        this.gender = record.gender;
        this.userCity = record.location;
        this.jobTitle = record.designation;
        this.gender = record.gender;
        this.selectedCity = record.selectedCity;
        this.selectedCountry = record.selectedCountry;
        this.selectedState = record.selectedState;
        this.address1 = record.address1;
        this.address2 = record.address2;
        this.stdCode = record.stdCode;
        this.zipCode = record.zipCode;

        // Trigger states and cities API calls after profile data is set
        if (this.selectedCountry) {
          this.fetchStatesOnLoad();
        }

        if (this.selectedState) {
          this.fetchCitiesOnLoad();
        }
      }
      this.showSpinner = false;
    })
    this.showSpinner = false;
  }

  getProfileWeight() {
    this.userService.getProfileWeight(this.emailId).subscribe((response: any) => {
      if (response) {
        this.profileWeight = response.profileWeight
        console.log(response)
        this.showSpinner = false;
        this.getPoints();
      } else {
        this.showSpinner = false;
        console.log('Error while fectching the profile weight');
      }
    })
    this.showSpinner = false;
  }


  getPoints() {
    this.showSpinner = true;
    let email = { emailId: this.emailId };

    this.userService.getPoints(email).subscribe(
      (response: any) => {
        if (response && response.data && response.data.length > 0) {
          this.showSpinner = false;
          let userPoints = response.data[0].points;
          this.userPoints = userPoints + this.profileWeight;
        } else {
          console.error('No data found in response');
        }
        this.showSpinner = false;
      },
      (error: any) => {
        console.error('Error while loading the points', error);
        console.log('Full error details:', error);
        this.showSpinner = false;
      }
    );
    this.showSpinner = false;
  }


  saveProfileData() {
    this.showSpinner = true;

    if (this.isEmailValidated === true && this.isMobileNumberValidated === true) {
      const profileData = new FormData()
      profileData.append('emailId', this.emailId || '');
      profileData.append('workingEmailId', this.workingEmailId || '');
      profileData.append('companyName', this.companyName || '')
      profileData.append('mobileNumber', this.mobileNumber || '')
      profileData.append('designation', this.jobTitle || '')
      profileData.append('dob', this.dateOfBirth || '')
      profileData.append('location', this.userCity || '')
      profileData.append('gender', this.gender || '')
      profileData.append('selectedCity', this.selectedCity || '')
      profileData.append('selectedCountry', this.selectedCountry || '')
      profileData.append('selectedState', this.selectedState || '')
      profileData.append('address1', this.address1 || '');
      profileData.append('address2', this.address2 || '');
      profileData.append('stdCode', this.stdCode || 91);
      profileData.append('zipCode', this.zipCode || '');

      this.userService.updateProfile(profileData).subscribe(
        (response: any) => {
          console.log(response)
          this.showSpinner = false;
          window.location.reload();
        },
        (error: any) => {
          this.showSpinner = false;
          console.error('Error occurred while saving profile:', error)
        }
      )
    }
    else {
      this.showSpinner = false;
      alert();
    }
  }

  formattedDate() {
    if (this.updatedDate !== undefined || null || '') {
      return this.datePipe.transform(this.updatedDate, 'yyyy-MM-dd');
    } else {
      return this.datePipe.transform(this.signupDate, 'yyyy-MM-dd');
    }
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.emailId)) {
      this.isEmailValidated = false;
      this.emailErrorMessage = this.translate.instant('Enter valid email ID.');
    } else {
      this.isEmailValidated = true;
      this.emailErrorMessage = '';
    }
  }

  validateWorkingEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const businessDomainPattern = /@(?!gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$|aol\.com$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(this.workingEmailId)) {
      this.isWorkingEmailValidated = false;
      this.emailWorkingErrorMessage = this.translate.instant('Enter valid Working Email ID');
    } else if (!businessDomainPattern.test(this.workingEmailId)) {
      this.isWorkingEmailValidated = false;
      this.emailWorkingErrorMessage = this.translate.instant('Please enter a valid Working email ID');
    } else {
      this.isWorkingEmailValidated = true;
      this.emailWorkingErrorMessage = '';
    }
  }


  getImageSource(): string {
    if (this.imagePath) {
      return this.imagePath;
    } else {
      return 'assets/images/common_Images/user-Icon.png'
    }
  }

  // onMobileNumberChange() {
  //   const regex = /^(?!([0-9])\1{9})[1-9][0-9]{9}$/;
  //   if (!regex.test(this.mobileNumber)) {
  //     this.isMobileNumberValidated = false;
  //     this.mobileErrorMessage = this.translate.instant('Invalid Mobile Number.');
  //   } else {
  //     this.isMobileNumberValidated = true;
  //     this.mobileErrorMessage = '';
  //   }
  // }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()}${this.getOrdinal(date.getDate())} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  }

  getOrdinal(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  formatDOB(dob: any) {
    if (dob === 'not updated') {
      return;
    } else if (dob) {
      return this.datePipe.transform(dob, 'yyyy-MM-dd')
    }
    return ''
  }

  fetchStatesOnLoad() {
    if (this.selectedCountry) {
      const countryCodePayload = { countryCode: this.selectedCountry };
      this.userService.getStates(countryCodePayload).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.countriesDropDown.states = response.data;
          } else {
            console.error('No states found for the selected country.');
          }
        },
        (error) => {
          console.error('Error fetching states:', error);
        }
      );
    } else {
      this.countriesDropDown.states = [];
    }
  }

  fetchCitiesOnLoad() {
    if (this.selectedCountry && this.selectedState) {
      this.userService.getCities(this.selectedCountry, this.selectedState).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.countriesDropDown.cities = response.data;
          } else {
            console.error('No cities found for the selected state.');
          }
        },
        (error) => {
          console.error('Error fetching cities:', error);
        }
      );
    } else {
      this.countriesDropDown.cities = [];
    }
  }

  onMobileNumberChange() {
    // Perform validation if needed
    if (this.mobileNumber.length !== 10) {
      this.mobileErrorMessage = 'Mobile number must be 10 digits.';
    } else {
      this.mobileErrorMessage = '';
    }
  }


  // Fetch countries
  getCountries() {
    this.userService.getCountries().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.countriesDropDown.countries = response.data;
        } else {
          console.error('Error: No response data received.');
        }
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  onCountryChange() {
    if (this.selectedCountry) {
      const countryCodePayload = { countryCode: this.selectedCountry };
      this.userService.getStates(countryCodePayload).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.countriesDropDown.states = response.data;
            this.countriesDropDown.cities = []; // Clear cities when country changes
          } else {
            console.error('No states found for the selected country.');
          }
        },
        (error) => {
          console.error('Error fetching states:', error);
        }
      );
    } else {
      this.countriesDropDown.states = [];
      this.countriesDropDown.cities = [];
    }
  }

  // Fetch cities based on selected state
  onStateChange() {
    if (this.selectedState) {
      this.userService.getCities(this.selectedCountry, this.selectedState).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.countriesDropDown.cities = response.data;
          } else {
            console.error('No cities found for the selected state.');
          }
        },
        (error) => {
          console.error('Error fetching cities:', error);
        }
      );
    } else {
      this.countriesDropDown.cities = [];
    }
  }

  setActiveTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }

}
