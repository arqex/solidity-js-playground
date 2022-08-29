import { ABIDescription } from '@remix-project/remix-solidity';
import { FunctionalComponent, h } from 'preact';
import {Contract} from 'web3-eth-contract';


interface ContractMethodsProps {
  contract: Contract;
  abi: ABIDescription[];
}

const ContractMethods: FunctionalComponent<ContractMethodsProps> = ({contract, abi}: ContractMethodsProps) => {
  console.log( contract, abi );
  return (
    <div>Esta es la interfaz del contrato</div>
  );
};


export default ContractMethods;