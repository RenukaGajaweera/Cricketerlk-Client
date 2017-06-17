import { Component, Input } from '@angular/core';

@Component({
  selector: 'view-user',
  templateUrl: './view-user.component.html',
})

export class ViewUserComponent {

  @Input() userName: string;
  @Input() token: string;
  @Input() email: string;
  @Input() password: string;

}