

let tempList = []
let currentList = null

function parser(text) {
    text = text.split(/\n/g).filter(Boolean)
    Object.keys(text).forEach(k => (!text[k] && text[k] !== undefined) && delete text[k]);
    let finalText = ""
    let count = 0;

    text.forEach(el => {
        count++
        el = el.trim()
        
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
                if (firstChar === currentList && count !== text.length || currentList === null && count !== text.length) {
                    content = populateList(firstChar, el)
                } 
                else if(firstChar !== currentList &&  currentList.length > 0)  {
                    content = lists(el)
                    populateList(firstChar, el) 
                }
                else {
                    populateList(firstChar, el) 
                    content = lists(el)
                }
                break;
            default:
                    content = endList(el)
                break;
        }

        if(content) {
            if (content.includes("*")) {
                content = bold(content)
            }
    
            if (content.includes("_")) {
                content = italic(content)
            }
    
            if (content.includes("{")) {
                content = links(content)
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
    return null
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


const demo = document.querySelector('textarea').textContent;
// demo = `# This is a title
// > Now I'm quoting stuff omagad
// ## Damn, a second title
// This simple text now has *bold text* and _italic text_ and *more bold text*.
// How about a {https://duckduckgo.com, link, Link to duckduckgo} ?
// [https://i.imgur.com/oJXNeQm.jpg, Sailor Jupiter, She has some poses like Bruce Lee]

// - Bullet list 1
// - Bullet list 2
// - Bullet list 3

// + Ordered list 1
// + Ordered list 2


// ? Descriptive list 1 : Definition 1
// ? Descriptive list 2 : Definition 2`
const html = parser(demo);
const formated = document.querySelector('.normal');
const htmldemo = document.querySelector('.html');

formated.innerHTML = html;
htmldemo.append(html);