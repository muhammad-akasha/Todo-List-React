import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Edit from "./Edit";
import DeleteTodo from "./DeleteTodo";
import { db, collection, addDoc, getDocs } from "./firebaseConfig";

export default function App() {
  const [isEdited, setEditedIndex] = useState(null);
  const [todo, setTodo] = useState([]);
  const [loading, setLoading] = useState(true);
  const todoVal = useRef();

  async function addTodo(e) {
    e.preventDefault();
    const newTodo = todoVal.current.value;

    if (!newTodo) {
      alert("Please Enter Todo");
      return;
    }
    const docRef = await addDoc(collection(db, "Todo_lists"), {
      todoItem: newTodo,
    });
    setTodo((prevTodo) => [
      ...prevTodo,
      { todoItem: newTodo, todoId: docRef.id },
    ]);
    todoVal.current.value = "";
  }
  const getTodos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Todo_lists"));
      const todosArray = querySnapshot.docs.map((doc) => ({
        todoItem: doc.data().todoItem,
        todoId: doc.id,
      }));
      setTodo(todosArray);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);
  const startEdit = (index) => {
    setEditedIndex(index);
  };

  return (
    <div className="todo-container">
      <h1 className="text-center mb-4 text-primary todo-heading">Todo App</h1>
      <div className="todo-div">
        <form className="todo-form" onSubmit={addTodo}>
          <InputGroup className="mb-3 todo-inp">
            <Form.Control
              placeholder="Enter Todo"
              ref={todoVal}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
            <Button type="submit" variant="primary">
              Add Todo
            </Button>
          </InputGroup>
          {loading ? (
            <p> Loading... </p>
          ) : (
            <ul className={todo.length > 0 ? "todo-list" : "none"}>
              {todo.map((item, index) => (
                <div className="singal-todo" key={index}>
                  {isEdited !== index ? (
                    <li>{item.todoItem}</li>
                  ) : (
                    <Edit
                      setEditedIndex={setEditedIndex}
                      item={item}
                      index={index}
                      setTodo={setTodo}
                      todo={todo}
                    />
                  )}
                  <div>
                    <Button onClick={() => startEdit(index)} variant="info">
                      Edit
                    </Button>{" "}
                    <DeleteTodo
                      index={index}
                      todo={todo}
                      setTodo={setTodo}
                      isEdited={isEdited}
                    />
                  </div>
                </div>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
}
