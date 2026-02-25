# CONVENTIONS: TWC Vault Standards

## YAML Frontmatter
Every note should contain the following metadata for consistent agent ingestion:

```yaml
---
type: [note|moc|project|resource]
category: [Primary Domain]
subcategory: [Subdomain]
enneagram: [Type 1-9]
tags: [#tag1, #tag2]
status: [active|archive|triage]
---
```

## Linking Patterns
- **MOC → Note**: Use `[[Note-Name]]` in the themed list.
- **Note → MOC**: Every note should link back to its primary MOC at the bottom.
- **Cross-Links**: Use `#cross-reference` tags for disparate topics.

## Naming Standards
- **Global**: Use `Kebab-Case` for filenames.
- **Migration**: "WitnessOS" is the legacy term. All new files must use "Tryambakam Noesis" or "Noesis Kernel".
- **PARA Paths**: Files must reside in the folder matching their `status` or `type`.
