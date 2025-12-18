import { useState } from "react";
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"

function App() {
  const [messages, setMessages] = useState([]);
  return (
    <>
      <Navbar setMessages={setMessages}/>
      <HomePage messages={messages} setMessages={setMessages}/>
      
    </>
  )
}

export default App  
