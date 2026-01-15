import React from "react";

import { use } from "react";
import { AuthContext } from "../components/pages/Context/AuthContext";

const useAuth = () => {
  const authInfo = use(AuthContext);
  return authInfo;
};

export default useAuth;