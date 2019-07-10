import * as actions from '../actions';

const initialState = {
  metric: ""
};

const metricsReceived = (state, action) => {
  const { getMetric } = action;
  const { metric } = getMetric;
  return { metric };
};

const handlers = {
  [actions.METRICS_RECEIVED]: metricsReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === 'undefined') return state;
  return handler(state, action);
};
