import { deleteDoc, doc } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import { db } from "./firebaseConfig";

export default function DeleteTodo({ setTodo, todo, index, isEdited }) {
  const isButtonDisabled = isEdited === index;
  const deleteTodo = async () => {
    try {
      const deleteTodo = await deleteDoc(
        doc(db, "Todo_lists", todo[index].todoId)
      );
    } catch (error) {
      console.log(error);
    }
    todo.splice(index, 1);
    setTodo([...todo]);
  };
  return (
    <Button onClick={deleteTodo} disabled={isButtonDisabled} variant="danger">
      Delete
    </Button>
  );
}
