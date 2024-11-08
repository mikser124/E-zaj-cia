import React from 'react';
import '../../styles/Button.css'; 

const Button = ({ label, onClick, type = 'button', variant = 'upload' }) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${variant}`}>
      {label}
    </button>
  );
};

export default Button;