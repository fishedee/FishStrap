define('gri/griTable',['lib/gloabl','../../css/gri/bootstrap.css','../../css/gri/style.css','../../css/gri/module.css','../../css/gri/reset.css','../../css/gri/form.css'],function(require, exports, module){
var $ = require('lib/global');
var self = {};
// Copyright 2012 Tencent Inc. All Rights Reserved.

/**
 * @列表控件(datatable, dt, grid)
 * @fileoverview 原生javascript,不依赖任何js库
 * @author xiangchen(陈翔)
 * @version v1.0
 */

;
(function (global, document, undefined) {

    /**
     * Datatable类(列表类).
     * @constructor
     */
    var DataTable = function () {
        //版本号
        this.version = 'v1.0';

        //列数
        this.columnCount = 0;

        //是否第一次加载
        this.isFirstLoad = true;

        //最后的参数结果
        this.finalOptions = null;
    };

    /**
     * 扩展一些dt的方法.
     */

    DataTable.fn = DataTable.prototype = {

        constructor:DataTable,

        /**
         * 初始化参数和创建DataTable
         * @param {object} params 赋值到控件的属性列表.
         */
        initDataTable:function (params) {

            //配置
            var options = {

                //年份前缀
                yearPrefix:'_t',

                //环比的前缀
                chainPrefix:'_h',

                //阀值控制
                isThresh:false,
                

                //排序方式
                order:'asc',

                thorder:{}
            };
            var resultObj = {};

            //参数的内容传递给options和dt对象
            for (var name in params) {
                options[name] = params[name];
                this[name] = params[name];
            }

            //对allFields的处理
            if (!options.hasOwnProperty('allFields')) {
                options.allFields = {};
                if (options.checkAll) {
                    options.allFields['gri_checkAll'] = {};
                }
                if (options.data.length > 0) {
                    for (var field in options.data[0]) {
                        options.allFields[field] = {};
                    }
                }
            }
            else {
                var fields = {};
                if (options.checkAll) {
                    fields['gri_checkAll'] = {};

                    for (var name in options.allFields) {
                        fields[name] = options.allFields[name];
                    }

                    options.allFields = fields;
                }
            }

            //自动补齐互斥属性
            if (options.noPage) {
                options.page = false;
            }
            
            if (this["summary"] == undefined){
            	this["summary"] = [];
            }  


            //选项复制给dt对象
            this.options = options;

            //根据选项创建dt
            this.createTable(options);

            //当前dt的引用赋给_this
            var _this = this;

            return this;
        },


        refresh: function(){
            this.createJsonTable(this);
        },

        /**
         * 创建列表
         * @param {object} options 配置信息.
         */
        createTable:function (options) {

            //创建初始的局部变量
            var tableBody = '', THFields = options.THFields, allFields = options.allFields;

            //获取table元素
            var _table = document.getElementById(options.tableId);

            var ifDivNode = (_table.nodeName == 'DIV');

            var container = ifDivNode ? document.getElementById(options.tableId) : _table.parentNode;

            for (var key in allFields) {
            	if(allFields[key].needOrder==undefined) 
            		allFields[key].needOrder = false;
            }

            //如果没有设置Html详情，则自动创建
            if (ifDivNode) {
                container.innerHTML = '';

                //自定义css样式名
                if (options.cssSetting && options.cssSetting.containerClass != undefined) {
                    _table.className = options.cssSetting.containerClass;
                }
                else {
                    _table.className = 'gri_wrapper';
                }

                var _realTable = document.createElement("TABLE");
                if (options.cssSetting && options.cssSetting.tableClass != undefined) {
                    _realTable.className += options.cssSetting.tableClass;
                }
                else {
                    _realTable.className += 'gri_stable';
                }

                var count = 0;

                var orderField = options.noPage ? options.noPage.orderField : options.page.orderField;
                var orderType = options.noPage ? options.noPage.orderType : options.page.orderType;

                var ifClicked = false;

                if (document.all) {
					
                    var _colgroup = document.createElement('COLGROUP');
                    var _thead = document.createElement('THEAD');
                    var _tr = document.createElement('TR');
                    var _tbody = document.createElement('TBODY');

                    for (var key in allFields) {

                        var _col = document.createElement("COL");
                        _col.className += ('gri_' + key);
                        if (allFields[key].width && parseInt(allFields[key].width) > 0) {
                            _col.style.width = allFields[key].width;
                        }
                        _colgroup.appendChild(_col);

                        var _th = document.createElement("TH");
                        var _span = document.createElement("span");
                        if (key != 'gri_checkAll') {
                        	_span.className = "label";
                        	
                            if (allFields[key].thText) {
                            	_span.innerHTML = allFields[key].thText;
                                //_th.innerHTML += ('<span class="label">' + allFields[key].thText + '</span>');
                            } else {
                            	_span.innerHTML = key;
                                //_th.innerHTML += ('<span class="label">' + key + '</span>');
                            }
                        }
                        else {
                            var cbox = document.createElement("input");
                            cbox.type = 'checkbox';
                            cbox.className = 'gri_checkAll';
                            _th.appendChild(cbox);
                        }

                        if (options.thAlign) {
                            _th.style.textAlign = options.thAlign;
                        }

                        var _iOrder = document.createElement("I");

                        if (options.thorder[count] != undefined) {
                            if (options.thorder[count] == 'desc') {
                                if (options.page.ifRealPage) {
                                    _iOrder.className = 'icon-orderd';
                                }
                                else {
                                    _iOrder.className = 'icon-orderu';
                                }
                            }
                            else {
                                if (options.page.ifRealPage) {
                                    _iOrder.className = 'icon-orderu';
                                }
                                else {
                                    _iOrder.className = 'icon-orderd';
                                }
                            }
                        } else {
                            if (key == orderField && this.isFirstLoad) {
                                if (orderType == 'asc') {
                                    _iOrder.className = 'icon-orderu';
                                }
                                else {
                                    _iOrder.className = 'icon-orderd';

                                }
                            }
                            else {
                                if (allFields[key].needOrder != false && options.enableThClick != false && key != 'gri_checkAll') {
                                    _iOrder.className = "icon-order-hover";
                                }
                            }
                        }

                        if (allFields[key].needOrder != false) {
                            if (options.enableThClick != false && key != 'gri_checkAll') {
                                this.addClassName(_th, 'hover enable');
                                _span.appendChild(_iOrder);
                            }
                        }

                        if (allFields[key].clicked && ifClicked == false) {
                            this.addClassName(_th, 'visited');
                            ifClicked == true;
                        }

                        _th.appendChild(_span);

                        _tr.appendChild(_th);
                        count++;
                    }

                    _thead.appendChild(_tr);

                    _colgroup.setAttribute("SPAN", count);
                    _realTable.appendChild(_colgroup);
                    _realTable.appendChild(_thead);
                    _realTable.appendChild(_tbody);

                    _table = _realTable;

                } else {
                    var colStr = '', thStr = '';

                    for (var key in allFields) {
                        colStr += '<col';
                        if (allFields[key].width && parseInt(allFields[key].width) > 0) {
                            colStr += (" style='width:" + allFields[key].width + "'");
                        }
                        colStr += ' class="gri_';
                        colStr += key;
                        colStr += '">';

                        if (key != 'gri_checkAll') {
                            var thClassName = '', visitClass = ' visited';
                            if (allFields[key].needOrder != false) {
                                if (options.enableThClick != false) {
                                    thClassName = 'hover enable';
                                }
                            }
                            else {
                                visitClass = 'visited';
                            }

                            if (allFields[key].clicked && ifClicked == false) {
                                thClassName += visitClass;
                                ifClicked = true;
                            }

                            if (allFields[key].thText) {
                                thStr += '<th';
                                if (options.thAlign) {
                                    thStr += " style='text-align:" + options.thAlign + "'";
                                }
                                thStr += ' class="' + thClassName + '"><span class="label">' + allFields[key].thText;
                            } else {
                                thStr += '<th';
                                thStr += ' class="' + thClassName + '"><span class="label">' + key;
                            }

                            if (options.thorder[count] != undefined) {
                                if (options.thorder[count] == 'desc') {
                                    if (options.page && options.page.ifRealPage) {
                                        thStr += "<i class='icon-orderd'></i>";
                                    }
                                    else {
                                        thStr += "<i class='icon-orderu'></i>";
                                    }
                                }
                                else {
                                    if (options.page && options.page.ifRealPage) {
                                        thStr += "<i class='icon-orderu'></i>";
                                    }
                                    else {
                                        thStr += "<i class='icon-orderd'></i>";
                                    }
                                }
                            }
                            else {

                                if (key == orderField && this.isFirstLoad) {
                                    if (orderType == 'asc') {
                                        thStr += "<i class='icon-orderu'></i>";
                                    }
                                    else {
                                        thStr += "<i class='icon-orderd'></i>";
                                    }
                                }
                                else {
                                    if (allFields[key].needOrder != false && options.enableThClick != false) {
                                        thStr += "<i class='icon-order-hover'></i>";
                                    }
                                }
                            }

                            thStr += '</span></th>';
                        }
                        else {
                            thStr += '<th><input type="checkbox" class ="gri_checkAll" /> </th>';
                        }
                        count++;
                    }

                    var str = '<colgroup span="';
                    str += count;
                    str += '">';
                    str += colStr;
                    str += '</colgroup><thead><tr>';
                    str += thStr;
                    str += '</tr></thead><tbody></tbody>';

                    _realTable.innerHTML = str;

                    _table.innerHTML = _realTable.outerHTML;

                    _table = _realTable;
                }

                this.columnCount = count;

            }
            else {
                var _table = document.getElementById(options.tableId);
                var _colgroup = _table.getElementsByTagName('colgroup')[0];
                if (_colgroup) {
                    this.columnCount = _colgroup.getAttribute('span');
                }
            }



            //删除已经存在的page控件
            if (!this.page || !this.page.container) {
                var pgs = container.getElementsByTagName('DIV');

                if (pgs.length > 0) {
                    pgs[0].parentNode.removeChild(pgs[0]);
                }
            }


            //如果需要分页
            if (this.page) {

                //初始化page对象
                if (typeof this.page != 'object')
                    this.page = {};

                //page的页行数默认为10
                this.page.size = this.page.size || 10;

                //数据总行数
                var rowCount = this.page.ifRealPage ? this.page.rowCount : options.data.length;
                this.rowCount = rowCount;

                //如果page的页行数比 data的对象少，开始分页
                if (parseInt(this.page.size) < parseInt(rowCount)) {

                    //page的页数初始化为data的"对象数/每页行数"
                    this.page.count = Math.ceil(rowCount / this.page.size);
                } else {
                    //直接赋值给data
                    this.page.data = options.data.slice(0, this.page.size);
                    this.page.count = 1;
                }

                //page的索引初始化为0
                this.page.index = this.page.index || 0;

                //page的偏移量初始化为5
                this.page.offset = this.page.offset || 5;

                //创建分页控件
                var pages = this.createPage();

                //如果创建成功则加入到datatable
                //typeof pages == 'object' && _table.parentNode.appendChild(pages);
                typeof pages == 'object' && container.appendChild(pages);

                //取出index那一页的值
                if (this.page.ifRealPage) {
                    this.page.data = options.data.slice(0, this.page.size);
                } else {
                    this.page.data = options.data.slice(this.page.index * this.page.size, (this.page.index + 1) * this.page.size);
                }


            } else {

                //直接赋值给data
                this.page = {};
                this.page.data = options.data;
            }


            /*
             * 如果没有数据进行的初始化工作
             */
            if (this.page.data.length == 0) {
                //遍历所有属性
                for (var name in allFields) {
                    if (!allFields[name].value) {
                        allFields[name].value = name;
                    }
                }
            }
            
            //将统计行合并
            for (var i =0; i < this.summary.length ; i++) {      
                this.page.data.push(this.summary[i]);
            }


            //遍历index页的值进行处理
            for (var i = 0; i < this.page.data.length; i++) {

                //取得行
                var row = this.page.data[i];
                var tr = '';

                //遍历所有属性
                for (var name in allFields) {

                    //初始化formater和行对应的对象
                    var formater = this.Formater.colClassFormater, _field = allFields[name];

                    if (!_field.value) {
                        _field.value = name;
                    }

                    //取得行对应列的值
                    var fieldData = row[_field.value];

                    if (_field.value == 'gri_checkAll') {
                        fieldData = "<input type='checkbox' class='gri_td_checkbox' value='" + row[options.keyIndex] + "' />";
                    }

                    if(_field.value == '_oper'){
                        fieldData = "<a href='#' class='_edit'>编辑</a>";
                    }

                    //过滤null和undefined等特殊字符
                    if (fieldData == null || fieldData == undefined || fieldData == 'null' || fieldData == 'undefined') {
                        fieldData = '';
                    }

                    //截取字符串
                    if (_field.length && parseInt(_field.length) > 0) {
                        var oriFieldData = fieldData;
                        fieldData = this.setString(fieldData, _field.length);
                    }

                    //内容格式化
                    if (typeof(_field.format) == 'function') {
                        fieldData = _field.format(fieldData, oriFieldData);
                    }

                    //如果是数字类型，通过precision和token进行格式化 , 并且右对齐
                    if (_field.number) {
                        fieldData = this.numberFormat(fieldData, _field.precision, _field.token);
                    }

                    //如果是时间类型，根据指定的格式进行格式化
                    else if (_field.date) {
                        fieldData = this.dateFormat(fieldData, _field.formater);
                    }

                    //如果是字符串，进行字符串格式化
                    else if (_field.str) {
                        fieldData = this.strFormat(fieldData, _field.reg);
                    }

                    //通过div方式控制列的文本位置
                    if (_field.colAlign) {
                        fieldData = "<div style='width: 100%; height: 100%;text-align:" + _field.colAlign + ";'>" + fieldData + "</div>";
                    }
                    

                    //对阀值的列进行处理
                    if (THFields && (name in THFields)) {

                        //年份处理
                        var year = row[_field.value + options.yearPrefix];

                        //环比的处理
                        var chain = row[_field.value + options.chainPrefix]

                        //转换成浮点型
                        year = parseFloat(year);
                        chain = parseFloat(chain);

                        //转换year和chain
                        year = this.threshFormat(year, row[_field.value], options.threshOldType, false, options.isThresh);
                        chain = this.threshFormat(chain, row[_field.value], options.threshOldType, true, options.isThresh);
                        tr += this.colFormat({
                            data:fieldData,
                            year:year,
                            chain:chain
                        });
                    }
                    //如果没有配置阀值列
                    else {

                        //列的值转换成对象
                        var _data = {};

                        //如果_field的值需要截断
                        if (_field.truncate) {

                            //截断处理
                            var truncatedField = this.truncate({
                                value:fieldData,
                                truncate:_field.truncate
                            });
                            if (truncatedField.truncated) {
                                formater = this.Formater.colTruncateFormater;
                            }
                            _data.title = row[_field.value];
                            _data.data = truncatedField.value;
                        }
                        else {
                            _data.rel  = _field.value;
                            _data.data = fieldData;
                        }
                        tr += this.colFormat(_data, formater);
                    }
                }

                //根据排序方式增加到相应位置
                tr = this.rowFormat({
                    row:tr
                });

                if (options.order == 'asc') {
                    tableBody += tr;
                } else {
                    tableBody = tr + tableBody;
                }
            }
			



            //兼容各浏览器的增加到页面方式
            var _tbody = _table.getElementsByTagName('TBODY')[0];


            if (document.all) {

                //IE7方式，因为innerHTML只读
                _table.removeChild(_tbody);

                var tbody = document.createElement('TBODY');

                if (options.data.length == 0) {

                    var _p = document.createElement("p");
                    _p.style.lineHeight = "50px";
                    _p.style.textAlign = "center";
                    _p.innerHTML = '没有相应的数据';

                    var _td = document.createElement("td");
                    _td.colSpan = this.columnCount;
                    _td.appendChild(_p);

                    var _tr = document.createElement("tr");
                    _tr.className = 'gri_listtd';
                    _tr.appendChild(_td);

                    tbody.appendChild(_tr);

                } else {

                    var trs = [];
		
                    while (tableBody.length > 0) {
                        var trRow = tableBody.substring(4, tableBody.indexOf("</tr>"));
                        tableBody = tableBody.replace("<tr>" + trRow + "</tr>", "");
                        trs.push(trRow);
                    }

                    for (var i = 0; i < trs.length; i++) {

                        var trNode = document.createElement('TR');

                        //隔行换色
                        if (i % 2 == 1) {
                            trNode.className = 'gri_listtd';
                        }
						
						//Fish 修复Td无限循环的问题
                        var trRow = trs[i];
						var newTrRow = "";
						var regEx = /(<td[^>]*>)([^<]*)(<\/td>)/g;
						while((r = regEx.exec(trRow) ) != null ){
							newTrRow += r[1]+decodeURIComponent(r[2])+r[3];
						}
						$(trNode).html(newTrRow);
						/*
                        while (trRow.length > 0) {
							var temp = trRow.className;
							trRow.className = "";
                            var tdHTML = trRow.substring(4, trRow.indexOf("</td>"));
                            trRow = trRow.replace("<td>" + tdHTML + "</td>", "");

                            var tdNode = document.createElement('TD');
                            tdNode.innerHTML = decodeURIComponent(tdHTML);
							tdNode.className = temp;
                            trNode.appendChild(tdNode);
                        }
						*/

                        tbody.appendChild(trNode);
                    }

                }

                _table.appendChild(tbody);

                if (ifDivNode) {
                    var _childTable = container.getElementsByTagName('TABLE')[0];
                    if (_childTable) {
                        container.removeChild(_childTable);
                    }

                    var tmpNode = pgs ? pgs[0] : this.page.container;
                    if (tmpNode) {
                        container.insertBefore(_table, tmpNode);
                    }
                    else {
                        container.appendChild(_table);
                    }
                }

            } else {
                if (options.data.length > 0) {
                    _tbody.innerHTML = tableBody;
                }
                else {
                    _tbody.innerHTML = '<tr><td colspan="' + this.columnCount + '"><p style="line-height: 50px; text-align: center; ">没有相应的数据</p></td></tr>';
                }

                if (ifDivNode) {
                    container.getElementsByTagName("TABLE")[0].innerHTML = _tbody.parentNode.outerHTML;
                }

                //隔行换色
                var _trs = container.getElementsByTagName("TABLE")[0].getElementsByTagName('tr');
                for (var i = 0; i < _trs.length; i++) {
                    if (i % 2 == 1) {
                        _trs[i].className == 'gri_listtd';
                    }
                }
            }
			


            //获取当前的table
            var realTable = container.getElementsByTagName("TABLE")[0];

            //点击行变色
            var _tableTrs = realTable.getElementsByTagName('TR');

            var _this = this;

            for (var i = 0; i < _tableTrs.length; i++) {
                var _tr = _tableTrs[i];
                _tr.onclick = function () {
                    if (this.className == 'gri_tr_clicked') {
                        _this.removeClassName(this, 'gri_tr_clicked');
                    }
                    else {
                        _this.removeClassName(this, 'gri_tr_clicked');
                        _this.addClassName(this, 'gri_tr_clicked');
                    }
                }
            }

            //如果有多表头，替换相应内容
            if (_realTable) {
                if (this.options.complexHeader) {
                    this.createComplexHeader(this.options.complexHeader, realTable, this);
                }
            }

            if (options.data.length > 0) {
                //表格自动控制列宽
                if (options.layout) {
                    if (realTable != undefined) {
                        container.getElementsByTagName("TABLE")[0].style.tableLayout = options.layout;
                    }
                }
            }

            //单元格合并
            if (undefined != options.spanColIndex) {
                this.tableRowsSpan(realTable, options.spanColIndex);
            }

            //当前dt的引用赋给_this
            var _this = this;

            //初始化表头
            this.initTh(_this, realTable);

            //绑定行数变化事件
            if (_this.options.page) {
                var sltRowNum = _this.getElementsByClassName(null, realTable.parentNode, 'select', 'gri_datatable_rownum');

                if (sltRowNum && sltRowNum.length > 0) {
                    sltRowNum[0].value = _this.page.size;
                    sltRowNum[0].onchange = function () {
                        _this.options.page.index = 0;
                        _this.options.page.size = sltRowNum[0].value;
                        if (_this.options.page.ifRealPage) {
                            _this.createJsonTable(_this);
                        }
                        else {
                            _this.initDataTable(_this.options);
                        }
                    }
                }
            }

            //生成的checkbox绑定点击事件
            if (options.checkAll) {
                var gri_checkall_box = _this.getElementsByClassName(null, realTable.parentNode, 'input', 'gri_checkAll');

                if (gri_checkall_box && gri_checkall_box.length > 0) {
                    gri_checkall_box[0].onclick = function () {

                        var el = _this.getElementsByClassName(null, realTable.parentNode, 'input', 'gri_td_checkbox');

                        var len = el.length;
                        for (var i = 0; i < len; i++) {
                            if ((el[i].type == "checkbox")) {
                                if (el[i].getAttribute("disabled") != 'disabled' && el[i].getAttribute("disabled") != true) {
                                    el[i].checked = gri_checkall_box[0].checked;
                                }
                            }
                        }
                    }
                }
            }

            //第一次加载的初始化
            if (_this.isFirstLoad) {

                //插入
                if (_this.options.autotips) {
                    var autoTipsDiv = document.createElement("div");
                    autoTipsDiv.className = "gri_autotipsdiv";

                    document.body.appendChild(autoTipsDiv);

                }
            }

            //标识第一次加载
            if (_this.isFirstLoad) {
                _this.isFirstLoad = false;
                this.finalOptions = _this.options;
            }


            //表格初始化完成的回调函数
            if (options.callback) {
                if (options.callbackParam) {
                    options.callback(options.callbackParam.value);
                }
                else {
                    options.callback(_this.resultObj);
                }
            }
        },

        /**
         * 创建分页控件
         * @return {object} isExistContainer || this.page.container.
         */
        createPage:function () {

            //当page的索引比page的页数小的时候
            if (this.page.index < this.page.count) {

                //是否存在page的container属性
                //var isExistContainer = this.page.container ? true : false;

                //如果不存在container属性则创建container属性
                this.page.container = this.page.container || document.createElement('DIV');

                //container的默认内容为''
                this.page.container.innerHTML = '';

                //container的样式名初始化为pg
                this.page.container.className = this.page.containerClass || 'page cf';

                //page的当前，下一页，上一页和分割的样式
                this.page.currentClass = this.page.currentClass || 'current';
                this.page.nextClass = this.page.nextClass || 'next';
                this.page.prevClass = this.page.prevClass || 'prev';
                this.page.dotClass = this.page.dotClass || 'dot';

                //当前对象的引用传递给_this
                var _this = this;

                if (this.page) {

                    var page_right_div = document.createElement('div');
                    page_right_div.className = 'pg';
                    this.page.container.appendChild(page_right_div);

                    //创建"当前页"
                    var aHead = document.createElement('A');
                    aHead.className = 'first';
                    aHead.innerHTML = "<i class='i_pg_f'></i>";

                    //绑定"当前页"的点击事件
                    _this.addEvent(aHead, 'click', function () {

                        _this.page.index = 0;

                        if (_this.page.ifRealPage) {
                            //ajax拉数据
                            _this.createJsonTable(_this);
                        } else {
                            _this.createTable(_this.options);
                        }
                    });

                    aHead.setAttribute('href', 'javascript:void(0);');
                    page_right_div.appendChild(aHead);
                }

                //如果page的页数大于page的偏移
                if (this.page.count > this.page.offset) {

                    //创建“上一页”
                    var a = document.createElement('A');
                    a.className = this.page.prevClass;
                    a.innerHTML = '<i class="i_pg_l"></i>';

                    //“上一页”的点击事件
                    this.addEvent(a, 'click', function () {

                        //索引减一
                        _this.page.index = _this.page.index - 1;
                        if (_this.page.index < 0) {
                            return;
                        }

                        if (_this.page.ifRealPage) {
                            _this.createJsonTable(_this);
                        } else {
                            //重建dt
                            _this.createTable(_this.options);
                        }
                    });

                    //设置href属性
                    a.setAttribute('href', 'javascript:void(0);');

                    //把“上一页”加入到container中
                    page_right_div.appendChild(a);
                }

                //返回最接近 "偏移量/2" 的整数
                var middle = Math.floor(this.page.offset / 2);

                //起始位置为page的索引减去middle
                var start = this.page.index - middle;

                //start赋值，如果小于0，返回0; 如果start和偏移量的和 大于page的页数，则返回page的页数-偏移量 ， 否则返回start
                start = start < 0 ? 0 : (start + this.page.offset) > this.page.count ? (this.page.count - this.page.offset) : start;

                //长度为start+页面的偏移量
                var len = start + this.page.offset;

                //如果长度比页数大，则长度赋值为page的页数
                if (len > this.page.count)
                    len = this.page.count;

                //从start到len之间遍历
                for (var i = start; i < len; i++) {

                    if (i >= 0) {
                        //创建"当前页"
                        var a = null;
                        if (i == this.page.index) {
                            a = document.createElement('STRONG');
                            a.className = this.page.currentClass;
                        }
                        else {
                            a = document.createElement('A');
                        }

                        a.innerHTML = 1 + i;

                        //绑定"当前页"的点击事件
                        (function (i) {
                            var _index = i;

                            _this.addEvent(a, 'click', function () {

                                _this.page.index = _index;

                                if (_this.page.ifRealPage) {
                                    //ajax拉数据
                                    _this.createJsonTable(_this);
                                } else {
                                    _this.createTable(_this.options);
                                }
                            });
                        })(i);

                        a.setAttribute('href', 'javascript:void(0);');
                        page_right_div.appendChild(a);
                    }
                }

                //如果page的页数比len大
                if (this.page.count > len) {

                    //如果page的页数比(len+1)大
                    if (this.page.count > len + 1) {

                        //创建"..."
                        var strong = document.createElement('span');
                        strong.className = this.page.dotClass;
                        strong.innerHTML = '...';
                        page_right_div.appendChild(strong);
                    }

                    //创建"最后页"
                    var a = document.createElement('A');
                    a.innerHTML = this.page.count;
                    this.addEvent(a, 'click', function () {
                        _this.page.index = _this.page.count - 1;
                        if (_this.page.ifRealPage) {
                            _this.createJsonTable(_this);
                        } else {
                            _this.createTable(_this.options);
                        }
                    });
                    a.setAttribute('href', 'javascript:void(0);');
                    page_right_div.appendChild(a);
                }

                //如果page的页数大于page的偏移量
                if (this.page.count > this.page.offset) {

                    //创建“下一页”
                    var a = document.createElement('A');
                    a.className = this.page.nextClass;
                    a.innerHTML = '<i class="i_pg_n"></i>';
                    this.addEvent(a, 'click', function () {
                        var tempIndex = _this.page.index + 1;
                        if (tempIndex == _this.page.count) {
                            return;
                        }

                        _this.page.index = _this.page.index + 1;
                        if (_this.page.index > (_this.page.count - 1)) {
                            return;
                        }
                        if (_this.page.ifRealPage) {
                            //ajax拉数据
                            _this.createJsonTable(_this);
                        } else {
                            _this.createTable(_this.options);
                        }
                    });
                    a.setAttribute('href', 'javascript:void(0);');
                    page_right_div.appendChild(a);
                }

                //创建"末页"
                var aFoot = document.createElement('A');
                aFoot.innerHTML = "<i class='i_pg_e'></i>";

                this.addEvent(aFoot, 'click', function () {
                    _this.page.index = _this.page.count - 1;
                    if (_this.page.ifRealPage) {
                        _this.createJsonTable(_this);
                    } else {
                        _this.createTable(_this.options);
                    }
                });
                aFoot.setAttribute('href', 'javascript:void(0);');
                page_right_div.appendChild(aFoot);

                //创建总行数
                var spanTotal = document.createElement("div");
                spanTotal.className = 'show';

                var countColor = 'red';
                if (this.page.countColor) {
                    countColor = this.page.countColor;
                }

                spanTotal.innerHTML = ("共<em>" + this.rowCount + "</em>条记录，每页显示");


                //创建每页N行
                var sltRowNumSpan = document.createElement("span");
                sltRowNumSpan.className = 'gri_datatable_pg_rowcount';
                sltRowNumSpan.innerHTML = "<select class='gri_datatable_rownum ipt_show '>" +
                    "<option value='5'>5</option><option value='10'>10</option><option value='15'>15</option><option value='20'>20</option><option value='30'>30</option><option value='50'>50</option><option value='80'>80</option><option value='100'>100</option><option value='200'>200</option>" +
                    "</select> 条";

                spanTotal.appendChild(sltRowNumSpan);

                this.page.container.appendChild(spanTotal);

                //如果表格的所有内容的行数小于分页数，则不显示分页信息
                if (this.page.autoHide && parseInt(this.page.rowCount) <= parseInt(this.page.size)) {
                    this.page.container.style.display = 'none';
                }

                //返回值
                return  this.page.container;
            }
        },

        /**
         * 获得元素的绝对位
         * @param {object} e HTMLDOM元素.
         */
        getElementAbsPos:function (e) {
            var t = e.offsetTop;
            var l = e.offsetLeft;
            while (e = e.offsetParent) {
                t += e.offsetTop;
                l += e.offsetLeft;
            }
            return {left:l, top:t};
        },

        /**
         * 根据ajax的结果创建Table
         * @param {object} _this DataTable的对象.
         */
        createJsonTable:function (_this) {

            //加载Loading图片
            var _table = document.getElementById(_this.options.tableId);
            var positon = _this.getElementAbsPos(_table);
            var loadingDiv = document.createElement('div');
            loadingDiv.className = 'gri_datatable_loading';
            loadingDiv.innerHTML = "<img src='../../assets/css/images/loading.gif' alt='加载中...' />";

            //document.getElementsByTagName('body')[0].appendChild(loadingDiv);
            loadingDiv.style.position = "absolute";
            loadingDiv.style.left = positon.left + (_table.clientWidth / 2) + "px";
            loadingDiv.style.top = positon.top + 120 + "px";
            loadingDiv.style.zIndex = '1000';
			var _pageFrom = _this.page.index * _this.page.size;
            var paramStr = 'pageIndex=' + _pageFrom + "&pageSize=" + _this.page.size + "&orderField=" + _this.page.orderField + "&orderType=" + _this.page.orderType + "&t=" + Math.random();
            var sendUrl = _this.page.url;

            if (_this.page.url.indexOf('?') > 0) {
                sendUrl = sendUrl + '&' + paramStr;
            } else {
                sendUrl = sendUrl + '?' + paramStr;
            }

            _this.ajaxGet(sendUrl, function (result, _this) {

                var resultObj = eval("(" + result + ")");
                _this.resultObj = resultObj.data[_this.name];

                //更新data和回调函数的参数值
                if (resultObj.data) {
                    _this.options.data = resultObj.data[_this.name];
                    if (_this.options.callbackParam) {
                        _this.options.callbackParam.value = resultObj[_this.options.callbackParam.key];
                    }
                } else {
                    _this.options.data = resultObj;
                    if (_this.options.callbackParam) {
                        _this.options.callbackParam.value = resultObj[_this.options.callbackParam.key];
                    }
                }


                loadingDiv.parentNode.removeChild(loadingDiv);
                _this.initDataTable(_this.options);
            }, _this);

        },

        /**
         * 找到元素在数组中的的index
         * @param {object} current 需要查找的对象.
         * @param {object} obj 需要查找对象所在的数组.
         * @param {object}  返回查找的结果.
         */
        index:function (current, obj) {
            for (var i = 0, length = obj.length; i < length; i++) {
                if (obj[i] == current) {
                    return i;
                }
            }
        },

        /**
         * 给元素绑定事件
         * @param {object} obj 需要绑定的对象.
         * @param {string} eventName 需要绑定的事件名.
         * @param {function} func 需要绑定的函数.
         */
        addEvent:function (obj, eventName, func) {
            eventName = eventName.replace('on', '');
            if (document.addEventListener) {
                obj.addEventListener(eventName, func, false);
            } else if (document.attachEvent) {
                obj.attachEvent('on' + eventName, func);
            } else {
                obj['on' + eventName] = func;
            }
        },

        /**
         * ajax通过get方式获取服务器数据
         * @param {string} url 服务器地址.
         * @param {function} func 获取数据的回调函数.
         * @param {object} object 需要传入引用的对象.
         */
        ajaxGet:function (url, fn, object) {
            var xmlHttp;
            var stateEvent = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var xmlstr = xmlHttp.responseText;
                    try {
                        fn(xmlstr, object);
                    } catch (e) {

                    }
                }
                //Add by zacharycai
                if (xmlHttp.readyState == 4 && xmlHttp.status == 401) {
                    window.location.reload();
                }

            }
            var create = function (url, stateEvent) {
                try {
                    // Firefox, Opera 8.0+, Safari
                    xmlHttp = new XMLHttpRequest();
                } catch (e) {
                    // Internet Explorer
                    try {
                        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) {
                            return false;
                        }
                    }
                }
                xmlHttp.onreadystatechange = stateEvent;
                xmlHttp.open("GET", url, true);
                //Add by zacharycai
                xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xmlHttp.send(null);
            }
            create(url, stateEvent);
        },

        /**
         * 判读是否为数字
         * @param {object} num 需要判断的对象.
         * @return {boolean} true或false.
         */
        isNumber:function (num) {
            num = this.stripHTML(num);
            return /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(num);
        },

        /**
         * 判读是否为浮点型
         * @param {object} num 需要判断的对象.
         * @return {boolean} true或false.
         */
        isFloat:function (num) {
            return /^(0|[1-9][0-9]*)\.[0-9]+$/.test(num);
        },

        /**
         * 判读是否为整型
         * @param {object} num 需要判断的对象.
         * @return {boolean} true或false.
         */
        isInt:function (num) {
            return /^(0|[1-9][0-9]*)$/.test(num);
        },

        /**
         * 判读是否为整型
         * @param {string} obj 需要截断的字符串.
         * @return {string} 截断后返回的字符串.
         */
        truncate:function (obj) {
            if (!obj.truncate) {
                return {
                    value:obj.value,
                    truncated:false
                };
            }
            var len = 0, k = 0;
            for (var j = 0; j < obj.value.length; j++) {
                if (obj.value.charCodeAt(j) > 256) {
                    len += 2;
                } else {
                    len += 1;
                }
                if (len <= 12)
                    k = j;
            }

            if (len > obj.truncate) {
                return {
                    value:obj.value.substring(0, obj.truncate) + '...',
                    truncated:true
                };
            } else {
                return {
                    value:obj.value,
                    truncated:false
                };
            }
        },

        /**
         * Formater对象.
         */
        Formater:{
            colFormater:"<td>{$data}{$chain}{$year}</td>",
            colNormalFormater:"<td>{$data}</td>",
            colClassFormater:"<td class='{$rel}'>{$data}</td>",
            colTruncateFormater:"<td title='{$title}'>{$data}</td>",
            rowFormater:"<tr>{$row}</tr>",
            colRiseFormater:"<em>{$value}</em>",
            colFallFormater:"<b>{$value}</b>"
        },

        /**
         * 判读是否为整型
         * @param {date} date 需要格式化的日期.
         * @param {string} formater 格式化的参数.
         * @return {string} 格式化后的结果.
         */
        dateFormat:function (date, formater) {
            var _formaer = formater || 'h:m:s';
            var reg = /^(\d{2,4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/g;
            reg.lastIndex = 0;
            var result = reg.exec(date);
            if (result) {
                return formater.replace('y', result[1]).replace('M', result[2]).replace('d', result[3]).replace('h', result[4]).replace('m', result[5]).replace('s', result[6]);
            } else {
                return date;
            }
        },

        /**
         * 判读是否为整型
         * @param {number} num 需要格式化的数字.
         * @param {string} percision 精度.
         * @param {string} token 分隔符.
         * @return {number} 格式化后的结果.
         */
        numberFormat:function (num, percision, token) {
            num = num.toString();
            var num_str = this.stripHTML(num);
            var _token = token || ',';
            var _percision = percision || 0;
            if (this.isNumber(num_str)) {
                var num_str_tmp = parseFloat(num_str).toFixed(_percision);
                num_str_tmp = num_str_tmp + '';
                var numArr = num_str_tmp.split('.');
                var n = parseInt(numArr[0].length / 3);
                var re = '';
                var reg = '';
                for (var i = 0; i < n; i++) {
                    re = re + ',$' + (i + 1);
                    reg = reg + '(\\d{3})';
                }
                reg = new RegExp(reg + '$');

                numArr[0] = numArr[0].replace(reg, re).replace(/^,/, '');
                if (num_str != num) {
                    return num.replace(">" + num_str + "<", ">" + numArr.join('.') + "<");
                }
                return num.replace(num_str, numArr.join('.'));
            } else {
                return num;
            }
        },

        /**
         * 字符串的格式化
         * @param {string} str 需要格式化的字符串.
         * @param {string} reg 需要替换的字符.
         * @return {number} 格式化后的结果.
         */
        strFormat:function (str, reg) {
            var result = str.replace(reg, '');
            return result;

            // 		  待增加，正则表达式
            //        var result = reg.exec(str);
            //        if (result != null && result.length > 0) {
            //            return reg.exec(str)[0];
            //        }
            //        else {
            //            return str;
            //        }
        },

        /**
         * 字符串的格式化
         * @param {object} obj 需要格式化的对象.
         * @param {object} format 具体的格式化方法.
         * @return {string} 格式化后的结果.
         */
        colFormat:function (obj, format) {
            var col = format || this.Formater.colFormater;
            for (var name in obj) {
                var reg = new RegExp('\\{\\$' + name + '\\}', 'g');
                if (document.all) {
                    //解决ie下正则匹配,js因为内容有$出错的问题
                    col = col.replace(reg, encodeURIComponent(obj[name]));
                }
                else {
                    col = col.replace(reg, obj[name]);
                }
            }
            return col;
        },

        /**
         * 阀值的格式化
         * @param {string} data 需要格式化的字符串.
         * @param {string} field 需要格式化的列名.
         * @param {string} type 需要格式化的类型.
         * @param {boolean} isChain 是否需要环比.
         * @param {boolean} isThreshOld 是否旧的阀值.
         * @return {string} 格式化后的结果.
         */
        threshFormat:function (data, field, type, isChain, isThreshOld) {
            var _threshOldValue = (isThreshOld || 0) && this.threshOld[field] && this.threshOld[field][type];
            if (isThreshOld && !_threshOldValue)
                return '';
            var formater = '';
            if (data > 0 && data > _threshOldValue) {
                formater = this.Formater.colRiseFormater;
            } else if (data < 0 && data * -1 > _threshOldValue) {
                formater = this.Formater.colFallFormater;
            }

            data = data.toFixed(1) + '%';
            if (isChain) {
                data = '(' + data + ')';
            } else {
                data = '[' + data + ']';
            }
            formater = formater && formater.replace(/\{\$value\}/g, data);
            formater = formater || data;

            return formater;
        },

        /**
         * 行的格式化
         * @param {object} obj 需要格式化的行.
         * @return {object} 格式化后的结果.
         */
        rowFormat:function (obj) {

            //选择相应的格式化机器
            var row = this.Formater.rowFormater;

            for (var name in obj) {
                var reg = new RegExp('\\{\\$' + name + '\\}', 'g');
                row = row.replace(reg, obj[name]);
            }

            return row;
        },

        /**
         * 单元格的合并
         * @param {string} tableID 目标表格.
         * @param {string} ColList 需要合并的列.
         */
        tableRowsSpan:function (TableName, ColList) {
            var ColArray = ColList.split(",");//指定要合并的列（例如："0,1"，0表示第一列）
            var TableRowsCount = TableName.rows.length;//获取表格的总行数

            for (var j = ColArray.length - 1; j >= 0; j--) {//这里是倒着来的，先从后向前合并（针对列）
                var PreId = "";//前面一个位置的ID
                var CurId = "";//当前位置的ID
                var TempCount = 1;//判断前面的值和当前的值是否相同，如果相同就+1
                for (var i = 0; i <= TableRowsCount; i++) {
                    if (i != TableRowsCount) {
                        var CurId = TableName.rows[i].cells[ColArray[j]].innerHTML;//获取表格i行j列的值
                        if (CurId != "") {//防止对空ID的进行合并
                            if (CurId == PreId) {
                                TempCount += 1;//这里得出来的结果比实际少1，因为没有加第一个的ID，所以初始化TempCount=1
                            }
                            else {
                                if (TempCount > 1) {//判断当前的ID是否与前面的一个ID相同，如果不相同就需要开始合并操作
                                    this.spanRows(TableName, i, TempCount, ColArray[j]);
                                }
                                PreId = CurId;
                                TempCount = 1;//上PreId面被重新赋值，就需要初始化TempCount
                            }
                        }
                        else {
                            if (TempCount > 1) {//如果当前ID为空，则判断前面的是否可以合并
                                this.spanRows(TableName, i, TempCount, ColArray[j]);
                            }
                            PreId = CurId;
                            TempCount = 1;//上面PreId被重新赋值，就需要初始化TempCount
                        }
                    }
                    else {
                        if (TempCount > 1) {//如果已经到了表格的最大行数，则判断前面是否需要合并，因为再也获取不到下一个ID了
                            this.spanRows(TableName, i, TempCount, ColArray[j]);
                        }
                        PreId = CurId;
                        TempCount = 1;//上面PreId被重新赋值，就需要初始化TempCount
                    }
                }
            }
        },

        /**
         * 删除不需要的单元格
         * @param {string} TableName 目标表格.
         * @param {integer} i 行号.
         * @param {integer} TempCount 合并的行数.
         * @param {string} ColArrayj 列的index.
         */
        spanRows:function (TableName, i, TempCount, ColArrayj) {//合并单元格开始
            TableName.rows[i - TempCount].cells[ColArrayj].rowSpan = TempCount;
            TableName.rows[i - TempCount].cells[ColArrayj].className += 'gri_td_rowSpan';
            for (var m = i - TempCount + 1; m <= i - 1; m++) {
                TableName.rows[m].deleteCell(ColArrayj);
            }
        },

        /**
         * 读取cookie
         * @param {string} cookieName cookie的key.
         * @return {string}  cookie的值.
         */
        getCookie:function (cookieName) {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(cookieName + "=");
                if (c_start != -1) {
                    c_start = c_start + cookieName.length + 1;
                    var c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) c_end = document.cookie.length;
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        },

        /**
         * 读取cookie
         * @param {string} cookieName cookie的key.
         * @param {string} value cookie的值.
         * @return {string}  cookie的值.
         */
        setCookie:function (cookieName, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = cookieName + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString());
        },

        /**
         * 创建复杂表头
         */
        createComplexHeader:function (complexHeader, table, _this) {

            var tHeader = document.createElement('THEAD');
            for (var name in complexHeader) {

                var _tr = complexHeader[name];

                var tRow = document.createElement('TR');
                for (var i = 0; i < _tr.length; i++) {
                    var tH = document.createElement('TH');

                    var field_name = _tr[i].field;

                    if (_tr[i].enable) {
                        _this.addClassName(tH, 'hover');
                        _this.addClassName(tH, 'enable');
                    }

                    if (_this.options.checkAll && field_name == 'gri_checkAll') {
                        //创建多选
                        var cbox = document.createElement("input");
                        cbox.type = 'checkbox';
                        cbox.className = 'gri_checkAll';
                        tH.appendChild(cbox);
                    }
                    else {
                        tH.innerHTML = field_name ? _this.options.allFields[field_name].thText : _tr[i].thText;
                    }

                    //表头初始化排序图标

                    if (_tr[i].rowSpan) {
                        tH.rowSpan = _tr[i].rowSpan;
                    }
                    if (_tr[i].colSpan) {
                        tH.colSpan = _tr[i].colSpan;
                    }

                    tH.style.textAlign = 'center';

                    tH.style.border = "1px solid gainsboro";

                    tRow.appendChild(tH);
                }

                tHeader.appendChild(tRow);
            }

            var oldHeader = table.getElementsByTagName('THEAD')[0];

            if (oldHeader) {
                oldHeader.parentNode.removeChild(oldHeader);
            }

            var _tbody = table.getElementsByTagName('TBODY')[0];

            _tbody.parentNode.insertBefore(tHeader, _tbody);

        },

        /**
         * 表头th的一些绑定和初始化
         */
        initTh:function (_this, table) {

            //找到所有的head中th
            var ths = table.getElementsByTagName('th');
            //表头排序，通过闭包绑定每个th的click事件
            for (var i = 0; i < ths.length; i++) {

                if (ths[i].innerHTML.indexOf("checkbox") < 0 && ths[i].className.indexOf('enable') > -1) {
                    (function (i) {
                        //找到当前th
                        var _th = ths[i];

                        if (_this.options.enableThClick != false) {
                            _th.onclick = function () {


                                //获取_th在ths中的索引
                                var index = _this.index(_th, ths);

                                //循环临时变量_index;需要排序的字段_field
                                var _index = 0, _field;

                                //获取排序方式
                                var order = _this.options.thorder[i];

                                //如果没定义order，默认调整为正序(因为初始化的时候是倒序)
                                if (!order) {
                                    order = 'asc';
                                    _this.options.thorder[i] = 'desc';
                                }
                                //如果是倒序，则变成正序
                                else if (order == 'desc') {
                                    _this.options.thorder[i] = 'asc';
                                }
                                //如果是正序，则变成倒序
                                else if (order == 'asc') {
                                    _this.options.thorder[i] = 'desc';
                                }

                                //去掉其它列的thorder属性
                                for (var j = 0; j < ths.length; j++) {
                                    if (j != i) {
                                        delete _this.options.thorder[j];
                                    }
                                }

                                //获取匹配的name
                                var _fieldName = '';

                                //遍历options的所有属性，直到找到当前和"thead th"的index相等的对象，然后赋值给_field
                                if (_this.options.complexHeader) {
                                    for (var name in _this.options.allFields) {
                                        var _thText = _this.options.allFields[name].thText ? _this.options.allFields[name].thText : name;
                                        if (_thText == _th.innerHTML) {
                                            _field = _this.options.allFields[name];
                                            _fieldName = name;
                                        }
                                        _this.options.allFields[name].clicked = false;
                                    }
                                }
                                else {
                                    for (var name in _this.options.allFields) {
                                        if (_index == index) {
                                            _field = _this.options.allFields[name];
                                            _fieldName = name;
                                        }
                                        _this.options.allFields[name].clicked = false;
                                        _index++;
                                    }
                                }

                                //如果_field找到了相应对象，则进行排序
                                if (_field) {
                                    //获取ajax数据，进行排序
                                    _this.page.orderField = _field.value;
                                    _this.options.allFields[_fieldName].clicked = true;
                                    _this.page.orderType = _this.options.thorder[i];
                                }

                                if (_this.page.ifRealPage) {
                                    _this.createJsonTable(_this);
                                } else {
                                    var maxValue = null;

                                    //保证有总计时,最后一行永远是最后一行
                                    if (!_this.options.page && _this.options.data.length > 0 && _this.options.fixedRow) {
                                        maxValue = _this.options.data[_this.options.data.length - 1][_field.value];
                                    }

                                    //假分页的时候根据列排序
                                    _this.options.data.sort(function (row1, row2) {

                                        //初始化row对应的JSON数组里的value值到col
                                        var col1, col2;

                                        if (row1[_field.value] == null) {
                                            col1 = '';
                                        }
                                        else {
                                            col1 = row1[_field.value].toString();
                                        }

                                        if (row2[_field.value] == null) {
                                            col2 = '';
                                        }
                                        else {
                                            col2 = row2[_field.value].toString();
                                        }

                                        //支持对百分数的大小排序
                                        if (col1.indexOf('%') == (col1.length - 1)) {
                                            col1 = col1.replace('%', '');
                                        }

                                        if (col2.indexOf('%') == (col2.length - 1)) {
                                            col2 = col2.replace('%', '');
                                        }

                                        if (col1 == maxValue) {
                                            return 1;
                                        }

                                        if (col2 == maxValue) {
                                            return -1;
                                        }

                                        //如果两个比较的值都是数字，则数字化
                                        if (_this.isNumber(col1) && _this.isNumber(col2)) {
                                            col1 = parseFloat(col1);
                                            col2 = parseFloat(col2);
                                        }

                                        //如果是正序排序，则第一个比第二个大，返回true，反之亦然。
                                        if (order == 'asc') {

                                            if (col1 > col2) {
                                                return 1;
                                            } else if (col1 < col2) {
                                                return -1;
                                            } else
                                                return 0;
                                        }

                                        //如果是倒序排序，则第一个比第二个小，返回true，反之亦然。
                                        if (order == 'desc') {
                                            if (col1 > col2) {
                                                return -1;
                                            } else if (col1 < col2) {
                                                return 1;
                                            } else
                                                return 0;
                                        }
                                    });

                                    //重新创建dt
                                    _this.initDataTable(_this.options);
                                }
                            };
                        }
                        else {
                            var _i = _th.getElementsByTagName('I')[0];
                            if (_i) {
                                _i.parentNode.removeChild(_i);
                            }
                        }

                        _th.onmouseout = function () {
                            _this.removeClassName(_th, 'visited');
                        }

                        _th.onmousedown = function () {
                            return false;
                        }
                    }(i));
                }
            }
        },

        /**
         * 过滤文本中的html标签
         * @param {string} str 需要过滤的字符串.
         * @return {string}  过滤后的值.
         */
        stripHTML:function (str) {

            var re = /(<([^>]+)>)/gi; //正则表达式
            return str.toString().replace(re, "");
        },

        //增加类名
        addClassName:function (element, className) {
            element.className += (element.className ? ' ' : '') + className;
        },

        //获得类名
        getClassNames:function (element) {
            return element.className.replace(/\s+/, ' ').split(' ');

        },

        //移除类名
        removeClassName:function (element, className) {
            var classes = this.getClassNames(element);
            var length = classes.length
            for (var i = length - 1; i >= 0; i--) {
                if (classes[i] === className) {
                    delete(classes[i]);
                }
            }
            element.className = classes.join(' ');
            return (length == classes.length ? false : true);
        },

        //通过样式的类名来查找元素
        getElementsByClassName:function (fatherId, realNode, tagName, className) {
            node = fatherId && document.getElementById(fatherId) || document;

            if (realNode) {
                node = realNode;
            }
            tagName = tagName || "*";
            className = className.split(" ");
            var classNameLength = className.length;
            for (var i = 0, j = classNameLength; i < j; i++) {
                //创建匹配类名的正则
                className[i] = new RegExp("(^|\\s)" + className[i].replace(/\-/g, "\\-") + "(\\s|$)");
            }
            var elements = node.getElementsByTagName(tagName);
            var result = [];
            for (var i = 0, j = elements.length, k = 0; i < j; i++) {//缓存length属性
                var element = elements[i];
                while (className[k++].test(element.className)) {//优化循环
                    if (k === classNameLength) {
                        result[result.length] = element;
                        break;
                    }
                }
                k = 0;
            }
            return result;
        },

        /**
         * 截取字符串
         * @param {string} str 需要截取的字符串.
         * @param {string} len 需要截取的长度.
         * @return {string}  处理后的值.
         */
        setString:function (str, len) {
            var strlen = 0;
            var s = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 128) {
                    strlen += 2;
                } else {
                    strlen++;
                }
                s += str.charAt(i);
                if (strlen >= len) {
                    return s + '…';
                }
            }
            return s;
        },

        /*
         * 创建行列锁定的表格
         * createSuperTable({ width: "440px", height: "200px", fixedCols: 2 },'testTable2');
         */
        createSuperTable:function (options, tableID) {
            //获取配置信息
            var setting = (
            {
                width:"640px",
                height:"320px",
                margin:"10px",
                padding:"0px",
                overflow:"hidden",
                colWidths:undefined,
                fixedCols:0,
                headerRows:1,
                onStart:function () {
                },
                onFinish:function () {
                },
                cssSkin:"sSky"
            });

            if (options.width) {
                setting.width = options.width;
            }

            if (options.height) {
                setting.height = options.height;
            }

            if (options.fixedCols) {
                setting.fixedCols = options.fixedCols;
            }

            //生成表格
            var _table = document.getElementById(tableID);
            var _div = document.createElement('div');
            _div.id = tableID + "_box";

            _table.parentNode.appendChild(_div);
            _div.appendChild(_table);

            var nonCssProps = {"fixedCols":{}, "headerRows":{}, "onStart":{}, "onFinish":{}, "cssSkin":{}, "colWidths":{}};

            for (var p in setting) {
                if (!nonCssProps[p]) {
                    _table.parentNode.style[p] = setting[p];
                    delete setting[p];
                }
            }

            var mySt = new superTable(tableID, setting);
        }

        /*
         * 隐藏分页控件

         hidePage:function () {
         var _table = document.getElementById(this.finalOptions.tableId);
         var _page = _this.getElementsByClassName(null, _table, 'div', 'gri_pg');

         }
         */

        /**
         * 控制列的隐藏和显示

         setHiddenCol:function (oTable, iCol) {
            for (var i = 0; i < oTable.rows.length; i++) {
                //oTable.rows[i].cells[iCol].style.display == "none";
                //如果该列隐藏则让其显示，反之则让其隐藏
                oTable.rows[i].cells[iCol].style.display = "none";
            }
        }
         */
    };

    global.GRI = global.GRI || {};

    /**
     * 初始化DataTable,对外暴露的接口
     * @param {object} params 传入的参数列表.
     * @return {object} 生成的DataTable对象
     */
    global.GRI.initDataTable = function (params) {
        return new DataTable().initDataTable(params);
    };

    /**
     * 初始化DataTable,对外暴露的接口,ajax获取数据
     * @param {string} url 获取json的url地址.
     * @param {function} fn 获取结果之后的回调函数.
     * @param {object} obj 回调函数可能要用到的对象.
     */
    global.GRI.ajaxGet = function (url, fn, obj) {
        new DataTable().ajaxGet(url, fn, obj);
    };

    if (!document.all) {
        //为老版本火狐增加outerHTML功能
        if (typeof(HTMLElement) != "undefined") {
            HTMLElement.prototype.__defineSetter__("outerHTML", function (s) {
                var r = this.ownerDocument.createRange();
                r.setStartBefore(this);
                var df = r.createContextualFragment(s);
                this.parentNode.replaceChild(df, this);
                return s;
            });
            HTMLElement.prototype.__defineGetter__("outerHTML", function () {
                var a = this.attributes, str = "<" + this.tagName, i = 0;
                for (; i < a.length; i++)
                    if (a[i].specified)
                        str += " " + a[i].name + '="' + a[i].value + '"';
                if (!this.canHaveChildren)
                    return str + " />";
                return str + ">" + this.innerHTML + "</" + this.tagName + ">";
            });

            HTMLElement.prototype.__defineGetter__("canHaveChildren", function () {
                return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
            });
        }

        //扩展innerText函数，老版本火狐等部分浏览器不支持
        if (!!document.getBoxObjectFor || window.mozInnerScreenX != null) {
            HTMLElement.prototype.__defineSetter__("innerText", function (sText) {
                var parsedText = document.createTextNode(sText);
                this.innerHTML = "";
                this.appendChild(parsedText);
                return parsedText;
            });
            HTMLElement.prototype.__defineGetter__("innerText", function () {
                var r = this.ownerDocument.createRange();
                r.selectNodeContents(this);
                return r.toString();
            });
        }
    }

    //传入window，可以加速读取
})(self, document, undefined);


/////////////////////////////////////////////////////////////////////////////////////////
// Super Tables v0.30 - 行列锁定功能
/////////////////////////////////////////////////////////////////////////////////////////
////// TO CALL: 
// new superTable([string] tableId, [object] options);
//
////// OPTIONS: (order does not matter )
// cssSkin : string ( eg. "sDefault", "sSky", "sOrange", "sDark" )
// headerRows : integer ( default is 1 )
// fixedCols : integer ( default is 0 )
// colWidths : integer array ( use -1 for auto sizing )
// onStart : function ( any this.variableNameHere variables you create here can be used later ( eg. onFinish function ) )
// onFinish : function ( all this.variableNameHere variables created in this script can be used in this function )
//
////// EXAMPLES:
// var myST = new superTable("myTableId");
//
// var myST = new superTable("myTableId", {
//		cssSkin : "sDefault",
//		headerRows : 1,
//		fixedCols : 2,
//		colWidths : [100, 230, 220, -1, 120, -1, -1, 120],
//		onStart : function () {
//			this.start = new Date();
//		},
//		onFinish : function () {
//			alert("Finished... " + ((new Date()) - this.start) + "ms.");
//		}
// });
//
////// ISSUES / NOTES:
// 1. No quirksmode support (officially, but still should work)
// 2. Element id's may be duplicated when fixedCols > 0, causing getElementById() issues
// 3. Safari will render the header row incorrectly if the fixed header row count is 1 and there is a colspan > 1 in one 
//		or more of the cells (fix available)
/////////////////////////////////////////////////////////////////////////////////////////
var superTable = function (tableId, options) {
/////* Initialize */
    options = options || {};
    this.cssSkin = options.cssSkin || "";
    this.headerRows = parseInt(options.headerRows || "1");
    this.fixedCols = parseInt(options.fixedCols || "0");
    this.colWidths = options.colWidths || [];
    this.initFunc = options.onStart || null;
    this.callbackFunc = options.onFinish || null;
    this.initFunc && this.initFunc();

/////* Create the framework dom */
    this.sBase = document.createElement("DIV");
    this.sFHeader = this.sBase.cloneNode(false);
    this.sHeader = this.sBase.cloneNode(false);
    this.sHeaderInner = this.sBase.cloneNode(false);
    this.sFData = this.sBase.cloneNode(false);
    this.sFDataInner = this.sBase.cloneNode(false);
    this.sData = this.sBase.cloneNode(false);
    this.sColGroup = document.createElement("COLGROUP");

    this.sDataTable = document.getElementById(tableId);
    this.sDataTable.style.margin = "0px";
    /* Otherwise looks bad */
    if (this.cssSkin !== "") {
        this.sDataTable.className += " " + this.cssSkin;
    }
    if (this.sDataTable.getElementsByTagName("COLGROUP").length > 0) {
        this.sDataTable.removeChild(this.sDataTable.getElementsByTagName("COLGROUP")[0]);
        /* Making our own */
    }
    this.sParent = this.sDataTable.parentNode;
    this.sParentHeight = this.sParent.offsetHeight;
    this.sParentWidth = this.sParent.offsetWidth;

/////* Attach the required classNames */
    this.sBase.className = "sBase";
    this.sFHeader.className = "sFHeader";
    this.sHeader.className = "sHeader";
    this.sHeaderInner.className = "sHeaderInner";
    this.sFData.className = "sFData";
    this.sFDataInner.className = "sFDataInner";
    this.sData.className = "sData";

/////* Clone parts of the data table for the new header table */
    var alpha, beta, touched, clean, cleanRow, i, j, k, m, n, p;
    this.sHeaderTable = this.sDataTable.cloneNode(false);
    if (this.sDataTable.tHead) {
        alpha = this.sDataTable.tHead;
        this.sHeaderTable.appendChild(alpha.cloneNode(false));
        beta = this.sHeaderTable.tHead;
    } else {
        alpha = this.sDataTable.tBodies[0];
        this.sHeaderTable.appendChild(alpha.cloneNode(false));
        beta = this.sHeaderTable.tBodies[0];
    }
    alpha = alpha.rows;
    for (i = 0; i < this.headerRows; i++) {
        beta.appendChild(alpha[i].cloneNode(true));
    }
    this.sHeaderInner.appendChild(this.sHeaderTable);

    if (this.fixedCols > 0) {
        this.sFHeaderTable = this.sHeaderTable.cloneNode(true);
        this.sFHeader.appendChild(this.sFHeaderTable);
        this.sFDataTable = this.sDataTable.cloneNode(true);
        this.sFDataInner.appendChild(this.sFDataTable);
    }

/////* Set up the colGroup */
    alpha = this.sDataTable.tBodies[0].rows;
    for (i = 0, j = alpha.length; i < j; i++) {
        clean = true;
        for (k = 0, m = alpha[i].cells.length; k < m; k++) {
            if (alpha[i].cells[k].colSpan !== 1 || alpha[i].cells[k].rowSpan !== 1) {
                i += alpha[i].cells[k].rowSpan - 1;
                clean = false;
                break;
            }
        }
        if (clean === true) break;
        /* A row with no cells of colSpan > 1 || rowSpan > 1 has been found */
    }
    cleanRow = (clean === true) ? i : 0;
    /* Use this row index to calculate the column widths */
    for (i = 0, j = alpha[cleanRow].cells.length; i < j; i++) {
        if (i === this.colWidths.length || this.colWidths[i] === -1) {
            this.colWidths[i] = alpha[cleanRow].cells[i].offsetWidth;
        }
    }
    for (i = 0, j = this.colWidths.length; i < j; i++) {
        this.sColGroup.appendChild(document.createElement("COL"));
        this.sColGroup.lastChild.setAttribute("width", this.colWidths[i]);
    }
    this.sDataTable.insertBefore(this.sColGroup.cloneNode(true), this.sDataTable.firstChild);
    this.sHeaderTable.insertBefore(this.sColGroup.cloneNode(true), this.sHeaderTable.firstChild);
    if (this.fixedCols > 0) {
        this.sFDataTable.insertBefore(this.sColGroup.cloneNode(true), this.sFDataTable.firstChild);
        this.sFHeaderTable.insertBefore(this.sColGroup.cloneNode(true), this.sFHeaderTable.firstChild);
    }

/////* Style the tables individually if applicable */
    if (this.cssSkin !== "") {
        this.sDataTable.className += " " + this.cssSkin + "-Main";
        this.sHeaderTable.className += " " + this.cssSkin + "-Headers";
        if (this.fixedCols > 0) {
            this.sFDataTable.className += " " + this.cssSkin + "-Fixed";
            this.sFHeaderTable.className += " " + this.cssSkin + "-FixedHeaders";
        }
    }

/////* Throw everything into sBase */
    if (this.fixedCols > 0) {
        this.sBase.appendChild(this.sFHeader);
    }
    this.sHeader.appendChild(this.sHeaderInner);
    this.sBase.appendChild(this.sHeader);
    if (this.fixedCols > 0) {
        this.sFData.appendChild(this.sFDataInner);
        this.sBase.appendChild(this.sFData);
    }
    this.sBase.appendChild(this.sData);
    this.sParent.insertBefore(this.sBase, this.sDataTable);
    this.sData.appendChild(this.sDataTable);

/////* Align the tables */
    var sDataStyles, sDataTableStyles;
    this.sHeaderHeight = this.sDataTable.tBodies[0].rows[(this.sDataTable.tHead) ? 0 : this.headerRows].offsetTop;
    sDataTableStyles = "margin-top: " + (this.sHeaderHeight * -1) + "px;";
    sDataStyles = "margin-top: " + this.sHeaderHeight + "px;";
    sDataStyles += "height: " + (this.sParentHeight - this.sHeaderHeight) + "px;";
    if (this.fixedCols > 0) {
        /* A collapsed table's cell's offsetLeft is calculated differently (w/ or w/out border included) across broswers - adjust: */
        this.sFHeaderWidth = this.sDataTable.tBodies[0].rows[cleanRow].cells[this.fixedCols].offsetLeft;
        if (window.getComputedStyle) {
            alpha = document.defaultView;
            beta = this.sDataTable.tBodies[0].rows[0].cells[0];
            if (navigator.taintEnabled) { /* If not Safari */
                this.sFHeaderWidth += Math.ceil(parseInt(alpha.getComputedStyle(beta, null).getPropertyValue("border-right-width")) / 2);
            } else {
                this.sFHeaderWidth += parseInt(alpha.getComputedStyle(beta, null).getPropertyValue("border-right-width"));
            }
        } else if (/*@cc_on!@*/0) { /* Internet Explorer */
            alpha = this.sDataTable.tBodies[0].rows[0].cells[0];
            beta = [alpha.currentStyle["borderRightWidth"], alpha.currentStyle["borderLeftWidth"]];
            if (/px/i.test(beta[0]) && /px/i.test(beta[1])) {
                beta = [parseInt(beta[0]), parseInt(beta[1])].sort();
                this.sFHeaderWidth += Math.ceil(parseInt(beta[1]) / 2);
            }
        }

        /* Opera 9.5 issue - a sizeable data table may cause the document scrollbars to appear without this: */
        if (window.opera) {
            this.sFData.style.height = this.sParentHeight + "px";
        }

        this.sFHeader.style.width = this.sFHeaderWidth + "px";
        sDataTableStyles += "margin-left: " + (this.sFHeaderWidth * -1) + "px;";
        sDataStyles += "margin-left: " + this.sFHeaderWidth + "px;";
        sDataStyles += "width: " + (this.sParentWidth - this.sFHeaderWidth) + "px;";
    } else {
        sDataStyles += "width: " + this.sParentWidth + "px;";
    }
    this.sData.style.cssText = sDataStyles;
    this.sDataTable.style.cssText = sDataTableStyles;

/////* Set up table scrolling and IE's onunload event for garbage collection */
    (function (st) {
        if (st.fixedCols > 0) {
            st.sData.onscroll = function () {
                st.sHeaderInner.style.right = st.sData.scrollLeft + "px";
                st.sFDataInner.style.top = (st.sData.scrollTop * -1) + "px";
            };
        } else {
            st.sData.onscroll = function () {
                st.sHeaderInner.style.right = st.sData.scrollLeft + "px";
            };
        }
        if (/*@cc_on!@*/0) { /* Internet Explorer */
            window.attachEvent("onunload", function () {
                st.sData.onscroll = null;
                st = null;
            });
        }
    })(this);

    this.callbackFunc && this.callbackFunc();
};

return self.GRI;
});