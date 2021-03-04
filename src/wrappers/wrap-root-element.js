import React from "react";
import AmplifyClient from "../amplifyClient/client";
export const wrapRootElement = ({ element }) => {
  return <AmplifyClient>{element}</AmplifyClient>;
};
