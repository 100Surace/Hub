import { createSlice } from '@reduxjs/toolkit';
import organization from 'src/api/org/organization';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  organizationsList: {},
  hasMore: true,
  index: 0,
  step: 11
};

const slice = createSlice({
  name: 'organization',
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

    // GET organizations
    getOrgProfileSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = action.payload;
    },

    // Add organization
    addorganizationSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = [...state.organizationsList, action.payload];
    },

    // Delete organizations
    deleteorganizationSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = state.organizationsList.filter(
        (m) => m.ids !== action.payload
      );
    },

    // Delete organizations
    updateorganizationSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = state.organizationsList.map((m) => {
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

export function getOrgProfile() {
  const MY_ID = 11;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await organization.GETBYID(MY_ID);
      dispatch(slice.actions.getOrgProfileSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function addNewOrganization(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await organization.POST(data);
      dispatch(slice.actions.addOrganizationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteOrganization(ids) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      ids.forEach(async (id) => {
        const response = await organization.DELETE(id);
        console.log(response.data);
        if (response.status === 204) {
          dispatch(slice.actions.deleteOrganizationSuccess(id));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getOrganizationById(id) {
  return async () => {
    try {
      const { data } = await organization.GETBYID(id);
      return data;
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateOrganization(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await organization.PUT(id, data);
      dispatch(slice.actions.updateOrganizationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
