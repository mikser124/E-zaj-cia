import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import io from 'socket.io-client';
import { ChakraProvider, Box, IconButton, Textarea, VStack, Text, Heading, Flex, Divider, extendTheme } from '@chakra-ui/react';
import sendIcon from '../assets/images/send.png';

const theme = extendTheme({
  fonts: {
    heading: "'Roboto', sans-serif",
    body: "'Roboto', sans-serif",
  },
});

const Message = React.memo(({ msg, user, getMessageWidth }) => {
  return (
    <Flex
      direction="column"
      align={msg.from_id === user.id ? 'flex-end' : 'flex-start'} 
    >
      <Box
        bg={msg.from_id === user.id ? 'blue.100' : 'gray.100'}
        p={3}
        borderRadius="md"
        maxW={getMessageWidth(msg.content)} 
      >
        <Text fontWeight="bold">
          {msg.from_id === user.id ? 'Ty' : msg.sender?.imie || 'Nieznany użytkownik'}
        </Text>
        <Text>{msg.content}</Text>
        {msg.read && msg.from_id === user.id && (
          <Text fontSize="sm" color="gray.500">Przeczytano</Text>
        )}
      </Box>
    </Flex>
  );
});

const MessageChat = () => {
  const { userId } = useParams();
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [chatUser, setChatUser] = useState(null);
  
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);  
  const containerRef = useRef(null);  

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(response.data.messages);
      } catch (error) {
        console.error('Błąd przy pobieraniu wiadomości:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatUser(response.data);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych użytkownika:', error);
      }
    };

    fetchUserInfo();
    fetchMessages();

  }, [userId, token, user.id]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      query: { token },
      transports: ['websocket'],
    });
  
    newSocket.on('connect', () => {
      console.log('Połączono z WebSocketem');
      newSocket.emit('register', user.id);
    });
  
    setSocket(newSocket);
  
    return () => {
      console.log('Rozłączanie WebSocket');
      newSocket.disconnect();
    };
  }, [token, user.id]);
  
  useEffect(() => {
    if (socket) {
      socket.on('message_sent', (data) => {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });
      socket.on('receive_private_message', (data) => {
        if (data.message.from_id === parseInt(userId)) {
          socket.emit('message_read', { messageId: data.message.id, readerId: user.id });
          setMessages((prevMessages) => [...prevMessages, data.message]);
        } 
      });
      socket.on('message_read', (data) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
            msg.id === data.message.id ? { ...msg, read: true } : msg
          );
          return updatedMessages;
        });
      });
      socket.on('all_messages_read', () => {
          setMessages((prevMessages) => 
            prevMessages.map((msg) => 
              msg.from_id === user.id && msg.read === false ? { ...msg, read: true } : msg
            )
          );
      });
      return () => {
        socket.off('message_sent');
        socket.off('receive_private_message');
        socket.off('message_read');
        socket.off('all_messages_read');
      };
    }
  }, [socket, user.id, userId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (socket && userId) {
        if (document.visibilityState === 'visible') {
          socket.emit('chat_opened', { chatWith: userId, from_id: user.id });
        } else {
          socket.emit('chat_closed', { chatWith: userId, from_id: user.id });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [socket, userId, user.id]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '35px';

      if (textarea.scrollHeight <= 4 * 35) {
        textarea.style.height = `${textarea.scrollHeight}px`; 
      } else {
        textarea.style.height = '140px'; 
      }
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!content.trim()) return;

    socket.emit('send_private_message', {
      from_id: user.id,
      to_id: userId,
      content,
    });

    setContent('');

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '35px'; 
    }
  }, [content, socket, user.id, userId]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(); 
    }
  }, [handleSendMessage]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();  
  }, [messages]);

  const getMessageWidth = useCallback((msgContent) => {
    const messageLength = msgContent.length;
    const widthFactor = containerWidth * 0.4;  
    const baseWidth = 200; 
    const calculatedWidth = Math.min(baseWidth + messageLength * 3, widthFactor);

    return `${calculatedWidth}px`;
  }, [containerWidth]);

  return (
    <ChakraProvider theme={theme}>
      <Flex
        direction="column"
        p={6}
        w="100%"
        h="calc(100vh - 80px)" 
        bg="gray.50"
        borderRadius="md"
        boxShadow="md"
        maxW="100%"
        mx="auto"
        mt="80px"  
      >
        <Heading size="md" mb={4}>
          Rozmowa z {chatUser ? `${chatUser.imie} ${chatUser.nazwisko}` : 'Ładowanie danych...'}
        </Heading>
        <Box
          ref={containerRef}
          flex="1"  
          overflowY="scroll"
          borderWidth="1px"
          borderRadius="md"
          p={4}
          bg="white"
          mb={4}
        >
          <VStack spacing={3} align="stretch">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} user={user} getMessageWidth={getMessageWidth} />
            ))}
            <div ref={messagesEndRef} /> 
          </VStack>
        </Box>
        <Divider my={3} />
        <Flex direction="row" align="center" w="100%">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyPress}
            placeholder="Wpisz wiadomość..."
            size="sm"
            mb={3}
            bg="white"
            minHeight="35px" 
            resize="none" 
            overflow="auto"
            maxHeight="140px" 
            _focus={{ borderColor: 'blue.500' }} 
            flex="1" 
          />
          <IconButton
            icon={<img src={sendIcon} alt="Send" style={{ width: '33px', height: '33px' }} />}
            colorScheme="transparent"
            onClick={handleSendMessage}
            ml={2}
            height="35px" 
            alignSelf="stretch" 
            _focus={{ outline: 'none' }} 
            border="none"
            _active={{ backgroundColor: 'gray' }}
            _hover={{
              backgroundColor: 'transparent', 
              border: '4px solid #add8e6' 
            }} 
          />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default MessageChat;



