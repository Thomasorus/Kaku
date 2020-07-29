const symbol = [
    /\? ((?:\\[\s\S]|[^\\])+?)([^\n]*)/g,
    /\*((?:\\[\s\S]|[^\\])+?)\*(?!\*)/g,
    /\b\_((?:\\[\s\S]|[^\\])+?)\_(?!\_\b)/g,
    /(\`+)([\s\S]*?[^`])\1(?!`)/g,
    / *(`{3})((?:\\[\s\S]|[^\\])+?) *(`{3})/g,
    / *(#{1,6}) ([^\n]+?)#* *(?:\n *)+\n/g,
    /\~((?:\\[\s\S]|[^\\])+?)\,((?:\\[\s\S]|[^\\])+?)\~/g,
    /\[((?:\\[\s\S]|[^\\])+?)\]/g,
    /\{((?:\\[\s\S]|[^\\])+?)\}/g,
    /\|((?:\\[\s\S]|[^\\])+?)\|/g,
    /\- ((?:\\[\s\S]|[^\\])+?)([^\n]*)/g,
    /\+ ((?:\\[\s\S]|[^\\])+?)([^\n]*)/g,
]

function parser(rawtText) {
    rawtText = rawtText.replace(/\r\n/g, "\n")
    rawtText = rawtText.split(/\n/g)
    let text = []
    const regex = /^\#|^\{|^\[|^\||^\*|^\_|^\`|^\~|^\-|^\+|^\?/g;
    const regexList = /^\-|^\+|^\?/g;

    let acc = []
    for (let i = 0; i < rawtText.length; i++) {
        let el = rawtText[i];
        const firstChar = el.charAt(0)
        if (firstChar.match(regex)) {
            if (firstChar.match(regexList)) {
                acc.push(el)
                if (i === rawtText.length - 1) {
                    text.push(acc.join(''))
                }
            } else {
                if (acc.length) {
                    text.push(acc.join('') + "\n\n")
                    acc.length = 0
                }
                text.push(el + "\n\n")
            }
        } else {
            if (acc.length) {
                text.push(acc.join('') + "\n\n")
                acc.length = 0
            }
            if (el.length > 0) {
                text.push(`<p>${el}</p>`)

            }
        }
    }

    text = text.join('')

    for (let i = 0; i < symbol.length; i++) {
        const s = symbol[i];
        while (text.match(s)) {
            const match = text.match(s);
            const type = match[0].charAt(0)
            for (let t = 0; t < match.length; t++) {
                const e = match[t];
                switch (type) {
                    case "#":
                        text = createTitle(e, text)
                        continue
                    case "*":
                        text = createTypography(e, text, type, 'strong')
                        continue
                    case "_":
                        text = createTypography(e, text, type, 'em')
                        continue
                    case "`":
                        text = createTypography(e, text, type, "code")
                        continue
                    case "~":
                        text = createQuote(e, text)
                        continue
                    case "[":
                        text = createImages(e, text)
                        continue
                    case "{":
                        text = createLink(e, text)
                        continue
                    case "-":
                    case "+":
                    case "?":
                        text = createList(e, text, type)
                        continue
                    case "|":
                        text = createMultimedia(e, text)
                        continue
                }
                return text
            }

        }
    }
    return text
}

function createMultimedia(multi, text) {
    let el = multi
    el = el.replace(/[|]/g, "")
    el = el.split(",")
    const url = el[0]
    let param = el[1] ? el[1].trim() : ''
    let mediaType = url.slice(-1)
    if (param) {
        if (param === "g") {
            param = `autoplay="true" playsinline="true" loop="true" mute="true" preload="metadata"`;
        } else {
            param = `controls preload="metadata"`
        }
    } else {
        param = `controls preload="metadata"`
    }


    html = ""
    switch (mediaType) {
        case "4":
            html = `<video ${param} src="${url}" type="video/mp4"></video>`
            break;
        case "3":
            html = `<audio ${param} src="${url}" type="audio/mpeg"></audio>`
        default:
            break;
    }
    return text.replace(multi, html)
}

function createList(el, text, type) {
    console.log(el)
    let regex = null
    let listType = undefined
    switch (type) {
        case "-":
            listType = "ul"
            regex = /\- /g
            break;
        case "+":
            listType = "ol"
            regex = /\+ /g
            break;
        case "?":
            listType = "dl"
            regex = /\? /g
            break;
    }

    let tempList = el.split(regex).filter(Boolean)
    let html = ""

    if (listType === "ul" || listType === "ol") {
        tempList.forEach(item => {
            html = html + `<li>${item.trim()}</li>`
        });
        html = `<${listType}>${html}</${listType}>\n`
    } else {
        tempList.forEach(item => {
            item = item.split(":")
            const term = item[0].trim()
            const definition = item[1].trim()
            html = html + `<dt>${term}</dt><dd>${definition}</dd>`
        });
        html = `<${listType}>${html}</${listType}>\n`
    }

    return text.replace(el, html)

}

function toKebab(text) {
    const toKebabCase = text && text
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
    return toKebabCase
}

function createTitle(el, text) {
    const count = (el.match(/#/g)).length;
    const title = el.substring(1 + count).trim()
    const kebab = toKebab(title)
    const link = `<a href="#${kebab}" aria-label="${title} permalink" style="display: inline-block;width: 100%;height: 100%;position: absolute;"></a>`
    const html = `<h${count} id="${kebab}" style="position:relative;">${link}${title}</h${count}>`
    return text.replace(el, html)
}

function createTypography(el, text, type, tag) {
    let regex = new RegExp(`\\${type}`, 'g');
    const html = `<${tag}>${el.replace(regex, "")}</${tag}>`;
    return text.replace(el, html)
}

function createQuote(quote, text) {
    let el = quote
    el = el.replace(/\~/g, '')
    const citation = extractText(el)
    el = el.replace(citation, "")
    el = el.split(',')
    const url = `cite="${el[3].trim()}"`
    const source = `, <cite>${el[2]}</cite>`
    const author = `<footer>—${el[1].trim()}${source}</footer>`
    const html = `<blockquote ${url}><p>${citation}</p>${author}</blockquote>`;
    return text.replace(quote, html)
}

function extractText(text) {
    const regexuuu = /\"((?:\\[\s\S]|[^\\])+?)\"(?!\*)/g
    const match = text.match(regexuuu)[0].replace(/\"/g, "").trim()
    return match
}

function createImages(img, text) {
    let el = img
    el = el.replace("[", "").replace("]", "")

    const imgArr = el.split(",")
    let imgHtml = ""

    if (imgArr.length === 1) {
        imgHtml = `<img loading="lazy" src="${imgArr[0]}">`
    }

    if (imgArr.length === 2) {
        const alt = ` alt="${imgArr[1].trim()}"`
        imgHtml = `<img loading="lazy" src="${imgArr[0].trim()}"${alt}>`
    }

    if (imgArr.length === 3) {
        const alt = ` alt="${imgArr[1].trim()}"`
        imgHtml = `<img loading="lazy" src="${imgArr[0]}"${alt}>`
        const caption = `<figcaption>${extractText(el)}</figcaption>`
        imgHtml = `<figure>${imgHtml}${caption}</figure>`
    }

    return text.replace(img, imgHtml)
}

function createLink(link, text) {
    let el = link
    el = el.replace("{", "").replace("}", "")
    const textLink = extractText(el)
    const linkElem = el.split(",")
    const aria = linkElem.length > 2 ? ` aria-label="${linkElem[2].trim()}"` : ""
    let html = `<a href="${linkElem[0]}"${aria}>${textLink}</a>`;
    return text.replace(link, html)
}