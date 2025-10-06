import * as signalR from "@microsoft/signalr";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
// mở connection với URL
const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}auctionHub`)
    .withAutomaticReconnect() // lun reconnect khi bị mất kết nối
    .build(); // tạo connection

export async function startConnection() {
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            console.log("SignalR connected:", `${baseUrl}auctionHub`);
        }
    }
    catch (error) {
        console.error("SignalR connection error:", error);
        setTimeout(startConnection, 5000);
    }
}

export function getConnection() {
    return connection;
}