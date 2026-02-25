---
type: dashboard
created: 2024-12-09
updated: 2024-12-09
---
# Content System Master Dashboard
Runtime Status: Active
Last Updated: 2024-12-09

## 1. Current Sprint Overview
```dataview
TABLE 
    status as "Status",
    platform as "Platform",
    content_type as "Type",
    coherence_level as "Coherence"
FROM #content
WHERE file.mtime >= date(today) - dur("7 days")
SORT file.mtime DESC
```

## 2. Performance Metrics
### Platform Distribution
```dataview
TABLE 
    count(rows) as "Posts",
    average(performance.engagement) as "Avg Engagement",
    max(performance.views) as "Peak Views"
FROM #content 
WHERE status = "published"
GROUP BY platform
SORT average(performance.engagement) DESC
```

### Content Type Effectiveness
```dataview
TABLE
    average(coherence_level) as "Avg Coherence",
    average(performance.conversion) as "Conversion Rate",
    count(rows) as "Total Posts"
FROM #content
WHERE status = "published"
GROUP BY content_type
SORT average(performance.conversion) DESC
```

## 3. Active Projects
```dataview
TASK
FROM #content
WHERE status = "draft" OR status = "review"
GROUP BY content_type
```

## 4. Pattern Integration Health
```dataview
TABLE
    length(patterns_referenced) as "Patterns",
    coherence_level as "Coherence",
    platform as "Platform"
FROM #content
WHERE length(patterns_referenced) > 0
SORT coherence_level DESC
LIMIT 10
```