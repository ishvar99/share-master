const express = require("express")
const app = express()
const server = require("http").Server(app)
const siofu = require("socketio-file-upload")
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")
app.set("view engine", "ejs")
app.use(siofu.router)
app.use(express.static("public"))
app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room })
})
io.on("connection", (socket) => {
  console.log("client connected!")
  socket.on("join", (roomId) => {
    socket.join(roomId) // join the room
    io.in(roomId).clients((err, clients) => {
      if (!err) {
        io.in(roomId).emit("fetch-users", clients, socket.id)
      }
    })
    socket.to(roomId).emit("user-connected", socket.id)
    var uploader = new siofu()
    uploader.listen(socket)
    uploader.on("error", function (event) {
      console.log("Error from uploader", event)
    })
    socket.on("send-file", function (file, id, name) {
      io.to(id).emit("recieve-file", file, name)
    })
    socket.on("disconnect", () => {
      console.log("disconnected")
      socket.to(roomId).broadcast.emit("user-disconnected", socket.id)
    })
  })
})
server.listen(3000, () => {
  console.log("Server is listening on PORT 3000")
})
