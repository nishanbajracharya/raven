import Head from 'next/head';
import Linkify from 'react-linkify';
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { Container, Input, HStack, IconButton } from '@chakra-ui/react';

import { getMessages, sendMessage } from '../services/message';

import getUser from '../utils/user';
import styles from './message.module.css';

function Message(props) {
  return (
    <div
      className={`${styles.message} ${
        props.data.user === getUser() ? styles['message-user'] : ''
      }`}
    >
      <Linkify
        componentDecorator={(href, text, key) => (
          <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        )}
      >
        {props.data.text}
      </Linkify>
    </div>
  );
}

export default function Home() {
  const list = useRef(null);
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
      setMessages((prevMessages) => [...prevMessages, data]);
      fetchMessages();
    });

    if (list) {
      list.current.addEventListener('DOMNodeInserted', (event) => {
        const target = event.currentTarget;

        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    e.target.message.value = '';

    let message = formData.get('message');

    message = message && message.trim();

    if (!message) return;

    sendMessage(message);
  }

  return (
    <Container maxW="xl">
      <Head>
        <title>Raven</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.list} ref={list}>
        {messages.map((message) => (
          <Message data={message} key={message.id} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <HStack>
          <Input type="text" id="message" name="message" autoComplete="off" />

          <IconButton
            type="submit"
            colorScheme="blue"
            icon={<span className="material-icons">send</span>}
          />
        </HStack>
      </form>
    </Container>
  );
}
