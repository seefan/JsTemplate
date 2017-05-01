/**
 * JsTemplate的运行主体，对外使用的变量有$scope，当使用bindData时，变量会按绑定名字注入这个变量。
 *
 * 目前支持两种形式的绑定，单变量绑定和数组。
 *
 * 单变量绑定
 * =============
 *
 * 是以html中data-bind标记为绑定对象，只要data-bind的内容和绑定的变量同名，即会自动赋值。
 *
 * 例如：
 *
 *     <p data-bind='title'></p>
 *
 * 这时如果有一个变量为如下结构{title:'hello world'}，那么，这个data-bind为title的p标签就会显示hello world。
 *
 * 最终会生成
 *
 *     <p data-bind='title'>hello world</p>
 *
 *
 * 使用方法参见示例：
 *
 * 1.普通绑定：输出到p的默认内容中，此处为innerHTML属性。一般img将输出到src，input输出到value，其它输出到innerHTML。
 *
 *     <p data-bind="content"></p>
 *
 * 2.原始值按html输出：
 *
 *     <p data-bind="content" data-bind-to="innerHTML"></p>
 *     或
 *     <p data-bind="content" data-bind-to="innerHTML">{!content}</p>
 *     第1种为简写，第2种为data-bind-to的标准写法
 *
 *
 * 3.data-bind-to使用：
 *
 *     <b data-bind="market_product_id" data-bind-to="title" title="{!content}">title</b>
 *
 *     data-bind-to指定了输出的属性，所以将绑定的内容将按data-bind-to进行绑定。此处data-bind-to为title，
 *     待绑定的属性内容要使用模板。
 *     所以XTemplate将会把market_product_id的值绑定到title属性上。
 *     此处模板内content前有个叹号“！”，代表输出原始值，不进行html转义。
 *
 * 4.模板输出：必须使用data-bind-to指定属性名，默认的输出属性值不会当作模板。
 *
 *     <p data-bind="content" data-bind-to="innerHTML"><b>{content|default,'没有内容显示'}</b></p>
 *
 *     content的内容会以内部html为模板绑定后显示
 *
 *     如果content为空，最终输出
 *
 *     <p data-bind="content" data-bind-to="innerHTML"><b>没有内容显示</b></p>
 *
 *     如果刚开始不想显示出模板的内容，可以将p设置为隐藏
 *
 *     <p style="display:none" data-bind-to="innerHTML" data-bind="content"><b>{content|default,'没有内容显示'}</b></p>
 *
 *     或
 *
 *     <p class="hide" data-bind-to="innerHTML" data-bind="content"><b>{content|default,'没有内容显示'}</b></p>
 *
 *     绑定后style.display将被重置为空，css中的hide也会被移除。
 *
 * 5.img的src绑定：
 *
 *     <img data-bind="thumb"/>
 *     最终输出<img data-bind="thumb" src="图片地址"/>
 *
 *     指定img的默认显示图片，直接使用原来的src指定默认图
 *     <img data-bind="imgsrc" data-bind-src='/{imgsrc}/abc.jpg' src='默认图'/>
 *
 *     如果img的地址比较复杂，是组合而成，或是需要用函数，可以使用data-bind-src来指定src的模板。
 *     <img data-bind="thumb" data-bind-src="{thumb1|default,'logo.jpg'}"/>
 *
 *     注意不要用src属性！！！
 *
 *     不使用data-bind-to指定src，是因为如果指定img的src，将会使浏览器多产生一个无效的http请求，影响加载效果。
 *
 *     错误的例子：<img data-bind="thumb" data-bind-to="src" src='/{imgsrc}/abc.jpg'>
 *     /{imgsrc}/abc.jpg这个地址是不存在的地方，所以会引起一个错误的http请求。
 *
 * 6.在一个标签内绑定多个属性名:
 *
 *     <img data-bind="thumb" data-bind-to="title data-load-src"/>
 *     多个属性中间用空格分开，这个可以一次绑定属性。
 *
 * 数组绑定
 * =============
 * 数组绑定是指定一个模板，并把数组的内容循环，按模板格式化后返回多行html。
 *
 * 例如：
 *
 *      <ul data-repeat-name='listdata'>
 *          <li>{title}</li>
 *      </ul>
 *
 * 这里定义了一个名为listdata的模板，ul的内部html将成为可循环的模板，即
 *
 *      <li>{title}</li>
 *
 * 为待循环的内容
 *
 * 我们绑定以下变量[{title:'hello 0'},{title:'hello 1'}]
 *
 * 最终会生成
 *
 *     <ul data-repeat-name='listdata'>
 *          <li>hello 0</li>
 *          <li>hello 1</li>
 *     </ul>
 *
 * 使用方法参见示例：
 *
 * 1.普通输出：
 *
 *      <ul data-repeat-name='data'>
 *          <li>{market_product_id}:{product_name}</li>
 *      </ul>
 *
 * 2.img的src绑定：
 *
 *      <ul data-repeat-name='data'>
 *          <li><img data-bind-src='{thumb}'/>{market_product_id}:{!content}</li>
 *      </ul>
 *
 *      这里与单变量绑定不同的是没有使用data-bind指定绑定的属性，其它使用方法完全一致。
 *
 * 模板的使用
 * =============
 *
 * 模板的基本语法是{模板内容}，两端以大括号包围，中间为模板的内容。
 *
 * 如：{username}，即输出变量username的内容。
 *
 * 模板可以在循环的模板中使用，也可以在待绑定属性中使用，也可以在data-bind-src中使用。
 *
 * 使用方法参见示例：
 *
 * 1.使用内部函数处理输出结果：
 *
 *
 *     {market_product_num|repeat,'*'}//最终输出market_product_num个*，{{#crossLink "Render.funcs/repeat:method"}}{{/crossLink}}为内部函数
 *
 *     语法为：[属性名]|[函数]|[函数]
 *     属性名后竖线"|"连接函数名，当前的属性必须为函数的第1个参数。
 *     多个函数时依次用竖线连接，前一个函数作为后一个函数的第一个变量输入。
 *
 *     如：{user_money|format_money}，其中user_money为绑定属性名，{{#crossLink "Render.funcs/format_money:method"}}{{/crossLink}}为内部函数名，主要作用为格式化货币。
 *
 *     如果函数有多个参数，使用逗号连接。
 *
 *
 * 2.使用外部函数处理输出结果：
 *
 *     {market_product_id|#hello,':)'}
 *
 *     函数名前加了#号，代表使用外部函数，此处使用了hello，该函数使用前一定要定义。
 *
 *     此处market_product_id的值会传给s变量，即第1个变量。
 *
 *     示例1：
 *
 *     function hello(s){
 *         return s+' hello';
 *     }
 *
 *     示例2：
 *     function hello(s,v){
 *         return s+'hello'+v;
 *     }
 *
 *
 * 3.使用多个函数处理输出结果：
 *
 *     {market_product_id|repeat,'@@'|#hello,':)'}
 *
 *     用|连接即可。
 *
 * 4.使用外部变量：
 *
 *     {id}={#out_abc}
 *
 *     变量前加#
 *
 * 5.进行简单的运算：
 *
 *     {market_product_id * 3 + 12}
 *
 *     在模板中，属性名支持简单的加减乘除运算，复杂的请使用自定义函数处理。
 *
 * 6.在模板中处理子循环：
 *
 *     {list|range,'ID:(id)&nbsp; '}
 *
 *     使用内部函数range，参数为模板内容。但为了区分子模板和主模板，子模板使用小括号“()”代替大括号。
 *
 *
 *
 * 特殊语法：
 * =============
 *
 * !号的使用
 *
 * 在模板中使用，例如{!title}，输出title的值，以没有!的区别，这里不会把html进行编码，会输出原始的html。
 *
 * #号的使用
 *
 * 在函数名中使用，如果在函数名前加#，则指定这个函数为全局函数，这时这个函数必须是已经定义好的全局函数或是javascript的内部函数。
 * 在变量名中使用，如果果变量名前加#，则指定这个变量为全局变量，这时这个变量必须是已经定义好的全局变量。
 *
 *
 * 绑定示例
 * =============
 *
 *     注意：使用load方法，需要jQuery的支持，详细见API中关于函数的介绍
 *
 *     第1个参数为为绑定名称，第2个为请求的数据地址，第3个为请求的参数，第4个为数据过滤处理，一般用于把要绑定的数据返回。
 *
 * json的数据内容为
 *
 *     {
 *     "error":0,
 *     "data":[
 *      {"thumb":"../images/product-1.jpg","product_name":"体验品","price":12,"oldprice":100},
 *      {"thumb":"../images/product-2.jpg","product_name":"体验品","price":13,"oldprice":100},
 *      {"thumb":"../images/product-3.jpg","product_name":"体验品","price":24,"oldprice":100},
 *      {"thumb":"../images/product-4.jpg","product_name":"体验品","price":15,"oldprice":100},
 *      {"thumb":"../images/product-5.jpg","product_name":"体验品","price":65,"oldprice":100},
 *      {"thumb":"../images/product-6.jpg","product_name":"体验品","price":32,"oldprice":100}
 *     ]}
 *
 * 模板内容为
 *
 *     <ul data-repeat-name='data0'>
 *         <li>{product_name} {price} <s>{oldprice}</s> </li>
 *     </ul>
 *
 * script为
 *
 *      XTemplate.ready(function () {
 *         this.load('data0', 'data.json', {}, function (e) {
 *             return e.data;
 *         });
 *     });
 *
 * 最终将输出
 *
 *     <ul data-repeat-name='data0'>
 *          <li>体验品 12 <s>100</s> </li>
 *          <li>体验品 13 <s>100</s> </li>
 *          <li>体验品 24 <s>100</s> </li>
 *          <li>体验品 15 <s>100</s> </li>
 *          <li>体验品 65 <s>100</s> </li>
 *          <li>体验品 32 <s>100</s> </li>
 *     </ul>
 *
 * @class Render
 */
(function (w, doc, r) {
    'use strict';
    //
    /**
     * 全局变量，绑定到window
     * @property $scope
     * @type {object}
     */
    w.$scope = {};
    //可绑定的key列表
    r.$bindKey = {};

    //语法处理
    r.syntax = {};
    //内部函数
    r.funcs = {};
    //工具
    r.util = {};
    /**
     * 初始化语法结构
     */
    r.init = function () {
        var items, i;
        if (this.hideRepeat) {
            items = r.util.querySelectorAll('[data-repeat-name]');
            for (i = 0; i < items.length; i++) {
                this.util.show(items[i], false);
            }
        }
        if (this.hideBind) {
            items = r.util.querySelectorAll('[data-bind]');
            for (i = 0; i < items.length; i++) {
                this.util.show(items[i], false);
            }
        }
    };

    /**
     * 绑定数据值
     *
     * 当未指定名称时，在绑定时直接使用属性名，例：{key:'key1'}，绑定时只需key即可
     * 当指定名称时，在绑定时需要在属性名前加上指定的名称，例：{key:'key1'}，名称为data1,绑定时需data1.key
     * 绑定的数据会缓存在$scope内
     *
     * 示例：
     *
     *     bindData('data',{id:1});绑定时用data-bind='data.id'，如<p data-bind='data.id'/>
     *     bindData({id:1});绑定时用id，注意此时省略了名称
     *
     * @method bindData
     * @param name 绑定对象的名称，如果不设置时定的key不加绑定名
     * @param data 要绑定的数据
     */
    r.bindData = function (name, data) {

        if (typeof data === 'undefined') {
            data = name;
            name = '__data__';
        }
        w.$scope[name] = data;
        var items = r.util.querySelectorAll('[data-bind]');

        if (!items || !items.length) {
            return;
        }
        var i, value, tpl, attrName, key;
        for (i = 0; i < items.length; i++) {
            value = '';
            key = items[i].attributes['data-bind'].value;
            if (name != '__data__' && key.indexOf('.') != -1) {
                key = key.substring(name.length + 1);
            }
            var bs = this.util.getBindToNameList(items[i]),
                m = 0;//data-bind-to

            if (bs.length > 0) {
                for (; m < bs.length; m++) {
                    attrName = bs[m];
                    if (items[i].attributes[attrName]) {
                        tpl = items[i].attributes[attrName].value;
                    } else {
                        tpl = items[i][attrName];
                    }
                    //var xf = r.syntax.buildFunc(key, tpl);
                    var xf = r.syntax.cacheFunc('bind', tpl, tpl);
                    if (xf.func) {
                        value = xf.func(this, data);
                    } else {
                        //如果简单的绑定innerHTML,就不再转为纯文本了
                        if (attrName === 'innerHTML') {
                            value = this.util.getValue(key, data);
                        } else {
                            value = this.util.html(this.util.getValue(key, data));
                        }
                    }
                }

            } else {
                //单独处理一下img的data-bind-src，使用模板
                if (items[i].tagName == 'IMG' && items[i].attributes['data-bind-src']) {
                    //var xff = r.syntax.buildFunc(key, items[i].attributes['data-bind-src'].value);
                    var xff = r.syntax.cacheFunc('bind', items[i].attributes['data-bind-src'].value, items[i].attributes['data-bind-src'].value);
                    if (xff.func) {
                        value = xff.func(this, data);
                    } else {
                        value = this.util.getValue(key, data);//不需要html转义
                    }
                } else {
                    value = this.util.html(this.util.getValue(key, data));
                }
            }

            this.util.setValue(items[i], value);
            this.util.show(items[i]);
        }
    };
    /**
     * 重新给某个对象绑定新的值，修改后的值不会更新$scope内部缓存的值
     *
     * @method bindName
     * @param name 绑定名，用data-bind指定
     * @param value 绑定值
     */
    r.bindName = function (name, value) {
        var items = r.util.querySelectorAll('[data-bind="' + name + '"]');
        if (items) {
            for (var i = 0; i < items.length; i++) {
                this.util.setValue(items[i], value);
                this.util.show(items[i]);
            }
        }
    };
    /**
     * 循环绑定数据值
     *
     * 示例：
     *
     *     bindRepeatData([{id:1},{id:2}])
     *     bindRepeatData('news',[{id:1},{id:2}])
     *
     * @method bindRepeatData
     * @param name 要循环输出的模板范围的名称，默认为data，可省略不写
     * @param data 要绑定的数据
     * @param append [可选] 是否追加数据，默认为false
     * @param animation [可选] 是否追加数据，默认为false
     * @param tpl [可选] 指定模板内容
     */
    r.bindRepeatData = function (name, data, append, animation, tpl) {
        if (typeof data == 'undefined') {
            data = name;
            name = 'data';
        }
        if (!data || !r.util.isArray(data)) {
            return;
        }
        var items = r.util.querySelectorAll('[data-repeat-name="' + name + '"]');
        //if (items.length === 0) {
        //    return;
        //}
        //var item = items[0];
        //if (!item || !item.innerHTML) {
        //    return;
        //}

        for (var i = 0; i < items.length; i++) {
            r.doRepeat(name + '_' + i, data, append, animation, tpl, items[i]);
        }
    };
    r.doRepeat = function (name, data, append, animation, tpl, item) {
        if (typeof tpl != 'string') {
            tpl = item.innerHTML;
        }
        var cache = this.syntax.cacheFunc('repeat', name, tpl), i = 0;
        if (!append || cache.isFirst) {
            item.innerHTML = '';
        }
        var func = cache.func;
        if (func) {
            if (animation === true) {
                this.appendData(data, 0, item, func, append);
            } else {
                var html = '';
                for (i = 0; i < data.length; i++) {
                    var tmp = data[i];
                    tmp.__index__ = i;
                    html += func(this, tmp);
                }
                this.setRepeatHtml(item, html, append);
            }
        }
    };
    r.appendData = function (data, i, item, func, append) {
        var tmp = data[i];
        tmp.__index__ = i;
        r.setRepeatHtml(item, func(this, tmp), i === 0 ? (append === true) : true);
        i++;
        if (i < data.length) {
            setTimeout(function () {
                r.appendData(data, i, item, func, append);
            }, 50);
        }
    };
    r.setRepeatHtml = function (item, html, append) {
        if (append === true) {
            item.innerHTML += html;
        } else {
            item.innerHTML = html;
        }
        r.util.show(item);
    };

    /**
     * 如果需要自行扩展Render的函数，请使用本函数。
     * 这些函数可以在html的模板中使用
     *
     * 示例：
     *
     *     addFunc('test',function(){
     *        alert('test');
     *     });
     *
     * 使用时和内部函数一样，语法为{name|test}
     *
     * @method addFunc
     * @param name 函数的名称
     * @param func 函数体
     */
    r.addFunc = function (name, func) {
        if (func && name) {
            this.funcs[name] = func;
        }
    };
})
(window, document, window.jsRender = {});;/**
 * 常用工具方法集合
 * @class Render.util
 */
(function (w, u) {
    'use strict';
    /**
     * 清理代码，主要是清理掉换行和空格
     *
     * @method trim
     * @param val {string} 要清理的内容
     */
    u.trim = function (val) {
        if (typeof(val) == 'string') {
            return val.replace(/\r/g, '').replace(/\n/g, '').replace('　', '').trim();
        } else if (u.isPlainObject(val)) {
            return u.trim(u.getDefaultValue(val));
        } else {
            return String.valueOf(val);
        }
    };
    /**
     * 是否是一个简单的对象
     * @method isPlainObject
     * @param value 目标对象
     * @returns {boolean}
     */
    u.isPlainObject = function (value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    };

    /**
     * 给指定html网页中对象设置值，目前对img设置src，input设置value，其它设置innerHTML。
     * 此方法内部用。
     *
     * @param ele 对象实例
     * @param value 值
     */
    u.setValue = function (ele, value) {
        var tag = ele.tagName, i = 0;
        var bs = this.getBindToNameList(ele);
        if (bs.length > 0) {
            for (i in bs) {
                var attrName = bs[i];
                if (ele.attributes[attrName]) {
                    ele.setAttribute(attrName, value);
                } else {
                    ele[attrName] = value;
                }
            }
        } else {
            switch (tag) {
                case 'IMG':
                    ele.src = value;
                    break;
                case 'INPUT':
                    ele.value = value;
                    break;
                case 'SELECT':
                    for (i = 0; i < ele.options.length; i++) {
                        if (ele.options[i].value == value) {
                            ele.options[i].selected = true;
                            break;
                        }
                    }
                    break;
                default:
                    ele.innerHTML = value;
                    break;
            }
        }
    };

    /**
     * 过滤html，清理掉所有的html标签和换行空格
     *
     * @param html {string}
     * @returns {string}
     */
    u.html = function (html) {
        if (html && typeof(html) == 'string') {
            html = html.replace(/<[^<]*>/gi, '');
            return html.trim();
        } else {
            return this.getDefaultValue(html);
        }
    };
    /**
     * 判断变量是否为数组
     *
     * @param val 要判断的变量
     * @returns {boolean} 是否为数组
     */
    //u.isArray = function (val) {
    //    return toString.apply(val) === "[object Array]";
    //};
    u.isArray = Array.isArray || function (object) {
            return object instanceof Array;
        };
    /**
     * 取数组的key全集，内部使用
     * @param key
     * @param data
     * @returns {*}
     */
    u.getName = function (key, data) {
        var value = data[key];
        var type = typeof value;
        switch (type) {
            case 'string':
            case 'number':
            case 'boolean':
                return [key];
            case 'object':
                if (u.isArray(value)) {
                    return [key];
                } else {
                    var names = [];
                    for (var k in value) {
                        //跳过非属性
                        if (value.hasOwnProperty(k)) {
                            var tkv = u.getName(k, value);
                            for (var i = 0; i < tkv.length; i++) {
                                names.push(key + '.' + tkv[i]);
                            }
                        }
                    }
                    return names;
                }
                break;
            default:
                return [];
        }
    };
    /**
     * 是否有指定串开头
     *
     * 示例：
     *
     *     startWith('abcdedfs','ab')   输出 true
     *
     * @method startWith
     * @param str {string} 待检查的串
     * @param startString 指定串
     * @returns {boolean}
     */
    u.startWith = function (str, startString) {
        return (typeof str === 'string' && str.indexOf(startString) === 0);
    };
    /**
     * 使用正则表示式判断是否为数字格式
     *
     * @method isNumber
     * @param chars {string}待判断有串
     * @returns {boolean}
     */
    u.isNumber = function (chars) {
        var re = /^(-?\d+)(\.\d+)?/;
        return chars.match(re) !== null;
    };

    /**
     * 取指定数组的值，内部用
     * @param key
     * @param data
     * @returns {*}
     */
    u.getValue = function (key, data) {
        var keys = key.split('.'), result = data[keys.shift()];
        for (var i = 0; result && i < keys.length; i++) {
            result = result[keys[i]];
        }
        //
        return this.getDefaultValue(result);
    };
    /**
     * 取值，支持两种数据，简单变量和数组，如果为null或是undefined，自动转为空串。内部用
     * @param val
     * @returns {*}
     */
    u.getDefaultValue = function (val) {
        if (val === null || typeof val == 'undefined') {
            return '';
        } else {
            return val;
        }
    };
    /**
     * 转向一个url，支持多个参数，第一个参数为url地址，后续为参数
     *
     * 示例：
     *
     *     gotoUrl('index.html','id',1) 跳转到 index.html?id=1
     *     gotoUrl('index.html?id=1','k','news','c','show') 跳转到 index.html?id=1&k=news&c=show
     *
     * @method gotoUrl
     * @param url {string} 要跳转的url地址
     * @param ... 多个自由参数，2个一组，第1个为参数名，第2个为值。
     */
    u.gotoUrl = function () {
        var url = '', i = 0;
        if (arguments.length > 0) {
            url = arguments[i];
        }
        if (url.indexOf('?') != -1) {
            url += '&';
        } else {
            url += '?';
        }
        for (i = 1; i < arguments.length - 1; i += 2) {
            url += arguments[i] + '=' + encodeURIComponent(arguments[i + 1]) + '&';
        }
        w.location.href = url;
    };
    /**
     * 取绑定名列表，多个绑定名用空格分开，内部用
     * @param item 目标
     * @returns {Array} 返回绑定名列表
     */
    u.getBindToNameList = function (item) {
        var binds = item.attributes['data-bind-to'];
        var re = [];
        if (binds && binds.value) {
            var sps = binds.value.split(' ');
            var tmp, i = 0;
            for (; i < sps.length; i++) {
                tmp = u.trim(sps[i]);
                if (tmp !== '') {
                    re.push(tmp);
                }
            }
        }
        return re;
    };
    /**
     * 显示一个对象
     * 设置style.display=''，同时去掉class中名为hide样式
     *
     * @method show
     * @param ele {string} 要显示的对象实例
     * @param isTrue {boolean} 是否显示，默认为true
     */
    u.show = function (ele, isTrue) {
        if (ele) {
            if (isTrue !== false) {
                if (ele.style.display == 'none') {
                    ele.style.display = '';
                }
                u.removeClass(ele, 'hide');
            } else {
                ele.style.display = 'none';
            }
        }
    };
    /**
     * 增加一个class
     * @method setValue
     * @param ele {object} 要操作的对象
     * @param className {string} 要增加的class名称
     */
    u.addClass = function (ele, className) {
        if (ele.classList) {
            if (!ele.classList.contains(className)) {
                ele.classList.add(className);
            }
        } else {
            var css = ele.className;
            if (css) {
                var csss = css.split(' '), exists = false;
                for (var i = 0; i < csss.length; i++) {
                    if (csss[i] == className) {
                        exists = true;
                    }
                }
                if (!exists) {
                    csss.push(className);
                }
                css = csss.join(' ');
            } else {
                css = className;
            }
            ele.className = css;
        }
    };
    /**
     * 删除一个class
     * @method setValue
     * @param ele {object} 要操作的对象
     * @param className {string} 要删除的class名称
     */
    u.removeClass = function (ele, className) {
        if (ele.classList) {
            if (ele.classList.contains(className)) {
                ele.classList.remove(className);
            }
        } else {
            var css = ele.className;
            if (css) {
                var csss = css.split(' ');
                css = '';
                for (var i = 0; i < csss.length; i++) {
                    if (csss[i] != className) {
                        css += csss[i];
                    }
                }
                ele.className = css;
            }
        }
    };
    /**
     * 取url的所有参数
     * @method getUrlQuery
     * @returns {object}
     */
    u.getUrlQuery = function () {
        var args = {};

        var query = w.location.search;//获取查询串
        if (query && query.length > 1) {
            query = query.substring(1);
            var pos = query.indexOf('#');
            if (pos != -1) {
                query = query.substring(0, pos);
            }
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                pos = pairs[i].indexOf('=');//查找name=value
                if (pos == -1) {
                    continue;
                }
                //如果没有找到就跳过
                var argname = pairs[i].substring(0, pos);//提取name
                if (!argname) {
                    continue;
                }
                var value = pairs[i].substring(pos + 1);//提取value
                if (!value) {
                    continue;
                }
                args[argname] = decodeURIComponent(value);//存为属性
            }
        }
        return args;
    };
    /**
     * 设置url的参数
     * @method setUrlQuery
     * @param qs {object} 一个包含keyvalue的对象
     */
    u.setUrlQuery = function (qs) {
        var search = '';
        for (var q in qs) {
            if (qs[q]) {
                search += q + '=' + encodeURIComponent(qs[q]) + '&';
            }
        }
        w.location.search = search;
    };
    u.querySelectorAll = function (q) {
        if (document.querySelectorAll) {
            return document.querySelectorAll(q);
        }
    };
    /**
     * 计算表达式的值
     * @param fn
     * @returns {*}
     */
    u.eval = function (fn) {
        var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
        return new Fn('return ' + fn)();
    };
})(window, window.jsRender.util);;/**
 * Render 的语法定义
 */
(function (r) {


    /**
     * 将数据与模块绑定
     * @param tmpl
     * @returns {XML|string|void}
     */
    function runTemplate(tmpl) {
        var i = 0, start = 0, end = 0, word, result = [];
        while (i < tmpl.length) {
            start = tmpl.indexOf('{', i);
            if (start !== -1) {
                end = getEnd(tmpl, start, '}');
                if (end === -1) {
                    end = tmpl.length;
                }
                word = tmpl.substring(start + 1, end).trim();

                result.push(runText(tmpl.substring(i, start)));
                if (word !== '') {
                    result.push(runKeyword(word));
                }
            } else {
                result.push(runText(tmpl.substring(i)));
                end = tmpl.length;
            }
            i = end + 1;
        }
        return result.join('+');
    }

    /**
     * 处理字符串
     * @param text
     */
    function runText(text) {
        if (typeof(text) == 'string') {
            return '"' + text.replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace('data-bind-src', 'src') + '"';
        } else {
            return r.util.getStringValue(text);
        }
    }

    /**
     * 处理函数关键字
     * @param funcString
     * @returns {*}
     */
    function runKeyword(funcString) {
        var filterHtml = true;
        if (funcString[0] == '!') {
            funcString = funcString.substring(1);
            filterHtml = false;
        }
        if (funcString) {
            var f = splitWord(funcString);
            if (f.length > 0) {
                if (filterHtml) {
                    return 'JsRender.util.html(' + runFuncString(f, f.length - 1) + ')';
                } else {
                    return runFuncString(f, f.length - 1);
                }
            }
        }
        return '""';
    }


    /**
     * 组合出函数结构
     * @param funcs
     * @param i
     * @returns {*}
     */
    function runFuncString(funcs, i) {
        if (funcs.length === 1) {
            return runValue(funcs[0]);
        }
        if (i > 0) {
            var array = [], j = 0, args = '';
            for (; i >= 0; i--) {
                if (funcs[i] === '|') {//发现一个函数
                    var funcName = array.pop();
                    for (j = array.length; j > 0; j--) {
                        args += runValue(array[j - 1]);
                    }

                    args = runFuncString(funcs, i - 1) + args;

                    return runFunc(funcName) + '(' + args + ')';
                } else {
                    array.push(funcs[i]);
                }
            }
            if (array.length > 0) {
                for (j = array.length; j > 0; j--) {
                    args += runValue(array[j - 1]);
                }
                return args;
            }
        } else {
            return runValue(funcs[0]);
        }

        return '';
    }

    /**
     * 取存在有函数名
     * @param funcName
     * @returns {string}
     */
    function runFunc(funcName) {
        if (funcName && funcName.length > 1 && funcName.charAt(0) == '#') {
            return funcName.substring(1);
        } else if (r.funcs[funcName]) {
            return 'my.funcs["' + funcName + '"]';
        } else {
            return 'my.funcs.noFunc';
        }
    }

    /**
     * 处理关键字
     * 有几类数据
     * 1、数字，可以以-.开头
     * 2、#开头的为全局变量
     * 3、循环变量
     * 4、以"或'包围的字符串
     * @param word
     */
    function runValue(word) {
        var val = '';
        switch (word.charAt(0)) {
            case '+':
            case "-":
            case '*':
            case '/':
            case '(':
            case ')':
            case "'":
            case '"':
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                val += word;
                break;
            case '|'://内部用，不开放
                val += '+';
                break;
            case ','://内部用，不开放
                val += ',';
                break;
            case '#'://外部变量
                val += word.substring(1);
                break;
            default :
                val += "my.util.getValue('" + word + "',vo)";
                break;
        }

        return val === '' ? "''" : val;
    }

    /**
     * 拆分单词
     * @param word
     * @returns {Array}
     */
    function splitWord(word) {
        var arr = [], key = '', end = 0, value;
        for (var i = 0; i < word.length; i++) {
            value = word.charAt(i);
            switch (value) {
                case '|':
                case ',':
                case '+':
                case '-':
                case '*':
                case '/':
                    if (key !== '') {
                        arr.push(key);
                        key = '';
                    }
                    arr.push(value);
                    break;
                case '"':
                case "'":
                    if (key !== '') {
                        arr.push(key);
                        key = '';
                    }
                    end = getEnd(word, i, value);
                    if (end > 0) {
                        arr.push(word.substring(i, end + 1));
                        i = end;
                    }
                    break;
                default :
                    if (value && value !== ' ') {
                        key += value;
                    }
                    break;
            }
        }
        if (key !== '') {
            arr.push(key);
        }
        return arr;
    }

    /**
     * 根据单词开始取结尾,
     * @param word
     * @param i
     * @param ec
     * @returns {*}
     */
    function getEnd(word, i, ec) {
        for (var j = i + 1; j < word.length; j++) {
            if (word.charAt(j) == ec) {//找到结尾
                return j;
            } else if (word.charAt(j) == '"' || word.charAt(j) == "'") {
                i = getEnd(word, j, word.charAt(j));
                if (i === 0) {
                    return 0;
                } else {
                    j = i;
                }
            }
        }
        return 0;
    }

    //语法缓存
    r.syntax.cache = {};
    /**
     * 返回绑定函数
     * @param name
     * @param html
     * @returns {*}
     */
    r.syntax.buildFunc = function (name, html) {
        var tpl;
        try {
            tpl = decodeURIComponent(html);
        } catch (e) {
            tpl = html;
        }
        tpl = r.util.trim(tpl);
        if (tpl.length > 0) {
            var funcBody = 'return ' + runTemplate(tpl) + ';';
            try {
                /* jshint ignore:start */
                return new Function('my', 'vo', funcBody);
                /* jshint ignore:end */
            } catch (e) {
                console.log('解析模板' + name + '出错，' + e.message);
                console.log(funcBody);
            }
        }
        return false;
    };

    /**
     * 返回有缓存的方法
     * @param type 类型
     * @param id 标识
     * @param html 模板内容
     * @returns {*}
     */
    r.syntax.cacheFunc = function (type, id, html) {
        var f = this.cache[type + '-func-' + id];
        var re = {func: f};
        if (!f) {
            f = this.buildFunc(id, html);
            if (f) {
                this.cache[type + '-func-' + id] = f;
                re.isFirst = true;
                re.func = f;
            }
        }
        return re;
    };
})(window.jsRender);;/**
 * JsTemplate 所有的扩展函数集合，用于处理html中常见的格式转换，默认值等处理。
 * 如果需要自行扩展，请使用window.Render的addFunc函数
 *
 * @class Render.funcs
 */
(function (r, undefined) {
    'use strict';
    /**
     * 指定输出的默认值，如果有值就原样输出，如果空或是null，就输出默认值。
     *
     * 示例：
     *
     *     {name|default,'小明'}
     *
     * @method default
     * @param val {string} 变量名
     * @param defaultVal 默认值
     * @returns {object}
     */
    r.addFunc('default', function (val, defaultVal) {
        if (val === undefined || typeof(val) == 'undefined' || val === '' || val === 'null') {
            return defaultVal;
        }
        return val;
    });
    /**
     * 判断变量是否为空。
     *
     * 示例：
     *
     *     {name|empty,'空','不空'}
     *
     * @method default
     * @param val {string} 变量名
     * @param emptyValue 为空时显示值
     * @param notEmptyValue 不为空时显示的值
     * @returns {object}
     */
    r.addFunc('empty', function (val, emptyValue, notEmptyValue) {
        if (val === undefined || typeof(val) == 'undefined' || val === '' || val === 'null') {
            return emptyValue;
        } else {
            return notEmptyValue;
        }
    });

    /**
     * 根据设定值返回指定内容
     *
     * 示例：
     *
     *     {status|case,-1,'审核不通过',1,'审核通过','待审核'}
     *     {status|case,-1,'审核不通过',1,'审核通过',2,'VIP','待审核'}
     *
     * 参数说明：参数成对出现，第一个是设定值，第二是要返回的值；后续可以增加多个成队的参数；最后一个参数为默认值，所有设定值都不满足时输出
     * @method case
     * @param val {string} 变量名
     * @returns {object}
     */
    r.addFunc('case', function (val) {
        for (var i = 1; i < arguments.length; i += 2) {
            if (val == arguments[i] && i < arguments.length - 1) {
                return arguments[i + 1];
            }
        }
        return arguments[arguments.length - 1];
    });
    /**
     * 格式化货币，最少小数显示，
     * 示例：
     *
     *     {price|format_money}
     *     如果price为10.0100，显示10.01
     *     如果price为10.000，显示10
     *
     * @method format_money
     * @param val {string} 变量名
     * @returns {number}
     */
    r.addFunc('format_money', function (val) {
        return parseFloat(val);
    });


    /**
     * 将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 示例：
     *
     *     {date|format_date,"yyyy-MM-dd hh:mm:ss.S"}   输出  2006-07-02 08:09:04.423
     *     {date|format_date,"yyyy-M-d h:m:s.S"}    输出  2006-7-2 8:9:4.18
     *     {date|format_date,"yyyy-M-d h:m:s"}    输出  2006-7-2 8:9:4
     *
     * @method format_date
     * @param val {string} 变量名
     * @param fmt {string} 格式串
     * @returns {string} 格式化后的日期串
     */
    r.addFunc('format_date', function (val, fmt) {
        if (typeof(val) != 'object') {
            val = new Date(parseInt(val));
        }
        if (!fmt) {
            fmt = 'yyyy-MM-dd hh:mm:ss';
        }
        var format_data_o = {
            "M+": val.getMonth() + 1,                 //月份
            "d+": val.getDate(),                    //日
            "h+": val.getHours(),                   //小时
            "m+": val.getMinutes(),                 //分
            "s+": val.getSeconds(),                 //秒
            "q+": Math.floor((val.getMonth() + 3) / 3), //季度
            "S": val.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (val.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in format_data_o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (format_data_o[k]) : (("00" + format_data_o[k]).substr(("" + format_data_o[k]).length)));
        return fmt;

    });
    /**
     * 数字保留小数位数
     * 示例：
     *
     *     {float_num|fixed,2}
     *
     * @method fixed
     * @param val {string} 要格式的变量名
     * @param c {number} 保留的小数位置，默认为0
     * @returns {number}
     */
    r.addFunc('fixed', function (val, c) {
        if (typeof c == 'undefined') {
            c = 0;
        }
        if (typeof(val) == 'number') {
            return val.toFixed(c);
        } else {
            return val;
        }
    });
    /**
     * 没有正确的函数处理时，用此函数处理，直接输出变量值
     * 外部不要使用
     * @param val {string} 变量名
     * @returns {string}
     */
    r.addFunc('noFunc', function () {
        return '没有找到正确的处理函数';
    });
    /**
     * 重复输出num次val
     *
     * 示例：
     *
     *     {num|repeat,'*'}，当num=4时，输出****
     *
     * @method repeat
     * @param val {string} 重复次数
     * @param res {string}要重复的内容
     * @returns {string}
     */
    r.addFunc('repeat', function (val, res) {
        var result = '';
        for (var i = 0; i < val; i++) {
            result += res;
        }
        return result;
    });
    /**
     * 内部实现简单的循环，注意，内部模板和普通模板有区别，需要使用小括号代替大扩号。
     * 常用于嵌套循环显示。
     *
     * 示例：
     *
     *      {array|range,'(id),'}，如果array=[{id:0},{id:1}]，会输出0,1,
     *
     * @method range
     * @param list {string} 要循环的数组变量名
     * @param tmpl {string} 模板
     * @returns {string} 输出的html
     */
    r.addFunc('range', function (list, tmpl) {
        var html = '';
        if (tmpl) {
            tmpl = tmpl.replace(/\(/g, '{').replace(/\)/g, '}');
            var func = r.syntax.buildFunc('range', tmpl);
            if (func) {
                for (var i = 0; i < list.length; i++) {
                    html += func(r, list[i]);
                }
            }
        }
        return html;
    });
    /**
     * 过滤html字符，因为系统默认已过滤html，所以此函数一般外部不使用
     *
     * 示例：
     *
     *     {code|filter_html}
     *
     * @method filter_html
     * @param html {string} 待过滤的html代码
     * @returns {string}
     */
    r.addFunc('filter_html', function (html) {
        return r.util.html(html);
    });
    /**
     * 从左侧按指定长度截断字串，注意一个汉字按2个字符计算，这样可以准确的控制格式
     *
     * 示例：
     *
     *     {str|left,20,'...'}
     *     {str|left,20}
     *
     * @method left
     * @param str {string} 要截断的字串变量名
     * @param len {number} 截断后的字串长度，一个汉字按2个字符计算
     * @param dot {string} [可选] 截断后补充的串，示例:"..."
     * @returns {string}
     */
    r.addFunc('left', function (str, len, dot) {
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var dotLen = 0;
        if (dot) {
            dotLen = dot.length;
        }
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) !== null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength + dotLen > len) {
                if (dotLen > 0) {
                    newStr += dot;
                }
                break;
            }
            newStr += singleChar;
        }
        return newStr;
    });
})(window.jsRender);;/**
 * JsTemplate，简单快速的将json数据绑定到html上
 * @class JsTemplate
 */
(function (d, w, x, r) {
    'use strict';
    //是否已初始化
    x.isInit = false;
    //是否使用其它的ajax方法，默认使用jquery
    x.optAjax = false;
    x.hideRepeat = false;
    x.hideBind = false;
    //准备方法，JsTemplate的入口方法，JsTemplate准备好后将执行这个方法，以便自动执行一些绑定函数等。
    x.ready = function (callback) {
        if (!x.isInit) {
            if (typeof callback === 'function') {
                x.callback = callback;
            }
        } else {
            if (typeof callback === 'function') {
                x.callback = callback;
                x.callback();
            }
        }
    };
    /**
     * 初始化
     */
    x.init = function () {

        if (!x.isInit) {
            x.isInit = true;
            r.init();
            if (x.callback) {
                x.callback();
            }
        }
    };
    /**
     * 取url的参数，并可以指定默认值
     *
     * 示例：
     *
     * 1. query('id')，取url参数中的id的值
     * 2. query('id',10)，取url参数中的id的值，如果id为空值，就返回默认值10
     *
     * @method query
     * @param key {string} 参数名
     * @param defaultValue [可选] 默认值
     */
    x.query = function (key, defaultValue) {
        if (!w.query_args) {
            w.query_args = r.util.getUrlQuery();
        }
        var tmp = w.query_args[key];
        if (typeof tmp == 'undefined' || tmp === '') {
            return defaultValue;
        }
        return tmp;
    };

    /**
     * 将Render.util工具函数集合引入JsTemplate，方便后续使用。具体内容见{{#crossLink "Render.util"}}{{/crossLink}}。
     * @property util
     * @type {Object}
     */
    x.util = r.util;
    /**
     * 使用ajax加载数据，可选的绑定到页面。
     * 支持2类数据，Object和Array。
     *
     * Object为简单绑定，页面中在需要绑定数据的地方用data-bind指定属性名。
     * 当绑定id为空串时，在绑定时直接使用属性名，例：{key:'key1'}，绑定时只需key即可。
     *
     * 示例：
     *
     *     <p data-bind='key'></p>
     *
     * 当指定绑定id时，在绑定时需要在属性名前加上指定的名称，例：{key:'key1'}，名称为data1,绑定时需data1.key
     *
     * 示例：
     *
     *     <p data-bind='data1.key'></p>
     *
     *
     * Array为循环绑定，常用于输出列表，页面中用data-repeat-name指定绑定名。
     * 在使用data-repeat-name后，该节点内部的html内容将成为模板，循环绑定后显示。
     *
     * 示例：
     *
     *     <ul data-repeat-name='data'>
     *         <li>{key}</li>
     *     </ul>
     *
     * 如果Array的内容为[{key:'key1'},{key:'key2'},{key:'key3'}]，输出内容为
     *
     *     <ul data-repeat-name='data'>
     *         <li>key1</li>
     *         <li>key2</li>
     *         <li>key3</li>
     *     </ul>
     *
     * @method load
     * @param  id {string} 绑定id，在html页面中指定
     * @param  postUrl {string} url地址，该地址返回一段json数据
     * @param param 请求的参数，可为空。如果为空是自动使用当前页面地址的query参数
     *
     * 示例：如果当前页面的地址为show.html?id=132，param为''时，系统会将param修改为{id:132}，内容与当前页的参数一致。
     *
     * @param dataFilter {Function} 数据过滤方法，如果请求的数据正常，就返回可以绑定的数据；如果返回false，将不执行绑定。
     *
     * 示例：其中e为从postUrl中取得的json数据
     *
     *     function(e){
     *        if(e.error==0){
     *            return e.data;
     *        }else{
     *            return false;
     *        }
     *     }
     *
     * @param callback {Function} [可选] 请求成功的回调方法
     *
     * 示例：其中e为从postUrl中取得的json数据
     *
     *      function(e){
     *          alert('ok');
     *      }
     *
     * @param errorback {Function} [可选] 请求失败的回调方法
     *
     * 示例：
     *
     *     function(){
     *          alert('error');
     *     }
     *
     */
    x.load = function (id, postUrl, param, dataFilter, callback, errorback) {
        var opt = {};
        opt.url = postUrl;
        if (param === '' || typeof param == 'undefined') {
            param = r.util.getUrlQuery();
        }
        opt.data = param;
        opt.type = 'POST';
        if (errorback) {
            opt.error = errorback;
        } else if (typeof x.error_callback === 'function') {
            opt.error = x.error_callback;
        } else {
            opt.error = function (data, status) {
                console.log(data, status);
            };
        }
        opt.success = function (data) {
            if (typeof data === 'string') {
                data = r.util.eval('(' + data + ')');
            }
            var ok = !!data;
            if (typeof x.checkData === 'function') {
                if (!x.checkData(data)) {
                    ok = false;
                }
            }
            if (ok && dataFilter) {
                data = dataFilter(data);
                if (!data) {
                    ok = false;
                }
            }
            if (ok) {
                if (r.util.isArray(data)) {
                    r.bindRepeatData(id, data);
                } else {
                    if (id) {
                        r.bindData(id, data);
                    } else {
                        r.bindData(data);
                    }
                }
            }
            if (callback) {
                callback(ok, data);
            }
        };
        if (x.isInit) {
            if (x.optAjax) {
                x.optAjax.ajax(opt);
            } else {
                $.ajax(opt);
            }
        }
    };
    /**
     * 设置ajax类，默认为jQuery
     * @method setAjax
     * @param ajax ajax工具类
     */
    x.setAjax = function (ajax) {
        this.optAjax = ajax;
    };
    var testReady = function () {
        if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
            x.init();
            return true;
        }
        return false;
    };
    var timeReady = function () {
        if (!testReady()) {
            setTimeout(timeReady, 5);
        }
    };
    //开始初始化将执行ready方法
    if (!testReady()) {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', function () {
                testReady();
            }, false);
        } else {
            setTimeout(timeReady, 5);
        }
    }
})(document, window, window.jsTemplate = {}, window.jsRender);