---
type: index
created: 2024-12-09
updated: 2024-12-09
---
# Content System Dashboards Index

## Available Dashboards
```dataview
TABLE
    file.mtime as "Last Updated"
FROM "02-Areas/Content-System/Dashboards"
WHERE file.name != "_index"
SORT file.name ASC
```

## Recent Updates
```dataview
TABLE
    file.mtime as "Updated",
    file.folder as "Location"
FROM "02-Areas/Content-System/Dashboards"
WHERE file.mtime >= date(today) - dur("7 days")
SORT file.mtime DESC
```