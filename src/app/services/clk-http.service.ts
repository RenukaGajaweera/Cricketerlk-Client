import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http/';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ClkHttpService {

    constructor(private http: Http) { }

    public request(url: string, requestOptions: RequestOptionsArgs): Observable<any> {
        return this.http.request(url, requestOptions).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        let body: any = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body: any = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}