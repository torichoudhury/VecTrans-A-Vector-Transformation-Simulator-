import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import VectorInput from './components/VectorInput';
import TransformationControls from './components/TransformationControls';
import ResultDisplay from './components/ResultDisplay';
import Visualization from './components/Visualization';

function App() {
  const [point, setPoint] = useState([0, 0, 0]);
  const [transformations, setTransformations] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTransform = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/transform', {
        point: point,
        transformations: transformations
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Transformation failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const addTransformation = (type) => {
    const newTransform = {
      id: Date.now(),
      type: type,
      params: type === 'translate' 
        ? [0, 0, 0] 
        : type === 'rotate' 
        ? { axis: 'z', angle: 0 } 
        : [1, 1, 1]
    };
    setTransformations([...transformations, newTransform]);
  };

  const updateTransformation = (id, params) => {
    setTransformations(transformations.map(t => 
      t.id === id ? { ...t, params } : t
    ));
  };

  const removeTransformation = (id) => {
    setTransformations(transformations.filter(t => t.id !== id));
  };

  const clearAll = () => {
    setTransformations([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>VecTrans - Vector Transformation Simulator</h1>
        <p>Homogeneous Transformation Calculator</p>
      </header>

      <div className="container">
        <div className="left-panel">
          <VectorInput point={point} setPoint={setPoint} />
          
          <TransformationControls
            transformations={transformations}
            addTransformation={addTransformation}
            updateTransformation={updateTransformation}
            removeTransformation={removeTransformation}
          />

          <div className="action-buttons">
            <button 
              className="btn btn-primary" 
              onClick={handleTransform}
              disabled={loading || transformations.length === 0}
            >
              {loading ? 'Transforming...' : 'Apply Transformation'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="right-panel">
          {result && (
            <>
              <ResultDisplay result={result} />
              <Visualization 
                originalPoint={result.original_point} 
                transformedPoint={result.transformed_point} 
              />
            </>
          )}
          {!result && (
            <div className="placeholder">
              <h3>Configure your transformation</h3>
              <p>Add transformation operations on the left and click "Apply Transformation" to see the results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
