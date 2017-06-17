import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ClkMatchService } from "app/services/clk-match.service";
import { ClkNotificationService } from "app/services/clk-notification.service";
import { Message, LEVEL } from "app/models/message";
import { ClkFantasyService } from "app/services/clk-fantasy.service";

declare var $;

@Component({
    selector: 'score-card',
    templateUrl: 'score-card.component.html',
    styleUrls: ['score-card.component.css']
})

export class ScoreCardComponent implements OnChanges {

    @Input() private matchId: number;
    @Input() private summaryView: boolean = true;
    private createScoreCardList: boolean = false;
    private scoreCardDetils: any;
    private playerDetails: any

    constructor(private matchService: ClkMatchService,
        private notificationService: ClkNotificationService,
        private fantasyService: ClkFantasyService) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.matchId.currentValue !== undefined && changes.matchId.currentValue !== null) {
            if (changes.matchId.currentValue !== changes.matchId.currentValue.previousValue) {
                this.retrieveScoreCards(changes.matchId.currentValue);
            }
        }
    }

    private retrieveScoreCards(matchId: number) {
        this.matchService.retrieveScoreCardDetails(matchId).subscribe(res => {
            if (res.resObject.scoreCardList !== undefined && res.resObject.scoreCardList !== null) {
                if (res.resObject.scoreCardList.length > 0) {
                    this.scoreCardDetils = this.fillScoreCardPlayerInfo(res.resObject);
                    this.playerDetails = res.resObject.playerList;
                    this.createScoreCardList = false;
                } else {
                    this.createScoreCardList = true;
                    this.flush();
                }
            }
        }, error => {
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Something went wrong while retrieving score card details';
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
    }

    private fillScoreCardPlayerInfo(resposeData: any): any {
        let playerList: Array<any> = resposeData.playerList;
        for (let scoreCard of resposeData.scoreCardList) {
            for (let player of playerList) {
                if (scoreCard.playerId === player.playerId) {
                    scoreCard['playerName'] = player.playerName;
                    break;
                }
            }
        }
        return resposeData.scoreCardList;
    }

    private update(): void {
        this.notificationService.showLoader();
        if (this.parseAndValidate(this.scoreCardDetils)) {
            let tempObject: any = {};
            tempObject['scoreCardList'] = this.scoreCardDetils;
            tempObject['playerList'] = this.playerDetails;
            this.matchService.updateScoreCardDetails(tempObject).subscribe(res => {
                this.scoreCardDetils = this.fillScoreCardPlayerInfo(res.resObject);
                this.notificationService.hideLoader();
            }, error => {
                let message: Message = new Message();
                message.alertLevel = LEVEL.ERROR;
                message.messageBody = 'Something went wrong while updating score card details';
                ClkNotificationService.notificationTrigger.next(message);
                console.error(error);
                this.notificationService.hideLoader();
            });
        } else {
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Invalid values in score card details';
            ClkNotificationService.notificationTrigger.next(message);
            this.notificationService.hideLoader();
        }
    }

    private create(matchId: number): void {
        this.matchService.createScoreCardDetails(matchId).subscribe(res => {
            if (res.resObject) {
                this.retrieveScoreCards(matchId);
            }
        }, error => {
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Something went wrong while updating score card details';
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
    }

    private flush(): void {
        this.scoreCardDetils = undefined;
        this.playerDetails = undefined;
    }

    private parseAndValidate(scoreCardList: any): boolean {
        for (let scoreCard of scoreCardList) {
            try {
                scoreCard.battingScore = parseFloat(scoreCard.battingScore);
                scoreCard.battingScore = parseFloat(scoreCard.battingScore);
                scoreCard.battingScore = parseFloat(scoreCard.battingScore);
                if (isNaN(scoreCard.battingScore) || isNaN(scoreCard.battingScore) || isNaN(scoreCard.battingScore)) {
                    return false;
                }
            } catch (ex) {
                console.log(ex);
                return false;
            }
        }
        return true;
    }

    private updateUserPoints(): void {
        this.notificationService.showLoader();
        this.matchService.updateUserMatchScores(this.matchId).subscribe(res => {
            if (res.resObject) {
                let message: Message = new Message();
                message.alertLevel = LEVEL.SUCCESS;
                message.messageBody = 'Successfully updated user points';
                ClkNotificationService.notificationTrigger.next(message);
                this.notificationService.hideLoader();
            } else {
                let message: Message = new Message();
                message.alertLevel = LEVEL.ERROR;
                message.messageBody = 'Something went wrong while updated user points';
                ClkNotificationService.notificationTrigger.next(message);
                this.notificationService.hideLoader();
            }
        }, error => {
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Something went wrong while updated user points';
            ClkNotificationService.notificationTrigger.next(message);
            this.notificationService.hideLoader();
            console.error(error);
        });
    }

    private updateLeaderBoard(): void {
        this.notificationService.showLoader();
        this.fantasyService.updateLeaderBoard(this.matchId).subscribe(res => {
            if (res.resObject) {
                let message: Message = new Message();
                message.alertLevel = LEVEL.SUCCESS;
                message.messageBody = 'Successfully updated leaderboard results';
                ClkNotificationService.notificationTrigger.next(message);
                this.notificationService.hideLoader();
            } else {
                let message: Message = new Message();
                message.alertLevel = LEVEL.ERROR;
                message.messageBody = 'Something went wrong while updated leaderboard results';
                ClkNotificationService.notificationTrigger.next(message);
                this.notificationService.hideLoader();
            }
        }, error => {
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Something went wrong while leaderboard results';
            ClkNotificationService.notificationTrigger.next(message);
            this.notificationService.hideLoader();
            console.error(error);
        });
    }

}
