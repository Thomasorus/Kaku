var preg_replace = function (a, b, c, d) {
    void 0 === d && (d = -1);
    var e = a.substr(a.lastIndexOf(a[0]) + 1),
        f = a.substr(1, a.lastIndexOf(a[0]) - 1),
        g = RegExp(f, e),
        i = [],
        j = 0,
        k = 0,
        l = c,
        m = [];
    if (-1 === d) {
        do m = g.exec(c), null !== m && i.push(m); while (null !== m && -1 !== e.indexOf("g"))
    } else i.push(g.exec(c));
    for (j = i.length - 1; j > -1; j--) {
        for (m = b, k = i[j].length; k > -1; k--) m = m.replace("${" + k + "}", i[j][k]).replace("$" + k, i[j][k]).replace("\\" + k, i[j][k]);
        l = l.replace(i[j][0], m)
    }
    return l
};

var parser = function (str) {

    var rules = [
            // headers
            ['/(#+)(.*)/g', function (chars, header) {
                var level = chars.length;
                return '<h' + level + '>' + header.trim() + '</h' + level + '>';
            }],
            //code fences
            ['/`{3,}(?!.*`)/g', '<pre><code>', '</pre></code>'],
            //code
            ['/(\\`)(.*?)\\1/g', function (char, item) {
                const code = item.replace(/\</g, "<span><</span>")
                return `<code>${code}</code>`
            }],
            // images
            ['/\\[([^\\[]+)\\]/g', function (item) {
                return createImages(item)
            }],
            // videos
            ['/\\|([^\\|]+)\\|/g', function (item) {
                return createMultimedia(item)
            }],
            // link
            ['/\\{([^\\{]+)\\}/g', function (item) {
                return createLink(item)
            }],
            // bold
            ['/(\\*)(.*?)\\1/g', '<strong>\\2</strong>'],
            // emphasis
            ['/(\\_)(.*?)\\1/g', '<em>\\2</em>'],
            // strike
            ['/(\\~)(.*?)\\1/g', '<del>\\2</del>'],
            // unordered list
            ['/\\n\\-(.*)/g', function (item) {
                return '<ul>\n<li>' + item.trim() + '</li>\n</ul>';
            }],
            // ordered list
            ['/\\n\\+(.*)/g', function (item) {
                return '<ol>\n<li>' + item.trim() + '</li>\n</ol>';
            }],
            // definition list
            ['/\\n\\?(.*)/g', function (item) {
                return createDefinitionList(item)
            }],
            // blockquote
            ['/\\n\\>(.*)/g', function (item) {
                return createQuote(item);
            }],
            // paragraphs
            ['/\\n[^\\n]+\\n/g', function (line) {
                if (codeblock) {
                    line = line.trimStart();
                    if (line.includes("<")) {
                        line = line.replace(/\</g, "<span><</span>")
                        return line
                    } else {
                        return line;
                    }
                }
                line = line.trim();
                if (line[0] === '<' && !codeblock) {
                    return line;
                }
                return `\n<p>${line}</p>\n`;
            }]
        ],
        fixes = [
            ['/<\\/ul>\n<ul>/g', '\n'],
            ['/<\\/ol>\n<ol>/g', '\n'],
            ['/<\\/dl>\n<dl>/g', '\n'],
            ['/<\\/blockquote>\n<blockquote>/g', "\n"]
        ];

    var codeblock = false

    var parse_line = function (str) {

        str = `\n${str.trim()}\n`;

        for (var i = 0, j = rules.length; i < j; i++) {

            if (typeof rules[i][1] == 'function') {
                const _flag = rules[i][0].substr(rules[i][0].lastIndexOf(rules[i][0][0]) + 1)
                const _pattern = rules[i][0].substr(1, rules[i][0].lastIndexOf(rules[i][0][0]) - 1)
                const reg = new RegExp(_pattern, _flag);

                const matches = [...str.matchAll(reg)];

                if (matches.length > 0) {
                    matches.forEach(match => {
                        //If more than one occurence on the same line
                        if (matches.length > 1) {
                            const rule = rules[i][0].slice(0, -1)
                            if (match.length > 1) {
                                str = preg_replace(rule, rules[i][1](match[1], match[2]), str);
                            } else {
                                str = preg_replace(rule, rules[i][1](match[0]), str);
                            }
                        }
                        //If only one occurence on the same line
                        else {
                            if (match.length > 1) {
                                str = preg_replace(rules[i][0], rules[i][1](match[1], match[2]), str);
                            } else {
                                str = preg_replace(rules[i][0], rules[i][1](match[0]), str);
                            }
                        }
                    })
                }
            } else {
                if (str === '\n```\n' && codeblock) {
                    str = rules[i][2]
                    codeblock = false
                } else if (str === '\n```\n' && !codeblock) {
                    str = rules[i][1]
                    codeblock = true
                } else {
                    str = preg_replace(rules[i][0], rules[i][1], str);
                }
            }
        }
        return str.trim();
    };

    str = str.split('\n');
    var rtn = [];
    for (var i = 0, j = str.length; i < j; i++) {
        rtn.push(parse_line(str[i]));
    }
    rtn = rtn.join('\n');

    for (i = 0, j = fixes.length; i < j; i++) {
        rtn = preg_replace(fixes[i][0], fixes[i][1], rtn);
    }

    return rtn;
};


function extractText(text) {
    const regexuuu = /\"((?:\\[\s\S]|[^\\])+?)\"(?!\*)/g
    const match = text.match(regexuuu)[0].replace(/\"/g, "").trim()
    return match
}

function createImages(item) {
    let el = item
    el = el.replace("[", "").replace("]", "")
    const imgArr = el.split(",")
    let imgHtml = ""

    if (imgArr.length === 1) {
        imgHtml = `<img loading="lazy" src="${imgArr[0]}">`
    }

    if (imgArr.length === 2) {
        const alt = ` alt="${imgArr[1].trim()}"`
        imgHtml = `<img loading="lazy" src="${imgArr[0].trim()}"${alt}>`
    }

    if (imgArr.length === 3) {
        const alt = ` alt="${imgArr[1].trim()}"`
        imgHtml = `<img loading="lazy" src="${imgArr[0]}"${alt}>`
        const caption = `<figcaption>${extractText(el)}</figcaption>`
        imgHtml = `<figure>${imgHtml}${caption}</figure>`
    }

    return imgHtml
}

function createLink(item) {
    let el = item
    el = el.replace("{", "").replace("}", "")
    const textLink = extractText(el)
    const linkElem = el.split(",")
    const aria = linkElem.length > 2 ? `title="${linkElem[2].trim()}" aria-label="${linkElem[2].trim()}"` : ""
    let html = `<a href="${linkElem[0]}"${aria}>${textLink}</a>`;
    return html
}

function createQuote(item) {
    let el = item
    el = el.replace(/\~/g, '')
    const citation = extractText(el)
    el = el.replace(citation, "")
    el = el.split(',')
    const url = `cite="${el[3].trim()}"`
    const source = `, <cite>${el[2]}</cite>`
    const author = `<footer>—${el[1].trim()}${source}</footer>`
    const html = `<blockquote ${url}><p>${citation}</p>${author}</blockquote>`;
    return html
}

function createDefinitionList(item) {
    let html;
    item = item.split(":")
    const term = item[0].trim()
    const definition = item[1].trim()
    html = `<dl><dt>${term}</dt><dd>${definition}</dd></dl>`
    return html
}


function createMultimedia(item) {
    let el = item
    el = el.replace(/[|]/g, "")
    el = el.split(",")
    const url = el[0]
    let param = el[1] ? el[1].trim() : ''
    let mediaType = url.slice(-1)
    if (param) {
        if (param === "g") {
            param = `autoplay="true" playsinline="true" loop="true" mute="true" preload="metadata"`;
        } else {
            param = `controls preload="metadata"`
        }
    } else {
        param = `controls preload="metadata"`
    }


    html = ""
    switch (mediaType) {
        case "4":
            html = `<video ${param} src="${url}" type="video/mp4"></video>`
            break;
        case "3":
            html = `<audio ${param} src="${url}" type="audio/mpeg"></audio>`
        default:
            break;
    }
    return html
}