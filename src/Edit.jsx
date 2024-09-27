import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ColorRing } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { editTodo } from "./redux/reducers/todoSlice";

export default function Edit({ index, item, setEditedIndex, id }) {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(null);
  const [updateTodo, setUpdatetodo] = useState(item.todoItem);
  const handleEdit = async () => {
    const trimmedTodo = updateTodo.trim();
    if (trimmedTodo) {
      try {
        setLoader(true);
        await dispatch(editTodo({ id, editedTodo: updateTodo, index }));
        setLoader(false);
        setEditedIndex(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Todo item cannot be empty or just whitespace.");
    }
  };
  const submitOnEnter = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    }
  };

  return (
    <>
      <InputGroup className="todo-inp">
        <Form.Control
          placeholder="Enter Updated Todo"
          value={updateTodo}
          onChange={(e) => setUpdatetodo(e.target.value)}
          aria-label="Default"
          onKeyDown={submitOnEnter}
          aria-describedby="inputGroup-sizing-default"
        />
        <Button onClick={handleEdit} type="button" variant="primary">
          Update
          {loader && (
            <ColorRing
              visible={true}
              height="25"
              width="25"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          )}
        </Button>{" "}
      </InputGroup>
    </>
  );
}
