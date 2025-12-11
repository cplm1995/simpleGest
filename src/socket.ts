import {io} from "socket.io-client";

export const socket = io("https://backendsimplegest.onrender.com",{
    transports: ["websocket"],
    withCredentials: true,
})