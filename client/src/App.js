import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001");

function App() {
  // Room State
  const [room, setRoom] = useState("");

  // User State
  const [username, setUsername] = useState("");

  // Messages State
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  }

  const sendMessage = () => {
    const data = { username, message, room };
    setMessages((prevMessages) => [...prevMessages, data]); // Add your message to the state
    socket.emit("send_message", data);
    setMessage(""); // Clear the input after sending the message
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };
  
    socket.on("receive_message", receiveMessageHandler);
  
    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, []);

  return (
    <div className="App">
      {/* ROOM NUMBER INPUT */}
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />

      {/* USERNAME INPUT */}
      <input
        placeholder="Username..."
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />

      <button onClick={joinRoom}> Join Room </button>

      <br />

      {/* MESSAGE INPUT */}
      <input
        placeholder="Message..."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />

      <button onClick={sendMessage}> Send Message </button>

      <h1>Messages:</h1>
      <ul>
        {messages.map((data, index) => (
          <li key={index}>
            <strong>{data.username}:</strong> {data.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
