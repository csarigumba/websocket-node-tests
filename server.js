const express = require('express');
const http = require('http');
const WebSocket = require('ws');
let fs = require('fs');

const port = 3000;
let app = express();
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });
const { uuid } = require('uuidv4');
const instanceId = uuid();

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {
  ws.send(`Running in server ${instanceId}`);

  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${instanceId} : ${data} `);
      }
    });
  });
});

app.get('/', function (req, res) {
  console.log('Get index');
  fs.createReadStream('./index.html').pipe(res);
});

app.get('/health', function (req, res) {
  res.send({
    id: instanceId,
  });
});

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
