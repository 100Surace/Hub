import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/organization/moduleCategory';

const initialState = {
  isLoading: false,
  error: false,
  moduleCategoryList: [
    {
      ids: 0,
      moduleCategoryName: '',
      moduleId: 0
    }
  ],
  hasMore: true,
  index: 0,
  step: 11
};

const slice = createSlice({
  name: 'moduleCategory',
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

    // GET MODULE CATEGORY SUCCESS
    getSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = [...action.payload];
    },

    // ADD MODULE CATEGORY SUCCESS
    addSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = [...state.moduleCategoryList, action.payload];
    },

    // DELETE MODULE CATEGORY SUCCESS
    deleteSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = state.moduleCategoryList.filter(
        (m) => m.ids !== action.payload
      );
    },

    // UPDATE MODULE CATEGORY SUCCESS
    updateSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = state.moduleCategoryList.map((m) =>
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

// GET Module Categories
export function getModuleCategories() {
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

// POST Module Category
export function addModuleCategory(formData) {
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

// DELETE Module Category
export function deleteModuleCategory(ids) {
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

// GET Module Category by Id
export function getModuleCategoryById(id) {
  return async () => {
    try {
      const { data } = await API.GETBYID(id);
      return data;
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}

// PUT Module Category
export function updateModuleCategory(id, formData) {
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
