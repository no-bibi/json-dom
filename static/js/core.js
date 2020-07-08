let loadJson = function () {};
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
                if (!data.hasOwnProperty(key)) {
                    return
                }
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
            return `<li class="list-one" data-node="${node}"><div class="single"><a class="close"></a><span class="key">${key}</span></div></li>`
        }

        // 子节点
        getChild(liCss, node, value) {
            let dom = new DomBuilder(value, node);
            return `<li class="${liCss}" data-node="${node}" style="display: block"><ul class="list-all">${dom.html()}</ul></li>`
        }

        // 单一节点
        oneNode(node, key, value, vCss) {
            return `<li class="list-one" data-node="${node}"><div class="single"><span class="key pad">${key}</span><span class="value ${vCss}">${value}</span></div></li>`
        }

        html() {
            return this.buff;
        }

        render() {
            document.getElementById("json-content").innerHTML = this.html();
        }
    }

    class DomController {
        static run() {
            //开关
            $('.json_html_content').on('click', '.close,.open', function (event) {
                let node_status = $(this).hasClass('close') ? 'close' : 'open';
                let change_status = node_status === 'open' ? 'close' : 'open';
                let obj = $(this).removeClass('close').addClass(change_status).closest('li').next();
                obj.toggle();
            });

            //查找节点对应数据
            $('.json_html_content').on('click', 'span.key,span.value', function (event) {
                event.stopPropagation();
                let node = $(this).closest('li').attr('data-node');
                let data = jData;
                let str = JSON.stringify(eval(node));
                console.log(str);
            });
        }
    }

    DomController.run();

    loadJson = (json) => {
        new DomBuilder(json).render();
    }
}
