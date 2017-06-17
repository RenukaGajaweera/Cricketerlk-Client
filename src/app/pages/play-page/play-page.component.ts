import { Component } from '@angular/core';
import { ClkFantasyService } from 'app/services/clk-fantasy.service';
import { AuthService } from 'app/services/auth.service';
import { User } from 'app/models/user';
import { Message, LEVEL } from 'app/models/message';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { ClkCommonUtils } from 'app/services/common.service';
import { TeamStructures, Country } from 'app/utils/constants';
import { ClkPlayerService } from 'app/services/clk-player.service';
import { ClkMatchService } from 'app/services/clk-match.service';
import { DetailedFantasyLeague, FantasyLeagueSquad, FantasyLeague } from "app/models/detailed-fantasy-league";

declare var $;

@Component({
    selector: 'app-play-page',
    templateUrl: 'play-page.component.html',
    styleUrls: ['play-page.component.css']
})

export class PlayPageComponent {

    private user: User;
    private matchId: number;
    private entryExist: boolean;
    private selectedStructure: any;
    private fantasyLeagueMetaData: FantasyLeague = new FantasyLeague();
    private fantasyLeagueSquad: Array<FantasyLeagueSquad> = [];
    private matchSchedule: any;
    private playerList: Array<any> = [];
    private structureSelected: boolean = false;
    private currentSelection: any = {
        batsmen: 0,
        bowler: 0,
        allrounder: 0,
        wicketKeeper: 0,
        teamOne: 0,
        teamTwo: 0
    };
    private captain: number;
    private viceCaptain: number;
    private mom: number;
    private newEntry: boolean;
    private matchStatus: number;
    private DisplayBigMessage: boolean = false;
    private bigMessageTitle: string = '';
    private BigMessageBody: string = '';

    constructor(private fantasyService: ClkFantasyService,
        private authService: AuthService,
        private notificationService: ClkNotificationService,
        private commonUtils: ClkCommonUtils,
        private playerService: ClkPlayerService,
        private matchService: ClkMatchService) {

        this.notificationService.showLoader();
        this.matchId = this.commonUtils.getParameterByName('matchId');
        this.matchService.getMatchById(this.matchId).subscribe(res => {
            this.matchSchedule = res.resObject;
            this.getPlayerList(this.matchSchedule.teamOne);
            this.getPlayerList(this.matchSchedule.teamTwo);
            this.matchStatus = this.matchSchedule.currentStatus
        }, error => {
            let message: Message = new Message()
            message.messageBody = 'Encountered error while loading match details';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
        this.authService.getUserObservable().subscribe(res => {
            if (res !== undefined && res !== null && res !== '') {
                this.user = res;
                this.fantasyService.fantasySquadExist(this.user.userId, this.matchId).subscribe(res => {
                    this.notificationService.hideLoader();
                    if (!res.resObject) {
                        this.newEntry = true;
                        $('#StructureModal').modal({
                            backdrop: 'static',
                            keyboard: false,
                            show: true
                        });
                    } else {
                        this.newEntry = false;
                        this.retrieveUserFantasyLeague();
                    }
                }, error => {
                    this.notificationService.hideLoader();
                    let message: Message = new Message()
                    message.messageBody = 'Encountered error while initialising game';
                    message.alertLevel = LEVEL.ERROR;
                    ClkNotificationService.notificationTrigger.next(message);
                    console.error(error);
                });
            }
        }, error => {
            let message: Message = new Message()
            message.messageBody = 'Encountered error while loading your user details';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
    }

    private selectStructure(structureCode: number): void {
        this.notificationService.showLoader();
        this.resetSquad();
        this.selectedStructure = TeamStructures[structureCode];
        this.buildCriteria(this.selectedStructure);
        // console.log(this.selectedStructure);
        if (this.newEntry) {
            this.createFantasyLeage();
        } else {
            this.notificationService.hideLoader();
            this.updateFantasyLeague(this.selectedStructure.structure_id);
        }
        $('#StructureModal').modal('hide');
    }

    private createFantasyLeage(): void {
        this.fantasyService.createFantasyLeagueEntry(this.user.userId, this.matchId, this.selectedStructure.structure_id).subscribe(res => {
            if (res.resObject !== undefined && res.resObject !== null) {
                this.newEntry = false;
                this.fantasyLeagueMetaData.leagueId = res.resObject.leagueId;
                this.fantasyLeagueMetaData.userId = this.user.userId;
                this.fantasyLeagueMetaData.matchId = res.resObject.matchId;
                this.fantasyLeagueMetaData.structureCode = res.resObject.structureCode;
                this.structureSelected = true;
                this.notificationService.hideLoader();
            }
        }, error => {
            this.notificationService.hideLoader();
            let message: Message = new Message()
            message.messageBody = 'Encountered error while creating your game details';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
    }

    private retrieveUserFantasyLeague(): void {
        this.fantasyService.retrieveFantasyLeagueEntry(this.user.userId, this.matchId).subscribe(res => {
            // console.log(res);
            if (res.resObject !== undefined && res.resObject !== null) {
                this.fantasyLeagueMetaData = res.resObject.leagueMetaDate;
                this.fantasyLeagueSquad = res.resObject.leagueSquad;
                this.selectedStructure = TeamStructures[this.fantasyLeagueMetaData.structureCode - 1];
                this.buildCriteria(this.selectedStructure);
                if (this.fantasyLeagueSquad.length > 0) {
                    for (let selected of this.fantasyLeagueSquad) {
                        for (let player of this.playerList) {
                            if (player.playerId === selected.playerId) {
                                player.added = true;
                                this.validatePlayer(player);
                                break;
                            }
                        }
                    }
                }
                this.structureSelected = true;
            }
            this.notificationService.hideLoader();
        }, error => {
            this.notificationService.hideLoader();
            let message: Message = new Message()
            message.messageBody = 'Encountered error while loading your game details';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
    }

    private updateFantasyLeague(structureCode: number): void {
        this.fantasyLeagueMetaData.structureCode = structureCode;
    }

    private resetSquad(): void {
        for (let player of this.playerList) {
            player['added'] = false;
        }
        this.currentSelection.batsmen = 0;
        this.currentSelection.bowler = 0;
        this.currentSelection.allrounder = 0;
        this.currentSelection.wicketKeeper = 0;
        this.currentSelection.teamOne = 0;
        this.currentSelection.teamTwo = 0;
    }

    private getPlayerList(countryId: number): void {
        this.playerService.getPlayersByCountry(countryId).subscribe(res => {
            for (let player of res.resObject) {
                this.setPlayerType(player);
                player['added'] = false;
                this.setCountryDetails(player, countryId);
                this.playerList.push(player);
            }
        }, error => {
            let message: Message = new Message()
            message.messageBody = 'Encountered error while initialising game';
            message.alertLevel = LEVEL.ERROR;
            ClkNotificationService.notificationTrigger.next(message);
            console.error(error);
        });
    }

    private setPlayerType(player: any): void {
        switch (player.playerType) {
            case 1: {
                player['playerTypeName'] = 'Batsman';
                break;
            }
            case 2: {
                player['playerTypeName'] = 'Bowler';
                break;
            }
            case 3: {
                player['playerTypeName'] = 'All-Rounder';
                break;
            }
            default: {
                player['playerTypeName'] = 'Batsman';
                break;
            }
        }
    }

    private buildCriteria(structure: any): void {
        structure['criteriaObject'] = {};
        let structureList = structure.criteria.split('-');
        structure.criteriaObject['batsmen'] = parseInt(structureList[0][0]);
        structure.criteriaObject['wicketkeeper'] = parseInt(structureList[1][0]);
        structure.criteriaObject['allrounder'] = parseInt(structureList[2][0]);
        structure.criteriaObject['bowler'] = parseInt(structureList[3][0]);

    }

    private fireStructureModal(): void {
        $('#StructureModal').modal('show');
    }

    private addPlayer(player): void {
        let action: any = this.validatePlayer(player);
        if (action.allow) {
            player.added = true;
        } else {
            let message: Message = new Message();
            message.messageBody = action.message;
            message.alertLevel = LEVEL.WARNING;
            ClkNotificationService.notificationTrigger.next(message);
        }
        // console.log(this.currentSelection);
    }

    private removePlayer(player): void {
        player.added = false;
        if (player.playerId === this.fantasyLeagueMetaData.captain) {
            this.fantasyLeagueMetaData.captain = undefined;
        }
        if (player.playerId === this.fantasyLeagueMetaData.viceCaptain) {
            this.fantasyLeagueMetaData.viceCaptain = undefined;
        }
        switch (player.playerType) {
            case 1: {
                this.currentSelection.batsmen -= 1;
                if (player.wicketKeeper) {
                    this.currentSelection.wicketKeeper -= 1;
                }
                break;
            }
            case 2: {
                this.currentSelection.bowler -= 1;
                break;
            }
            case 3: {
                this.currentSelection.allrounder -= 1;
                break;
            }
        }
        switch (player.country) {
            case this.matchSchedule.teamOne: {
                this.currentSelection.teamOne -= 1;
                break;
            }
            case this.matchSchedule.teamTwo: {
                this.currentSelection.teamTwo -= 1;
                break;
            }
        }
        if (!this.hasWicketKeeper()) {
            this.currentSelection.wicketKeeper = 0;
        }
        // console.log(this.currentSelection);
    }

    private validatePlayer(player: any): any {
        switch (player.country) {
            case this.matchSchedule.teamOne: {
                if (this.currentSelection.teamOne >= 8) {
                    return { allow: false, message: 'You cannot select more than 8 players from one team' };
                } else {
                    let allowByType: any = this.validatePlayerByType(player);
                    if (allowByType.allow) {
                        this.currentSelection.teamOne += 1;
                        return { allow: true, message: 'moved' };
                    } else {
                        return { allow: allowByType.allow, message: allowByType.message };
                    }
                }
            }
            case this.matchSchedule.teamTwo: {
                if (this.currentSelection.teamTwo >= 8) {
                    return { allow: false, message: 'You cannot select more than 8 players from one team' };
                } else {
                    let allowByType: any = this.validatePlayerByType(player);
                    if (allowByType.allow) {
                        this.currentSelection.teamTwo += 1;
                        return { allow: true, message: 'moved' };
                    } else {
                        return { allow: allowByType.allow, message: allowByType.message };
                    }
                }
            }
        }
    }

    private validatePlayerByType(player: any): any {
        switch (player.playerType) {
            case 1: {
                if (this.currentSelection.batsmen < (this.selectedStructure.criteriaObject.batsmen + 1)) {
                    this.currentSelection.batsmen += 1;
                    if (player.wicketKeeper) {
                        this.currentSelection.wicketKeeper += 1;
                    }
                    return { allow: true, message: 'moved' };
                } else {
                    return { allow: false, message: 'You cannont select any more batsmen' }
                }
            }
            case 2: {
                if (this.currentSelection.bowler < this.selectedStructure.criteriaObject.bowler) {
                    this.currentSelection.bowler += 1;
                    return { allow: true, message: 'moved' };
                } else {
                    return { allow: false, message: 'You cannont select any more bowlers' }
                }
            }
            case 3: {
                if (this.currentSelection.allrounder < this.selectedStructure.criteriaObject.allrounder) {
                    this.currentSelection.allrounder += 1;
                    return { allow: true, message: 'moved' };
                } else {
                    return { allow: false, message: 'You cannont select any more allrounders' }
                }
            }
        }

    }

    private hasWicketKeeper(): boolean {
        for (let player of this.playerList) {
            if (player.added && player.wicketKeeper) {
                return true;
            }
        }
        return false;
    }

    private selectCaptain(playerId: number): void {
        if (this.fantasyLeagueMetaData.viceCaptain === playerId) {
            this.fantasyLeagueMetaData.viceCaptain = undefined;
        }
        this.fantasyLeagueMetaData.captain = playerId;
    }

    private selectViceCaptain(playerId: number): void {
        if (this.fantasyLeagueMetaData.captain === playerId) {
            this.fantasyLeagueMetaData.captain = undefined;
        }
        this.fantasyLeagueMetaData.viceCaptain = playerId;
    }

    private selectMom(playerId: number): void {
        this.mom = playerId;
    }

    private getPlayerById(playerId: number) {

    }

    private setCountryDetails(player: any, countryId: number) {
        player['countryName'] = Country[countryId - 1].COUNTRY_NAME_CODE;
    }

    private submitSelection(): void {
        let valid: any = this.validateCriteria();
        if (valid.allow) {
            this.notificationService.showLoader();
            let fantasyLeagueDetails: DetailedFantasyLeague = new DetailedFantasyLeague();
            fantasyLeagueDetails.leagueMetaDate = this.fantasyLeagueMetaData;
            if (this.fantasyLeagueSquad !== undefined && this.fantasyLeagueSquad !== null && this.fantasyLeagueSquad.length > 0) {
                let i: number = 0;
                for (let player of this.playerList) {
                    if (i === 11) {
                        break;
                    }
                    if (player.added) {
                        this.fantasyLeagueSquad[i].playerId = player.playerId;
                        i += 1;
                    }
                }
                fantasyLeagueDetails.leagueSquad = this.fantasyLeagueSquad;
                this.fantasyService.updateFantasyLeagueDetails(fantasyLeagueDetails).subscribe(res => {
                    if (res.message === 'CLOSED') {
                        this.notificationService.hideLoader();
                        this.notificationService.renderBigOverlay();
                        this.bigMessageTitle = 'Match is in play';
                        this.BigMessageBody = 'You cannot update you squad when match is in play';
                        this.DisplayBigMessage = true;
                    } else {
                        this.notificationService.hideLoader();
                        this.notificationService.renderBigOverlay();
                        this.bigMessageTitle = 'Your Squad Has Been Successfully Saved!';
                        this.BigMessageBody = 'Your squad details have been successfully saved. You can always come back and edit details until the match is in play';
                        this.DisplayBigMessage = true;
                        // let message: Message = new Message();
                        // message.messageBody = 'Your squad details have been updated successfully';
                        // message.alertLevel = LEVEL.SUCCESS;
                        // ClkNotificationService.notificationTrigger.next(message);
                        // setTimeout(() => {
                        //     this.notificationService.hideLoader();
                        //     window.location.href = '';
                        // }, 2000);
                    }
                }, error => {
                    this.notificationService.hideLoader();
                    let message: Message = new Message()
                    message.messageBody = 'Encountered error while updating your team information';
                    message.alertLevel = LEVEL.ERROR;
                    ClkNotificationService.notificationTrigger.next(message);
                    console.error(error);
                });
            } else {
                let tempFantasyLeagueSquadList: FantasyLeagueSquad;
                for (let player of this.playerList) {
                    tempFantasyLeagueSquadList = new FantasyLeagueSquad();
                    if (player.added) {
                        tempFantasyLeagueSquadList.playerId = player.playerId;
                        tempFantasyLeagueSquadList.leagueId = this.fantasyLeagueMetaData.leagueId;
                        this.fantasyLeagueSquad.push(tempFantasyLeagueSquadList);
                    }
                }
                fantasyLeagueDetails.leagueSquad = this.fantasyLeagueSquad;
                //ADD SQUAD INFO
                this.fantasyService.addFantasyLeagueDetails(fantasyLeagueDetails).subscribe(res => {
                    this.notificationService.hideLoader();
                    this.notificationService.renderBigOverlay();
                    this.bigMessageTitle = 'Your Squad Has Been Successfully Saved!';
                    this.BigMessageBody = 'Your squad details have been successfully saved. You can always come back and edit details until the match is in play';
                    this.DisplayBigMessage = true;
                }, error => {
                    this.notificationService.hideLoader();
                    let message: Message = new Message()
                    message.messageBody = 'Encountered error while saving your team information';
                    message.alertLevel = LEVEL.ERROR;
                    ClkNotificationService.notificationTrigger.next(message);
                    console.error(error);
                });
            }
        } else {
            let message: Message = new Message();
            message.messageBody = valid.reason;
            message.alertLevel = LEVEL.WARNING;
            ClkNotificationService.notificationTrigger.next(message);
        }
    }

    private validateCriteria(): any {
        let playerCount: number = this.currentSelection.batsmen + this.currentSelection.bowler + this.currentSelection.allrounder;
        let wicketKeeperAvailable: boolean = this.currentSelection.wicketKeeper > 0 ? true : false;
        let validBatsmanCount: boolean = this.currentSelection.batsmen === (this.selectedStructure.criteriaObject.batsmen + this.selectedStructure.criteriaObject.wicketkeeper) ? true : false;
        let validBowlerCount: boolean = this.currentSelection.bowler === this.selectedStructure.criteriaObject.bowler ? true : false;
        let validAllrounderCount: boolean = this.currentSelection.allrounder === this.selectedStructure.criteriaObject.allrounder ? true : false;
        let captainDefined: boolean = this.fantasyLeagueMetaData.captain > 0 && this.fantasyLeagueMetaData.captain !== undefined && this.fantasyLeagueMetaData.captain !== null ? true : false;
        let viceCaptainDefined: boolean = this.fantasyLeagueMetaData.viceCaptain > 0 && this.fantasyLeagueMetaData.viceCaptain !== undefined && this.fantasyLeagueMetaData.viceCaptain !== null ? true : false;
        let momDefined: boolean = this.mom !== undefined && this.mom !== null ? true : false;
        // tslint:disable-next-line:max-line-length
        if ((playerCount === 11) && wicketKeeperAvailable && validBatsmanCount && validBowlerCount && validAllrounderCount && captainDefined && viceCaptainDefined) {
            return { allow: true, reason: 'success' };
        }
        if (playerCount < 11) {
            return { allow: false, reason: 'Player count must be exactly 11' };
        }
        if (!wicketKeeperAvailable) {
            return { allow: false, reason: 'One player must be a wicket keeper' };
        }
        if (!validBatsmanCount) {
            return { allow: false, reason: 'Invalid batsmen count. Select your squad according to the team structure' };
        }
        if (!validBowlerCount) {
            return { allow: false, reason: 'Invalid bowler count. Select your squad according to the team structure' };
        }
        if (!validAllrounderCount) {
            return { allow: false, reason: 'Invalid all rounder count. Select your squad according to the team structure' };
        }
        if (!captainDefined) {
            return { allow: false, reason: 'please select a captain for your team' };
        }
        if (!viceCaptainDefined) {
            return { allow: false, reason: 'Please select a vice captain for your team' };
        }
        // if (!momDefined) {
        //     return { allow: false, reason: 'Select a player from you team who is most likely to be the man of the match' };
        // }
        return { allow: false, reason: 'validation failed' };
    }

    private buildLeagueDetails(): DetailedFantasyLeague {
        let fantasyLeague: DetailedFantasyLeague = new DetailedFantasyLeague();
        let selectedPlayerList: Array<FantasyLeagueSquad> = [];
        for (let player of this.playerList) {
            let tempSquadElement: FantasyLeagueSquad = new FantasyLeagueSquad();
            if (player.added) {
                tempSquadElement.leagueId = this.fantasyLeagueMetaData.leagueId;
                tempSquadElement.playerId = player.playerId;
                selectedPlayerList.push(tempSquadElement);
            }
        }
        fantasyLeague.leagueSquad = selectedPlayerList;
        fantasyLeague.leagueMetaDate = this.fantasyLeagueMetaData;
        return fantasyLeague;
    }

    private back(): void {
        window.location.href = '';
    }

    private redirectToHomePage(): void {
        window.location.href = '';
    }

}
