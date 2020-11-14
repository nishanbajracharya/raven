const next = require('next');
const socketIO = require('socket.io');
const { createServer } = require('http');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const io = socketIO();
  const server = createServer((req, res) => {
    req.io = io;
    return handle(req, res);
  });

  io.attach(server);

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${PORT}`);
  });
});
