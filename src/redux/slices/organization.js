import { createSlice } from '@reduxjs/toolkit';
import organization from 'src/api/org/organization';

// ----------------------------------------------------------------------
const USER_ID = '4fba38d8-4edc-4ec3-bb74-2d86a87c96df';
const initialState = {
  isLoading: false,
  error: false,
  organizationsList: {
    ids: 0,
    id: USER_ID,
    moduleCategoryId: 0,
    serviceType: 0,
    organizationType: 0,
    orgName: '',
    secondEmail: '',
    secondPhone: '',
    shortDesc: '',
    longDesc: '',
    logo: '',
    bannerImg: '',
    orgImg: '',
    status: false,
    imageFile: null,
    moduleId: 0
  },
  hasMore: true,
  index: 0,
  step: 11,
  USER_ID: USER_ID,
  ORG_ID: 0,
  hasOrg: false
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

    hasOrg(state, action) {
      state.hasOrg = action.payload;
    },

    // GET organizations
    getOrgProfileSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = action.payload;
      state.ORG_ID = action.payload.ids;
    },
    // Update organization
    addOrgProfileSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = action.payload;
    },
    // Update organization
    updateOrgProfileSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = action.payload;
    },

    // Delete organizations
    deleteorganizationSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = state.organizationsList.filter(
        (m) => m.ids !== action.payload
      );
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;

// ----------------------------------------------------------------------

export function getOrgProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await organization.GET_USER_ORG(initialState.USER_ID);
      if (response.data.length) {
        dispatch(slice.actions.hasOrg(true));
        dispatch(slice.actions.getOrgProfileSuccess(response.data[0]));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------
export function addOrg(values) {
  delete values.ids;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const ID = initialState.ORG_ID;
    const formData = new FormData();
    formData.append('id', initialState.USER_ID);
    formData.append('orgName', values.orgName);
    formData.append('moduleCategoryId', values.moduleCategoryId);
    formData.append('serviceType', values.serviceType);
    formData.append('organizationType', values.organizationType);
    formData.append('secondEmail', values.secondEmail);
    formData.append('secondPhone', values.secondPhone);
    formData.append('shortDesc', values.shortDesc);
    formData.append('longDesc', values.longDesc);
    formData.append('status', values.status);
    formData.append('imageFile', values.imageFile);
    try {
      const response = await organization.POST(formData);
      dispatch(slice.actions.addOrgProfileSuccess(response.data[0]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateOrgProfile(values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const formData = new FormData();
    formData.append('ids', values.ids);
    formData.append('id', values.id);
    formData.append('orgName', values.orgName);
    formData.append('moduleCategoryId', values.moduleCategoryId);
    formData.append('serviceType', values.serviceType);
    formData.append('organizationType', values.organizationType);
    formData.append('secondEmail', values.secondEmail);
    formData.append('secondPhone', values.secondPhone);
    formData.append('shortDesc', values.shortDesc);
    formData.append('longDesc', values.longDesc);
    formData.append('status', values.status);
    formData.append('imageFile', values.imageFile);
    try {
      const response = await organization.PUT(values.ids, formData);
      dispatch(slice.actions.updateOrgProfileSuccess(response.data[0]));
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
