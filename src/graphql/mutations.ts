/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addTodo = /* GraphQL */ `
  mutation AddTodo($title: String) {
    addTodo(title: $title) {
      id
      title
      done
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo($id: String) {
    deleteTodo(id: $id)
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo($todo: TodoInput) {
    updateTodo(todo: $todo) {
      id
      title
      done
    }
  }
`;
