import numpy as np

def create_translation_matrix(translation):
    """
    Create a 4x4 translation matrix for homogeneous coordinates.
    
    Args:
        translation: [tx, ty, tz] - translation values
    
    Returns:
        4x4 numpy array representing the translation matrix
    """
    tx, ty, tz = translation
    matrix = np.identity(4)
    matrix[0, 3] = tx
    matrix[1, 3] = ty
    matrix[2, 3] = tz
    return matrix

def create_rotation_matrix(axis, angle_degrees):
    """
    Create a 4x4 rotation matrix for homogeneous coordinates.
    
    Args:
        axis: 'x', 'y', or 'z' - axis of rotation
        angle_degrees: rotation angle in degrees
    
    Returns:
        4x4 numpy array representing the rotation matrix
    """
    angle = np.radians(angle_degrees)
    cos_a = np.cos(angle)
    sin_a = np.sin(angle)
    
    matrix = np.identity(4)
    
    if axis.lower() == 'x':
        # Rotation around X-axis
        matrix[1, 1] = cos_a
        matrix[1, 2] = -sin_a
        matrix[2, 1] = sin_a
        matrix[2, 2] = cos_a
    elif axis.lower() == 'y':
        # Rotation around Y-axis
        matrix[0, 0] = cos_a
        matrix[0, 2] = sin_a
        matrix[2, 0] = -sin_a
        matrix[2, 2] = cos_a
    elif axis.lower() == 'z':
        # Rotation around Z-axis
        matrix[0, 0] = cos_a
        matrix[0, 1] = -sin_a
        matrix[1, 0] = sin_a
        matrix[1, 1] = cos_a
    
    return matrix

def create_scaling_matrix(scale_factors):
    """
    Create a 4x4 scaling matrix for homogeneous coordinates.
    
    Args:
        scale_factors: [sx, sy, sz] - scaling factors
    
    Returns:
        4x4 numpy array representing the scaling matrix
    """
    sx, sy, sz = scale_factors
    matrix = np.identity(4)
    matrix[0, 0] = sx
    matrix[1, 1] = sy
    matrix[2, 2] = sz
    return matrix

def apply_transformation(point, transformation_matrix):
    """
    Apply a transformation matrix to a point in homogeneous coordinates.
    
    Args:
        point: [x, y, z, 1] - point in homogeneous coordinates
        transformation_matrix: 4x4 transformation matrix
    
    Returns:
        Transformed point as numpy array
    """
    return transformation_matrix @ point

def create_composite_matrix(transformations):
    """
    Create a composite transformation matrix from a list of transformations.
    
    Args:
        transformations: List of transformation dictionaries
    
    Returns:
        4x4 composite transformation matrix
    """
    composite = np.identity(4)
    
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
        
        composite = composite @ matrix
    
    return composite
