import React from 'react';
import { Link } from 'react-router-dom';
import { IoChatbubblesOutline } from 'react-icons/io5';

const ChatIcon = () => {
  return (
    <Link to="/chats">
      <IoChatbubblesOutline style={{ fontSize: '28px', cursor: 'pointer', color: '#FBFFFA' }} />
    </Link>
  );
};

export default ChatIcon;
