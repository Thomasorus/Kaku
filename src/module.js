function parser(text) {
    const blocks = text.split(/\n\n/g)
    let parsedText = ''
    for (let i = 0; i < blocks.length; i++) {
        const el = blocks[i];
        const codeRegex = new RegExp("^\\\`(.*$)", 'gim')
        const codeTest = codeRegex.test(el)

        if(!codeTest) {
            let tempText = el
                .replace(/^(#) (.*$)/gim, function (char, item, item2) { return parseTitles(item, item2) }) // h1 tag
                .replace(/^(##) (.*$)/gim, function (char, item, item2) { return parseTitles(item, item2) }) // h2 tag
                .replace(/^(###) (.*$)/gim, function (char, item, item2) { return parseTitles(item, item2) }) // h3 tag
                .replace(/^(####) (.*$)/gim, function (char, item, item2) { return parseTitles(item, item2) }) // h4 tag
                .replace(/^(#####) (.*$)/gim, function (char, item, item2) { return parseTitles(item, item2) }) // h5 tag
                .replace(/^(######) (.*$)/gim, function (char, item, item2) { return parseTitles(item, item2) }) // h6 tag
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
                .replace(/\(audio:(.*)\)/gim, function (char, item) { 
                    const mp3 = item.trim()
                    return `<audio controls src="${mp3}" type="audio/mpeg" preload="metadata"></audio>`
                 }) // links
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
            const cleanedCode = []
            splitCode.forEach(el => {
                if (el.includes('<')) {
                    cleanedCode.push(el.replace(/</g, '<span><</span>'))
                  } else {
                    cleanedCode.push(el)
                }
            })
            const tempText = `<pre><code>${cleanedCode.join("\n")}</code></pre>`
            if(tempText) {
                parsedText += tempText
            }
        }
    }

    const cleanedText = parsedText
        .replace(/<\/ul>\n<ul>/g, '')
        .replace(/<\/ol>\n<ol>/g, '')
        .replace(/<\/dl>\n<dl>/g, '')
        .replace(/<p>[\s\S\n]<\/p>/gim, '')

    return cleanedText
}

function parseTitles(character, titleContent) {
    const lvl = character.length
    const titleId = titleContent.replace(/ /g, '-').trim().toLowerCase()
    const html = `<h${lvl} id="${titleId}" style="position:relative;"><a href="#${titleId}" aria-label="${titleContent} permalink" style="display: inline-block;width: 100%;height: 100%;position: absolute;"></a>${titleContent}</h${lvl}>`
    return html
}

function parseLinks(linkContent) {
    const linkData = /^(.+?(?=text|title|label|$))/.exec(linkContent)
    const textData = /text:(.+?(?=title|label|$))/.exec(linkContent)
    const titleData = /title:(.+?(?=text|label|$))/.exec(linkContent)
    const labelData = /label:(.+?(?=text|title|$))/.exec(linkContent)
    const link = linkData ? `href="${linkData[1].trim()}"` : ""
    const text = textData ? textData[1].trim() : linkData[1].trim()
    const title = titleData ? ` title="${titleData[1].trim()}"` : ""
    const label = labelData ?  ` aria-label="${labelData[1].trim()}"` : ""
    const html = `<a ${link}${title}${label}>${text}</a>`
    return html
}

function parseImage(imgContent) {    
    const linkData = /^(.+?(?=figcaption|alt|$))/.exec(imgContent)
    const altData = /alt:(.+?(?=figcaption|$))/.exec(imgContent)
    const figcaptionData = /figcaption:(.+?(?=alt|$))/.exec(imgContent)
    const matches = imgContent.split(/alt:(\.+?(?=( figcaption:|\)$)))|figcaption:(\.+?(?=( alt:|\)$)))/g)
    const link = linkData ? `src="${linkData[1].trim()}"` : ""
    const alt = altData ? `alt="${altData[1].trim()}"` : ""
    const figcaption = figcaptionData ? `<figcaption>${figcaptionData[1].trim()}</figcaption>` : false

    if (figcaption) {
        const html = `<figure><img loading="lazy" ${link} ${alt}>${figcaption}</figure>`
        return html
    } else {
        const html = `<img loading="lazy" ${link} ${alt}>`
        return html
    }
}

function parseVideo(videoContent) {
    const array = videoContent.split(" ")
    const matches = array.filter(Boolean);
    const link = matches[0] ? `src="${matches[0].trim()}"` : ""
    const controls = matches[1] ? "autoplay playsinline loop mute" : "controls playsinline"
    const format = /\.mp4|\.webm|\.mov/.exec(matches[0])
    const source = `type="video/${format.toString().slice(1)}"`
    const html = `<video ${controls} preload="metadata" ${link} ${source}></video>`
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
export { parser as default }
