function json2Html(data, path = 'data', html = '') {

    let i = 0;
    for (let key in data) {
        i++
        let value_type = typeof data[key];
        let node = path + (!isNaN(key) ? `[${key}]` : '.' + key);
        if (value_type === 'object') {

            let listCss = "list-many"
            // 最后一个做特殊处理
            if (i === data.length || i === Object.keys(data).length){
                listCss = 'list-last';
            }

            if (key===`tags`){
                console.log(key,data)
                console.log(i,data.length)
            }

            html += `<li class="list-one" data-node="${node}"><div class="single"><a class="open"></a><xmp class="key">${key}</xmp></div></li>`
            html += `<li class="${listCss}" data-node="${node}" style="display: none"><ul class="list-all">${json2Html(data[key], node)}</ul></li>`
        } else if (value_type === 'number') {
            html += `<li class="list-one" data-node="${node}"><div class="single"><icon class="line-row"></icon><xmp class="key pad">${key}</xmp><xmp class="value number">${data[key]}</xmp></div></li>`
        } else {
            html += `<li class="list-one" data-node="${node}"><div class="single"><icon class="line-row"></icon><xmp class="key pad">${key}</xmp><xmp class="value">${data[key]}</xmp></div></li>`
        }
    }
    return html;
}
