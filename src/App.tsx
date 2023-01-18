import { useState } from "react";
import "./App.css";

interface Todo {
  text: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const onClickAdd = () => {
    const todo: Todo = { text: input };
    const temp = todos
    temp.push(todo)
    setTodos(temp);
    setInput("");
  };

  return (
    <div className="App">
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={onClickAdd}>Add Todo</button>
      </div>

      <div>
        <ul>
          {todos.map((todo, index) => {
            return <li key={index}>{todo.text}</li>;
          })}
          {/* key prop helps React keep track of each item in the list, so it knows which items have been added, removed, or changed. */}
        </ul>
      </div>
    </div>
  );
}

export default App;
