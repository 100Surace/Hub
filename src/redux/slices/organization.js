import { createSlice } from '@reduxjs/toolkit';
import organization from '../../api/organization/organization';
import { getModules } from './module';
import { getModuleCategories, getModuleCatByModuleId } from './moduleCategory';
import { convertToFormData } from '../../utils/formatFormData';

// Mock user id
// TODO: get user id from session
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
  USER_ID,
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

    // USER HAS ORGANIZATION
    hasOrg(state, action) {
      state.hasOrg = action.payload;
    },

    // GET ORGANIZATIONS
    getSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = action.payload;
      state.ORG_ID = action.payload.ids;
    },
    // ADD ORGANIZATION
    addSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = action.payload;
    },
    // UPDATE ORGANIZATION
    updateSuccess(state, action) {
      state.isLoading = false;
      state.organizationsList = action.payload;
    },

    // DELETE ORGANIZATION
    deleteSuccess(state, action) {
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
export const {
  startLoading,
  getSuccess,
  addSuccess,
  updateSuccess,
  deleteSuccess,
  hasError,
  hasOrg
} = slice.actions;

// GET Organization by user id
function getOrgByUsesrId() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await organization.GET_USER_ORG(USER_ID);
      if (data.length > 0) {
        dispatch(hasOrg(true));
        dispatch(getSuccess(data[0]));
      }
      return data;
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// GET Organization of user
export function getMyOrg() {
  return (dispatch) => {
    dispatch(getOrgByUsesrId()).then((data) => {
      if (!data.length) {
        dispatch(getModules());
        dispatch(getModuleCategories());
      } else {
        dispatch(getModuleCatByModuleId(data[0].moduleId));
      }
    });
  };
}

// POST Organization
export function addOrg(values) {
  delete values.ids;
  return async (dispatch) => {
    dispatch(startLoading());
    const formData = convertToFormData(values);
    formData.append('id', initialState.USER_ID);

    try {
      const response = await organization.POST(formData);
      return dispatch(addSuccess(response.data[0]));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// PUT Organization
export function updateOrg(values) {
  return async (dispatch) => {
    dispatch(startLoading());
    const formData = convertToFormData(values);

    try {
      const response = await organization.PUT(values.ids, formData);
      return dispatch(updateSuccess(response.data[0]));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// GET organization by Id
export function getOrgnById(id) {
  return async () => {
    try {
      const { data } = await organization.GETBYID(id);
      return data;
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}
