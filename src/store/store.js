import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import projectsReducer from './reducers/projectsReducer.js';
import tasksReducer from './reducers/tasksReducer.js';
import teamReducer from './reducers/teamReducer.js';
import filtersReducer from './reducers/filtersReducer.js';
import staffReducer from './reducers/staffReducer.js';
import stagesReducer from './reducers/stagesReducer.js';
import entregablesReducer from './reducers/entregablesReducer.js';

const rootReducer = combineReducers({
  projects: projectsReducer,
  tasks: tasksReducer,
  team: teamReducer,
  filters: filtersReducer,
  staff: staffReducer,
  stages: stagesReducer,
  entregables: entregablesReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
