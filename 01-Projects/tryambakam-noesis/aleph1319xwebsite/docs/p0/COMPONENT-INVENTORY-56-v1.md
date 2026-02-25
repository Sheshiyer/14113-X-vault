# Component Inventory (56) v1

Date: 2026-02-16
Status: Frozen

## Canvas and Spatial Primitives
1. CanvasRoot
2. GridLayer
3. ParallaxFogLayer
4. SignalLineLayer
5. NodeGlyph
6. NodeLabel
7. NodeHalo
8. NodeCluster
9. EdgeConnector
10. FocusRing
11. Minimap
12. Compass
13. CameraControlsHUD
14. ZoomRail
15. CoordinateBadge

## Navigation and System Controls
16. GlobalTopBar
17. SectionBreadcrumb
18. CommandPalette
19. SearchInput
20. SearchResultsList
21. QuickActionDock
22. ModeSwitcher (Canvas/Terminal)
23. StatusPill
24. ToastNotice
25. InlineHint

## Narrative Scene Components
26. SceneOverlayShell
27. SceneTitleFrame
28. SceneSubtitle
29. SceneBodyRichText
30. QuoteBlock
31. PullStat
32. TimelineStrip
33. StoryStepCard
34. MediaFigure
35. CaptionMeta
36. GlitchTransitionLayer
37. DecodeTextAnimator
38. MaskRevealPanel
39. ProgressRail
40. NextScenePrompt

## Terminal TUI Components
41. TerminalShell
42. TerminalHeader
43. TerminalTabs
44. TerminalViewport
45. TerminalPromptLine
46. TerminalCommandInput
47. TerminalResponseBlock
48. TerminalStatusBadge (scripted/live)
49. TerminalCopyButton
50. TerminalSuggestionChips
51. TerminalConnectionNotice
52. TerminalFallbackTranscript

## Conversion and Journey Components
53. PrimaryCTAButton
54. SecondaryCTAButton
55. JourneyPathCard
56. EasterEggIndicator

## Component State Requirements (All Applicable Components)
- Default
- Hover
- Focus-visible
- Active
- Disabled
- Loading (where relevant)
- Error (where relevant)

## Figma Variant Axes (Minimum)
- Theme mode: canvas/overlay/terminal
- Density: default/compact
- Device: desktop/mobile
- Emphasis: primary/secondary/subtle
