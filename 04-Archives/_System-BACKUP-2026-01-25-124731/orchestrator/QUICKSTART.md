# 🚀 QUICK START GUIDE

## Getting Started in 3 Steps

### Step 1: Install
```bash
cd /Volumes/madara/2026/twc-vault/_System/orchestrator
./install.sh
```

### Step 2: Test (Dry Run)
```bash
# Process 1 file to test (won't make any changes)
python main.py process --batch-size 1 --dry-run
```

### Step 3: Process Files
```bash
# Process 5 files for real
python main.py process --batch-size 5

# Check what happened
python main.py status
```

---

## Common Commands

### Check Vault Status
```bash
python main.py status
```

### Generate Inventory Report
```bash
python main.py inventory --output ../Reports/intake-processing/inventory.md
```

### Process Specific Batch Size
```bash
python main.py process --batch-size 10
```

### Verify Vault Integrity
```bash
python main.py verify --check-type all
```

---

## MCP Server Setup

### 1. Start MCP Server
```bash
python mcp_server.py config.yaml
```

### 2. Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vault-orchestrator": {
      "command": "python",
      "args": [
        "/Volumes/madara/2026/twc-vault/_System/orchestrator/mcp_server.py",
        "/Volumes/madara/2026/twc-vault/_System/orchestrator/config.yaml"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

### 4. Test with Claude
Ask Claude:
- "Process all new files in my vault"
- "Find all psychology-related documents"
- "Show me vault status"

---

## What Happens When You Process Files?

```
1. Discovery Stage ✅
   → Scans processing-folder/
   → Finds PDFs and EPUBs
   → Calculates SHA-256 hashes
   → Checks for duplicates

2. Extraction Stage ✅
   → Extracts text from files
   → Saves to output/extractions/
   → Updates database

3. Analysis Stage ✅
   → Classifies with AI (OpenRouter)
   → Assigns tags (68 controlled vocabulary)
   → Maps to Enneagram types
   → Detects domains (26 categories)
   → Suggests MOCs

4. Routing Stage ✅ [NEW]
   → Determines PARA bucket
   → Checks for duplicates
   → Resolves conflicts
   → Plans destination path

5. Processing Stage ✅ [NEW]
   → Generates markdown wrapper
   → Moves file to PARA location
   → Updates database

6. Integration Stage ✅ [NEW]
   → Updates MOC files
   → Updates PARA indices
   → Creates links
```

---

## Troubleshooting

### Problem: No files found
**Solution**: Add PDF or EPUB files to `/Volumes/madara/2026/twc-vault/processing-folder`

### Problem: API errors
**Solution**: Check OpenRouter API key in `config.yaml`

### Problem: Files not moving
**Solution**: Run with `--dry-run` first to debug

### Problem: Permission errors
**Solution**: Check folder permissions: `chmod -R 755 /Volumes/madara/2026/twc-vault`

---

## Configuration Tips

### Edit config.yaml

**Change batch size**:
```yaml
processing:
  batch_size: 50  # Process 50 files at once
```

**Change PARA structure**:
```yaml
vault:
  para_structure:
    projects: /path/to/01-Projects
    areas: /path/to/02-Areas
    resources: /path/to/03-Resources
    archives: /path/to/04-Archives
```

**Change duplicate strategy**:
```yaml
routing:
  duplicate_strategy: skip  # or 'rename' or 'overwrite'
```

---

## File Locations

```
orchestrator/
├── data/
│   └── inventory.db           # SQLite database
├── output/
│   ├── extractions/           # Extracted text
│   ├── analyses/              # AI analysis results
│   ├── logs/                  # Processing logs
│   └── manifests/             # Batch manifests
├── pipeline/
│   ├── stage1_discovery.py
│   ├── stage2_extraction.py
│   ├── stage3_analysis.py
│   ├── stage4_routing.py      # ✅ NEW
│   ├── stage5_processing.py   # ✅ NEW
│   └── stage6_integration.py  # ✅ NEW
└── mcp_server.py              # ✅ NEW
```

---

## Next Steps

1. ✅ **Test with 1 file** (dry-run)
2. ✅ **Test with 5 files** (real)
3. ✅ **Check vault structure** (verify files moved correctly)
4. ✅ **Check MOCs** (verify links created)
5. 🔄 **Scale up** (process larger batches)
6. 🎯 **Set up MCP** (integrate with Claude)

---

## Support

- **Documentation**: See `README.md` and `COMPLETION_SUMMARY.md`
- **Logs**: Check `output/logs/orchestrator.log`
- **Database**: View with `sqlite3 data/inventory.db`

---

**Ready to transform your vault! 🚀**
