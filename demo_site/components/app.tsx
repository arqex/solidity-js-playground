import { FunctionalComponent, h } from 'preact';
import Playground from '../../src/ui/Playground';

const App: FunctionalComponent = () => {
    /*
    useEffect( () => {
        createPlayground( document.querySelector('pre') );
    });
    */

    return (
        <div id="preact_root">
            Este es nuestro playground

            <Playground>{`// SPDX-License-Identifier: GPL-3.0
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
            
            </Playground>
        </div>
    );
};

export default App;
