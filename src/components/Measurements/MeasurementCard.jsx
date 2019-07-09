import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardHeader from '../CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Provider, createClient, useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions';
import Measurement from './Measurement';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    width: 120
  },
  select: {
    width: 200
  },
  card: {
    margin: '5% 15%'
  }
}));

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});

const query = `
query{
  getMetrics
}
`;


export default () => {
  return (
    <Provider value={client}>
      <MeasurementCard />
    </Provider>
  );
};

const MeasurementCard = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title="SELECT METRICS" />
      <CardContent>
        <MetricSelect />
      </CardContent>
    </Card>
  );
};
const MetricSelect = () => {
  const classes = useStyles();

  const [metrics, setMetrics] = useState();

  const [selectedMetric, setSelectedMetric] = useState('');

  const dispatch = useDispatch();

  const [result] = useQuery({
    query
  });

  const { fetching, data, error } = result;

  const handleChange = event => {
    console.log(event.target.value)
    setSelectedMetric(event.target.value)
  };

  useEffect(() => {
    if (error) {
      dispatch({
        type: actions.API_ERROR,
        error: error.message
      });
      return;
    }
    if (!data) return;
    const metricData = Object.values(data.getMetrics);
    setMetrics(metricData);
  }, [dispatch, data, error, selectedMetric]);

  if (fetching) return <LinearProgress />;

  return (
    <form className={classes.root}>
      <FormControl classess={classes.formControl}>
        <InputLabel htmlor="metric-select">SELECT METRIC</InputLabel>
        <Select
          className={classes.select}
          value={selectedMetric}
          inputProps={{
            name: 'metric',
            id: 'metric-select'
          }}
          onChange={handleChange}
        >
          {metrics
            ? metrics.map((metric, index) => (
                <MenuItem value={metric} key={index}>
                  {metric}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
      <Measurement metric={selectedMetric} />
    </form>
  );
};
