const socket = io();
let monSocketClients = [];
let mesMessage = [];
let monId;
const clients = document.getElementById("clients");
const messagesFrame = document.getElementById("messagesFrame");
const private = document.getElementById("private");
const sendPrivate = document.getElementById("sendPrivate");
const closeResponsePrivate= document.getElementById("closeResponsePrivate");
const closePrivate= document.getElementById("closePrivate");
const responsePrivateInner = document.getElementById("responsePrivateInner");
const responsePrivate = document.getElementById("responsePrivate");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pseudo = urlParams.get("pseudo");

function displayClients(monSocketClients) {
  let clientTmp = "";
  monSocketClients.forEach((element) => {
    if (monId !== element.id) {
        clientTmp += `<div onclick="privateMessage('${element.id}');" >${element.pseudo}</div>`;
    }
    
  });
  clients.innerHTML = clientTmp;
}
function privateMessage(id) {
  private.classList.remove("hide");
  private.classList.add("show");
  //console.log(id)
  tinymce.init({
    selector: "#myprivate",
    menubar: false,
    toolbar_location: "bottom",

    plugins: [
      "a11ychecker",
      "advlist",
      "advcode",
      "advtable",
      "autolink",
      "checklist",
      "export",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "powerpaste",
      "fullscreen",
      "formatpainter",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
      "emoticons",
    ],
    toolbar:
      "undo redo | formatpainter casechange blocks | bold italic backcolor emoticons| " +
      "alignleft aligncenter alignright alignjustify | " +
      "bullist numlist checklist outdent indent  | removeformat | a11ycheck code table help",
  });
  sendPrivate.addEventListener("click", () => {
    let monMessage = tinyMCE.get("myprivate").getContent();
    let date = new Date();

    socket.emit("newPrivateMessage", {
      message: monMessage,
      date: date,
      idContact: id,
      id: monId,
      pseudo: pseudo,
    });
    private.classList.add("hide");
    private.classList.remove("show");
    tinyMCE.activeEditor.setContent('');
  });
  closePrivate.addEventListener("click",()=>{
    private.classList.add("hide");
    private.classList.remove("show");
    tinyMCE.activeEditor.setContent('');

  })
}
socket.on("privateMessageReponse", (privateMessageReponse) => {
  console.dir(privateMessageReponse);

  responsePrivate.classList.remove("hide");
  responsePrivate.classList.add("show");
  for (const [key, value] of Object.entries(privateMessageReponse)) {
    let pseudo = value.pseudo;
    let message = value.message;
    let date = value.date;
    let responseCard = document.createElement('div');

    

    responseCard.innerHTML = pseudo + "<br>" + message + "<br>" + date;
    responsePrivateInner.append(responseCard);
    closeResponsePrivate.addEventListener('click',()=>{
    responseCard.remove();
    responsePrivate.classList.add("hide");
    responsePrivate.classList.remove("show");

    })
    responsePrivate.addEventListener('click',()=>{
        responseCard.remove();
        responsePrivate.classList.add("hide");
        responsePrivate.classList.remove("show");

    })
    responsePrivateInner.addEventListener('click',(e)=>{
        e.stopPropagation();
        e.preventDefault();
    })

  }
});

socket.on("init", (init) => {
  //console.log(init.message);
  //console.log(init.id);
  monId = init.id;
  monSocketClients = init.socketClients;
  mesMessage = init.messages;

  // j'ajoute mon pseudo au tableau des clients
  for (let i = 0; i < monSocketClients.length; i++) {
    if (monSocketClients[i].id === monId) {
      monSocketClients[i].pseudo = pseudo;
    }
  }
  //console.dir(monSocketClients);
  // je dois maintenant renvoyer au serveur le tableau de clients modifiÃ©
  socket.emit("initResponse", {
    socketClients: monSocketClients,
  });
  //displayClient
  displayClients(monSocketClients);
  displayMessages(mesMessage);
});
socket.on("newClient", (newClient) => {
  monSocketClients = newClient.socketClients;
  //displayClients
  displayClients(monSocketClients);
});

socket.on("clientDisconnect", (clientDisconnect) => {
  monSocketClients = clientDisconnect.socketClients;
  //console.dir(monSocketClients);
  //displayClient
  displayClients(monSocketClients);
});

tinymce.init({
  selector: "#mytextarea",
  menubar: false,
  toolbar_location: "bottom",

  plugins: [
    "a11ychecker",
    "advlist",
    "advcode",
    "advtable",
    "autolink",
    "checklist",
    "export",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "powerpaste",
    "fullscreen",
    "formatpainter",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
    "emoticons",
  ],
  toolbar:
    "undo redo | formatpainter casechange blocks | bold italic backcolor emoticons| " +
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist checklist outdent indent  | removeformat | a11ycheck code table help",
});

document.getElementById("sendMessage").addEventListener("click", () => {
  let monMessage = tinyMCE
    .get("mytextarea")
    .getContent(); /* document.getElementById("tinymce").innerHTML; */
  let date = new Date();

  mesMessage.push({
    id: monId,
    pseudo: pseudo,
    message: monMessage,
    date: date,
  });
  //console.log(mesMessage)
  socket.emit("newMessage", { messages: mesMessage });
  displayMessages(mesMessage);
  tinyMCE.activeEditor.setContent('');
});
//console.dir(mesMessage);

socket.on("newMessageResponse", (newMessage) => {
  mesMessage = newMessage.messages;

  displayMessages(mesMessage);
});

function displayMessages(mesMessages) {
  let messagesTmp = "";
  mesMessages.forEach((element) => {
    messagesTmp +=
      "<h4>" +
      element.pseudo +
      "</h4>" +
      "<p>" +
      element.date +
      "</p>" +
      "<p>" +
      element.message +
      "</p>" +
      "<br>";
  });
  messagesFrame.innerHTML = messagesTmp;
}
