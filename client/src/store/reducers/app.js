import {  CHANGE_STATUS, INCREASE_PROPOSAL_COUNT, LOGIN} from "../actions/app";

export const initialState = {
    isLogged : false,
    status:"Registering voters",
    proposalCount:3
};


const appReducer = (state = initialState,action={}) =>{
    switch(action.type){
        case CHANGE_STATUS:{
            return {
                ...state,
                status:action.payload
            }
        }
        case INCREASE_PROPOSAL_COUNT:{
            return {
                ...state,
                proposalCount:action.payload
            }

        }
        case LOGIN:{
            return {
                ...state,
                isLogged : action.payload
            }
        }
        default:
            return state;
        }
    }
    
export default appReducer;