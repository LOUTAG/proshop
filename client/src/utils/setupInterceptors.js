import {
  refreshAccessTokenAction,
  userLogout,
} from "../redux/slices/usersSlice";
import instance from "./api";

const setupInterceptors = (store) => {
  const { dispatch } = store;
  const { userAuth } = store.getState().users;

  // By default attach accessToken
  instance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${userAuth?.accessToken}`;

  /*** config interceptors ***/
  instance.interceptors.response.use(
    (response) => {
      console.log(response);
      return response;
    },
    async (error) => {
      console.log(error);
      //get the original request, to resend it at the end
      const originalRequest = error.config;
      if (
        error?.response?.data?.message === "jwt expired" &&
        !originalRequest._retry &&
        error.config.url !== "/api/users/refresh-access-token"
      ) {
        console.log("entrance");
        //Declare the next request as a retry
        originalRequest._retry = true;
        //by default attach refreshToken
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userAuth?.refreshToken}`;
        await instance
          .get("/api/users/refresh-access-token")
          .then((response) => {
            const refreshAccessToken = response.data.refreshAccessToken;
            //update store and localStorage by using dispatch action
            dispatch(refreshAccessTokenAction(refreshAccessToken));
            //attach the new accessToken
            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${refreshAccessToken}`;
            //execute a new time the request with the new access token updated
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${refreshAccessToken}`;
          })
          .catch((error) => {
            console.log(error);
            //maybe add some confitions
            dispatch(userLogout());
            throw error;
          });
          //really important to put it outsite the promise, to return the data correctly
        return instance(originalRequest);
      } else {
        console.log(error);
        throw error;
      }
    }
  );
};
export default setupInterceptors;
