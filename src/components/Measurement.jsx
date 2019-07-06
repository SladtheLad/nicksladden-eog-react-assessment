import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { Provider, createClient, useQuery } from 'urql';

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});

const query = `
query {
  getMeasurements(input: { metricName: "oilTemp", after: 1562360485702 }) {
    metric
    value
    unit
    at
  }
}
`;

const useStyles = makeStyles({
  card: {
    margin: '5% 25%'
  }
});

export default () => {
  return (
    <Provider value={client}>
      <Measurement />
    </Provider>
  );
};

const Measurement = () => {
  const classes = useStyles();

  const [measurements, setMeasurements] = useState();

  const [result] = useQuery({
    query
  });
  console.log(result);

  const { data } = result;
  console.log(data);

  useEffect(() => {
    if (data) {
      const newData = data.getMeasurements[0];
      console.log(newData);
      setMeasurements(newData);
    }

    console.log(measurements);
  }, [data, measurements]);

  return (
    <Card className={classes.card}>
      <CardHeader />
      <CardContent />
    </Card>
  );
};
