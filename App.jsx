import React from "./core/React.js";

function Counter({ num }) {
  return <div>hello,react count:{num}</div>;
}

function CounterContainer() {
  return <Counter />;
}

function App() {
  return (
    <div>
      hi-mini-react
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  );
}

export default App;
