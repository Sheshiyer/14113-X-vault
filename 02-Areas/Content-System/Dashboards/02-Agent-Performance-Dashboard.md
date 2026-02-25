---
type: dashboard
created: 2024-12-09
updated: 2024-12-09
---
# Content Agent Performance Dashboard
Runtime Status: Active
Last Updated: 2024-12-09

## 1. Agent Deployment Stats
```dataview
TABLE
    count(rows) as "Uses",
    average(coherence_level) as "Avg Coherence",
    average(performance.engagement) as "Avg Engagement"
FROM #content
WHERE length(agents_used) > 0
GROUP BY agents_used
SORT count(rows) DESC
```

## 2. Cross-Platform Agent Performance
```dataview
TABLE
    agents_used as "Agents",
    platform as "Platform",
    coherence_level as "Coherence",
    performance.engagement as "Engagement"
FROM #content
WHERE length(agents_used) > 0
SORT performance.engagement DESC
LIMIT 15
```

## 3. Agent Pattern Recognition
```dataview
TABLE
    agents_used as "Agents",
    patterns_referenced as "Patterns Used",
    coherence_level as "Pattern Coherence"
FROM #content
WHERE length(agents_used) > 0 
AND length(patterns_referenced) > 0
SORT coherence_level DESC
```