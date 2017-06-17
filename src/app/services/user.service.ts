import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { RestEndPoints, Configurations } from 'app/utils/constants';
import { ClkHttpService } from 'app/services/clk-http.service';
import { User } from 'app/models/user';

@Injectable()
export class UserService {

    constructor(private http: Http, private clkHttpService: ClkHttpService) { }

    public getUser(userId: string): Observable<any> {
        let options: RequestOptionsArgs = {};
        options.url = Configurations.APP_BASE + RestEndPoints.GET_USER + userId;
        options.method = RequestMethod.Get;
        return this.clkHttpService.request(options.url, options);
    }

    public addUser(user: User): Observable<any> {
        let options: RequestOptionsArgs = {};
        options.url = Configurations.APP_BASE + RestEndPoints.ADD_USER;
        options.method = RequestMethod.Post;
        options.body = user;
        return this.clkHttpService.request(options.url, options);
    }

}