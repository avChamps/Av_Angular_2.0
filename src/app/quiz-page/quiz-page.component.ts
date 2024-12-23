import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { QuizServiceService } from '../quiz-service.service';
import { Modal } from 'bootstrap';
import { UserServicesService } from '../services/user-services.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent implements OnInit, OnDestroy {
  showSpinner: boolean = false;
  isDisplayCoins: boolean = false;
  isCountdownActive: boolean = false;
  isAnswerCorrect: boolean = false;
  displayCoins: any = 0;
  emailId = 'disendra889@gmail.com';
  userName: string = 'Disendra';
  quizQuestions: any[] = [];
  userAnswers: { [key: number]: string } = {};
  currentIndex: number = 0;
  currentQuestion: any;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private intervalId: any;
  optionLetters: string[] = ['A', 'B', 'C', 'D'];
  topScores: any;
  stats: any;
  selectedOption: any;

  constructor(private quizService: QuizServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getQuizQuestions();
    this.startCountdown();
    this.getTopScores()
    this.getQuizStats()
  }

  getQuizQuestions() {
    this.quizService.getQuizQuestions({ emailId: this.emailId }).subscribe(
      (res: any) => {
        if (res.questions && res.questions.length > 0) {
          this.quizQuestions = res.questions.map((q: any) => ({
            question_id: q.question_id,
            question_text: q.question_text,
            options: [q.option_a, q.option_b, q.option_c, q.option_d],
            correct_answer: q.correct_answer
          }));
          this.currentQuestion = this.quizQuestions[this.currentIndex];
        } else {
          this.isCountdownActive = true;
          // If no questions are available, start the countdown
          this.startCountdown();
        }
      },
      (err) => {
        console.error('Error fetching quiz questions:', err);
      }
    );
  }

  getTopScores() {
    this.quizService.getTopScores().subscribe(
      (res: any) => {
        if (res.topScores) {
          this.topScores = res.topScores;
        }
      },
      (err) => {
        console.error('Error fetching top scores:', err);
      }
    );
  }

  onAnswerSelected(selectedOption: string, option: any) {
    this.selectedOption = selectedOption.trim();
    this.isAnswerCorrect = option === this.currentQuestion.correct_answer.trim();
    const isCorrect = option === this.currentQuestion.correct_answer;
    const response = {
      emailId: this.emailId,
      userName: this.userName,
      question_id: this.currentQuestion.question_id,
      is_correct: isCorrect
    };

    this.quizService.submitResponse(response).subscribe(
      (res: any) => {
        console.log('Response submitted:', res);
        if (res && this.isAnswerCorrect) {
          debugger;
          this.isDisplayCoins = true;
          this.displayCoins = 50;
        }
        this.getTopScores()
        this.getQuizStats()

        setTimeout(() => {
          this.moveToNextQuestion()
        }, 1500);
      },
      (err) => {
        console.error('Error submitting response:', err);
      }
    );
  }

  moveToNextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.quizQuestions.length) {
      this.currentQuestion = this.quizQuestions[this.currentIndex];
    } else {
      this.currentQuestion = null; // No more questions
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    }
  }

  startCountdown() {
    this.updateCountdown(); // Initial update
    this.intervalId = setInterval(() => {
      this.updateCountdown(); // Update every second
    }, 1000);
  }

  updateCountdown() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0); // Set to 12:00 AM of the next day

    const timeDifference = nextMidnight.getTime() - now.getTime();

    if (timeDifference <= 0) {
      // If the countdown reaches zero, reset it
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      clearInterval(this.intervalId); // Stop the countdown
      return;
    }

    this.hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    this.minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    this.seconds = Math.floor((timeDifference / 1000) % 60);
  }

  getQuizStats() {
    this.quizService.getQuizStats(this.emailId).subscribe(
      (res: any) => {
        this.stats = res;
      },
      (err) => {
        console.error('Error fetching stats:', err);
      }
    );
  }

  onSelection(type: any) {
    let searchWord = type.userName;
    this.router.navigate(['/profile-dashboard/directory'], { queryParams: { search: searchWord } });
  }

  onBack() {

  }



}