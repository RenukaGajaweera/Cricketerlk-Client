import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { UploadService } from 'app/services/upload.service';
import { ViewUserComponent } from "app/components/view-user/view-user.component";

declare const $;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  providers:[UploadService]
})

export class UserComponent {

  constructor(private uploadService: UploadService) { }

}
