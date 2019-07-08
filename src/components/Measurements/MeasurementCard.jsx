import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '../CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MetricSelect from './MetricSelect';
import Measurement from './Measurement';

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  card: {
    margin: '5% 15%'
  }
});

const MeasurementCard = () => {
  const classes = useStyles();


  return (
    <Card className={classes.card}>
      <CardHeader title="SELECT METRICS" />
      <CardContent>
        <MetricSelect />
        <Measurement />
      </CardContent>
    </Card>
  );
};

export default MeasurementCard;
