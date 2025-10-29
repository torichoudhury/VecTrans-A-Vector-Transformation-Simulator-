import React from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ result }) => {
  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toFixed(3) : num;
  };

  const renderMatrix = (matrix) => {
    return (
      <div className="matrix">
        {matrix.map((row, i) => (
          <div key={i} className="matrix-row">
            {row.map((val, j) => (
              <span key={j} className="matrix-cell">
                {formatNumber(val)}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="result-display">
      <h2>📊 Results</h2>
      
      <div className="result-section">
        <h3>Original Vector</h3>
        <div className="vector-result original">
          [{result.original_point.map(formatNumber).join(', ')}]
        </div>
      </div>

      <div className="arrow">⬇️</div>

      <div className="result-section">
        <h3>Transformed Vector</h3>
        <div className="vector-result transformed">
          [{result.transformed_point.map(formatNumber).join(', ')}]
        </div>
      </div>

      <div className="result-section">
        <h3>Transformation Matrix</h3>
        <div className="matrix-container">
          {renderMatrix(result.transformation_matrix)}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
