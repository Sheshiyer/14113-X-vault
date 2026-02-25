# Biofield Calculation Formulas

**Version:** 2.0  
**Date:** January 2026  
**Purpose:** Pure mathematical reference with LaTeX notation, algorithms, and edge cases

---

## Table of Contents

1. [Notation Conventions](#1-notation-conventions)
2. [Basic Metrics Formulas](#2-basic-metrics-formulas)
3. [Color Metrics Formulas](#3-color-metrics-formulas)
4. [Geometric Formulas](#4-geometric-formulas)
5. [Nonlinear Dynamics Formulas](#5-nonlinear-dynamics-formulas)
6. [Symmetry Formulas](#6-symmetry-formulas)
7. [Composite Score Formulas](#7-composite-score-formulas)
8. [Edge Case Handling](#8-edge-case-handling)

---

## 1. Notation Conventions

### 1.1 Symbols

| Symbol | Meaning |
|--------|---------|
| $I$ | Image matrix |
| $I_{i,j}$ | Pixel intensity at position $(i,j)$ |
| $M$ | Binary mask (0 or 1) |
| $N$ | Total number of pixels in ROI |
| $W, H$ | Image width and height |
| $\bar{x}$ | Mean of $x$ |
| $\sigma_x$ | Standard deviation of $x$ |
| $\mathbb{1}(\cdot)$ | Indicator function (1 if true, 0 if false) |
| $\lfloor x \rfloor$ | Floor function |
| $\lceil x \rceil$ | Ceiling function |

### 1.2 Ranges

- Grayscale intensity: $I \in [0, 255]$
- RGB channels: $R, G, B \in [0, 255]$
- HSV: $H \in [0, 180]$ (OpenCV), $S, V \in [0, 255]$
- Normalized values: $[0, 1]$
- Scores: $[0, 100]$ (integer)

---

## 2. Basic Metrics Formulas

### 2.1 Average Intensity

$$
\bar{I} = \frac{1}{N} \sum_{(i,j) \in \text{ROI}} I_{i,j}
$$

**With mask:**
$$
\bar{I} = \frac{\sum_{i=1}^{H} \sum_{j=1}^{W} M_{i,j} \cdot I_{i,j}}{\sum_{i=1}^{H} \sum_{j=1}^{W} M_{i,j}}
$$

### 2.2 Standard Deviation

$$
\sigma_I = \sqrt{\frac{1}{N} \sum_{(i,j) \in \text{ROI}} (I_{i,j} - \bar{I})^2}
$$

### 2.3 Light Quanta Density (LQD)

**Adaptive threshold:**
$$
T = \bar{I} + 0.5 \cdot \sigma_I
$$

$$
LQD = \frac{1}{N} \sum_{(i,j) \in \text{ROI}} \mathbb{1}(I_{i,j} > T)
$$

**Fixed threshold variant:**
$$
LQD_{fixed} = \frac{1}{N} \sum_{(i,j) \in \text{ROI}} \mathbb{1}(I_{i,j} > T_{fixed})
$$

where $T_{fixed}$ is user-defined (typically 128).

### 2.4 Integrated Energy

$$
E = \sum_{(i,j) \in \text{ROI}} I_{i,j}
$$

**Normalized:**
$$
E_{norm} = \frac{E}{255 \cdot N}
$$

### 2.5 Inner Noise Percentage

$$
N_{\%} = \frac{\sigma_I}{\bar{I}} \times 100
$$

---

## 3. Color Metrics Formulas

### 3.1 RGB to HSV Conversion

$$
V = \max(R, G, B)
$$

$$
S = \begin{cases}
0 & \text{if } V = 0 \\
\frac{V - \min(R, G, B)}{V} \times 255 & \text{otherwise}
\end{cases}
$$

$$
H = \begin{cases}
0 & \text{if } S = 0 \\
60 \times \frac{G - B}{V - \min(R,G,B)} & \text{if } V = R \\
120 + 60 \times \frac{B - R}{V - \min(R,G,B)} & \text{if } V = G \\
240 + 60 \times \frac{R - G}{V - \min(R,G,B)} & \text{if } V = B
\end{cases}
$$

If $H < 0$, add 360. Then scale to OpenCV range: $H_{cv} = H / 2$.

### 3.2 Shannon Entropy

**3D HSV Histogram:**
$$
p_{h,s,v} = \frac{\text{count}(h, s, v)}{N}
$$

$$
H_{color} = -\sum_{h=1}^{B_H} \sum_{s=1}^{B_S} \sum_{v=1}^{B_V} p_{h,s,v} \log_2(p_{h,s,v})
$$

where $B_H = 30, B_S = 32, B_V = 32$ (bins).

### 3.3 Color Coherence

**Connected components in quantized hue:**

For each hue band $h_b \in \{0, 30, 60, ..., 150\}$:
$$
\text{Band mask: } B_{h_b} = \mathbb{1}(h_b \leq H < h_b + 30)
$$

Find connected components $C_1, C_2, ..., C_k$ in $B_{h_b}$.

$$
\text{Coherent pixels: } P_{coherent} = \sum_{h_b} \sum_{c \in C_{h_b}} A_c \cdot \mathbb{1}(A_c > T_{min})
$$

where $T_{min} = 25$ pixels.

$$
\text{Coherence} = \frac{P_{coherent}}{N}
$$

---

## 4. Geometric Formulas

### 4.1 Contour Area (Shoelace Formula)

Given contour points $\{(x_0, y_0), (x_1, y_1), ..., (x_{n-1}, y_{n-1})\}$:

$$
A = \frac{1}{2} \left| \sum_{i=0}^{n-1} (x_i y_{i+1} - x_{i+1} y_i) \right|
$$

where $x_n = x_0, y_n = y_0$ (closed contour).

### 4.2 Perimeter

$$
P = \sum_{i=0}^{n-1} \sqrt{(x_{i+1} - x_i)^2 + (y_{i+1} - y_i)^2}
$$

### 4.3 Entropy Coefficient (EC)

$$
EC = \frac{P}{2\sqrt{\pi A}}
$$

**Properties:**
- $EC = 1$ for perfect circle
- $EC > 1$ for irregular shapes
- $EC \to \infty$ as perimeter increases with constant area

### 4.4 Form Coefficient (FC)

$$
FC = \frac{P^2}{4\pi A}
$$

**Relationship:**
$$
FC = EC^2
$$

### 4.5 Equivalent Radius

$$
r_{eq} = \sqrt{\frac{A}{\pi}}
$$

### 4.6 Ellipse Fitting

**Least-squares fit to equation:**
$$
Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0
$$

Subject to constraint $B^2 - 4AC < 0$ (ellipse).

**Extract parameters:**
$$
\theta = \frac{1}{2} \arctan\left(\frac{B}{A - C}\right)
$$

$$
a = \sqrt{\frac{2(AE^2 + CD^2 - BDE + (B^2 - 4AC)F)}{(A+C) - \sqrt{(A-C)^2 + B^2}}}
$$

$$
b = \sqrt{\frac{2(AE^2 + CD^2 - BDE + (B^2 - 4AC)F)}{(A+C) + \sqrt{(A-C)^2 + B^2}}}
$$

**Eccentricity:**
$$
e = \sqrt{1 - \frac{b^2}{a^2}}
$$

### 4.7 Solidity

$$
S = \frac{A_{contour}}{A_{convex\_hull}}
$$

---

## 5. Nonlinear Dynamics Formulas

### 5.1 Box-Counting Fractal Dimension

**Algorithm:**
1. Convert image to binary: $B = \mathbb{1}(I > \bar{I})$
2. For box sizes $\epsilon \in \{2, 4, 8, 16, 32, 64\}$:
   - Count boxes containing at least one pixel: $N(\epsilon)$
3. Linear regression:
$$
\log N(\epsilon) = D \log(1/\epsilon) + c
$$

**Fractal dimension:**
$$
D = -\frac{d(\log N)}{d(\log \epsilon)} = \lim_{\epsilon \to 0} \frac{\log N(\epsilon)}{\log(1/\epsilon)}
$$

### 5.2 Hurst Exponent (R/S Analysis)

**For time scale $k$:**

1. Divide series $x_1, ..., x_n$ into segments of length $k$
2. For each segment $s$:
   - Mean: $\mu_s = \frac{1}{k} \sum_{i=1}^{k} x_{s,i}$
   - Cumulative deviation: $Y_s(t) = \sum_{i=1}^{t} (x_{s,i} - \mu_s)$
   - Range: $R_s = \max(Y_s) - \min(Y_s)$
   - Std dev: $S_s = \sqrt{\frac{1}{k} \sum_{i=1}^{k} (x_{s,i} - \mu_s)^2}$
   - $R/S$ ratio: $\frac{R_s}{S_s}$
3. Average over segments: $\overline{R/S}(k)$

**Hurst exponent from scaling:**
$$
\overline{R/S}(k) \sim k^H
$$

$$
H = \frac{d(\log \overline{R/S})}{d(\log k)}
$$

### 5.3 Lyapunov Exponent (Rosenstein Method)

**Phase space reconstruction:**
$$
\mathbf{x}_i = [s_i, s_{i+\tau}, s_{i+2\tau}, ..., s_{i+(m-1)\tau}]
$$

where $\tau = 1$ (delay), $m = 10$ (embedding dimension).

**Nearest neighbor distance:**
$$
d_j(0) = \min_{\substack{k \\ |k - j| > \text{Theiler}}} \|\mathbf{x}_j - \mathbf{x}_k\|
$$

**Divergence over time:**
$$
d_j(t) = \|\mathbf{x}_{j+t} - \mathbf{x}_{k+t}\|
$$

**Lyapunov exponent:**
$$
\lambda = \frac{1}{t_{\max}} \frac{1}{M} \sum_{j=1}^{M} \log \frac{d_j(t_{\max})}{d_j(0)}
$$

### 5.4 DFA (Detrended Fluctuation Analysis)

**Algorithm:**
1. Integrate: $Y(k) = \sum_{i=1}^{k} [x_i - \bar{x}]$
2. Divide into segments of size $s$
3. For each segment, fit linear trend $\hat{Y}_s(k) = a_s k + b_s$
4. Detrend: $Y_s(k) - \hat{Y}_s(k)$
5. Calculate fluctuation:
$$
F(s) = \sqrt{\frac{1}{N_s} \sum_{k=1}^{N_s} [Y(k) - \hat{Y}_s(k)]^2}
$$

**Scaling exponent:**
$$
F(s) \sim s^{\alpha}
$$

$$
\alpha = \frac{d(\log F)}{d(\log s)}
$$

### 5.5 Correlation Dimension

**Grassberger-Procaccia algorithm:**

**Correlation sum:**
$$
C(r) = \frac{2}{N(N-1)} \sum_{i=1}^{N-1} \sum_{j=i+1}^{N} \Theta(r - \|\mathbf{x}_i - \mathbf{x}_j\|)
$$

where $\Theta$ is Heaviside step function.

**Scaling:**
$$
C(r) \sim r^{D_2}
$$

$$
D_2 = \lim_{r \to 0} \frac{\log C(r)}{\log r}
$$

### 5.6 Sample Entropy

**Template matches:**
- $m$-length templates: $\mathbf{u}_i^m = [x_i, ..., x_{i+m-1}]$
- Distance: $d[\mathbf{u}_i^m, \mathbf{u}_j^m] = \max_k |x_{i+k} - x_{j+k}|$
- Match if $d < r$ (tolerance)

**Counts:**
$$
B = \sum_{i=1}^{N-m} \sum_{j=i+1}^{N-m} \mathbb{1}(d[\mathbf{u}_i^m, \mathbf{u}_j^m] < r)
$$

$$
A = \sum_{i=1}^{N-m-1} \sum_{j=i+1}^{N-m-1} \mathbb{1}(d[\mathbf{u}_i^{m+1}, \mathbf{u}_j^{m+1}] < r)
$$

**Sample entropy:**
$$
SampEn = -\ln\left(\frac{A}{B}\right)
$$

---

## 6. Symmetry Formulas

### 6.1 SSIM (Structural Similarity Index)

For image patches $x$ (left) and $y$ (right):

$$
SSIM(x, y) = \frac{(2\mu_x\mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}
$$

where:
- $\mu_x, \mu_y$ = mean intensities
- $\sigma_x^2, \sigma_y^2$ = variances
- $\sigma_{xy}$ = covariance
- $C_1 = (0.01 \cdot 255)^2, C_2 = (0.03 \cdot 255)^2$ (stability constants)

**Normalization for symmetry score:**
$$
S_{SSIM} = \frac{SSIM + 1}{2}
$$

### 6.2 Normalized Cross-Correlation

$$
NCC = \frac{\sum_i (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_i (x_i - \bar{x})^2} \sqrt{\sum_i (y_i - \bar{y})^2}}
$$

### 6.3 Histogram Correlation

$$
\rho(H_x, H_y) = \frac{\sum_b (H_x(b) - \bar{H}_x)(H_y(b) - \bar{H}_y)}{\sqrt{\sum_b (H_x(b) - \bar{H}_x)^2} \sqrt{\sum_b (H_y(b) - \bar{H}_y)^2}}
$$

### 6.4 Pixel-wise Symmetry

$$
S_{pixel} = 1 - \frac{MSE}{255^2}
$$

where:
$$
MSE = \frac{1}{N} \sum_{i=1}^{N} (x_i - y_i)^2
$$

### 6.5 Composite Body Symmetry

$$
S_{body} = 0.35 S_{SSIM} + 0.25 S_{corr} + 0.20 S_{hist} + 0.20 S_{pixel}
$$

---

## 7. Composite Score Formulas

### 7.1 Energy Score

$$
E_{score} = \lfloor 100 \times (0.30 LQD + 0.25 I_{norm} + 0.25 E_{norm} + 0.20 A_{norm}) \rfloor
$$

**Normalization:**
- $I_{norm} = I / 255$
- $E_{norm} = \min(E / (N \times 255), 1)$
- $A_{norm} = \min(A / (1.5 \times W \times H), 1)$

### 7.2 Coherence Score

$$
C_{score} = \lfloor 100 \times (0.35 P_{reg} + 0.25 T_{stab} + 0.25 H_{norm} + 0.15 C_{col}) \rfloor
$$

**Hurst normalization:**
$$
H_{norm} = \max(0, \min(1, 2(H - 0.5)))
$$

### 7.3 Complexity Score

$$
Cx_{score} = \lfloor 100 \times (0.30 D_{norm} + 0.25 H_{ent} + 0.20 CD_{norm} + 0.15 CC_{norm} + 0.10 N_{norm}) \rfloor
$$

**Normalization:**
- $D_{norm} = D - 1$ (fractal dimension, range [1,2] → [0,1])
- $H_{ent} = (H_{color} - 3) / 5$ (entropy, range [3,8] → [0,1])
- $CD_{norm} = CD \mod 1$ (correlation dimension, fractional part)
- $CC_{norm} = CC - 1$ (contour complexity, range [1,2] → [0,1])
- $N_{norm} = \min(N_{\%} / 50, 1)$ (noise percentage)

### 7.4 Regulation Score

$$
R_{score} = \lfloor 100 \times (0.30 L_{norm} + 0.25 \alpha_{norm} + 0.20 V_{norm} + 0.15 RR + 0.10 SV_{norm}) \rfloor
$$

**Normalization:**
- $L_{norm} = \max(0, \min(1, 0.5 - \lambda))$ (Lyapunov, inverted)
- $\alpha_{norm} = \max(0, \min(1, 1 - |\alpha - 1|))$ (DFA deviation from 1)
- $V_{norm} = 1 - \min(\sigma_{temp} / 0.3, 1)$ (temporal variance, inverted)
- $RR \in [0, 1]$ (recurrence rate)
- $SV_{norm} = 1 - \min(\sigma_{seg} / 0.5, 1)$ (segment variability, inverted)

### 7.5 Symmetry Score

$$
S_{score} = \lfloor 100 \times (0.50 S_{body} + 0.30 B_{contour} + 0.20 S_{color}) \rfloor
$$

**Contour balance:**
$$
B_{contour} = \frac{\min(CC_L, CC_R)}{\max(CC_L, CC_R) + \epsilon}
$$

### 7.6 Color Balance Score

$$
CB_{score} = \lfloor 100 \times (0.30 U + 0.25 B_h + 0.20 C_s + 0.15 C_{coh} + 0.10 S_{col}) \rfloor
$$

**Normalization:**
- $U = \min(H_{color} / 7, 1)$ (entropy-based uniformity)
- $B_h$ = hue coverage (fraction of bins > threshold)
- $C_s = 1 - \min(\sigma_{sat}^2 \times 1000, 1)$ (saturation consistency)

---

## 8. Edge Case Handling

### 8.1 Empty or Near-Empty ROI

**Condition:** $N < N_{min}$ (typically 100 pixels)

**Action:**
```
IF N < 100:
    RETURN zero_metrics()
```

All metrics return 0 or NaN, flag set: `insufficient_data = True`

### 8.2 Division by Zero

**LQD calculation:**
$$
LQD = \begin{cases}
\frac{\text{count}(I > T)}{N} & \text{if } N > 0 \\
0 & \text{otherwise}
\end{cases}
$$

**Entropy coefficient:**
$$
EC = \begin{cases}
\frac{P}{2\sqrt{\pi A}} & \text{if } A > 0 \\
0 & \text{otherwise}
\end{cases}
$$

**General rule:** Use conditional to check denominator before division.

### 8.3 Log of Zero (Entropy calculations)

**Filter zeros before log:**
$$
H = -\sum_{i: p_i > 0} p_i \log_2(p_i)
$$

**Never compute $\log(0)$.**

### 8.4 NaN and Inf Handling

**After calculation, sanitize:**
```python
def sanitize(value, default=0.0):
    if np.isnan(value) or np.isinf(value):
        return default
    return value
```

### 8.5 Extreme Values

**Clamping:**
```python
def clamp(value, min_val, max_val):
    return max(min_val, min(value, max_val))
```

**Example:**
$$
D_{fractal} = \text{clamp}(D_{calculated}, 1.0, 2.0)
$$

### 8.6 Singular Matrices (Ellipse Fitting)

**Try-except pattern:**
```python
try:
    ellipse = cv2.fitEllipse(contour)
    major, minor, angle = extract_params(ellipse)
except cv2.error:
    major, minor, angle = 0, 0, 0
    eccentricity = 0
```

### 8.7 Insufficient Points for Nonlinear Metrics

**Minimum requirements:**
- Hurst exponent: $n \geq 20$
- Lyapunov: $n \geq 50$
- DFA: $n \geq 100$
- Sample entropy: $n \geq 30$

**If $n < n_{min}$:** Return default value (0.5 for Hurst, 0 for Lyapunov, 1.0 for DFA).

---

## Appendix: Pseudocode Summary

### Full Analysis Pipeline

```
FUNCTION analyze_image(image, mask):
    // 1. Validate inputs
    IF image.size == 0 OR (mask != NULL AND mask.shape != image.shape):
        RAISE ValidationError
    
    // 2. Extract ROI
    IF mask != NULL:
        pixels = image[mask > 0]
    ELSE:
        pixels = image.flatten()
    
    IF pixels.size < 100:
        RETURN zero_metrics()
    
    // 3. Calculate basic metrics
    avg_intensity = mean(pixels)
    std_intensity = std(pixels)
    lqd = calculate_lqd(pixels, avg_intensity, std_intensity)
    energy = sum(pixels)
    
    // 4. Calculate color metrics
    hsv = rgb_to_hsv(image)
    color_entropy = shannon_entropy(hsv)
    color_coherence = connected_components_coherence(hsv)
    
    // 5. Calculate geometric metrics
    contours = find_contours(binarize(image))
    largest_contour = max(contours, key=area)
    area = contour_area(largest_contour)
    perimeter = contour_perimeter(largest_contour)
    ec = perimeter / (2 * sqrt(pi * area))
    fc = (perimeter^2) / (4 * pi * area)
    
    // 6. Calculate nonlinear metrics
    timeseries = image_to_timeseries(image)
    fractal_dim = box_counting(image)
    hurst = hurst_exponent(timeseries)
    lyapunov = lyapunov_exponent(timeseries)
    dfa_alpha = detrended_fluctuation_analysis(timeseries)
    
    // 7. Calculate symmetry metrics
    left, right = split_at_midline(image)
    ssim_sym = ssim(left, flip(right))
    corr_sym = correlation(left, flip(right))
    
    // 8. Package results
    RETURN {
        basic: {avg_intensity, std_intensity, lqd, energy, ...},
        color: {color_entropy, color_coherence, ...},
        geometric: {area, perimeter, ec, fc, ...},
        nonlinear: {fractal_dim, hurst, lyapunov, dfa_alpha, ...},
        symmetry: {ssim_sym, corr_sym, ...}
    }
END FUNCTION
```

---

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Precision:** Double precision (64-bit float) recommended for intermediate calculations  
**Integer Scores:** Final scores rounded to integers (0-100)

*Pure mathematical reference. Implement with appropriate numerical stability checks.*
