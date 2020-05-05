const demo = `
# This is a title
> Now I'm quoting stuff omagad
## Damn, a second title
This simple text now has *bold text* and _italic text_ and *more bold text*.
How about a {https://duckduckgo.com, link, Link to duckduckgo} ?
[https://i.imgur.com/oJXNeQm.jpg, Sailor Jupiter, She has some poses like Bruce Lee]

- List 1
- List 2
- List 3

yeah
`
let tempList = []
let listItems = ""

function parser(text) {
    text = text.split(/\n/g).filter(Boolean);
    let processed = false
    let finalText = ""

    text.forEach(el => {

        switch (el.charAt(0)) {
            case "#":
                el = titles(el)
                break;
            case ">":
                el = quotes(el)
                break;
            case "[":
                el = images(el)
                break;
            case ("-"):
                el = populateList(el)
                break;
            default:
                el = endList(el)
                break;
        }

        //Bold
        if (el.includes("*")) {
            el = bold(el)
        }

        //Italic
        if (el.includes("_")) {
            el = italic(el)
        }

        //Links
        if (el.includes("{")) {
            el = links(el)
        }

        finalText = finalText + el
    });

    return finalText
}

function endList(el) {
    if (tempList.length === 0) {
        return paragraph(el)
    } else {
        console.log('endlist')
        tempList.forEach(item => {
            listItems = listItems + `<li>${item.substring(1).trim()}</li>`
        });
        listItems = `<ul>${listItems}</ul>\n`
        tempList = []
        return listItems + paragraph(el)
    }
}

function paragraph(el) {
    el = `<p>${el}</p>`
    return el
}

function populateList(el) {
    tempList.push(el)
    return ""
}

function titles(el) {
    const count = (el.match(/#/g) || []).length;
    return `<h${count}>${el.substring(1 + count)}</h${count}>`
}

function quotes(el) {
    return `<blockquote>${el.substring(2)}</blockquote>`
}

function images(el) {
    let imgElem = el.substring(
        el.lastIndexOf("[") + 1,
        el.lastIndexOf("]")
    );
    el = el.split(/\[|\]/)
    let elem = "";
    el.forEach(e => {
        if (e === imgElem) {
            e = e.split(",")
            let alt = e.length > 1 ? `alt="${e[1].trim()}"` : ""
            let img = `<img src="${e[0]}" ${alt}></img>`

            if (e.length > 2) {
                let caption = `<figcaption>${e[2].trim()}</figcaption>`
                e = `<figure>${img}${caption}</figure>`
            } else {
                e = img
            }
        }
        elem = elem + e
    });
    return elem
}

function links(el) {
    let linkElem = el.substring(
        el.lastIndexOf("{") + 1,
        el.lastIndexOf("}")
    );
    el = el.split(/{|}/)

    let elem = "";
    el.forEach(e => {
        if (e === linkElem) {
            e = e.split(",")
            const aria = e.length > 2 ? `aria-label="${e[2].trim()}"` : ""
            e = `<a href="${e[0]}" ${aria}>${e[1].trim()}</a>`
        }
        elem = elem + e
    });
    return elem
}

function bold(el) {
    el = el.split(/(\*)/)
    let opening = true
    let elem = "";
    el.forEach(e => {
        if (e === "*" && opening === true) {
            e = "<strong>"
            opening = false
        } else if (e === "*" && opening === false) {
            e = "</strong>"
            opening = true
        }
        elem = elem + e
    });
    return elem
}

function italic(el) {
    el = el.split(/(_)/)
    let opening = true
    let elem = "";
    el.forEach(e => {
        if (e === "_" && opening === true) {
            e = "<em>"
            opening = false
        } else if (e === "_" && opening === false) {
            e = "</em>"
            opening = true
        }
        elem = elem + e
    });
    return elem
}

const html = parser(demo);
const body = document.querySelector('body');
body.innerHTML = html;