import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tools-page',
  templateUrl: './tools-page.component.html',
  styleUrls: ['./tools-page.component.css']
})
export class ToolsPageComponent {
  emailId  :any;
  
  constructor(private router: Router) { 
    this.emailId = localStorage.getItem('emailId');
  }

  Tools = [
    { icon: '📅', color: 'text-success', title: 'CALENDAR', value: 'calendar' },
    { icon: '🎥', color: 'text-warning', title: 'VIDEO SIMULATOR', value: 'videoSimulator' },
    { icon: '💼', color: 'text-info', title: 'BUSINESS CARD', value: 'businessCard' },
    { icon: '🔍', color: 'text-primary', title: 'MAC FINDER', value: 'macFinder' },
    { icon: '🗄️', color: 'text-primary', title: 'Rack Layout', value: 'avRack' },
    { icon: '🧮', color: 'text-primary', title: 'Budget Calculator', value: 'budgetCalculator' }, 
    { icon: '📊', color: 'text-primary', title: 'Bandwidth Calculator', value: 'bandwithCalculator' },
    { icon: '📏', color: 'text-primary', title: 'Through Distance', value: 'projectThrowDistance' },
    { icon: '🖥️', color: 'text-primary', title: 'Diagonal Screen Size', value: 'DiagonalScreenSize' },
    { icon: 'assets/images/common_Images/hdbt_img.png', color: '', title: 'Certified Product List', value: 'hdBase', isImage: true }
  ];

  clickedTool(value: any) {
    console.log(value);
    if (value === 'calendar') {
      this.router.navigate(['/profile-dashboard/calendar']);
    } else if (value === 'videoSimulator') {
      this.router.navigate(['/profile-dashboard/videoSimulator']);
    } else if (value === 'businessCard') {
      this.router.navigate(['/profile-dashboard/bussiness-card']);
    }  else if (value === 'macFinder') {
      this.router.navigate(['/profile-dashboard/macFinder']);
    } else if (value === 'avRack') {
      this.router.navigate(['/profile-dashboard/avRack']);
    } else if(value === 'budgetCalculator') {
      this.router.navigate(['/profile-dashboard/budgetCalculator']);
    } else if(value === 'projectThrowDistance') {
      this.router.navigate(['/profile-dashboard/projectThrowDistance']);
    }  else if(value === 'bandwithCalculator') {
      this.router.navigate(['/profile-dashboard/bandwithCalculator']);
    } else if(value === 'DiagonalScreenSize') {
      this.router.navigate(['/profile-dashboard/DiagonalScreenSize']);
    }
     else if (value === 'hdBase') {
      window.open('https://products.hdbaset.org/avcat/ctl18927/index.cfm', '_blank');
    }
  }
}
