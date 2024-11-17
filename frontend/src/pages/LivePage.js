import React from 'react';
import { useParams } from 'react-router-dom'; 
import Live from '../components/Live'; 
import '../styles/Live.css'

const LivePage = () => {
  const { userId } = useParams(); 
  return (
    <div className='live-page-wrapper'>
      <Live userId={userId} />
    </div>
  );
};

export default LivePage;
