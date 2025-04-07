const express = require('express');
const socket = require('socket.io');
const http = require('http');
const {Chess} = require("chess.js");
const path = require('path');

const app = express();

// in Documentation of socket.io
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let CurrPlayer = "W";

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.render("index",{title:"custom chess game"});
});

// jab bhi koi user is server s connect ho to y fucntion chala do
io.on("connection",function(uniquesocket){
    console.log("connected");
    
    // // send to all
    // uniquesocket.on("churan",function(){
    //     io.emit("churan papdi");
    // })

    // uniquesocket.on("disconnect",function(){
    //     console.log("disconnected");
    // })

        // send to specific
        if(!players.white){
            players.white = uniquesocket.id;
            uniquesocket.emit("playerRole", "W")
        }else if(!players.black){
            players.black = uniquesocket.id;
            uniquesocket.emit("playerrole","b")
        }else{
            uniquesocket.emit("spectators");
        }

        uniquesocket.on("disconnect",function(){
            if(uniquesocket.id === players.white){
                delete players.white;
            }
            else if(uniquesocket.id === players.white){
                delete players.black;
            }
        });

        uniquesocket.on("move",(move) =>{
            try{
                // black ki chance m black chale and white ki chance m white
                if(chess.turn () == 'w' && uniquesocket.id !== players.white)return;
                if(chess.turn () == 'b' && uniquesocket.id !== players.black)return;
//              me check krunga ki move valid movement hai ki nahi
                const result = chess.move(move);
                if(result){
                    // agr valid movement hai to vps frontend ko bhejdo, sbko
                    CurrPlayer = chess.turn();
                    io.emit("move",move);
                    // fen ek equation hai jisse pata chlta hai ki kiski kya positon hai, to apn n y sb frontend ko bhejdi sbko
                    io.emit("boardState",chess.fen());
                }else{
                    console.log("invalid move")
                    uniquesocket.emit("invalid Move",move)
                }
            }catch(err){
                console.log(err);
                uniquesocket.emit("invalid move :",move);
            }
        })
})

server.listen(3000);