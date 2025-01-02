import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-project-tracker',
  templateUrl: './project-tracker.component.html',
  styleUrls: ['./project-tracker.component.css']
})
export class ProjectTrackerComponent {
  projects: any[] = [];
  projectName: string = '';
  projectStart: string = '';
  projectEnd: string = '';

  // Subtask counters
  subtasksCompleted: number = 0;
  subtasksInProgress: number = 0;
  subtasksNotStarted: number = 0;

  // Chart instances
  projectsChart: any;
  subtasksChart: any;

  // Project counters
  totalProjects: number = 0;
  projectsCompleted: number = 0;

  constructor(private userService: UserServicesService) { }

  ngOnInit() {
    this.initializeCharts();
  }

  // Initialize charts
  initializeCharts() {
    // Initialize Projects Chart
    this.projectsChart = new Chart('projectsChart', {
      type: 'pie',
      data: {
        labels: ['Projects Completed', 'Projects Not Completed'],
        datasets: [
          {
            label: 'Projects Overview',
            data: [this.projectsCompleted, this.totalProjects - this.projectsCompleted],
            backgroundColor: ['#28a745', '#dc3545']
          }
        ]
      }
    });

    // Initialize Subtasks Chart
    this.subtasksChart = new Chart('subtasksChart', {
      type: 'bar',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
          {
            label: 'Subtasks Overview',
            data: [this.subtasksCompleted, this.subtasksInProgress, this.subtasksNotStarted],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545']
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Add a new project
  addProject() {
    const newProject = {
      name: this.projectName,
      startDate: this.projectStart,
      endDate: this.projectEnd,
      progress: 0,
      subtasks: [],
      newSubtaskName: '',
      newSubtaskStart: '',
      newSubtaskDue: ''
    };
    this.projects.push(newProject);
    this.totalProjects++;
    this.updateCharts();
    this.projectName = '';
    this.projectStart = '';
    this.projectEnd = '';
  }

  // Add a subtask to a project
  addSubtask(project: any) {
    const newSubtask = {
      name: project.newSubtaskName,
      startDate: project.newSubtaskStart,
      dueDate: project.newSubtaskDue,
      status: 'Not Started'
    };
    project.subtasks.push(newSubtask);
    project.newSubtaskName = '';
    project.newSubtaskStart = '';
    project.newSubtaskDue = '';
    this.subtasksNotStarted++; // Increment the "Not Started" counter
    this.updateProgress(project);
    this.updateCharts();
  }

  // Update project progress and subtask counters
  updateProgress(project: any) {
    const totalSubtasks = project.subtasks.length;
    const completedSubtasks = project.subtasks.filter((sub: any) => sub.status === 'Completed').length;
    const inProgressSubtasks = project.subtasks.filter((sub: any) => sub.status === 'In Progress').length;
    const notStartedSubtasks = project.subtasks.filter((sub: any) => sub.status === 'Not Started').length;

    // Update subtask counters
    this.subtasksCompleted = completedSubtasks;
    this.subtasksInProgress = inProgressSubtasks;
    this.subtasksNotStarted = notStartedSubtasks;

    // Update project progress
    project.progress = totalSubtasks
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

    if (project.progress === 100) {
      this.projectsCompleted++;
    }

    this.updateCharts();
  }

  // Update charts
  updateCharts() {
    // Update Projects Chart
    this.projectsChart.data.datasets[0].data = [
      this.projectsCompleted,
      this.totalProjects - this.projectsCompleted
    ];
    this.projectsChart.update();

    // Update Subtasks Chart
    this.subtasksChart.data.datasets[0].data = [
      this.subtasksCompleted,
      this.subtasksInProgress,
      this.subtasksNotStarted
    ];
    this.subtasksChart.update();
  }

  onBack() {
    this.userService.onBack();
  }
}
