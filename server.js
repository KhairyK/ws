const WebSocket = require('ws');
const fetch = require('node-fetch'); // npm install node-fetch
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

const PHP_API_URL = 'https://kyrt.my.id/save_message.php';

wss.on('connection', ws => {
    console.log('Client terhubung');

    ws.on('message', async (msg) => {
        console.log('Pesan dari client:', msg);

        // Pisahkan username & message (format: "username: pesan")
        const splitIndex = msg.indexOf(':');
        const username = splitIndex !== -1 ? msg.slice(0, splitIndex).trim() : 'Guest';
        const message  = splitIndex !== -1 ? msg.slice(splitIndex + 1).trim() : msg;

        // Kirim ke API PHP
        try {
            await fetch(PHP_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, message })
            });
        } catch(e) {
            console.error('Gagal simpan ke DB:', e);
        }

        // Broadcast ke semua client
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN){
                client.send(msg);
            }
        });
    });

    ws.on('close', () => console.log('Client terputus'));
});

console.log(`Server WebSocket berjalan di port ${PORT}`);
