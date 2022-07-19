import {CompilationResult, compile, CompiledContract, Compiler} from "@remix-project/remix-solidity";
import {decode} from 'html-entities';
import { Blockchain } from "./blockchain";
import {execution} from '@remix-project/remix-lib';


export function createCompiler( ){
  return new Compiler((url, cb) => {
    console.log('Dentro del compiler', url, cb);
  });
}

export function printCompiler(){
  const compiler = createCompiler();
  console.log('Compiler', compiler );
}

async function loadRemoteCompiler( compiler: Compiler, url: string ): Promise<void> {
  return new Promise( resolve => {
    compiler.event.register("compilerLoaded", () => {
      resolve();
    });
    compiler.loadVersion(true, url);
  });
}

export async function compileContract( content: string ): Promise<CompiledContract|undefined>{
  
  return new Promise( (resolve) => {
    const url = 'https://binaries.soliditylang.org/wasm/soljson-v0.8.10+commit.fc410830.js';
    const compiler = createCompiler();
  
    loadRemoteCompiler(compiler, url)
      .then( () => {
        console.log('Compilador cargado');
      
        compiler.event.register("compilationFinished", (success: boolean, data: CompilationResult) => {
          console.log( 'compilation', data );
          resolve( data.contracts?.['test.sol'].SimpleStorage )
        });
      
        compiler.compile({
          "test.sol": {
            content
          }
        }, 'output');
      });
  });
}

async function createBlockchain() {
  const blockchain = new Blockchain();
  await blockchain.resetEnvironment();

  console.log('Blockchain', blockchain );
  const accounts = await blockchain.getAccounts();
  console.log('Balance', await blockchain.getBalanceInEther( accounts[0] ) );
  return blockchain;
}


async function deployContract(compiledContract: CompiledContract, blockchain: Blockchain ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const contract = new blockchain.web3.eth.Contract( compiledContract.abi as AbiItem );
    console.log('Web3 contract', contract);

    const transaction = contract.deploy({data: `0x${compiledContract.evm.bytecode.object}`});
    console.log('Transaction', transaction);

    /*
    const estimateGas = transaction.estimateGas();
    console.log( 'Estimage gas', estimateGas);
  */

    const address = (await blockchain.getAccounts())[0];

    console.log('address', address);

    console.log('web3', blockchain.web3 );

    console.log('defaultAccount', blockchain.web3.eth.defaultAccount);


    transaction.send(
      {
        from: address,
        gas: 1500000,
        gasPrice: '30000000000000'
      },
      function( err, hash ){
        console.log(err, hash);
      }
    );


    return Promise.resolve(contract);
}

export async function createPlayground( node: HTMLElement ){
  const content = decode(node.innerHTML);
  const compiledContract = await compileContract( content );

  if( compiledContract ) {
    const blockchain = await createBlockchain();
    const contract = await deployContract( compiledContract, blockchain );
  }
}

