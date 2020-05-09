const symbol = [
    "\n",
    "*",
    "_",
    "`"
]

function isProcessing(status) {
    return status.paragraph || status.bold || status.italic || status.code
}

function assert(condition) {
    if (condition) {
        return
    } else {
        throw "Fail";
    }
}

function parser(text) {

    const outBuffer = [];
    const acc = [];
    const status = {
        paragraph: false,
        bold: false,
        italic: false,
        code: false,
    };

    const formated = text.replace(/\r\n/g, "\n");

    for(const c of formated) {
        if(acc.length && !isProcessing(status)){
            outBuffer.push(acc.join(''))
            acc.length=0
        }

        const s = symbol.find(x=>x==c)
        if(!s && !isProcessing(status)){
            outBuffer.push(c)
            continue;
        }

        if(!!s) {
            switch (s) {
                case "*":
                    if(status.bold){
                        status.bold = false
                        acc.push('</strong>')
                    } else {
                        acc.push('<strong>')
                        status.bold = true
                    }
                    continue;
                case "_":
                    if(status.italic){
                        status.italic = false
                        acc.push('</em>')
                    } else {
                        acc.push('<em>')
                        status.italic = true
                    }
                    continue;
                case "`":
                    if(status.code){
                        status.code = false
                        acc.push('</code>')
                    } else {
                        acc.push('<code>')
                        status.code = true
                    }
                    continue;
                case "\n":
                        if(status.paragraph) {
                            status.paragraph = false
                            acc.push('</p>')
                        }
                        else {
                            status.paragraph = true;
                            acc.push('<p>')
                        }
                    continue;
            }
        }
        if(acc.length && !isProcessing(status)){
            outBuffer.push(acc.join(''))
        }
        assert(isProcessing(status)===true)
        acc.push(c)
    }

    return outBuffer.join('');
}

export {parser}
