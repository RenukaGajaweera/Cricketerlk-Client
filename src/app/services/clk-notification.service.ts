import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Message } from 'app/models/message';
import { Configurations } from "app/utils/constants";

declare var $;

@Injectable()
export class ClkNotificationService {

    public static notificationTrigger: BehaviorSubject<Message> = new BehaviorSubject<Message>(undefined);
    public static notificationObservable: Observable<any> = ClkNotificationService.notificationTrigger.asObservable();
    private backgroundImage: string = Configurations.IMAGE_BASE + 'assets/blue_loader.gif';

    constructor() {
        $('#loader-item').css('background-image', 'url(' + this.backgroundImage + ')');
    }

    public showLoader(): void {
        $('#big-loader').css('display', 'block');
    }

    public hideLoader(): void {
        $('#big-loader').css('display', 'none');
    }

    public renderBigOverlay():void {
        $('#big-loader').css('display', 'block');
        $('#loader-item').css('display', 'none');
    }

    public hideBigOverlay():void {
        $('#big-loader').css('display', 'none');
        $('#loader-item').css('display', 'block');
    }
}
