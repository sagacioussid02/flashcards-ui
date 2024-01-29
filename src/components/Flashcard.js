// Flashcard.js
import React from 'react';

const Flashcard = ({ content }) => {
  return (
    <div style={flashcardStyle}>
      <p>{content}</p>
    </div>
  );
};

const flashcardStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  margin: '10px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
};

export default Flashcard;
