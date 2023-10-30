import { createServer } from 'https';
import { readFileSync } from 'fs';

const server = createServer({
  cert: readFileSync(
    '/etc/letsencrypt/live/katara.earth/fullchain.pem',
    'utf8'
  ),
  key: readFileSync('/etc/letsencrypt/live/katara.earth/privkey.pem', 'utf8'),
});

import { WebSocketServer } from 'ws';
import axios from 'axios';
import { publish, subscribe, broadcast } from './queue.js';

const API_URL = 'https://dkdaniz-katara.hf.space/api/predict';

const wss = new WebSocketServer({server});

wss.on('connection', function connection(ws, req) {
  let paths = req.url.split('/').slice(1);
  let isClassRoom = paths.length === 2;

  if (isClassRoom) {
    const [roomId, clientId] = paths;
    ws.roomId = roomId;
    ws.clientId = clientId;

    subscribe(ws.roomId, ws, broadcast);
  }

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    const prompt = data.toString('utf-8');

    if (isClassRoom) {
      axios
        .post(API_URL, { prompt: prompt })
        .then(function (res) {
          publish(ws.roomId, JSON.stringify(res.data.response));
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .post(API_URL, { prompt: prompt })
        .then(function (res) {
          ws.send(JSON.stringify(res.data.response));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
});

server.listen(3333);
