import { Component } from '@angular/core';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { Message, LEVEL } from 'app/models/message';

@Component({
    selector: 'user-messages',
    templateUrl: 'user-messages.component.html',
    styleUrls: ['user-messages.component.css'],
    providers: [ClkNotificationService]
})

export class UserMessages {

    private messagesList: Array<Message> = [];

    constructor(private notificationService: ClkNotificationService) {
        ClkNotificationService.notificationObservable.subscribe(res => {
            if (res !== undefined && res !== null) {
                console.log(res.messageBody)
                this.messagesList.push(res);
            }
        });
    }

    private resolveLevel(level: LEVEL): string {
        switch (level) {
            case LEVEL.INFO: {
                return 'info';
            }
            case LEVEL.SUCCESS: {
                return 'success';
            }
            case LEVEL.WARNING: {
                return 'warning';
            }
            case LEVEL.ERROR: {
                return 'error';
            }
            default: {
                return 'info';
            }
        }
    }

    private removeMessage(index: number): void {
        this.messagesList.splice(index, 1);
    }
}
