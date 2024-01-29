import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';

const FlashcardApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleGenerateFlashcards = async () => {
    setLoading(true);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      try {
        const response = await fetch('http://api-server-alb-1458073415.us-west-2.elb.amazonaws.com/generate-flashcards', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to generate flashcards. Status: ${response.status}`);
        }

        const data = await response.json();
        setFlashcards(data.flashcards);
        console.log('Flashcards generated:', data.flashcards);
      } catch (error) {
        console.error('Error generating flashcards:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn('Please select a PDF file.');
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(flashcards.length / 2);

  useEffect(() => {
    setCurrentPage(0);
  }, [flashcards]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      <h1>Generate Flashcards</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleGenerateFlashcards} disabled={loading}>
        Generate Flashcards
      </button>

      {loading && <p>Loading...</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {flashcards
          .slice(currentPage * 2, (currentPage + 1) * 2)
          .map((flashcard, index) => (
            <div key={index} style={{ width: '45%', margin: '10px', padding: '15px', border: '1px solid #ccc' }}>
              {Object.entries(flashcard).map(([title, content]) => (
                <Flashcard key={title} title={title} content={content} />
              ))}
            </div>
          ))}
      </div>

      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous Page
        </button>
        <span> Page {currentPage + 1} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Next Page
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <FlashcardApp />
    </div>
  );
}

export default App;
