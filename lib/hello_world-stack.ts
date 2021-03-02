import * as cdk from "@aws-cdk/core";
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

    const dynamoDbTable = new ddb.Table(this, "practiseTable", {
      tableName: "PractiseTable",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    const dynamodbDataSource = api.addDynamoDbDataSource(
      "DynamoDbDataSource",
      dynamoDbTable
    );

    dynamodbDataSource.createResolver({
      typeName: "Query",
      fieldName: "getTodos",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    dynamodbDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").auto(),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    dynamodbDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem(
        "id",
        "id"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    dynamodbDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").is("id"),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
  }
}
