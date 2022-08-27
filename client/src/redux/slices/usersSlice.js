import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import instance from "../../utils/api";

//REGISTER ACTION
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      //the other one is : "multipart/form-data"
      const response = await axios.post("/api/users/register", payload, config);
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//LOGIN ACTION
export const loginUserAction = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post("/api/users/login", payload, config);
      localStorage.setItem("userAuth", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//USER PROFILE
export const userProfileAction = createAsyncThunk(
  "users/profile",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await instance.get(`/api/users/profile`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//UPDATE USER PROFILE
export const updateUserProfileAction = createAsyncThunk(
  "users/updateProfile",
  async(payload, {rejectWithValue, getState, dispatch})=>{
    try{
      const response = await instance.post('/api/users/profile', payload);
      return response.data;
    }catch(error){
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
)

//INITIAL STATE
const initialState = {
  userAuth: localStorage.getItem("userAuth")
    ? JSON.parse(localStorage.getItem("userAuth"))
    : null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userLogout: (state) => {
      localStorage.removeItem("userAuth");
      state.userAuth = undefined;
    },
    refreshAccessTokenAction: (state, action) => {
      const userUpdated = { ...state.userAuth, accessToken: action.payload };
      //mise à jour du store
      state.userAuth = userUpdated;
      //mise à jour du local storage
      localStorage.setItem("userAuth", JSON.stringify(userUpdated));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.registered = action.payload;
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      });
    builder
      .addCase(loginUserAction.pending, (state, action) => {
        state.loading = true;
        state.appErr = undefined;
        state.serverErr = undefined;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.userAuth = action.payload;
        state.appErr = undefined;
        state.serverErr = undefined;
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      });
    builder
      .addCase(userProfileAction.pending, (state, action) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(userProfileAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        // state.userDetails = action.payload;
      })
      .addCase(userProfileAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
      builder
      .addCase(updateUserProfileAction.pending, (state, action)=>{
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(updateUserProfileAction.fulfilled, (state, action)=>{
        state.loading = false;
        state.error = false;
        state.success = true;
        state.userAuth = action.payload;
        localStorage.setItem("userAuth", JSON.stringify(state.userAuth));
      })
      .addCase(updateUserProfileAction.rejected, (state, action)=>{
        state.loading= false;
        state.success = false;
        state.error = action.payload.message;
      })
  },
});
export const { userLogout, refreshAccessTokenAction } = usersSlice.actions;
export default usersSlice.reducer;
