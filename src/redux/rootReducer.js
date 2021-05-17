import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import settingsReducer from './slices/settings';
import moduleReducer from './slices/module';
import moduleCategoryReducer from './slices/moduleCategory';
import organizationReducer from './slices/organization';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['settings']
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  module: moduleReducer,
  moduleCategory: moduleCategoryReducer,
  organization: organizationReducer
});

export { rootPersistConfig, rootReducer };
