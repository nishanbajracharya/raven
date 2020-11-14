import Head from 'next/head';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [message, setMessage] = useState({});
  useEffect(() => {
    const socket = io();

    socket.on('message', (data) => {
      setMessage(data);
    });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {JSON.stringify(message)}
    </div>
  );
}
