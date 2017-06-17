import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ClkHttpService } from 'app/services/clk-http.service';
import { RequestOptions } from '@angular/http';
import { Configurations, RestEndPoints } from "app/utils/constants";

declare const $;

@Injectable()
export class UploadService {

    constructor(private clkHttpService: ClkHttpService) { }

    public makeFileRequest(url: string, data: any): void {
        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: url,
            data: data,
            //http://api.jquery.com/jQuery.ajax/
            //https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
            processData: false, //prevent jQuery from automatically transforming the data into a query string
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (response) {
                console.log('SUCCESS : ', response);
                return true;
            },
            error: function (error) {

                // $("#result").text(e.responseText);
                console.log('ERROR : ', error);
                return false;
                // $("#btnSubmit").prop("disabled", false);

            }
        });
    }

    public uploadImage (requestOptions: RequestOptions): Observable<any> {
        requestOptions.url = Configurations.APP_BASE + RestEndPoints.UPLOAD_IMG;
        return this.clkHttpService.request(requestOptions.url, requestOptions);
    }

    // public uploadFile() {}
}
