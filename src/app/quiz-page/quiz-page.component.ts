import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { QuizServiceService } from '../quiz-service.service';
import { Modal } from 'bootstrap';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  emailId: string = 'disendra889@gmail.com';
  userName: string = 'Disendra';
  currentQuestionIndex: number = 0;
  topScores: any[] = []
  selectedOptionId: number | null = null;
  isCorrect: boolean | null = null;
  optionSelected: boolean = false;
  showSpinner: boolean = false;
  isDisplyedCoins: boolean = false;
  @ViewChild('actionButton') actionButton!: ElementRef;
  private modalInstance!: Modal;
  // labels: string[] = ['Correct', 'Wrong']
  labels: string[] = ['', '']
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('modalId') modalElement: any;
  private context!: CanvasRenderingContext2D;
  private data = [0, 0];
  private colors = ['#0000ffc9', '#008000b8', '#ff0000b0'];
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  displayCoins: any = 0;

  constructor(private quizService: QuizServiceService, private userService: UserServicesService) { }

  ngOnInit(): void {
    // this.emailId = localStorage.getItem('emailId');
    // this.userName = localStorage.getItem('userName');
    this.getQuizQuestions();
    this.getTopScores();
    this.getOverallCount()
    setTimeout(() => {
      const modal = new Modal(this.modalElement.nativeElement);
      modal.show();
    }, 0);
    if (this.pieCanvas && this.pieCanvas.nativeElement) {
      this.context = this.pieCanvas.nativeElement.getContext('2d')!;
      this.drawPieChart();
    } else {
      console.log("Canvas is not initialized properly.");
    }
    this.updateCountdown();
    this.interval = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getQuizQuestions() {
    this.showSpinner = true;
    const data = {
      emailId: this.emailId
    }
    this.quizService.getQuizQestions(data).subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.status && response.data) {
          this.questions = this.transformQuizData(response.data);
          this.currentQuestionIndex = 0;
        }
        this.showSpinner = false;
      },
      (error: any) => {
        console.error("Error fetching quiz questions:", error);
        this.showSpinner = false;
      }
    );
  }


  getTopScores() {
    this.showSpinner = true;
    this.quizService.getTopScores().subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.status && response.data) {
          this.topScores = response.data;
        }
        this.showSpinner = false;
      },
      (error: any) => {
        console.error("Error fetching top Scores", error);
        this.showSpinner = false;
      }
    );
  }

  getOverallCount() {
    this.showSpinner = true;
    const data = {
      emailId: this.emailId
    };
    this.quizService.getOverallCount(data).subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.status && response.data) {
          const stats = response.data[0];
          const totalResponses = stats.total_responses;
          const correctAnswers = parseInt(stats.correct_answers, 10);
          const wrongAnswers = parseInt(stats.wrong_answers, 10);
          const unanswered = totalResponses - (correctAnswers + wrongAnswers);

          const pieData = [correctAnswers, wrongAnswers];
          const pieColors = ['#008000', '#ff0000'];
          if (unanswered > 0) {
            pieData.push(unanswered);
            pieColors.push('#0000ff');
          }

          this.data = pieData;
          this.colors = pieColors;
          this.drawPieChart();
        }
      },
      (error: any) => {
        console.error('Error fetching overall count:', error);
      }
    );
    this.showSpinner = false;
  }

  drawPieChart(): void {
    const total = this.data.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
      // Display the "No Records Found" image when there are no records
      this.pieCanvas.nativeElement.classList.add('no-records');
      const img = new Image();
      img.src = './assets/images/no_records_graph.png'; // Path to your empty state image

      img.onload = () => {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.pieCanvas.nativeElement.width, this.pieCanvas.nativeElement.height);

        // Adjust canvas dimensions to match image aspect ratio
        const canvasWidth = this.pieCanvas.nativeElement.width;
        const canvasHeight = this.pieCanvas.nativeElement.height;

        // Calculate image dimensions to fit within the canvas
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        const centerX = (canvasWidth - imgWidth) / 2;
        const centerY = (canvasHeight - imgHeight) / 2;

        ctx.drawImage(img, centerX, centerY, imgWidth, imgHeight);
      };
    } else {
      this.pieCanvas.nativeElement.classList.remove('no-records');
      let startAngle = 0;
      const centerX = this.pieCanvas.nativeElement.width / 2;
      const centerY = this.pieCanvas.nativeElement.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      this.data.forEach((value, index) => {
        if (value === 0) return;
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        this.drawSlice(centerX, centerY, radius, startAngle, endAngle, this.colors[index]);

        const labelAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + (radius / 1.5) * Math.cos(labelAngle);
        const labelY = centerY + (radius / 1.5) * Math.sin(labelAngle);
        const percentage = ((value / total) * 100).toFixed(1);
        const labelText = `${this.labels[index]} ${value} (${percentage}%)`;

        this.context.fillStyle = "#000";
        this.context.font = "24px sans-serif";
        this.context.textAlign = "center";
        this.context.fillText(labelText, labelX, labelY);

        startAngle = endAngle;
      });
    }
  }


  transformQuizData(data: any[]) {
    const groupedQuestions: any[] = [];

    data.forEach(item => {
      let question = groupedQuestions.find(q => q.question_id === item.question_id);
      if (!question) {
        question = {
          question_id: item.question_id,
          question_text: item.question_text,
          options: []
        };
        groupedQuestions.push(question);
      }

      question.options.push({
        option_id: 'optionA',
        option_text: item.option_a,
        is_correct: item.correct_answer === 'A'
      });
      question.options.push({
        option_id: 'optionB',
        option_text: item.option_b,
        is_correct: item.correct_answer === 'B'
      });
      question.options.push({
        option_id: 'optionC',
        option_text: item.option_c,
        is_correct: item.correct_answer === 'C'
      });
      question.options.push({
        option_id: 'optionD',
        option_text: item.option_d,
        is_correct: item.correct_answer === 'D'
      });
    });

    return groupedQuestions;
  }

  selectOption(option: any, question_id: any) {
    if (!this.optionSelected) {
      this.selectedOptionId = option.option_id;
      this.isCorrect = option.is_correct;
      this.optionSelected = true;
      this.insertQuizOptions(option, question_id);
      if (option.is_correct) {
        this.insertPoints(50);
      }
    }
  }

  nextQuestion() {
    this.selectedOptionId = null;
    this.isCorrect = null;
    this.optionSelected = false;
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      // this.getQuizQuestions()
    } else {
      this.questions = [];
    }
  }

  insertQuizOptions(option: any, question_id: number): void {
    this.showSpinner = true;
    const data = {
      emailId: this.emailId,
      userName: this.userName,
      question_id: question_id,
      is_correct: option.is_correct,
    };

    this.quizService.insertQuizOptions(data).subscribe(
      (response: any) => {
        if (response && response.status) {
          console.log('Response recorded successfully');
          this.getTopScores();
          this.getOverallCount()
        } else {
          console.log('Failed to record response:', response.message);
        }
        this.showSpinner = false;
      },
      (error: any) => {
        console.error('Error posting quiz option:', error);
        this.showSpinner = false;
      }
    );
  }


  drawSlice(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string): void {
    this.context.beginPath();
    this.context.moveTo(centerX, centerY);
    this.context.arc(centerX, centerY, radius, startAngle, endAngle);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
  }

  startQuiz(): void {
    this.actionButton.nativeElement.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateCountdown() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    const timeDifference = nextMidnight.getTime() - now.getTime();
    this.hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    this.minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    this.seconds = Math.floor((timeDifference / 1000) % 60);
  }

  insertPoints(points: number) {
    this.showSpinner = true;
    this.displayCoins = points;
    const pointsData = {
      emailId: this.emailId,
      userName: this.userName,
      points: points
    };
    this.userService.insertPoints(pointsData).subscribe((response: any) => {
      this.isDisplyedCoins = false;
      console.log('Form submitted:', response);
      console.log(response);
      setTimeout(() => {
        this.isDisplyedCoins = true;
      }, 100);
    });
    this.showSpinner = false;
  }
}

