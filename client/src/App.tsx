import { useState } from "react";
import {
	Archive,
	BookOpen,
	FileText,
	FolderOpen,
	Plus,
	Search,
	Settings,
	Star,
} from "lucide-react";
import { ToggleButton } from "./components";
import { ThemeProvider, useTheme } from "./theme";
import "./App.css";

const notes = [
	{
		title: "Product brief",
		excerpt:
			"A compact vision for the first release and its measurable outcomes.",
		label: "Strategy",
		time: "12m",
	},
	{
		title: "Database patterns",
		excerpt:
			"Seed data, migration notes, and a practical approach to local persistence.",
		label: "Engineering",
		time: "Yesterday",
	},
	{
		title: "Research: field notes",
		excerpt:
			"A collection of early observations ready to become a working model.",
		label: "Research",
		time: "Mon",
	},
];

function AppContent() {
	const [activeNote, setActiveNote] = useState(notes[0].title);
	const { theme, toggleTheme } = useTheme();

	return (
		<main className="workspace">
			<aside className="sidebar">
				<div className="brand">
					<BookOpen size={19} /> Knowledge
				</div>
				<button className="new-note">
					<Plus size={17} /> New note
				</button>
				<nav aria-label="Main navigation">
					<a className="nav-item active" href="#notes">
						<FileText size={17} /> Notes <span>18</span>
					</a>
					<a className="nav-item" href="#folders">
						<FolderOpen size={17} /> Folders
					</a>
					<a className="nav-item" href="#starred">
						<Star size={17} /> Starred
					</a>
					<a className="nav-item" href="#archive">
						<Archive size={17} /> Archive
					</a>
				</nav>
				<button className="settings">
					<Settings size={17} /> Settings
				</button>
			</aside>
			<section className="note-list" id="notes">
				<header>
					<div>
						<p className="eyebrow">Personal library</p>
						<h1>Notes</h1>
					</div>
					<div className="header-actions">
						<ToggleButton
							value={theme === "dark"}
							onValueChanged={toggleTheme}
							trueIcon="fa-solid fa-moon"
							falseIcon="fa-solid fa-sun"
							aria-label="Toggle dark theme"
						/>
						<button className="icon-button" title="Search notes">
							<Search size={19} />
						</button>
					</div>
				</header>
				<div className="search">
					<Search size={16} />
					<input
						aria-label="Search notes"
						placeholder="Search notes"
					/>
				</div>
				<div className="list-label">RECENTLY EDITED</div>
				<div className="notes">
					{notes.map((note) => (
						<button
							className={`note-row ${activeNote === note.title ? "selected" : ""}`}
							key={note.title}
							onClick={() => setActiveNote(note.title)}
						>
							<div>
								<strong>{note.title}</strong>
								<p>{note.excerpt}</p>
							</div>
							<time>{note.time}</time>
						</button>
					))}
				</div>
			</section>
			<article className="editor">
				<header className="editor-header">
					<span className="crumb">Notes / {activeNote}</span>
					<button className="icon-button" title="Star note">
						<Star size={19} />
					</button>
				</header>
				<div className="document">
					<div className="document-meta">
						<span className="tag">Strategy</span>
						<span>Edited 12 minutes ago</span>
					</div>
					<h2>{activeNote}</h2>
					<p className="lead">
						A place to turn scattered observations into decisions
						that stay useful.
					</p>
					<hr />
					<h3>Focus</h3>
					<p>
						Build a quiet, dependable system for collecting ideas,
						connecting context, and returning to the important
						pieces when work gets complicated.
					</p>
					<h3>Next steps</h3>
					<ul>
						<li>Clarify the first workflow.</li>
						<li>Capture feedback in one shared place.</li>
						<li>
							Review the open questions at the end of the week.
						</li>
					</ul>
				</div>
			</article>
		</main>
	);
}

function App() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}

export default App;
