import {io} from "socket.io-client";

export const socket = io("https://backendsimplegest.onrender.com",{
    withCredentials: true,
    transports: ["polling", "websocket"],
})