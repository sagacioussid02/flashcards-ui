// Flashcard.js
import React, { useState } from 'react';

const Flashcard = ({ title, front, back }) => {
  const [showFront, setShowFront] = useState(true);

  const handleClick = () => {
    setShowFront(!showFront);
  };

  return (
    <div className="flashcard" onClick={handleClick}>
      <h3>{title}</h3>
      {showFront ? <p>{front}</p> : <p>{back}</p>}
    </div>
  );
};

export default Flashcard;
