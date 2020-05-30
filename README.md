# Kaku 書く

Kaku (write) is a parser for my own markup language.
The markup is heavily inspired by Markdown with a few modification for link, image and list handling.

## Project state

This is an experiment more than a full fledged project and thus, several bugs may still be present. The code is un-optimised and probably unfinished. Feel free to fork or do a pull request.

## Syntax

### Text

Title 1 : `# Title`  => `<h1>Title</h1>`

Title 2 : `# Title 2`  => `<h2>Title 2</h2>`

Bold text : `*bold*` => `<strong>bold</strong>`.

Italic text : `_italic_` => `<em>italic</em>`.

Quote text : `> This is a citation` => `<blockquote>This is a citation</blockquote>`

Code text : ``` `This is code` ``` => ` <code>This is code</code> `

### Links

Links can have 3 arguments:

1. The link url
2. The text of the link
3. The text for the accessibility label (optionnal)

Example: `{link_url, textlink, a11ylabel}` => `<a href="link_url" ara-label="a11ylabel">textlink</a>`

### Images

The image tag is generated using `[]`. It has 3 arguments :

1. The image name or url
2. The image alt text for accessibility
3. The image caption (optionnal)

Image with alt text : `[imgname, altText]` => `<img src="imgname" alt="altText"></img>`

Image with caption : `[imgname, altText, figcaptionText]` => `<figure><img src="imgname" alt="altText"></img><figaption>figcaptionText</figcaption></figure>`

### Bullet list

```html
- AAA
- BBB
- CCC
```

Will return :

```html
<ul>
    <li>AAA</li>
    <li>BBB</li>
    <li>CCC</li>
</ul>
```

### Ordered list

```html
+ Number 1
+ Number 1
+ Number 1
```

Will return :

```html
<ol>
    <li>Number 1</li>
    <li>Number 2</li>
    <li>Number 3</li>
</ol>
```

### Descriptive list

```html
? Term 1 : definition 1
? Term 2 : definition 2
```

Will return :

```html
<dl>
    <dt>Term 1</dt>
    <dd>definition 1</dd>
    <dt>Term 2</dt>
    <dd>definition 2</dd>
</dl>
```

### Video

To be determined...

### Audio

To be determined...

## Run tests

This projects come with tests, even if some of them are broken. To run them:

- Install with `yarn`
- Configure tests in `test.js`
- Run tests with `npx ava`
