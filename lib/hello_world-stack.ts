import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3Deploy from "@aws-cdk/aws-s3-deployment";

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const websiteBucket = new s3.Bucket(this, "Website Bucket", {
      versioned: true,
    });

    const distribution = new cloudfront.Distribution(
      this,
      "Distribution Domain Name",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(websiteBucket),
        },
        defaultRootObject: "index.html",
      }
    );

    new cdk.CfnOutput(this, "DomainName", {
      value: distribution.domainName,
    });

    new s3Deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3Deploy.Source.asset("./website")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
