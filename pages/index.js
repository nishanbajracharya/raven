import Head from 'next/head';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

import { getMessages, sendMessage } from '../services/message';

export default function Home() {
  const [messages, setMessages] = useState([]);

  function fetchMessages() {
    getMessages().then((response) => {
      setMessages(response);
    });
  }

  useEffect(async () => {
    fetchMessages();

    const socket = io();

    socket.on('message', (data) => {
      setMessages([...messages, data]);
      fetchMessages();
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    e.target.message.value = '';

    sendMessage(formData.get('message'));
  }

  return (
    <div>
      <Head>
        <title>Raven</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <input type="text" id="message" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
