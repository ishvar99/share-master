const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room })
})

io.on("connection", (socket) => {
  console.log("client connected!")
  socket.on("join", (roomId, userId) => {
    socket.join(roomId) // join the room
    socket.to(roomId).broadcast.emit("user-connected", userId)
    socket.on("disconnect", () => {
      console.log("disconnected")
      socket.to(roomId).broadcast.emit("user-disconnected", userId)
    })
  })
})
server.listen(3000, () => {
  console.log("Server is listening on PORT 3000")
})
