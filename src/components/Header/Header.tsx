import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

import './Header.css';

interface props {
  ip: string;
  port: string;
  setIp: (value: string) => void;
  setPort: (value: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 150
      }
    }
  })
);

const Header = ({ ip, port, setIp, setPort }: props) => {
  const classes = useStyles();
  const handleChangeIP = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIp(event.target.value);
  };

  const handleChangePort = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(event.target.value);
  };
  return (
    <div className="Header">
      <div />
      <h1>Supervision du Train</h1>
      <div className={classes.root}>
        <Input
          style={{ marginRight: '10px' }}
          value={ip}
          onChange={handleChangeIP}
        />
        <Input
          style={{ marginRight: '10px', width: '100px' }}
          value={port}
          onChange={handleChangePort}
        />
      </div>
    </div>
  );
};

export default Header;
