/**
 * file: boostrap.js
 * ver: 1.0.0
 * auth: 306766045@qq.com
 */
(function() {
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
                '<div id="bootstrap_progressbar" style="position:fixed;top:0px;left:0px;right:0px;width:100%;z-index:9;">'+
                   '<div class="bar" style="height:3px;width:100%;background:'+configMap.progressColor()+';-webkit-transform:translate(-100%,0);transform:translate(-100%,0);-webkit-transition:-webkit-transform 1s;transition:transform 1s">'+
                    '</div>'+
                    '<div class="number" style="text-align:right;font-size:18px;color:'+configMap.progressColor()+';margin-top:5px;">0%</div>'+
                   '<div class="message" style="margin-left:10%;font-size:14px;color:'+configMap.progressColor()+';width:80%;"></div>'+
                '</div>';
            progressBar = element.children[0];
            document.body.appendChild(progressBar);
        }
        function update(data){
            var pro = data - 100;
            progressBar.children[0].style['-webkit-transform'] = 'translate(' + pro + '%,0)';
            progressBar.children[0].style.transform = 'translate(' + pro + '%,0)';
            progressBar.children[1].innerText = data + '%';
        }
        function end(){
            document.body.removeChild(progressBar);
            progressBar = null;   
        }
        function message(msg){
            if( progressBar == null )
                return;
            msg = msg.replace(/\n/g,'<br/>');
            progressBar.children[2].innerHTML = progressBar.children[2].innerHTML + msg;
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
            debug:false,
            browserCheck:function(){
                var userAgent = navigator.userAgent;
                var ie = userAgent.match(/MSIE ([\d.]+)/);
                if( ie && ie[1] < 9 )
                    return '\n请使用360，QQ或IE9以上的浏览器';
                return true;
            },
            progressColor:'#f27373'
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
                return option.debug?false:true;
            },
            isUseAjaxGet:function(){
                return option.debug?false:true;
            },
            isUseWenire:function(){
                return option.debug?true:false;
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