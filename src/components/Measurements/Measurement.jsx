import React, { useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Provider, createClient, useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});

export default () => {
  return (
    <Provider value={client}>
      <Measurement />
    </Provider>
  );
};

const Measurement = props => {
  const [measurements, setMeasurements] = useState([]);

  const query = `
query {
  getMeasurements(input: { metricName: "oilTemp", after: 1562338337 }) {
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

    const newData = data.getMeasurements;
    if (newData.length > 10) {
      const dataChunk = newData.slice(newData.length - 20);
      setMeasurements(dataChunk);
    }
  }, [dispatch, error, data, measurements]);

  if (fetching) return <LinearProgress />;

  return (
    <LineChart width={400} height={400} data={measurements}>
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="metric" />
      <YAxis dataKey="value" />
    </LineChart>
  );
};
