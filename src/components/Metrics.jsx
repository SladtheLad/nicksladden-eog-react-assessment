import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Provider, createClient, useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import * as actions from '../store/actions';

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});

const query = `
query{
  getMetrics
}
`;

//CHANGE THINGS FOR LAST MEASUREMENT
//LOOK AT URQL DOC FOR HOW TO PASS VARIABLES

// query($metricName: String!){
//   getLastKnownMeasurement(metricName: $metricName){
//     value
//   }
// }

// const getMetricData = state => {
//   console.log(state)
//   const {
//     metrics
//   } = state.metrics;
//   return {
//     metrics
//   };
// };

const useStyles = makeStyles({
  card: {
    margin: '5% 25%'
  }
});

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};
const Metrics = () => {
  const classes = useStyles();

  const [metrics, setMetrics] = useState();

  const dispatch = useDispatch();

  const [result] = useQuery({
    query
  });

  // const {
  //   metrics
  // } = useSelector(getMetricData);
  console.log(metrics);

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch({
        type: actions.API_ERROR,
        error: error.message
      });
      return;
    }
    if (!data) return;
    console.log(data);
    const metricData = Object.values(data);
    metricData.pop();
    setMetrics(metricData);
    // dispatch({
    //   type: actions.METRICS_RECEIVED,
    //   getMetrics
    // });
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <Card className={classes.card}>
      <CardHeader title="METRICS" />
      <CardContent>{metrics}</CardContent>
    </Card>
  );
};
