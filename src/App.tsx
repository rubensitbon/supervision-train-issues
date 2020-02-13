import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Table from './components/Table/Table';

function usePersistedState(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const [state, setState] = React.useState<string>(
    localStorage.getItem(key) || defaultValue
  );
  React.useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);
  return [state, setState];
}

const App = () => {
  const [ip, setIp] = usePersistedState('ip', 'localhost');
  const [port, setPort] = usePersistedState('port', '3000');

  return (
    <div className="App">
      <Header ip={ip} port={port} setIp={setIp} setPort={setPort} />
      <Table ip={ip} port={port} />
    </div>
  );
};

export default App;
