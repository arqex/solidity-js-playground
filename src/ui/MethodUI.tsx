import { ComponentChildren, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import {Contract} from 'web3-eth-contract';
import { ABIDescription, ABIParameter } from '@remix-project/remix-solidity';

interface MethodUIProps {
  contract: Contract;
  fn: ABIDescription;
  from: string;
}

async function callContractMethod(contract: Contract, method: string | undefined, from: string,  inputValues: any[] = [] ): Promise<any> {
  if( method === undefined ) return alert('Método desconocido');

  const fn = contract.methods?.[method];
  if( fn === undefined ) return alert('Método desconocido')

  const runnableMethod = fn.apply(contract.methods, inputValues);
  const response = await runnableMethod.call({from});

  console.log('CAll', response);
}

function getInitialValues(inputs: ABIParameter[]) {
  return inputs.map( input => 0 );
}

function updateValue( setValue: fn, values: number[], index: number, value: string ){
  const updatedValues: number[] = [...values];
  updatedValues[index] = parseInt(value, 10);
  setValue(updatedValues);
}

const MethodUI = ({contract, fn, from}: MethodUIProps) => {
  const inputs: any[] = fn.inputs || [];
  const [values, setValue] = useState( getInitialValues(inputs) );

  return (
    <div>
      <div>{fn.name} ({fn.inputs?.length})</div>
      <div>
        { inputs.map( (input, i) => (
          <input key={input.name} name={input.name} value={ values[i] } onInput={ e => updateValue(setValue, values, i, e.target.value) } />
        ))}
      </div>
      <div><button onClick={ () => callContractMethod(contract, fn.name, from, values) }>Run {fn.name}</button></div>
    </div>
  );
}

export default MethodUI; 