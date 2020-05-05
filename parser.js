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

bla

- List 4
- List 5
- List 6

bla

1. wow 1
2. wow 2


test

? test 1 : def 1
? test 2 : def 2

yeah
`
let tempList = []

function parser(text) {
    text = text.split(/\n/g).filter(Boolean);
    let finalText = ""

    text.forEach(el => {
        let firstChar = el.charAt(0)
        switch (firstChar) {
            case "#":
                el = titles(el)
                break;
            case ">":
                el = quotes(el)
                break;
            case "[":
                el = images(el)
                break;
            case "-": case "?":
                el = populateList(el)
                break;
            default:
                isNaN(parseInt(firstChar)) ? el = endList(el) : el = populateList(el)
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


function getListType(tempList) {
    listType = "";
    switch (tempList[0].charAt(0)) {
        case "-":
            listType = 'ul'
            break;
        case "?":
            listType = 'dl'
            break;
        default:
            listType = 'ol'
            break;
    }
    return listType
}

function lists(el) {
    type = getListType(tempList)
    if(type === "ul" || type === "ol") {
        let listItems = ""
        tempList.forEach(item => {
            let subString = type === "ul" ? 1 : 2
            listItems = listItems + `<li>${item.substring(subString).trim()}</li>`
        });
        tempList = []
        listItems = `<${type}>${listItems}</${type}>\n`
        return listItems + paragraph(el)
    } else {
        let listItems = ""
        tempList.forEach(item => {
            item = item.split(":")
            const term = item[0].substring(1).trim()
            const definition = item[1].trim()
            listItems = listItems + `<dt>${term}</dt><dd>${definition}</dd>`
        });
        tempList = []
        listItems = `<${type}>${listItems}</${type}>\n`
        return listItems + paragraph(el)
    }
}

function endList(el) {
    if (tempList.length === 0) {
        return paragraph(el)
    } else {
        return lists(el)
    }
}

function paragraph(el) {
    return `<p>${el}</p>`
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