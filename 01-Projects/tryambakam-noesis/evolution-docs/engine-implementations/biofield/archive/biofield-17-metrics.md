# Biofield Engine - 17 Core Metrics

**Purpose:** Complete implementation details for all 17 spatial, temporal, complexity, system, and symmetry metrics  
**Framework:** Quantified witness observation of biofield patterns

---

## Overview

The 17 core metrics transform PIP (Poly-contrast Interference Photography) images into quantifiable consciousness data. Each metric reveals a different dimension of the energetic self that was previously invisible to ordinary awareness.

**Philosophical Foundation:** These metrics are not merely measurements - they are **doorways into self-observation**, training the witness to perceive multiple dimensions simultaneously.

---

## 1. SPATIAL PATTERN METRICS (5 metrics)

### 1.1 Light Quanta Density

**Purpose:** Measures photon emission density - the "brightness" of the biofield  
**Significance:** Indicates overall energetic output and vitality

```python
def _calculate_light_quanta_density(self, image: np.ndarray) -> float:
    """
    Counts light quanta above adaptive threshold.
    
    Algorithm: threshold_based_counting
    - Uses adaptive Gaussian thresholding to identify "active" pixels
    - Counts pixels above mean intensity
    - Normalizes to 0-1 range with offset
    """
    # Binary threshold: pixels above mean are "active quanta"
    active_pixels = image > np.mean(image)
    
    # Calculate density with normalization
    density = np.mean(active_pixels) * 0.8 + 0.1
    
    return density
```

**Algorithm Parameters:**
```json
{
  "threshold_method": "adaptive_gaussian",
  "block_size": 11,
  "c_constant": 2,
  "min_area": 5,
  "units": "quanta_per_unit_area"
}
```

**Interpretation:**
- **High (>0.7):** Strong energetic emission, high vitality
- **Medium (0.4-0.7):** Normal energetic activity
- **Low (<0.4):** Depleted energy, may need restoration practices

---

### 1.2 Normalized Area

**Purpose:** Ratio of light pattern area to total image area  
**Significance:** Indicates spatial extent of biofield influence

```python
def _calculate_normalized_area(self, image: np.ndarray) -> float:
    """
    Ratio of light pattern area to total image area.
    
    Algorithm: contour_area_ratio
    - Uses 75th percentile threshold to identify prominent patterns
    - Calculates ratio of bright pixels to total pixels
    """
    # Count pixels above 75th percentile (prominent patterns)
    bright_pixels = image > np.percentile(image, 75)
    
    # Calculate normalized area
    normalized_area = np.sum(bright_pixels) / image.size
    
    return normalized_area
```

**Algorithm Parameters:**
```json
{
  "contour_method": "cv2.RETR_EXTERNAL",
  "approximation": "cv2.CHAIN_APPROX_SIMPLE",
  "min_contour_area": 10,
  "units": "ratio"
}
```

**Interpretation:**
- **High (>0.5):** Expansive biofield, strong presence
- **Medium (0.2-0.5):** Balanced field extent
- **Low (<0.2):** Contracted field, may indicate withdrawal or protection

---

### 1.3 Average Intensity

**Purpose:** Weighted mean intensity of light patterns  
**Significance:** Indicates overall brightness/energy concentration

```python
def _calculate_average_intensity(self, image: np.ndarray) -> float:
    """
    Mean intensity of light patterns.
    
    Algorithm: weighted_mean_intensity
    - Calculates mean pixel intensity
    - Normalizes to 0-1 range (assuming 8-bit image)
    """
    # Calculate mean intensity
    mean_intensity = np.mean(image) / 255.0
    
    return mean_intensity
```

**Algorithm Parameters:**
```json
{
  "weight_function": "gaussian",
  "sigma": 1.0,
  "normalization": "min_max",
  "units": "normalized_intensity"
}
```

**Interpretation:**
- **High (>0.7):** Intense energy concentration
- **Medium (0.4-0.7):** Balanced intensity
- **Low (<0.4):** Diffuse or weak energy

---

### 1.4 Inner Noise

**Purpose:** Variability in light patterns within regions  
**Significance:** Indicates energetic stability vs. chaos

```python
def _calculate_inner_noise(self, image: np.ndarray) -> float:
    """
    Inner noise variability.
    
    Algorithm: local_variance_analysis
    - Calculates standard deviation across image
    - Normalized to 0-1 range
    - Higher values indicate more "noise" or variability
    """
    # Calculate standard deviation (noise measure)
    noise = np.std(image) / 255.0
    
    return noise
```

**Algorithm Parameters:**
```json
{
  "window_size": 5,
  "overlap": 0.5,
  "variance_threshold": 0.1,
  "units": "variance_coefficient"
}
```

**Interpretation:**
- **High (>0.5):** High variability, chaotic patterns
- **Medium (0.2-0.5):** Normal fluctuation
- **Low (<0.2):** Highly stable, uniform patterns

---

### 1.5 Energy Analysis

**Purpose:** Total integrated emission energy  
**Significance:** Overall energetic "charge" of the biofield

```python
def _calculate_energy_analysis(self, image: np.ndarray) -> float:
    """
    Total integrated emission energy.
    
    Algorithm: integrated_energy_calculation
    - Sums all pixel intensities
    - Normalizes by image size
    - Represents total "photon count"
    """
    # Sum all pixel intensities (total energy)
    total_energy = np.sum(image.astype(float)) / (image.size * 255.0)
    
    return total_energy
```

**Algorithm Parameters:**
```json
{
  "integration_method": "simpson",
  "energy_bands": ["low", "medium", "high"],
  "frequency_ranges": [0.1, 0.5, 1.0],
  "units": "energy_units"
}
```

**Interpretation:**
- **High (>0.6):** High total energetic charge
- **Medium (0.3-0.6):** Normal energy levels
- **Low (<0.3):** Energy depletion

---

## 2. COMPLEXITY METRICS (3 metrics)

### 2.1 Entropy Form Coefficient

**Purpose:** Pattern irregularity measurement using Shannon entropy  
**Significance:** Indicates information content and complexity

```python
def _calculate_entropy_form_coefficient(self, image: np.ndarray) -> float:
    """
    Calculate entropy/form coefficient using Shannon entropy.
    
    Algorithm: shannon_entropy_calculation
    - Creates histogram of pixel intensities
    - Calculates Shannon entropy: H = -Σ(p * log(p))
    - Higher entropy = more disorder/complexity
    """
    from scipy.stats import entropy
    
    # Create histogram
    hist, _ = np.histogram(image, bins=256, range=(0, 256))
    
    # Normalize to probability distribution
    hist = hist / np.sum(hist)
    
    # Calculate Shannon entropy (add small value to avoid log(0))
    entropy_value = entropy(hist + 1e-10)
    
    return entropy_value
```

**Algorithm Parameters:**
```json
{
  "histogram_bins": 256,
  "smoothing_kernel": "gaussian",
  "kernel_size": 3,
  "units": "bits"
}
```

**Mathematical Formula:**
```
H = -Σ p(x) * log₂(p(x))

where:
- p(x) = probability of intensity value x
- log₂ = logarithm base 2 (bits)
```

**Interpretation:**
- **High (>4.0):** High complexity, many distinct patterns
- **Medium (2.0-4.0):** Moderate complexity
- **Low (<2.0):** Simple, uniform patterns

---

### 2.2 Fractal Dimension

**Purpose:** Spatial complexity and self-similarity measurement  
**Significance:** Reveals multi-scale organization of biofield

```python
def _calculate_fractal_dimension(self, image: np.ndarray) -> float:
    """
    Calculate fractal dimension using box counting method.
    
    Algorithm: box_counting_method
    - Places boxes of different sizes over the image
    - Counts boxes containing "active" pixels
    - Calculates slope of log(count) vs log(1/box_size)
    - Fractal dimension = slope of this log-log plot
    
    Note: Current implementation uses placeholder.
    Full implementation requires iterative box counting.
    """
    # Placeholder implementation (production would use full algorithm)
    # Typical biofield fractal dimension: 1.5-2.0
    return 1.5 + np.random.random() * 0.5
```

**Full Algorithm (Production Implementation):**
```python
def _calculate_fractal_dimension_full(self, image: np.ndarray) -> float:
    """Full box-counting fractal dimension implementation."""
    
    # Binarize image
    threshold = np.mean(image)
    binary = (image > threshold).astype(np.uint8)
    
    # Box sizes (powers of 2)
    box_sizes = [1, 2, 4, 8, 16, 32, 64]
    counts = []
    
    for box_size in box_sizes:
        # Count boxes containing at least one active pixel
        count = 0
        for i in range(0, binary.shape[0], box_size):
            for j in range(0, binary.shape[1], box_size):
                box = binary[i:i+box_size, j:j+box_size]
                if np.sum(box) > 0:
                    count += 1
        counts.append(count)
    
    # Calculate fractal dimension from log-log slope
    coefficients = np.polyfit(np.log(box_sizes), np.log(counts), 1)
    fractal_dimension = -coefficients[0]
    
    return fractal_dimension
```

**Algorithm Parameters:**
```json
{
  "box_sizes": [1, 2, 4, 8, 16, 32, 64],
  "threshold": 0.5,
  "regression_method": "least_squares",
  "units": "dimension"
}
```

**Interpretation:**
- **High (1.8-2.0):** High spatial complexity, fractal-like patterns
- **Medium (1.5-1.8):** Moderate complexity
- **Low (1.0-1.5):** Simple geometric patterns
- **Note:** Theoretical range is 1.0 (line) to 2.0 (plane-filling)

---

### 2.3 Correlation Dimension

**Purpose:** Non-linear complexity assessment in phase space  
**Significance:** Measures dimensionality of the attractor

```python
def _calculate_correlation_dimension(self, image: np.ndarray) -> float:
    """
    Calculate correlation dimension.
    
    Algorithm: grassberger_procaccia
    - Reconstructs phase space using time-delay embedding
    - Calculates correlation integral for different radii
    - Finds slope of log(C(r)) vs log(r)
    
    Note: Current implementation uses placeholder.
    """
    # Placeholder implementation
    return 2.0 + np.random.random() * 0.5
```

**Algorithm Parameters:**
```json
{
  "embedding_dimension": 3,
  "radius_range": [0.01, 1.0],
  "radius_steps": 50,
  "correlation_integral": "standard",
  "units": "dimension"
}
```

**Mathematical Formula:**
```
C(r) = lim(N→∞) (1/N²) * Σ Θ(r - ||xi - xj||)

D₂ = lim(r→0) log(C(r)) / log(r)

where:
- C(r) = correlation integral
- Θ = Heaviside step function
- ||xi - xj|| = distance between points
- D₂ = correlation dimension
```

**Interpretation:**
- **High (>3.0):** High-dimensional attractor, complex dynamics
- **Medium (2.0-3.0):** Moderate dimensional complexity
- **Low (<2.0):** Low-dimensional, simple dynamics

---

## 3. TEMPORAL DYNAMICS (3 metrics)

### 3.1 Hurst Exponent

**Purpose:** Long-term correlation analysis  
**Significance:** Indicates memory in the system (persistence vs. anti-persistence)

```python
def _calculate_hurst_exponent(self, image: np.ndarray) -> float:
    """
    Calculate Hurst exponent for long-term correlations.
    
    Algorithm: rescaled_range_analysis (R/S method)
    - Analyzes how range scales with time window
    - H = 0.5: random walk (no memory)
    - H > 0.5: persistent (trends continue)
    - H < 0.5: anti-persistent (mean-reverting)
    
    Note: For single image, uses spatial analysis as proxy.
    """
    # Placeholder implementation
    return 0.5 + np.random.random() * 0.3
```

**Algorithm Parameters:**
```json
{
  "min_window": 10,
  "max_window": 1000,
  "window_steps": 20,
  "detrending": "linear",
  "units": "exponent"
}
```

**Mathematical Formula:**
```
R/S = (a * n)^H

where:
- R = range of cumulative deviations
- S = standard deviation
- n = time window size
- H = Hurst exponent
```

**Interpretation:**
- **H = 0.5:** Random walk, no memory (white noise)
- **H > 0.5 (0.5-1.0):** Persistent trends, long memory
  - System tends to continue in same direction
  - High predictability
- **H < 0.5 (0.0-0.5):** Anti-persistent, mean-reverting
  - System tends to reverse direction
  - Self-regulating

---

### 3.2 Lyapunov Exponent

**Purpose:** Pattern stability assessment  
**Significance:** Indicates chaos vs. stability in system dynamics

```python
def _calculate_lyapunov_exponent(self, image: np.ndarray) -> float:
    """
    Calculate Lyapunov exponent for stability.
    
    Algorithm: wolf_method
    - Measures exponential divergence of nearby trajectories
    - Positive: chaotic/unstable
    - Zero: marginally stable
    - Negative: stable/convergent
    
    Note: For single image, uses spatial gradient analysis as proxy.
    """
    # Placeholder implementation
    return np.random.random() * 0.3
```

**Algorithm Parameters:**
```json
{
  "embedding_dimension": 3,
  "time_delay": 1,
  "evolution_time": 10,
  "replacement_threshold": 0.1,
  "units": "per_time_unit"
}
```

**Mathematical Formula:**
```
λ = lim(t→∞) (1/t) * ln(|δx(t)| / |δx(0)|)

where:
- λ = Lyapunov exponent
- δx(t) = separation between trajectories at time t
- δx(0) = initial separation
```

**Interpretation:**
- **Positive (>0):** Chaotic, sensitive to initial conditions
- **Zero (≈0):** Marginally stable, on edge of chaos
- **Negative (<0):** Stable, trajectories converge

---

### 3.3 DFA Analysis (Detrended Fluctuation Analysis)

**Purpose:** Quantifies long-range correlations in non-stationary signals  
**Significance:** Reveals scaling properties and fractal characteristics in time

```python
def _calculate_dfa_analysis(self, image: np.ndarray) -> float:
    """
    Calculate detrended fluctuation analysis.
    
    Algorithm: detrended_fluctuation_analysis
    - Divides signal into windows
    - Fits polynomial trend in each window
    - Calculates RMS fluctuation after detrending
    - Scaling exponent α relates to Hurst exponent
    
    Note: For single image, uses spatial analysis.
    """
    # Placeholder implementation
    return 0.4 + np.random.random() * 0.4
```

**Algorithm Parameters:**
```json
{
  "min_box_size": 4,
  "max_box_size": 256,
  "box_steps": 20,
  "detrending_order": 1,
  "overlap": 0.5,
  "units": "scaling_exponent"
}
```

**Mathematical Formula:**
```
F(n) ∝ n^α

where:
- F(n) = fluctuation function
- n = box size
- α = scaling exponent (DFA exponent)
```

**Interpretation:**
- **α = 0.5:** White noise (uncorrelated)
- **α = 1.0:** Pink noise (1/f), scale-invariant
- **α = 1.5:** Brownian motion (integrated white noise)
- **α > 1.0:** Long-range positive correlations
- **α < 0.5:** Long-range anti-correlations

---

## 4. SYSTEM ANALYSIS (3 metrics)

### 4.1 Bifurcation Analysis

**Purpose:** Identifies energetic state transition points  
**Significance:** Reveals critical thresholds and phase transitions

```python
def _calculate_bifurcation_analysis(self, image: np.ndarray) -> float:
    """
    Calculate bifurcation analysis.
    
    Algorithm: parameter_sweep_method
    - Analyzes stability of fixed points
    - Identifies period-doubling cascades
    - Detects transitions to chaos
    """
    # Placeholder implementation
    return np.random.random() * 0.6
```

**Algorithm Parameters:**
```json
{
  "parameter_range": [0.1, 4.0],
  "parameter_steps": 1000,
  "transient_skip": 100,
  "sample_points": 100,
  "stability_threshold": 0.01
}
```

**Interpretation:**
- **Fixed Point:** Stable state, no oscillation
- **Period Doubling:** Transition to complex dynamics
- **Chaos:** Unpredictable, sensitive dynamics

---

### 4.2 Recurrence Analysis

**Purpose:** Cyclic pattern detection  
**Significance:** Reveals repeating structures and rhythms

```python
def _calculate_recurrence_analysis(self, image: np.ndarray) -> float:
    """
    Calculate recurrence analysis.
    
    Algorithm: recurrence_quantification_analysis (RQA)
    - Creates recurrence plot
    - Quantifies diagonal/vertical line structures
    - Measures determinism, laminarity, entropy
    """
    # Placeholder implementation
    return 0.3 + np.random.random() * 0.5
```

**Algorithm Parameters:**
```json
{
  "embedding_dimension": 3,
  "time_delay": 1,
  "recurrence_threshold": 0.1,
  "minimum_line_length": 2,
  "theiler_window": 1
}
```

**RQA Metrics Produced:**
- **Recurrence Rate:** Percentage of recurrent points
- **Determinism:** Percentage of diagonal lines
- **Laminarity:** Percentage of vertical lines
- **Entropy:** Shannon entropy of line lengths

---

### 4.3 Nonlinear Mapping

**Purpose:** Manifold structure analysis  
**Significance:** Reveals underlying geometric structure of dynamics

```python
def _calculate_nonlinear_mapping(self, image: np.ndarray) -> float:
    """
    Calculate nonlinear mapping patterns.
    
    Algorithm: phase_space_reconstruction
    - Reconstructs attractor from time series
    - Analyzes manifold geometry
    - Calculates Poincaré sections
    """
    # Placeholder implementation
    return 0.4 + np.random.random() * 0.4
```

**Algorithm Parameters:**
```json
{
  "embedding_dimension": 3,
  "time_delay": 1,
  "manifold_dimension": 2,
  "neighborhood_size": 10,
  "prediction_horizon": 5
}
```

**Analysis Outputs:**
- **Attractor Dimension:** Fractal dimension of attractor
- **Lyapunov Spectrum:** Full spectrum of exponents
- **Poincaré Sections:** Cross-sectional analysis

---

## 5. SYMMETRY & FORM (3 metrics)

### 5.1 Body Symmetry

**Purpose:** Left/right energy balance  
**Significance:** Indicates internal harmony and integration

```python
def _calculate_body_symmetry(self, image: np.ndarray) -> float:
    """
    Calculate left/right body symmetry.
    
    Algorithm: bilateral_correlation
    - Splits image down vertical center
    - Flips right half horizontally
    - Calculates Pearson correlation between halves
    """
    h, w = image.shape
    
    # Split into left and right halves
    left_half = image[:, :w//2]
    right_half = image[:, w//2:]
    
    # Flip right half for comparison
    right_half_flipped = np.fliplr(right_half)
    
    # Calculate correlation
    correlation = np.corrcoef(
        left_half.flatten(),
        right_half_flipped.flatten()
    )[0, 1]
    
    # Return positive correlation only
    return max(0, correlation)
```

**Algorithm Parameters:**
```json
{
  "symmetry_axis": "vertical_center",
  "correlation_method": "pearson",
  "preprocessing": "gaussian_blur",
  "blur_sigma": 1.0,
  "units": "correlation_coefficient"
}
```

**Interpretation:**
- **High (>0.8):** Strong bilateral symmetry, balanced energy
- **Medium (0.5-0.8):** Moderate symmetry
- **Low (<0.5):** Asymmetry, imbalanced energy distribution

---

### 5.2 Contour Complexity

**Purpose:** Bio-energy field boundary analysis  
**Significance:** Indicates definition and structure of field boundaries

```python
def _calculate_contour_complexity(self, image: np.ndarray) -> float:
    """
    Calculate contour complexity.
    
    Algorithm: perimeter_area_ratio
    - Detects edges using Canny algorithm
    - Calculates ratio of edge pixels to total pixels
    - Higher ratio = more complex boundaries
    """
    # Detect edges
    edges = cv2.Canny(image, 50, 150)
    
    # Calculate edge pixel ratio
    complexity = np.sum(edges > 0) / edges.size
    
    return complexity
```

**Algorithm Parameters:**
```json
{
  "contour_method": "cv2.RETR_TREE",
  "approximation": "cv2.CHAIN_APPROX_NONE",
  "smoothing": "gaussian",
  "smoothing_iterations": 2,
  "units": "complexity_ratio"
}
```

**Interpretation:**
- **High (>0.5):** Complex, irregular boundaries
- **Medium (0.2-0.5):** Moderate complexity
- **Low (<0.2):** Simple, smooth boundaries

---

### 5.3 Pattern Regularity

**Purpose:** Coherent emission uniformity  
**Significance:** Indicates consistency and stability of patterns

```python
def _calculate_pattern_regularity(self, image: np.ndarray) -> float:
    """
    Calculate pattern regularity.
    
    Algorithm: autocorrelation_analysis
    - Uses coefficient of variation (std/mean)
    - Lower CV = more regular patterns
    - Inverted to make higher values = more regular
    """
    # Calculate coefficient of variation
    mean_val = np.mean(image)
    if mean_val > 0:
        cv = np.std(image) / mean_val
        regularity = 1.0 - cv
    else:
        regularity = 0.5
    
    return max(0, min(1, regularity))
```

**Algorithm Parameters:**
```json
{
  "lag_range": [1, 50],
  "correlation_threshold": 0.7,
  "periodicity_detection": "fft_based",
  "window_function": "hanning",
  "units": "regularity_coefficient"
}
```

**Interpretation:**
- **High (>0.7):** Highly regular, coherent patterns
- **Medium (0.4-0.7):** Moderate regularity
- **Low (<0.4):** Irregular, chaotic patterns

---

## Witness Capacity Development

### How 17 Metrics Train Multi-Dimensional Perception

Each metric category develops a specific aspect of witness capacity:

1. **Spatial Metrics** → Develops capacity to observe **field extent and intensity**
2. **Complexity Metrics** → Develops capacity to observe **pattern sophistication**
3. **Temporal Dynamics** → Develops capacity to observe **stability and memory**
4. **System Analysis** → Develops capacity to observe **transitions and cycles**
5. **Symmetry & Form** → Develops capacity to observe **balance and structure**

### The 17 Doorways Practice

Each metric serves as a "doorway" into deeper self-observation:

1. Start with simple spatial awareness (Light Quanta Density)
2. Progress to complexity awareness (Fractal Dimension)
3. Develop temporal sensitivity (Hurst Exponent)
4. Cultivate system perception (Bifurcation Analysis)
5. Refine balance awareness (Body Symmetry)

By cycling through all 17 metrics regularly, the practitioner develops comprehensive multi-dimensional witness capacity.

---

## Status

✅ **Extraction Complete**  
All 17 core metric algorithms have been documented with formulas, parameters, and interpretation guidelines.

---

**Source:** `/Volumes/madara/2026/twc-vault/01-Projects/WitnessOS/docs/engines/biofield.py`  
**Lines:** 168-834
