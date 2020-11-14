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

    user: {
      platform: body.platform,
      remoteAddress: req.connection.remoteAddress,
    },
  };
}

export default async (req, res) => {
  console.log(req.connection.remoteAddress);

  if (req.method === 'POST') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    res.json(db.get('messages').push(prepareMessage(req.body, req)).write());

    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  res.json(db.get('messages').value());
};
