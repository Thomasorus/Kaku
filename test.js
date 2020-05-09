const test = require('ava');
const p = require("./parser_new.js");

test('Bold', t => {
	const result = p.parser("Sometimes with *bold* inside.");
	t.is(result, "Sometimes with <strong>bold</strong> inside.");
});


test('code', t => {
	const result = p.parser("I do some \`code\` text.");
	t.is(result, "I do some <code>code</code> text.");
});

test('italic', t => {
	const result = p.parser("Sometimes with _italic_ text?");
	t.is(result, "Sometimes with <em>italic</em> text?");
});

test('paragraph', t => {
	const result = p.parser(`\nI am a line\n\n`);
	t.is(result, "<p>I am a line</p>");
});