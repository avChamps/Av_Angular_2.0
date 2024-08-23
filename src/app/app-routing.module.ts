import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { JobPortalComponent } from './job-portal/job-portal.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RedirectedPageComponent } from './redirected-page/redirected-page.component';
import { EkartComponent } from './ekart/ekart.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfileDirectoryComponent } from './profile-directory/profile-directory.component';
import { ProfileFeedComponent } from './profile-feed/profile-feed.component';
import { CommunityComponent } from './community/community.component';
import { CalenderComponent } from './calender/calender.component';


const appRoutes: Routes = [
    { path: '', component: HeaderComponent },
    { path: 'redirected-page/:value', component: RedirectedPageComponent },
    { path: 'jobs-portal', component: JobPortalComponent },
    { path: 'community', component: CommunityComponent },
    { path: 'login-page/:value', component: LoginPageComponent },
    { path: 'ekart', component: EkartComponent },
    {
        path: 'profile-dashboard', component: ProfileDashboardComponent, children: [
            { path: 'about', component: ProfileAboutComponent },
            { path: 'feed', component: ProfileFeedComponent },
            { path: 'directory', component: ProfileDirectoryComponent },
            { path: 'calender', component: CalenderComponent },
            { path: '', redirectTo: 'about', pathMatch: 'full' }
        ]
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],

    exports: [RouterModule]
})
export class AppRoutingModule {

}