import React from 'react';
import './TransformationControls.css';

const TransformationControls = ({ 
  transformations, 
  addTransformation, 
  updateTransformation, 
  removeTransformation 
}) => {
  
  const handleParamChange = (id, type, key, value) => {
    const transform = transformations.find(t => t.id === id);
    if (!transform) return;

    let newParams;
    if (type === 'rotate') {
      newParams = { ...transform.params };
      newParams[key] = key === 'angle' ? (value === '' ? '' : parseFloat(value) || 0) : value;
    } else {
      newParams = [...transform.params];
      newParams[key] = value === '' ? '' : parseFloat(value) || 0;
    }
    updateTransformation(id, newParams);
  };

  const renderTransformParams = (transform) => {
    switch (transform.type) {
      case 'translate':
        return (
          <div className="param-grid">
            <div className="param-input">
              <label>TX:</label>
              <input
                type="number"
                value={transform.params[0]}
                onChange={(e) => handleParamChange(transform.id, 'translate', 0, e.target.value)}
                step="0.1"
                placeholder="0.0"
              />
            </div>
            <div className="param-input">
              <label>TY:</label>
              <input
                type="number"
                value={transform.params[1]}
                onChange={(e) => handleParamChange(transform.id, 'translate', 1, e.target.value)}
                step="0.1"
                placeholder="0.0"
              />
            </div>
            <div className="param-input">
              <label>TZ:</label>
              <input
                type="number"
                value={transform.params[2]}
                onChange={(e) => handleParamChange(transform.id, 'translate', 2, e.target.value)}
                step="0.1"
                placeholder="0.0"
              />
            </div>
          </div>
        );
      
      case 'rotate':
        return (
          <div className="param-grid">
            <div className="param-input">
              <label>Axis:</label>
              <select
                value={transform.params.axis}
                onChange={(e) => handleParamChange(transform.id, 'rotate', 'axis', e.target.value)}
              >
                <option value="x">X-Axis</option>
                <option value="y">Y-Axis</option>
                <option value="z">Z-Axis</option>
              </select>
            </div>
            <div className="param-input full-width">
              <label>Angle (degrees):</label>
              <input
                type="number"
                value={transform.params.angle}
                onChange={(e) => handleParamChange(transform.id, 'rotate', 'angle', e.target.value)}
                step="1"
                placeholder="0"
              />
            </div>
          </div>
        );
      
      case 'scale':
        return (
          <div className="param-grid">
            <div className="param-input">
              <label>SX:</label>
              <input
                type="number"
                value={transform.params[0]}
                onChange={(e) => handleParamChange(transform.id, 'scale', 0, e.target.value)}
                step="0.1"
                placeholder="1.0"
              />
            </div>
            <div className="param-input">
              <label>SY:</label>
              <input
                type="number"
                value={transform.params[1]}
                onChange={(e) => handleParamChange(transform.id, 'scale', 1, e.target.value)}
                step="0.1"
                placeholder="1.0"
              />
            </div>
            <div className="param-input">
              <label>SZ:</label>
              <input
                type="number"
                value={transform.params[2]}
                onChange={(e) => handleParamChange(transform.id, 'scale', 2, e.target.value)}
                step="0.1"
                placeholder="1.0"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getTransformIcon = (type) => {
    switch (type) {
      case 'translate': return '↔';
      case 'rotate': return '↻';
      case 'scale': return '⊡';
      default: return '⚙';
    }
  };

  return (
    <div className="transformation-controls">
      <div className="section-header">
        <h2>Transformations</h2>
      </div>
      
      <div className="add-buttons">
        <button 
          className="add-btn translate" 
          onClick={() => addTransformation('translate')}
        >
          + Translate
        </button>
        <button 
          className="add-btn rotate" 
          onClick={() => addTransformation('rotate')}
        >
          + Rotate
        </button>
        <button 
          className="add-btn scale" 
          onClick={() => addTransformation('scale')}
        >
          + Scale
        </button>
      </div>

      <div className="transformations-list">
        {transformations.length === 0 ? (
          <div className="empty-state">
            No transformations added yet. Click the buttons above to add one.
          </div>
        ) : (
          transformations.map((transform, index) => (
            <div key={transform.id} className={`transform-card ${transform.type}`}>
              <div className="transform-header">
                <span className="transform-title">
                  {getTransformIcon(transform.type)} {transform.type.charAt(0).toUpperCase() + transform.type.slice(1)} {index + 1}
                </span>
                <button 
                  className="remove-btn"
                  onClick={() => removeTransformation(transform.id)}
                  title="Remove transformation"
                >
                  ✕
                </button>
              </div>
              {renderTransformParams(transform)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransformationControls;
