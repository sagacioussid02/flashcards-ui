import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import './App.css'; // Import your CSS file for styling

const FlashcardApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [userText, setUserText] = useState('');


  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    // Check if a file is selected
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
  
    // Check if the file type is PDF
    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }
  
    // Check if the file size is within the limit (120 KB)
    if (file.size > 120 * 1024) {
      setError("File size should not exceed 120 KB.");
      return;
    }
  
    setSelectedFile(file);
    setError(null); // Clear any previous error
  };

  const totalPages = flashcards ? Math.ceil(flashcards.length) : 0;


  useEffect(() => {
    console.log('Inside useEffect - Flashcards:', flashcards);
    setCurrentPage(0);
  }, [flashcards]);
  
  const handleGenerateFlashcards = async () => {
    setLoading(true);
  
    let userText = description.trim();
  
    if (selectedFile || userText) {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('pdf', selectedFile);
      } else {
        formData.append('text', userText);
      }
  
      try {
        const response = await fetch('https://binosusai.com/generate-flashcards', {
          method: 'POST',
          body: formData,
        });
      
        if (!response.ok) {
          throw new Error(`Failed to generate flashcards. Status: ${response.status}`);
        }
      
        const data = await response.json();
        console.log('Inside handleGenerateFlashcards - Flashcards:', data.flashcards);
      
        if (data.flashcards !== undefined && data.flashcards.length > 0) {
          setFlashcards(data.flashcards);
        } else {
          // Display a funny alert to the user
          alert("Oh no! The flashcards got lost in cyberspace. Please try again, and this time, send a virtual high-five to your notes!");
        }
      } catch (error) {
        // Log the error for debugging
        console.error('Error in fetch request:', error);
      
        // Display a funny alert to the user
        alert("Oops! Something went wrong in the flashcard factory. Give it another shot, and this time, wish your notes good luck!");
      } finally {
        setLoading(false);
      }
    } else {
      console.warn('Please select a PDF file or enter text.');
      setLoading(false);
    }
  };
  

  

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleTextChange = (event) => {
    setUserText(event.target.value);
  };

  return (
    <div className="flashcard-container">
      <h1>Generate Flashcards</h1>
      <p className="bigger-text">
        Quickly convert your notes into flashcards for easy revision before meetings, interviews, or tests.
      </p>
      <p>
        To get started, upload a PDF file containing your notes using the stylish "Choose File"
        button below. If a PDF file is chosen, the text area will be disabled and blurred. 
        If you prefer to input text directly, use the textarea to write your notes. 
        Click on "Generate Flashcards" to transform your PDF or text into interactive flashcards. 
        Navigate through the flashcards using the "Next Page" and "Previous Page" buttons.
      </p>
      <div className="file-input-container">
          <input id="fileInput" type="file" accept=".pdf" onChange={handleFileChange} />
          {selectedFile && (
            <div className="selected-file-box">
              Selected File: {selectedFile.name}
            </div>
          )}

        <div className="partition"></div>

        {selectedFile ? (
        <textarea
            className="blurred-textarea"
            placeholder="Text area blurred when a file is chosen."
            disabled
          />
        ) : (
          <textarea
            id="articlebox"
            className="textarea-description"
            placeholder="Write your notes here"
            value={description}
            rows={8}
            onChange={(e) => setDescription(e.target.value)}
          />
        )}
      </div>

      {/* Display error message if it exists */}
      {error && <div className="error-message">{error}</div>}

      <button onClick={handleGenerateFlashcards} disabled={loading || !!error}className="generate-button">
        {loading ? 'Generating...' : 'Generate Flashcards'}
      </button>

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      )}

      <div className="flashcard-grid">
        {flashcards && flashcards.length > 0 && (
          <div key={currentPage} className="flashcard-box">
          <Flashcard
            title={flashcards[currentPage].Title}
            front={flashcards[currentPage]["Front side"]}
            back={flashcards[currentPage]["Back side"]}
          />
          </div>
        )}
      </div>

      {/* Show pagination only when flashcards are generated */}
      {flashcards.length > 0 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous Page
          </button>
          <span> Page {currentPage + 1} of {totalPages} </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Next Page
          </button>
        </div>
      )}

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
