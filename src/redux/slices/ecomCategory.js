import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/ecommerce/ecomCategory';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  ecomCategories: [],
  sortBy: null
};

const slice = createSlice({
  name: 'vendor',
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

    // GET VENDORS
    getSuccess(state, action) {
      state.isLoading = false;
      state.ecomCategories = action.payload;
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, startLoading, getSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getEcomCategories() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.GET();
      dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}
