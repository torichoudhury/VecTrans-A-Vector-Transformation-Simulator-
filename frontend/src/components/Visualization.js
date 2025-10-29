import React, { useEffect, useRef, useState } from 'react';
import './Visualization.css';

const Visualization = ({ originalPoint, transformedPoint }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(25);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with light teal background
    ctx.fillStyle = '#f0fdfa';
    ctx.fillRect(0, 0, width, height);

    // Draw red margin border around canvas
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, width, height);

    // Set up coordinate system (center of canvas with offset)
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;

    // Draw grid with better scale
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const gridRange = 30;
    const gridStep = 1;
    for (let i = -gridRange; i <= gridRange; i += gridStep) {
      if (i === 0) continue; // Skip center lines (axes)
      
      const xPos = centerX + i * scale;
      const yPos = centerY + i * scale;
      
      // Only draw if within canvas bounds
      if (xPos >= 0 && xPos <= width) {
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, height);
        ctx.stroke();
      }
      
      if (yPos >= 0 && yPos <= height) {
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      }
    }
    
    // Draw scale numbers on grid
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = -gridRange; i <= gridRange; i += 2) {
      if (i === 0) continue;
      const xPos = centerX + i * scale;
      const yPos = centerY - i * scale;
      
      // X-axis scale numbers
      if (xPos >= 30 && xPos <= width - 30 && Math.abs(centerY) < height - 25) {
        ctx.fillText(i.toString(), xPos, centerY + 20);
      }
      
      // Y-axis scale numbers
      if (yPos >= 30 && yPos <= height - 30 && Math.abs(centerX) < width - 30) {
        ctx.fillText(i.toString(), centerX - 22, yPos);
      }
    }

    // Draw axes with darker color
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Draw axis arrows
    ctx.fillStyle = '#475569';
    const arrowSize = 12;
    
    // X-axis arrow
    ctx.beginPath();
    ctx.moveTo(width - 15, centerY);
    ctx.lineTo(width - 25, centerY - arrowSize / 2);
    ctx.lineTo(width - 25, centerY + arrowSize / 2);
    ctx.closePath();
    ctx.fill();
    
    // Y-axis arrow
    ctx.beginPath();
    ctx.moveTo(centerX, 15);
    ctx.lineTo(centerX - arrowSize / 2, 25);
    ctx.lineTo(centerX + arrowSize / 2, 25);
    ctx.closePath();
    ctx.fill();

    // Function to convert 3D point to 2D canvas coordinates (using X-Y plane)
    const to2D = (point) => {
      return {
        x: centerX + point[0] * scale,
        y: centerY - point[1] * scale
      };
    };

    // Draw original point
    const orig = to2D(originalPoint);
    const isOrigHovered = hoveredPoint === 'original';
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(orig.x, orig.y, isOrigHovered ? 13 : 11, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add white border to point
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add outer border
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add glow effect on hover
    if (isOrigHovered) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }
    
    // Show labels only on hover
    if (isOrigHovered) {
      const labelOffsetX = 22;
      const labelOffsetY = -22;
      
      // Draw label background with gradient
      ctx.font = 'bold 15px Arial';
      const origTitleMetrics = ctx.measureText('Original');
      
      // Create gradient for background
      const origGradient = ctx.createLinearGradient(
        orig.x + labelOffsetX - 4, 
        orig.y + labelOffsetY - 12,
        orig.x + labelOffsetX + origTitleMetrics.width + 4,
        orig.y + labelOffsetY + 8
      );
      origGradient.addColorStop(0, '#1e40af');
      origGradient.addColorStop(1, '#3b82f6');
      
      ctx.fillStyle = origGradient;
      ctx.fillRect(orig.x + labelOffsetX - 4, orig.y + labelOffsetY - 12, origTitleMetrics.width + 8, 20);
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Original', orig.x + labelOffsetX, orig.y + labelOffsetY - 2);
      
      // Draw coordinate label with background
      const origLabel = `(${originalPoint[0].toFixed(2)}, ${originalPoint[1].toFixed(2)}, ${originalPoint[2].toFixed(2)})`;
      ctx.font = 'bold 13px Arial';
      
      const origLabelMetrics = ctx.measureText(origLabel);
      const origLabelWidth = origLabelMetrics.width;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(orig.x + labelOffsetX - 4, orig.y + labelOffsetY + 12, origLabelWidth + 8, 18);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(orig.x + labelOffsetX - 4, orig.y + labelOffsetY + 12, origLabelWidth + 8, 18);
      
      ctx.fillStyle = '#1e40af';
      ctx.fillText(origLabel, orig.x + labelOffsetX, orig.y + labelOffsetY + 21);
    }

    // Draw transformed point
    const trans = to2D(transformedPoint);
    const isTransHovered = hoveredPoint === 'transformed';
    
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(trans.x, trans.y, isTransHovered ? 13 : 11, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add white border to point
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add outer border
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add glow effect on hover
    if (isTransHovered) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }
    
    // Show labels only on hover
    if (isTransHovered) {
      const labelOffsetX = 22;
      const labelOffsetY = -22;
      
      // Draw label background with gradient
      ctx.font = 'bold 15px Arial';
      const transTitleMetrics = ctx.measureText('Transformed');
      
      // Create gradient for background
      const transGradient = ctx.createLinearGradient(
        trans.x + labelOffsetX - 4,
        trans.y + labelOffsetY - 12,
        trans.x + labelOffsetX + transTitleMetrics.width + 4,
        trans.y + labelOffsetY + 8
      );
      transGradient.addColorStop(0, '#065f46');
      transGradient.addColorStop(1, '#10b981');
      
      ctx.fillStyle = transGradient;
      ctx.fillRect(trans.x + labelOffsetX - 4, trans.y + labelOffsetY - 12, transTitleMetrics.width + 8, 20);
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Transformed', trans.x + labelOffsetX, trans.y + labelOffsetY - 2);
      
      // Draw coordinate label with background
      const transLabel = `(${transformedPoint[0].toFixed(2)}, ${transformedPoint[1].toFixed(2)}, ${transformedPoint[2].toFixed(2)})`;
      ctx.font = 'bold 13px Arial';
      
      const transLabelMetrics = ctx.measureText(transLabel);
      const transLabelWidth = transLabelMetrics.width;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(trans.x + labelOffsetX - 4, trans.y + labelOffsetY + 12, transLabelWidth + 8, 18);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(trans.x + labelOffsetX - 4, trans.y + labelOffsetY + 12, transLabelWidth + 8, 18);
      
      ctx.fillStyle = '#065f46';
      ctx.fillText(transLabel, trans.x + labelOffsetX, trans.y + labelOffsetY + 21);
    }

    // Draw transformation arrow
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.moveTo(orig.x, orig.y);
    ctx.lineTo(trans.x, trans.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw arrowhead
    const angle = Math.atan2(trans.y - orig.y, trans.x - orig.x);
    const arrowLength = 22;
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.moveTo(trans.x, trans.y);
    ctx.lineTo(
      trans.x - arrowLength * Math.cos(angle - Math.PI / 7),
      trans.y - arrowLength * Math.sin(angle - Math.PI / 7)
    );
    ctx.lineTo(
      trans.x - arrowLength * Math.cos(angle + Math.PI / 7),
      trans.y - arrowLength * Math.sin(angle + Math.PI / 7)
    );
    ctx.closePath();
    ctx.fill();
    
    // Draw distance measurement with background
    const distance = Math.sqrt(
      Math.pow(transformedPoint[0] - originalPoint[0], 2) +
      Math.pow(transformedPoint[1] - originalPoint[1], 2) +
      Math.pow(transformedPoint[2] - originalPoint[2], 2)
    );
    
    const midX = (orig.x + trans.x) / 2;
    const midY = (orig.y + trans.y) / 2;
    
    const distanceText = `Distance: ${distance.toFixed(2)}`;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const distanceMetrics = ctx.measureText(distanceText);
    const distanceWidth = distanceMetrics.width;
    
    // Draw background for distance label
    ctx.fillStyle = 'rgba(139, 92, 246, 0.95)';
    ctx.fillRect(midX - distanceWidth / 2 - 8, midY - 20, distanceWidth + 16, 24);
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.strokeRect(midX - distanceWidth / 2 - 8, midY - 20, distanceWidth + 16, 24);
    
    ctx.fillStyle = 'white';
    ctx.fillText(distanceText, midX, midY - 8);
  };

  useEffect(() => {
    drawVisualization();
  }, [originalPoint, transformedPoint, scale, offset, hoveredPoint]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prevScale => Math.max(5, Math.min(50, prevScale * delta)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      // Check hover on points
      const centerX = canvas.width / 2 + offset.x;
      const centerY = canvas.height / 2 + offset.y;

      const origX = centerX + originalPoint[0] * scale;
      const origY = centerY - originalPoint[1] * scale;
      const transX = centerX + transformedPoint[0] * scale;
      const transY = centerY - transformedPoint[1] * scale;

      const distToOrig = Math.sqrt(Math.pow(mouseX - origX, 2) + Math.pow(mouseY - origY, 2));
      const distToTrans = Math.sqrt(Math.pow(mouseX - transX, 2) + Math.pow(mouseY - transY, 2));

      if (distToOrig < 18) {
        setHoveredPoint('original');
        canvas.style.cursor = 'pointer';
      } else if (distToTrans < 18) {
        setHoveredPoint('transformed');
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredPoint(null);
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredPoint(null);
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(50, prevScale * 1.2));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(5, prevScale * 0.8));
  };

  const handleReset = () => {
    setScale(25);
    setOffset({ x: 0, y: 0 });
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="visualization" ref={containerRef}>
      <div className="section-header">
        <div className="visualization-header">
          <h2>Interactive 2D Visualization (X-Y Plane)</h2>
          <div className="visualization-controls">
          <button className="control-btn" onClick={handleZoomIn} title="Zoom In">
            +
          </button>
          <button className="control-btn" onClick={handleZoomOut} title="Zoom Out">
            −
          </button>
          <button className="control-btn reset" onClick={handleReset} title="Reset View">
            ⟲
          </button>
          <button className="control-btn fullscreen" onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? '⤓' : '⤢'}
          </button>
        </div>
        </div>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={isFullscreen ? window.innerWidth - 100 : 800}
          height={isFullscreen ? window.innerHeight - 250 : 600}
          className="visualization-canvas"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        <div className="canvas-hint">
          Scroll to zoom • Drag to pan • Hover over points for details
        </div>
      </div>
      <div className="visualization-info">
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color original"></span>
            <span>Original Point</span>
          </div>
          <div className="legend-item">
            <span className="legend-color transformed"></span>
            <span>Transformed Point</span>
          </div>
          <div className="legend-item">
            <span className="legend-color transformation"></span>
            <span>Transformation Path</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
