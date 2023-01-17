import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
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
const ThemeContext = createContext("dark");

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { todos } = state;
  const inputRef = useRef<HTMLInputElement>(null);
  const { setFilter, filteredTodos } = useTodoFilter(todos);
  const [theme, setTheme] = useState("dark");

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
    <ThemeContext.Provider value={theme}>
      <div className={theme === "dark" ? "App" : "App-Light"}>
        <div>
          <input ref={inputRef} />
          <button onClick={onClickAdd}>Add Todo</button>
        </div>

        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          Toggle theme
        </button>

        <ThemePreview />
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
    </ThemeContext.Provider>
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

const ThemePreview = () => {
  const theme = useContext(ThemeContext);
  return <div>{theme === "dark" ? "🌒" : "🌞"}</div>;
};

export default App;
