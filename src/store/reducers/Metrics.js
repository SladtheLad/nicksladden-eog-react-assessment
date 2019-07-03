import * as actions from '../actions';

const initialState = {
  metrics: ""
};

const metricsReceived = (state, action) => {
  const { getMetrics } = action;
  const { metrics } = getMetrics;
  return { metrics };
};

const handlers = {
  [actions.METRICS_RECEIVED]: metricsReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === 'undefined') return state;
  return handler(state, action);
};
