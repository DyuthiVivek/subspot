import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faEllipsisV,
  faEllipsisH,
  faDownload,
  faPaperclip,
  faPaperPlane,
  faFilePdf,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import './ChatListPage.css';

const initialChats = [
  { id: 1, name: 'Friend 1' },
  { id: 2, name: 'Friend 2' },
  { id: 3, name: 'Seller 1' },
];

const ChatListPage = () => {
  const [chatList, setChatList] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(null);

  // Each key is chatId -> array of messages
  const [messages, setMessages] = useState({
    1: [
      { sender: 'theirs', text: 'Hello!', time: '10:00 AM', type: 'text' },
      { sender: 'mine', text: 'Hi there!', time: '10:01 AM', type: 'text' },
    ],
    2: [],
    3: [],
  });

  // Track typed message and the message being replied to
  const [typedMessage, setTypedMessage] = useState('');
  const [replyMsg, setReplyMsg] = useState(null);

  // For file uploads
  const fileInputRef = useRef(null);

  // Image/PDF modals
  const [modalImage, setModalImage] = useState(null);
  const [pdfModal, setPdfModal] = useState({ open: false, src: '', fileName: '' });

  // Header 3-dot menu (Clear/Delete chat)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Per-message options
  const [openMsgOptions, setOpenMsgOptions] = useState(null);

  // Delete popup modal
  const [deletePopup, setDeletePopup] = useState({ open: false, msgIndex: null });

  // For closing message-level dropdown if user clicks outside
  const msgOptionsRef = useRef(null);

  // Helper to get a simple time stamp
  const getTimeStamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Select a chat
  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
    setTypedMessage('');
    setMenuOpen(false);
    setReplyMsg(null);
    setOpenMsgOptions(null);
  };

  // Determine the display name if replying to a "theirs" message
  const getReplySenderName = (sender) => {
    if (sender === 'mine') return 'You';
    // If it's 'theirs', get the chat's name
    const chatObj = chatList.find((chat) => chat.id === selectedChat);
    return chatObj ? chatObj.name : 'Other';
  };

  // Send message
  const handleSend = () => {
    if (!typedMessage.trim() || !selectedChat) return;
    const timeStamp = getTimeStamp();

    // Build the new message object
    const newMessage = {
      sender: 'mine',
      text: typedMessage,
      time: timeStamp,
      type: 'text',
    };

    // If replying, store reference to the original message
    if (replyMsg) {
      newMessage.replyTo = {
        sender: replyMsg.sender,
        text: replyMsg.text,
      };
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }));

    setTypedMessage('');
    setReplyMsg(null);
  };

  // Handle upload click
  const handleUploadClick = () => {
    if (!selectedChat) return;
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;

    const timeStamp = getTimeStamp();
    const fileName = file.name;
    const fileType = file.type.toLowerCase();

    const reader = new FileReader();
    reader.onload = () => {
      let newMsg = {
        sender: 'mine',
        time: timeStamp,
      };
      if (fileType.startsWith('image/')) {
        newMsg.type = 'image';
        newMsg.src = reader.result;
      } else if (
        fileType === 'application/pdf' ||
        fileName.toLowerCase().endsWith('.pdf')
      ) {
        newMsg.type = 'pdf';
        newMsg.src = reader.result;
        newMsg.fileName = fileName;
      } else {
        newMsg.type = 'file';
        newMsg.src = reader.result;
        newMsg.fileName = fileName;
      }
      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMsg],
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Image modal
  const openImageModal = (src) => setModalImage(src);
  const closeImageModal = () => setModalImage(null);

  // PDF modal
  const openPdfModal = (src, fileName) => setPdfModal({ open: true, src, fileName });
  const closePdfModal = () => setPdfModal({ open: false, src: '', fileName: '' });

  // Clear chat
  const handleClearChat = () => {
    if (!selectedChat) return;
    setMessages((prev) => ({ ...prev, [selectedChat]: [] }));
    setMenuOpen(false);
  };

  // Delete entire chat
  const handleDeleteChat = () => {
    if (!selectedChat) return;
    setChatList((prev) => prev.filter((chat) => chat.id !== selectedChat));
    setMessages((prev) => {
      const newMsgs = { ...prev };
      delete newMsgs[selectedChat];
      return newMsgs;
    });
    setSelectedChat(null);
    setMenuOpen(false);
  };

  // Toggle header menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Toggle message options
  const toggleMsgOptions = (index) => {
    setOpenMsgOptions((prev) => (prev === index ? null : index));
  };

  // Open delete confirmation for a message
  const openDeletePopup = (index) => {
    setDeletePopup({ open: true, msgIndex: index });
  };

  /**
   * handleDeleteMessage:
   * - If deleteForAll = false => remove the message entirely (Delete for me).
   * - If deleteForAll = true  => transform the message to a 'deleted' type (Delete for all).
   */
  const handleDeleteMessage = (chatId, msgIndex, deleteForAll = false) => {
    setMessages((prev) => {
      const updated = [...(prev[chatId] || [])];
      if (!deleteForAll) {
        // Delete for me => remove the message from array
        updated.splice(msgIndex, 1);
      } else {
        // Delete for all => keep bubble, show "You deleted this message"
        const originalMsg = updated[msgIndex];
        updated[msgIndex] = {
          ...originalMsg,
          type: 'deleted',
          text: 'You deleted this message',
          replyTo: undefined,
          src: undefined,
          fileName: undefined,
        };
      }
      return { ...prev, [chatId]: updated };
    });
    setDeletePopup({ open: false, msgIndex: null });
    setOpenMsgOptions(null);
  };

  // Set the message we are replying to
  const handleReplyMessage = (msg) => {
    setReplyMsg(msg);
    setOpenMsgOptions(null);
  };

  // Close 3-dot header menu or message dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If not clicking inside the header menu
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      // If not clicking inside .chat-messages or specifically inside the .msg-options-container
      if (msgOptionsRef.current && !msgOptionsRef.current.contains(e.target)) {
        setOpenMsgOptions(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="chats-container">
      <div className="chats-wrapper">
        {/* Left Panel */}
        <div className="chats-left-panel">
          <header className="chats-left-header">
            <Link to="/dashboard" className="back-link arrow-only">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <h2 className="chats-title">Chat</h2>
          </header>

          <ul className="chat-list">
            {chatList.map((chat) => (
              <li
                key={chat.id}
                className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
                onClick={() => handleSelectChat(chat.id)}
              >
                {chat.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel */}
        {/* 
          Conditionally add "doodle" class if a chat is selected 
          => doodle background shows only if selectedChat != null
        */}
        <div className={selectedChat ? "chats-right-panel doodle" : "chats-right-panel"}>
          {selectedChat ? (
            <div className="chat-content">
              <header className="chats-right-header">
                <span className="chat-contact-name">
                  {chatList.find((chat) => chat.id === selectedChat)?.name}
                </span>
                <div className="chat-header-actions" ref={menuRef}>
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="ellipsis-icon"
                    onClick={toggleMenu}
                  />
                  {menuOpen && (
                    <div className="chat-menu-dropdown">
                      <div className="dropdown-item" onClick={handleClearChat}>
                        Clear Chat
                      </div>
                      <div className="dropdown-item" onClick={handleDeleteChat}>
                        Delete Chat
                      </div>
                    </div>
                  )}
                </div>
              </header>

              <div className="chat-messages" ref={msgOptionsRef}>
                {messages[selectedChat]?.map((msg, index) => {
                  const isMine = msg.sender === 'mine';
                  return (
                    <div
                      key={index}
                      className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}
                    >
                      {isMine ? (
                        <>
                          {/* 3-dots on left, bubble on right */}
                          <div className="msg-options-container" onClick={(e) => e.stopPropagation()}>
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="msg-options-icon"
                              onClick={() => toggleMsgOptions(index)}
                            />
                            {openMsgOptions === index && (
                              <div className="msg-options-dropdown" onClick={(e) => e.stopPropagation()}>
                                <div
                                  className="msg-option-item"
                                  onClick={() => handleReplyMessage(msg)}
                                >
                                  Reply
                                </div>
                                <div
                                  className="msg-option-item"
                                  onClick={() => openDeletePopup(index)}
                                >
                                  Delete
                                </div>
                              </div>
                            )}
                          </div>

                          <div className={`message-bubble ${msg.sender}`}>
                            {/* Show replied message if any */}
                            {msg.replyTo && (
                              <div className="mini-reply-bubble">
                                <span className="mini-reply-sender">
                                  {msg.replyTo.sender === 'mine'
                                    ? 'You'
                                    : getReplySenderName('theirs')}
                                </span>
                                <span className="mini-reply-text">{msg.replyTo.text}</span>
                              </div>
                            )}

                            {/* If the message is "deleted for all", check msg.type === 'deleted' */}
                            {msg.type === 'deleted' ? (
                              <>
                                <div className="message-text deleted">
                                  <FontAwesomeIcon icon={faBan} className="deleted-icon" />
                                  You deleted this message
                                </div>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'text' ? (
                              <>
                                <div className="message-text">{msg.text}</div>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'image' ? (
                              <>
                                <img
                                  src={msg.src}
                                  alt="sent"
                                  className="message-image"
                                  onClick={() => openImageModal(msg.src)}
                                />
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'pdf' ? (
                              <>
                                <div
                                  className="pdf-preview"
                                  onClick={() => openPdfModal(msg.src, msg.fileName)}
                                >
                                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" />
                                  <span className="pdf-filename">{msg.fileName}</span>
                                </div>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'file' ? (
                              <>
                                <a
                                  href={msg.src}
                                  download={msg.fileName}
                                  className="file-link"
                                  title="Download File"
                                >
                                  {msg.fileName}
                                </a>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : null}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* For 'theirs', bubble first, dots on right */}
                          <div className={`message-bubble ${msg.sender}`}>
                            {msg.replyTo && (
                              <div className="mini-reply-bubble">
                                <span className="mini-reply-sender">
                                  {msg.replyTo.sender === 'mine'
                                    ? 'You'
                                    : getReplySenderName('theirs')}
                                </span>
                                <span className="mini-reply-text">{msg.replyTo.text}</span>
                              </div>
                            )}

                            {msg.type === 'deleted' ? (
                              <>
                                <div className="message-text">{msg.text}</div>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'text' ? (
                              <>
                                <div className="message-text">{msg.text}</div>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'image' ? (
                              <>
                                <img
                                  src={msg.src}
                                  alt="sent"
                                  className="message-image"
                                  onClick={() => openImageModal(msg.src)}
                                />
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'pdf' ? (
                              <>
                                <div
                                  className="pdf-preview"
                                  onClick={() => openPdfModal(msg.src, msg.fileName)}
                                >
                                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" />
                                  <span className="pdf-filename">{msg.fileName}</span>
                                </div>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : msg.type === 'file' ? (
                              <>
                                <a
                                  href={msg.src}
                                  download={msg.fileName}
                                  className="file-link"
                                  title="Download File"
                                >
                                  {msg.fileName}
                                </a>
                                <div className="message-time">{msg.time}</div>
                              </>
                            ) : null}
                          </div>

                          <div className="msg-options-container" onClick={(e) => e.stopPropagation()}>
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="msg-options-icon"
                              onClick={() => toggleMsgOptions(index)}
                            />
                            {openMsgOptions === index && (
                              <div className="msg-options-dropdown" onClick={(e) => e.stopPropagation()}>
                                <div
                                  className="msg-option-item"
                                  onClick={() => handleReplyMessage(msg)}
                                >
                                  Reply
                                </div>
                                <div
                                  className="msg-option-item"
                                  onClick={() => openDeletePopup(index)}
                                >
                                  Delete
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* If user is replying, show a bubble above input */}
              {replyMsg && (
                <div className="reply-bubble">
                  <span className="reply-text">{replyMsg.text}</span>
                  <span className="cancel-reply" onClick={() => setReplyMsg(null)}>
                    &times;
                  </span>
                </div>
              )}

              {/* Message input area */}
              <div className="chats-input-area">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="send-icon"
                  onClick={handleSend}
                />
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className="upload-icon"
                  onClick={handleUploadClick}
                />
              </div>
            </div>
          ) : (
            /* If no chat selected => doodle won't appear */
            <div className="chat-placeholder">Start Messaging</div>
          )}
        </div>
      </div>

      {/* Delete Popup Modal */}
      {deletePopup.open && (
        <div
          className="delete-popup-modal"
          onClick={() => setDeletePopup({ open: false, msgIndex: null })}
        >
          <div className="delete-popup-content" onClick={(e) => e.stopPropagation()}>
            <p>Delete message:</p>
            <div className="delete-popup-options">
              <span
                className="delete-option"
                onClick={() =>
                  handleDeleteMessage(selectedChat, deletePopup.msgIndex, false)
                }
              >
                Delete for me
              </span>
              <span
                className="delete-option"
                onClick={() =>
                  handleDeleteMessage(selectedChat, deletePopup.msgIndex, true)
                }
              >
                Delete for all
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal-icon" onClick={closeImageModal}>
              &times;
            </span>
            <img src={modalImage} alt="Enlarged" className="modal-image" />
            <a href={modalImage} download="image.png" className="download-link">
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {pdfModal.open && (
        <div className="pdf-modal" onClick={closePdfModal}>
          <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-pdf-modal" onClick={closePdfModal}>
              &times;
            </span>
            <embed src={pdfModal.src} type="application/pdf" className="pdf-embed" />
            <a
              href={pdfModal.src}
              download={pdfModal.fileName}
              className="download-pdf-icon"
              title="Download PDF"
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatListPage;
