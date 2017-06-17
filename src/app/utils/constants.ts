'use strict';

export const RestEndPoints = {
    /**Common*/
    UPLOAD_IMG: 'common/upload/',
    /**user*/
    GET_USER: 'user/',
    ADD_USER: 'user/add/',
    /**player*/
    GET_PLAYERS_BY_COUNTRY: 'player/country/',
    ADD_PLAYER: 'player/add',
    /**match schedules */
    GET_MATCH_BY_ID: 'schedule/',
    GET_ALL_SCHEDULES: 'schedule/all/',
    GET_MATCH_BY_STATUS: 'schedule/status/',
    GET_MATCH_BY_DATE: 'schedule/date/',
    GET_ON_GOING_DETAILS: 'schedule/current/',
    /**player score card */
    GET_SCORE_CARDS: 'score-card/retrieveList/',
    CREATE_MATCH_SCORE_CARDS: 'score-card/storeList/',
    UPDATE_SCORE_CARDS: 'score-card/updateList/',
    /**fantsy team  */
    TEAM_EXIST: 'fantasy/exist/',
    CREATE_FANTASY_LEAGUE: 'fantasy/create/',
    RETRIEVE_FANTASY_LEAGUE: 'fantasy/retrieve/',
    ADD_TEAM: 'fantasy/add/',
    UPDATE_TEAM: 'fantasy/update/',
    UPDATE_USER_SCORES: 'fantasy/update/scores/',
    /**leaderboard */
    GET_LEADERBOARD_SCORES: 'leaderboard/final/',
    UPDATE_LEADERBOARD_SCORES: 'leaderboard/calculate/'
};

export const Configurations = {
    APP_BASE: window['CLK'].APP_BASE,
    IMAGE_BASE: window['CLK'].IMAGE_BASE,
    PLAY_LINK: window['CLK'].PLAY_LINK,
    VIEW_RESULTS_LINK: window['CLK'].VIEW_RESULTS_LINK,
    OLD_PLAY: window['CLK'].OLD_PLAY,
};

export const CommonProperties = {
    NULL_USER_IMAGE: 'assets/empty.png',
    NULL_TEAM_IMAGE: 'assets/back-tile.png'
};

export const Country = [
    {
        COUNTRY_CODE: 1,
        COUNTRY_NAME: 'SRI LANKA',
        COUNTRY_NAME_CODE: 'SL',
    },
    {
        COUNTRY_CODE: 2,
        COUNTRY_NAME: 'INDIA',
        COUNTRY_NAME_CODE: 'IND',
    },
    {
        COUNTRY_CODE: 3,
        COUNTRY_NAME: 'AUSTRALIA',
        COUNTRY_NAME_CODE: 'AUS',
    },
    {
        COUNTRY_CODE: 4,
        COUNTRY_NAME: 'SOUTH AFRICA',
        COUNTRY_NAME_CODE: 'SA',
    },
    {
        COUNTRY_CODE: 5,
        COUNTRY_NAME: 'PAKISTAN',
        COUNTRY_NAME_CODE: 'PAK'
    },
    {
        COUNTRY_CODE: 6,
        COUNTRY_NAME: 'BANGALADESH',
        COUNTRY_NAME_CODE: 'BAN',
    },
    {
        COUNTRY_CODE: 7,
        COUNTRY_NAME: 'ENGLAND',
        COUNTRY_NAME_CODE: 'ENG',
    },
    {
        COUNTRY_CODE: 8,
        COUNTRY_NAME: 'NEW ZEALAND',
        COUNTRY_NAME_CODE: 'NZ',
    }
];

export const PlayerTypes = [
    {
        TYPE_CODE: 1,
        TYPE_NAME: 'Batsman',
        TYPE_DESCRIPTION: 'A player whose chief skill is in batting.'
    },
    {
        TYPE_CODE: 2,
        TYPE_NAME: 'Bowler',
        TYPE_DESCRIPTION: 'A player whose chief skill is in bowling.'
    },
    {
        TYPE_CODE: 3,
        TYPE_NAME: 'All-Rounder',
        TYPE_DESCRIPTION: 'A player who performs well at both batting and bowling'
    }
];

export const MatchStatus = [
    {
        'status_code': 1,
        'status_name': 'COMPLETE'
    },
    {
        'status_code': 2,
        'status_name': 'CURRENT'
    },
    {
        'status_code': 3,
        'status_name': 'IN_PROGRESS'
    },
    {
        'status_code': 4,
        'status_name': 'COMING_UP'
    }
]

export const TeamStructures = [
    {
        'structure_id': 1,
        'structure_name': 'All-round Frenzy',
        'criteria': '3B-1W-4A-3O'
    },
    {
        'structure_id': 2,
        'structure_name': 'Perfect All-Rounders',
        'criteria': '4B-1W-3A-3O'
    },
    {
        'structure_id': 3,
        'structure_name': 'Batting Power House',
        'criteria': '5B-1W-2A-3O'
    },
    {
        'structure_id': 4,
        'structure_name': 'Specialist Selection',
        'criteria': '5B-1W-1A-4O'
    },
    {
        'structure_id': 5,
        'structure_name': 'Balanced Beam',
        'criteria': '4B-1W-2A-4O'
    },
    {
        'structure_id': 6,
        'structure_name': 'Toe Crushers',
        'criteria': '4B-1W-1A-5O'
    }
];
