import * as cdk from "@aws-cdk/core";
import * as lamda from "@aws-cdk/aws-lambda";
import * as apigtw from "@aws-cdk/aws-apigateway";

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const hello = new lamda.Function(this, "HelloHandler", {
      runtime: lamda.Runtime.NODEJS_10_X,
      code: lamda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    new apigtw.LambdaRestApi(this, "Endpoint", {
      handler: hello,
    });
  }
}
