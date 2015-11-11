/**
 * file: boostrap.js
 * ver: 1.0.0
 * auth: 306766045@qq.com
 */
(function() {
    var errorImage = 'data:image/png;base64,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';
    var unwifiImage = 'data:image/png;base64,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';

    var util = {};
    //网络工具
    (function(){
        function ajax(inOption){
            //处理option
            var myOption = {
                url:'',
                type:'get',
                data:'',
                cache:false,
                async:true,
                success:function(){

                },
                error:function(){

                }
            }
            for( var i in inOption )
                if( typeof(inOption[i]) != 'undefined' )
                    myOption[i] = inOption[i];
            //发出请求
            var xmlhttp=null;
            if (window.XMLHttpRequest){// code for all new browsers
                xmlhttp=new XMLHttpRequest();
            }else if (window.ActiveXObject){
                 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            if( xmlhttp == null )
                return;
            if( myOption.cache === false ){
                if( myOption.url.indexOf('?') == -1 )
                    myOption.url += '?t='+new Date().getTime();
                else
                    myOption.url += '&t='+new Date().getTime();
            }
            if( configMap.getOrigin() != '')
                myOption.url = 'http://'+configMap.getOrigin()+myOption.url;
            xmlhttp.onreadystatechange = function(){
                if( xmlhttp.readyState != 4 ){
                    return;
                }
                if( xmlhttp.status == 200 ){
                    myOption.success(xmlhttp.responseText);
                }else{
                    myOption.error(xmlhttp);
                }
            }
            xmlhttp.open(
                myOption.type.toUpperCase(),
                myOption.url,
                myOption.async
            );
            if( myOption.type == 'post'){
                xmlhttp.send(myOption.data);
            }else{
                xmlhttp.send(null);
            }
                

        }
        function post(url,data,success,error){
            ajax({
                url:url,
                type:'post',
                data:data,
                success:success,
                error:error
            });
        }
        function get(url,data,success,error){
            ajax({
                url:url,
                type:'get',
                data:data,
                success:success,
                error:error
            });
        }
        util.ajax = ajax;
        util.get = get;
        util.post = post;
    })(util);

    //载入显示工具条
    (function(){
        var progressBar = null;
        function begin(){
            var element = document.createElement('div');
            element.innerHTML = 
                '<div id="bootstrap_progressbar" style="position:fixed;top:0px;left:0px;right:0px;bottom:0px;width:100%;height:100%;z-index:9;">'+
                    '<div class="header" style="background-color: #FFF;color: #282828;height: 44px;line-height: 44px;font-size: 18px;position: absolute;top: 0;left: 0;right: 0;padding: 0;margin: 0 auto;text-align: center;max-width: 600px;">'+
                        '烘焙帮'+
                    '</div>'+
                    '<div class="number" style="line-height:110px;font-size:18px;color:'+configMap.progressColor()+';text-align:center;position:absolute;top:0px;left:0px;right:0px;bottom:0px;margin:auto;height:110px;width:110px;">'+
                        '<div>0%</div>'+
                        '<ion-spinner class="spinner" style="stroke:#F95050;fill:#F95050;height: 110px !important;width:110px;position:absolute;top:0px;left:0px;">'+
					      '<svg viewBox="0 0 64 64">'+
					        '<g stroke-width="0">'+
					          '<circle cx="24" cy="0" transform="translate(32,32)" r="5.15247">'+
					            '<animate attributeName="r" dur="750ms" values="8;7;6;5;4;3;2;1;8" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					          '<circle cx="16.970562748477143" cy="16.97056274847714" transform="translate(32,32)" r="6.15247">'+
					            '<animate attributeName="r" dur="750ms" values="1;8;7;6;5;4;3;2;1" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					          '<circle cx="1.4695761589768238e-15" cy="24" transform="translate(32,32)" r="7.15247">'+
					            '<animate attributeName="r" dur="750ms" values="2;1;8;7;6;5;4;3;2" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					          '<circle cx="-16.97056274847714" cy="16.970562748477143" transform="translate(32,32)" r="6.93269">'+
					            '<animate attributeName="r" dur="750ms" values="3;2;1;8;7;6;5;4;3" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					          '<circle cx="-24" cy="2.9391523179536475e-15" transform="translate(32,32)" r="1.15247">'+
					            '<animate attributeName="r" dur="750ms" values="4;3;2;1;8;7;6;5;4" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					          '<circle cx="-16.970562748477143" cy="-16.97056274847714" transform="translate(32,32)" r="2.15247">'+
					            '<animate attributeName="r" dur="750ms" values="5;4;3;2;1;8;7;6;5" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					          '<circle cx="-4.408728476930472e-15" cy="-24" transform="translate(32,32)" r="3.15247">'+
					            '<animate attributeName="r" dur="750ms" values="6;5;4;3;2;1;8;7;6" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					          '<circle cx="16.970562748477136" cy="-16.970562748477143" transform="translate(32,32)" r="4.15247">'+
					            '<animate attributeName="r" dur="750ms" values="7;6;5;4;3;2;1;8;7" repeatCount="indefinite"></animate>'+
					          '</circle>'+
					        '</g>'+
					      '</svg>'+
					    '</ion-spinner>'+
                    '</div>'+
                    '<div class="messagePage" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;margin:auto;height:280px;width:300px;">'+
                        '<div class="icon" style="height:120px;width:120px;background-size:120px 120px;background-repeat:no-repeat;background-position:center;margin:0 auto;"></div>'+
                        '<div class="info" style="text-align:center;font-size:16px;color:#969696;margin:35px auto;"></div>'+
                        '<div class="restart" style="width:230px;height:35px;line-height:35px;cursor:pointer;margin:0 auto;border-radius:3px;border:2px solid;border-color:'+configMap.progressColor()+';color:'+configMap.progressColor()+';text-align:center;font-size:14px;">'+
                            '重 试'+
                        '</div>'+
                        '<div class="details" style="text-align:center;font-size:12px;margin:15px auto 0 auto;color:'+configMap.progressColor()+';">'+
                            '查看错误详情'+
                        '</div>'+
                    '</div>'+
                '</div>';
            progressBar = element.children[0];
            document.body.appendChild(progressBar);
            progressBar.children[2].style.display = "none";
            progressBar.children[2].children[2].onclick = function(){
                location.reload();
            };
        }
        function update(data){
            progressBar.children[1].children[0].innerText = data + '%';
        }
        function end(){
            document.body.removeChild(progressBar);
            progressBar = null;   
        }
        function message(msg){
            if( progressBar == null )
                return;
            progressBar.children[1].style.display = "none";
            if( msg.indexOf('网路错误') == -1){
                progressBar.children[2].children[0].style.backgroundImage = "url("+errorImage+")";
                progressBar.children[2].children[1].innerHTML = "服务器开小差，我们在紧张抢修中...";  
                progressBar.children[2].children[3].onclick = function(){
                    alert(msg);
                };
            }else{
                progressBar.children[2].children[0].style.backgroundImage = "url("+unwifiImage+")";
                progressBar.children[2].children[1].innerHTML = "网络未连接";
                progressBar.children[2].children[3].style.display = "none";
            }
            progressBar.children[2].style.display = "block";
        }
        util.progress = {
            begin:begin,
            update:update,
            end:end,
            message:message
        };
    })(util);

    //本地存储工具
    (function(){
        var resourcePrefix = 'bootstrap:';
        var loadedResource = {};
        function set(name,value){
            try{
                if( window.localStorage){
                    if( value != ''){
                        localStorage.setItem(resourcePrefix+name,value);
                    }else{
                        localStorage.removeItem(resourcePrefix+name);
                    }  
                    return true;
                }else{
                    return false;
                }  
            }catch(e){
                return false;
            }
        }

        function get(name){
            if( window.localStorage )
                return localStorage.getItem(resourcePrefix+name);
            else
                return null;
        }

        function getAllKey(name){
            var result = [];
            if( window.localStorage ){
                for( var i = 0 ; i < window.localStorage.length ; ++i ){
                    var key = window.localStorage.key(i);
                    if( key.substring(0,resourcePrefix.length) != resourcePrefix )
                        continue;
                    result.push( key.substring(resourcePrefix.length) );
                }
            }
            return result;
        }

        function saveResource(name,version,resource){
            if( loadedResource.hasOwnProperty(name) &&
                loadedResource[name] == version )
                return;
            var data = {
                version:version,
                file:resource
            };
            var isSet = set( name , JSON.stringify(data) );
            if( isSet )
                loadedResource[name] = version;
        }

        function loadResource(name,version){
             var currentResource = get(name);

            //判断是否有资源
            if( currentResource == null )
                return null;

            //判断资源版本是否正确
            currentResource = JSON.parse(currentResource);
            if( currentResource.version ==  version ){
                loadedResource[name] = version;
                return currentResource.file;
            }
            return null;
        }

        function clearOldFormatResource(){
            if( window.localStorage ){
                for( var i = 0 ; i < window.localStorage.length ; ++i ){
                    var key = window.localStorage.key(i);
                    if( key.substring(0,2) == 'Hm')
                        continue;
                    if( key.substring(0,resourcePrefix.length) == resourcePrefix )
                        continue;
                    window.localStorage.removeItem(key);
                }
            }
        }

        function clearOldResource(){
            var allKey = getAllKey();
            for( var i = 0 ; i != allKey.length ; ++i ){
                if( loadedResource.hasOwnProperty(allKey[i]) === false )
                    set(allKey[i],'');
            }
        }

        clearOldFormatResource();

        util.localResource = {
            save:saveResource,
            load:loadResource,
            clear:clearOldResource
        };

    })(util);

    //捕捉异常
    var configMap = {};
    config = function(userOption){
        var option = {
            origin:'',
            errorReportUrl:'',
            version:0,
            useCache:true,
            browserCheck:function(){
                var userAgent = navigator.userAgent;
                var ie = userAgent.match(/MSIE ([\d.]+)/);
                if( ie && ie[1] < 9 )
                    return '\n请使用360，QQ或IE9以上的浏览器';
                return true;
            },
            progressColor:'#F95050'
        };
        configMap = {
            onBegin:function(){
                util.progress.begin();
            },
            onStart:function(){
                var result = option.browserCheck();
                if( result !== true ){
                    configMap.onError(
                        '抱歉，不支持该浏览器'+
                        '\n'+result
                    );
                    return false;
                }
                return true;
            },
            onProgress:function(progress){
                util.progress.update(progress);
            },
            onError:function(error){
                var msgs = '';
                msgs += "\n错误信息："+error;
                msgs += "\n客户端："+navigator.userAgent;
                msgs += "\n代码版本："+option.version;
                msgs += "\n网页地址："+location.href;
                msgs += "\n\n";

                if( console )
                    console.log(msgs);

                if(option.errorReportUrl != '')
                    util.post(option.errorReportUrl,msgs);

                util.progress.message(msgs);
            },
            onLoad:function(){
                util.progress.end();
            },
            isUseCache:function(){
                return option.useCache?true:false;
            },
            isUseAjaxGet:function(){
                return option.useCache?true:false;
            },
            isUseWenire:function(){
                return option.useCache?false:true;
            },
            isLogLoading:function(){
                return option.useCache?false:true;
            },
            progressColor:function(){
                return option.progressColor;
            },
            getOrigin:function(){
                return option.origin;
            }
        };
        for( var i in userOption )
            option[i] = userOption[i];
        if( configMap.isUseWenire() )
            evalScriptWithUrl('//'+location.host+':9999/target/target-script-min.js#anonymous');
    }

    config({});
    
    window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,error) {
        var stack = '';
        var msgs = [];
        if( error && error.stack )
            stack = error.stack;
      
        msgs.push(errorMessage);
        msgs.push("\n出错文件：" , scriptURI);
        msgs.push("\n出错位置：" , lineNumber + '行，' + columnNumber + '列');
        msgs.push("\n调用栈："+stack);
        msgs = msgs.join('');

        configMap.onError(msgs);
    }

    //加载器代码
    var loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        resMap = {}, 
        pkgMap = {};

    function evalScript(id,resource){
        var script = document.createElement("script");
        script.language = "javascript";
        script.text = resource;
        document.body.appendChild(script);
    }
    function evalScriptWithUrl(url){
        var script = document.createElement("script");
        script.language = "javascript";
        script.src = url;
        document.body.appendChild(script);
    }
    function loadScript(id, callback) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        queue.push(callback);

        var res = resMap[id] || {};
        var url = res.pkg
                ? pkgMap[res.pkg].uri
                : (res.uri || id);

        var resource = util.localResource.load(id,url);
        if( resource == null || configMap.isUseCache() === false ){
            //
            // load this script
            //
            if (! (url in scriptsMap))  {
                scriptsMap[url] = true;
                if( configMap.isUseAjaxGet() ){
                    util.get(
                        url,
                        '',
                        function(result){
                            //success状态
                            evalScript(id,result);
                        },
                        function(xmlhttp){
                            //error状态
                            configMap.onError(
                                '加载url '+url+'失败（网路错误）'+
                                '\n状态码:'+xmlhttp.status+
                                '\n状态描述:'+xmlhttp.statusText
                            );
                        }
                    );
                }else{
                    evalScriptWithUrl(url);
                }
            }
        }else{
            //
            // load from localStorage
            //
            evalScript(id,'define("'+id+'",'+resource +')');
        }
    }

    define = function(id, factory) {
        if( Object.keys(resMap).length == 0 ){
            configMap.onError('未加载resMap时试图加载'+id);
            return;
        }
        var res = resMap[id] || {};
        var url = res.pkg
                ? pkgMap[res.pkg].uri
                : (res.uri || id);

        if( configMap.isUseCache() )
            util.localResource.save(id,url,factory.toString());

        factoryMap[id] = factory;

        var queue = loadingMap[id];
        if (queue) {
            for(var i = queue.length - 1; i >= 0; --i) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    require = function(id) {
        id = require.alias(id);

        var mod = modulesMap[id];
        if (mod) {
            return mod.exports;
        }

        //
        // init module
        //
        var factory = factoryMap[id];
        if (!factory) {
           configMap.onError('Cannot find module `' + id + '`');
        }

        mod = modulesMap[id] = {
            'exports': {}
        };

        //
        // factory: function OR value
        //
        var ret = (typeof factory == 'function')
                ? factory.apply(mod, [require, mod.exports, mod])
                : factory;

        if (ret) {
            mod.exports = ret;
        }
        return mod.exports;
    };

    require.async = function(names, callback) {
        if( configMap.onStart() == false )
            return;

        if (typeof names == 'string') {
            names = [names];
        }
        
        for(var i = names.length - 1; i >= 0; --i) {
            names[i] = require.alias(names[i]);
        }

        var needMap = {};
        var needNum = 0;

        function getResourceDepend(next){
            util.get(
                '/map.json',
                '',
                function(result){
                    //success状态
                    var result = JSON.parse(result);
                    require.resourceMap(result);
                    next();
                },
                function(xmlhttp){
                    //error状态
                    configMap.onError(
                        '加载map.json失败（网路错误）'+
                        '\n状态码:'+xmlhttp.status+
                        '\n状态描述:'+xmlhttp.statusText
                    );
                }
            );
        }

        function findNeed(depArr) {
            for(var i = depArr.length - 1; i >= 0; --i) {
                //
                // skip loading or loaded
                //
                var dep = depArr[i];
                if (dep in factoryMap || dep in needMap) {
                    continue;
                }

                needMap[dep] = true;
                needNum++;
                loadScript(dep, updateNeed);

                var child = resMap[dep];
                if (child && 'deps' in child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            var progress = 1 - (needNum)/Object.keys(needMap).length;
            configMap.onProgress(Math.ceil(progress*100));
            if( configMap.isLogLoading() ){
                var result = [];
                for( var i in needMap )
                    if( i in factoryMap == false )
                        result.push(i);
                console.log(result);
            }

            if (0 == needNum--) {
                util.localResource.clear();
                configMap.onLoad();
                var i, n, args = [];
                for(i = 0, n = names.length; i < n; ++i) {
                    args[i] = require(names[i]);
                }
                callback && callback.apply(window, args);
            }
        }
        
        getResourceDepend(function(){
            findNeed(names);
            updateNeed();
        });
    };

    require.resourceMap = function(obj) {
        resMap = obj['res'] || {};
        pkgMap = obj['pkg'] || {};
    };

    require.alias = function(id) {return id};

    configMap.onBegin();

    window.require = require;
    window.define = define;
    window.config = config;

})();