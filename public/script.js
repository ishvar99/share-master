let socket = io("/")
let users = document.getElementById("users-list")
var peer = new Peer()
peer.on("open", (userId) => {
  populateUsersList(userId, " (You)")
  socket.emit("join", roomId, userId)
})
socket.on("user-connected", (userId) => {
  populateUsersList(userId)
})
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close()
})

function populateUsersList(userId, tag) {
  let li = document.createElement("li")
  li.appendChild(document.createTextNode(userId))
  if (tag) {
    let span = document.createElement("span")
    let strong = document.createElement("strong")
    strong.appendChild(document.createTextNode(tag))
    span.appendChild(strong)
    li.appendChild(span)
  }
  users.appendChild(li)
}
