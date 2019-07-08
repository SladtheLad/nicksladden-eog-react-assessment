import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem'
import { Provider, createClient, useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    width: 400
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
    const metricData = Object.values(data.getMetrics);
    setMetrics(metricData);
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <form className={classes.root}>
      <FormControl classess={classes.formControl}>
        <InputLabel htmlor="metric-select">SELECT METRIC</InputLabel>
        <Select
        value
          inputProps={{
            name: 'metric',
            id: 'metric-select'
          }}
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
    </form>
  );
};
