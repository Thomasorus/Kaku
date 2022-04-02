function parser(text) {
  const blocks = text.split(/\n\n/g);
  let parsedText = "";
  for (let i = 0; i < blocks.length; i++) {
    const el = blocks[i];
    const codeRegex = new RegExp("^```\n(.+)\n```", "sgim");
    const codeTest = codeRegex.test(el);

    if (!codeTest) {
      let tempText = el
        .replace(/^(#) (.*$)/gim, function (char, item, item2) {
          return parseTitles(item, item2);
        }) // h1 tag
        .replace(/^(##) (.*$)/gim, function (char, item, item2) {
          return parseTitles(item, item2);
        }) // h2 tag
        .replace(/^(###) (.*$)/gim, function (char, item, item2) {
          return parseTitles(item, item2);
        }) // h3 tag
        .replace(/^(####) (.*$)/gim, function (char, item, item2) {
          return parseTitles(item, item2);
        }) // h4 tag
        .replace(/^(#####) (.*$)/gim, function (char, item, item2) {
          return parseTitles(item, item2);
        }) // h5 tag
        .replace(/^(######) (.*$)/gim, function (char, item, item2) {
          return parseTitles(item, item2);
        }) // h6 tag
        .replace(/\`(.*?)\`/gim, function (char, item) {
          if (item.includes("<")) {
            return `<code>${item.replace(/</g, "<span><</span>")}</code>`;
          } else {
            return `<code>${item}</code>`;
          }
        }) // strong text
        .replace(/^----$/gim, "<hr>") // hr tag
        .replace(
          /(^|\(|\s)_(.*?)_(\s|\.|\,|\?|\!|\n|\)|\b)/gim,
          "$1<em>$2</em>$3"
        ) // em text
        .replace(/\*(.*?)\*/gim, "<strong>$1</strong>") // strong text
        .replace(/\~(.*?)\~/gim, "<del>$1</del>") // strike text
        .replace(/^- (.*$)/gim, "<ul><li>$1</li></ul>\n\n") // strike text
        .replace(/^\+ (.*$)/gim, "<ol><li>$1</li></ol>\n\n") // strike text
        .replace(/^\? (.*) : (.*$)/gim, "<dl><dt>$1</dt><dd>$2</dd></dl>\n\n") // strike text
        .replace(/\(link:(.*?)\)/gim, function (char, item) {
          return parseLinks(item);
        }) // links
        .replace(/\(image:(.*?)\)/gim, function (char, item) {
          return parseImage(item);
        }) // image
        .replace(/\(video:(.*?)\)/gim, function (char, item) {
          return parseVideo(item);
        }) // links
        .replace(/\(audio:(.*?)\)/gim, function (char, item) {
          const mp3 = item.trim();
          return `<audio controls src="${mp3}" type="audio/mpeg" preload="metadata"></audio>`;
        }) // links
        .replace(/\(quote:(.*)\)/gim, function (char, item) {
          return parseQuote(item);
        }); // blockquote

      const htmlRegex = new RegExp("^<(.*)>", "gim");
      const htmlTest = htmlRegex.test(tempText);

      if (!htmlTest) {
        tempText = `<p>${tempText.trim()}</p>\n\n`;
      }

      if (tempText) {
        parsedText += tempText;
      }
    } else if (codeTest) {
      const splitCode = el.trim().split("\n");
      splitCode.shift();
      splitCode.pop();
      const cleanedCode = [];
      splitCode.forEach((el) => {
        if (el.includes("<")) {
          cleanedCode.push(el.replace(/</g, "<span><</span>"));
        } else {
          cleanedCode.push(el);
        }
      });
      const tempText = `<pre><code>${cleanedCode.join(
        "\n"
      )}\n</code></pre>\n\n`;
      if (tempText) {
        parsedText += tempText;
      }
    }
  }

  const cleanedText = parsedText
    .replace(/<\/ul>\n\n\n<ul>/g, "")
    .replace(/<\/ol>\n\n\n<ol>/g, "")
    .replace(/<\/dl>\n\n\n<dl>/g, "")
    .replace(/<p>[\s\S\n]<\/p>/gim, "")
    .replace(/<p><\/p>/g, "")
    .replace(/<\/li><li>/g, "</li>\n<li>")
    .replace(/<em><\/em>/g, "__")
    .replace(/<strong><\/strong>/g, "**")
    .replace(/<del><\/del>/g, "~~");

  return cleanedText;
}

function parseTitles(character, titleContent) {
  const lvl = character.length;
  const titleId = toKebab(titleContent).trim();
  const html = `<h${lvl} id="${titleId}" >${titleContent.trim()}<a href="#${titleId}" aria-label="${titleContent.trim()} permalink" style="position:relative; z-index:-1; opacity:30%; display: inline-block;width: 1ch;height: 2ch;margin-left: 1ch;"><svg fill="var(--text)" viewBox="0 0 512 512"><path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"/></svg></a></h${lvl}>\n\n`;
  return html;
}

function parseLinks(linkContent) {
  const linkData = /^(.+?(?=text:|title:|label:|$))/.exec(linkContent);
  const textData = /text:(.+?(?=title:|label:|$))/.exec(linkContent);
  const titleData = /title:(.+?(?=text:|label:|$))/.exec(linkContent);
  const labelData = /label:(.+?(?=text:|title:|$))/.exec(linkContent);
  const link = linkData ? `href="${linkData[1].trim()}"` : "";
  const text = textData ? textData[1].trim() : linkData[1].trim();
  const title = titleData ? ` title="${titleData[1].trim()}"` : "";
  const label = labelData ? ` aria-label="${labelData[1].trim()}"` : "";
  const html = `<a ${link}${title}${label}>${text}</a>`;
  return html;
}

function parseImage(imgContent) {
  const linkData =
    /^.+?(?=figcaption|(.jpg)|(.jpeg)|(.png)|alt:|figcaption|$)/.exec(
      imgContent
    );
  const altData = /alt:(.+?(?=figcaption|$))/.exec(imgContent);
  const figcaptionData = /figcaption:(.+?(?=alt|$))/.exec(imgContent);
  const link = linkData ? linkData[0].trim() : "";
  const extension =
    linkData[1] || linkData[2] || linkData[3]
      ? linkData[1] || linkData[2] || linkData[3]
      : "";
  const alt = altData ? `alt="${altData[1].trim()}"` : "";
  const figcaption = figcaptionData
    ? `<figcaption>${figcaptionData[1].trim()}</figcaption>`
    : "";

  // Uncomment this for picture + srcset
  const html = `${
    figcaption ? "<figure>" : ""
  }<picture><source type="image/webp" srcset="${link}-240.webp 300w, ${link}-680.webp 600w, ${link}-900.webp 900w, ${link}.webp 1200w" /><img loading="lazy" ${
    alt ? ` ${alt}` : ""
  } srcset="${link}-240${extension} 300w, ${link}-680${extension} 600w, ${link}-900${extension} 900w, ${link}${extension} 1200w" src="${link}${extension}"></picture>${figcaption} ${
    figcaption ? "</figure>" : ""
  }`;
  return html;

  // if (figcaption) {
  //   const html = `<figure><img loading="lazy" src="${link}${extension}" ${alt}>${figcaption}</figure>`
  //   return html
  // } else {
  //   const html = `<img loading="lazy" src="${link}${extension}" ${alt}>`
  //   return html
  // }
}

function parseVideo(videoContent) {
  const videoData = /^(.+?(?=autoplay|figcaption|$))/.exec(videoContent);
  const autoplayData = / autoplay/.exec(videoContent);
  const figcaptionData = /figcaption:(.+?(?=autoplay|$))/.exec(videoContent);
  const link = videoData ? `src="${videoData[1].trim()}"` : "";
  const controls = autoplayData
    ? "autoplay playsinline loop mute"
    : "controls playsinline";
  const format = /\.mp4|\.webm|\.mov/.exec(link);
  const source = `type="video/${format.toString().slice(1)}"`;
  const figcaption = figcaptionData
    ? `<figcaption>${figcaptionData[1].trim()}</figcaption>`
    : "";
  const html = `${
    figcaptionData ? "<figure>" : ""
  }<video ${controls} preload="metadata" ${link} ${source}></video>${figcaption}${
    figcaptionData ? "</figure>" : ""
  }`;
  return html;
}

function parseQuote(quoteContent) {
  const quoteData = /^(.+?(?=author|source|link|$))/.exec(quoteContent);
  const authorData = /author:(.+?(?=source|link|$))/.exec(quoteContent);
  const sourceData = /source:(.+?(?=author|link|$))/.exec(quoteContent);
  const linkData = /link:(.+?(?=author|source|$))/.exec(quoteContent);
  const quote = quoteData ? quoteData[1].trim() : false;
  const author = authorData ? authorData[1].trim() : false;
  const source = sourceData ? sourceData[1].trim() : false;
  const link = linkData ? linkData[1].trim() : false;
  const cite = link ? `cite="${link}"` : "";

  let figcaption = "";
  if (author && !source && !link) {
    figcaption = `<figcaption>— ${author}</figcaption>`;
  } else if (author && source && !link) {
    figcaption = `<figcaption>— ${author}, ${source}</figcaption>`;
  } else if (author && source && link) {
    figcaption = `<figcaption>— ${author}, <a href="${link}">${source}</a></figcaption>`;
  } else if (!author && source && link) {
    figcaption = `<figcaption><a href="${link}">${source}</a></figcaption>`;
  } else if (!author && !source && link) {
    figcaption = `<figcaption><a href="${link}">${link}</a></figcaption>`;
  } else if (!author && source && !link) {
    figcaption = `<figcaption>${source}</figcaption>`;
  }

  const html = `<figure><blockquote ${cite}>${quote}</blockquote>${figcaption}</figure>`;
  return html;
}

function toKebab(text) {
  const toKebabCase =
    text &&
    text
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join("-");
  return toKebabCase;
}
