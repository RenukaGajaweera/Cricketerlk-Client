import { Injectable } from '@angular/core';
import { ClkHttpService } from 'app/services/clk-http.service';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Configurations, RestEndPoints } from 'app/utils/constants';
import { Player } from "app/models/player";

@Injectable()
export class ClkPlayerService {
    constructor(private httpService: ClkHttpService, private clkNotificationService: ClkNotificationService) { }

    public getPlayersByCountry(countryCode: number): any {
        let options: RequestOptionsArgs = {};
        options.url = Configurations.APP_BASE + RestEndPoints.GET_PLAYERS_BY_COUNTRY + countryCode;
        options.method = RequestMethod.Get;
        return this.httpService.request(options.url, options);
    }

    public addPlayer(player: Player) {
        let options: RequestOptionsArgs = {};
        options.url = Configurations.APP_BASE + RestEndPoints.ADD_PLAYER;
        options.method = RequestMethod.Post;
        options.body = player;
        return this.httpService.request(options.url, options);
    }

}
