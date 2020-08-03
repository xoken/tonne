import { authAPI, userAPI } from "nipkow-sdk";
authAPI
  .login("admin", "NjM5MDQyODIzMzc5MTAzNjgyOA")
  .then((data) => {
    console.log(data.auth.sessionKey);
    localStorage.setItem("token", data.auth.sessionKey);
    userAPI
      .getCurrentUser()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
