# Biofield Metrics: Complete Reference

**Version:** 2.0  
**Date:** January 2026  
**Source:** Extracted from BV-PIP Python Implementation  
**Purpose:** Comprehensive mathematical reference for all biofield metrics calculated from PIP/GDV/EPI imagery

---

## Table of Contents

1. [Overview](#1-overview)
2. [Basic Intensity Metrics](#2-basic-intensity-metrics)
3. [Color Analysis Metrics](#3-color-analysis-metrics)
4. [Geometric & Contour Metrics](#4-geometric--contour-metrics)
5. [Nonlinear Dynamics Metrics](#5-nonlinear-dynamics-metrics)
6. [Symmetry Metrics](#6-symmetry-metrics)
7. [Metric Categories & Consciousness Mapping](#7-metric-categories--consciousness-mapping)
8. [Implementation Notes](#8-implementation-notes)

---

## 1. Overview

### 1.1 Metric Philosophy

The biofield metrics system extracts quantitative features from polycontrast interference photography (PIP) images to assess:
- **Energy levels** - photon emission intensity and distribution
- **Coherence** - pattern organization and stability
- **Complexity** - fractal structure and information content
- **Regulation** - homeostatic balance and dynamic stability
- **Symmetry** - bilateral balance reflecting physiological integration
- **Color balance** - spectral distribution indicating energetic qualities

### 1.2 Input Data Format

All metrics operate on processed PIP images:
- **Format:** RGB or grayscale numpy arrays
- **Typical size:** 640×480 to 1920×1080 pixels
- **Color space:** RGB for color metrics, converted to grayscale/HSV as needed
- **Optional:** Binary mask for region-of-interest (ROI) isolation

### 1.3 Metric Categories

| Category | Metrics | Primary Use |
|----------|---------|-------------|
| **Basic** | Intensity, LQD, Area, Noise, Energy | Energy score |
| **Color** | Hue, Saturation, Entropy, Coherence | Color balance score |
| **Geometric** | Area, Perimeter, EC, FC, Ellipse | Energy/Complexity scores |
| **Nonlinear** | Fractal dim, Hurst, Lyapunov, DFA | Complexity/Regulation scores |
| **Symmetry** | SSIM, Correlation, Histogram | Symmetry score |
| **Contour** | Perimeter, Radius, Complexity | Energy/Complexity scores |

---

## 2. Basic Intensity Metrics

### 2.1 Average Intensity

**Formula:**
$$
\bar{I} = \frac{1}{N} \sum_{i=1}^{N} I_i
$$

**Where:**
- $I_i$ = pixel intensity at position $i$ (0-255)
- $N$ = total number of pixels in ROI

**Input Schema:**
```python
{
    "image": np.ndarray,  # Grayscale or BGR
    "mask": Optional[np.ndarray]  # 255 = include, 0 = exclude
}
```

**Output Schema:**
```python
{
    "avgIntensity": float  # Range: 0-255
}
```

**Scientific Basis:**  
Average intensity correlates with overall photon emission from the biofield. Higher values indicate greater energy emission, though must be contextualized against background and calibration.

**Consciousness Interpretation:**  
- **>180:** High vitality, expanded awareness
- **120-180:** Normal, balanced energy
- **<120:** Depleted, contracted awareness

**Implementation:**
```python
def calculate_avg_intensity(image: np.ndarray, mask: Optional[np.ndarray] = None) -> float:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    
    if mask is not None:
        pixels = gray[mask > 0]
    else:
        pixels = gray.flatten()
    
    return float(np.mean(pixels)) if len(pixels) > 0 else 0.0
```

---

### 2.2 Intensity Standard Deviation

**Formula:**
$$
\sigma_I = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (I_i - \bar{I})^2}
$$

**Output Range:** 0-255 (typically 10-60)

**Scientific Basis:**  
Measures heterogeneity of photon emission. Higher values indicate greater spatial variation, which can reflect:
- Active energy processes (positive)
- Chaotic/dysregulated patterns (negative)
Context from other metrics determines interpretation.

**Consciousness Interpretation:**  
- **Low (5-15):** Homogeneous, potentially stagnant or highly coherent
- **Medium (15-35):** Healthy variation, dynamic equilibrium
- **High (>35):** High complexity or dysregulation

---

### 2.3 Light Quanta Density (LQD)

**Formula:**
$$
LQD = \frac{\sum_{i=1}^{N} \mathbb{1}(I_i > T)}{N}
$$

**Where:**
- $\mathbb{1}$ = indicator function (1 if condition true, 0 otherwise)
- $T$ = adaptive threshold = $\bar{I} + 0.5 \cdot \sigma_I$

**Alternative (fixed threshold):**
$$
LQD_{fixed} = \frac{\sum_{i=1}^{N} \mathbb{1}(I_i > T_{fixed})}{N}
$$

**Output Range:** 0.0-1.0 (percentage)

**Scientific Basis:**  
Originally from Korotkov's GDV analysis. Measures the proportion of "activated" pixels above threshold, representing areas of concentrated photon emission.

**Consciousness Interpretation:**  
- **0.5-0.7:** Optimal - balanced activation
- **>0.7:** Over-activation, possible stress response
- **<0.3:** Under-activation, low vitality

**Implementation:**
```python
def calculate_lqd(image: np.ndarray, 
                 threshold: Optional[float] = None,
                 mask: Optional[np.ndarray] = None) -> float:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    
    if mask is not None:
        pixels = gray[mask > 0]
    else:
        pixels = gray.flatten()
    
    if len(pixels) == 0:
        return 0.0
    
    if threshold is None:
        threshold = np.mean(pixels) + 0.5 * np.std(pixels)
    
    above_threshold = np.sum(pixels > threshold)
    return above_threshold / len(pixels)
```

---

### 2.4 Normalized Area

**Formula:**
$$
A_{norm} = \frac{A_{ROI}}{A_{total}} = \frac{N_{pixels}}{W \times H}
$$

**Where:**
- $A_{ROI}$ = area of detected biofield (pixel count)
- $A_{total}$ = total image area
- $W, H$ = image width and height

**Output Range:** 0.0-1.0 (typically 0.1-0.8 for body segmentation)

**Scientific Basis:**  
Represents the spatial extent of biofield emission. Larger normalized area indicates expanded energy field.

**Consciousness Interpretation:**  
- **>0.6:** Expanded field, outward-oriented consciousness
- **0.3-0.6:** Normal boundaries
- **<0.3:** Contracted, inward focus or depletion

---

### 2.5 Inner Noise

**Formula:**
$$
N_{inner} = \sigma_I
$$

**Inner Noise Percentage:**
$$
N_{inner\%} = \frac{\sigma_I}{\bar{I}} \times 100
$$

**Output Range:**  
- Absolute: 0-255
- Percentage: 0-100% (typically 5-30%)

**Scientific Basis:**  
Derived from GDV research. High inner noise suggests:
- Metabolic activity and energy production
- System instability or pathological processes
Must be contextualized with other regulation metrics.

**Consciousness Interpretation:**  
- **5-15%:** Coherent, regulated
- **15-25%:** Active processing, healthy variation
- **>25%:** Chaotic, dysregulated, possible pathology

---

### 2.6 Integrated Energy

**Formula:**
$$
E = \sum_{i=1}^{N} I_i
$$

**Normalized variant:**
$$
E_{norm} = \frac{E}{N \times 255}
$$

**Output Range:**  
- Absolute: 0 to $N \times 255$
- Normalized: 0.0-1.0

**Scientific Basis:**  
Total photon count (integrated intensity) represents cumulative energy emission. Related to metabolic activity and biofield strength.

**Consciousness Interpretation:**  
Interpreted relative to baseline:
- **>150% baseline:** High energy state, expansion
- **80-120% baseline:** Normal fluctuation
- **<80% baseline:** Depletion, need for rest

**Implementation:**
```python
def calculate_energy(image: np.ndarray, mask: Optional[np.ndarray] = None) -> float:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    
    if mask is not None:
        pixels = gray[mask > 0].astype(np.float64)
    else:
        pixels = gray.flatten().astype(np.float64)
    
    return float(np.sum(pixels))
```

---

## 3. Color Analysis Metrics

### 3.1 Dominant Hue

**Formula:**
$$
H_{dom} = \arg\max_{h} \, hist_H(h)
$$

**Where:**
- $hist_H(h)$ = normalized histogram of hue channel (30 bins, 0-180°)

**Output Range:** 0-360° (converted from OpenCV's 0-180° scale)

**Color-Consciousness Mapping:**
- **0-30° (Red):** Root chakra, grounding, physical vitality
- **30-60° (Orange-Yellow):** Sacral/Solar, creativity, personal power
- **60-120° (Green):** Heart, healing, balance
- **120-180° (Cyan-Blue):** Throat/Third eye, communication, intuition
- **180-270° (Blue-Violet):** Third eye/Crown, higher consciousness
- **270-330° (Magenta):** Crown, spiritual connection
- **330-360° (Red-Magenta):** Integration, completion

**Implementation:**
```python
def calculate_dominant_hue(image_rgb: np.ndarray, 
                           mask: Optional[np.ndarray] = None) -> float:
    hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
    
    if mask is not None:
        h_pixels = hsv[:, :, 0][mask > 0]
    else:
        h_pixels = hsv[:, :, 0].flatten()
    
    if len(h_pixels) == 0:
        return 0.0
    
    hue_hist, _ = np.histogram(h_pixels, bins=30, range=(0, 180))
    hue_hist = hue_hist / hue_hist.sum() if hue_hist.sum() > 0 else hue_hist
    
    dominant_hue = np.argmax(hue_hist) * 6  # Convert to 0-180 range
    return float(dominant_hue * 2)  # Convert to 0-360
```

---

### 3.2 Mean Saturation

**Formula:**
$$
\bar{S} = \frac{1}{N} \sum_{i=1}^{N} S_i
$$

**Where:**
- $S_i$ = saturation value at pixel $i$ (0-255)

**Output Range:** 0-255

**Scientific Basis:**  
Saturation represents color purity. In biofield imaging:
- High saturation = distinct energetic qualities
- Low saturation = neutral/diffuse energy

**Consciousness Interpretation:**  
- **>180:** Strong, defined energetic states
- **100-180:** Moderate definition
- **<100:** Subtle, diffuse, or transitional states

---

### 3.3 Color Entropy

**Formula (Shannon Entropy):**
$$
H_{color} = -\sum_{j=1}^{B} p_j \log_2(p_j)
$$

**Where:**
- $p_j$ = probability of color bin $j$ in 3D HSV histogram
- $B$ = total number of bins (30 × 32 × 32 = 30,720)

**Output Range:** 0-15 bits (typically 3-8 bits)

**Scientific Basis:**  
Measures diversity and unpredictability of color distribution. Higher entropy = greater spectral complexity.

**Consciousness Interpretation:**  
- **6-8 bits:** High diversity, complex energetic state
- **4-6 bits:** Moderate complexity, balanced
- **<4 bits:** Simple, homogeneous, possibly blocked

**Implementation:**
```python
from scipy.stats import entropy

def calculate_color_entropy(image_rgb: np.ndarray, 
                            mask: Optional[np.ndarray] = None) -> float:
    hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
    
    if mask is not None:
        hist = cv2.calcHist(
            [hsv], [0, 1, 2], mask,
            [30, 32, 32], [0, 180, 0, 256, 0, 256]
        )
    else:
        hist = cv2.calcHist(
            [hsv], [0, 1, 2], None,
            [30, 32, 32], [0, 180, 0, 256, 0, 256]
        )
    
    hist = hist.flatten()
    hist = hist / hist.sum() if hist.sum() > 0 else hist
    hist = hist[hist > 0]  # Remove zeros for entropy calculation
    
    return float(entropy(hist, base=2)) if len(hist) > 0 else 0.0
```

---

### 3.4 Color Coherence

**Formula (Connected Components Method):**
$$
C_{color} = \frac{\sum_h \sum_c A_c \cdot \mathbb{1}(A_c > T)}{N}
$$

**Where:**
- $h$ = hue band (quantized to 30° intervals)
- $c$ = connected component index within hue band $h$
- $A_c$ = area of component $c$ (pixels)
- $T$ = threshold (25 pixels minimum)
- $N$ = total pixels

**Output Range:** 0.0-1.0

**Scientific Basis:**  
Measures spatial cohesion of similar colors. High coherence indicates organized, structured energy patterns.

**Consciousness Interpretation:**  
- **>0.7:** Highly organized, coherent state
- **0.4-0.7:** Moderate organization
- **<0.4:** Fragmented, transitional, or chaotic

**Implementation:**
```python
def calculate_color_coherence(image_rgb: np.ndarray, 
                              mask: Optional[np.ndarray] = None,
                              threshold: int = 25) -> float:
    hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
    hue = hsv[:, :, 0]
    
    # Quantize hue to major color bands (every 30 degrees)
    hue_quantized = (hue // 30) * 30
    
    total_pixels = image_rgb.shape[0] * image_rgb.shape[1]
    if mask is not None:
        total_pixels = np.sum(mask > 0)
    
    if total_pixels == 0:
        return 0.0
    
    coherent_pixels = 0
    
    for hue_val in range(0, 180, 30):
        band_mask = (hue_quantized == hue_val).astype(np.uint8)
        
        if mask is not None:
            band_mask = cv2.bitwise_and(band_mask, band_mask, mask=mask)
        
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(band_mask)
        
        for i in range(1, num_labels):
            area = stats[i, cv2.CC_STAT_AREA]
            if area > threshold:
                coherent_pixels += area
    
    return float(coherent_pixels / total_pixels)
```

---

### 3.5 Color Symmetry

**Formula (Histogram Correlation):**
$$
C_{color\_sym} = corr(H_{left}, H_{right})
$$

**Where:**
- $H_{left}$ = 2D hue-saturation histogram of left half
- $H_{right}$ = 2D hue-saturation histogram of right half (flipped)
- $corr()$ = Pearson correlation coefficient

**Output Range:** -1.0 to 1.0 (typically 0.0-1.0 for biofield images)

**Scientific Basis:**  
Measures bilateral balance of color distribution, reflecting left-right energetic symmetry.

**Consciousness Interpretation:**  
- **>0.8:** High bilateral integration
- **0.5-0.8:** Moderate balance
- **<0.5:** Asymmetric, potential imbalance

---

## 4. Geometric & Contour Metrics

### 4.1 Contour Area

**Formula:**
$$
A = \frac{1}{2} \left| \sum_{i=0}^{n-1} (x_i y_{i+1} - x_{i+1} y_i) \right|
$$

**Where:**
- $(x_i, y_i)$ = contour point coordinates
- $n$ = number of contour points

**Output Range:** 0 to image area (pixels²)

**Scientific Basis:**  
Measures spatial extent of biofield. Related to energy field size and penetration distance.

---

### 4.2 Contour Perimeter

**Formula:**
$$
P = \sum_{i=0}^{n-1} \sqrt{(x_{i+1} - x_i)^2 + (y_{i+1} - y_i)^2}
$$

**Output Range:** 0 to theoretical maximum (pixels)

**Scientific Basis:**  
Boundary length of biofield emission. Used in shape complexity calculations.

---

### 4.3 Entropy Coefficient (EC)

**Formula:**
$$
EC = \frac{P}{2\sqrt{\pi A}}
$$

**Output Range:**  
- 1.0 = perfect circle
- >1.0 = increasing irregularity
- Typical: 1.0-2.5

**Scientific Basis:**  
Measures deviation from circular shape. From Korotkov's GDV methodology. Higher EC indicates:
- Irregular energy distribution
- Possible energy blocks or imbalances
- Complex interaction with environment

**Consciousness Interpretation:**  
- **1.0-1.3:** Smooth, integrated energy flow
- **1.3-1.8:** Moderate irregularity, active processing
- **>1.8:** Highly irregular, possible fragmentation

**Implementation:**
```python
def calculate_entropy_coefficient(perimeter: float, area: float) -> float:
    if area <= 0:
        return 0.0
    return perimeter / (2 * np.sqrt(np.pi * area))
```

---

### 4.4 Form Coefficient (FC)

**Formula:**
$$
FC = \frac{P^2}{4\pi A}
$$

**Output Range:**  
- 1.0 = perfect circle
- >1.0 = increasing complexity
- Typical: 1.0-6.0

**Scientific Basis:**  
Alternative shape complexity measure. More sensitive to small perturbations than EC.

**Relationship to EC:**
$$
FC = EC^2
$$

**Consciousness Interpretation:**  
- **1.0-1.7:** Smooth, harmonious
- **1.7-3.0:** Complex, dynamic
- **>3.0:** Highly complex or fragmented

---

### 4.5 Equivalent Radius

**Formula:**
$$
r_{eq} = \sqrt{\frac{A}{\pi}}
$$

**Output Range:** 0 to image diagonal (pixels)

**Scientific Basis:**  
Radius of circle with equivalent area. Normalizes size for comparison.

---

### 4.6 Ellipse Fit Parameters

**Major Axis ($a$), Minor Axis ($b$), Angle ($\theta$):**

Fitted using least-squares ellipse fitting to contour points:

$$
\frac{(x\cos\theta + y\sin\theta)^2}{a^2} + \frac{(-x\sin\theta + y\cos\theta)^2}{b^2} = 1
$$

**Eccentricity:**
$$
e = \sqrt{1 - \frac{b^2}{a^2}}
$$

**Output Ranges:**
- $a, b$: 0 to image diagonal
- $\theta$: -180° to 180°
- $e$: 0.0 (circle) to 1.0 (line)

**Scientific Basis:**  
Ellipse parameters describe overall shape orientation and elongation.

**Consciousness Interpretation:**  
- **Low eccentricity (<0.3):** Centered, balanced
- **Medium eccentricity (0.3-0.7):** Directional focus
- **High eccentricity (>0.7):** Strong polarity or imbalance

---

### 4.7 Solidity

**Formula:**
$$
S = \frac{A_{contour}}{A_{convex\_hull}}
$$

**Output Range:** 0.0-1.0

**Scientific Basis:**  
Measures how "filled in" the shape is. Lower solidity indicates concavities or protrusions.

**Consciousness Interpretation:**  
- **>0.9:** Complete, integrated
- **0.7-0.9:** Minor irregularities
- **<0.7:** Fragmented, incomplete energy field

---

### 4.8 Contour Complexity (Fractal-like)

**Formula (Multi-scale Approximation):**
$$
C_{contour} = \frac{1}{K} \sum_{k=1}^{K} N_k(\epsilon_k)
$$

**Where:**
- $\epsilon_k$ = Douglas-Peucker epsilon at scale $k$
- $N_k$ = number of vertices after approximation at scale $k$
- $K$ = number of scales tested

**Scales used:** $\epsilon \in \{0.001P, 0.01P, 0.05P, 0.1P\}$

**Output Range:** 0-100+ (normalized by dividing by 10)

**Scientific Basis:**  
Estimates complexity by counting how many line segments are needed to approximate contour at different scales.

**Consciousness Interpretation:**  
- **<5:** Simple, regular boundary
- **5-15:** Moderate complexity
- **>15:** Highly complex, fractal-like boundary

---

## 5. Nonlinear Dynamics Metrics

### 5.1 Fractal Dimension (Box-Counting)

**Formula:**
$$
D = -\lim_{\epsilon \to 0} \frac{\log N(\epsilon)}{\log \epsilon}
$$

**Where:**
- $N(\epsilon)$ = number of boxes of size $\epsilon$ needed to cover the pattern
- Calculated via linear regression: $\log N = -D \cdot \log \epsilon + const$

**Implementation Algorithm:**
1. Threshold image to binary
2. For each box size $s \in \{2, 4, 8, ..., 64\}$:
   - Count boxes containing at least one pixel
3. Perform linear regression on $\log_2(s)$ vs $\log_2(count)$
4. Slope is negative of fractal dimension

**Output Range:** 1.0-2.0  
- 1.0 = line (1D)
- 1.5 = typical fractal
- 2.0 = filled plane (2D)

**Scientific Basis:**  
Measures self-similarity and complexity of spatial patterns. Derived from chaos theory and fractal geometry.

**Consciousness Interpretation:**  
- **1.0-1.2:** Simple, linear patterns
- **1.2-1.5:** Fractal, self-organizing complexity
- **1.5-1.8:** High complexity, rich information
- **>1.8:** Maximum complexity, approaching random

**Implementation:**
```python
def box_counting_dimension(binary_image: np.ndarray) -> float:
    def count_boxes(img, box_size):
        h, w = img.shape
        count = 0
        for y in range(0, h, box_size):
            for x in range(0, w, box_size):
                y_end = min(y + box_size, h)
                x_end = min(x + box_size, w)
                if img[y:y_end, x:x_end].any():
                    count += 1
        return count
    
    threshold = np.mean(binary_image)
    binary = (binary_image > threshold).astype(np.uint8)
    
    if not binary.any():
        return 1.0
    
    min_dim = min(binary.shape)
    max_box = min(64, min_dim // 2)
    min_box = 2
    
    box_sizes = []
    counts = []
    
    size = max_box
    while size >= min_box:
        count = count_boxes(binary, size)
        if count > 0:
            box_sizes.append(size)
            counts.append(count)
        size //= 2
    
    if len(box_sizes) < 2:
        return 1.0
    
    log_sizes = np.log(box_sizes)
    log_counts = np.log(counts)
    
    slope, _ = np.polyfit(log_sizes, log_counts, 1)
    
    return max(1.0, min(2.0, -slope))
```

---

### 5.2 Hurst Exponent (R/S Analysis)

**Formula:**
$$
H = \frac{\log(R/S)}{\log(n)}
$$

**Where:**
- $R$ = range of cumulative deviations from mean
- $S$ = standard deviation
- $n$ = time scale (segment length)

**Detailed Algorithm:**
1. Convert image to 1D time series (row-scan)
2. For each scale $k \in \{10, 20, ..., 100\}$:
   - Divide series into segments of length $k$
   - For each segment:
     - Calculate mean $\mu$
     - Compute cumulative deviation: $Y(t) = \sum_{i=1}^{t} (x_i - \mu)$
     - Calculate range: $R = \max Y - \min Y$
     - Calculate standard deviation: $S$
     - Compute $R/S$ ratio
   - Average $R/S$ across segments
3. Linear regression on $\log(k)$ vs $\log(R/S)$ gives $H$

**Output Range:** 0.0-1.0  
- $H < 0.5$: Anti-persistent (mean-reverting)
- $H = 0.5$: Random walk (white noise)
- $H > 0.5$: Persistent (trend-following)

**Scientific Basis:**  
Quantifies long-range correlations in time series. From hydrology (Hurst, 1951), applied to biofield temporal dynamics.

**Consciousness Interpretation:**  
- **0.5-0.6:** Slightly persistent, natural variation
- **0.6-0.8:** Persistent, organized, coherent
- **>0.8:** Highly persistent, may indicate rigidity
- **<0.5:** Anti-persistent, reactive, unstable

**Implementation:**
```python
def hurst_exponent(series: np.ndarray, max_k: int = 100) -> float:
    n = len(series)
    if n < 20:
        return 0.5
    
    max_k = min(max_k, n // 4)
    scales = []
    rs_values = []
    
    for k in range(10, max_k, 10):
        rs_list = []
        for start in range(0, n - k, k):
            segment = series[start:start + k]
            if len(segment) < k:
                continue
            
            mean = np.mean(segment)
            std = np.std(segment)
            if std == 0:
                continue
            
            cumsum = np.cumsum(segment - mean)
            r = np.max(cumsum) - np.min(cumsum)
            
            rs_list.append(r / std)
        
        if rs_list:
            scales.append(k)
            rs_values.append(np.mean(rs_list))
    
    if len(scales) < 2:
        return 0.5
    
    log_scales = np.log(scales)
    log_rs = np.log(rs_values)
    
    slope, _ = np.polyfit(log_scales, log_rs, 1)
    
    return max(0.0, min(1.0, slope))
```

---

### 5.3 Lyapunov Exponent

**Formula (Simplified Rosenstein Method):**
$$
\lambda = \frac{1}{t} \log \frac{d(t)}{d(0)}
$$

**Where:**
- $d(0)$ = initial distance between nearest neighbors in phase space
- $d(t)$ = distance after time $t$

**Detailed Algorithm:**
1. Create delay embedding: $\mathbf{x}_i = [s_i, s_{i+\tau}, ..., s_{i+(m-1)\tau}]$
   - $m$ = embedding dimension (default: 10)
   - $\tau$ = time delay (default: 1)
2. For sample points, find nearest neighbor (excluding temporal neighbors)
3. Track divergence of trajectories over time
4. Average logarithmic divergence rate = $\lambda$

**Output Range:** -0.5 to +0.5 (typical)  
- $\lambda > 0$: Chaotic, sensitive to initial conditions
- $\lambda = 0$: Edge of chaos, critical state
- $\lambda < 0$: Stable, convergent

**Scientific Basis:**  
Measures sensitivity to initial conditions. Positive Lyapunov exponent is hallmark of chaos.

**Consciousness Interpretation:**  
- **-0.2 to 0:** Stable, regulated, homeostatic
- **0 to +0.1:** Edge of chaos, optimal complexity
- **>+0.1:** Chaotic, dysregulated

**Implementation:**
```python
def lyapunov_exponent(series: np.ndarray, tau: int = 1, m: int = 10) -> float:
    n = len(series)
    if n < 50:
        return 0.0
    
    # Create delay embedding
    embedded = np.zeros((n - (m - 1) * tau, m))
    for i in range(m):
        embedded[:, i] = series[i * tau:n - (m - 1 - i) * tau]
    
    n_points = embedded.shape[0]
    if n_points < 20:
        return 0.0
    
    divergence = []
    
    for i in range(min(100, n_points - 10)):
        # Find nearest neighbor
        distances = np.linalg.norm(embedded - embedded[i], axis=1)
        distances[max(0, i - 5):min(n_points, i + 5)] = np.inf
        
        j = np.argmin(distances)
        if distances[j] == np.inf:
            continue
        
        # Track divergence
        for k in range(1, min(10, n_points - max(i, j))):
            d = np.linalg.norm(embedded[i + k] - embedded[j + k])
            if d > 0:
                divergence.append((k, np.log(d / (distances[j] + 1e-10))))
    
    if len(divergence) < 10:
        return 0.0
    
    steps = np.array([d[0] for d in divergence])
    divs = np.array([d[1] for d in divergence])
    
    if len(np.unique(steps)) < 2:
        return 0.0
    
    slope, _ = np.polyfit(steps, divs, 1)
    
    return slope
```

---

### 5.4 Correlation Dimension

**Formula (Grassberger-Procaccia):**
$$
D_2 = \lim_{r \to 0} \frac{\log C(r)}{\log r}
$$

**Where:**
$$
C(r) = \frac{1}{N^2} \sum_{i,j} \Theta(r - |\mathbf{x}_i - \mathbf{x}_j|)
$$

- $C(r)$ = correlation sum (fraction of point pairs within distance $r$)
- $\Theta$ = Heaviside step function

**Output Range:** 1.0-10.0 (typical: 2.0-5.0)

**Scientific Basis:**  
Measures dimensionality of the attractor in phase space. Related to information dimension.

**Consciousness Interpretation:**  
- **2-3:** Low-dimensional, simple dynamics
- **3-5:** Medium complexity, organized chaos
- **>5:** High-dimensional, complex dynamics

---

### 5.5 Detrended Fluctuation Analysis (DFA) Alpha

**Formula:**
$$
F(s) \sim s^{\alpha}
$$

**Where:**
- $F(s)$ = fluctuation at scale $s$
- $\alpha$ = scaling exponent (DFA alpha)

**Algorithm:**
1. Integrate time series: $Y(k) = \sum_{i=1}^{k} [x_i - \bar{x}]$
2. Divide into segments of size $s$
3. For each segment, fit linear trend and calculate RMS deviation
4. Average over all segments to get $F(s)$
5. Repeat for multiple scales $s$
6. Linear regression on $\log(s)$ vs $\log F(s)$ gives $\alpha$

**Output Range:** 0.0-2.0  
- $\alpha = 0.5$: White noise (uncorrelated)
- $\alpha = 1.0$: Pink noise (1/f), optimal
- $\alpha = 1.5$: Brownian noise (integrated)

**Scientific Basis:**  
Quantifies long-range correlations in non-stationary time series. Robust to trends.

**Consciousness Interpretation:**  
- **0.5-0.7:** Random, unstructured
- **0.7-1.0:** Optimal complexity, healthy regulation
- **1.0-1.3:** Persistent correlations, coherence
- **>1.3:** Over-regulated, rigid

**Implementation:**
```python
def detrended_fluctuation_analysis(series: np.ndarray) -> float:
    n = len(series)
    if n < 100:
        return 1.0
    
    # Integrate
    y = np.cumsum(series - np.mean(series))
    
    scales = []
    fluctuations = []
    
    for scale in [16, 32, 64, 128, 256]:
        if scale >= n // 4:
            continue
        
        n_segments = n // scale
        if n_segments < 4:
            continue
        
        f_sum = 0
        for i in range(n_segments):
            segment = y[i * scale:(i + 1) * scale]
            
            # Fit linear trend
            x = np.arange(scale)
            coeffs = np.polyfit(x, segment, 1)
            trend = np.polyval(coeffs, x)
            
            # Calculate fluctuation
            f_sum += np.mean((segment - trend) ** 2)
        
        f = np.sqrt(f_sum / n_segments)
        scales.append(scale)
        fluctuations.append(f)
    
    if len(scales) < 2:
        return 1.0
    
    log_scales = np.log(scales)
    log_fluct = np.log(fluctuations)
    
    slope, _ = np.polyfit(log_scales, log_fluct, 1)
    
    return max(0.0, min(2.0, slope))
```

---

### 5.6 Sample Entropy

**Formula:**
$$
SampEn(m, r) = -\ln \frac{A}{B}
$$

**Where:**
- $m$ = template length
- $r$ = tolerance (typically $0.2 \times \sigma$)
- $A$ = number of template matches of length $m+1$
- $B$ = number of template matches of length $m$

**Output Range:** 0-3 (typical: 0.5-2.0)

**Scientific Basis:**  
Measures regularity and unpredictability. Lower values = more regular.

**Consciousness Interpretation:**  
- **<0.5:** Highly regular, possibly rigid
- **0.5-1.5:** Balanced complexity
- **>1.5:** High irregularity, chaotic

---

## 6. Symmetry Metrics

### 6.1 SSIM-Based Symmetry

**Formula (Structural Similarity Index):**
$$
SSIM(x, y) = \frac{(2\mu_x\mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}
$$

**Where:**
- $\mu_x, \mu_y$ = mean intensities of left and right halves
- $\sigma_x, \sigma_y$ = standard deviations
- $\sigma_{xy}$ = covariance
- $C_1, C_2$ = stability constants

**Normalization for symmetry score:**
$$
S_{SSIM} = \frac{SSIM + 1}{2}
$$

**Output Range:** 0.0-1.0

**Scientific Basis:**  
SSIM considers luminance, contrast, and structure. More perceptually aligned than MSE.

**Consciousness Interpretation:**  
- **>0.85:** Excellent bilateral integration
- **0.70-0.85:** Good symmetry
- **0.50-0.70:** Moderate asymmetry
- **<0.50:** Significant imbalance

**Implementation:**
```python
from skimage.metrics import structural_similarity as ssim

def ssim_symmetry(left: np.ndarray, right: np.ndarray) -> float:
    if left.shape != right.shape or left.size == 0:
        return 0.0
    
    if min(left.shape) < 7:
        return pixel_symmetry(left, right)
    
    try:
        score = ssim(left, right, data_range=255)
        return max(0.0, min(1.0, (score + 1) / 2))
    except:
        return 0.0
```

---

### 6.2 Correlation Symmetry

**Formula (Normalized Cross-Correlation):**
$$
C_{sym} = \frac{\sum_i (L_i - \bar{L})(R_i - \bar{R})}{\sqrt{\sum_i (L_i - \bar{L})^2} \sqrt{\sum_i (R_i - \bar{R})^2}}
$$

**Normalization:**
$$
S_{corr} = \frac{C_{sym} + 1}{2}
$$

**Output Range:** 0.0-1.0

---

### 6.3 Histogram Symmetry

**Formula (Histogram Correlation):**
$$
S_{hist} = \frac{\sum_b H_L(b) \cdot H_R(b)}{\sqrt{\sum_b H_L(b)^2} \sqrt{\sum_b H_R(b)^2}}
$$

**Where:**
- $H_L(b), H_R(b)$ = normalized histograms of left and right halves
- $b$ = bin index (0-255)

**Output Range:** 0.0-1.0

**Scientific Basis:**  
Compares intensity distributions independent of spatial structure.

---

### 6.4 Pixel Symmetry

**Formula (Normalized MSE Inverse):**
$$
S_{pixel} = 1 - \frac{MSE}{255^2}
$$

**Where:**
$$
MSE = \frac{1}{N} \sum_{i=1}^{N} (L_i - R_i)^2
$$

**Output Range:** 0.0-1.0

---

### 6.5 Contour Balance

**Formula:**
$$
B_{contour} = 1 - \frac{|A_L - A_R|}{A_L + A_R}
$$

**Where:**
- $A_L$ = contour area in left half
- $A_R$ = contour area in right half

**Output Range:** 0.0-1.0

**Consciousness Interpretation:**  
- **>0.9:** Balanced left-right energy distribution
- **0.7-0.9:** Minor imbalance
- **<0.7:** Significant imbalance, possible lateralization

---

### 6.6 Overall Body Symmetry (Composite)

**Formula:**
$$
S_{body} = 0.35 \cdot S_{SSIM} + 0.25 \cdot S_{corr} + 0.20 \cdot S_{hist} + 0.20 \cdot S_{pixel}
$$

**Output Range:** 0.0-1.0

**Interpretation Scale:**
- **0.81-1.00:** Excellent symmetry
- **0.61-0.80:** Good symmetry
- **0.41-0.60:** Moderate asymmetry
- **0.00-0.40:** Significant asymmetry

---

## 7. Metric Categories & Consciousness Mapping

### 7.1 Spatial Metrics (Physical)

**Metrics:** Area, Perimeter, EC, FC, Solidity, Bounding Box  
**Consciousness Level:** Physical/Etheric body  
**Interpretation:** Spatial extent and boundary definition reflect:
- Physical vitality
- Energy field penetration
- Boundary integrity vs. porosity

---

### 7.2 Intensity Metrics (Vital Energy)

**Metrics:** Average Intensity, LQD, Integrated Energy  
**Consciousness Level:** Vital/Pranic body  
**Interpretation:** Photon emission intensity reflects:
- Metabolic activity
- Chi/prana levels
- Vitality and life force

---

### 7.3 Complexity Metrics (Mental/Informational)

**Metrics:** Fractal Dimension, Color Entropy, Correlation Dimension  
**Consciousness Level:** Mental body  
**Interpretation:** Information content and structural complexity reflect:
- Mental activity and processing
- Cognitive complexity
- Information flow

---

### 7.4 Coherence Metrics (Emotional/Integrative)

**Metrics:** Hurst Exponent, Color Coherence, Pattern Regularity  
**Consciousness Level:** Emotional/Astral body  
**Interpretation:** Pattern organization reflects:
- Emotional coherence
- Integration vs. fragmentation
- Harmony of system components

---

### 7.5 Regulation Metrics (Causal/Homeostatic)

**Metrics:** Lyapunov Exponent, DFA Alpha, Temporal Variance  
**Consciousness Level:** Causal body / Higher Self regulation  
**Interpretation:** Dynamic stability reflects:
- Homeostatic balance
- Self-regulation capacity
- Resilience and adaptability

---

### 7.6 Symmetry Metrics (Integration/Wholeness)

**Metrics:** SSIM, Correlation, Body Symmetry  
**Consciousness Level:** Integrated self / Unity consciousness  
**Interpretation:** Bilateral balance reflects:
- Left-right brain integration
- Masculine-feminine balance
- Wholeness and completeness

---

### 7.7 Color Metrics (Chakric/Frequency)

**Metrics:** Dominant Hue, Saturation, Color Entropy, Color Balance  
**Consciousness Level:** Chakra system / Frequency body  
**Interpretation:** Spectral distribution maps to:
- Chakra activation patterns
- Energetic frequencies
- Emotional-spiritual qualities

---

## 8. Implementation Notes

### 8.1 Performance Considerations

**Optimization Strategies:**
1. **ROI Masking:** Apply mask early to reduce computation
2. **Downsampling:** For high-resolution images, downsample for nonlinear metrics
3. **Parallel Processing:** Many metrics are independent and parallelizable
4. **Caching:** Cache intermediate results (histograms, embeddings)

**Typical Computation Times (640×480 image):**
- Basic metrics: <10ms
- Color metrics: ~20ms
- Geometric metrics: ~30ms
- Nonlinear metrics: 100-500ms (most expensive)
- Symmetry metrics: ~50ms

---

### 8.2 Edge Cases

**Empty or Near-Empty Images:**
- Return zero/default values
- Set flags indicating insufficient data

**High Noise:**
- Increase threshold for LQD
- Use median filtering for contour detection

**Extreme Values:**
- Clamp outputs to expected ranges
- Log warnings for investigation

---

### 8.3 Validation

**Synthetic Test Cases:**
1. **Perfect Circle:** EC=1.0, FC=1.0, FD≈1.0
2. **White Noise:** Hurst≈0.5, high entropy
3. **1/f Noise:** DFA alpha≈1.0
4. **Symmetric Pattern:** All symmetry metrics >0.9

**Real-World Validation:**
- Compare with published GDV/Bio-Well studies
- Clinical correlation with known conditions
- Test-retest reliability

---

### 8.4 Future Enhancements

**Potential Additions:**
1. **Wavelet-based metrics:** Multi-scale frequency analysis
2. **Topological data analysis:** Persistent homology
3. **Network metrics:** Graph-theoretic biofield structure
4. **Temporal metrics:** Cross-session evolution tracking
5. **Multi-modal integration:** Combine with HRV, EEG, etc.

---

## References

1. Korotkov, K. (2014). *Energy Fields Electrophotonic Analysis in Humans and Nature*. Amazon.
2. Hurst, H. E. (1951). Long-term storage capacity of reservoirs. *Transactions of the American Society of Civil Engineers*.
3. Grassberger, P., & Procaccia, I. (1983). Measuring the strangeness of strange attractors. *Physica D*.
4. Peng, C. K., et al. (1994). Mosaic organization of DNA nucleotides. *Physical Review E*.
5. Wang, Z., et al. (2004). Image quality assessment: from error visibility to structural similarity. *IEEE Transactions on Image Processing*.

---

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Maintainer:** Tryambakam Noesis Team  
**Status:** Production-Ready

---

*This document was automatically extracted from the BV-PIP Python implementation codebase. All formulas and algorithms represent the actual production code.*
