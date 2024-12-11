import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { ChakraProvider, Box, Input, List, ListItem, Heading, Text, VStack, Spinner, Center, extendTheme } from '@chakra-ui/react';


const theme = extendTheme({
  fonts: {
    heading: "'Roboto', sans-serif",
    body: "'Roboto', sans-serif",
  },
});


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    axios
      .get('/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Błąd przy pobieraniu użytkowników:', error);
        setLoading(false);
      });
  }, [token]);

  const filteredUsers = users.filter((user) =>
    `${user.imie} ${user.nazwisko}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToChat = (userId) => {
    navigate(`/messages/${userId}`);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box maxW="80%" mx="auto" mt={100} p={4} borderWidth="1px" borderRadius="lg" shadow="md" >
        <Heading as="h2" mb={4} textAlign="center" fontWeight="normal" fontSize="2xl">
          Do kogo chcesz napisać?
        </Heading>
        <Input
          placeholder="Szukaj użytkownika..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={4}
          borderColor="gray.300"
          focusBorderColor="blue.500"
        />
        {loading ? (
          <Center py={8}>
            <Spinner size="lg" />
          </Center>
        ) : (
          <VStack spacing={3} align="stretch">
            <List spacing={3}>
              {filteredUsers.map((user) => (
                <ListItem
                  key={user.id}
                  p={3}
                  bg="gray.100"
                  borderRadius="md"
                  _hover={{ bg: 'blue.50', cursor: 'pointer' }}
                  onClick={() => goToChat(user.id)}
                >
                  <Text fontSize="md">
                    {user.imie} {user.nazwisko}
                  </Text>
                </ListItem>
              ))}
            </List>
            {filteredUsers.length === 0 && (
              <Text mt={4} textAlign="center" color="gray.500">
                Nie znaleziono użytkowników.
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default UserList;
