import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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

  getCommunityData(limit: any, offset: number, searchQuery: string, location: string, questionType: string, postedBy: string,sortBy : any,email : any) {
    let queryParams = `limit=${limit}&offset=${offset}`;

    if (searchQuery) {
      queryParams += `&searchQuery=${searchQuery}`;
    }

    if (location) {
      queryParams += `&location=${location}`;
    }

    if (questionType) {
      queryParams += `&questionType=${questionType}`;
    }

    if (postedBy) {
      queryParams += `&postedBy=${postedBy}`;
    }

    if (email) {
      queryParams += `&email=${email}`;
    }

    if(sortBy) {
      queryParams += `&sortBy=${sortBy}`;
    }

    return this.http.get<any>(`${this.url}/getCommunityData?${queryParams}`);
  }

  getComments(questionId: number) {
    return this.http.get(`${this.url}/getComments`, { params: { questionId } });
  }
  
  addComment(comment: { questionId: number; emailId: string; userName: string; commentText: string }) {
    return this.http.post(`${this.url}/addComment`, comment);
  }
  
  addLike(payload: { questionId?: number; commentId?: number }) {
    return this.http.post(`${this.url}/addLike`, payload);
  }
  
  postQuestion(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/postQuestion`, formData);
  }

  updateQuestion(formData: FormData): Observable<any> {
    return this.http.put(`${this.url}/updateQuestion`, formData);
  }
  
  
  deleteQuestion(questionId: number) {
    return this.http.delete(`${this.url}/deleteQuestion/${questionId}`);
  }
  
  
}

