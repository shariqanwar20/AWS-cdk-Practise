import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "GRAPHQL_API", {
      name: "cdk-api",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    new cdk.CfnOutput(this, "graphql-api", {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, "apiKey", {
      value: api.apiKey || "",
    });

    const lambdaFunction = new lambda.Function(this, "GraphQlLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(10),
    });

    const dynamoDbTable = new ddb.Table(this, "practiseTable", {
      tableName: "PractiseTable",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    dynamoDbTable.grantFullAccess(lambdaFunction);
    lambdaFunction.addEnvironment("TABLE_NAME", dynamoDbTable.tableName);

    const lambdaDataSource = api.addLambdaDataSource(
      "lambdaDataSource",
      lambdaFunction
    );

    lambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "getTodos",
    });

    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo",
    });

    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo",
    });

    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo",
    });
  }
}
