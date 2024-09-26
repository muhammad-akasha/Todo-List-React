import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Edit from "./Edit";
import DeleteTodo from "./DeleteTodo";
import { Puff, ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, fetchTodos } from "./redux/reducers/todoSlice";

export default function App() {
  const [isEdited, setEditedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(null);
  const todoVal = useRef();

  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const todoStatus = useSelector((state) => state.todos.status);

  // Fetching todos
  useEffect(() => {
    const fetching = async () => {
      try {
        if (todoStatus === "idle") {
          await dispatch(fetchTodos());
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetching();
  }, [todoStatus, dispatch]);

  // Adding todo
  async function addCurrentTodo() {
    const newTodo = todoVal.current.value;

    if (!newTodo) {
      Swal.fire({
        icon: "warning",
        iconColor: "red",
        title: "Please Enter Todo",
        position: "top",
      });
      return;
    }
    setLoader(true);
    await dispatch(addTodo({ todoItem: newTodo }));
    todoVal.current.value = "";
    setLoader(false);
  }

  // Editing a todo
  const startEdit = (index) => {
    setEditedIndex(index);
  };

  // Handle Enter key submission
  const submitOnEnter = (e) => {
    if (e.key === "Enter") {
      addTodo(e); // Passing the event object here
    }
  };

  return (
    <div className="todo-container">
      <h1 className="text-center mb-4 text-primary todo-heading">Todo App</h1>
      <div className="todo-div">
        <InputGroup className="mb-3 todo-inp">
          <Form.Control
            placeholder="Enter Todo"
            ref={todoVal}
            aria-label="Default"
            onKeyDown={submitOnEnter} // Handles the Enter key press
            aria-describedby="inputGroup-sizing-default"
          />
          <Button onClick={addCurrentTodo} type="submit" variant="primary">
            Add Todo
            {loader ? (
              <ColorRing
                visible={true}
                height="25"
                width="25"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            ) : null}
          </Button>
        </InputGroup>

        {loading ? (
          <div
            style={{ zIndex: 999, backgroundColor: "#fff" }}
            className="position-absolute top-50 start-50 translate-middle d-flex justify-content-center align-items-center w-100 h-100 zindex-100"
          >
            <Puff
              visible={true}
              height="100"
              width="100"
              color="rgb(13 110 253)"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <ul className={todos.length > 0 ? "todo-list" : "none"}>
            {todos.map((item, index) => (
              <div
                className="singal-todo d-flex flex-column gap-10 flex-sm-row justify-content-sm-between align-items-sm-center gap-3"
                key={item.id}
              >
                {isEdited !== index ? (
                  <>
                    <li>{item.todoItem}</li>
                    <div className="d-flex flex-column gap-2 flex-sm-row ">
                      <Button onClick={() => startEdit(index)} variant="info">
                        Edit
                      </Button>{" "}
                      <DeleteTodo
                        index={index}
                        id={item.id}
                        isEdited={isEdited}
                      />
                    </div>
                  </>
                ) : (
                  <Edit
                    setEditedIndex={setEditedIndex}
                    item={item}
                    index={index}
                    id={item.id}
                  />
                )}
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
