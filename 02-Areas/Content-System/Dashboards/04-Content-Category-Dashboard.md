---
type: dashboard
created: 2024-12-09
updated: 2024-12-09
---
# Content Category Performance Dashboard
Runtime Status: Active
Last Updated: 2024-12-09

## 1. Category Distribution
```dataview
TABLE
    count(rows) as "Count",
    average(coherence_level) as "Avg Coherence",
    average(performance.engagement) as "Avg Engagement"
FROM #content
GROUP BY category
SORT count(rows) DESC
```

## 2. Outreach Content Performance
```dataview
TABLE
    content_type as "Type",
    platform as "Platform",
    coherence_level as "Coherence",
    performance.conversion as "Conversion"
FROM #content
WHERE category = "outreach"
SORT performance.conversion DESC
```

## 3. Nurture Content Health
```dataview
TABLE
    content_type as "Type",
    platform as "Platform",
    coherence_level as "Coherence",
    performance.engagement as "Engagement"
FROM #content
WHERE category = "nurture"
SORT performance.engagement DESC
```

## 4. Convert Content Analysis
```dataview
TABLE
    content_type as "Type",
    platform as "Platform",
    coherence_level as "Coherence",
    performance.conversion as "Conversion"
FROM #content
WHERE category = "convert"
SORT performance.conversion DESC
```