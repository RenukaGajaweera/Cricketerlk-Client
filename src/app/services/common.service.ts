import { Injectable } from '@angular/core';

@Injectable()
export class ClkCommonUtils {

    public static getDay(date: number | string) {
        if (typeof (date) === 'string') {
            try {
                date = parseInt(date, 10);
            } catch (ex) {
                return '';
            }
        }
        switch (date) {
            case 0: {
                return 'SUN';
            }
            case 1: {
                return 'MON';
            }
            case 2: {
                return 'TUE';
            }
            case 3: {
                return 'WED';
            }
            case 4: {
                return 'THU';
            }
            case 5: {
                return 'FRI';
            }
            case 6: {
                return 'SAT';
            }
        }
    }

    public getParameterByName(name): any {
        let url = window.location.href;
        let stringList = url.split('?');
        let queryKeyValueList: Array<string> = stringList[1].split('&');
        for(let keyValuePair of queryKeyValueList) {
            if(keyValuePair.indexOf(name) > -1) {
                let keyValueList = keyValuePair.split('=');
                return keyValueList[1] || '';
            }
        }
    }

}
