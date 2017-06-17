'use strict';

export class FantasyLeagueSquad {
    squadId: number;
    leagueId: number;
    playerId: number;
}

export class FantasyLeague {
    leagueId: number;
    userId: string;
    matchId: number;
    structureCode: number;
    battingScore: number;
    bowlingScore: number;
    fieldingScore: number;
    extra: number;
    mom: number;
    captain: number;
    viceCaptain: number;
}

export class DetailedFantasyLeague {
    leagueMetaDate: FantasyLeague;
    leagueSquad: Array<FantasyLeagueSquad>;
}
