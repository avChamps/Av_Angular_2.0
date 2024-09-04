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
import { AdminPageComponent } from './admin-page/admin-page.component';
import { VideoSimulatorComponent } from './video-simulator/video-simulator.component';
import { ToolsPageComponent } from './tools-page/tools-page.component';
import { BussinessCardComponent } from './bussiness-card/bussiness-card.component';
import { MacFinderComponent } from './mac-finder/mac-finder.component';
import { AvRackComponent } from './av-rack/av-rack.component';
import { BudgetCalculatorComponent } from './budget-calculator/budget-calculator.component';
import { BandwidthCalculatorComponent } from './bandwidth-calculator/bandwidth-calculator.component';
import { ThrowDistanceComponent } from './throw-distance/throw-distance.component';
import { DiagonalScreenComponent } from './diagonal-screen/diagonal-screen.component';

const appRoutes: Routes = [
    { path: '', component: HeaderComponent },
    { path: 'redirected-page/:value', component: RedirectedPageComponent },
    { path: 'jobs-portal', component: JobPortalComponent, canActivate: [AuthGuardService] },
    { path: 'community', component: CommunityComponent, canActivate: [AuthGuardService] },
    { path: 'login-page/:value', component: LoginPageComponent },
    { path : 'admin-page', component : AdminPageComponent },
    { path: 'bussiness-card/:emailId', component: BussinessCardComponent },
    { path: 'ekart-page', component: EkartComponent, canActivate: [AuthGuardService] },
    {
        path: 'profile-dashboard', component: ProfileDashboardComponent, canActivate: [AuthGuardService],
         children: [
            { path: 'about', component: ProfileAboutComponent, canActivate: [AuthGuardService] },
            { path: 'feed', component: ProfileFeedComponent , canActivate: [AuthGuardService]},
            { path: 'directory', component: ProfileDirectoryComponent , canActivate: [AuthGuardService]},
            { path: 'calendar', component: CalenderComponent, canActivate: [AuthGuardService] },
            { path: 'videoSimulator', component: VideoSimulatorComponent, canActivate: [AuthGuardService] },
            { path: 'tools', component: ToolsPageComponent, canActivate: [AuthGuardService] },
            { path: 'macFinder', component: MacFinderComponent, canActivate: [AuthGuardService] },
            { path: 'avRack', component: AvRackComponent, canActivate: [AuthGuardService] },
            { path: 'budgetCalculator', component: BudgetCalculatorComponent, canActivate: [AuthGuardService] },
            { path: 'bandwithCalculator', component: BandwidthCalculatorComponent, canActivate: [AuthGuardService] },
            { path: 'projectThrowDistance', component: ThrowDistanceComponent, canActivate: [AuthGuardService] },
            { path: 'DiagonalScreenSize', component : DiagonalScreenComponent, canActivate: [AuthGuardService] },
            { path: 'bussiness-card', component: BussinessCardComponent },
            { path: '', redirectTo: 'feed', pathMatch: 'full' }
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
