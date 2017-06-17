import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './pages/user-page/user.component';
import { LoginComponent } from 'app/pages/login-page/login-page.component';
import { HomeComponent } from 'app/pages/home-page/home-page.component';
import { RulesPageComponent } from 'app/pages/rules-page/rules-page.component';
import { AboutUsComponent } from 'app/pages/about-us/about-us.component';
import { AdminComponent } from 'app/pages/admin-page/admin-page.component';
import { SchedulePageComponent } from 'app/pages/schedule-page/schedule-page.component';
import { PlayPageComponent } from 'app/pages/play-page/play-page.component';
import { ResultsPageComponent } from "app/pages/results-page/results-page.component";

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rules', component: RulesPageComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'schedule', component: SchedulePageComponent },
  { path: 'play', component: PlayPageComponent },
  {path: 'results', component: ResultsPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }