import React from 'react';
import { useParams } from 'react-router-dom'; 
import Live from '../components/Live'; 
import '../styles/Live.css'

const LivePage = () => {
  const { userId } = useParams(); 
  return (
      <Live userId={userId} />

  );
};

export default LivePage;
