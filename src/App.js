import React, { useState } from 'react';
import './App.css';
import { FaYoutube, FaMagic, FaMicrophoneAlt, FaSpinner } from 'react-icons/fa';

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [message, setMessage] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const handleProcessVideo = async () => {
    setIsProcessing(true);
    setMessage('');
    setAnswer('');
    try {
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Video processed successfully! You can now ask questions.');
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ An unexpected error occurred. Please check the backend server. Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    setIsAnswering(true);
    setAnswer('');
    setMessage('');
    try {
      const response = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });
      const data = await response.json();
      if (data.success) {
        setAnswer(data.answer);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ An unexpected error occurred. Please check the backend server. Error: ${error.message}`);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAskQuestion();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <FaYoutube className="icon" />
          YouTube Video Analyzer
        </h1>
        <p className="app-subtitle">
          Ask questions to any YouTube video using the power of AI.
        </p>
      </header>

      <main className="app-main">
        <div className="input-section">
          <label htmlFor="url-input" className="input-label">
            Enter a YouTube Video URL
          </label>
          <div className="input-group">
            <input
              type="text"
              id="url-input"
              className="text-input"
              placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={isProcessing}
            />
            <button
              className="action-button primary-button"
              onClick={handleProcessVideo}
              disabled={isProcessing || !youtubeUrl}
            >
              {isProcessing ? (
                <FaSpinner className="spinner" />
              ) : (
                <>
                  <FaMagic className="button-icon" /> Analyze Video
                </>
              )}
            </button>
          </div>
          {message && <p className="status-message">{message}</p>}
        </div>
        
        <div className="input-section">
          <label htmlFor="question-input" className="input-label">
            Ask a Question
          </label>
          <div className="input-group">
            <input
              type="text"
              id="question-input"
              className="text-input"
              placeholder="e.g., What were the key takeaways about ancient aliens?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAnswering}
            />
            <button
              className="action-button secondary-button"
              onClick={handleAskQuestion}
              disabled={isAnswering || !question}
            >
              {isAnswering ? (
                <FaSpinner className="spinner" />
              ) : (
                <>
                  <FaMicrophoneAlt className="button-icon" /> Ask
                </>
              )}
            </button>
          </div>
        </div>

        {answer && (
          <div className="answer-section">
            <h2 className="section-title">Answer</h2>
            <div className="answer-box">
              <p>{answer}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;