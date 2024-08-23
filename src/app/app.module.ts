import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { JobPortalComponent } from './job-portal/job-portal.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { RedirectedPageComponent } from './redirected-page/redirected-page.component';
import { ContactComponent } from './contact/contact.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { EkartComponent } from './ekart/ekart.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfileFeedComponent } from './profile-feed/profile-feed.component';
import { ProfileDirectoryComponent } from './profile-directory/profile-directory.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CommunityComponent } from './community/community.component';
import { CalenderComponent } from './calender/calender.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    JobPortalComponent,
    LoginPageComponent,
    RedirectedPageComponent,
    ContactComponent,
    EkartComponent,
    SpinnerComponent,
    ProfileDashboardComponent,
    ProfileAboutComponent,
    ProfileFeedComponent,
    ProfileDirectoryComponent,
    CommunityComponent,
    CalenderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    ReactiveFormsModule,
    TooltipModule
    
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
