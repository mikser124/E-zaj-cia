import React from 'react';
import { useParams } from 'react-router-dom'; 
import Live from '../components/Live'; 
import '../styles/Live.css'

const LivePage = () => {
  const { id } = useParams(); 
  return (
    <div className='live-page-wrapper'>
      <Live liveId={id} />
    </div>
  );
};

export default LivePage;
