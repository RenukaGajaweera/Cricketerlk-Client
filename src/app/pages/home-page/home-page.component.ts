import { Component } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Configurations, CommonProperties, Country } from 'app/utils/constants';
import { User } from 'app/models/user';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { Message, LEVEL } from "app/models/message";
import { ClkMatchService } from "app/services/clk-match.service";
import { ClkCommonUtils } from "app/services/common.service";
import { ClkFantasyService } from "app/services/clk-fantasy.service";

declare var $;

@Component({
    selector: 'app-home',
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css']
})

export class HomeComponent {

    private user: User;
    private teamImagePath;
    private supCountry: any;
    private viewResultsLink: string;
    private playLink: string;
    private matchDetails: any;
    private leaderboard: any;
    private scorePosition: any = {
        score: 0,
        position: 0
    };

    constructor(private authService: AuthService,
        private sanitizer: DomSanitizer,
        private notificationService: ClkNotificationService,
        private clkMatchService: ClkMatchService,
        private utils: ClkCommonUtils,
        private fantasyService: ClkFantasyService) {

        this.viewResultsLink = Configurations.VIEW_RESULTS_LINK;
        this.playLink = Configurations.PLAY_LINK;

        this.notificationService.showLoader();
        this.authService.getUserObservable().subscribe(res => {
            if (res !== undefined && res !== null) {
                this.user = res;
                if (this.user.teamImage !== null && this.user.teamImage !== undefined && this.user.teamImage !== '') {
                    this.teamImagePath = Configurations.IMAGE_BASE + this.user.teamImage;
                } else {
                    let imageUrl = Configurations.IMAGE_BASE + CommonProperties.NULL_TEAM_IMAGE;
                    this.teamImagePath = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
                }
                this.setCountry(this.user.supportingCountry);
                this.notificationService.hideLoader();
                this.getLeaderBoardScores();
            }
        }, error => {
            let message: Message = new Message()
            message.messageBody = 'Encountered error while loading your user details';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
            this.notificationService.hideLoader();
            console.error(error);
        });

        this.clkMatchService.getOnGoingMatchDetails(new Date()).subscribe(res => {
            if (res.resObject !== undefined && res.resObject !== null && res.resObject.length > 0) {
                this.matchDetails = res.resObject;
                for (let match of this.matchDetails) {
                    this.setDateDetails(match);
                    this.setCountryDetails(match);
                }
            } else {
                this.notificationService.hideLoader();
                this.notificationService.hideLoader();
                let message: Message = new Message();
                message.messageBody = 'Failed to retrieve on going match details';
                message.alertLevel = LEVEL.ERROR;
                ClkNotificationService.notificationTrigger.next(message);
            }
        }, error => {
            console.error(error);
            let message: Message = new Message();
            message.messageBody = 'Failed to retrieve on going match details';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
        });
    }

    private setCountry(countryCode: number): void {
        this.supCountry = Country[countryCode - 1];
    }

    private play(scheduleId: number): void {
        // window.location.href = 'https://docs.google.com/forms/d/1ndvTfkZv6PH--gBIONFUhgbB4nTgaaax1ONYoaiAwpw/edit';
        if (Configurations.OLD_PLAY) {
            window.open(this.playLink);
        } else {
            window.location.href = '/play?matchId=' + scheduleId;
        }
    }

    private viewScores(scheduleId: number, resultType?: string) {
        if (!resultType) {
            resultType = 'm';
        }
        window.open(this.viewResultsLink);
        // window.location.href = Configurations.VIEW_RESULTS_LINK;
        // window.location.href = '/results?m=' + scheduleId + '&t=' + resultType;
    }

    private gameCardAction(status: number, scheduleId: number) {
        switch (status) {
            case 1: {
                this.viewScores(scheduleId, 'm');
                break;
            }
            case 3: {
                this.play(scheduleId);
            }
        }
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
    }

    private getLeaderBoardScores(): void {
        this.fantasyService.getLeaderBoardScores().subscribe(res => {
            if (res.resObject.length > 0) {
                this.leaderboard = res.resObject;
                this.leaderboard.sort((a, b) => {
                    if (a[2] < b[2]) {
                        return 1;
                    } if (a[2] > b[2]) {
                        return -1;
                    }
                    return 0;
                });
                this.getUserScore();
                console.log(this.scorePosition);
            }
        }, error => {
            console.error(error);
            this.notificationService.hideLoader();
            let message: Message = new Message();
            message.messageBody = 'Failed to retrieve Leaderboard';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
        });
    }

    private viewLeaderBoard(): void {
        $('#LeaderboardModal').modal('toggle');
    }

    private getUserScore(): void {
        for (let i in this.leaderboard) {
            if (this.leaderboard[i][0] === this.user.userId) {
                let leaderboardResult: any = this.leaderboard[i];
                this.scorePosition.score = leaderboardResult[2];
                this.scorePosition.position = +i + 1;
            }
        }
    }
}
