import http from '../utils/http';
import getUser from '../utils/user';

export function getMessages() {
  return http.get('/messages');
}

export function sendMessage(message) {
  return http.post('/messages', {
    text: message,
    user: getUser(),
  })
}