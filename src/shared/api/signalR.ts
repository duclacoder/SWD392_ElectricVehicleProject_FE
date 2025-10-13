import * as signalR from "@microsoft/signalr";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}auctionHub`)
    .withAutomaticReconnect()
    .build();

export async function startConnection() {
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            console.log("SignalR connected:", `${baseUrl}auctionHub`);
        }
    } catch (error) {
        console.error("SignalR connection error:", error);
        setTimeout(startConnection, 5000);
    }
}

export function getConnection() {
    return connection;
}

export const auctionSignalR = {
    async joinAuctionRoom(auctionId: number): Promise<boolean> {
        try {
            await startConnection();
            const conn = getConnection();
            await conn.invoke("JoinAuction", auctionId);
            console.log(`Joined auction room: ${auctionId}`);
            return true;
        } catch (error) {
            console.error("Error joining auction room:", error);
            return false;
        }
    },

    async sendBid(auctionId: number, userId: number, bidAmount: number): Promise<boolean> {
        try {
            const conn = getConnection();
            await conn.invoke("SendBid", auctionId, userId, bidAmount);
            return true;
        } catch (error) {
            console.error("Error sending bid:", error);
            return false;
        }
    },
};
