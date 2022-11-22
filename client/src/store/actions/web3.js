export const INIT_WEB3 = 'INIT_WEB3';
export const SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER';

export const setBlockNumber = (payload) => ({
  type: SET_BLOCK_NUMBER,
  payload
});

// Initialization of all the web3 constants
export const initWeb3 = (artifact, web3, accounts, networkID, contract, owner,blockNumber) => ({
  type: INIT_WEB3,
  artifact,
  web3,
  accounts,
  networkID,
  contract,
  owner,
  blockNumber
});