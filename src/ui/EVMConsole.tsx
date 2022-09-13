import { ComponentChildren, FunctionalComponent, h } from 'preact';

interface EVMConsoleProps {
  logs: string;
}

const EVMConsole: FunctionalComponent<EVMConsoleProps> = (props: EVMConsoleProps) => {
  return <pre className="sp_console">{props.logs}</pre>;
}

export default EVMConsole;