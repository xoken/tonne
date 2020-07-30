import { AuthAPI } from "../lib/nipkow-sdk";
new AuthAPI()
  .login("admin", "NjM5MDQyODIzMzc5MTAzNjgyOA")
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
