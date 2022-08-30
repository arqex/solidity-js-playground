import {decode} from 'html-entities';
import { render } from "preact";
import Playground from "./ui/Playground";

export async function createPlayground( node: HTMLElement ){
  const playgroundContainer = document.createElement('div');
  const content = decode(node.innerHTML);

  node.replaceWith(
    playgroundContainer
  );

  console.log( content );

  render( Playground, playgroundContainer);
}

