import {  ADD_PROPOSAL, ADD_VOTE, ADD_VOTER_TO_STORE, ADD_WINNING_PROPOSAL, CHANGE_STATUS, DELETE_PROPOSALS, DELETE_VOTERS, INCREASE_PROPOSAL_COUNT, LOGIN} from "../actions/app";

export const initialState = {
    isLogged : false,
    status:0,
    proposalCount:3,
    proposalList:[],
    voters:[],
    winningProposal:""
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
        case ADD_PROPOSAL:{
            console.log("proposal from reducer =>", action.payload);
            return {
                ...state,
                proposalList:[
                    ...state.proposalList,
                    {description:action.payload}
                ]
            }
        }
        case DELETE_PROPOSALS:{
            return{
                ...state,
                proposalList:[]
            }
        }
        case ADD_VOTER_TO_STORE:{
            return{
                ...state,
                voters:[
                    ...state.voters,
                    {address : action.payload, hasVoted:false, proposalVoted:0}
                ]
            }
        }
        case ADD_VOTE:{
            return{
                ...state,
                voters: state.voters.map(
                    voter => voter.address === action.address ? {...voter, hasVoted:true, proposalVoted:action.proposalId}
                                                                : voter
                )
                
            }
        }
        case DELETE_VOTERS:{
            return{
                ...state,
                voters:[]
            }
        }
        case ADD_WINNING_PROPOSAL:{
            return{
                ...state,
                winningProposal:action.payload
            }
        }
        default:
            return state;
        }
    }
    
export default appReducer;