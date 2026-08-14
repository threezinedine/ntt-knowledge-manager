import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	EpubReader,
	type EpubPage,
	type EpubReaderConfig,
} from "./epub-reader";

const SAMPLE_PAGES: EpubPage[] = [
	{
		id: "ch1",
		title: "Chapter 1: Down the Rabbit-Hole",
		content: (
			<>
				<p>
					Alice was beginning to get very tired of sitting by her sister on the
					bank, and of having nothing to do: once or twice she had peeped into
					the book her sister was reading, but it had no pictures or
					conversations in it, &ldquo;and what is the use of a book,&rdquo;
					thought Alice &ldquo;without pictures or conversations?&rdquo;
				</p>
				<p>
					So she was considering in her own mind (as well as she could, for the
					hot day made her feel very sleepy and stupid), whether the pleasure of
					making a daisy-chain would be worth the trouble of getting up and
					picking the daisies, when suddenly a White Rabbit with pink eyes ran
					close by her.
				</p>
				<p>
					There was nothing so very remarkable in that; nor did Alice think it so
					very much out of the way to hear the Rabbit say to itself, &ldquo;Oh
					dear! Oh dear! I shall be late!&rdquo; (when she thought it over
					afterwards, it occurred to her that she ought to have wondered at this,
					but at the time it all seemed quite natural); but when the Rabbit
					actually took a watch out of its waistcoat-pocket, and looked at it,
					and then hurried on, Alice started to her feet.
				</p>
			</>
		),
	},
	{
		id: "ch2",
		title: "Chapter 2: The Pool of Tears",
		content: (
			<>
				<p>
					&ldquo;Curiouser and curiouser!&rdquo; cried Alice (she was so much
					surprised, that for the moment she quite forgot how to speak good
					English); &ldquo;now I&rsquo;m opening out like the largest telescope
					that ever was! Good-bye, feet!&rdquo;
				</p>
				<p>
					(for when she looked down at her feet, they seemed to be almost out of
					sight, they were getting so far off). &ldquo;Oh, my poor little feet, I
					wonder who will put on your shoes and stockings for you now, dears? I
					shall be a great deal too far off to trouble myself about you.&rdquo;
				</p>
				<p>
					&ldquo;I&rsquo;m sure I&rsquo;m not Ada,&rdquo; she said, &ldquo;for
					her hair goes in such long ringlets, and mine doesn&rsquo;t go in
					ringlets at all; and I&rsquo;m sure I can&rsquo;t be Mabel, for I know
					all sorts of things, and she, oh! she knows such a very little!&rdquo;
				</p>
			</>
		),
	},
	{
		id: "ch3",
		title: "Chapter 3: A Caucus-Race and a Long Tale",
		content: (
			<>
				<p>
					They were indeed a queer-looking party that assembled on the
					bank&mdash;the birds with draggled feathers, the animals with their fur
					clinging close to them, and all dripping wet, cross, and uncomfortable.
				</p>
				<p>
					The first question of course was, how to get dry again: they had a
					consultation about this, and after a few minutes it seemed quite natural
					to Alice to find herself talking familiarly with them, as if she had
					known them all her life.
				</p>
				<p>
					&ldquo;Speak English!&rdquo; said the Eaglet. &ldquo;I don&rsquo;t
					know the meaning of half those long words, and, what&rsquo;s more, I
					don&rsquo;t believe you do either!&rdquo;
				</p>
			</>
		),
	},
	{
		id: "ch4",
		title: "Chapter 4: The Rabbit Sends in a Little Bill",
		content: (
			<>
				<p>
					It was the White Rabbit, trotting slowly back again, and looking
					anxiously about as it went, as if it had lost something; and she heard
					it muttering to itself &ldquo;The Duchess! The Duchess! Oh my dear
					paws! Oh my fur and whiskers! She&rsquo;ll get me executed, as sure as
					ferrets are ferrets!&rdquo;
				</p>
				<p>
					Alice guessed in a moment that it was looking for the fan and the pair
					of white kid gloves, and she very good-naturedly began hunting about
					for them, but they were nowhere to be seen&mdash;everything seemed to
					have changed since her swim in the pool, and the great hall, with the
					glass table and the little door, had vanished completely.
				</p>
			</>
		),
	},
];

const meta = {
	title: "Components/EpubReader",
	component: EpubReader,
} satisfies Meta<typeof EpubReader>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDemo() {
	const [page, setPage] = useState(0);
	const [config, setConfig] = useState<EpubReaderConfig>({
		fontSize: 16,
		fontFamily: "serif",
		lineHeight: 1.8,
	});

	return (
		<div
			style={{
				width: 800,
				height: 500,
				border: "1px solid var(--color-border)",
				borderRadius: 8,
				overflow: "hidden",
			}}
		>
			<EpubReader
				pages={SAMPLE_PAGES}
				currentPage={page}
				onPageChange={setPage}
				config={config}
				onConfigChange={setConfig}
			/>
		</div>
	);
}

export const Default: Story = {
	render: () => <DefaultDemo />,
};

function SansSerifDemo() {
	const [page, setPage] = useState(0);
	const [config, setConfig] = useState<EpubReaderConfig>({
		fontSize: 14,
		fontFamily: "sans-serif",
		lineHeight: 1.6,
	});

	return (
		<div
			style={{
				width: 800,
				height: 500,
				border: "1px solid var(--color-border)",
				borderRadius: 8,
				overflow: "hidden",
			}}
		>
			<EpubReader
				pages={SAMPLE_PAGES}
				currentPage={page}
				onPageChange={setPage}
				config={config}
				onConfigChange={setConfig}
			/>
		</div>
	);
}

export const SansSerif: Story = {
	render: () => <SansSerifDemo />,
};

export const SinglePage: Story = {
	render: () => (
		<div
			style={{
				width: 800,
				height: 400,
				border: "1px solid var(--color-border)",
				borderRadius: 8,
				overflow: "hidden",
			}}
		>
			<EpubReader pages={[SAMPLE_PAGES[0]]} />
		</div>
	),
};

export const Empty: Story = {
	render: () => (
		<div
			style={{
				width: 800,
				height: 300,
				border: "1px solid var(--color-border)",
				borderRadius: 8,
				overflow: "hidden",
			}}
		>
			<EpubReader pages={[]} />
		</div>
	),
};
