import React, {FC, useEffect, useState} from "react";
import {Box, FormControlLabel, IconButton, Switch} from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CircularProgress, {CircularProgressProps} from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import EqualizerIcon from '@material-ui/icons/Equalizer';

function CircularProgressWithLabel(props: CircularProgressProps & { label: number }) {
  return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" {...props} />
        <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${props.label}s`}</Typography>
        </Box>
      </Box>
  );
}

interface Props {
  onRun: ()=>void;
}
export const ExecutionControls: FC<Props> = ({onRun}) => {

  const [delay, setDelay] = useState<(1|2|5)>(5);

  const [lastUpdate, setLastUpdate] = useState<number|undefined>();

  const [progress, setProgress] = React.useState(100);

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    let timer: number;
    if (checked) {
      setLastUpdate(new Date().valueOf());
      timer = setInterval(() => {
        setLastUpdate(new Date().valueOf());
        onRun();
      }, delay * 1000) as unknown as number;
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [delay, checked]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (checked && lastUpdate) {
        const delta = (new Date().valueOf() - lastUpdate) / 1000; //s
        const nextValue = Math.floor(delta / delay * 100);
        setProgress(nextValue);
      }
    }, 16);
    return () => {
      clearInterval(timer);
    };
  }, [checked, lastUpdate, delay]);

  const iterateDelays = () => {
    setDelay(prev => {
      switch (prev) {
        case 1:
          return 2;
        case 2:
          return 5;
        case 5:
          return 1;
        default:
          return 5;
      }
    });
  }

  return <Box display="flex" alignItems="center">
    <Box mr={2}>
      <IconButton onClick={()=>onRun()}>
        <PlayCircleOutlineIcon fontSize="large"/>
      </IconButton>
    </Box>
    <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Auto-refresh"
    />

    {checked && <>
        <CircularProgressWithLabel label={delay} value={progress} onClick={() => {iterateDelays()}} />
        <Box ml={1}>
            <IconButton onClick={() => {iterateDelays()}}><EqualizerIcon/></IconButton>
        </Box>
        </>}
  </Box>
}