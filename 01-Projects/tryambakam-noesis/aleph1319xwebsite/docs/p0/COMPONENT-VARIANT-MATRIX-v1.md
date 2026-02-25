# Component Variant Matrix v1

Date: 2026-02-16
Status: Frozen
Total Components: 56

Source CSV: `design-system/component-variant-matrix-v1.csv`

## Variant Axes (Global)
- Theme modes: `canvas`, `overlay`, `terminal`, `mobile-compact`
- Density: `default`, `compact`
- Device: `desktop`, `mobile`
- Emphasis: `primary`, `secondary`, `subtle` (as applicable)
- States: `default`, `hover`, `focus-visible`, `active`, `disabled`, plus `loading/error` where relevant

## Matrix

| Component | Group | Theme Modes | Density | Device | Emphasis | States | Motion |
|---|---|---|---|---|---|---|---|
| CanvasRoot | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| GridLayer | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| ParallaxFogLayer | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| SignalLineLayer | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| NodeGlyph | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| NodeLabel | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| NodeHalo | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| NodeCluster | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| EdgeConnector | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| FocusRing | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| Minimap | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| Compass | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| CameraControlsHUD | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| ZoomRail | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| CoordinateBadge | canvas-spatial | canvas,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,focus,active,disabled | drift,focus |
| GlobalTopBar | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| SectionBreadcrumb | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| CommandPalette | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| SearchInput | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| SearchResultsList | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| QuickActionDock | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| ModeSwitcher | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| StatusPill | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| ToastNotice | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| InlineHint | nav-system | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,hover,focus-visible,active,disabled | reveal,resolve |
| SceneOverlayShell | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| SceneTitleFrame | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| SceneSubtitle | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| SceneBodyRichText | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| QuoteBlock | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| PullStat | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| TimelineStrip | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| StoryStepCard | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| MediaFigure | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| CaptionMeta | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| GlitchTransitionLayer | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| DecodeTextAnimator | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| MaskRevealPanel | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| ProgressRail | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| NextScenePrompt | scene | overlay,mobile-compact | default,compact | desktop,mobile | subtle,primary | default,hover,focus-visible,active | distort,reveal,resolve |
| TerminalShell | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalHeader | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalTabs | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalViewport | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalPromptLine | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalCommandInput | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalResponseBlock | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalStatusBadge | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalCopyButton | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalSuggestionChips | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalConnectionNotice | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| TerminalFallbackTranscript | terminal | terminal,mobile-compact | default,compact | desktop,mobile | secondary,primary | default,focus-visible,active,disabled,error,loading | reveal,resolve |
| PrimaryCTAButton | conversion | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | primary,secondary,subtle | default,hover,focus-visible,active,disabled | reveal,resolve |
| SecondaryCTAButton | conversion | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | primary,secondary,subtle | default,hover,focus-visible,active,disabled | reveal,resolve |
| JourneyPathCard | conversion | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | primary,secondary,subtle | default,hover,focus-visible,active,disabled | reveal,resolve |
| EasterEggIndicator | conversion | canvas,overlay,terminal,mobile-compact | default,compact | desktop,mobile | primary,secondary,subtle | default,hover,focus-visible,active,disabled | reveal,resolve |
