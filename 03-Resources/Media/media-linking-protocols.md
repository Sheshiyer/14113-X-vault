# Media Linking Protocols
`Version: 1.0.0 | Runtime: 2025-01-20 | Media Management Standards`

## Overview
Standardized protocols for linking and referencing media files within the WhyChromosome vault to ensure consistency, accessibility, and maintainability.

## Linking Standards

### Relative Path Structure
All media links should use relative paths from the document location:

```markdown
![Description](../../../03-Resources/Media/Images/Category/filename.ext)
```

### Path Examples by Document Location

#### From Root Directory
```markdown
![Diagram](03-Resources/Media/Images/Diagrams/system-architecture.png)
```

#### From 01-Projects
```markdown
![Screenshot](../../03-Resources/Media/Images/Screenshots/interface-demo.png)
```

#### From 02-Areas
```markdown
![Generated Image](../../03-Resources/Media/Images/Generated/ai-artwork.png)
```

#### From 03-Resources
```markdown
![Article Image](../Media/Images/Articles/concept-illustration.jpg)
```

## Image Linking Best Practices

### Markdown Syntax
```markdown
![Alt Text](path/to/image.ext "Optional Title")
```

### Required Elements
- **Alt Text**: Descriptive text for accessibility
- **Relative Path**: From document to media file
- **Optional Title**: Additional context on hover

### Example Implementation
```markdown
![System Architecture Diagram](../../03-Resources/Media/Images/Diagrams/consciousness-architecture.png "WhyChromosome System Architecture")
```

## Media Categories and Linking

### Generated Images
**Path Pattern**: `03-Resources/Media/Images/Generated/`
**Naming**: Preserve UUID names, add metadata files
**Linking Example**:
```markdown
![AI Generated Concept](../../03-Resources/Media/Images/Generated/a9fa39f5-4551-464c-a134-19f26a4cc9c8.png)
```

### Screenshots
**Path Pattern**: `03-Resources/Media/Images/Screenshots/`
**Naming**: `screenshot_YYYY-MM-DD_description.ext`
**Linking Example**:
```markdown
![Interface Screenshot](../../03-Resources/Media/Images/Screenshots/screenshot_2025-01-20_vault-organization.png)
```

### Diagrams
**Path Pattern**: `03-Resources/Media/Images/Diagrams/`
**Naming**: `diagram_system-name_description.ext`
**Linking Example**:
```markdown
![System Flow Diagram](../../03-Resources/Media/Images/Diagrams/diagram_consciousness-flow_processing.png)
```

### Article Images
**Path Pattern**: `03-Resources/Media/Images/Articles/`
**Naming**: `article_title_image-purpose.ext`
**Linking Example**:
```markdown
![Article Header](../../03-Resources/Media/Images/Articles/article_ancient-debugging_header.jpg)
```

### Brand Assets
**Path Pattern**: `03-Resources/Media/Images/Brand/`
**Naming**: `brand_asset-type_description.ext`
**Linking Example**:
```markdown
![WhyChromosome Logo](../../03-Resources/Media/Images/Brand/brand_logo_primary.svg)
```

## Link Maintenance

### When Moving Files
1. Update all references to the moved file
2. Use search functionality to find all instances
3. Test links after moving
4. Update index files

### When Renaming Files
1. Document old filename for reference
2. Update all links systematically
3. Consider creating redirect documentation
4. Update metadata files

### Validation Checklist
- [ ] All links use relative paths
- [ ] Alt text is descriptive and accessible
- [ ] File paths are correct
- [ ] Images display properly
- [ ] Links work from all referencing documents

## Accessibility Standards

### Alt Text Guidelines
- Describe the content and function of the image
- Keep descriptions concise but informative
- Avoid redundant phrases like "image of" or "picture of"
- Include relevant context for understanding

### Examples
```markdown
<!-- Good -->
![Consciousness architecture showing three interconnected layers](path/to/diagram.png)

<!-- Avoid -->
![Image of a diagram](path/to/diagram.png)
```

## File Organization Dependencies

### Before Linking
1. Ensure file is in correct category directory
2. Follow naming conventions
3. Create metadata files if needed
4. Update category index files

### Documentation Requirements
- Document media usage in source files
- Maintain dependency lists for complex documents
- Update cross-references when media changes
- Archive deprecated media properly

## Troubleshooting

### Common Issues
- **Broken Links**: Usually caused by incorrect relative paths
- **Missing Images**: File moved without updating links
- **Accessibility Problems**: Missing or poor alt text

### Solutions
- Use consistent relative path patterns
- Maintain link inventory for important documents
- Regular link validation checks
- Standardized alt text practices

## Tags
`#MediaLinking` `#LinkingProtocols` `#MediaManagement` `#Accessibility` `#VaultStandards`

---
*Consistent linking enables reliable access. Standardized protocols ensure maintainable media references.*
