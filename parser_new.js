const symbol = [
    "\n",
    "*",
    "_",
    "`",
    ">",
    "#",
    "[",
    "]",
    "{",
    "}"
]

function isProcessing(status) {
    return status.bold || status.italic || status.code || status.blockquote || status.title || status.image || status.link
}

function assert(condition) {
    if (condition) {
        return
    } else {
        throw "Assert error";
    }
}


function parser(text) {

    //outbuffer is the final rendered text
    const outBuffer = [];

    //acc contains text being processed
    const acc = [];

    let titleAcc = [];
    let titleCount = "";

    //status define what type of text is being processed
    const status = {
        paragraph: false,
        bold: false,
        italic: false,
        code: false,
        citation: false,
        space: false,
        image: false,
        link: false
    };


    //Replacing line break chars
    const formated = text.replace(/\r\n/g, "\n").replace(/\n\s*\n/g, '\n');


    for(var i = 0; i < formated.length; ++i){
        const c = formated[i]

        //If acc has value and no process
        //Then push acc content into outBuffer
        //Reset acc content
        if(acc.length && !isProcessing(status)){
            outBuffer.push(acc.join(''))
            acc.length=0
        }

        //Check if character contains one of the symbols
        const s = symbol.find(x=>x==c)

        //If not a syntax character
        //And we're not processing anything
        //Then push the symbol inside outbuffer
        // PLUS checks if new line or end of document
        if(!s && !isProcessing(status)){
            if((i + 1) == (formated.length) && status.paragraph) {
                const p = `${c}</p>`;
                status.paragraph = false;
                outBuffer.push(p)
                continue;
            }
            if(status.paragraph === false && c !== " ") {
                status.paragraph = true;
                const p = `<p>${c}`;
                outBuffer.push(p)
                continue;
            }
            outBuffer.push(c)
            continue;
        }

        //If a syntax character
        if(!!s) {
            //Then which one?
            switch (s) {
                // Symbols with similar starter and ender
                case "*":
                    //If status is true
                    //End it
                    //Add closing html into acc
                    if(status.bold){
                        status.bold = false
                        acc.push('</strong>')
                    } 
                    //if status is true
                    //start it
                    //Push starting html into acc
                    else if(status.paragraph) {

                        acc.push('<strong>')
                        status.bold = true
                    } else {
                        acc.push(c)
                    }
                    if((i + 1) == (formated.length) && status.paragraph) {
                        acc.push('</p>')
                        status.paragraph = false;
                        if(acc.length && !isProcessing(status)){
                            outBuffer.push(acc.join('').trim())
                        }
                    }
                   continue
                case "_":
                       
                    if(status.italic){
                        status.italic = false
                        acc.push('</em>')
                    } else if(status.paragraph) {
                        acc.push('<em>')
                        status.italic = true
                    } else {
                        acc.push(c)
                    }
                    if((i + 1) == (formated.length) && status.paragraph) {
                        acc.push('</p>')
                        status.paragraph = false;
                        if(acc.length && !isProcessing(status)){
                            outBuffer.push(acc.join('').trim())
                        }
                    }
                        
                    
                    continue;
                case "`":
                    if(status.code){
                        status.code = false
                        acc.push('</code>')
                    } else if(status.paragraph) {
                        acc.push('<code>')
                        status.code = true
                    } else {
                        acc.push(c)
                    }
                    if((i + 1) == (formated.length) && status.paragraph) {
                        acc.push('</p>')
                        status.paragraph = false;
                        if(acc.length && !isProcessing(status)){
                            outBuffer.push(acc.join('').trim())
                        }
                    } 
                    continue;
                case ">":
                    if(!status.blockquote) {
                        acc.push('<blockquote>')
                        status.blockquote = true
                        status.space = true
                    }
                    continue;
                case "#":
                    titleAcc.push('#')
                    status.title = true
                    status.space = true
                    continue;
                case "[":
                    acc.push(c)
                    status.image = true
                    continue
                case "]":
                    acc.push(c)
                    const img = createImages(acc.join(''))
                    acc.splice(0, acc.length)
                    acc.push(img)
                    status.image = false
                    if((i + 1) == (formated.length)) {
                        if(acc.length && !isProcessing(status)){
                            outBuffer.push(acc.join('').trim())
                        }
                    }
                    continue
                case "{":
                    acc.push(c)
                    status.link = true
                    continue
                case "}":
                    acc.push(c)
                    const link = createLink(acc.join(''))
                    acc.splice(0, acc.length)
                    acc.push(link)
                    status.link = false
                    if((i + 1) == (formated.length)) {
                        if(acc.length && !isProcessing(status)){
                            outBuffer.push(acc.join('').trim())
                        }
                    }
                    continue
                //Needs more work...
                case "\n":
                        if(status.paragraph) {
                            acc.push('</p>')
                            status.paragraph = false
                        }
                        if(status.blockquote) {
                            acc.push('</blockquote>')
                            status.blockquote = false
                            if((i + 1) == (formated.length)) {
                                if(acc.length && !isProcessing(status)){
                                    outBuffer.push(acc.join('').trim())
                                }
                            }
                        }
                        if(status.title) {
                            acc.push(`</h${titleCount}>`)
                            status.title = false
                            if((i + 1) == (formated.length)) {
                                if(acc.length && !isProcessing(status)){
                                    outBuffer.push(acc.join('').trim())
                                }
                            }
                        }
                    continue;
            }
        }
       
        //If acc is not empty 
        //And we're not processing anything special anymore
        //Then push the acc content inside outBuffer
        if(acc.length && !isProcessing(status)){
            outBuffer.push(acc.join('').trim())
        }

        //If we are processing something
        //Then push it into acc
        //And don't send it yet to outbuffer 
        assert(isProcessing(status)===true)


        //Accumulating titles #
        if(status.space) {
            status.space = false
        }
        else {
            if(titleAcc.length) {
                acc.push(`<h${titleAcc.length}>${c}`)
                titleCount = titleAcc.length
                titleAcc.length = []    
            } 
            else if(status.blockquote) {
                acc.push(c) 
            } 
            else {
                acc.push(c)
            } 
        }
    }

   
    //Retunr completed text
    return outBuffer.join('');
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
            let alt = e.length > 1 ? ` alt="${e[1].trim()}"` : ""
            let img = `<img src="${e[0]}"${alt}></img>`

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
            const aria = e.length > 2 ? ` aria-label="${e[2].trim()}"` : ""
            e = `<a href="${e[0]}"${aria}>${e[1].trim()}</a>`
        }
        elem = elem + e
    });
    return elem
}


export {parser}
