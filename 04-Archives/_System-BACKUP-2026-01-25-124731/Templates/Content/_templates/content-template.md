<%*
// Enhanced Content Template with Advanced Customization
const contentConfig = {
    coherenceLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    energySignatures: ['technical', 'consciousness', 'hybrid', 'field', 'quantum'],
    implementationTypes: ['direct', 'progressive', 'spiral', 'quantum'],
    platforms: ['substack', 'twitter', 'linkedin', 'instagram'],
    contentTypes: {
        outreach: ['tech-insight', 'pattern-interrupt', 'value-hook'],
        nurture: ['deep-dive', 'tutorial', 'case-study', 'framework-guide'],
        convert: ['success-story', 'product-showcase', 'implementation-guide']
    },
    defaultAgents: [
        'Headline Hacker',
        'Tech Quote Oracle',
        'Parallel Pattern Finder',
        'Code Snippet Weaver',
        'Image Prompt Engineer'
    ]
};

// Get user inputs
const category = await tp.system.suggester(
    ["Outreach", "Nurture", "Convert"],
    ["outreach", "nurture", "convert"],
    false,
    "Select content category"
);

const contentType = await tp.system.suggester(
    contentConfig.contentTypes[category].map(t => t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
    contentConfig.contentTypes[category],
    false,
    "Select content type"
);

const platform = await tp.system.suggester(
    contentConfig.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
    contentConfig.platforms,
    false,
    "Select platform"
);

const coherenceLevel = await tp.system.suggester(
    contentConfig.coherenceLevels.map(l => `Level ${l}`),
    contentConfig.coherenceLevels,
    false,
    "Select initial coherence level"
);

const energySignature = await tp.system.suggester(
    contentConfig.energySignatures.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    contentConfig.energySignatures,
    false,
    "Select energy signature"
);

const implementationType = await tp.system.suggester(
    contentConfig.implementationTypes.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
    contentConfig.implementationTypes,
    false,
    "Select implementation type"
);

// Multi-select for agents
const selectedAgents = await tp.system.suggester(
    contentConfig.defaultAgents,
    contentConfig.defaultAgents,
    true,
    "Select agents to use (multiple)"
);

// Generate frontmatter
const frontmatter = `---
type: content
category: ${category}
status: draft
created: ${tp.date.now("YYYY-MM-DD")}
updated: ${tp.date.now("YYYY-MM-DD")}
platform: ${platform}
content_type: ${contentType}
energy_signature: ${energySignature}
implementation_type: ${implementationType}
performance:
  views: 0
  engagement: 0
  conversion: 0
agents_used: ${JSON.stringify(selectedAgents)}
patterns_referenced: []
coherence_level: ${coherenceLevel}
success_metrics:
  technical_precision: 0
  spiritual_authenticity: 0
  practical_applicability: 0
debug_notes:
  last_scan: ${tp.date.now("YYYY-MM-DD")}
  optimization_points: []
  known_issues: []
---

# ${tp.file.title}

## Content Architecture
### Purpose & Intent
> [Define the core purpose and energy signature alignment]

### Target Resonance
- Primary Field: ${energySignature}
- Implementation Path: ${implementationType}
- Coherence Target: Level ${coherenceLevel}

### Pattern Integration Points
- [ ] Technical Framework
- [ ] Consciousness Layer
- [ ] Field Dynamics
- [ ] Implementation Protocol

### Agent Deployment
${selectedAgents.map(agent => `- [ ] ${agent} Integration`).join('\n')}

## Content Development
### Technical Framework
\`\`\`javascript
// Core implementation structure
const contentFramework = {
    type: "${contentType}",
    platform: "${platform}",
    patterns: [],
    integrationPoints: []
};
\`\`\`

### Consciousness Layer
1. Pattern Recognition Protocols
2. Field Coherence Methods
3. Integration Techniques

### Implementation Steps
1. [ ] Initial Pattern Scan
2. [ ] Framework Integration
3. [ ] Agent Deployment
4. [ ] Field Testing
5. [ ] Coherence Optimization

## Debug Console
\`\`\`
Runtime Status: Initializing
Coherence Level: ${coherenceLevel}
Energy Signature: ${energySignature}
Pattern Integration: Pending
\`\`\`

## Performance Metrics
\`\`\`dataview
TABLE
    coherence_level as "Coherence",
    performance.engagement as "Engagement",
    performance.conversion as "Conversion"
FROM "${tp.file.path}"
\`\`\`

## Next Steps
1. Complete pattern integration
2. Deploy selected agents
3. Test field coherence
4. Optimize implementation
5. Monitor performance metrics

## Related Patterns
\`\`\`dataview
LIST
FROM #pattern
WHERE contains(file.outlinks, this.file.link)
\`\`\`
`;

// Output the template
tR += frontmatter
-%>