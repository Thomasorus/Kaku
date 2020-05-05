const demo = `
# This is a title
> Now I'm quoting stuff omagad
## Damn, a second title
This simple text now has *bold text* and _italic text_ and *more bold text*.
How about a {https://duckduckgo.com, link, Link to duckduckgo} ?
[https://i.imgur.com/oJXNeQm.jpg, Sailor Jupiter, She has some poses like Bruce Lee]

test 0

- List 1
- List 2
- List 3

+ wow 1
+ wow 2


? test 1 : def 1
? test 2 : def 2

`
let tempList = []
let currentList = null

function parser(text) {
    text = text.split(/\n/g).filter(Boolean);
    console.log({
        text
    })
    let finalText = ""
    let count = 0;

    text.forEach(el => {
        count++
        let firstChar = el.charAt(0)
        let content = null
        switch (firstChar) {
            case "#":
                content = titles(el)
                break;
            case ">":
                content = quotes(el)
                break;
            case "[":
                content = images(el)
                break;
            case "-":
            case "?":
            case "+":
                console.log(firstChar, currentList)
                if (firstChar === currentList && count !== text.length || currentList === null && count !== text.length) {
                    content = populateList(firstChar, el)
                } 
                else if(count === text.length)  {
                    content = populateList(firstChar, el) + lists(el)
                }
                else {
                    content = lists(el)
                    content = content + populateList(firstChar, el)
                }
                break;
            default:     
                console.log(el)
                content = endList(el)
                break;
        }


        //Bold
        if (content.includes("*")) {
            content = bold(el)
        }

        //Italic
        if (content.includes("_")) {
            content = italic(el)
        }

        //Links
        if (content.includes("{")) {
            content = links(el)
        }

        finalText = finalText + content
    });

    return finalText
}


function getListType(tempList) {
    type = "";
    if (tempList.length > 0) {
        switch (tempList[0].charAt(0)) {
            case "-":
                type = 'ul'
                break;
            case "?":
                type = 'dl'
                break;
            default:
                type = 'ol'
                break;
        }
    } else type = "ul"
    return type
}

function lists(el) {
    type = getListType(tempList)
    if (type === "ul" || type === "ol") {
        let listItems = ""
        tempList.forEach(item => {
            listItems = listItems + `<li>${item.substring(1).trim()}</li>`
        });
        tempList = []
        listItems = `<${type}>${listItems}</${type}>\n`
        return listItems
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
        return listItems
    }
}

function endList(el) {
    if (tempList.length === 0) {
        return paragraph(el)
    } else {
        return lists(el) + paragraph(el)
    }
}

function paragraph(el) {
    return `<p>${el}</p>`
}

function populateList(firstChar, el) {
    tempList.push(el)
    currentList = firstChar
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