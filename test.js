const test = require('ava');
import parser from "./src/module"

// TITLES

test("Title 1", t => {
	const result = parser("# Title 1");
	t.is(result, `<h1 id="title-1" style="position:relative;"><a href="#title-1" aria-label="Title 1 permalink" style="display: inline-block;width: 100%;height: 100%;position: absolute;"></a>Title 1</h1>\n\n`);
});

test("Title 2", t => {
	const result = parser("## Title 2");
	t.is(result, `<h2 id="title-2" style="position:relative;"><a href="#title-2" aria-label="Title 2 permalink" style="display: inline-block;width: 100%;height: 100%;position: absolute;"></a>Title 2</h2>\n\n`);
});

// BLOCKQUOTE

test("blockquote simple", t => {
	const result = parser(`(quote: Kaku is mostly used for my static website build.)`);
	t.is(result, `<figure><blockquote >Kaku is mostly used for my static website build.</blockquote></figure>`);
});

test("blockquote with author", t => {
	const result = parser(`(quote: Kaku is mostly used for my static website build. author: Thomasorus)`);
	t.is(result, `<figure><blockquote >Kaku is mostly used for my static website build.</blockquote><figcaption>— Thomasorus</figcaption></figure>`);
});

test("blockquote complete", t => {
	const result = parser(`(quote: Kaku is mostly used for my static website build. author: Thomasorus source: Kaku's Repo link: https://github.com/Thomasorus/Kaku)`);
	t.is(result, `<figure><blockquote cite="https://github.com/Thomasorus/Kaku">Kaku is mostly used for my static website build.</blockquote><figcaption>— Thomasorus, <a href="https://github.com/Thomasorus/Kaku">Kaku's Repo</a></figcaption></figure>`);
});


// TYPOGRAPHY

test('Bold', t => {
	const result = parser("Sometimes with *bold* inside.");
	t.is(result, "<p>Sometimes with <strong>bold</strong> inside.</p>\n\n");
});

test('code', t => {
	const result = parser("I do some \`code\` text.");
	t.is(result, "<p>I do some <code>code</code> text.</p>\n\n");
});

test('strike', t => {
	const result = parser("I do some \~code\~ text.");
	t.is(result, "<p>I do some <del>code</del> text.</p>\n\n");
});


test('italic', t => {
	const result = parser("Sometimes with _italic_ text?");
	t.is(result, "<p>Sometimes with <em>italic</em> text?</p>\n\n");
});


// PARAGRAPHS

test('simple text', t => {
	const result = parser(`simple text`);
	t.is(result, "<p>simple text</p>\n\n");
});

test('paragraph', t => {
	const result = parser(`I am a line\n\nI'm a second line`);
	t.is(result, "<p>I am a line</p>\n\n<p>I'm a second line</p>\n\n");
});

// INLINE CODE

test('inline code', t => {
	const result = parser('`footer__link (link: link_url text: textlink) Sometimes with *bold* inside.`');
	t.is(result, "<code>footer__link (link: link_url text: textlink) Sometimes with *bold* inside.</code>");
});

// CODE BLOCK

test('code block', t => {
	const result = parser("```\nThis is some code\n```");
	t.is(result, "<pre><code>This is some code\n</code></pre>\n\n");
});

test('code block with html', t => {
	const result = parser("```\n<small>This is some small text</small>\n```");
	t.is(result, "<pre><code><span><</span>small>This is some small text<span><</span>/small>\n</code></pre>\n\n");
});


// LINKS

test('Link without A11Y label', t => {
	const result = parser('(link: link_url text: textlink)');
	t.is(result, `<a href="link_url">textlink</a>`);
});

test('Link with A11Y label', t => {
	const result = parser('(link: link_url text: textlink label: a11ylabel title: titleText)');
	t.is(result, `<a href="link_url" title="titleText" aria-label="a11ylabel">textlink</a>`);
});

// // // IMAGES

test('Image basic', t => {
	const result = parser("(image: imgname)");
	t.is(result, `<img loading="lazy" src="imgname" >`);
});

test('Image with alt', t => {
	const result = parser("(image: imgname alt: altText)");
	t.is(result, `<img loading="lazy" src="imgname" alt="altText">`);
});

test('Image with alt and caption', t => {
	const result = parser('(image: imgname alt: altText figcaption: figcaptionText)');
	t.is(result, `<figure><img loading="lazy" src="imgname" alt="altText"><figcaption>figcaptionText</figcaption></figure>`);
});

// LISTS

test('Bullet list', t => {
	const result = parser("- AAA\n- BBB\n- CCC");
	t.is(result, "<ul><li>AAA</li>\n<li>BBB</li>\n<li>CCC</li></ul>\n\n");
});

test('Ordered list', t => {
	const result = parser(`+ Number 1\n+ Number 2\n+ Number 3`);
	t.is(result, `<ol><li>Number 1</li>\n<li>Number 2</li>\n<li>Number 3</li></ol>\n\n`);
});

test('Descriptive list', t => {
	const result = parser(`? Term 1 : definition 1\n? Term 2 : definition 2`);
	t.is(result, `<dl><dt>Term 1</dt><dd>definition 1</dd><dt>Term 2</dt><dd>definition 2</dd></dl>\n\n`);
});

// VIDEO

test('Video', t => {
	const result = parser(`(video: videoUrl.mp4)`);
	t.is(result, `<video controls playsinline preload="metadata" src="videoUrl.mp4" type="video/mp4"></video>`);
});

test('Video gif', t => {
	const result = parser(`(video: videoUrl.mp4 autoplay)`);
	t.is(result, `<video autoplay playsinline loop mute preload="metadata" src="videoUrl.mp4" type="video/mp4"></video>`);
});

// AUDIO

test('Audio', t => {
	const result = parser(`(audio: AudioUrl.mp3)`);
	t.is(result, `<audio controls src="AudioUrl.mp3" type="audio/mpeg" preload="metadata"></audio>`);
});