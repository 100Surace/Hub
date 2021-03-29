import axios from 'src/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import module from 'src/api/org/module';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  modulesList: [],
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

    // GET Modules
    getModulesSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...action.payload];
    },

    // Add Module
    addModuleSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...state.modulesList, action.payload];
    },

    getMorePosts(state) {
      const setIndex = state.index + state.step;
      state.index = setIndex;
    },

    noHasMore(state) {
      state.hasMore = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;

// ----------------------------------------------------------------------

export function getModules() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await module.GET();
      dispatch(slice.actions.getModulesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function addNewModule(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await module.POST(data);
      dispatch(slice.actions.addModuleSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPostsInitial(index, step) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/blog/posts', {
        params: { index, step }
      });
      const results = response.data.results.length;
      const maxLength = response.data.maxLength;

      dispatch(slice.actions.getPostsInitial(response.data.results));

      if (results >= maxLength) {
        dispatch(slice.actions.noHasMore());
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPost(title) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/blog/post', {
        params: { title }
      });
      dispatch(slice.actions.getPostSuccess(response.data.post));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError());
    }
  };
}

// ----------------------------------------------------------------------

export function getRecentPosts(title) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/blog/posts/recent', {
        params: { title }
      });

      dispatch(slice.actions.getRecentPostsSuccess(response.data.recentPosts));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError());
    }
  };
}
