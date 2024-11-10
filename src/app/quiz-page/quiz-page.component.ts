import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { QuizServiceService } from '../quiz-service.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent implements OnInit {
  questions: any[] = [];
  emailId: string = 'disendra889@gmail.com';
  userName: string = 'Disendra';
  currentQuestionIndex: number = 0;
  topScores: any[] = []
  selectedOptionId: number | null = null;
  isCorrect: boolean | null = null;
  optionSelected: boolean = false;
  showSpinner: boolean = false;
  // labels: string[] = ['Correct', 'Wrong']
  labels: string[] = ['', '']
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private data = [0, 0];
  private colors = ['#0000ffc9', '#008000b8', '#ff0000b0'];

  constructor(private quizService: QuizServiceService) { }

  ngOnInit(): void {
    this.getQuizQuestions();
    this.getTopScores();
    this.getOverallCount()
    if (this.pieCanvas && this.pieCanvas.nativeElement) {
      this.context = this.pieCanvas.nativeElement.getContext('2d')!;
      this.drawPieChart();
    } else {
      console.log("Canvas is not initialized properly.");
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
      },
      (error: any) => {
        console.error("Error fetching quiz questions:", error);
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
      },
      (error: any) => {
        console.error("Error fetching top Scores", error);
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
  }

  drawPieChart(): void {
    const total = this.data.reduce((sum, value) => sum + value, 0);
    let startAngle = 0;

    const centerX = this.pieCanvas.nativeElement.width / 2;
    const centerY = this.pieCanvas.nativeElement.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    this.data.forEach((value, index) => {
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
          this.getOverallCount();
        } else {
          console.log('Failed to record response:', response.message);
        }
      },
      (error: any) => {
        console.error('Error posting quiz option:', error);
      }
    );
    this.showSpinner = false;
  }

  drawSlice(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string): void {
    this.context.beginPath();
    this.context.moveTo(centerX, centerY);
    this.context.arc(centerX, centerY, radius, startAngle, endAngle);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
  }

}

