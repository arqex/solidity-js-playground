import { CompilationResult, CompiledContract, Compiler } from "@remix-project/remix-solidity";

export function createCompiler( ){
  return new Compiler((url, cb) => {
    console.log('Dentro del compiler', url, cb);
  });
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
