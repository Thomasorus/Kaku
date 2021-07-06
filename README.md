# Kaku 書く

Kaku (write) is my own markup language. It's inspired by Markdown with a few modification for quotes, links, images and lists handling. It was created to fit my needs. This repositoty contains a parser for Kaku.

## Branches

The parser exists in two branches:

- the `master` branch is the classic parser as explained below
- the `responsive-lazy-images` is a modified version with more advanced image management, but severely opiniated so it can work with [Ronbun](https://github.com/Thomasorus/Ronbun)

If you are new to Kaku, use the master branch!

## License

Kaku 書く is a free to use by individuals and organizations that do not operate by capitalist principles. For more information see the [license](LICENSE) file.

## Syntax

Kaku uses some syntax from Markdown for basic text transformation. However it uses an array like declaration with special characters for things like quotes, links and images.

### Typography

#### Title 1

Example : `# Title`

Will return:

```Html
<h1>Title</h1>
```

#### Title 2

Example : `## Title`

Will return:

```Html
<h2>Title</h2>
```

Same for titles 3 to 6...

#### Bold

Example : `*bold*`

Will return:

```Html
<strong>bold</strong>
```

#### Emphasis

Example : `_emphasis_`

Will return:

```Html
<em>emphasis</em>
```

#### Code

Example : `code`

Will return:

```Html
<code>code</code>
```

#### Code Block

Example:

\`\`\`

This is some code

\`\`\`

Will return:

```
This is some code
```

#### Striked throught

Example : ~strike~

Will return:

```Html
<code>strike</code>
```

### Quotes

Quotes can take up to 4 arguments:

1. The quote itself
2. The author
3. The source of the quote
4. The url of the quote

Example: `(quote: I am the quoted text! author: Author of quote source: Source of quote link: url_of_quote`

Will return:

```Html
<figure>
    <blockquote cite="url_of_quote">
        And even, quotes!
    </blockquote>
    <figcaption>—Author, <a href="url_of_quote"> Source of quote</a></figcaption>
</figure>

```

### Links

Links can take up to 3 arguments:

1. The link url
2. The text of the link
3. The text for the accessibility label (optionnal)
4. The text for the title (optionnal)

Example: `(link: https://github.com/Thomasorus/Kaku text: Check the this link to the repo! label: Link to Kaku's repo title: Hover title)`

Will return:

```Html
<a href="https://github.com/Thomasorus/Kaku" aria-label="Link to Kaku's repo" title="Hover title">Check the this link to the repo!</a>
```

### Images

Images can take up to 3 arguments:

1. The image name or url
2. The image alt text for accessibility
3. The image caption (optionnal, will create a figure and figcaption)

Image with alt text : `(image: img_url, alt: the alternate text)`

Will return;

```Html
<img src="img_url" alt="the alternate text">
```

Image with caption : `(image: img_url, alt: the alternate text figcaption: the text under the image)`

Will return:

 ```Html
 <figure>
     <img src="img_url" alt="the alternate text">
     <figcaption>the text under the image</figcaption>
</figure>
 ```

### Bullet lists

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

### Ordered lists

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

### Descriptive lists

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

### Videos and audios

Videos can take up to 2 arguments:

1. The video name or url (mp3 only for audio)
2. If a video you can add a `g` parameter to use the video as a gif

Classic video: `(video: videoUrl)`

Will return:

```Html
<video controls="" preload="metadata" src="videoUrl" type="video/mp4"></video>
```

Video as gif: `(video: videoUrl autoplay)`

Will return:

```Html
<video autoplay="true" playsinline="true" loop="true" mute="true" preload="metadata" src="videoUrl" type="video/mp4"></video>
```

Audio: `(audio: audioUrl)`

Will return;

```Html
<audio controls="" preload="metadata" src="audioUrl" type="audio/mpeg"></audio>
```

Note: all audio and video elements come with the `preload="metadata"` attribute to help slower connections.

### HR

`----`

Will return:

`<hr>`

## Run tests

This projects comes with unit tests. To run them:

- Install with `yarn`
- Configure tests in `test.js`
- Run tests with `npx ava`

## Credits

This project has been redone several time and the current version is based for the parsing part on the [Simple Markdown Parser](https://gist.github.com/fuzzyfox/5843166) of by William Duyck. All the others parts have been done by me.
