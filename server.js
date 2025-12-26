const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8080});
const clients = new Set(); // Simpan semua koneksi client

console.log("WebSocket Server started on ws://localhost:8080");

wss.on("connection", function connection(ws) {
  console.log("New client connected");
  clients.add(ws);
  console.log(`Total clients: ${clients.size}`);

  // Kirim welcome message
  ws.send("SERVER:CONNECTED:Welcome to Toko bunga wilis Realtime Server");

  ws.on("message", function incoming(message) {
    const msgStr = message.toString();
    console.log(`Received: ${msgStr}`);

    // Jangan broadcast message identifikasi client
    if (msgStr.startsWith("CLIENT:")) {
      console.log("Client identification message");
      return;
    }

    // Broadcast ke semua client
    console.log(`Broadcasting to ${clients.size - 1} other clients...`);
    let broadcastCount = 0;

    clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msgStr);
        broadcastCount++;
      }
    });

    console.log(`Broadcasted to ${broadcastCount} clients`);
  });

  ws.on("close", function () {
    console.log("Client disconnected");
    clients.delete(ws);
    console.log(`Total clients: ${clients.size}`);
  });

  ws.on("error", function (error) {
    console.error("WebSocket error:", error);
  });
});

console.log("==============================");
console.log("Toko bunga wilis Realtime Server");
console.log("Port: 8080");
console.log("URL: ws://localhost:8080");
console.log("==============================");
console.log("Server is running...");
