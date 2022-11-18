export const CHANGE_STATUS = 'CHANGE_STATUS';
export const INCREASE_PROPOSAL_COUNT = 'INCREASE_PROPOSAL_COUNT';
export const LOGIN = 'LOGIN';
export const ADD_PROPOSAL = 'ADD_PROPOSAL';
export const DELETE_PROPOSALS = 'DELETE_PROPOSALS';
export const ADD_VOTER_TO_STORE = 'ADD_VOTER_TO_STORE';
export const ADD_VOTE = 'ADD_VOTE';
export const DELETE_VOTERS = 'DELETE_VOTERS';

export const deleteVoters = () => ({
  type: DELETE_VOTERS
});

export const addVote = (address, proposalId) => ({
  type: ADD_VOTE,
  address,
  proposalId
});

export const addVoterToStore = (payload) => ({
  type: ADD_VOTER_TO_STORE,
  payload
});

export const deleteProposal = () => ({
  type: DELETE_PROPOSALS
});

export const addProposal = (payload) => ({
  type: ADD_PROPOSAL,
  payload
});

export const login = (payload) => ({
  type: LOGIN,
  payload
});

export const increaseProposalCount = (payload) => ({
  type: INCREASE_PROPOSAL_COUNT,
  payload
});

export const changeStatus = (payload) => ({
  type: CHANGE_STATUS,
  payload
});