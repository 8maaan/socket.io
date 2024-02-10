const express = require('express');
const app = express(); // instance of express variable
const http = require("http");
const { Server } = require('socket.io') //Server class
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

// IMPORTANT
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // CLIENT ADDRESS
        methods: ["GET", "POST"],
    },
});

// LISTEN TO EVENTS FROM CLIENT
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`) //CHECK IF SERVER IS RUNNING

    socket.on("join_room", (data) => {
        socket.join(data);
    })

    socket.on("send_message", (data) =>{
        // console.log(data);
        // socket.broadcast.emit("receive_message", data); //SEND DATA TO EVERYONE
        socket.to(data.room).emit("receive_message", data);
    })
})

server.listen(3001, ()=>{
    console.log("SERVER IS RUNNING");
});