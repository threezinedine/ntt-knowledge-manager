import { useState } from "react";
import { AddIcon, SpeakerIcon } from "../../icons";
import styles from "./stateless-dictionary.module.scss";

export type DefinitionItem = {
	definition: string;
	example: string;
};

export type MeaningItem = {
	partOfSpeech: string;
	definitions: DefinitionItem[];
};

export type DictionaryEntry = {
	word: string;
	phonetic: string;
	audio_url: string;
	meanings: MeaningItem[];
	vietnamese_meaning: string;
};

type StatelessDictionaryProps = {
	className?: string;
	entry: DictionaryEntry | null;
	loading: boolean;
	error: string | null;
	similarWords?: string[];
	onSubmit: (word: string) => void;
	onPlayAudio?: () => void;
	onAdd?: (word: string) => void;
};

const TABS = [
	{ id: "english", label: "English" },
	{ id: "vietnamese", label: "Vietnamese" },
	{ id: "examples", label: "Examples" },
] as const;

function EnglishTab({
	entry,
	onPlay,
}: {
	entry: DictionaryEntry;
	onPlay: () => void;
}) {
	return (
		<div>
			<div className={styles.wordRow}>
				<div className={styles.word}>{entry.word}</div>
				<button
					type="button"
					className={styles.audioBtn}
					onClick={onPlay}
					aria-label="Play pronunciation"
				>
					<SpeakerIcon width={16} height={16} />
				</button>
			</div>
			{entry.phonetic && (
				<div className={styles.phonetic}>{entry.phonetic}</div>
			)}
			{entry.meanings.map((m) => (
				<div key={m.partOfSpeech}>
					<div className={styles.partOfSpeech}>{m.partOfSpeech}</div>
					<ol className={styles.definitionList}>
						{m.definitions.map((d) => (
							<li key={d.definition} className={styles.definitionItem}>
								{d.definition}
								{d.example && (
									<div className={styles.example}>"{d.example}"</div>
								)}
							</li>
						))}
					</ol>
				</div>
			))}
		</div>
	);
}

function VietnameseTab({ entry }: { entry: DictionaryEntry }) {
	return (
		<div>
			{entry.vietnamese_meaning ? (
				<div className={styles.vietnameseText}>
					{entry.vietnamese_meaning}
				</div>
			) : (
				<div className={styles.vietnameseEmpty}>
					No Vietnamese meaning added yet.
				</div>
			)}
		</div>
	);
}

function ExamplesTab({ entry }: { entry: DictionaryEntry }) {
	const examples = entry.meanings.flatMap((m) =>
		m.definitions
			.filter((d) => d.example)
			.map((d) => ({ partOfSpeech: m.partOfSpeech, example: d.example })),
	);

	if (examples.length === 0) {
		return <div className={styles.vietnameseEmpty}>No examples available.</div>;
	}

	return (
		<div>
			{examples.map((e) => (
				<div key={e.example} className={styles.exampleBlock}>
					<div className={styles.examplePartOfSpeech}>{e.partOfSpeech}</div>
					<div className={styles.example}>"{e.example}"</div>
				</div>
			))}
		</div>
	);
}

export function StatelessDictionary({
	className,
	entry,
	loading,
	error,
	similarWords = [],
	onSubmit,
	onPlayAudio,
	onAdd,
}: StatelessDictionaryProps) {
	const [activeTab, setActiveTab] = useState<string>("english");
	const classes = [styles.content, className].filter(Boolean).join(" ");

	const handleTabClick = (tabId: string) => {
		setActiveTab(tabId);
		onPlayAudio?.();
	};

	return (
		<div className={classes} data-testid="dictionary-content">
			{loading && (
				<div className={styles.loading}>Looking up...</div>
			)}
			{error && !loading && (
				<>
					<div className={styles.error}>{error}</div>
					{similarWords.length > 0 && (
						<div className={styles.similarWords}>
							<div className={styles.similarWordsLabel}>Similar words:</div>
							<div className={styles.similarWordsList}>
								{similarWords.map((w) => (
									<button
										key={w}
										type="button"
										className={styles.similarWordChip}
										onClick={() => onSubmit(w)}
									>
										{w}
									</button>
								))}
							</div>
						</div>
					)}
				</>
			)}
			{!entry && !loading && !error && (
				<div className={styles.empty}>
					Type a word to look it up.
				</div>
			)}
			{entry && !loading && (
				<>
					<button
						type="button"
						className={styles.addBtn}
						onClick={() => onAdd?.(entry.word)}
						aria-label="Add word"
					>
						<AddIcon width={20} height={20} />
					</button>
					<div className={styles.tabs}>
						{TABS.map((t) => (
							<button
								key={t.id}
								type="button"
								className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
								onClick={() => handleTabClick(t.id)}
							>
								{t.label}
							</button>
						))}
					</div>
					<div className={styles.tabPanel}>
						{activeTab === "english" && (
							<EnglishTab
								entry={entry}
								onPlay={() => onPlayAudio?.()}
							/>
						)}
						{activeTab === "vietnamese" && (
							<VietnameseTab entry={entry} />
						)}
						{activeTab === "examples" && (
							<ExamplesTab entry={entry} />
						)}
						{similarWords.length > 0 && (
							<div className={styles.similarWords}>
								<div className={styles.similarWordsLabel}>Similar words:</div>
								<div className={styles.similarWordsList}>
									{similarWords.map((w) => (
										<button
											key={w}
											type="button"
											className={styles.similarWordChip}
											onClick={() => onSubmit(w)}
										>
											{w}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
