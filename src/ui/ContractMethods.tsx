import { ABIDescription } from '@remix-project/remix-solidity';
import { FunctionalComponent, h } from 'preact';
import {Contract} from 'web3-eth-contract';
import MethodUI from './MethodUI';


interface ContractMethodsProps {
  contract: Contract;
  abi: ABIDescription[];
  from: string;
}


const ContractMethods: FunctionalComponent<ContractMethodsProps> = ({contract, abi, from}: ContractMethodsProps) => {
  console.log( contract, abi );
  return (
    <div>{
      abi.map( (fn, i) => (
        <MethodUI
          key={`fn${i}`}
          contract={contract}
          from={from}
          fn={fn} />
      ))
    }</div>
  );
};



export default ContractMethods;