
import { ComponentChildren, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import ContractMethods from './ContractMethods';
import { compileContract } from '../utils/compiler';
import { Blockchain } from '../utils/blockchain';
import {Contract} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import { ABIDescription } from '@remix-project/remix-solidity';

interface PlaygroundProps {
  children?: ComponentChildren;
}

const Playground: FunctionalComponent = (props: PlaygroundProps) => {
  const code = props.children;

  const [isCompiling, setIsCompiling] = useState(false);
  const [contract, setContract] = useState<Contract|undefined>(undefined);
  const [abi, setAbi] = useState<ABIDescription[]|undefined>(undefined)

  async function compileAndDeploy(): Promise<void> {
    setIsCompiling(true);
    const compiledContract = await compileContract(code as string);
    
    if( compiledContract ){
      const blockchain = new Blockchain();
      await blockchain.resetEnvironment();
      
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const contract = new blockchain.web3.eth.Contract( compiledContract.abi as AbiItem );
      await contract
        .deploy({data: `0x${compiledContract.evm.bytecode.object}`})
        .send({
          from: blockchain.currentAccount,
          gas: 1500000,
          gasPrice: '30000000000000'
        });
  
      setContract(contract);
      setAbi(compiledContract.abi);
      setIsCompiling(false);
    }
  }

  return (
    <div>
      <pre>
        { code }
      </pre>
      <button disabled={isCompiling} onClick={ compileAndDeploy }>Compile</button>
      { contract && abi && <ContractMethods contract={contract} abi={abi} /> }
    </div>
  );
};



export default Playground;