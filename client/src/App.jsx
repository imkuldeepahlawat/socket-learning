import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button } from "@mui/material";
const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomNumber, setRoomNumber] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const joinRoomHandler =(e)=>{
    e.preventDefault();
    socket.emit('join-room', roomNumber)
  }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [messages, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      {/* <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.Io
      </Typography> */}

      <Typography variant="h4" component="div" gutterBottom>
        {socketId}h
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <TextField
          id="outlined-basic"
          label="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          label="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <div>{
        messages.map((message,i) =><p key={i}>{message}</p>)}
      </div>
    </Container>
  );
};

export default App;
