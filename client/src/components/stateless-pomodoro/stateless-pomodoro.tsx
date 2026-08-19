import styles from "./stateless-pomodoro.module.scss";

export type PomodoroMode = "working" | "short_break" | "long_break";

export type PomodoroState = "idle" | "running" | "paused";

type Props = {
	mode: PomodoroMode;
	state: PomodoroState;
	taskName: string;
	remainingSeconds: number;
	onStart: () => void;
	onPause: () => void;
	onResume: () => void;
	onSkip: () => void;
	onReset: () => void;
	onModeChange: (mode: PomodoroMode) => void;
};

const MODE_LABELS: { value: PomodoroMode; label: string }[] = [
	{ value: "working", label: "Working" },
	{ value: "short_break", label: "Short Break" },
	{ value: "long_break", label: "Long Break" },
];

function formatTime(totalSeconds: number): string {
	const m = Math.floor(totalSeconds / 60);
	const s = totalSeconds % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function StatelessPomodoro({
	mode,
	state,
	taskName,
	remainingSeconds,
	onStart,
	onPause,
	onResume,
	onSkip,
	onReset,
	onModeChange,
}: Props) {
	return (
		<div className={styles.container} data-mode={mode}>
			<div className={styles.modeBar} role="tablist">
				{MODE_LABELS.map(({ value, label }) => (
					<button
						key={value}
						role="tab"
						aria-selected={mode === value}
						className={`${styles.modeTab} ${mode === value ? styles.modeTabActive : ""}`}
						onClick={() => onModeChange(value)}
						disabled={state === "running"}
					>
						{label}
					</button>
				))}
			</div>

			<div className={styles.taskName}>{taskName}</div>

			<div className={styles.timer}>{formatTime(remainingSeconds)}</div>

			<div className={styles.controls}>
				{state === "idle" && (
					<button
						className={styles.primaryBtn}
						onClick={onStart}
					>
						Start
					</button>
				)}
				{state === "running" && (
					<>
						<button
							className={styles.primaryBtn}
							onClick={onPause}
						>
							Pause
						</button>
						<button
							className={styles.secondaryBtn}
							onClick={onSkip}
						>
							Skip
						</button>
					</>
				)}
				{state === "paused" && (
					<>
						<button
							className={styles.primaryBtn}
							onClick={onResume}
						>
							Resume
						</button>
						<button
							className={styles.secondaryBtn}
							onClick={onReset}
						>
							Reset
						</button>
						<button
							className={styles.secondaryBtn}
							onClick={onSkip}
						>
							Skip
						</button>
					</>
				)}
			</div>
		</div>
	);
}
