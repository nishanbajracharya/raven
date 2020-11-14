import Head from 'next/head';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

import http from '../utils/http';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [messages, setMessages] = useState([]);

  function getMessages() {
    http.get('/messages').then((response) => {
      setMessages(response);
    });
  }

  useEffect(async () => {

    getMessages();

    const socket = io();

    socket.on('message', (data) => {
      setMessages([...messages, data]);
      getMessages();
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    e.target.message.value = '';

    http.post('/messages', {
      text: formData.get('message'),
      platform: 'pc',
    })
  }

  return (
    <div className={styles.container}>
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
