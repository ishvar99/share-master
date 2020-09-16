let socket = io("/")
let users = document.getElementById("users-list")
let fileUpload = document.getElementById("siofu_input")
let fName
var targetSocketId
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
socket.on("recieve-file", (file, name) => {
  const blob = new Blob([file])
  const fileName = name
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName)
  } else {
    const link = document.createElement("a")
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
})
fileUpload.addEventListener("change", (e) => {
  fName = e.target.files[0].name
})
function uploadFile(e) {
  console.log(e)
  targetSocketId = e.target.textContent
  fileUpload.click()
}
function addUserToList(userId, self) {
  let li = document.createElement("li")
  li.onclick = (e) => uploadFile(e)
  li.style.cursor = "pointer"
  li.appendChild(document.createTextNode(userId))
  if (self) {
    let span = document.createElement("span")
    let strong = document.createElement("strong")
    strong.appendChild(document.createTextNode(" (You)"))
    span.appendChild(strong)
    li.appendChild(span)
    li.style.cursor = "default"
    li.onclick = null
  }
  users.appendChild(li)
}

let uploader = new SocketIOFileUpload(socket)
uploader.listenOnInput(fileUpload)
uploader.addEventListener("progress", function (event) {
  console.log(event)
  var percent = (event.bytesLoaded / event.file.size) * 100
  console.log("File is", percent.toFixed(2), "percent loaded")
})
uploader.addEventListener("complete", function (event) {
  if (event.success) {
    socket.emit("send-file", event.file, targetSocketId, fName)
  }
})

function removeUserFromList(id) {
  let userIds = users.getElementsByTagName("li")
  for (let userId of userIds) {
    if (userId.textContent === id) {
      users.removeChild(userId)
    }
  }
}
