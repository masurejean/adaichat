const socket = io();
let monSocketClients = [];
let mesMessage = [];
let monId, pseudo
const clients = document.getElementById("clients");

function displayClients(monSocketClients) {
  let clientTmp = "";
  monSocketClients.forEach((element) => {
    clientTmp += element.pseudo + "<br>";
  });
  clients.innerHTML = clientTmp;
}

socket.on("init", (init) => {
  console.log(init.message);
  //console.log(init.id);
  monId = init.id;
  monSocketClients = init.socketClients;
  pseudo = prompt("Veuillez vous identifier");
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
});
socket.on("newClient", (newClient) => {
  monSocketClients = newClient.socketClients;
  //displayClients
  displayClients(monSocketClients);
});

socket.on("clientDisconnect", (clientDisconnect) => {
  monSocketClients = clientDisconnect.socketClients;
  console.dir(monSocketClients);
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
  let monMessage = tinyMCE.get("mytextarea").getContent();/* document.getElementById("tinymce").innerHTML; */
  let date =  new Date();
  
  mesMessage.push({
    id: monId,
    pseudo: pseudo,
    message : monMessage,
    date:date,
  })});
  console.dir(mesMessage);
