import { ChangeDetectorRef, Component, Input, Renderer2, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { FaServiceService } from '../services/fa-service.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {
  startDate: any;
  endDate: any;
  eventName: any;
  eventUrl: any;
  uniqueEventTypes: any;
  displayEventName: string = '';
  eventColorCode: string = '';
  eventNameInput: any;
  showSpinner: boolean = true;
  selectedEventType: any;
  eventsResponse: any[] = [];
  filteredEvents: any[] = [];
  @ViewChild('eventInfoModal') eventInfoModal!: ElementRef;

  eventTypes = [
    { displayName: 'Webinar', value: 'webinar' },
    { displayName: 'Trade Show', value: 'trade_show' },
    { displayName: 'Classroom', value: 'classroom' },
    { displayName: 'Product Launch', value: 'product_launch' },
    { displayName: 'Online', value: 'online' }
  ];

  constructor(
    private faService: FaServiceService,
    public userService: UserServicesService,
  ) { }

  ngOnInit(): void {
    this.getEvents();
  }

  // Filter events by the event type
  filterByEventType(eventType: string, eventName: any, colorCode: any): void {
    this.displayEventName = eventName;
    this.eventColorCode = colorCode;
    this.filteredEvents = this.eventsResponse.filter(event => event.eventType === eventType);
  }

  // Filter today's events
  filterTodayEvents(): void {
    const today = new Date().setHours(0, 0, 0, 0);  // Set to the start of the day
    this.filteredEvents = this.eventsResponse.filter(event => {
      const eventDate = new Date(event.event_date).setHours(0, 0, 0, 0);
      return eventDate === today;
    });
    console.log("Today's Events: ", this.filteredEvents);
  }


  getEvents() {
    this.showSpinner = true;
    this.faService.getEvents().subscribe((response: any) => {
      if (response.records && Array.isArray(response.records)) {
        this.eventsResponse = response.records;

        // Populate unique event types
        const eventTypes = new Set(this.eventsResponse.map((event: { eventType: any; }) => event.eventType));
        const uniqueEventTypesArray = Array.from(eventTypes);
        this.uniqueEventTypes = [];

        uniqueEventTypesArray.forEach((eventType: string | null) => {
          let colorCode = '';
          const normalizedEventType = eventType ? eventType.toLowerCase() : null;
          let eventName;

          if (normalizedEventType === 'trade_show') {
            colorCode = '#ff0000';
            eventName = 'TradeShow';
          } else if (normalizedEventType === 'webinar') {
            colorCode = '#007bff';
            eventName = 'Webinar';
          } else if (normalizedEventType === 'classroom') {
            colorCode = '#28a745';
            eventName = 'ClassRoom';
          } else if (normalizedEventType === 'online') {
            colorCode = '#ffc107';
            eventName = 'Online';
          } else if (normalizedEventType === 'new_launch') {
            colorCode = '#6f42c1';
            eventName = 'NewLaunch';
          } else if (!normalizedEventType) {
            return;
          } else {
            return;
          }

          this.uniqueEventTypes.push({ eventType: eventType, name: eventName, colorCode: colorCode });
        });

        this.filterByEventType('trade_show', 'TradeShow', '#ff0000');

        console.log(this.uniqueEventTypes);

      } else {
        console.error('Unexpected response format:', response);
      }

      this.showSpinner = false;
    }, error => {
      console.error('Error fetching events:', error);
      this.showSpinner = false;
    });
  }


  getMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long' });
  }

  getDay(dateString: string): string {
    const date = new Date(dateString);
    return date.getDate().toString();
  }

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

  submitForm() {
    const data = {
      eventName: this.eventName,
      eventUrl: this.eventUrl,
      startDate: this.startDate,
      endDate: this.endDate,
      eventType: this.selectedEventType,
    };

    this.faService.postEvent(data).subscribe({
      next: (response) => {
        console.log('Event submitted successfully:', response);
      },
      error: (err: any) => {
        console.error('Error submitting the event:', err);
        this.handleError(err);
      },
    });
  }

  handleError(err: any) {
    if (err.status === 400) {
      console.log('Validation error:', err.error);
    } else if (err.status === 500) {
      console.log('Server error, please try again later.');
    } else {
      console.log('Unexpected error:', err);
    }
  }

  onBack() {
    this.userService.onBack();
  }
}

