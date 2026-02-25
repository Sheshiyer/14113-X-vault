"""
Face Detection using MediaPipe Face Detection

IMPORTANT: MediaPipe is the MANDATORY choice for all detection.
Do NOT use heavy alternatives like dlib or OpenCV DNN.
"""
import cv2
import numpy as np
from typing import Dict, Any, Optional, List

try:
    import mediapipe as mp
except ImportError:
    mp = None


class FaceDetector:
    """
    MediaPipe-based face detection for PIP analysis.
    """
    
    def __init__(self, min_detection_confidence: float = 0.5):
        """
        Initialize face detector.
        
        Args:
            min_detection_confidence: Minimum confidence for face detection
        """
        if mp is None:
            raise ImportError("MediaPipe is required. Install with: pip install mediapipe")
        
        self.mp_face_detection = mp.solutions.face_detection
        self.detector = self.mp_face_detection.FaceDetection(
            model_selection=0,  # 0 for short-range (within 2m), 1 for full-range
            min_detection_confidence=min_detection_confidence
        )
    
    def detect(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Detect faces in image.
        
        Args:
            image: BGR image (OpenCV format)
            
        Returns:
            dict with face_detected, bounding_box, landmarks, confidence
        """
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        h, w = image.shape[:2]
        
        # Process
        results = self.detector.process(image_rgb)
        
        faces: List[Dict[str, Any]] = []
        
        if results.detections:
            for detection in results.detections:
                # Get bounding box (relative coordinates)
                bbox = detection.location_data.relative_bounding_box
                
                # Convert to absolute coordinates
                x = int(bbox.xmin * w)
                y = int(bbox.ymin * h)
                face_w = int(bbox.width * w)
                face_h = int(bbox.height * h)
                
                # Ensure bounds are within image
                x = max(0, x)
                y = max(0, y)
                face_w = min(face_w, w - x)
                face_h = min(face_h, h - y)
                
                # Get key points
                keypoints = {}
                for idx, keypoint in enumerate(detection.location_data.relative_keypoints):
                    keypoint_name = self.mp_face_detection.FaceKeyPoint(idx).name
                    keypoints[keypoint_name] = {
                        'x': int(keypoint.x * w),
                        'y': int(keypoint.y * h)
                    }
                
                faces.append({
                    'bounding_box': {
                        'x': x,
                        'y': y,
                        'width': face_w,
                        'height': face_h
                    },
                    'bounding_box_normalized': {
                        'x': bbox.xmin,
                        'y': bbox.ymin,
                        'width': bbox.width,
                        'height': bbox.height
                    },
                    'confidence': detection.score[0] if detection.score else 0.0,
                    'keypoints': keypoints,
                    'center': {
                        'x': x + face_w // 2,
                        'y': y + face_h // 2
                    }
                })
        
        # Return primary face (largest or most confident)
        primary_face = None
        if faces:
            # Sort by area (largest first)
            faces.sort(key=lambda f: f['bounding_box']['width'] * f['bounding_box']['height'], reverse=True)
            primary_face = faces[0]
        
        return {
            'face_detected': len(faces) > 0,
            'face_count': len(faces),
            'primary_face': primary_face,
            'all_faces': faces
        }
    
    def create_face_mask(self, image_shape: tuple, face_result: Dict[str, Any], padding: float = 0.2) -> np.ndarray:
        """
        Create a binary mask for the detected face region.
        
        Args:
            image_shape: Shape of the image (h, w, c)
            face_result: Result from detect() method
            padding: Padding around face as fraction of face size
            
        Returns:
            Binary mask (255 = face region, 0 = background)
        """
        h, w = image_shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        
        if not face_result['face_detected'] or not face_result['primary_face']:
            return mask
        
        bbox = face_result['primary_face']['bounding_box']
        
        # Add padding
        pad_x = int(bbox['width'] * padding)
        pad_y = int(bbox['height'] * padding)
        
        x1 = max(0, bbox['x'] - pad_x)
        y1 = max(0, bbox['y'] - pad_y)
        x2 = min(w, bbox['x'] + bbox['width'] + pad_x)
        y2 = min(h, bbox['y'] + bbox['height'] + pad_y)
        
        # Create elliptical mask for more natural face shape
        center = ((x1 + x2) // 2, (y1 + y2) // 2)
        axes = ((x2 - x1) // 2, (y2 - y1) // 2)
        cv2.ellipse(mask, center, axes, 0, 0, 360, 255, -1)
        
        return mask
    
    def get_face_region_normalized(self, face_result: Dict[str, Any], padding: float = 0.2) -> Optional[Dict[str, float]]:
        """
        Get normalized face region bounds (0-1 range).
        
        Args:
            face_result: Result from detect() method
            padding: Padding around face as fraction of face size
            
        Returns:
            Dict with x, y, width, height in normalized coordinates (0-1)
        """
        if not face_result['face_detected'] or not face_result['primary_face']:
            return None
        
        bbox = face_result['primary_face']['bounding_box_normalized']
        
        # Add padding
        pad_x = bbox['width'] * padding
        pad_y = bbox['height'] * padding
        
        return {
            'x': max(0, bbox['x'] - pad_x),
            'y': max(0, bbox['y'] - pad_y),
            'width': min(1 - max(0, bbox['x'] - pad_x), bbox['width'] + 2 * pad_x),
            'height': min(1 - max(0, bbox['y'] - pad_y), bbox['height'] + 2 * pad_y)
        }
    
    def close(self):
        """Release resources."""
        self.detector.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
