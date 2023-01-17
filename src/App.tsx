import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import "./App.css";

interface Todo {
  text: string;
  id: number;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

interface Action {
  type: "ADD";
  payload: Todo | string;
}
const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem("todos") || "[]"),
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
    default:
      return state;
  }
};

const useTodoFilter = (todos: Todo[]) => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "all":
        return todos;
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);
  return {
    setFilter,
    filteredTodos,
  };
};

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { todos } = state;
  const { setFilter, filteredTodos } = useTodoFilter(todos);
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickAdd = () => {
    const newTodo: Todo = {
      text: inputRef.current!.value,
      id: Date.now(),
      completed: false,
    };
    dispatch({ type: "ADD", payload: newTodo });
    inputRef.current!.value = "";
  };

  return (
    <div className="App">
      <div>
        <input ref={inputRef} />
        <button onClick={onClickAdd}>Add Todo</button>
      </div>

      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      <div>
        <ul>
          {filteredTodos.map((todo, index) => {
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
