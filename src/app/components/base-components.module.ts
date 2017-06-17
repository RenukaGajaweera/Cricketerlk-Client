import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ViewUserComponent } from 'app/components/view-user/view-user.component';
import { LoginUser } from 'app/components/login-user/login-user.component';
import { FormsModule } from '@angular/forms/';
import { UserMessages } from 'app/components/user-messages/user-messages.component';
import { ScoreCardComponent } from 'app/components/score-card/score-card.component';

@NgModule({
  declarations: [
      ViewUserComponent,
      LoginUser,
      UserMessages,
      ScoreCardComponent
  ],
  exports: [
      ViewUserComponent,
      LoginUser,
      UserMessages,
      ScoreCardComponent
  ],
  imports: [
      BrowserModule,
      FormsModule
  ]
})
export class BaseComponentModule { }
