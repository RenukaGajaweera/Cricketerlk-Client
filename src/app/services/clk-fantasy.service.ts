import { Injectable } from '@angular/core';
import { ClkHttpService } from 'app/services/clk-http.service';
import { RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Configurations, RestEndPoints } from 'app/utils/constants';
import { DetailedFantasyLeague } from 'app/models/detailed-fantasy-league';

@Injectable()
export class ClkFantasyService {

    constructor(private httpService: ClkHttpService) { }


    public fantasySquadExist(userId: string, matchId: number): any {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.TEAM_EXIST + userId + '/' + matchId;
        return this.httpService.request(options.url, options);
    }

    public createFantasyLeagueEntry(userId: string, matchId: number, structure: number) {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.CREATE_FANTASY_LEAGUE;
        options.url += userId + '/' + matchId + '/' + structure;
        return this.httpService.request(options.url, options);
    }

    public retrieveFantasyLeagueEntry(userId: string, matchId: number): any {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.RETRIEVE_FANTASY_LEAGUE;
        options.url += userId + '/' + matchId + '/';
        return this.httpService.request(options.url, options);
    }

    public addFantasyLeagueDetails(fantasyLeague: DetailedFantasyLeague): any {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Post;
        options.url = Configurations.APP_BASE + RestEndPoints.ADD_TEAM;
        options.body = fantasyLeague;
        return this.httpService.request(options.url, options);
    }

    public updateFantasyLeagueDetails(fantasyLeague: DetailedFantasyLeague): any {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Post;
        options.url = Configurations.APP_BASE + RestEndPoints.UPDATE_TEAM;
        options.body = fantasyLeague;
        return this.httpService.request(options.url, options);
    }

    public getLeaderBoardScores(): any {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.GET_LEADERBOARD_SCORES;
        return this.httpService.request(options.url, options);
    }

    public updateLeaderBoard(matchId): any {
        let options: RequestOptionsArgs = {};
        options.method = RequestMethod.Get;
        options.url = Configurations.APP_BASE + RestEndPoints.UPDATE_LEADERBOARD_SCORES + matchId;
        return this.httpService.request(options.url, options);
    }

}
