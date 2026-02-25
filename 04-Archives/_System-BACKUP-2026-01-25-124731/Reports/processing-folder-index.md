# Processing Folder Index Snapshot
`Runtime: 2026-01-22`

This index captures the current intake state of `processing-folder` for migration into PARA. It is a snapshot to guide sequencing and workload sizing; it is not a replacement for item-level metadata.

## High-Level Totals
- Total files in `processing-folder`: 4,531
- Total folders in `processing-folder`: 9 major collections

## Size by Collection (Approx)
- `processing-folder/Research`: 24G
- `processing-folder/PDFS`: 18G
- `processing-folder/epub`: 4.1G
- `processing-folder/Mushroom`: 2.4G
- `processing-folder/LIVINGRY ECOSYSTEM`: 2.0G
- `processing-folder/MARK passio`: 736M
- `processing-folder/adyabrahmanaha`: 255M
- `processing-folder/Audio Books`: 12K
- `processing-folder/Books`: 8.0K

## File Counts by Collection
- `Audio Books`: 1
- `Books`: 1
- `LIVINGRY ECOSYSTEM`: 199
- `MARK passio`: 26
- `Mushroom`: 395
- `PDFS`: 1,940
- `Research`: 1,135
- `adyabrahmanaha`: 380
- `epub`: 452

## Top File Types (by count)
- pdf: 3,139
- epub: 425
- md: 260
- png: 170
- jpg: 132
- docx: 57
- mp4: 53
- zip: 48
- (noext): 35
- doc: 28
- PDF: 26
- srt: 19
- rtf: 15
- css: 12
- txt: 11
- mobi: 9
- gif: 9
- pages: 8
- download: 7
- DS_Store: 7

## Notes
- Mixed case extensions exist (e.g., `pdf` and `PDF`). Normalization should be a separate, explicit decision.
- There are archives (`.zip`) and media (`.mp4`, `.m4a`, `.mp3`) that may require manual review for proper categorization.
- `processing-folder` is intake only; items are not considered migrated until indexed, tagged, and placed in PARA.
