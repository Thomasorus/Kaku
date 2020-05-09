const test = require('ava');
const p = require("./parser_new.js");

const demo = `
I do some \`code\`.

Sometimes with *bold*.

Sometimes with _italic_ ?

`

test('Bold', t => {
	const result = p.parser("mon test *qui* passe");
	t.is(result, "mon test <strong>qui</strong> passe");
});