const demo = `
# This is a title

And this is a simple text.

> Now I'm quoting stuff omagad

## Damn, a second title

This simple text now has *bold text* and _italic text_ and *more bold text*.

How about a {https://duckduckgo.com, link, Link to duckduckgo} ?

`



function parser(text) {
    text = text.split(/\n/g).filter(Boolean);

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
        //Paragraph
        else {
            el = `<p>${el}</p>`
        }

        //Bold
        if(el.includes("*")) {
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
        if(el.includes("_")) {
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
        console.log(el)

    });
    return text
}

const html = parser(demo);