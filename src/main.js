import { authAPI, userAPI } from "nipkow-sdk";
authAPI
  .login(
    "" + localStorage.getItem("username") + "",
    "" + localStorage.getItem("password") + ""
  )
  .then((data) => {
    console.log(data.auth.sessionKey);
    localStorage.setItem("sessionkey", data.auth.sessionKey);
    userAPI
      .getCurrentUser()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
