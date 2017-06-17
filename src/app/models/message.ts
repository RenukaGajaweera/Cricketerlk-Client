'use strict';

export class Message {
    messageBody: string;
    alertLevel: LEVEL;
}

export enum LEVEL {
    INFO,
    SUCCESS,
    WARNING,
    ERROR
}
