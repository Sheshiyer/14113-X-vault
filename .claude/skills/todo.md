# SKILLS IMPLEMENTATION TODO

## Project Goal
Transform 7 skills from scaffolded SKILL.md instructions into fully functional Claude skills with executable logic. Implement Phase 5 of modernization plan (6-8 hours, 7 sub-phases).

## In Progress
- [DONE] ~~Phase 5.1: Implement discovery-skill logic (1h)~~

## Pending

### Phase 5.2: Extraction-skill (45min)
- [DONE] ~~Add PDF extraction logic (pdftotext primary, pdfplumber fallback)~~
- [DONE] ~~Add EPUB extraction logic (ebooklib via Python)~~
- [DONE] ~~Add timeout handling~~
- [DONE] ~~Add text file output~~

### Phase 5.3: Analysis-skill (2h) ⭐ CRITICAL
- [DONE] ~~Add controlled-vocabulary.yaml loading~~
- [DONE] ~~Add Enneagram classification logic (9 types with priors)~~
- [DONE] ~~Add PARA bucket determination (89%/9.4%/1.6% weights)~~
- [DONE] ~~Add domain mapping (35 destinations)~~
- [DONE] ~~Add confidence calculation (min 0.600)~~
- [DONE] ~~Add MOC link suggestions~~
- [DONE] ~~Add JSON output generation~~

### Phase 5.4: Routing-skill (1h)
- [DONE] ~~Add analysis results loading~~
- [DONE] ~~Add PARA bucket → path mapping~~
- [DONE] ~~Add subdomain → folder mapping~~
- [DONE] ~~Add conflict detection~~
- [DONE] ~~Add duplicate strategy (skip/rename)~~
- [DONE] ~~Add path validation~~
- [DONE] ~~Add routing manifest JSON output~~

### Phase 5.5: Processing-skill (1.5h)
- [DONE] ~~Add markdown wrapper generation~~
- [DONE] ~~Add YAML frontmatter template~~
- [DONE] ~~Add file copy operations~~
- [DONE] ~~Add original file preservation~~
- [DONE] ~~Add success/failure tracking~~

### Phase 5.6: Integration-skill (1h)
- [DONE] ~~Add MOC file updating logic~~
- [DONE] ~~Add entry insertion (by category)~~
- [DONE] ~~Add bidirectional link creation~~
- [DONE] ~~Add coverage calculation~~
- [DONE] ~~Add link validation~~

### Phase 5.7: Orchestrator-skill (1h)
- [ ] Add stage sequencing logic
- [ ] Add quality gate checks (from quality-thresholds.yaml)
- [DONE] ~~Add user approval prompts~~
- [DONE] ~~Add progress tracking~~
- [DONE] ~~Add final report generation~~
- [ ] Add error handling and retry logic

### Phase 5.8: Testing & Validation
- [ ] Test discovery-skill on sample folder
- [ ] Test extraction-skill on sample PDFs/EPUBs
- [ ] Test analysis-skill on extracted texts
- [ ] Test routing-skill on analysis results
- [ ] Test processing-skill on routes
- [ ] Test integration-skill on processed files
- [ ] Test orchestrator-skill end-to-end
- [ ] Validate quality gates working
- [ ] Verify all thresholds enforced

### Phase 5.9: Documentation Updates
- [ ] Update skills/README.md with implementation status
- [ ] Update SKILL.md files with any corrections
- [ ] Create usage examples in README
- [ ] Document any deviations from original plan

## Completed (move to memory.md)
[Tasks will be marked [DONE] and moved as completed]

---

**Execution Mode**: AUTONOMOUS  
**Current Phase**: 5.1 (Discovery-skill implementation)  
**Next**: Continue through 5.2-5.9 without user prompts  
**Token Optimization**: ON (no status reports between tasks)
