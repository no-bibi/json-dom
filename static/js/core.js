let loadJson = function () {
};
{
    let jData = null;

    class DomBuilder {
        buff = "";

        constructor(data, path = 'data') {

            if (jData == null) {
                jData = data;
            }
            let i = 0;
            for (let key in data) {
                i++
                let node = path + (!isNaN(key) ? `[${key}]` : '.' + key);
                let listCss = "list-many"

                switch (Object.prototype.toString.call(data[key])) {
                    case "[object Array]":
                    case "[object Object]":
                        // 最后一个做特殊处理
                        if (i === Object.keys(data).length) {
                            listCss = 'list-last';
                        }
                        this.buff += this.manyNode(node, key)
                        this.buff += this.getChild(listCss, node, data[key])
                        break;
                    case "[object Number]":
                        this.buff += this.oneNode(node, key, data[key], 'value-number');
                        break;
                    case "[object Boolean]":
                        this.buff += this.oneNode(node, key, data[key], 'value-bool');
                        break;
                    case "[object Null]":
                        this.buff += this.oneNode(node, key, data[key], 'value-null');
                        break;
                    default:
                        this.buff += this.oneNode(node, key, data[key], '');
                        break;
                }

            }
        }

        // 一对多节点
        manyNode(node, key) {
            return `<li class="list-one" data-node="${node}"><div class="single"><a class="close"></a><xmp class="key">${key}</xmp></div></li>`
        }

        // 子节点
        getChild(liCss, node, value) {
            let dom = new DomBuilder(value, node);
            return `<li class="${liCss}" data-node="${node}" style="display: block"><ul class="list-all">${dom.html()}</ul></li>`
        }

        // 单一节点
        oneNode(node, key, value, vCss) {
            return `<li class="list-one" data-node="${node}"><div class="single"><xmp class="key pad">${key}</xmp><xmp class="value ${vCss}">${value}</xmp></div></li>`
        }

        html() {
            return this.buff;
        }

        render() {
            this.initWarp();
            let wrap = document.getElementById("json-content");
            wrap.innerHTML = this.html();
        }

        initWarp() {
            if (document.getElementById(`json-content`) == null) {
                document.body.innerHTML = this.container();
            }
        }

        container() {
            return `<div class="main"><div class="json_html_content"><ul>
                            <li data-node="data">
                                <div class="single"><a class="close"></a>
                                    <xmp class="key">json</xmp>
                                </div>
                            </li>
                            <li>
                                <ul class="list-all" id="json-content" style="display: block"></ul>
                            </li>
                        </ul>
                    </div>
                </div>`
        }
    }

    class DomController {
        static run() {
            //开关
            $('body').on('click', '.json_html_content .close,.open', function (event) {
                let node_status = $(this).hasClass('close') ? 'close' : 'open';
                let change_status = node_status === 'open' ? 'close' : 'open';
                let obj = $(this).removeClass('close').addClass(change_status).closest('li').next();
                obj.toggle();
            });

            //查找节点对应数据
            $('body').on('click', '.json_html_content xmp.key,xmp.value', function (event) {
                event.stopPropagation();
                let node = $(this).closest('li').attr('data-node');
                let data = jData;
                let str = JSON.stringify(eval(node));
                console.log(str);
            });
        }
    }

    loadJson = (json) => {
        new DomBuilder(json).render();

    }
    document.addEventListener("DOMContentLoaded", function () {
        try {
            let raw = document.body.innerText;
            if (isJSON(raw)) {
                document.body.innerHTML = "";// 清除无用内容
                loadCss().then(function () {
                    let j = JSON.parse(raw);
                    loadJson(j)
                })
            }
        } catch (e) {
            console.log(e)
        }
        // 监听事件
        DomController.run();
    }, false);

    function isJSON(jsonStr) {
        let str = jsonStr;
        if (!str || str.length === 0) {
            return false
        }

        str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
        str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '')
        return (/^[\],:{}\s]*$/).test(str)
    }

    function loadCss() {
        let url = chrome.extension.getURL(`static/css/json.css`);
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.type = "text/css";
        document.head.appendChild(link);
        var checkElement = document.createElement("a");
        checkElement.setAttribute("class", "open");
        document.body.appendChild(checkElement);
        var scheduleId = null;
        return new Promise(function(resolve, reject) {
            function checker() {
                var content = window.
                getComputedStyle(checkElement, ":before").
                getPropertyValue("content");
                if (/\+/.test(content)) {
                    clearTimeout(scheduleId);
                    document.body.removeChild(checkElement);
                    resolve();

                } else {
                    scheduleId = setTimeout(checker, 1);
                }
            }
            checker();
        });

    }
}


