# Media Reference Documentation
`Version: 1.0.0 | Created: 2025-01-25`

## Overview
This document provides comprehensive reference information for all media files organized in the WhyChromosome vault media system.

## Media Organization Summary

### Total Files Organized: 67 files
- **Generated Images**: 33 files (UUID-named AI-generated content)
- **Screenshots**: 18 files (12 screenshots + 6 pasted images)
- **Diagrams**: 7 files (Mermaid diagrams and flowcharts)
- **Article Images**: 5 files (Content-related images)
- **Brand Assets**: 1 file (SVG logo/brand content)
- **Videos**: 3 files (Generated video content)

## Directory Structure Reference

```
03-Resources/Media/
├── Images/
│   ├── Generated/          # 33 AI-generated images (UUID names)
│   ├── Screenshots/        # 18 screen captures and pasted images
│   ├── Diagrams/          # 7 Mermaid diagrams and flowcharts
│   ├── Articles/          # 5 images for articles and content
│   ├── Brand/             # 1 brand asset (SVG)
│   └── Archive/           # (Empty - for deprecated images)
├── Videos/
│   ├── Generated/         # 3 AI-generated videos
│   ├── Recordings/        # (Empty - for screen recordings)
│   └── Archive/           # (Empty - for deprecated videos)
└── Audio/
    ├── Recordings/        # (Empty - for audio recordings)
    ├── Generated/         # (Empty - for AI-generated audio)
    └── Archive/           # (Empty - for deprecated audio)
```

## File Categories and Naming Conventions

### Generated Images (33 files)
**Location**: `03-Resources/Media/Images/Generated/`
**Naming Pattern**: UUID format (preserved original names)
**Examples**:
- `2c6ccd00-bc91-4b35-8e5b-39d4335e01a6.png.jpeg`
- `f94db066-bed6-43ea-8e54-c0e96abcbc32.png`
- `fb455e5f-fab4-48fe-a2e1-c49ba64d500d.png`

### Screenshots and Captures (18 files)
**Location**: `03-Resources/Media/Images/Screenshots/`
**Naming Patterns**:
- Screenshots: `Screenshot YYYY-MM-DD at HH.MM.SS.png`
- Pasted images: `Pasted image YYYYMMDDHHMMSS.png`

**Examples**:
- `Screenshot 2024-12-25 at 15.24.26.png`
- `Pasted image 20241225152807.png`

### Diagrams (7 files)
**Location**: `03-Resources/Media/Images/Diagrams/`
**Naming Patterns**:
- Mermaid diagrams: `Mermaid Diagram [Date] [(Number)].png`
- Flowchart tools: `Online FlowChart & Diagrams Editor - [Tool Name].png`

**Examples**:
- `Mermaid Diagram Jan 20 2025.png`
- `Mermaid Diagram Jan 20 2025 (1).png`
- `Online FlowChart & Diagrams Editor - Mermaid Live Editor-2.png`

### Article Images (5 files)
**Location**: `03-Resources/Media/Images/Articles/`
**Examples**:
- `GgpTDRZWMAAos80.jpeg`
- `Image - square.jpg`
- `Image - stories.jpg`
- `img-vbFO2HSxM7iqThjXrr0YBhg9-2.png`

### Brand Assets (1 file)
**Location**: `03-Resources/Media/Images/Brand/`
**Examples**:
- `Catbird Prediction 227160297109069824.svg`

### Videos (3 files)
**Location**: `03-Resources/Media/Videos/Generated/`
**Naming Pattern**: Timestamp-based with hash
**Examples**:
- `1736814850_0-100_0_0__0ddeec1ca61ef39684165ab50e9f0524.mp4`
- `1736915340_0-100_0_0__191ddd2f2c10ba84b5c3a21d0664b055.mp4`
- `3d63d7e8-6208-4d23-a13d-eee069a009e1.mp4`

## Linking Protocols

### Relative Path Usage
When linking to media files from documents, use relative paths:

**From root level documents**:
```markdown
![Image Description](03-Resources/Media/Images/Category/filename.ext)
```

**From Projects (01-Projects/)**:
```markdown
![Image Description](../03-Resources/Media/Images/Category/filename.ext)
```

**From Areas (02-Areas/)**:
```markdown
![Image Description](../03-Resources/Media/Images/Category/filename.ext)
```

### Link Integrity Guidelines
1. Always use relative paths for portability
2. Include descriptive alt text for accessibility
3. Maintain consistent linking patterns across documents
4. Update links when moving or renaming files

## Media Usage Guidelines

### File Size Considerations
- **Images**: Optimize for web use while maintaining quality
- **Videos**: Consider compression for large files
- **Diagrams**: Prefer vector formats (SVG) when possible

### Format Standards
- **Images**: PNG for diagrams, JPEG for photos
- **Videos**: MP4 for compatibility
- **Brand Assets**: SVG for scalability

## Maintenance Procedures

### Regular Tasks
1. **Monthly Review**: Check for orphaned media files
2. **Link Validation**: Verify all media links are functional
3. **Archive Management**: Move unused files to Archive directories
4. **Naming Consistency**: Ensure new files follow naming conventions

### Migration History
- **2025-01-25**: Initial media organization completed
  - 67 files moved from root directory to organized structure
  - Directory structure established
  - Naming conventions documented

## Cross-References
- [[media-linking-protocols]] - Detailed linking standards
- [[03-Resources/Media/_index]] - Media directory index
- [[_System/structure/vault-structure]] - Overall vault organization

---
*This documentation is part of the WhyChromosome vault refactoring project Phase 6: Media Organization*