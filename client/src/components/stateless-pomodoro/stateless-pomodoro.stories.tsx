import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessPomodoro } from "./stateless-pomodoro";
import type { PomodoroMode, PomodoroState } from "./stateless-pomodoro";

const noop = () => {};

const handlers = {
	onStart: noop,
	onPause: noop,
	onResume: noop,
	onSkip: noop,
	onReset: noop,
	onModeChange: noop,
};

const meta = {
	title: "Components/StatelessPomodoro",
	component: StatelessPomodoro,
	args: {
		mode: "working" as PomodoroMode,
		state: "idle" as PomodoroState,
		taskName: "Write unit tests",
		remainingSeconds: 25 * 60,
		...handlers,
	},
	argTypes: {
		mode: {
			control: "select",
			options: ["working", "short_break", "long_break"],
		},
		state: { control: "select", options: ["idle", "running", "paused"] },
		remainingSeconds: { control: { type: "number", min: 0, max: 60 * 60 } },
	},
} satisfies Meta<typeof StatelessPomodoro>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Idle states ──────────────────────────────────────────────────────────────

export const WorkingIdle: Story = {};

export const ShortBreakIdle: Story = {
	args: {
		mode: "short_break",
		remainingSeconds: 5 * 60,
		taskName: "Take a break",
	},
};

export const LongBreakIdle: Story = {
	args: {
		mode: "long_break",
		remainingSeconds: 15 * 60,
		taskName: "Long rest",
	},
};

// ── Running states ───────────────────────────────────────────────────────────

export const WorkingRunning: Story = {
	args: {
		state: "running",
		remainingSeconds: 18 * 60 + 32,
	},
};

export const ShortBreakRunning: Story = {
	args: {
		mode: "short_break",
		state: "running",
		remainingSeconds: 3 * 60 + 15,
		taskName: "Take a break",
	},
};

export const LongBreakRunning: Story = {
	args: {
		mode: "long_break",
		state: "running",
		remainingSeconds: 10 * 60 + 45,
		taskName: "Long rest",
	},
};

// ── Paused states ────────────────────────────────────────────────────────────

export const WorkingPaused: Story = {
	args: {
		state: "paused",
		remainingSeconds: 12 * 60 + 7,
	},
};

export const ShortBreakPaused: Story = {
	args: {
		mode: "short_break",
		state: "paused",
		remainingSeconds: 2 * 60 + 50,
		taskName: "Take a break",
	},
};

export const LongBreakPaused: Story = {
	args: {
		mode: "long_break",
		state: "paused",
		remainingSeconds: 8 * 60 + 22,
		taskName: "Long rest",
	},
};

// ── Edge cases ───────────────────────────────────────────────────────────────

export const TimerAtZero: Story = {
	args: {
		state: "running",
		remainingSeconds: 0,
	},
};

export const LastSeconds: Story = {
	args: {
		state: "running",
		remainingSeconds: 5,
	},
};

export const LongTaskName: Story = {
	args: {
		taskName:
			"Refactor the authentication middleware to support OAuth2 with PKCE flow and update all integration tests",
		state: "running",
		remainingSeconds: 20 * 60,
	},
};

export const AllModes: Story = {
	render: () => {
		const modes: PomodoroMode[] = ["working", "short_break", "long_break"];
		const states: PomodoroState[] = ["idle", "running", "paused"];
		const durations: Record<PomodoroMode, number> = {
			working: 25 * 60,
			short_break: 5 * 60,
			long_break: 15 * 60,
		};
		const labels: Record<PomodoroMode, string> = {
			working: "Write unit tests",
			short_break: "Take a break",
			long_break: "Long rest",
		};

		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "2rem",
				}}
			>
				{states.map((state) => (
					<div key={state}>
						<h3
							style={{
								margin: "0 0 1rem",
								textTransform: "capitalize",
							}}
						>
							{state.replace("_", " ")}
						</h3>
						<div
							style={{
								display: "flex",
								gap: "1rem",
								flexWrap: "wrap",
							}}
						>
							{modes.map((mode) => (
								<StatelessPomodoro
									key={`${mode}-${state}`}
									mode={mode}
									state={state}
									taskName={labels[mode]}
									remainingSeconds={durations[mode] - 120}
									{...handlers}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		);
	},
};
