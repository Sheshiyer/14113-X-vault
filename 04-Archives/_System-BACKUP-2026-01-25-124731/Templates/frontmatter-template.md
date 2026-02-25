# Standardized Frontmatter Templates

## Basic Document Template
```yaml
---
title: "Document Title"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
author: "Author Name"
status: "draft|active|archived"
tags: 
  - primary-tag
  - secondary-tag
  - content-type
type: "framework|analysis|protocol|research|guide"
---
```

## Project Document Template
```yaml
---
title: "Project Title"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
project: "project-name"
phase: "planning|development|testing|complete"
priority: "high|medium|low"
status: "active|paused|complete|archived"
tags:
  - project-tag
  - domain-tag
  - methodology-tag
dependencies:
  - dependency-1
  - dependency-2
---
```

## Framework Document Template
```yaml
---
title: "Framework Name"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
framework-type: "consciousness|technical|integration"
maturity: "experimental|stable|deprecated"
implementation-status: "concept|prototype|production"
tags:
  - framework
  - domain-tag
  - implementation-tag
related-frameworks:
  - framework-1
  - framework-2
---
```

## Analysis Document Template
```yaml
---
title: "Analysis Title"
version: "1.0.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
analysis-type: "pattern|system|comparative|diagnostic"
subject: "subject-being-analyzed"
methodology: "methodology-used"
confidence: "high|medium|low"
tags:
  - analysis
  - subject-tag
  - methodology-tag
data-sources:
  - source-1
  - source-2
---
```

## Usage Guidelines

1. **Always include**: title, version, created, updated, tags
2. **Choose appropriate type**: Select the template that best fits your content
3. **Use consistent tagging**: Follow the established tagging protocol
4. **Update versions**: Increment version numbers for significant changes
5. **Maintain dates**: Keep created/updated dates current

## Tag Categories to Include
- **Domain tags**: #ConsciousnessArchitecture, #TechnicalMystic, etc.
- **Content type tags**: #Framework, #Analysis, #Protocol, etc.
- **Methodology tags**: #EmergentStrategy, #HolisticApproach, etc.
- **Status tags**: #WorkInProgress, #NeedsReview, #KeyInsight, etc.

#Templates #Frontmatter #DocumentStandards #MetadataProtocol