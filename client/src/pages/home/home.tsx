import { Inbox, Link2, Sparkles, type LucideIcon } from "lucide-react";
import { Button, Navbar } from "../../components";
import heroImage from "../../assets/hero.png";
import styles from "./home.module.scss";

type Feature = {
	title: string;
	text: string;
	icon: LucideIcon;
};

const FEATURES: Feature[] = [
	{
		title: "Collect",
		text: "Capture ideas, notes, and research in one quiet place before they scatter.",
		icon: Inbox,
	},
	{
		title: "Connect",
		text: "Link related notes and context so insights resurface when you need them.",
		icon: Link2,
	},
	{
		title: "Decide",
		text: "Turn gathered material into clear next steps and decisions that stick.",
		icon: Sparkles,
	},
];

export function Home() {
	return (
		<div className={styles.page}>
			<Navbar
				className={styles.nav}
				isAuthenticated={false}
				loginLabel="Log in"
				onLoginClick={() => {}}
			/>
			<main>
				<section className={styles.hero}>
					<div className={styles.copy}>
						<p className={styles.eyebrow}>
							Personal knowledge workspace
						</p>
						<h1 className={styles.title}>
							Turn scattered notes into decisions
						</h1>
						<p className={styles.lead}>
							Knowledge is a quiet, dependable home for your notes
							— collect ideas, connect context, and return to what
							matters when work gets complicated.
						</p>
						<div className={styles.actions}>
							<Button size="lg" icon="fa-solid fa-plus">
								Get started
							</Button>
							<Button
								size="lg"
								variant="outline"
								icon="fa-solid fa-book-open"
							>
								Browse notes
							</Button>
						</div>
					</div>
					<img
						className={styles.heroImage}
						src={heroImage}
						alt="A preview of the Knowledge workspace"
					/>
				</section>
				<section className={styles.features}>
					<div className={styles.featuresInner}>
						<h2 className={styles.featuresTitle}>How it works</h2>
						<div className={styles.grid}>
							{FEATURES.map((feature) => {
								const Icon = feature.icon;
								return (
									<article
										className={styles.card}
										key={feature.title}
									>
										<span
											className={styles.cardIcon}
											aria-hidden="true"
										>
											<Icon size={20} />
										</span>
										<h3 className={styles.cardTitle}>
											{feature.title}
										</h3>
										<p className={styles.cardText}>
											{feature.text}
										</p>
									</article>
								);
							})}
						</div>
					</div>
				</section>
			</main>
			<footer className={styles.footer}>
				© {new Date().getFullYear()} Knowledge — a quiet home for your
				notes.
			</footer>
		</div>
	);
}
