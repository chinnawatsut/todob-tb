import { useCallback, useMemo, useReducer, useState } from "react";
import "./App.css";

interface Todo {
  text: string;
  id: number;
  completed: boolean;
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
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const onClickAdd = () => {
    const newTodo: Todo = {
      text: input,
      id: Date.now(),
      completed: false,
    };
    dispatch({ type: "ADD", payload: newTodo });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "UPDATE", payload: e.target.value });
  };


  // step: start id, status in todo -> create function return by filter -> use Memo

  const filteredTodos = useMemo(() => {
    console.log('log->>')
    switch (filter) {
      case 'all':
        return todos;
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  // const filteredTodos = () => {
  //   console.log('log->>')
  //   switch (filter) {
  //     case 'all':
  //       return todos;
  //     case 'active':
  //       return todos.filter((todo) => !todo.completed);
  //     case 'completed':
  //       return todos.filter((todo) => todo.completed);
  //     default:
  //       return todos;
  //   }
  // }


  return (
    <div className="App">
      <div>
        <input value={input} onChange={handleChange} />
        <button onClick={onClickAdd}>Add Todo</button>
      </div>

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      
      <div>
        <ul>
          {filteredTodos.map((todo, index) => {
            return <TodoItem key={index} todo={todo} />;
          })}
          {/* {filteredTodos().map((todo, index) => {
            return <TodoItem key={index} todo={todo} />;
          })} */}
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
