import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobsPortalService {

  private apiUrl = 'https://avchamps.com/testing-nodejs';

  // private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  submitApplication(applicationData: any): Observable<any> {
    // return this.http.post<any>(`this.apiUrl` + `submitApplication``, applicationData);
    return this.http.post<any>(`${this.apiUrl}/submitApplication`, applicationData);
  }

  getPostedJobs(limit: number, offset: number, searchQuery: string, location: string, jobType: string, postedBy: string) {
    let queryParams = `limit=${limit}&offset=${offset}`;
    
    if (searchQuery) {
      queryParams += `&searchQuery=${searchQuery}`;
    }
  
    if (location) {
      queryParams += `&location=${location}`;
    }
  
    if (jobType) {
      queryParams += `&jobType=${jobType}`;
    }

    if(postedBy) {
      queryParams += `&postedBy=${postedBy}`;
    }
  
    return this.http.get<any>(`${this.apiUrl}/getPostedJobs?${queryParams}`);
  }
  
  editJob(job: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/editJob`, job);
  }

  deleteJob (data: any) {
    return this.http.post(`${this.apiUrl}/deleteJob`, data)
  }

}
