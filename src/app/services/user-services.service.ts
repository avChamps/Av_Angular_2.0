import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Route, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  url = 'https://avchamps.com/nodejs';
  // url = 'http://localhost:3000'
  // url = 'http://10.0.0.68:3000';

  // url = 'http://192.168.29.47:3000'

  private refreshData$ = new Subject<void>()

  constructor (private http: HttpClient, private router : Router) {}

  uploadProfile (data: FormData) {
    return this.http.post(`${this.url}/insertProfile`, data)
  }

  updateProfile (data: FormData) {
    return this.http.post(`${this.url}/updateProfile`, data)
  }

  uploadSocialMedia (data: FormData) {
    return this.http.post(`${this.url}/insertSocialMedia`, data)
  }

  updateSocialMedia (data: FormData) {
    return this.http.post(`${this.url}/updateSocialMedia`, data)
  }

  getProfileImage (emailId: string) {
    return this.http.get<any>(`${this.url}/getProfileImage/${emailId}`)
  }

  getUserImages () {
    return this.http.get(`${this.url}/getProfileImages`)
  }

  getProfileData () {
    return this.http.get(`${this.url}/getProfile`)
  }

  uploadProfileImage (data: FormData) {
    return this.http.post(`${this.url}/insertProfileImage`, data)
  }

  updateProfileImage (data: FormData) {
    return this.http.post(`${this.url}/updateProfileImage`, data)
  }

  getProfile (emailId: string) {
    return this.http.get<any>(`${this.url}/getProfile/${emailId}`)
  }

  getSocialMediaProfile (emailId: string) {
    return this.http.get<any>(`${this.url}/getSocialMediaProfile/${emailId}`)
  }

  getProfileWeight (emailId: string) {
    return this.http.get<any>(`${this.url}/getProfileWeight/${emailId}`)
  }

  getCartData (offset: number, searchText: string, productCategory : string,location : string) {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('searchText', searchText)
      .set('productCategory', productCategory)
      .set('location', location)
    return this.http.get<any>(`${this.url}/getCartData`, { params })
  }

  getUploadData (emailId: string, offset: any) {
    const params = new HttpParams().set('offset', offset.toString())
    return this.http.get<any>(`${this.url}/getUploadData/${emailId}`, {
      params
    })
  }

onBack() {
  this.router.navigate(['/profile-dashboard/tools']);
}

  insertCart (data: FormData) {
    return this.http.post(`${this.url}/insertCart`, data)
  }

  updateCartData (data: FormData) {
    return this.http.post(`${this.url}/updateCart`, data)
  }

  soldOut (data: any) {
    return this.http.post(`${this.url}/soldOutProduct`, data)
  }

  deleteCartData (data: any) {
    return this.http.post(`${this.url}/deleteCartRecords`, data)
  }

  insertProductReview (data: any) {
    return this.http.post(`${this.url}/insertProductReview`, data)
  }

  getProductReview(data : any) {
    return this.http.post(`${this.url}/getProductReview`, data)
  }

  getRatings(data : any) {
    return this.http.post(`${this.url}/getRatings`, data)
  }

  insertProductFeedback(data :any) {
    return this.http.post(`${this.url}/insertProductFeedback`, data)
  }

  insertFeedback (feedbackData: any) {
    return this.http.post(`${this.url}/insertFeedBack`, feedbackData)
  }

  getFeedBackData () {
    return this.http.get(`${this.url}/getFeedBackData`)
  }

  getBussinessCard (emailId: string) {
    return this.http.get<any>(`${this.url}/getBussinessCard/${emailId}`)
  }

  insertPoints (data: any) {
    return this.http.post(`${this.url}/insertPoints`, data)
  }

  deletePoints(data :any) {
    return this.http.post(`${this.url}/deletePoints`, data)
  }

  getPoints (data: any) {
    return this.http.post(`${this.url}/getPoints`, data)
  }

  getRefreshDataObservable () {
    return this.refreshData$.asObservable()
  }

  submitApplication(applicationData: any): Observable<any> {
    // return this.http.post<any>(`this.apiUrl` + `submitApplication``, applicationData);
    return this.http.post<any>(`${this.url}/submitApplication`, applicationData);
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
  
    return this.http.get<any>(`${this.url}/getPostedJobs?${queryParams}`);
  }
  
  
  editJob(job: any): Observable<any> {
    return this.http.post(`${this.url}/editJob`, job);
  }

  deleteJob (data: any) {
    return this.http.post(`${this.url}/deleteJob`, data)
  }

  refreshData () {
    this.refreshData$.next()
  }
}
