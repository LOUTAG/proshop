import axios from "axios";
import { refreshAccessTokenAction } from "../redux/slices/usersSlice";

//avoid circular import
//https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
let store;
export const injectStore = (injection)=>{
    store = injection;
}

/***  Get our user ***/
const userAuth = store?.getState()?.users?.userAuth;
console.log(store);

/***  Create axios instance ***/
const instance = axios.create();
// By default attach accessToken
instance.defaults.headers.common[
  "Authorization"
] = `Bearer ${userAuth?.accessToken}`;

/*** config interceptors ***/
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    //get the original request, to resend it at the end
    const originalRequest = error.config;
    if (
      error?.response?.data?.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      //Declare the next request as a retry
      originalRequest._retry = true;
      //by default attach refreshToken
      instance.defaults.headers.common["Authorization"] = `Bearer ${userAuth?.refreshToken}`;
      await instance
        .get("/api/users/refresh-access-token")
        .then((response) => {
          const refreshAccessToken = response.data.refreshAccessToken;
          //update store and localStorage by using dispatch action
          store.dispatch(refreshAccessTokenAction(refreshAccessToken));
          //attach the new accessToken
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refreshAccessToken}`;
          //execute a new time the request with the new access token updated
          originalRequest.header[
            "Authorization"
          ] = `Bearer ${refreshAccessToken}`;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
        return axios(originalRequest);
    }
  }
);

export default instance;
