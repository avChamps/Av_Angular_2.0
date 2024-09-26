import { Component } from '@angular/core';
import { FaServiceService } from '../services/Prev/fa-service.service';
import { UserServicesService } from '../services/user-services.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mac-finder',
  templateUrl: './mac-finder.component.html',
  styleUrls: ['./mac-finder.component.css']
})
export class MacFinderComponent {
  sysAddress !: string;
  getVendorData: any;
  showSpinner: boolean = false;

  constructor(private faService: FaServiceService, private userService: UserServicesService, private translate : TranslateService) { }

  ngOnInit(): void {
    let language = localStorage.getItem('selectedLanguage') || 'english';
    this.translate.setDefaultLang(language);
  }

  getVendor(sysAddress: any) {
    this.showSpinner = true
    this.faService.getMacData(sysAddress).subscribe((response: any) => {
      this.showSpinner = false;
      console.log(response);
      let records = response.records[0];
      if (records === '' || records === undefined || records === null) {
        this.getVendorData = this.translate.instant("Records Not Found");
      } else {
        this.getVendorData = records.company;
        console.log(this.getVendorData);
      }
    })
  }
  onBack() {
    this.userService.onBack();
  }
}
