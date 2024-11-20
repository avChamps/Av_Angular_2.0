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

  getQuizQestions(data : any) {
    return this.http.post(`${this.url}/getQuizQestions`,data)
  }

  insertQuizOptions (data: any) {
    return this.http.post(`${this.url}/insertQuizOptions`, data)
  }

  getTopScores() {
    return this.http.get(`${this.url}/getTopScores`)
  }

  getOverallCount(data :any) {
    return this.http.post(`${this.url}/getOverallCount`, data)
  }

}

