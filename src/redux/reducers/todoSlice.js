import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Async action to add a new todo
export const addTodo = createAsyncThunk(
  "Todo_lists/addTodo",
  async (newTodo) => {
    const docRef = await addDoc(collection(db, "Todo_lists"), newTodo);
    return { id: docRef.id, ...newTodo };
  }
);

// Async action to fetch todos from Firestore
export const fetchTodos = createAsyncThunk(
  "Todo_lists/fetchTodos",
  async () => {
    const querySnapshot = await getDocs(collection(db, "Todo_lists"));
    let todos = [];
    querySnapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() });
    });
    console.log(todos);
    return todos;
  }
);

export const editTodo = createAsyncThunk(
  "todos/editTodo",
  async ({ id, editedTodo, index }) => {
    console.log(id, editedTodo, index);
    const todoDoc = doc(db, "Todo_lists", id);
    await updateDoc(todoDoc, { todoItem: editedTodo }); // Ensure you've imported updateDoc
    return { id, editedTodo, index }; // Return updated todo
  }
);
// Async action to delete a todo
export const deleteTodo = createAsyncThunk(
  "Todo_lists/deleteTodo",
  async (id) => {
    await deleteDoc(doc(db, "Todo_lists", id));
    return id;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle addTodo
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = action.payload.index;
        state.todos[index].todoItem = action.payload.editedTodo;
      })
      // Handle deleteTodo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;
