import { formatDate } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class FaServiceService {
   url = 'https://avchamps.com/nodejs';
  // url = 'http://localhost:3000'
  // url = 'http://192.168.29.47:3000'

  constructor (private http: HttpClient) {}

  getSession () {
    return this.http.get<any>(`${this.url}/getSession`)
  }

  setSession (token: string, userName: string, emailId: any): void {
    localStorage.setItem('jwtToken', token)
    localStorage.setItem('userName', userName)
    localStorage.setItem('emailId', emailId)
  }

  hasSession (): boolean {
    const token = localStorage.getItem('jwtToken')
    return !!token
  }

  clearSession (): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('emailId');
    localStorage.removeItem('dialogOpened');
  }

  // logout() {
  //   return this.http.get<any>(`${this.url}/logout`);
  // }

  login (emailId: string, password: string) {
    return this.http.post(`${this.url}/login`, { emailId, password })
  }

  getFooterTxt () {
    return this.http.get<any>(`${this.url}/getFooterText`)
  }

  createUser (data: any) {
    return this.http.post(`${this.url}/insertData`, data)
  }

  getLoginData (emailId: string) {
    return this.http.get<any>(`${this.url}/getLoginData/${emailId}`)
  }

  contactUs (data: any) {
    return this.http.post(`${this.url}/contactUs`, data)
  }

  newsLetter(data : any) {
    return this.http.post(`${this.url}/newsLetter`, data)
  }

  getUserDetails (offset: number, limit: number, searchTerm: string) {
    return this.http.get(
      `${this.url}/getLoginData?page=${offset}&pageSize=${limit}&searchTerm=${searchTerm}`
    )
  }

  getFeedData () {
    return this.http.get(`${this.url}/getFeedData`)
  }

  getEvents () {
    return this.http.get(`${this.url}/getEvents`)
  }

  postEvent (data: any) {
    return this.http.post(`${this.url}/postEvent`, data)
  }
  getMacData(sysAddress: any) {
    return this.http.get(`${this.url}/getMacData/${sysAddress}`);
  }

  insertFeedData (data: any) {
    return this.http.post(`${this.url}/insertFeed`, data)
  }

  insertEvent (data: any) {
    return this.http.post(`${this.url}/insertEvent`, data)
  }

  insertTradeShow (data: any) {
    return this.http.post(`${this.url}/insertTradeShow`, data)
  } 

  getTradeShow() {
    return this.http.get(`${this.url}/getTradeShow`)
  }

  getRoles () {
    return this.http.get(`${this.url}/countByRoles`)
  }

  downloadExcel (url: string, fileName: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe((data: Blob) => {
      const downloadLink = document.createElement('a')
      const fileURL = window.URL.createObjectURL(data)
      downloadLink.href = fileURL
      downloadLink.setAttribute('download', fileName)
      document.body.appendChild(downloadLink)
      downloadLink.click()
    })
  }

  downloadFeedback (
    tableName: any,
    startDate: Date,
    endDate: Date,
    rating: any
  ): void {
    const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US')
    const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US')
    const url = `${this.url}/downloadFeedBack?tableName=${tableName}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&rating=${rating}`
    this.downloadExcel(url, 'userData.xlsx')
  }

  downloadLoginInfoExcel (): void {
    this.downloadExcel(`${this.url}/downloadLoginInfo`, 'userData.xlsx')
  }

  downloadTodayLoginInfoExcel (): void {
    this.downloadExcel(`${this.url}/downloadTodayLogin`, 'userData.xlsx')
  }

  // downloadFeedBackExcel(): void {
  //   this.downloadExcel(`${this.url}/downloadFeedback`, 'userData.xlsx');
  // }
}
