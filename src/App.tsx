import { useCallback, useReducer } from "react";
import "./App.css";

interface Todo {
  text: string;
  id: number;
}

interface TodoState {
  todos: Todo[];
  input: string;
}

interface Action {
  type: "ADD" | "UPDATE";
  payload: Todo | string;
}
const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem("todos") || "[]"),
  input: "",
};

const todoReducer = (state: TodoState, action: Action) => {
  switch (action.type) {
    case "ADD":
      localStorage.setItem(
        "todos",
        JSON.stringify([...state.todos, action.payload as Todo])
      );
      return {
        ...state,
        todos: [...state.todos, action.payload as Todo],
        input: "",
      };
    case "UPDATE":
      return {
        ...state,
        input: action.payload as string,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { todos, input } = state;

  const onClickAdd = () => {
    const newTodo: Todo = {
      text: input,
      id: Date.now(),
    };
    dispatch({ type: "ADD", payload: newTodo });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "UPDATE", payload: e.target.value });
  };

  return (
    <div className="App">
      <div>
        <input value={input} onChange={handleChange} />
        <button onClick={onClickAdd}>Add Todo</button>
      </div>

      <div>
        <ul>
          {todos.map((todo, index) => {
            return <TodoItem key={index} todo={todo} />;
          })}
        </ul>
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = (props: TodoItemProps) => {
  const printTodo = useCallback(() => {
    console.log("Todo: " + props.todo.text);
  }, [props.todo.text]);

  return <li onClick={printTodo}>{props.todo.text}</li>;
};

export default App;
