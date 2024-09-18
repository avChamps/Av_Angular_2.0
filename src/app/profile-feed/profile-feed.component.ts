import { Component } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';

@Component({
  selector: 'app-profile-feed',
  templateUrl: './profile-feed.component.html',
  styleUrls: ['./profile-feed.component.css']
})
export class ProfileFeedComponent {

  selectedEmail: boolean = false
  showMails: boolean = true
  email: any[] = []
  clickedemails: any[] = []
  showSpinner: boolean = false;
  contactMail: string = 'hello@avchamps.com';
  searchTitle: string = ''
  private OPENED_EMAILS_KEY = 'openedEmails'

  constructor(
    private faService: FaServiceService,
    private authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.showSpinner = true
    this.faService.getFeedData().subscribe((response: any) => {
      console.log('Response from server:', response)
      this.email = response.records
      this.showSpinner = false;
      this.updateOpenedStatus()
    })
  }

  icons: string[] = [
    'fas fa-microphone',
    'fas fa-volume-up',
    'fas fa-bullhorn',
    'fas fa-desktop',
    'fas fa-project-diagram',
    'fas fa-camera',
    'fas fa-video',
    'fas fa-volume-up'
  ];

  colors: string[] = [
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'yellow',
    'pink',
    'teal'
  ];

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  getRandomIcon(): string {
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    return this.icons[randomIndex];
  }

  onBack() {
    this.showMails = true
    this.selectedEmail = false
  }

  sendContact() {
    window.location.href = `mailto:${this.contactMail}`;
  }

  selectEmail(email: any) {
    console.log(email)
    this.showMails = false
    this.selectedEmail = true
    this.clickedemails = [email]
    email.opened = true;
    this.markEmailAsOpened(email.title)
  }

  get filteredEmails(): any[] {
    return this.email.filter(email =>
      email.title.toLowerCase().includes(this.searchTitle.toLowerCase())
    )
  }

  markEmailAsOpened(emailTitle: string) {
    const openedEmails = this.getOpenedEmails()
    if (!openedEmails.includes(emailTitle)) {
      openedEmails.push(emailTitle)
      localStorage.setItem(this.OPENED_EMAILS_KEY, JSON.stringify(openedEmails))
    }
  }

  getOpenedEmails(): string[] {
    const openedEmails = localStorage.getItem(this.OPENED_EMAILS_KEY)
    return openedEmails ? JSON.parse(openedEmails) : []
  }

  updateOpenedStatus() {
    const openedEmails = this.getOpenedEmails()
    this.email.forEach(email => {
      if (openedEmails.includes(email.title)) {
        email.opened = true
      }
    })
  }

}
