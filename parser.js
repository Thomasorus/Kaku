const demo = `
# This is a title
> Now I'm quoting stuff omagad
## Damn, a second title
This simple text now has *bold text* and _italic text_ and *more bold text*.
How about a {https://duckduckgo.com, link, Link to duckduckgo} ?
[https://i.imgur.com/oJXNeQm.jpg, Sailor Jupiter, She has some poses like Bruce Lee]
`



function parser(text) {
    console.log(text)
    text = text.split(/\n/g).filter(Boolean);

    let finalText = ""
    text.forEach(el => {

        //Titles
        if (el.includes("#")) {
            const count = (el.match(/#/g) || []).length;
            el = `<h${count}>${el.substring(1 + count)}</h${count}>`
        }
        //Quotes
        else if (el.charAt(0) === ">") {
            el = `<blockquote>${el.substring(2)}</blockquote>`
        }
        //Image
        else if (el.charAt(0) === "[") {
            imgElem = el.substring(
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
                    let finalImage = e.length > 2 ? `
                        <figure>
                        ${img}
                        <figcaption>${e[2].trim()}</figcaption>
                        </figure>` 
                        : img
                    e = finalImage
                }
                elem = elem + e
            });
            el = elem

        }
        //Paragraph
        else {
            el = `<p>${el}</p>`
        }

        //Bold
        if (el.includes("*")) {
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
            el = elem
        }

        //Italic
        if (el.includes("_")) {
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
            el = elem
        }

        //Italic
        if (el.includes("{")) {
            linkElem = el.substring(
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
            el = elem
        }
        finalText = finalText + el
    });

    return finalText
}

const html = parser(demo);
const body = document.querySelector('body');
body.innerHTML = html;