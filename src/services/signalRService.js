import * as signalR from "@microsoft/signalr";

const API_BASE_URL = 'http://moviemanagement.runasp.net/notificationHub'; // Updated to match user's backend port

const connection = new signalR.HubConnectionBuilder()
    .withUrl(API_BASE_URL)
    .withAutomaticReconnect()
    .build();

export const startConnection = async () => {
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            console.log("SignalR Connected");
        }
    } catch (err) {
        console.error("SignalR Connection Error:", err);
    }
};

export const receiveMessages = (callback) => {
    connection.on("ReceiveMessage", callback);
};

export const removeReceiveMessage = (callback) => {
    connection.off("ReceiveMessage", callback);
};

export default connection;
