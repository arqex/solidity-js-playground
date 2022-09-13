import { ComponentChildren, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import {Contract} from 'web3-eth-contract';
import { FunctionDescription, ABIParameter } from '@remix-project/remix-solidity';
import { EVMConsoleCall } from 'src/types';

interface MethodUIProps {
  contract: Contract;
  fn: FunctionDescription;
  from: string;
  onMethodCalled: (logs: EVMConsoleCall) => void;
}

async function callContractMethod(contract: Contract, method: string, from: string, inputValues: any[] = [] ): Promise<EVMConsoleCall|undefined> {
  const fn = contract.methods?.[method];
  if( fn === undefined ) return alert('Método desconocido');

  const runnableMethod = fn.apply(contract.methods, inputValues);
  const result = await runnableMethod.call({from});
  console.log('RESULT', result);

  return {
    methodName: method,
    args: inputValues,
    result
  }
}

async function sendContractMethod(contract: Contract, method: string, from: string, inputValues: any[] = []  ): Promise<EVMConsoleCall|undefined> {
  const fn = contract.methods?.[method];
  if( fn === undefined ) return alert('Método desconocido');

  const runnableMethod = fn.apply(contract.methods, inputValues);
  const receipt = await runnableMethod.send({from});

  return {
    methodName: method,
    args: inputValues,
    receipt
  };
}

function getInitialValues(inputs: ABIParameter[]) {
  return inputs.map( input => 0 );
}

function updateValue( setValue: fn, values: number[], index: number, value: string ){
  const updatedValues: number[] = [...values];
  updatedValues[index] = parseInt(value, 10);
  setValue(updatedValues);
}

const MethodUI: FunctionalComponent<MethodUIProps> = ({contract, fn, from, onMethodCalled}: MethodUIProps) => {
  const {stateMutability} = fn;
  const inputs: any[] = fn.inputs || [];
  const [values, setValue] = useState( getInitialValues(inputs) );

  const methodCaller = async () => {
    const method = stateMutability === 'view' || stateMutability === 'pure' ?
      callContractMethod :
      sendContractMethod
    ;

    const callResult = await method(contract, fn.name, from, values);
    if( callResult !== undefined ){
      onMethodCalled(callResult);
    }
  }


  return (
    <div>
      <div>{fn.name} ({fn.inputs?.length})</div>
      <div>
        { inputs.map( (input, i) => (
          <input key={input.name} name={input.name} value={ values[i] } onInput={ e => updateValue(setValue, values, i, e.target.value) } />
        ))}
      </div>
      <div><button onClick={ methodCaller }>Run {fn.name}</button></div>
    </div>
  );
}

export default MethodUI; 