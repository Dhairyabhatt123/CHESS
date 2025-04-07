// jese hi wwbsite chelgi browser pr, java script chlegi and ek request jayegi backend pe, io.connection
const socket = io('http://localhost:3000'); // Replace with your server's address

// socket.emit("churan");
// socket.on("churan papdi",function(){
//     console.log("churan recivied")
// })
const chess = new Chess();
const boardElement = document.querySelector(".chessboard")

let draggedpiece = null;
let sourceSquare = null;
let playerRole = null;
