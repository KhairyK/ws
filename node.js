const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
    console.log('Client terhubung');

    ws.on('message', (message) => {
        console.log('Pesan dari client:', message);
        // Broadcast ke semua client
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Server: ' + message);
            }
        });
    });

    ws.on('close', () => console.log('Client terputus'));
});

console.log(`Server WebSocket berjalan di port ${PORT}`);
