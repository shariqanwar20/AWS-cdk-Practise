import { Amplify } from "aws-amplify";
import awsmobile from "../aws-exports";
import React from "react";

export default function AwsAmplify({ children }) {
  Amplify.configure(awsmobile);

  return <div>{children}</div>;
}
