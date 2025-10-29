import React from 'react';
import './VectorInput.css';

const VectorInput = ({ point, setPoint }) => {
  const handleChange = (index, value) => {
    const newPoint = [...point];
    newPoint[index] = parseFloat(value) || 0;
    setPoint(newPoint);
  };

  return (
    <div className="vector-input">
      <h2>📍 Input Vector</h2>
      <div className="input-group">
        <div className="input-field">
          <label>X:</label>
          <input
            type="number"
            value={point[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            step="0.1"
          />
        </div>
        <div className="input-field">
          <label>Y:</label>
          <input
            type="number"
            value={point[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            step="0.1"
          />
        </div>
        <div className="input-field">
          <label>Z:</label>
          <input
            type="number"
            value={point[2]}
            onChange={(e) => handleChange(2, e.target.value)}
            step="0.1"
          />
        </div>
      </div>
      <div className="vector-display">
        Vector: [{point[0].toFixed(2)}, {point[1].toFixed(2)}, {point[2].toFixed(2)}]
      </div>
    </div>
  );
};

export default VectorInput;
