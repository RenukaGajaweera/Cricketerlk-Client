import { Component } from '@angular/core';
import { ClkNotificationService } from "app/services/clk-notification.service";
import { ClkCommonUtils } from "app/services/common.service";
import { ClkPlayerService } from "app/services/clk-player.service";
import { ClkMatchService } from "app/services/clk-match.service";
import { Message, LEVEL } from "app/models/message";
import { Country } from "app/utils/constants";

@Component({
    selector: 'app-results-page',
    templateUrl: 'results-page.component.html',
    styleUrls: ['results-page.component.css']
})

export class ResultsPageComponent {

    private matchId: number;
    private resultType: string
    private matchSchedule: any;
    private matchStatus: number;
    private countryDetails: any = {
        teamOne: '',
        teamTwo: ''
    };

    constructor(private notificationService: ClkNotificationService,
        private commonUtils: ClkCommonUtils,
        private playerService: ClkPlayerService,
        private matchService: ClkMatchService) {

        this.matchId = this.commonUtils.getParameterByName('m');
        this.resultType = this.commonUtils.getParameterByName('t');
        this.matchService.getMatchById(this.matchId).subscribe(res => {
            this.matchSchedule = res.resObject;
            this.matchStatus = this.matchSchedule.currentStatus;
            this.countryDetails.teamOne = Country[this.matchSchedule.teamOne - 1].COUNTRY_NAME_CODE;
            this.countryDetails.teamTwo = Country[this.matchSchedule.teamTwo - 1].COUNTRY_NAME_CODE;
        }, error => {
            let message: Message = new Message()
            message.messageBody = 'Encountered error while loading match details';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
    }
}
