export const CHANGE_STATUS = 'CHANGE_STATUS';
export const INCREASE_PROPOSAL_COUNT = 'INCREASE_PROPOSAL_COUNT';
export const LOGIN = 'LOGIN';

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