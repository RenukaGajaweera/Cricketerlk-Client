import {Component} from '@angular/core';
import { AuthService } from "app/services/auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ClkNotificationService } from "app/services/clk-notification.service";

declare var $;

@Component({
    selector: 'app-about-us',
    templateUrl: 'about-us.component.html',
    styleUrls: ['about-us.component.css']
})

export class AboutUsComponent {
    constructor(private authService: AuthService, private sanitizer: DomSanitizer, private notificationService: ClkNotificationService) {
        $('#main-content-container').css('background-color', 'rgb(159, 159, 159)');
        $('#main-content-container').css('min-height', '620px');
    }
}
