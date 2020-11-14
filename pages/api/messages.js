import low from 'lowdb';
import { v4 as uuidv4 } from 'uuid';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ messages: [] }).write();

function prepareMessage(body = {}, req) {
  return {
    id: uuidv4(),
    raw: body.text,
    text: body.text,
    timestamp: Date.now(),

    user: body.user,
  };
}

export default async (req, res) => {
  if (req.method === 'POST') {
    const message = prepareMessage(req.body, req);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    res.json(db.get('messages').push(message).write());

    req.io.emit('message', message);

    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  res.json(db.get('messages').value());
};
