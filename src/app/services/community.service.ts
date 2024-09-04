import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  //  url = 'http:// 192.168.29.47:3000'
  // url = 'http://10.0.0.68:3000';
  // url = 'http://localhost:3000'
  // url = 'https://avchamps.com/testing-nodejs';
  url = 'https://avchamps.com/nodejs';


  constructor(private http: HttpClient) { }

  private refreshData$ = new Subject<void>();

  getCommunityQuestions(limit: number, offset: number, searchQuery: string) {
    let queryParams = `limit=${limit}&offset=${offset}`;
    if (searchQuery) {
      queryParams += `&searchQuery=${searchQuery}`;
    }
    return this.http.get<any>(`${this.url}/getCommunityQuestions?${queryParams}`);
  }

  getUploadedCommunityQuestions(emailId: string, limit: number, offset: number, searchQuery: string) {
    let queryParams = `limit=${limit}&offset=${offset}&emailId=${emailId}`; // Add emailId parameter
    if (searchQuery) {
      queryParams += `&searchQuery=${searchQuery}`;
    }
    return this.http.get<any>(`${this.url}/getUploadedCommunityQuestions?${queryParams}`);
  }


  getMoreCommunityAnswers(qId: any) {
    return this.http.get<any>(`${this.url}/getMoreCommunityAnswers/${qId}`);
  }

  getFeedback(qId: any) {
    return this.http.get<any>(`${this.url}/getFeedback/${qId}`);
  }

  getLikesInfo(emailId: any) {
    return this.http.get<any>(`${this.url}/getLikesInfo/${emailId}`);
  }

  insertCommunity(data: FormData) {
    return this.http.post(`${this.url}/insertCommunity`, data)
  }

  insertCommunityAnswer(data: FormData) {
    return this.http.post(`${this.url}/insertCommunityAnswer`, data)
  }


  updateCommunity(data: FormData) {
    return this.http.post(`${this.url}/updateCommunity`, data)
  }

  deleteCommunity(data: any) {
    return this.http.post(`${this.url}/deleteCommunityRecords`, data)
  }

  postFeedback(data: any) {
    return this.http.post(`${this.url}/feedback`, data);
  }

}
