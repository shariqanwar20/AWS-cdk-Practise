import { API } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import { addTodo } from "../graphql/mutations";
import { getTodos } from "../graphql/queries";

export default () => {
  const [loading, setLoading] = useState(true);
  const [todoList, setTodoList] = useState<any>([]);
  const todoTitleRef = useRef<any>("");

  const addTodos = async () => {
    setLoading(true);
    try {
      const data = await API.graphql({
        query: addTodo,
        variables: {
          title: todoTitleRef.current.value,
        },
      });
      console.log("added todo ==> ", data);
      fetchTodo();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTodo = async () => {
    try {
      const data = await API.graphql({
        query: getTodos,
      });
      console.log(data);
      setTodoList(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <input type="text" placeholder="Enter task" ref={todoTitleRef} />
          <br />
          <button onClick={addTodos}>Add Task</button>
          <ul>
            {todoList.data &&
              todoList.data.getTodos.map((task, ind) => (
                <li key={ind}>{task.title}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
