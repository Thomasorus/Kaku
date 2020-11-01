const test = require('ava');
import parser from "./src/module"

// TITLES

test("Title 1", t => {
	const result = parser("# Title 1");
	t.is(result, `<h1 id="title-1" style="position:relative;"><a href="#title-1" aria-label="Title 1 permalink" style="display: inline-block;width: 100%;height: 100%;position: absolute;"></a>Title 1</h1>`);
});

test("Title 2", t => {
	const result = parser("## Title 2");
	t.is(result, `<h2 id="title-2" style="position:relative;"><a href="#title-2" aria-label="Title 2 permalink" style="display: inline-block;width: 100%;height: 100%;position: absolute;"></a>Title 2</h2>`);
});

// BLOCKQUOTE

test("blockquote simple", t => {
	const result = parser(`> "Kaku is mostly used for my static website build."`);
	t.is(result, `<blockquote><p>Kaku is mostly used for my static website build.</p></blockquote>`);
});

test("blockquote with author", t => {
	const result = parser(`> "Kaku is mostly used for my static website build.", Thomasorus`);
	t.is(result, `<blockquote><p>Kaku is mostly used for my static website build.</p><footer>—Thomasorus</footer></blockquote>`);
});

test("blockquote complete", t => {
	const result = parser(`> "Kaku is mostly used for my static website build.", Thomasorus, Kaku's Repo, https://github.com/Thomasorus/Kaku`);
	t.is(result, `<blockquote cite="https://github.com/Thomasorus/Kaku"><p>Kaku is mostly used for my static website build.</p><footer>—Thomasorus, <cite> Kaku's Repo</cite></footer></blockquote>`);
});


// TYPOGRAPHY

test('Bold', t => {
	const result = parser("Sometimes with *bold* inside.");
	t.is(result, "<p>Sometimes with <strong>bold</strong> inside.</p>");
});

test('code', t => {
	const result = parser("I do some \`code\` text.");
	t.is(result, "<p>I do some <code>code</code> text.</p>");
});

test('strike', t => {
	const result = parser("I do some \~code\~ text.");
	t.is(result, "<p>I do some <del>code</del> text.</p>");
});


test('italic', t => {
	const result = parser("Sometimes with _italic_ text?");
	t.is(result, "<p>Sometimes with <em>italic</em> text?</p>");
});


// PARAGRAPHS

test('simple text', t => {
	const result = parser(`simple text`);
	t.is(result, "<p>simple text</p>");
});

test('paragraph', t => {
	const result = parser(`I am a line\nI'm a second line`);
	t.is(result, "<p>I am a line</p>\n<p>I'm a second line</p>");
});

// CODE BLOCK

test('code block', t => {
	const result = parser("```\nThis is some code\n```");
	t.is(result, "<pre><code>\nThis is some code\n</pre></code>");
});

test('code block with html', t => {
	const result = parser("```\n<small>nThis is some small text</small>\n```");
	t.is(result, "<pre><code>\n<span><</span>small>nThis is some small text<span><</span>/small>\n</pre></code>");
});


// LINKS

test('Link without A11Y label', t => {
	const result = parser('{link_url, "textlink"}');
	t.is(result, `<a href="link_url">textlink</a>`);
});

test('Link with A11Y label', t => {
	const result = parser('{link_url, "textlink", a11ylabel}');
	t.is(result, `<a href="link_url" title="a11ylabel" aria-label="a11ylabel">textlink</a>`);
});

// // // IMAGES

test('Image basic', t => {
	const result = parser("[imgname]");
	t.is(result, `<img loading="lazy" src="imgname">`);
});

test('Image with alt', t => {
	const result = parser("[imgname, altText]");
	t.is(result, `<img loading="lazy" src="imgname" alt="altText">`);
});

test('Image with alt and caption', t => {
	const result = parser('[imgname, altText, "figcaptionText"]');
	t.is(result, `<figure><img loading="lazy" src="imgname" alt="altText"><figcaption>figcaptionText</figcaption></figure>`);
});

// LISTS

test('Bullet list', t => {
	const result = parser("- AAA\n- BBB\n- CCC");
	t.is(result, "<ul><li>AAA</li>\n<li>BBB</li>\n<li>CCC</li></ul>");
});

test('Ordered list', t => {
	const result = parser(`+ Number 1\n+ Number 2\n+ Number 3`);
	t.is(result, `<ol><li>Number 1</li>\n<li>Number 2</li>\n<li>Number 3</li></ol>`);
});

test('Descriptive list', t => {
	const result = parser(`? Term 1 : definition 1\n? Term 2 : definition 2`);
	t.is(result, `<dl><dt>Term 1</dt><dd>definition 1</dd>\n<dt>Term 2</dt><dd>definition 2</dd></dl>`);
});

// VIDEO

test('Video', t => {
	const result = parser(`| videoUrl.mp4 |`);
	t.is(result, `<video controls preload="metadata" src="videoUrl.mp4" type="video/mp4"></video>`);
});

test('Video gif', t => {
	const result = parser(`| videoUrl.mp4, g |`);
	t.is(result, `<video autoplay="true" playsinline="true" loop="true" mute="true" preload="metadata" src="videoUrl.mp4" type="video/mp4"></video>`);
});

// AUDIO

test('Audio', t => {
	const result = parser(`| AudioUrl.mp3 |`);
	t.is(result, `<audio controls preload="metadata" src="AudioUrl.mp3" type="audio/mpeg"></audio>`);
});