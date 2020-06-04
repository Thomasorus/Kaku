# Kaku 書く

Kaku (write) is my own markup language. It's inspired by Markdown with a few modification for quotes, links, images and lists handling. It was created to fit my needs.

This repositoty contains a parser for Kaku.

## Syntax

Kaku uses some syntax from Markdown for basic text transformation. However it uses an array like declaration with special characters for things like quotes, links and images.

### Typography

#### Title 1: 

Example : `# Title`

Will return:
```Html
<h1>Title</h1>
```

#### Title 2: 

Example : `## Title`

Will return:
```Html
<h2>Title</h2>
```

Same for titles 3 to 6...

#### Bold : 

Example : `*bold*`

Will return:
```Html
<strong>bold</strong>
```

#### Emphasis : 

Example : `_emphasis_`

Will return:
```Html
<em>emphasis</em>
```

#### Code : 

Example : `code`

Will return:
```Html
<code>code</code>
```

### Quotes

Quotes are presented like an array and can take up to 4 arguments:

1. The quote itself
2. The author
3. The source of the quote
4. The url of the quote

Example: `~ "I am the quoted text!", Author of quote, Source of quote, url_of_quote ~`

Will return:

```Html
<blockquote cite="url_of_quote">
    <p>And even, quotes!</p>
    <footer>—Author, <cite> Source of quote</cite></footer>
</blockquote>
```

**Important!** The quoted text must be put between double quotes to allow the use of commas. Example: `"My text is, like, awesome!"`

### Links

Links are presented like an array and can take up to 3 arguments:

1. The link url
2. The text of the link
3. The text for the accessibility label (optionnal)

Example: `{ https://github.com/Thomasorus/Kaku, "check the this link to the repo!", Link to Kaku's repo}`

Will return:

```Html
<a href="https://github.com/Thomasorus/Kaku" aria-label="Link to Kaku's repo">check the this link to the repo!</a>
```

**Important!** The embeded text of the link must be put between double quotes to allow the use of commas. Example: `"My repo is, like, awesome!"`

### Images

Images are presented like an array and can take up to 3 arguments:

1. The image name or url
2. The image alt text for accessibility
3. The image caption (optionnal, will create a figure and figcaption)

Image with alt text : `[imgname, altText]`

Will return;

```Html
<img src="imgname" alt="altText">
```

Image with caption : `[img_url, My alt text, "This is my, super figcaption text"]` 

Will return:

 ```Html
 <figure>
     <img src="img_url" alt="My alt text">
     <figcaption>This is my super figcaption text</figcaption>
</figure>
 ```

### Bullet list

```html
- AAA
- BBB
- CCC
```

Will return:

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

Will return:

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

Will return:

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
