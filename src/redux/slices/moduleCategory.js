import { createSlice } from '@reduxjs/toolkit';
import moduleCategory from 'src/api/org/moduleCategory';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  moduleCategoryList: [],
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

    // GET Modules
    getModuleCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = [...action.payload];
    },

    // Add Module
    addModuleCategorySuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = [...state.moduleCategoryList, action.payload];
    },

    // Delete modules
    deleteModuleCategorySuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = state.moduleCategoryList.filter(
        (m) => m.ids !== action.payload
      );
    },

    // Delete modules
    updateModuleCategorySuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = state.moduleCategoryList.map((m) => {
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

export function getModuleCategories() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await moduleCategory.GET();
      dispatch(slice.actions.getModuleCategoriesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function addNewModuleCategory(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await moduleCategory.POST(data);
      dispatch(slice.actions.addModuleCategorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteModuleCategory(ids) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      ids.forEach(async (id) => {
        const response = await moduleCategory.DELETE(id);
        console.log(response.data);
        if (response.status === 204) {
          dispatch(slice.actions.deleteModuleCategorySuccess(id));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getModuleCategoryById(id) {
  return async () => {
    try {
      const { data } = await moduleCategory.GETBYID(id);
      return data;
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateModuleCategory(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await moduleCategory.PUT(id, data);
      dispatch(slice.actions.updateModuleCategorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
