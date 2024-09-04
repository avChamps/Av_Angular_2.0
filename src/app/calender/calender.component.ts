import { ChangeDetectorRef, Component, Input, Renderer2, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { FaServiceService } from '../services/fa-service.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Chart, registerables } from 'chart.js';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';

declare var bootstrap: any; // Declare Bootstrap globally

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {
  totalScore: number = 0;
  chart: any;
  startDate: any;
  endDate: any;
  displaySelector: boolean = false;
  calendarVisible = true; // Default to true
  showChart: boolean = false;
  isCalender: boolean = false;
  filteredEvents: any[] = [];
  selectedEventTypes: string[] = [];
  currentEvents: EventApi[] = [];
  events: any[] = [];
  showSpinner: boolean = true;
  selectedEventType: any;
  @Input() toolType: any;
  @ViewChild('eventInfoModal') eventInfoModal!: ElementRef;
  @ViewChild('eventTypeModal') eventTypeModal!: ElementRef;

  eventTypes = [
    { displayName: 'Webinar', value: 'webinar' },
    { displayName: 'Trade Show', value: 'trade_show' },
    { displayName: 'Classroom', value: 'classroom' },
    { displayName: 'Product Launch', value: 'product_launch' },
    { displayName: 'Online', value: 'online' }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private faService: FaServiceService,
    public userService: UserServicesService,
    private renderer: Renderer2
  ) {
    Chart.register(...registerables);
    this.handleCreateEventClick = this.handleCreateEventClick.bind(this);
  }

  ngOnInit(): void {
    this.handleMessageChange();
    this.getEvents();
  }

  handleMessageChange() {
    if (this.toolType === 'displaySelector') {
      this.displaySelector = true;
    } else if (this.toolType === 'calender') {
      this.isCalender = true;
    }
  }

  // Method to show the Event Information modal
  showEventInfoModal(): void {
    const modalElement = new bootstrap.Modal(this.eventInfoModal.nativeElement);
    modalElement.show();
  }

  // Method to show the Event Type Filter modal
  showEventTypeModal(): void {
    const modalElement = new bootstrap.Modal(this.eventTypeModal.nativeElement);
    modalElement.show();
  }

  // Example form submission method
  submitForm(
    eventName: string,
    eventUrl: string,
    startDate: Date,
    endDate: Date,
    selectedEventType: string
  ) {
    const data = {
      eventName: eventName,
      eventUrl: eventUrl,
      startDate: startDate,
      endDate: endDate,
      eventType: selectedEventType
    };
    this.faService.postEvent(data).subscribe(response => {
      console.log(response);
      this.showEventInfoModal(); // Show confirmation or reset modal
    });
  }

  // Fetch events for the calendar
  getEvents() {
    this.showSpinner = true;
    this.faService.getEvents().subscribe((response: any) => {
      console.log('Response from server:', response);
      const newEvents = response.records.map((record: any) => ({
        title: record.event_name,
        start: record.event_date,
        url: record.website_Url,
        type: record.eventType
      }));
      console.log('Parsed events:', newEvents); // Log parsed events
      this.events = newEvents;
      this.filteredEvents = newEvents;
      this.updateCalendarEvents();
      this.showSpinner = false;
    });
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.filteredEvents;
    this.cdr.detectChanges();
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleEventDidMount(info: any) {
    const eventType = info.event.extendedProps.type;

    const eventColors: { [key: string]: string } = {
      'webinar': '#F19ED2',
      'trade_show': '#FF7F3E',
      'classroom': '#7D8ABC',
      'product_launch': '#379777',
      'online': '#50B498'
    };

    const backgroundColor = eventColors[eventType] || 'gray';
    info.el.style.backgroundColor = backgroundColor;
    info.el.style.border = 'none';
    info.el.style.color = 'white';
    console.log('Mounted event:', info.event.title, 'with type:', eventType, 'and color:', backgroundColor);
  }

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today createEventButton EventType',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    views: {
      dayGridMonth: {
        buttonText: 'month'
      },
      timeGridWeek: {
        buttonText: 'week'
      },
      timeGridDay: {
        buttonText: 'day'
      },
      listWeek: {
        buttonText: 'list'
      }
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: this.filteredEvents,
    eventClick: this.handleEventClick.bind(this),
    customButtons: {
      createEventButton: {
        text: 'Create Event',
        click: () => this.showEventInfoModal()
      },
      EventType: {
        text: 'Event Type',
        click: () => this.showEventTypeModal()
      }
    },
    eventDidMount: this.handleEventDidMount.bind(this)
  };

  handleCreateEventClick = () => {
    this.showEventInfoModal();
  }

  toggleEventTypeDropdown() {
    this.showEventTypeModal();
  }

  handleEventClick(info: EventClickArg): void {
    if (info.event.url) {
      window.open(info.event.url, '_blank');
      info.jsEvent.preventDefault();
      return;
    }
  }

  onEventTypeChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedEventTypes.push(value);
    } else {
      this.selectedEventTypes = this.selectedEventTypes.filter(type => type !== value);
    }
  }

  applyEventTypeFilter() {
    if (this.selectedEventTypes.length === 0) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event => this.selectedEventTypes.includes(event.type));
    }
    this.updateCalendarEvents();
  }

  calculateTotal() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let score = 0;
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.checked) {
        score++;
      }
    });
    this.totalScore = score;
    this.showChart = true;
    this.cdr.detectChanges();
    this.createOrUpdateChart();
  }

  createOrUpdateChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.totalScore, this.getTotalCheckboxes() - this.totalScore];
      this.chart.update();
    } else if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Checked', 'Unchecked'],
          datasets: [{
            data: [this.totalScore, this.getTotalCheckboxes() - this.totalScore],
            backgroundColor: ['green', 'red']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  getTotalCheckboxes(): number {
    return document.querySelectorAll('input[type="checkbox"]').length;
  }

  onBack() {
    this.userService.onBack();
  }
}

