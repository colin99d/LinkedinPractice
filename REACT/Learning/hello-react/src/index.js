import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const lakeList = [
  {id: "1", name:"Echo", trailhead: "Echo"},
  {id: "2", name:"Vault", trailhead: "Vaultra"},
  {id: "3", name:"Strike", trailhead: "Striker"},
];

function Lake({lakes}) {
  return (
    <div>
      {lakes.map(lake => <div key={lake.id}>
        <h2>{lake.name}</h2>
        <p>Accessed by: {lake.trailhead}</p>
      </div>)}
    </div>
  );
}

function App() {
  const [manager, setManager] = useState("Alex");
  const [status, setStatus] = useState("Open");
  return(
    <>
    <div>
      <h1>Manager on Duty: {manager}</h1>
      <button onClick={() => setManager("Alex")}>Alex</button>
      <button onClick={() => setManager("Chris")}>Chris</button>
      <button onClick={() => setManager("Seth")}>Seth</button>
    </div>
    <div>
      <h1>Status: {status}</h1>
      <button onClick={() => setStatus("Open")}>Open</button>
      <button onClick={() => setStatus("Closed")}>Closed</button>
    </div>
    </>
  );
}

function Checkbox() {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    alert(`checked: ${checked.toString()}`);
  });
  return(
    <>
      <input type="checkbox" value={checked} onChange={() => setChecked(checked => !checked)}/>
      {checked ? "checked": "not checked"}
    </>
  )
}


ReactDOM.render(
  <Checkbox />,
  document.getElementById('root')
);

const [first, second, third] = ["popcorn","pretzels","pineapple"];