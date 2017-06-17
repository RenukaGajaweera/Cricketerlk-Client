import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';



import { AppRoutingModule } from './app-routes.module';
import { AppComponent } from './app.component';
import { BaseComponentModule } from 'app/components/base-components.module';
import { AuthService } from 'app/services/auth.service';
import { environment } from 'environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { UserComponent } from './pages/user-page/user.component';
import { LoginComponent } from 'app/pages/login-page/login-page.component';
import { HomeComponent } from 'app/pages/home-page/home-page.component';

import { ClkHttpService } from 'app/services/clk-http.service';
import { UserService } from 'app/services/user.service';
import { UploadService } from 'app/services/upload.service';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { RulesPageComponent } from 'app/pages/rules-page/rules-page.component';
import { AboutUsComponent } from 'app/pages/about-us/about-us.component';
import { AdminComponent } from 'app/pages/admin-page/admin-page.component';
import { ClkPlayerService } from 'app/services/clk-player.service';
import { ClkMatchService } from 'app/services/clk-match.service';
import { ClkCommonUtils } from 'app/services/common.service';
import { SchedulePageComponent } from 'app/pages/schedule-page/schedule-page.component';
import { PlayPageComponent } from 'app/pages/play-page/play-page.component';
import { ClkFantasyService } from "app/services/clk-fantasy.service";
import { ResultsPageComponent } from "app/pages/results-page/results-page.component";


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    HomeComponent,
    RulesPageComponent,
    AboutUsComponent,
    AdminComponent,
    SchedulePageComponent,
    PlayPageComponent,
    ResultsPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BaseComponentModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  providers: [
    AuthService,
    ClkHttpService,
    UserService,
    UploadService,
    ClkNotificationService,
    ClkPlayerService,
    ClkMatchService,
    ClkCommonUtils,
    ClkFantasyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
