import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/ecommerce/vendor';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  vendors: [],
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
      state.vendors = action.payload;
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

export function getVendors() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.GET();
      const vendors = data.map((vendor) => {
        delete vendor.products;
        return vendor;
      });
      dispatch(getSuccess(vendors));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}
