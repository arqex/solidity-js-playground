export interface SimulatorAccount {
  privateKey: string;
  balance: string;
}

export interface SendReceipt {
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: number;
  gasUsed: number;
  to: string;
  transactionHash: string;
}

export interface EVMConsoleCall {
  methodName: string;
  args: (string|number)[];
  result?: string;
  receipt?: SendReceipt;
}

export interface AccountWithBalances {
  address: string;
  balance: string;
}