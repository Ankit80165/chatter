const username = prompt("Please enter your username and enter to slack!");
const socket = io("http://localhost:3000", {
  query: {
    username,
  },
}); // main '/' namespace
// listen for the nsList event, which will trigger upon joining in main namespace
// after listening the event will got the all ns data as a result of the data

let nsSocket = ""; // make it global, so we can use it from every file

socket.on("nsList", (data) => {
  const namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  data.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.img}></div>`;
  });
  //   get the information in which we clicked
  // there is a custom ns attribute which holds the namespace
  // upon clicking the icon in UI we will get the namespace
  const nameSpace = document.getElementsByClassName("namespace");
  Array.from(nameSpace).forEach((element) => {
    element.addEventListener("click", () => {
      const nsEndpoint = element.getAttribute("ns");
      joinNs(nsEndpoint);
    });
  });
  joinNs("/wiki");
});
