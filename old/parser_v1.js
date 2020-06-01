let tempList = []
let currentList = null

function parser(text) {

    //Splitting text and removing empty strings
    text = text.split(/\n/g).filter(Boolean)
    Object.keys(text).forEach(k => (!text[k] && text[k] !== undefined) && delete text[k]);

    let finalText = ""
    let count = 0;

    text.forEach(el => {
        el = el.trim()
        let firstChar = el.charAt(0)
        let content = null
        count++

        switch (firstChar) {
            case "#":
                content = createTitle(el)
                break;
            case ">":
                content = createQuote(el)
                break;
            case "[":
                content = createImages(el)
                break;
            case "-":
            case "?":
            case "+":
                //If new list or adding el to existing list
                if (firstChar === currentList && count !== text.length || currentList === null && count !== text.length) {
                    populateList(firstChar, el)
                }
                //If new el is different, finish list
                else if (firstChar !== currentList && currentList.length > 0) {
                    content = createList(tempList)
                }
                //If new el is the last of page, finish list
                else {
                    populateList(firstChar, el)
                    content = createList(tempList)
                }
                break;
            default:
                content = endList(el)
                break;
        }
        if (content) {
            if (content.includes("*")) {
                content = createBold(content)
            }

            if (content.includes("_")) {
                content = createItalic(content)
            }

            if (content.includes("{")) {
                content = createLink(content)
            }

            if (content.includes("`")) {
                content = createCode(content)
            }

            finalText = finalText + content
        }
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

function createList(el) {
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
        return createParagraph(el)
    } else {
        return createList(el) + endList(el)
    }
}

function createParagraph(el) {
    return `<p>${el}</p>`
}

function populateList(firstChar, el) {
    tempList.push(el)
    currentList = firstChar
}

function createTitle(el) {
    const count = (el.match(/#/g)).length;
    return `<h${count}>${el.substring(1 + count)}</h${count}>`
}

function createQuote(el) {
    return `<blockquote>${el.substring(2)}</blockquote>`
}

function createImages(el) {
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

function createLink(el) {
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

function createBold(el) {
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

function createItalic(el) {
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

function createCode(el) {
    el = el.split(/(`)/)
    let opening = true
    let elem = "";
    el.forEach(e => {
        if (e === "`" && opening === true) {
            e = "<code>"
            opening = false
        } else if (e === "`" && opening === false) {
            e = "</code>"
            opening = true
        }
        elem = elem + e
    });
    return elem
}



//DEMO STUFF
const formated = document.querySelector('.normal');
const htmldemo = document.querySelector('.html');
let demo = document.querySelector('textarea');

document.addEventListener('keyup', triggerDemo)

function triggerDemo() {
    let demotext = parser(demo.value)
    formated.innerHTML = ""
    htmldemo.textContent = ""
    formated.innerHTML = demotext;
    htmldemo.textContent = demotext;
}

triggerDemo()