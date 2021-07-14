import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/ecommerce/productCollection';
import { convertToFormData } from '../../utils/formatFormData';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  productCollections: [],
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

    // GET productCollections
    getSuccess(state, action) {
      state.isLoading = false;
      state.productCollections = action.payload;
    },

    // PUT productCollection
    updateSuccess(state, action) {
      state.isLoading = false;
      const filteredColls = state.productCollections.filter((c) => c.id !== action.payload.id);
      state.productCollections = [...filteredColls, action.payload];
    },

    deleteSuccess(state, action) {
      state.isLoading = false;
      state.productCollections = state.productCollections.filter((c) => c.id !== action.payload);
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
export const { hasError, startLoading, getSuccess, updateSuccess, deleteSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getProductCollections() {
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

export function updateCollectionStatus(id, status) {
  return async (dispatch) => {
    dispatch(startLoading());

    try {
      const { data } = await API.UPDATE_STATUS(id, status);
      dispatch(updateSuccess(data[0]));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}

export function deleteCollection(id) {
  return async (dispatch) => {
    dispatch(startLoading());

    try {
      await API.DELETE(id);
      dispatch(deleteSuccess(id));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}
