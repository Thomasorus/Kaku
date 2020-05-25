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

    //outbuffer is the final rendered text
    const outBuffer = [];

    //acc contains text being processed
    const acc = [];

    //status define what type of text is being processed
    const status = {
        paragraph: false,
        bold: false,
        italic: false,
        code: false,
    };

    const formated = text.replace(/\r\n/g, "\n");

    for(const c of formated) {
        //If acc has value and no special char was detected
        //Then push acc content into outBuffer
        //Reset acc content
        if(acc.length && !isProcessing(status)){
            outBuffer.push(acc.join(''))
            acc.length=0
        }

        //Check if character contains one of the symbols
        const s = symbol.find(x=>x==c)

        //If not a syntax character and
        //And we're not processing anything
        //Then push the symbol inside outbuffer
        if(!s && !isProcessing(status)){
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
                    else {
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
                //Needs more work...
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

        //If acc is not empty 
        //And we're not processing anything special anymore
        //Then push the acc content inside outBuffer
        if(acc.length && !isProcessing(status)){
            outBuffer.push(acc.join(''))
        }

        //If we are processing something
        //Then push it into acc
        //And don't send it yet to outbuffer 
        assert(isProcessing(status)===true)
        acc.push(c)
    }

    //Retunr completed text
    return outBuffer.join('');
}

export {parser}
