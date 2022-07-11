import {Compiler} from "@remix-project/remix-solidity";

export function printCompiler(){
  const compiler = new Compiler((url, cb) => {
    console.log('Dentro del compiler', url, cb);
  });

  console.log('Compiler', compiler );
}