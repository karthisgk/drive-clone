import {  SESSIONACTION, SETTINGSACTION, REQUESTBATCH } from "./actiontypes";


export const SessionReducer = (state = false, action) => {
    if(action.type == SESSIONACTION && action.sessionUser){
        return action.sessionUser;
    }
    return state;
}

export const SettingsReducer = (state = false, action) => {
    if(action.type == SETTINGSACTION && action.settings){
        return action.settings;
    }
    return state;
}

export const RequestBatchReducer = (state = false, action) => {
    if(action.type == REQUESTBATCH && action.batch){
        return action.batch;
    }
    return state;
}