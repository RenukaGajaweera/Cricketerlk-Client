import { Component } from '@angular/core';
import { ClkPlayerService } from 'app/services/clk-player.service';
import { Player } from 'app/models/player';
import { Country, PlayerTypes } from 'app/utils/constants';
import { ClkMatchService } from "app/services/clk-match.service";
import { Message, LEVEL } from "app/models/message";
import { ClkNotificationService } from "app/services/clk-notification.service";
import { ClkCommonUtils } from "app/services/common.service";

declare var $;

@Component({
    selector: 'app-admin-page',
    templateUrl: 'admin-page.component.html',
    styleUrls: ['admin-page.component.css']
})

export class AdminComponent {

    private countries: any = Country;
    private playerTypes: any = PlayerTypes;
    private player: Player = new Player();
    private matchSchedules: any;
    private selectedMatch: number;

    constructor(private playerService: ClkPlayerService,
        private matchService: ClkMatchService,
        private notificationService: ClkNotificationService,
        private commonUtils: ClkCommonUtils) {

        $('#main-content-container').css('margin-bottom', '50px');
        this.retrieveMatchSchedules();
    }

    private addPlayer(): void {
        this.playerService.addPlayer(this.player).subscribe(res => {
            console.log(res);
        }, err => {
            console.log(err);
        });
    }

    private selectCountry(country: any): void {
        this.player.countryName = country.COUNTRY_NAME;
        this.player.country = country.COUNTRY_CODE;
    }

    private selectPlayerType(playerType: any): void {
        this.player.playerType = playerType.TYPE_CODE;
        this.player.playerTypeName = playerType.TYPE_NAME;
    }

    private toggleKeeper(): void {
        this.player.wicketKeeper = !this.player.wicketKeeper;
        console.log(this.player);
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
        } else {
            match['matchResultDetails'] = 'TBA';
        }
    }

    private selectCard(matchId: number) {
        this.selectedMatch = matchId;
    }
}
