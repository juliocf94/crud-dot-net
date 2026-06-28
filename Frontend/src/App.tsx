import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadClientes() {
      const res = await fetch("http://localhost:5171/api/employees");
      const json = await res.json();
      setData(json);
    }

    loadClientes();
  }, []);

  console.log(data);

  return (
    <>

    </>
  )
}

export default App
