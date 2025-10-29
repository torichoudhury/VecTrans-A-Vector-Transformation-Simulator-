import React, { useEffect, useRef } from 'react';
import './Visualization.css';

const Visualization = ({ originalPoint, transformedPoint }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system (center of canvas)
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 20; // Scale factor for visualization

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(width, centerY + i * scale);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    
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

    // Draw axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.fillText('X', width - 20, centerY - 10);
    ctx.fillText('Y', centerX + 10, 20);

    // Function to convert 3D point to 2D canvas coordinates
    const to2D = (point) => {
      // Simple orthographic projection (ignoring Z for 2D view)
      return {
        x: centerX + point[0] * scale,
        y: centerY - point[1] * scale
      };
    };

    // Draw original point
    const orig = to2D(originalPoint);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(orig.x, orig.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Label original point
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Original', orig.x + 12, orig.y - 12);

    // Draw transformed point
    const trans = to2D(transformedPoint);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(trans.x, trans.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Label transformed point
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Transformed', trans.x + 12, trans.y - 12);

    // Draw arrow from original to transformed
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(orig.x, orig.y);
    ctx.lineTo(trans.x, trans.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw arrowhead
    const angle = Math.atan2(trans.y - orig.y, trans.x - orig.x);
    const arrowLength = 15;
    ctx.beginPath();
    ctx.moveTo(trans.x, trans.y);
    ctx.lineTo(
      trans.x - arrowLength * Math.cos(angle - Math.PI / 6),
      trans.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(trans.x, trans.y);
    ctx.lineTo(
      trans.x - arrowLength * Math.cos(angle + Math.PI / 6),
      trans.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

  }, [originalPoint, transformedPoint]);

  return (
    <div className="visualization">
      <h2>📐 2D Visualization (X-Y Plane)</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="visualization-canvas"
      />
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
        </div>
      </div>
    </div>
  );
};

export default Visualization;
