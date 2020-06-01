const symbol = [
    // /^((?:[^\n]|\n(?! *\n))+)(?:\n *)+\n/g,
    /\*((?:\\[\s\S]|[^\\])+?)\*(?!\*)/g,
    /\_((?:\\[\s\S]|[^\\])+?)\_(?!\_)/g,
    /(\`+)([\s\S]*?[^`])\1(?!`)/g,
    // /( *>[^\n]+(\n[^\n]+)*\n*)+\n{2,}/g,
    / *(#{1,6})([^\n]+?)#* *(?:\n *)+\n/g,
    /\[((?:\\[\s\S]|[^\\])+?)\,((?:\\[\s\S]|[^\\])+?)\]/g,
    /\{((?:\\[\s\S]|[^\\])+?)\,((?:\\[\s\S]|[^\\])+?)\}/g,
]


function parser(text) {
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
                    // case ">":
                    //     text = createTypography(e, text, type, "blockquote")
                    //     continue
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

function createImages(img, text) {
    let el = img
    let imgElem = el.substring(
        el.lastIndexOf("[") + 1,
        el.lastIndexOf("]")
    );
    el = el.split(/\[|\]/)
    let html = "";
    el.forEach(e => {
        if (e === imgElem) {
            e = e.split(",")
            let alt = e.length > 1 ? ` alt="${e[1].trim()}"` : ""
            let img = `<img src="${e[0]}"${alt}></img>`

            if (e.length > 2) {
                let caption = `<figcaption>${e[2].trim()}</figcaption>`
                e = `<figure>${img}${caption}</figure>`
            } else {
                e = img
            }
        }
        html = html + e
    });
    return text.replace(img, html)
}

function createLink(link, text) {
    let el = link
    let linkElem = el.substring(
        el.lastIndexOf("{") + 1,
        el.lastIndexOf("}")
    );
    el = el.split(/{|}/)

    let html = "";
    el.forEach(e => {
        if (e === linkElem) {
            e = e.split(",")
            const aria = e.length > 2 ? ` aria-label="${e[2].trim()}"` : ""
            e = `<a href="${e[0]}"${aria}>${e[1].trim()}</a>`
        }
        html = html + e
    });
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