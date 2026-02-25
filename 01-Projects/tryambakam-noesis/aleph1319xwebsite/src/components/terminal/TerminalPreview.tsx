import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./terminal.module.css";

type TerminalMode = "scripted" | "live";
type TerminalStatus = "connecting" | "ready" | "degraded";
type TerminalRole = "system" | "user" | "assistant" | "warning";
type TerminalCommandSource = "scripted" | "live" | "live-fallback";

export interface TerminalLine {
  readonly id: string;
  readonly role: TerminalRole;
  readonly text: string;
}

export interface ScriptedTranscriptEntry {
  readonly command: string;
  readonly response: string | readonly string[];
}

export interface TerminalLiveAdapter {
  connect: (signal: AbortSignal) => Promise<void>;
  runCommand: (command: string, signal: AbortSignal) => Promise<string | readonly string[]>;
  disconnect?: () => Promise<void> | void;
}

export interface TerminalPreviewProps {
  className?: string;
  hostname?: string;
  username?: string;
  workdir?: string;
  suggestionCommands?: readonly string[];
  scriptedTranscript?: readonly ScriptedTranscriptEntry[];
  liveAdapter?: TerminalLiveAdapter | null;
  autoConnectLive?: boolean;
  liveConnectTimeoutMs?: number;
  onClose?: () => void;
  onConnectionChange?: (mode: TerminalMode, status: TerminalStatus) => void;
  onCommandResolved?: (result: {
    command: string;
    normalizedCommand: string;
    source: TerminalCommandSource;
    output: readonly string[];
  }) => void;
}

const DEFAULT_SCRIPTED_TRANSCRIPT: readonly ScriptedTranscriptEntry[] = [
  {
    command: "help",
    response: [
      "Available commands: help, status, map, scene mentorship, unlock rite_03, clear, whoami, uname -a",
      "Live mode available when preview adapter is configured."
    ]
  },
  {
    command: "status",
    response: [
      "surface    : terminal-preview",
      "mode       : scripted",
      "auth       : none",
      "network    : optional",
      "uptime     : since page-load"
    ]
  },
  {
    command: "map",
    response: [
      "/            \u2192 canvas (infinite field)",
      "/scene/:slug \u2192 scene overlay",
      "/signal      \u2192 [LOCKED] hidden route",
      "",
      "hint: the terminal is hidden in the field. look closer."
    ]
  },
  {
    command: "scene mentorship",
    response: [
      "MENTORSHIP scene:",
      "  guided adaptation, embodied protocols, applied narrative."
    ]
  },
  {
    command: "unlock rite_03",
    response: [
      "\u2713 rite_03 unlocked",
      "  the terminal phrase maps to a hidden branch in the narrative field."
    ]
  },
  {
    command: "whoami",
    response: ["noesis"]
  },
  {
    command: "uname -a",
    response: [
      "Noesis 1.3.19 aleph1319 #1 SMP PREEMPT aarch64 GNU/Noesis"
    ]
  }
];

const DEFAULT_SUGGESTIONS = ["help", "status", "map", "whoami", "unlock rite_03"] as const;

const MOTD_ASCII = [
  "\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
  "\u2502  \u2588\u2588\u2588\u2557   \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2502",
  "\u2502  \u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d   \u2502",
  "\u2502  \u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2502",
  "\u2502  \u2588\u2588\u2551\u255a\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255d  \u255a\u2550\u2550\u2550\u2550\u2588\u2588\u2551   \u2502",
  "\u2502  \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551   \u2502",
  "\u2502  \u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d   \u2502",
  "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"
].join("\n");

let lineCounter = 0;

function nextLineId(): string {
  lineCounter += 1;
  return `tl-${lineCounter}`;
}

function asArray(value: string | readonly string[]): readonly string[] {
  return typeof value === "string" ? [value] : [...value];
}

function normalizeCommand(command: string): string {
  return command.trim().replace(/\s+/g, " ").toLowerCase();
}

function statusLabel(mode: TerminalMode, status: TerminalStatus): string {
  if (mode === "live") return status === "connecting" ? "connecting" : "live";
  if (status === "degraded") return "fallback";
  return "ready";
}

function statusClass(status: TerminalStatus): string {
  if (status === "ready") return styles.statusReady;
  if (status === "connecting") return styles.statusConnecting;
  return styles.statusDegraded;
}

function lineRoleClass(role: TerminalRole): string {
  switch (role) {
    case "user": return styles.lineUser;
    case "system": return styles.lineSystem;
    case "assistant": return styles.lineAssistant;
    case "warning": return styles.lineWarning;
    default: return "";
  }
}

function toReason(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "live adapter unavailable";
}

function buildPrompt(user: string, host: string, dir: string): string {
  return `${user}@${host}:${dir}$ `;
}

export function TerminalPreview({
  className,
  hostname = "aleph1319",
  username = "noesis",
  workdir = "~",
  suggestionCommands = DEFAULT_SUGGESTIONS,
  scriptedTranscript = DEFAULT_SCRIPTED_TRANSCRIPT,
  liveAdapter = null,
  autoConnectLive = false,
  liveConnectTimeoutMs = 4500,
  onClose,
  onConnectionChange,
  onCommandResolved
}: TerminalPreviewProps) {
  const transcriptMap = useMemo(() => {
    const map = new Map<string, readonly string[]>();
    for (const entry of scriptedTranscript) {
      map.set(normalizeCommand(entry.command), asArray(entry.response));
    }
    return map;
  }, [scriptedTranscript]);

  const [mode, setMode] = useState<TerminalMode>("scripted");
  const [status, setStatus] = useState<TerminalStatus>("ready");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lines, setLines] = useState<readonly TerminalLine[]>([
    { id: nextLineId(), role: "system", text: "Last login: " + new Date().toUTCString() + " on ttys000" },
    { id: nextLineId(), role: "system", text: "Welcome to Noesis Terminal v1.3.19 \u2014 scripted mode active." },
    { id: nextLineId(), role: "system", text: "Type 'help' to see available commands." }
  ]);
  const [cmdHistory, setCmdHistory] = useState<readonly string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const liveAbortRef = useRef<AbortController | null>(null);
  const copyResetRef = useRef<number | null>(null);

  const prompt = buildPrompt(username, hostname, workdir);

  const emitConnection = useCallback(
    (nextMode: TerminalMode, nextStatus: TerminalStatus) => {
      onConnectionChange?.(nextMode, nextStatus);
    },
    [onConnectionChange]
  );

  const pushLines = useCallback((role: TerminalRole, payload: string | readonly string[]) => {
    const records = asArray(payload).map<TerminalLine>((text) => ({
      id: nextLineId(),
      role,
      text
    }));
    setLines((prev) => [...prev, ...records]);
  }, []);

  const setScriptedReady = useCallback(() => {
    setMode("scripted");
    setStatus("ready");
    emitConnection("scripted", "ready");
  }, [emitConnection]);

  const setScriptedDegraded = useCallback(
    (reason: string) => {
      setMode("scripted");
      setStatus("degraded");
      emitConnection("scripted", "degraded");
      pushLines("warning", `live mode degraded: ${reason}. falling back to scripted.`);
    },
    [emitConnection, pushLines]
  );

  const clearLiveAbort = useCallback(() => {
    liveAbortRef.current?.abort();
    liveAbortRef.current = null;
  }, []);

  const connectLive = useCallback(async () => {
    if (!liveAdapter) {
      setScriptedDegraded("no adapter configured");
      return false;
    }

    clearLiveAbort();
    const controller = new AbortController();
    liveAbortRef.current = controller;

    const timeout = window.setTimeout(() => {
      controller.abort(new DOMException("live adapter timeout", "AbortError"));
    }, liveConnectTimeoutMs);

    try {
      setMode("live");
      setStatus("connecting");
      emitConnection("live", "connecting");
      await liveAdapter.connect(controller.signal);

      if (controller.signal.aborted) {
        throw new DOMException("live adapter timeout", "AbortError");
      }

      setMode("live");
      setStatus("ready");
      emitConnection("live", "ready");
      pushLines("system", "live adapter connected. routing to cloud endpoint.");
      return true;
    } catch (error) {
      setScriptedDegraded(toReason(error));
      return false;
    } finally {
      window.clearTimeout(timeout);
      if (liveAbortRef.current === controller) {
        liveAbortRef.current = null;
      }
    }
  }, [clearLiveAbort, emitConnection, liveAdapter, liveConnectTimeoutMs, pushLines, setScriptedDegraded]);

  const scriptedOutput = useCallback(
    (command: string): readonly string[] => {
      const normalized = normalizeCommand(command);
      if (normalized === "clear") {
        setLines([
          { id: nextLineId(), role: "system", text: "terminal cleared." }
        ]);
        return [];
      }

      if (transcriptMap.has(normalized)) {
        return transcriptMap.get(normalized) ?? [];
      }

      return [
        `${command.trim()}: command not found`,
        "type 'help' for available commands."
      ];
    },
    [transcriptMap]
  );

  const runCommand = useCallback(
    async (rawCommand: string) => {
      const command = rawCommand.trim();
      if (!command || busy) return;

      setBusy(true);
      setInput("");
      setCmdHistory((prev) => [...prev, command]);
      setHistoryIdx(-1);
      pushLines("user", command);

      try {
        if (mode === "live" && status === "ready" && liveAdapter) {
          const controller = new AbortController();
          const timeout = window.setTimeout(() => {
            controller.abort(new DOMException("live command timeout", "AbortError"));
          }, liveConnectTimeoutMs);

          try {
            const result = await liveAdapter.runCommand(command, controller.signal);
            const resultLines = asArray(result);
            pushLines("assistant", resultLines);
            onCommandResolved?.({
              command,
              normalizedCommand: normalizeCommand(command),
              source: "live",
              output: resultLines
            });
          } catch (error) {
            setScriptedDegraded(toReason(error));
            const fallbackLines = scriptedOutput(command);
            if (fallbackLines.length > 0) pushLines("assistant", fallbackLines);
            onCommandResolved?.({
              command,
              normalizedCommand: normalizeCommand(command),
              source: "live-fallback",
              output: fallbackLines
            });
          } finally {
            window.clearTimeout(timeout);
          }
          return;
        }

        const output = scriptedOutput(command);
        if (output.length > 0) pushLines("assistant", output);
        onCommandResolved?.({
          command,
          normalizedCommand: normalizeCommand(command),
          source: "scripted",
          output
        });
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [busy, liveAdapter, liveConnectTimeoutMs, mode, onCommandResolved, pushLines, scriptedOutput, setScriptedDegraded, status]
  );

  const handleModeSelect = useCallback(
    async (nextMode: TerminalMode) => {
      if (nextMode === "scripted") {
        clearLiveAbort();
        void liveAdapter?.disconnect?.();
        setScriptedReady();
        return;
      }
      await connectLive();
    },
    [clearLiveAbort, connectLive, liveAdapter, setScriptedReady]
  );

  const handleCopy = useCallback(async () => {
    if (!navigator.clipboard) {
      pushLines("warning", "clipboard: permission denied");
      return;
    }

    const text = lines.map((line) => {
      if (line.role === "user") return `${prompt}${line.text}`;
      return line.text;
    }).join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      pushLines("warning", `copy failed: ${toReason(error)}`);
    }
  }, [lines, prompt, pushLines]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIdx === -1) return;
        const nextIdx = historyIdx + 1;
        if (nextIdx >= cmdHistory.length) {
          setHistoryIdx(-1);
          setInput("");
        } else {
          setHistoryIdx(nextIdx);
          setInput(cmdHistory[nextIdx] ?? "");
        }
      }
    },
    [cmdHistory, historyIdx]
  );

  // Auto-connect live mode
  useEffect(() => {
    if (!autoConnectLive) return;
    void connectLive();
  }, [autoConnectLive, connectLive]);

  // Escape key closes terminal
  useEffect(() => {
    if (!onClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Auto-scroll viewport
  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [lines]);

  // Cleanup
  useEffect(
    () => () => {
      clearLiveAbort();
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
      void liveAdapter?.disconnect?.();
    },
    [clearLiveAbort, liveAdapter]
  );

  // Focus input on viewport click
  const handleViewportClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const canUseLive = Boolean(liveAdapter);
  const badge = statusLabel(mode, status);
  const rootCls = [styles.root, styles.shell, className].filter(Boolean).join(" ");

  return (
    <div className={rootCls} aria-label="Terminal" role="region">
      {/* Title bar (macOS window chrome) */}
      <div className={styles.titleBar}>
        <div className={styles.trafficLights}>
          <button
            type="button"
            className={`${styles.dot} ${styles.dotClose}`}
            aria-label="Close terminal"
            onClick={onClose}
          />
          <span className={`${styles.dot} ${styles.dotMinimize}`} />
          <span className={`${styles.dot} ${styles.dotMaximize}`} />
        </div>
        <span className={styles.titleText}>
          {username}@{hostname}:{workdir}
        </span>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar} role="tablist" aria-label="Terminal mode">
        <button
          className={`${styles.tab} ${mode === "scripted" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={mode === "scripted"}
          onClick={() => void handleModeSelect("scripted")}
        >
          scripted
        </button>
        <button
          className={`${styles.tab} ${mode === "live" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={mode === "live"}
          aria-disabled={!canUseLive}
          disabled={!canUseLive}
          onClick={() => void handleModeSelect("live")}
        >
          live
        </button>
        <span className={`${styles.statusPill} ${statusClass(status)}`}>
          <span className={styles.statusDot} />
          {badge}
        </span>
      </div>

      {/* Connection notice */}
      <p className={styles.notice}>
        no-auth shell &middot; {mode === "live" ? "routed to cloud endpoint" : "scripted fallback mode"} &middot; no network required
      </p>

      {/* MOTD */}
      <div className={styles.motd}>
        <div className={styles.motdAscii}>{MOTD_ASCII}</div>
        <p className={styles.motdLine}>
          <span className={styles.motdAccent}>Noesis OS</span> v1.3.19 (kernel aleph1319) &mdash;{" "}
          <span className={styles.motdSub}>tryambakam-noesis</span>
        </p>
        <p className={styles.motdLine}>agent-preview terminal &middot; no authentication required</p>
      </div>

      {/* Viewport */}
      <div
        className={styles.viewport}
        ref={viewportRef}
        aria-live="polite"
        onClick={handleViewportClick}
      >
        {lines.map((line) => (
          <p key={line.id} className={`${styles.line} ${lineRoleClass(line.role)}`}>
            <span className={styles.linePrefix}>
              {line.role === "user" ? prompt : line.role === "assistant" ? "  " : "# "}
            </span>
            <span className={styles.lineContent}>{line.text}</span>
          </p>
        ))}
        {busy && (
          <p className={`${styles.line} ${styles.lineSystem}`}>
            <span className={styles.linePrefix}>{"# "}</span>
            <span className={`${styles.lineContent} ${styles.busyIndicator}`}>
              processing<span className={styles.busyDots} />
            </span>
          </p>
        )}
      </div>

      {/* Input line */}
      <form
        className={styles.inputArea}
        onSubmit={(e) => {
          e.preventDefault();
          void runCommand(input);
        }}
      >
        <label className="sr-only" htmlFor="terminal-cmd">
          Terminal command
        </label>
        <span className={styles.promptLabel}>
          <span className={styles.promptHost}>{username}@{hostname}</span>
          :<span className={styles.promptPath}>{workdir}</span>
          <span className={styles.promptDollar}>$ </span>
        </span>
        <input
          ref={inputRef}
          id="terminal-cmd"
          className={styles.inputField}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={busy ? "" : "enter command..."}
          autoComplete="off"
          spellCheck={false}
          disabled={busy || status === "connecting"}
          autoFocus
        />
      </form>

      {/* Suggestion chips */}
      <div className={styles.suggestions} aria-label="Suggested commands">
        {suggestionCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            className={styles.chip}
            onClick={() => void runCommand(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusItem}>
            <span className={styles.statusKey}>mode:</span>
            <span className={styles.statusVal}>{mode}</span>
          </span>
          <span className={styles.statusItem}>
            <span className={styles.statusKey}>lines:</span>
            <span className={styles.statusVal}>{lines.length}</span>
          </span>
          <span className={styles.statusItem}>
            <span className={styles.statusKey}>shell:</span>
            <span className={styles.statusVal}>noesis-sh</span>
          </span>
        </div>
        <button
          type="button"
          className={`${styles.actionBtn} ${copied ? styles.actionBtnActive : ""}`}
          onClick={() => void handleCopy()}
        >
          {copied ? "\u2713 copied" : "copy"}
        </button>
      </div>
    </div>
  );
}

export default TerminalPreview;
