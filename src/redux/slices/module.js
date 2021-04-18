import { createSlice } from '@reduxjs/toolkit';
import module from 'src/api/org/module';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  modulesList: [],
  hasMore: true,
  index: 0,
  step: 11
};

const slice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET Modules
    getModulesSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...action.payload];
    },

    // Add Module
    addModuleSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...state.modulesList, action.payload];
    },

    // Delete modules
    deleteModuleSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = state.modulesList.filter(
        (m) => m.ids !== action.payload
      );
    },

    // Delete modules
    updateModuleSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = state.modulesList.map((m) => {
        return m.ids === action.payload.id ? action.payload : m;
      });
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;

// ----------------------------------------------------------------------

export function getModules() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await module.GET();
      dispatch(slice.actions.getModulesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function addNewModule(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await module.POST(data);
      dispatch(slice.actions.addModuleSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteModule(ids) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      ids.forEach(async (id) => {
        const response = await module.DELETE(id);
        if (response.status === 204) {
          dispatch(slice.actions.deleteModuleSuccess(id));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getModuleById(id) {
  return async () => {
    try {
      const { data } = await module.GETBYID(id);
      return data;
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateModule(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await module.PUT(id, data);
      dispatch(slice.actions.updateModuleSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
