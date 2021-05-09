import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/organization/module';

const initialState = {
  isLoading: false,
  error: false,
  modulesList: [
    {
      ids: 0,
      moduleName: ''
    }
  ],
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

    // GET MODULES SUCCESS
    getSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...action.payload];
    },

    // Add MODULE SUCCESS
    addSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...state.modulesList, action.payload];
    },

    // DELETE MODULES SUCCESS
    deleteSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = state.modulesList.filter(
        (m) => m.ids !== action.payload
      );
    },

    // UPDATE MODULE SUCCESS
    updateSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = state.modulesList.map((m) =>
        m.ids === action.payload.id ? action.payload : m
      );
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  getSuccess,
  addSuccess,
  updateSuccess,
  deleteSuccess,
  hasError
} = slice.actions;

// GET Modules
export function getModules() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.GET();
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
// POST Module
export function addModule(formData) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.POST(formData);
      return dispatch(addSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
// DELETE Module(s)
export function deleteModule(ids) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const status = ids.forEach(async (id) => {
        const { status } = await API.DELETE(id);
        if (status === 204) {
          dispatch(deleteSuccess(id));
        }
        return status;
      });
      return status;
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
// GET Module by Module Id
export function getModuleById(id) {
  return async () => {
    try {
      const { data } = await API.GETBYID(id);
      return data;
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}
// PUT Module
export function updateModule(id, formData) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.PUT(id, formData);
      return dispatch(updateSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
