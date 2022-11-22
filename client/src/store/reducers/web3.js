import { INIT_WEB3, SET_BLOCK_NUMBER } from "../actions/web3";

const initialState = {
    artifact: null,
    web3: null,
    accounts: null,
    networkID: null,
    contract: null,
    owner:null,
    blockNumber:0
  };

const web3Reducer = (state = initialState,action={})=>{
    switch (action.type){
        case INIT_WEB3 :{
            return {
                ...state,
                artifact: action.artifact,
                web3:action.web3,
                accounts: action.accounts,
                networkID: action.networkID,
                contract:action.contract,
                owner:action.owner,
                blockNumber:action.blockNumber
            }
        }
        case SET_BLOCK_NUMBER:{
            return {
                ...state,
                blockNumber:action.payload
            }
        }
        default :
        return state;
    }
};

export default web3Reducer;