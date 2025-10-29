from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from transformations import (
    create_translation_matrix,
    create_rotation_matrix,
    create_scaling_matrix,
    apply_transformation
)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/transform', methods=['POST'])
def transform_vector():
    """
    Transform a vector using homogeneous transformation matrices.
    Expected JSON:
    {
        "point": [x, y, z],
        "transformations": [
            {"type": "translate", "params": [tx, ty, tz]},
            {"type": "rotate", "params": {"axis": "x/y/z", "angle": degrees}},
            {"type": "scale", "params": [sx, sy, sz]}
        ]
    }
    """
    try:
        data = request.json
        point = np.array(data.get('point', [0, 0, 0]))
        transformations = data.get('transformations', [])
        
        # Convert point to homogeneous coordinates [x, y, z, 1]
        point_homogeneous = np.append(point, 1)
        
        # Create combined transformation matrix
        combined_matrix = np.identity(4)
        
        for transform in transformations:
            transform_type = transform.get('type')
            params = transform.get('params')
            
            if transform_type == 'translate':
                matrix = create_translation_matrix(params)
            elif transform_type == 'rotate':
                axis = params.get('axis', 'z')
                angle = params.get('angle', 0)
                matrix = create_rotation_matrix(axis, angle)
            elif transform_type == 'scale':
                matrix = create_scaling_matrix(params)
            else:
                continue
            
            combined_matrix = combined_matrix @ matrix
        
        # Apply transformation
        result = apply_transformation(point_homogeneous, combined_matrix)
        
        return jsonify({
            'success': True,
            'original_point': point.tolist(),
            'transformed_point': result[:3].tolist(),
            'transformation_matrix': combined_matrix.tolist()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Vector Transformation API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
