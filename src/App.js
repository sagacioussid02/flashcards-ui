import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import './App.css'; // Import your CSS file for styling

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
        const response = await fetch('https://binosusai.com/generate-flashcards', {
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

  const totalPages = Math.ceil(flashcards.length);

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
    <div className="flashcard-container">
      <h1>Generate Flashcards</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleGenerateFlashcards} disabled={loading} className="generate-button">
        {loading ? 'Generating...' : 'Generate Flashcards'}
      </button>

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      )}

      <div className="flashcard-grid">
            {flashcards[currentPage] && ( // Add a check here to ensure flashcard at currentPage exists
              <div key={currentPage} className="flashcard-box">
                <Flashcard
                  title={flashcards[currentPage].Title}
                  front={flashcards[currentPage]["Front side"]}
                  back={flashcards[currentPage]["Back side"]}
                />
              </div>
            )}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous Page
        </button>
        <span> Page {currentPage + 1} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Next Page
        </button>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Binosus Company. All rights reserved.</p>
        <p><a href="/privacy-policy">Privacy Policy</a></p>
      </footer>
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
