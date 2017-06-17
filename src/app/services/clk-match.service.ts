import { Injectable } from '@angular/core';
import { ClkHttpService } from 'app/services/clk-http.service';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Configurations, RestEndPoints } from 'app/utils/constants';

@Injectable()
export class ClkMatchService {
    constructor(private httpService: ClkHttpService, private clkNotificationService: ClkNotificationService) { }

    /** Match details */
    public getOnGoingMatchDetails(date: Date) {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.GET_ON_GOING_DETAILS;
        options.url += '?fromDate=' + this.makeDateString(new Date(), -1);
        options.url += '&toDate=' + this.makeDateString(new Date(), 2);
        return this.httpService.request(options.url, options);
    }

    public getAllMatchDetails() {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.GET_ALL_SCHEDULES;
        return this.httpService.request(options.url, options);
    }

    public getMatchById(matchId: number) {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.GET_MATCH_BY_ID + matchId;
        return this.httpService.request(options.url, options);
    }

    /** Score card details */
    public retrieveScoreCardDetails(matchId: number) {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.GET_SCORE_CARDS + matchId;
        return this.httpService.request(options.url, options);
    }

    public createScoreCardDetails(matchId) {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.CREATE_MATCH_SCORE_CARDS + matchId;
        return this.httpService.request(options.url, options);
    }

    public updateScoreCardDetails(playerScoreCardList: any): any {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Post;
        options.url = Configurations.APP_BASE + RestEndPoints.UPDATE_SCORE_CARDS;
        options.body = playerScoreCardList;
        options.withCredentials = true;
        return this.httpService.request(options.url, options);
    }

    public updateUserMatchScores(matchId: number) {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.UPDATE_USER_SCORES + matchId;
        options.withCredentials = true;
        return this.httpService.request(options.url, options);
    }

    private makeDateString(date: Date, offset): string {
        let refinedDate: number = date.getDate() + offset;
        let refinedMonth: number = date.getMonth() + 1;
        return date.getFullYear() + '-' + refinedMonth + '-' + refinedDate;
    }

}
