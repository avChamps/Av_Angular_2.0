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
    this.Tools.sort((a, b) => a.title.localeCompare(b.title));
  }

  Tools = [
    { icon: '📅', color: 'text-success', title: 'Calender', value: 'calendar' },
    { icon: '🎥', color: 'text-warning', title: 'Video Simulator', value: 'videoSimulator' },
    { icon: '💼', color: 'text-info', title: 'Bussiness Card', value: 'businessCard' },
    { icon: '🔍', color: 'text-primary', title: 'Mac Finder', value: 'macFinder' },
    { icon: '🗄️', color: 'text-primary', title: 'Rack Layout', value: 'avRack' },
    { icon: '🧮', color: 'text-primary', title: 'Budget Calculator', value: 'budgetCalculator' }, 
    { icon: '📊', color: 'text-primary', title: 'Bandwidth Calculator', value: 'bandwithCalculator' },
    { icon: '📏', color: 'text-primary', title: 'Throw Distance', value: 'projectThrowDistance' },
    { icon: '📺', color: 'text-primary', title: 'Diagonal Screen Size', value: 'DiagonalScreenSize' },
    { icon: '🖼️', color: 'text-primary', title: 'Aspect Ratio', value: 'aspectCalculator' },
    { icon: '🔊', color: 'text-primary', title: 'Audio Delay Calculator', value: 'audioDelayCalculator' },
    { icon: '🔥', color: 'text-primary', title: 'BTU Calculator', value: 'btuCalculator' },
    { icon: '⚡', color: 'text-primary', title: 'Power Calculator', value: 'powerCalculator' },
    // { icon: '💡', color: 'text-primary', title: 'Quiz', value: 'quiz' },
    { icon: '💡', color: 'text-primary', title: 'Coming Soon' },
    { icon: 'assets/images/common_Images/hdbt_img.png', color: '', title: 'Certified Product List', value: 'hdBase', isImage: true }
  ];

  clickedTool(value: any) {
    console.log(value);
    if (value === 'calendar') {
      this.router.navigate(['/profile-dashboard/tools/calendar']);
    } else if (value === 'videoSimulator') {
      this.router.navigate(['/profile-dashboard/tools/videoSimulator']);
    } else if (value === 'businessCard') {
      this.router.navigate(['/profile-dashboard/tools/bussiness-card']);
    }  else if (value === 'macFinder') {
      this.router.navigate(['/profile-dashboard/tools/macFinder']);
    } else if (value === 'avRack') {
      this.router.navigate(['/profile-dashboard/tools/avRack']);
    } else if(value === 'budgetCalculator') {
      this.router.navigate(['/profile-dashboard/tools/budgetCalculator']);
    } else if(value === 'projectThrowDistance') {
      this.router.navigate(['/profile-dashboard/tools/projectThrowDistance']);
    }  else if(value === 'bandwithCalculator') {
      this.router.navigate(['/profile-dashboard/tools/bandwithCalculator']);
    } else if(value === 'DiagonalScreenSize') {
      this.router.navigate(['/profile-dashboard/tools/DiagonalScreenSize']);
    } else if(value === 'aspectCalculator') {
      this.router.navigate(['/profile-dashboard/tools/aspectCalculator']);
    } else if(value === 'audioDelayCalculator') {
      this.router.navigate(['/profile-dashboard/tools/audioDelayCalculator']);
    } else if(value === 'btuCalculator') {
      this.router.navigate(['/profile-dashboard/tools/btuCalculator']);
    } else if(value === 'powerCalculator') {
      this.router.navigate(['/profile-dashboard/tools/powerCalculator'])
    }  else if(value === 'quiz') {
      this.router.navigate(['/profile-dashboard/tools/quiz-page'])
    } else if (value === 'hdBase') {
      window.open('https://products.hdbaset.org/avcat/ctl18927/index.cfm', '_blank');
    }
  }
}
