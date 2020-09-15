const express = require("express")
const socket = require("socket.io")
let app = express()
let PORT = process.env.PORT || 3000
app.set("view engine", "ejs")
app.use(express.static("public"))
app.get("/", (req, res) => {
  res.render("home")
})
const server = app.listen(PORT, () => {
  console.log("Server is running")
})
const io = socket(server)
io.on("connection", (socket) => {
  console.log("client connected")
})
