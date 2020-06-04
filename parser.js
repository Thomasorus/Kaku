const symbol = [
    /\*((?:\\[\s\S]|[^\\])+?)\*(?!\*)/g,
    /\b\_((?:\\[\s\S]|[^\\])+?)\_(?!\_\b)/g,
    /(\`+)([\s\S]*?[^`])\1(?!`)/g,
    / *(#{1,6})([^\n]+?)#* *(?:\n *)+\n/g,
    /\~((?:\\[\s\S]|[^\\])+?)\,((?:\\[\s\S]|[^\\])+?)\~/g,
    /\[((?:\\[\s\S]|[^\\])+?)\,((?:\\[\s\S]|[^\\])+?)\]/g,
    /\{((?:\\[\s\S]|[^\\])+?)\,((?:\\[\s\S]|[^\\])+?)\}/g,
]


function parser(rawtText) {
    rawtText = rawtText.replace(/\r\n/g, "\n")
    rawtText = rawtText.split(/\n/g).filter(Boolean)
    let text = []
    const regex = /^\#|^\{|^\[|^\*|^\_|^\`|^\~|^\-|^\+|^\?/g;

    for (let i = 0; i < rawtText.length; i++) {
        let el = rawtText[i];
        const firstChar = el.charAt(0)
        if(firstChar.match(regex)) {
            text.push(el + "\n\n")
        } else {
            text.push(`<p>${el}</p>`)
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
                }
                return text
            }
            
        }
    }
    return text
}

function createTitle(el, text) {
    const count = (el.match(/#/g)).length;
    const html = `<h${count}>${el.substring(1 + count)}</h${count}>`
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
    const html = `
        <blockquote ${url}>
            <p>${citation}</p>
            ${author}
        </blockquote>
    `;
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
    
    let caption = `<figcaption>${extractText(el)}</figcaption>`
    el = el.replace(caption, "")

    const imgArr = el.split(",")

    let alt = imgArr.length > 1 ? ` alt="${imgArr[1].trim()}"` : ""
    let imgHtml = `<img src="${imgArr[0].trim()}"${alt}></img>`

    if (imgArr.length > 2) {
        
        imgHtml = `<figure>${imgHtml}${caption}</figure>`
    } 

    let html = imgHtml;
    console.log(html)
    return text.replace(img, html)
}

function createLink(link, text) {
    let el = link
    el = el.replace("{", "").replace("}", "")
    const textLink = extractText(el)
    el = el.replace(textLink, "")

    linkElem = el.split(",")
    const aria = linkElem.length > 2 ? ` aria-label="${linkElem[2].trim()}"` : ""
    let html = `
      <a href="${linkElem[0]}"${aria}>${textLink}</a>
    `;
    return text.replace(link, html)
}


// //DEMO STUFF
const formated = document.querySelector('article');
let demo = document.querySelector('textarea');

document.addEventListener('keyup', triggerDemo)

function triggerDemo() {
    let demotext = parser(demo.value)
    formated.innerHTML = ""
    formated.innerHTML = demotext;
}

triggerDemo()