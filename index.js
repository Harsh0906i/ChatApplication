let express = require("express");
let app = express();
let path = require("path");
let port = 8080;
let socketconnected = new Set()

app.set("view-engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

let server = app.listen(port, () => {
    console.log("running");
});

const io = require("socket.io")(server);

io.on('connection', onconnect);

function onconnect(socket) {

    console.log(socket.id);
    
    socketconnected.add(socket.id);

    io.emit("clients-total", socketconnected.size);

    socket.on("disconnect", () => {
        console.log("Socket disconnected", socket.id);
        socketconnected.delete(socket.id);
        io.emit("clients-total", socketconnected.size);
    });

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    });

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data);
    });
}

app.get("/", (req, res) => {
    res.render("index.ejs");
});

