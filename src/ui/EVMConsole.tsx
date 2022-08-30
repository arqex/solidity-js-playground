import { ComponentChildren, FunctionalComponent, h } from 'preact';

interface EVMConsoleProps {
  children?: ComponentChildren;
}

const EVMConsole: FunctionalComponent = (props: EVMConsoleProps) => {
  return <div>Este es la consola</div>;
}

export default EVMConsole;