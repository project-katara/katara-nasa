import WebSocket, { WebSocketServer } from 'ws';
import redis from 'redis';

const client = redis.createClient();

const wss = new WebSocketServer({ port: 8080 });

const convertBufferToJsonMessage = (data) => {
  const messageData = data.toString('utf-8');
  const messageJson = JSON.parse(messageData);

  return messageJson;
};


const broadcast = (wss, ws, roomId, message) => {
    wss.clients.forEach(function each(client) {
        if (client.roomId === roomId) {
            ws.send(JSON.stringify(message));
        }
    });
}

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const { path, roomId, clientId, prompt } = convertBufferToJsonMessage(data);   

    if (path === 'classroom') {
        ws.roomId = roomId;
        ws.clientId = clientId;

        broadcast(wss, ws, roomId, prompt);
    }
    
  });
});
