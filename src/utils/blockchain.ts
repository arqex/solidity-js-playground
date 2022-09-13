import { Provider, extend } from "@remix-project/remix-simulator";
import { BN } from 'ethereumjs-util';
import Web3 from "web3";

export class Blockchain {
  simulator: Provider
  web3: Web3
  currentAccount: string

  constructor() {
    this.simulator = new Provider({});
    this.web3 = new Web3(this.simulator);
    this.currentAccount = 'account_not_initialized';
    extend(this.simulator);
  }

  async resetEnvironment(): Promise<void> {
    this.simulator = new Provider({});
    this.web3 = new Web3(this.simulator);
    extend(this.simulator);
    await this.simulator.init();
    this.currentAccount = (await this.getAccounts())[0];
  }

  resetAccounts(): Promise<void> {
    return this.simulator.Accounts.resetAccounts();
  }

  getAccounts(): Promise<string[]> {
    return this.web3.eth.getAccounts();
  }

  async getAccountWithBalances(): Promise<AccountWithBalances[]> {
    const accountAddresses: string[]  = await this.getAccounts();
    const balances: string[] = await Promise.all(
        accountAddresses.map( (address: string) => this.getBalanceInEther(address) ) 
    );
    
    return accountAddresses.map( (address, i) => ({
      address,
      balance: balances[i]
    }));
  }

  async getBalanceInEther (address: string): Promise<string>  {
    const balance = await this.web3.eth.getBalance(address);
    return Web3.utils.fromWei(new BN(balance).toString(10), 'ether');
  }

  getGasPrice(): Promise<string> {
    return this.web3.eth.getGasPrice();
  }
}