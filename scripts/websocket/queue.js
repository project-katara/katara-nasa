import redis from 'redis';

const pubClient = redis.createClient();
const subClient = redis.createClient();

pubClient.connect();
subClient.connect();

pubClient.on('error', (error) => {
  console.error(error);
});

subClient.on('error', (error) => {
  console.error(error);
});

export const broadcast = (ws, message) => {
   ws.send(message); 
};

export async function publish(channel, message) {
  return pubClient.publish(channel, message);
}

export async function subscribe(channel, ws, broadcast) {
  subClient.subscribe(channel, (message) => {
    broadcast(ws, message);
  });
}