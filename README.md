# PARA Knowledge Management System

A lightweight, text-focused knowledge management system organized using the PARA (Projects, Areas, Resources, Archives) methodology.

## Structure

```
/Volumes/madara/2026/twc-vault/
├── 01-Projects/          # Active projects with specific goals and deadlines
├── 02-Areas/            # Ongoing responsibilities without end dates  
├── 03-Resources/        # Reference materials and research
├── 04-Archives/         # Inactive items from other categories
└── 90-Templates/        # Reusable templates and patterns
```

## Git Strategy

This repository follows a **text-first, lightweight** approach:

### ✅ Included in Git
- Markdown documentation (.md files)
- Configuration files (.json, .yaml, .yml)
- Source code and scripts
- Small, essential data files
- Project planning and task files

### ❌ Excluded from Git (via .gitignore)
- Large binary files (PDFs, images, videos, audio)
- Archive files (ZIP, TAR, RAR)
- Database files and large datasets
- Generated build outputs
- Temporary and cache files
- IDE/editor specific files
- OS generated files (DS_Store, Thumbs.db)

## Repository Status

### Active Repositories
1. **Somatic-Canticles** (`/01-Projects/Somatic-Canticles/`)
   - Narrative trilogy project
   - Text-focused manuscript development
   - World-building documentation

2. **Somatic-Canticles-Webapp** (`/04-Archives/System-Noise/01-Projects/tryambakam-noesis/Somatic-Canticles-Webapp/`)
   - Web application for the trilogy
   - Next.js/Tailwind development

### Cleaned Repositories
The following had their .git directories removed to prevent nested repository issues:
- `01-Projects/Somatic-Canticles/04_SOURCES/External-Research/GLOSSOPETRAE/`
- `01-Projects/tryambakam-noesis/evolution-docs/engine-implementations/biofield/archive/bv-pip-analysis/`
- `04-Archives/System-Noise/01-Projects/mixloop/`

## Getting Started

1. Clone this repository
2. Navigate to the relevant project folder
3. Follow the project-specific README files
4. Use the provided templates for new projects

## Best Practices

1. **Keep it Text-First**: Prioritize markdown and text files over binary formats
2. **Regular Commits**: Commit meaningful changes with clear messages
3. **Lightweight Focus**: Exclude large files that can be regenerated or stored elsewhere
4. **Cross-Project Linking**: Use relative links between related projects
5. **Template Usage**: Start new projects from existing templates

## File Size Guidelines

- **Include**: Files under 1MB that are essential for the project
- **Exclude**: Files over 1MB or any binary media files
- **Consider**: Use Git LFS for critical binary files if absolutely necessary

## Backup Strategy

For large resources and binary files not tracked in Git:
1. Use external cloud storage (Google Drive, Dropbox, etc.)
2. Document locations in project README files
3. Maintain separate backup systems for critical data

---

*This repository prioritizes speed, portability, and text-focused collaboration over comprehensive file tracking.*