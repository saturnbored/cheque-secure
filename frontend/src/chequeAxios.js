import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  // baseURL: "https://classroombyus.herokuapp.com/",
});
instance.defaults.headers.post["Content-Type"] =
  "application/json;charset=utf-8";
instance.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
instance.interceptors.request.use(
  (config) => {
    let accessToken = JSON.parse(sessionStorage.getItem("token"));
    if (accessToken) {
      config.headers = Object.assign(
        {
          "x-access-token": accessToken,
        },
        config.headers
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
