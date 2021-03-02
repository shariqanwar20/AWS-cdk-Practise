import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

export const addTodo = async (title: string) => {
  const params = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      id: `Key - ${Math.random()}`,
      title,
      done: false,
    },
  };

  try {
    await docClient.put(params).promise();
    return params.Item;
  } catch (e) {
    console.log(e);
    return null;
  }
};
