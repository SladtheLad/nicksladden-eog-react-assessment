import React, { useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Provider, createClient, useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));
export default props => {
  return (
    <Provider value={client}>
      <LastKnownMeasurement metric={props} />
    </Provider>
  );
};

const LastKnownMeasurement = props => {
  const { metric } = props;

  const [measurement, setMeasurement] = useState({});

  const classes = useStyles();

  const query = `
query {
  getLastKnownMeasurement(metricName: "${metric.metricName}") {
    metric
    value
    unit
    at
  }
}
`;

  const dispatch = useDispatch();

  const [result] = useQuery({
    query
  });

  const { data, fetching, error } = result;

  useEffect(() => {
    if (error) {
      dispatch({
        type: actions.API_ERROR,
        error: error.message
      });
      return;
    }
    if (!data) return;

    const measurementData = data.getLastKnownMeasurement;
    setMeasurement(measurementData);
  }, [dispatch, error, data, measurement]);

  if (fetching) return <LinearProgress />;
  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h6" component="h1">
          {metric.metricName
            ? `Last ${metric.metricName} Measurement`
            : 'Waiting for Selected Metric'}
        </Typography>
        <Typography component="p">
          {metric.metricName
            ? `Measurement: ${measurement.value} ${measurement.unit}`
            : null}
        </Typography>
      </Paper>
    </div>
  );
};
