# 🔄 VecTrans - Vector Transformation Simulator

A web-based vector transformation simulator that performs homogeneous transformations on 3D vectors. Built with Flask (Python) backend and React frontend.

## Features

- **🎯 Vector Input**: Input 3D vectors (x, y, z coordinates)
- **🔧 Multiple Transformations**: Apply translation, rotation, and scaling transformations
- **📊 Visual Results**: See transformation matrices and resulting vectors
- **📐 2D Visualization**: Visual representation of transformations on X-Y plane
- **⚡ Real-time Calculation**: Instant computation of homogeneous transformations

## What are Homogeneous Transformations?

Homogeneous transformations use 4x4 matrices to represent transformations in 3D space. By representing 3D points as 4D vectors [x, y, z, 1], we can perform translation, rotation, and scaling operations using matrix multiplication.

### Transformation Types:

1. **Translation**: Move a point by adding offsets (tx, ty, tz)
2. **Rotation**: Rotate around X, Y, or Z axis by specified degrees
3. **Scale**: Scale the point by factors (sx, sy, sz)

## Project Structure

```
VecTrans-A-Vector-Transformation-Simulator-/
├── backend/
│   ├── app.py                 # Flask application and API endpoints
│   ├── transformations.py     # Transformation matrix calculations
│   └── requirements.txt       # Python dependencies
│
└── frontend/
    ├── public/
    │   └── index.html        # HTML template
    ├── src/
    │   ├── components/       # React components
    │   │   ├── VectorInput.js
    │   │   ├── TransformationControls.js
    │   │   ├── ResultDisplay.js
    │   │   └── Visualization.js
    │   ├── App.js           # Main React component
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json         # Node.js dependencies
```

## Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```powershell
   python app.py
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install Node.js dependencies:
   ```powershell
   npm install
   ```

3. Start the React development server:
   ```powershell
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Usage

1. **Enter a Vector**: Input X, Y, Z coordinates of your starting point

2. **Add Transformations**: Click on transformation buttons to add:
   - **Translate**: Specify translation values (TX, TY, TZ)
   - **Rotate**: Select axis (X, Y, or Z) and rotation angle in degrees
   - **Scale**: Specify scaling factors (SX, SY, SZ)

3. **Apply Transformation**: Click "Apply Transformation" to calculate the result

4. **View Results**: See:
   - Original and transformed vectors
   - Complete 4x4 transformation matrix
   - 2D visualization of the transformation

## API Endpoints

### POST /api/transform

Transforms a vector using the specified transformations.

**Request Body:**
```json
{
  "point": [x, y, z],
  "transformations": [
    {
      "type": "translate",
      "params": [tx, ty, tz]
    },
    {
      "type": "rotate",
      "params": {
        "axis": "z",
        "angle": 45
      }
    },
    {
      "type": "scale",
      "params": [sx, sy, sz]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "original_point": [x, y, z],
  "transformed_point": [x', y', z'],
  "transformation_matrix": [[...], [...], [...], [...]]
}
```

### GET /api/health

Health check endpoint to verify the API is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Vector Transformation API is running"
}
```

## Examples

### Example 1: Simple Translation
- Input Vector: [1, 2, 3]
- Transformation: Translate by [2, 3, 1]
- Result: [3, 5, 4]

### Example 2: Rotation
- Input Vector: [1, 0, 0]
- Transformation: Rotate 90° around Z-axis
- Result: [0, 1, 0]

### Example 3: Combined Transformations
- Input Vector: [2, 2, 2]
- Transformations:
  1. Scale by [2, 2, 2] → [4, 4, 4]
  2. Rotate 45° around Z-axis
  3. Translate by [5, 0, 0]

## Technologies Used

### Backend
- **Flask**: Web framework
- **NumPy**: Matrix operations and calculations
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI framework
- **Axios**: HTTP client for API calls
- **Canvas API**: 2D visualization

## Mathematical Background

### Homogeneous Coordinates

A 3D point (x, y, z) is represented as [x, y, z, 1] in homogeneous coordinates.

### Transformation Matrices

**Translation Matrix:**
```
[1  0  0  tx]
[0  1  0  ty]
[0  0  1  tz]
[0  0  0  1 ]
```

**Rotation Matrix (around Z-axis):**
```
[cos(θ)  -sin(θ)  0  0]
[sin(θ)   cos(θ)  0  0]
[0        0       1  0]
[0        0       0  1]
```

**Scaling Matrix:**
```
[sx  0   0   0]
[0   sy  0   0]
[0   0   sz  0]
[0   0   0   1]
```

## Development

### Running in Development Mode

Both servers support hot-reloading:
- Flask: Automatically reloads on Python file changes
- React: Automatically reloads on JavaScript/CSS changes

### Testing the API

You can test the API using curl or any HTTP client:

```powershell
curl -X POST http://localhost:5000/api/transform -H "Content-Type: application/json" -d '{\"point\": [1, 2, 3], \"transformations\": [{\"type\": \"translate\", \"params\": [5, 0, 0]}]}'
```

## Troubleshooting

### Backend Issues

- **Port 5000 already in use**: Change the port in `app.py`
- **Module not found**: Make sure you installed all requirements with `pip install -r requirements.txt`

### Frontend Issues

- **Cannot connect to backend**: Ensure Flask server is running on port 5000
- **npm install fails**: Try clearing npm cache with `npm cache clean --force`

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning and development.

## Author

Created as an educational tool for understanding homogeneous transformations in computer graphics and robotics.

---

**Note**: This simulator uses simplified 2D visualization. The Z-coordinate is preserved in calculations but not shown in the canvas visualization.
