import express from 'express';
import { Server } from 'socket.io';
import {createServer} from 'http'
import cors from 'cors'
const port = 3000 ;
const app = express();
const server =createServer(app)


const io = new Server(server,{
    cors:{
        origin:'*'    }
})

app.use(cors({
    origin:'http://localhost:5173/',
    methods:['GET', 'POST'],
    credentials:true

}))
app.get('/', (req, res) => {
    res.send('hello world');
})

io.on('connection',(socket)=>{
    console.log("user connected",socket.id)

    socket.broadcast .emit(`${socket.id} joined the server`)
    // socket.emit('welcome',`welcome to server ${socket.id}`)

    socket.on('message',(data)=>{
        console.log(data)
        // io.emit('receive-message',data)
        // socket.broadcast  .emit('receive-message',data)
        // special case for
        io.to(data.room).emit('receive-message',data.message)
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
    })
    socket.on('join-room',(room)=>{
        socket.join(room)
    })
    



})
server.listen(3000,()=>{
    console.log(`server is running on ${port}`)
})