import { Component } from '@angular/core';
import { ClkMatchService } from 'app/services/clk-match.service';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { Message, LEVEL } from "app/models/message";
import { ClkCommonUtils } from "app/services/common.service";
import { Country } from "app/utils/constants";

declare var $;

@Component({
    selector: 'app-schedule-page',
    templateUrl: 'schedule-page.component.html',
    styleUrls: ['schedule-page.component.css']
})

export class SchedulePageComponent {

    private matchSchedules: any;

    constructor(private matchService: ClkMatchService, private notificationService: ClkNotificationService, private clkUtils: ClkCommonUtils) {
        $('#main-content-container').css('margin-bottom', '50px');
        this.retrieveMatchSchedules();
    }

    private retrieveMatchSchedules(): void {
        this.matchService.getAllMatchDetails().subscribe(res => {
            this.matchSchedules = res.resObject;
            for (let match of this.matchSchedules) {
                this.setDateDetails(match);
                this.setCountryDetails(match);
            }
        }, error => {
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Something went wrong while retrieving match schedules';
            ClkNotificationService.notificationTrigger.next(message);
        });
    }

    private setDateDetails(match: any) {
        let date: Date = new Date(match.matchDate);
        match['gameDay'] = ClkCommonUtils.getDay(date.getDay());
        match['gameDate'] = date.getDate();
    }

    private setCountryDetails(match: any) {
        let teamOneDetails: any = Country[match.teamOne - 1];
        let teamTwoDetails: any = Country[match.teamTwo - 1];
        match['teamOneName'] = teamOneDetails.COUNTRY_NAME_CODE;
        match['teamTwoName'] = teamTwoDetails.COUNTRY_NAME_CODE;
        let matchResultDetails: any
        if (match.matchResult > 0) {
            matchResultDetails = Country[match.matchResult - 1];
            match['matchResultDetails'] = matchResultDetails.COUNTRY_NAME_CODE;
        } else if(match.matchResult === -1) {
            match['matchResultDetails'] = 'No result';
        } else if(match.matchResult === -2) {
            match['matchResultDetails'] = 'Tied';
        } else {
            match['matchResultDetails'] = 'TBA';
        }
    }
}
