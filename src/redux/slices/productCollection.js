import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/ecommerce/productCollection';
import { convertToFormData } from '../../utils/formatFormData';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  productCollection: [],
  sortBy: null
};

const slice = createSlice({
  name: 'productCollection',
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

    // GET productCollectionS
    getSuccess(state, action) {
      state.isLoading = false;
      state.productCollections = action.payload;
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

export function addProductCollection(form) {
  return async (dispatch) => {
    dispatch(startLoading());
    const formData = convertToFormData(form);

    try {
      const { data } = await API.POST(formData);
      //   dispatch(getSuccess(productCollection));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}
