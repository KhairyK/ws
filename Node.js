// npm install ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let dashboardData = {
  usersOnline: 5,
  cpuLoad: 25,
  memoryUsage: 40,
  transactions: 120
};

function generateRandomData() {
  dashboardData.usersOnline = Math.floor(Math.random() * 100);
  dashboardData.cpuLoad = Math.floor(Math.random() * 100);
  dashboardData.memoryUsage = Math.floor(Math.random() * 100);
  dashboardData.transactions = Math.floor(Math.random() * 500);
}

// Broadcast data ke semua client
function broadcast() {
  generateRandomData();
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(dashboardData));
    }
  });
}

// Set interval update 1 detik
setInterval(broadcast, 1000);

wss.on('connection', ws => {
  console.log('Client connected');
  ws.send(JSON.stringify(dashboardData)); // kirim data awal
});
