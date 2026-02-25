---
name: orchestrator-skill
description: Meta-coordinator that orchestrates all 6 pipeline stages for vault content ingestion. This skill should be used when performing complete migrations of books/papers/documents into a PARA-structured vault. Coordinates discovery-skill (inventory), extraction-skill (text), analysis-skill (Enneagram+PARA), routing-skill (destinations), processing-skill (markdown), and integration-skill (MOCs). Implements quality gates, progress tracking, and user approval checkpoints. Based on proven 6-stage architecture with 100% success rate across 3,565 files.
version: 2.0
stage: meta-coordinator
dependencies:
  - discovery-skill
  - extraction-skill
  - analysis-skill
  - routing-skill
  - processing-skill
  - integration-skill
  - shared/controlled-vocabulary.yaml
  - shared/quality-thresholds.yaml
  - shared/modernized-principles.md
outputs:
  - final-migration-report.md
  - pipeline-statistics.json
  - pipeline-status.json
quality_gates:
  success_rate_min: 0.95
  metadata_completeness_min: 0.90
  moc_coverage_min: 0.85
  link_validity_min: 0.98
  error_rate_max: 0.05
---

# ⭐ Orchestrator Skill - Meta-Coordinator for 6-Stage Pipeline

**Pipeline Stage**: Meta-Coordinator (Discovery → Extraction → Analysis → Routing → Processing → Integration)  
**Role**: Orchestrates all 6 pipeline stages with quality gates and user approval checkpoints

---

## Overview

> 💡 **Purpose**: This skill orchestrates the complete 6-stage content ingestion pipeline, coordinating all stages from file discovery through MOC integration with quality gates and user approval at each checkpoint.

This skill performs end-to-end migration coordination by invoking the 6 specialized pipeline skills in sequence. It transforms raw file collections into fully classified, routed, and integrated vault content using proven orchestration logic with quality gates at each stage.

**Key Innovation**: Interactive stage-by-stage execution with user approval checkpoints, ensuring quality control and human oversight throughout the pipeline. Real-time progress tracking and comprehensive final reporting.

**Quality Standards**: >95% success rate, >90% metadata completeness, >85% MOC coverage (proven on 3,565 files with 100% pipeline success)

**The 6 Stages**:
1. **Discovery** (discovery-skill) - Inventory + SHA-256 hashing
2. **Extraction** (extraction-skill) - Text extraction from PDFs/EPUBs
3. **Analysis** (analysis-skill) - Enneagram + PARA classification ⭐
4. **Routing** (routing-skill) - Destination path mapping
5. **Processing** (processing-skill) - Markdown generation + file copy
6. **Integration** (integration-skill) - MOC updates + linking

---

## When to Use

Use this skill when:
- ✅ Migrating a collection of files into the vault (books, papers, documents)
- ✅ Processing files through all 6 pipeline stages is required
- ✅ Quality gates and user approval at each stage are desired
- ✅ Processing folder has new content ready to ingest
- ✅ Running a complete end-to-end migration with comprehensive reporting

**Prerequisites**:
- Source folder contains PDF/EPUB files
- Vault PARA structure exists (01-Projects, 02-Areas, 03-Resources, 04-Archives)
- Shared resources loaded (controlled-vocabulary.yaml, quality-thresholds.yaml)
- All 6 pipeline skills are accessible

**User Request Examples**:
```
"Process the files in processing-folder/new-books/"
"Migrate this collection using the 6-stage pipeline"
"Run a complete ingestion on these PDFs"
```

**Not Suitable For**:
- ❌ Single-file processing (use individual stage skills directly)
- ❌ Partial pipeline execution (invoke specific stage skills)
- ❌ Quick classification without full integration

---

## Core Process

> 🔍 **Input**: Source folder path containing PDF/EPUB files  
> 📝 **Output**: Fully migrated vault content + final-migration-report.md

### Phase 0: Pre-Flight Checklist

Before starting the pipeline, verify all prerequisites are met.

**Commands**:
```bash
# 1. Check controlled vocabulary exists
ls -lh ../shared/controlled-vocabulary.yaml

# 2. Check quality thresholds exists
ls -lh ../shared/quality-thresholds.yaml

# 3. Check source folder has files
find [SOURCE_FOLDER] -type f \( -name "*.pdf" -o -name "*.epub" \) | wc -l

# 4. Check vault PARA structure exists
ls -d /Volumes/madara/2026/twc-vault/0*
```

**Expected Result**: All checks pass

> ⚠️ **Warning**: If ANY check fails, STOP and report to user before proceeding.

---

### Stage 1: Discovery (Inventory + Hashing)

**Invoke**: `discovery-skill`

Scan the source folder for all PDF and EPUB files, calculate SHA-256 hash for each file to enable duplicate detection, and record file metadata.

**Process**:
1. Scan source folder for PDF/EPUB files
2. Calculate SHA-256 hash for each file
3. Record file size, format, path
4. Check for duplicates against existing vault
5. Create discovery manifest JSON

**Quality Gate**:
- ✅ All files have SHA-256 hash
- ✅ File sizes recorded correctly
- ✅ Formats detected correctly
- ✅ Duplicate detection complete

**Output**: `discovery-manifest.json`

**User Approval**: Present file count, total size, duplicates found. Ask: "Proceed to extraction?"

---

### Stage 2: Extraction (Text from Files)

**Invoke**: `extraction-skill`

Extract text content from PDFs and EPUBs for classification analysis.

**Process**:
1. Extract text from PDFs (first 5 pages + last page)
2. Extract text from EPUBs (first chapter + TOC)
3. Handle extraction failures gracefully with timeout
4. Save extracted text to individual files
5. Track extraction success rate

**Quality Gate**:
- ✅ Text extracted with minimum 100 characters
- ✅ Completed within 30-second timeout per file
- ✅ No file corruption detected
- ✅ Extraction success rate tracked

**Output**: `extractions/[filename].txt` for each file

**User Approval**: Present extraction stats (success/skip/fail counts). Ask: "Proceed to analysis?"

---

### Stage 3: Analysis (Enneagram + PARA) ⭐ CRITICAL

**Invoke**: `analysis-skill`

Classify each file using reality-tested Enneagram and PARA vocabularies from 3,565 proven files.

**Process**:
1. Load controlled-vocabulary.yaml (single source of truth)
2. **Global Context Pass**: Query the Meru index (.venv-meru) to find semantically similar existing documents.
3. Classify each text by Enneagram type (1-9)
4. Assign PARA bucket (Resources 89%, Areas 9.4%, Projects 1.6%)
5. Map to domain (35 proven destinations)
6. Calculate confidence score (minimum 0.600)
7. Suggest MOC links based on content

**Quality Gate**:
- ✅ Enneagram type assigned to every file
- ✅ PARA bucket determined
- ✅ Confidence > 0.600 for 95%+ files
- ✅ Domain category mapped
- ✅ Average confidence > 0.620

**Output**: `analysis-results.json`

**User Approval**: Present classification summary:
- Enneagram distribution (expect 75.5% Type 5)
- PARA distribution (expect 89% Resources)
- Top 5 domains
- Average confidence score

Ask: "Classifications look good? Proceed to routing?"

**Special**: If Type 5 > 70%, report archetype pattern: "Eclectic Scholar (Type 5→7 stress visible)"

---

### Stage 4: Routing (Destination Mapping)

**Invoke**: `routing-skill`

Convert analysis results into physical vault paths with conflict resolution.

**Process**:
1. Convert analysis results to physical paths
2. Map subdomain to vault folder structure
3. Check for path conflicts
4. Handle duplicate strategy (skip/rename/overwrite)
5. Validate destination folders exist

**Quality Gate**:
- ✅ All files have destination paths assigned
- ✅ No unresolved path conflicts
- ✅ Destination folders validated
- ✅ Duplicate strategy applied consistently

**Output**: `routing-manifest.json`

**User Approval**: Present routing summary:
- Files by PARA bucket
- Files by top domain
- Any conflicts/renames

Ask: "Routes look correct? Proceed to processing?"

---

### Stage 5: Processing (Markdown + Copy)

**Invoke**: `processing-skill`

Generate markdown wrappers with complete metadata and copy files to vault destinations.

**Process**:
1. Generate markdown wrapper with YAML frontmatter
2. Include metadata (Enneagram, PARA, domain, tags, MOCs)
3. Copy/link original files to destinations
4. Create bidirectional links
5. Preserve original files in processing-folder

**Quality Gate**:
- ✅ Markdown wrappers created for all files
- ✅ Frontmatter complete (>90% fields populated)
- ✅ Original files copied/linked successfully
- ✅ File operations successful with >95% success rate

**Output**: 
- Markdown files in vault destinations
- Original files copied to destinations

**User Approval**: Present processing stats:
- Files processed successfully
- Metadata completeness percentage
- Any file operation errors

Ask: "Files processed. Proceed to MOC integration?"

---

### Stage 6: Integration (MOC Updates)

**Invoke**: `integration-skill`

Update Map of Content (MOC) files to establish bidirectional links and calculate coverage.

**Process**:
1. Update existing MOCs with new entries
2. Create new MOCs if needed (from templates)
3. Establish bidirectional links
4. Update PARA bucket INDEX.md files
5. Calculate MOC coverage percentage

**Quality Gate**:
- ✅ MOC links functional
- ✅ Bidirectional links created
- ✅ MOC coverage >85%
- ✅ No broken links (>98% validity)

**Output**: Updated MOC files in vault root

**User Approval**: Present integration stats:
- MOC coverage percentage (target >85%, proven 92.8%)
- MOCs updated
- New entries added
- Link validity percentage

Ask: "Integration complete. Finalize migration?"

---

### Post-Migration: Final Report

After Stage 6 completes, generate comprehensive migration report.

**Report Structure**:
```markdown
# Migration Complete - [COLLECTION NAME]

## Summary
- **Total Files**: X processed
- **Success Rate**: Y% (target >95%)
- **Metadata Completeness**: Z% (target >90%)
- **MOC Coverage**: W% (target >85%)

## Enneagram Distribution
- Type 5 (Investigator): X% [vs 75.5% historical]
- Type 3 (Achiever): Y%
- [... all 9 types]

## PARA Distribution
- Resources: X% [vs 89% historical]
- Areas: Y% [vs 9.4% historical]
- Projects: Z% [vs 1.6% historical]

## Domain Breakdown (Top 10)
1. Knowledge/Research: X files
2. Skills-Development: Y files
[... top 10]

## Quality Metrics
- ✅ All thresholds met/exceeded
- ✅ No critical errors
- ✅ Collection archetype: [detected pattern]

## Archetype Analysis
[If Type 5 > 70%]
- Pattern: "Eclectic Scholar (Type 5→4→7)"
- Stress: Type 5→7 visible (X% in Knowledge/Research)
- Integration: Type 5→8 recommended (move to Areas/Projects)

## Files Renamed
[List any renamed source folders]

## Next Steps
- Review MOCs for accuracy
- Consider cross-collection bridges
- Archive source folder as [NAME]-MIGRATED-YYYY-MM-DD
```

**Output Path**: `final-migration-report.md`

**Final User Action**: Ask: "Rename source folder to mark migration complete?"

## Quality Monitoring

Throughout execution, track and report:

**Real-Time**:
- Files processed / total
- Current stage (1-6)
- Success / skip / error counts
- Estimated time remaining

**Per-Stage**:
- Stage success rate
- Time elapsed
- Any warnings or errors

**Final Validation**:
Load `../shared/quality-thresholds.yaml` and verify:
- Success rate ≥ 95% ✅
- Metadata completeness ≥ 90% ✅
- MOC coverage ≥ 85% ✅
- Link validity ≥ 98% ✅
- Error rate ≤ 5% ✅

If ANY threshold fails, report to user and ask: "Some quality thresholds not met. Continue anyway or review?"

## Error Handling

**Retry Conditions**:
- Extraction timeout → retry with increased timeout
- Temporary file system errors → retry up to 3 times
- Transient failures → exponential backoff

**Skip Conditions**:
- Corrupted file → log and skip
- Unsupported format after 3 attempts → skip
- Confidence < 0.500 → flag for manual review

**Fail Conditions**:
- Invalid PARA structure → STOP and report
- Controlled vocabulary missing → STOP and report
- Critical system error → STOP and report

**Always**: Present errors to user and ask for guidance before continuing.

## Progress Checkpoints

**After each stage**, present:
1. Stage name and status (✅ Complete / ⚠️ Warnings / ❌ Failed)
2. Key metrics for this stage
3. Any issues or warnings
4. **User decision**: Proceed / Review / Abort

**Never proceed automatically** - always get user approval.

## Resources

**Required**:
- `../shared/controlled-vocabulary.yaml` - Vocabulary (580 lines)
- `../shared/quality-thresholds.yaml` - Thresholds (200 lines)
- `../shared/modernized-principles.md` - Architecture reference (2,911 words)

**Skills to Invoke** (in order):
1. `discovery-skill` - Stage 1
2. `extraction-skill` - Stage 2
3. `analysis-skill` - Stage 3 ⭐
4. `routing-skill` - Stage 4
5. `processing-skill` - Stage 5
6. `integration-skill` - Stage 6

## Notes

- **Interactive, not batch**: Get user approval after each stage
- **Quality gates enforced**: Never skip validation checks
- **Proven architecture**: 100% success rate on 3,565 files
- **Archetype aware**: Detect and report Type 5 patterns
- **No API costs**: Native Claude (not OpenRouter)
- **Session state**: Use markdown/JSON files (not SQLite)
- **Preserve originals**: Always keep source files

**This is the meta-skill**. It coordinates the other 6 skills to execute the full pipeline.

---

## Implementation Notes

**Note**: Orchestrator coordinates all 6 pipeline stages with quality gates and user approval checkpoints.

### Implementation Logic

**1. Stage Invocation Sequencing**:
```bash
#!/bin/bash
# Pipeline execution order

echo "=== ORCHESTRATOR: 6-Stage Pipeline ==="
echo "Source: $SOURCE_FOLDER"
echo "Destination: /Volumes/madara/2026/twc-vault"
echo ""

# Stage 1: Discovery
echo "▶ Stage 1: Discovery (scanning files...)"
# Invoke: @skill discovery-skill with source_folder=$SOURCE_FOLDER
# Output: discovery-manifest.json
# Quality gate: Check file count > 0

# Stage 2: Extraction
echo "▶ Stage 2: Extraction (extracting text...)"
# Invoke: @skill extraction-skill with manifest=discovery-manifest.json
# Output: extracted-texts/ folder
# Quality gate: Check extraction rate >= 90%

# Stage 3: Analysis ⭐ CRITICAL
echo "▶ Stage 3: Analysis (classifying content...)"
# Invoke: @skill analysis-skill with texts=extracted-texts/
# Output: analysis-results.json
# Quality gate: Check confidence >= 0.600 for 95%+ files

# 🚦 USER APPROVAL CHECKPOINT 1
echo ""
echo "=== USER APPROVAL REQUIRED ==="
echo "Analysis complete. Review analysis-results.json"
read -p "Proceed to routing? (y/n): " PROCEED
if [ "$PROCEED" != "y" ]; then exit 0; fi

# Stage 4: Routing
echo "▶ Stage 4: Routing (mapping paths...)"
# Invoke: @skill routing-skill with analysis=analysis-results.json
# Output: routing-manifest.json
# Quality gate: Check conflicts < 5%

# �� USER APPROVAL CHECKPOINT 2
echo ""
echo "=== USER APPROVAL REQUIRED ==="
echo "Routing complete. Review routing-manifest.json"
echo "Destinations: $(jq '.statistics.by_para' routing-manifest.json)"
read -p "Proceed to processing? (y/n): " PROCEED
if [ "$PROCEED" != "y" ]; then exit 0; fi

# Stage 5: Processing
echo "▶ Stage 5: Processing (copying files...)"
# Invoke: @skill processing-skill with manifest=routing-manifest.json
# Output: Files copied to vault + markdown wrappers
# Quality gate: Check success rate >= 95%

# Stage 6: Integration
echo "▶ Stage 6: Integration (updating MOCs...)"
# Invoke: @skill integration-skill with results=processing-results.json
# Output: MOCs updated, coverage calculated
# Quality gate: Check MOC coverage >= 85%

echo ""
echo "=== PIPELINE COMPLETE ==="
```

**2. Quality Gate Enforcement**:
```bash
# Function to check quality gates
check_quality_gate() {
    METRIC=$1
    THRESHOLD=$2
    ACTUAL=$3
    
    if (( $(echo "$ACTUAL >= $THRESHOLD" | bc -l) )); then
        echo "✅ Quality Gate PASS: $METRIC ($ACTUAL >= $THRESHOLD)"
        return 0
    else
        echo "❌ Quality Gate FAIL: $METRIC ($ACTUAL < $THRESHOLD)"
        echo "⚠️ WARNING: Threshold not met. Investigate before proceeding."
        read -p "Continue anyway? (y/n): " OVERRIDE
        if [ "$OVERRIDE" = "y" ]; then
            return 0
        else
            exit 1
        fi
    fi
}

# Apply gates after each stage
check_quality_gate "File Discovery" 0 $FILE_COUNT
check_quality_gate "Extraction Rate" 0.90 $EXTRACTION_RATE
check_quality_gate "Classification Confidence" 0.60 $AVG_CONFIDENCE
check_quality_gate "Conflict Rate" 0.05 $CONFLICT_RATE
check_quality_gate "Processing Success" 0.95 $SUCCESS_RATE
check_quality_gate "MOC Coverage" 0.85 $MOC_COVERAGE
```

**3. User Approval Prompts**:
```bash
# Checkpoint 1: After Analysis
echo "=== ANALYSIS PREVIEW ==="
echo "Total files: $(jq '.routes | length' analysis-results.json)"
echo "Top Enneagram types: $(jq '.statistics.by_enneagram' analysis-results.json)"
echo "PARA distribution: $(jq '.statistics.by_para' analysis-results.json)"
echo "Avg confidence: $(jq '.statistics.avg_confidence' analysis-results.json)"
echo ""
read -p "Approve classifications? (y/n): " APPROVE

# Checkpoint 2: After Routing
echo "=== ROUTING PREVIEW ==="
echo "Destinations:"
jq -r '.routes[] | "\(.para_bucket)/\(.subdomain)/\(.destination_file)"' routing-manifest.json | head -20
echo ""
echo "... (showing first 20 of $(jq '.routes | length' routing-manifest.json))"
read -p "Approve destinations? (y/n): " APPROVE
```

**4. Progress Tracking**:
```bash
# Track pipeline progress
PIPELINE_STATUS="in_progress"
CURRENT_STAGE=1
TOTAL_STAGES=6

echo "Progress: Stage $CURRENT_STAGE/$TOTAL_STAGES ($(echo "scale=0; $CURRENT_STAGE*100/$TOTAL_STAGES" | bc)%)"

# Update status file
cat > pipeline-status.json << EOF
{
  "status": "$PIPELINE_STATUS",
  "current_stage": $CURRENT_STAGE,
  "total_stages": $TOTAL_STAGES,
  "progress_pct": $(echo "scale=2; $CURRENT_STAGE/$TOTAL_STAGES" | bc),
  "started_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

**5. Final Report Generation**:
```bash
# Generate comprehensive final report
cat > final-migration-report.md << 'ENDREPORT'
# Migration Complete Report

**Migration ID**: $MIGRATION_ID  
**Source**: $SOURCE_FOLDER  
**Started**: $START_TIME  
**Completed**: $(date +%Y-%m-%d\ %H:%M:%S)  
**Duration**: $DURATION  

## Pipeline Statistics

**Stage 1: Discovery**
- Files discovered: $DISCOVERED_COUNT
- Total size: $TOTAL_SIZE
- Duplicates detected: $DUPLICATE_COUNT

**Stage 2: Extraction**
- Texts extracted: $EXTRACTED_COUNT
- Extraction rate: ${EXTRACTION_RATE}%
- Failures: $EXTRACTION_FAILURES

**Stage 3: Analysis** ⭐
- Files classified: $CLASSIFIED_COUNT
- Avg confidence: $AVG_CONFIDENCE
- By Enneagram:
$(jq -r '.statistics.by_enneagram | to_entries[] | "  - Type \(.key): \(.value)"' analysis-results.json)
- By PARA:
$(jq -r '.statistics.by_para | to_entries[] | "  - \(.key): \(.value)"' analysis-results.json)

**Stage 4: Routing**
- Routes generated: $ROUTES_COUNT
- Conflicts: $CONFLICTS_COUNT
- Renamed: $RENAMED_COUNT
- Skipped: $SKIPPED_COUNT

**Stage 5: Processing**
- Files processed: $PROCESSED_COUNT
- Success rate: ${SUCCESS_RATE}%
- Failures: $PROCESSING_FAILURES

**Stage 6: Integration**
- MOCs updated: $MOCS_UPDATED_COUNT
- Entries added: $ENTRIES_ADDED
- MOC coverage: ${MOC_COVERAGE}%
- Link validity: ${LINK_VALIDITY}%

## Archetype Analysis

**Collection Archetype**: $ARCHETYPE_NAME  
**Dominant Type**: $DOMINANT_ENNEAGRAM ($DOMINANT_PCT%)  
**Hormone Pattern**: $HORMONE_PATTERN  

**Interpretation**:
$ARCHETYPE_INTERPRETATION

## Quality Metrics

- ✅ Success Rate: ${SUCCESS_RATE}% (target: >95%)
- ✅ Metadata Completeness: ${METADATA_COMPLETENESS}% (target: >90%)
- ✅ MOC Coverage: ${MOC_COVERAGE}% (target: >85%)
- ✅ Link Validity: ${LINK_VALIDITY}% (target: >98%)
- ✅ Error Rate: ${ERROR_RATE}% (target: <5%)

## Files Created

- Discovery manifest: discovery-manifest.json
- Extracted texts: extracted-texts/ ($EXTRACTED_COUNT files)
- Analysis results: analysis-results.json
- Routing manifest: routing-manifest.json
- Processing results: processing-results.json
- Integration statistics: integration-stats.json

## Next Steps

1. Verify files in vault are accessible
2. Test MOC links in Obsidian
3. Rename source folder: $SOURCE_FOLDER → ${SOURCE_FOLDER}-MIGRATED-$(date +%Y-%m-%d)
4. Archive processing artifacts (optional)

---
*Generated by orchestrator-skill*  
*Pipeline version: Skills Edition v1.0*
ENDREPORT
```

**6. Skill Invocation Pattern**:
```bash
# How orchestrator invokes other skills via Claude

# Option 1: Using @skill syntax (if available)
echo "Invoking discovery-skill..."
# User says: "@skill discovery-skill" with source_folder parameter

# Option 2: Using task tool
echo "Invoking discovery-skill..."
# Call task tool with agent_type="general-purpose"
# Prompt: "Execute discovery-skill from _System/skills/discovery-skill/SKILL.md
#          with source_folder=$SOURCE_FOLDER"

# Option 3: Direct execution (bash/python)
echo "Invoking discovery-skill..."
cd /Volumes/madara/2026/twc-vault/_System/skills/discovery-skill
bash execute.sh "$SOURCE_FOLDER"
```

**Implementation Status**: ✅ READY (bash orchestration + quality gates + reporting)

### Key Insight
Orchestrator is the "conductor" - it sequences skills, enforces quality, prompts user, and generates reports. It doesn't do the work itself, just coordinates.
