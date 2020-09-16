let socket = io("/")
let users = document.getElementById("users-list")
socket.emit("join", roomId)
socket.on("fetch-users", (clients, id) => {
  if (id === socket.id) {
    clients
      .slice()
      .reverse()
      .forEach((client) => {
        if (socket.id === client) {
          addUserToList(client, true)
        } else {
          addUserToList(client)
        }
      })
  }
})
socket.on("user-connected", (id) => {
  addUserToList(id)
})
socket.on("user-disconnected", (id) => {
  removeUserFromList(id)
})

function addUserToList(userId, self) {
  let li = document.createElement("li")
  li.appendChild(document.createTextNode(userId))
  if (self) {
    let span = document.createElement("span")
    let strong = document.createElement("strong")
    strong.appendChild(document.createTextNode(" (You)"))
    span.appendChild(strong)
    li.appendChild(span)
  }
  users.appendChild(li)
}

function removeUserFromList(id) {
  let userIds = users.getElementsByTagName("li")
  for (let userId of userIds) {
    if (userId.textContent === id) {
      users.removeChild(userId)
    }
  }
}
