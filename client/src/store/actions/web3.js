export const INIT_WEB3 = 'INIT_WEB3';

// Initialization of all the web3 constants
export const initWeb3 = (artifact, web3, accounts, networkID, contract, owner) => ({
  type: INIT_WEB3,
  artifact,
  web3,
  accounts,
  networkID,
  contract,
  owner
});