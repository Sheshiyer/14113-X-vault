# Vault Intake Orchestrator

Automated system for processing unprocessed content into the PARA-structured vault with intelligent AI tagging, Muse-Enneagram classification, and cross-linking.

## 🎯 Overview

The Vault Intake Orchestrator processes 1.3TB of unprocessed content (PDFs, EPUBs, research collections) through a 6-stage pipeline:

1. **Discovery** - Scan and catalog files
2. **Extraction** - Extract text from PDFs/EPUBs
3. **Analysis** - AI-powered classification and tagging
4. **Routing** - PARA bucket assignment
5. **Processing** - Create markdown wrappers
6. **Integration** - Update MOCs and indices

## 📁 Directory Structure

```
orchestrator/
├── main.py                 # CLI entry point
├── config.yaml             # Configuration
├── requirements.txt        # Python dependencies
├── core/                   # Core orchestration logic
│   ├── orchestrator.py     # Main orchestrator
│   ├── state_manager.py    # SQLite state tracking
│   └── logger.py           # Logging setup
├── pipeline/               # Pipeline stages (to be implemented)
├── extractors/             # Content extraction
│   ├── pdf_extractor.py    # PDF text extraction
│   ├── epub_extractor.py   # EPUB extraction
│   └── metadata_extractor.py
├── analyzers/              # AI analysis (to be implemented)
│   ├── openrouter_client.py
│   ├── tag_classifier.py
│   ├── enneagram_mapper.py
│   └── domain_detector.py
├── routers/                # PARA routing (to be implemented)
├── processors/             # File processing (to be implemented)
├── integrators/            # MOC integration (to be implemented)
├── utils/                  # Utility functions (to be implemented)
├── templates/              # Jinja2 templates (to be implemented)
├── tests/                  # Test suite
├── data/                   # SQLite databases
└── output/                 # Processing outputs
    ├── extractions/        # Extracted text JSON
    ├── analyses/           # AI analysis results
    ├── manifests/          # Routing manifests
    └── logs/               # Processing logs
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Volumes/madara/2026/twc-vault/_System/orchestrator
pip install -r requirements.txt
```

### 2. Configuration

Edit `config.yaml` to customize:
- OpenRouter API settings (already configured)
- Processing parameters (batch size, workers)
- Extraction settings (pages, chapters)
- Quality thresholds

### 3. Run Commands

#### Generate Inventory
```bash
python main.py inventory --output ../_System/Reports/intake-processing/inventory.md
```

#### Process Files
```bash
# Dry run (simulation)
python main.py process --batch-size 10 --dry-run

# Actual processing
python main.py process --batch-size 10

# Custom source
python main.py process --batch-size 50 --source /path/to/folder
```

#### Verify Vault
```bash
python main.py verify --check-type all
python main.py verify --check-type duplicates
python main.py verify --check-type broken_links
```

#### Check Status
```bash
python main.py status
python main.py status --detail-level detailed
```

## ⚙️ Configuration

### OpenRouter API

The orchestrator uses OpenRouter for AI analysis:
- **Model**: `openai/gpt-oss-120b:free`
- **Rate Limit**: 10 requests/second
- **API Key**: Configured in config.yaml

### Processing Settings

```yaml
processing:
  batch_size: 50           # Files per batch
  parallel_workers: 4      # Concurrent extraction workers
  retry_attempts: 3        # Retries for failed operations
  preserve_originals: true # Keep original files
```

### Extraction Settings

```yaml
extraction:
  pdf:
    pages_to_extract: 5    # First N pages
    include_last_page: true
    max_text_length: 10000
  epub:
    chapters_to_extract: 1
    include_toc: true
```

## 📊 Database Schema

### Files Table
Tracks all discovered and processed files with status, hash, metadata.

### Batches Table
Records batch processing runs with statistics and configuration.

### Processing Stages Table
Logs each pipeline stage execution per file.

### Duplicates Table
Identifies duplicate files by SHA-256 hash.

## 🔍 Quality Metrics

Success criteria:
- **Processing Success Rate**: >95%
- **Metadata Completeness**: >90%
- **MOC Coverage**: >85%
- **Link Validity**: >98%
- **Error Rate**: <5%

## 📝 Workflow Example

```bash
# 1. Generate pre-processing inventory
python main.py inventory --output pre-inventory.md

# 2. Test with small batch (dry run)
python main.py process --batch-size 10 --dry-run

# 3. Process small batch
python main.py process --batch-size 10

# 4. Verify results
python main.py verify --check-type all

# 5. Check status
python main.py status --detail-level detailed

# 6. Process larger batches
python main.py process --batch-size 100
```

## 🎨 Features

### Implemented
- ✅ Configuration system (YAML)
- ✅ Logging infrastructure
- ✅ SQLite state management
- ✅ PDF text extraction (PyPDF2 + pdfplumber)
- ✅ CLI interface
- ✅ Batch processing framework
- ✅ Inventory reporting

### In Progress
- 🚧 EPUB extraction
- 🚧 Pipeline stages (discovery, analysis, routing, processing, integration)
- 🚧 OpenRouter AI integration
- 🚧 PARA routing logic
- 🚧 Markdown wrapper generation
- 🚧 MOC updates
- 🚧 Muse-Enneagram classification

### Planned
- 📋 MCP server for Claude integration
- 📋 Claude skills
- 📋 Quality dashboard
- 📋 Automated testing
- 📋 Content enhancement
- 📋 Duplicate resolution

## 🔧 Development Status

**Phase 1: Core Infrastructure** ✅ COMPLETE
- Directory structure
- Configuration
- Core orchestrator
- State management
- Logging
- PDF extraction
- CLI interface

**Phase 2: Extraction Pipeline** 🚧 IN PROGRESS
- Next: Implement discovery stage
- Next: Complete EPUB extractor
- Next: Add metadata extraction

**Phase 3: AI Analysis** 📋 PENDING
- OpenRouter client
- Tag classification (68 controlled vocabulary)
- Enneagram mapping (9 types)
- Domain detection (26 categories)

**Phase 4-6**: Routing, Processing, Integration (PENDING)

**Phase 7-8**: MCP Server, Skills, Testing (PENDING)

## 📚 Documentation

- [Implementation Plan](../../plans/virtual-tickling-ladybug.md)
- [Configuration Reference](config.yaml)
- [Controlled Vocabulary](../Tags/controlled-vocabulary.md)
- [Muse-Enneagram Framework](../../02-Areas/Muse-Enneagram-Framework/)
- [Metadata Schema](../structure/metadata-schema.md)

## 🐛 Troubleshooting

### Import Errors
```bash
# Ensure dependencies are installed
pip install -r requirements.txt
```

### Permission Errors
```bash
# Make main.py executable
chmod +x main.py
```

### Database Issues
```bash
# Delete and recreate databases
rm data/*.db
python main.py inventory  # Will recreate on first run
```

## 📄 License

Part of The Why Chromosome vault system.

---

**Version**: 1.0.0 (Initial Implementation)
**Last Updated**: 2026-01-22
**Status**: Core infrastructure complete, pipeline stages in progress
