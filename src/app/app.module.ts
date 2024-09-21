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
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
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
import { ToastrModule } from 'ngx-toastr';
import { TitleCasePipe } from './title-case.pipe';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { VideoSimulatorComponent } from './video-simulator/video-simulator.component';
import { LinkifyPipePipe } from './linkify-pipe.pipe';
import { ToolsPageComponent } from './tools-page/tools-page.component';
import { BussinessCardComponent } from './bussiness-card/bussiness-card.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MacFinderComponent } from './mac-finder/mac-finder.component';
import { AvRackComponent } from './av-rack/av-rack.component';
import { BudgetCalculatorComponent } from './budget-calculator/budget-calculator.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BandwidthCalculatorComponent } from './bandwidth-calculator/bandwidth-calculator.component';
import { ThrowDistanceComponent } from './throw-distance/throw-distance.component';
import { DiagonalScreenComponent } from './diagonal-screen/diagonal-screen.component';
import { AspectRatioComponent } from './aspect-ratio/aspect-ratio.component';
import { AudioDelayComponent } from './audio-delay/audio-delay.component';
import { BtuCalculatorComponent } from './btu-calculator/btu-calculator.component';
import { PowerCalculatorComponent } from './power-calculator/power-calculator.component';
import { SafePipe } from './services/safe.pipe';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
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
    CalenderComponent,
    TitleCasePipe,
    AdminPageComponent,
    VideoSimulatorComponent,
    LinkifyPipePipe,
    ToolsPageComponent,
    BussinessCardComponent,
    MacFinderComponent,
    AvRackComponent,
    BudgetCalculatorComponent,
    BandwidthCalculatorComponent,
    ThrowDistanceComponent,
    DiagonalScreenComponent,
    AspectRatioComponent,
    AudioDelayComponent,
    BtuCalculatorComponent,
    PowerCalculatorComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RecaptchaFormsModule,
    FullCalendarModule,
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
    TooltipModule,
    QRCodeModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DatePipe,DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
