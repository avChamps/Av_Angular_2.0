import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly EMAIL_KEY = 'loggedInEmail'
  private readonly user_Name = 'loggedInuserName'
  private readonly sessionIdKey = 'sessionId'
  private readonly OPENED_EMAILS_KEY = 'openedEmails'

  constructor () {
    // window.addEventListener('beforeunload', () => {
    //   this.clearLoggedInEmail();
    // });
  }

  saveLoggedInEmail (email: string) {
    localStorage.setItem(this.EMAIL_KEY, email)
  }

  saveUserName (userName: string) {
    localStorage.setItem(this.user_Name, userName)
  }

  getLoggedInEmail (): string | null {
    return localStorage.getItem(this.EMAIL_KEY)
  }

  getLoginuserName () {
    return localStorage.getItem(this.user_Name)
  }

  saveSessionId (sessionId: string) {
    localStorage.setItem(this.sessionIdKey, sessionId)
  }

  getSessionId (): string | null {
    return localStorage.getItem(this.sessionIdKey)
  }

  markEmailAsOpened (emailTitle: string) {
    const openedEmails = this.getOpenedEmails()
    openedEmails.push(emailTitle)
    localStorage.setItem(this.OPENED_EMAILS_KEY, JSON.stringify(openedEmails))
  }

  isEmailOpened (emailTitle: string): boolean {
    const openedEmails = this.getOpenedEmails()
    return openedEmails.includes(emailTitle)
  }

  private getOpenedEmails (): string[] {
    const openedEmailsJSON = localStorage.getItem(this.OPENED_EMAILS_KEY)
    return openedEmailsJSON ? JSON.parse(openedEmailsJSON) : []
  }

  clearLoggedInEmail () {
    localStorage.removeItem(this.EMAIL_KEY)
    localStorage.removeItem(this.user_Name)
    localStorage.removeItem(this.sessionIdKey)
  }

  isLoggedIn (): boolean {
    return !!this.getLoggedInEmail()
  }
}
