import React from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ result }) => {
  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toFixed(3) : num;
  };

  const calculateDistance = () => {
    const orig = result.original_point;
    const trans = result.transformed_point;
    return Math.sqrt(
      Math.pow(trans[0] - orig[0], 2) +
      Math.pow(trans[1] - orig[1], 2) +
      Math.pow(trans[2] - orig[2], 2)
    ).toFixed(3);
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
      <div className="section-header">
        <h2>Results</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Displacement</div>
          <div className="stat-value">{calculateDistance()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Dimensions</div>
          <div className="stat-value">3D</div>
        </div>
      </div>
      
      <div className="result-section">
        <h3>Original Vector</h3>
        <div className="vector-result original">
          [{result.original_point.map(formatNumber).join(', ')}]
        </div>
      </div>

      <div className="arrow">↓</div>

      <div className="result-section">
        <h3>Transformed Vector</h3>
        <div className="vector-result transformed">
          [{result.transformed_point.map(formatNumber).join(', ')}]
        </div>
      </div>

      <div className="result-section matrix-section">
        <h3>Transformation Matrix (4×4)</h3>
        <div className="matrix-container">
          {renderMatrix(result.transformation_matrix)}
        </div>
        <div className="matrix-info">
          This homogeneous transformation matrix represents the combined effect of all transformations applied to the vector.
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
