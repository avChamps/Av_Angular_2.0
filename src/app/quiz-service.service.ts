import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {
 url = 'https://avchamps.com/nodejs';
  // url = 'http://localhost:3000'

  constructor (private http: HttpClient, private router : Router) {}

  getQuizQuestions(data : any) {
    return this.http.post(`${this.url}/getQuizQuestions`,data)
  }

  submitResponse(data: { emailId: string; userName: string; question_id: number; is_correct: boolean }) {
    return this.http.post(`${this.url}/submitResponse`, data);
  }

  getTopScores() {
    return this.http.get(`${this.url}/getTopScores`);
  }
  

  getQuizStats(emailId: string) {
    return this.http.post(`${this.url}/getQuizStats`, { emailId });
  }
  
  

}

