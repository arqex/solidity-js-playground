import { FunctionalComponent, h } from 'preact';
import { printCompiler} from '../../src';

const App: FunctionalComponent = () => {
    printCompiler();

    return (
        <div id="preact_root">
            Este es nuestro playground

            <pre>{`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}`}
            
            </pre>
        </div>
    );
};

export default App;
