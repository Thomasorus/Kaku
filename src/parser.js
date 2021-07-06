function parser(text) {
    const blocks = text.split(/\n\n/g)
    let parsedText = ''
    for (let i = 0; i < blocks.length; i++) {
        const el = blocks[i];
        const codeRegex = new RegExp("^\\\`(.*$)", 'gim')
        const codeTest = codeRegex.test(el)

        if(!codeTest) {
            let tempText = el
                .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
                .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
                .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
                .replace(/^#### (.*$)/gim, '<h4>$1</h4>') // h4 tag
                .replace(/^##### (.*$)/gim, '<h5>$1</h5>') // h5 tag
                .replace(/^###### (.*$)/gim, '<h6>$1</h6>') // h6 tag
                .replace(/^----$/gim, '<hr>') // hr tag
                .replace(/\_(.*)\_/gim, '<em>$1</em>') // em text
                .replace(/\*(.*)\*/gim, '<strong>$1</strong>') // strong text
                .replace(/\`(.*)\`/gim, '<code>$1</code>') // strong text
                .replace(/\~(.*)\~/gim, '<strike>$1</strike>') // strike text
                .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>') // strike text
                .replace(/^\+ (.*$)/gim, '<ol><li>$1</li></ol>') // strike text
                .replace(/^\? (.*) : (.*$)/gim, '<dl><dt>$1</dt><dd>$2</dd></dl>') // strike text
                .replace(/\(link:(.*)\)/gim, function (char, item) { return parseLinks(item) }) // links
                .replace(/\(image:(.*)\)/gim, function (char, item) { return parseImage(item) }) // image
                .replace(/\(video:(.*)\)/gim, function (char, item) { return parseVideo(item) }) // links
                .replace(/\(audio:(.*)\)/gim, "<audio controls src='$1' type='audio/mpeg'") // links
                .replace(/\(quote:(.*)\)/gim, function (char, item) {return parseQuote(item) }) // blockquote

            const htmlRegex = new RegExp("^\<(.*)\>", 'gim')
            const htmlTest = htmlRegex.test(tempText)

            if(!htmlTest) {
                tempText = `<p>${tempText}</p>`
            }

            if(tempText) {
                parsedText += tempText
            }
        } else if (codeTest) {
            const splitCode = el.trim().split("\n")
            splitCode.shift()
            splitCode.pop()
            const tempText = `<pre><code>${splitCode.join("\n")}</code></pre>`
            if(tempText) {
                parsedText += tempText
            }
        }
    }

    const cleanedText = parsedText
        .replace(/<\/ul>\n<ul>/g, '')
        .replace(/<\/ol>\n<ol>/g, '')
        .replace(/<\/dl>\n<dl>/g, '')

    return cleanedText
}

function parseLinks(linkContent) {
    const linkData = /^(.+?(?=text|title|label|$))/.exec(linkContent)
    const textData = /text:(.+?(?=title|label|$))/.exec(linkContent)
    const titleData = /title:(.+?(?=text|label|$))/.exec(linkContent)
    const labelData = /label:(.+?(?=text|title|$))/.exec(linkContent)
    const link = linkData ? `href="${linkData[1].trim()}"` : ""
    const text = textData ? textData[1].trim() : linkData[1].trim()
    const title = titleData ? `title="${titleData[1].trim()}"` : ""
    const label = labelData ?  `aria-label="${labelData[1].trim()}"` : ""
    const html = `<a ${link} ${title} ${label}>${text}</a>`
    return html
}

function parseImage(imgContent) {    
    const linkData = /^(.+?(?= |\)$))/.exec(imgContent)
    const altData = /alt:(.+?(?=figcaption|$))/.exec(imgContent)
    const figcaptionData = /figcaption:(.+?(?=alt|$))/.exec(imgContent)
    const matches = imgContent.split(/alt:(\.+?(?=( figcaption:|\)$)))|figcaption:(\.+?(?=( alt:|\)$)))/g)
    const link = linkData[1] ? `src="${linkData[1].trim()}"` : ""
    const alt = altData[1] ? `alt="${altData[1].trim()}"` : ""
    const figcaption = figcaptionData[1] ? `<figcaption>${figcaptionData[1].trim()}</figcaption>` : false

    if (figcaption) {
        const html = `<figure><img ${link} ${alt}></img>${figcaption}</figure>`
        return html
    } else {
        const html = `<img ${link} ${alt}></img>`
        return html
    }
}

function parseVideo(videoContent) {
    const array = videoContent.split(" ")
    const matches = array.filter(Boolean);
    const link = matches[0] ? `src="${matches[0].trim()}"` : ""
    const controls = matches[1] ? "autoplay loop mute" : "controls"
    const format = /\.mp4|\.webm|\.mov/.exec(matches[0])
    const source = `type="video/${format}"`
    const html = `<video ${link} ${controls} ${source}></video>`
    return html
}

function parseQuote(quoteContent) {
    const quoteData = /^(.+?(?=author|source|link|$))/.exec(quoteContent)
    const authorData = /author:(.+?(?=source|link|$))/.exec(quoteContent)
    const sourceData = /source:(.+?(?=author|link|$))/.exec(quoteContent)
    const linkData = /link:(.+?(?=author|source|$))/.exec(quoteContent)
    const quote = quoteData ? quoteData[1].trim() : false
    const author = authorData ? authorData[1].trim() : false
    const source = sourceData ? sourceData[1].trim() : false
    const link = linkData ? linkData[1].trim() : false
    const cite = link ? `cite="${link}"` : ""

    let figcaption = ""
    if(author && !source && !link) {
        figcaption = `<figcaption>— ${author}</figcaption>`
    } else if (author && source && !link) {
        figcaption = `<figcaption>— ${author}, ${source}</figcaption>`
    } else if (author && source && link) {
        figcaption =`<figcaption>— ${author}, <a href="${link}">${source}</a></figcaption>` 
    } else if (!author && source && link) {
        figcaption =`<figcaption><a href="${link}">${source}</a></figcaption>` 
    } else if (!author && !source && link) {
        figcaption =`<figcaption><a href="${link}">${link}</a></figcaption>` 
    }  else if (!author && source && !link) {
        figcaption =`<figcaption>${source}</figcaption>` 
    }

    const html = `<figure><blockquote ${cite}>${quote}</blockquote>${figcaption}</figure>`
    return html
}