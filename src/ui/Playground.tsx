
import { ComponentChildren, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import ContractMethods from './ContractMethods';
import { compileContract } from '../utils/compiler';
import { Blockchain } from '../utils/blockchain';
import {Contract} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import { ABIDescription } from '@remix-project/remix-solidity';
import EVMConsole from './EVMConsole';
import { AccountWithBalances, EVMConsoleCall } from 'src/types';
import AccountSelector from './AccountSelector';

import "../styles.css";

interface PlaygroundProps {
  children?: ComponentChildren;
}

const Playground: FunctionalComponent = (props: PlaygroundProps) => {
  const code = props.children;

  const [isCompiling, setIsCompiling] = useState(false);
  const [contract, setContract] = useState<Contract|undefined>(undefined);
  const [abi, setAbi] = useState<ABIDescription[]|undefined>(undefined);
  const [blockchain, setBlockchain] = useState<Blockchain>(new Blockchain());
  const [logs, setLogs] = useState<string>('');
  const [accounts, setAccounts] = useState<AccountWithBalances[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string>('');


  function refreshAccounts(){
    blockchain.getAccountWithBalances()
      .then( accounts => {
        setAccounts(accounts);
      })
    ;
  }

  const updateLogs = (callResult: EVMConsoleCall): void => {
    let nextLogs = `\n>>>>> ${callResult.methodName}(${callResult.args.join(', ')})`;
    if( callResult.receipt ){
      nextLogs += `
Transaction success! Gas used: ${callResult.receipt.gasUsed}
Tx address: ${callResult.receipt.transactionHash}`
;
    }
    else if( callResult.result ){
      nextLogs += `\n Result: ${callResult.result}`;
    }

    setLogs(logs + nextLogs);
  }

  const onMethodCalled = (callResult: EVMConsoleCall): void => {
    updateLogs(callResult);
    refreshAccounts();
  }

  async function compileAndDeploy(): Promise<void> {
    setIsCompiling(true);
    const compiledContract = await compileContract(code as string);
    
    if( compiledContract ){
      await blockchain.resetEnvironment();
      setCurrentAccount(blockchain.currentAccount);
      
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const contract = new blockchain.web3.eth.Contract( compiledContract.abi as AbiItem );
      const response = await contract
        .deploy({data: `0x${compiledContract.evm.bytecode.object}`})
        .send({
          from: blockchain.currentAccount,
          gas: 1500000,
          gasPrice: '30000000000000'
        })
        .on('receipt', (receipt) => {
          updateLogs({
            methodName: "Deployment",
            args: [],
            receipt
          });
        })
      ;
      
      console.log('RESPONSE', response);
      /*
      */
      
      // @ts-ignore
      contract.options.address = response._address;
      
      setContract(contract);
      setAbi(compiledContract.abi);
      setIsCompiling(false);
      refreshAccounts();
    }
  }


  const onAccountSelected: h.JSX.GenericEventHandler<HTMLSelectElement> = (e) => {
    blockchain.currentAccount = e.target.value;
    setCurrentAccount(e.target.value);
  }

  return (
    <div>
      <pre>
        { code }
      </pre>
      <button disabled={isCompiling} onClick={ compileAndDeploy }>Compile</button>
      {
        contract && abi && (
          <AccountSelector
            currentAccount={currentAccount}
            accounts={accounts}
            onChange={ onAccountSelected } />
        )
      }
      { contract && abi && (
        <ContractMethods contract={contract}
          abi={abi} 
          from={currentAccount}
          onMethodCalled={ onMethodCalled } /> 
      )}
      { <EVMConsole logs={logs} /> }
    </div>
  );
};



export default Playground;