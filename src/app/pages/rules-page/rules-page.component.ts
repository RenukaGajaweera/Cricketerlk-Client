import {Component} from '@angular/core';
import { AuthService } from "app/services/auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ClkNotificationService } from "app/services/clk-notification.service";

declare var $;

@Component({
    selector: 'app-rules',
    templateUrl: 'rules-page.component.html',
    styleUrls: ['rules-page.component.css']
})

export class RulesPageComponent {
    constructor(private authService: AuthService, private sanitizer: DomSanitizer, private notificationService: ClkNotificationService) {
        $('#main-content-container').css('background-color', 'rgb(159, 159, 159)');
        $('#main-content-container').css('margin-bottom', '50px');
    }
}
