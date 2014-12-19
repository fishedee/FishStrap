define('api/netType',[],function(require, exports, module) {
    module.exports = {
		key: 'wsq_nettype',
		init: function() {
            if (isWX) {
                if (typeof WeixinJSBridge != 'undefined') {
                    module.exports.wxNetType();
                } else {
                    jq(document).bind('WeixinJSBridgeReady', function() {
                        module.exports.wxNetType();
                    });
                }
            } else if (typeof mqq !== 'undefined' && mqq.version && mqq.device.isMobileQQ()) {
                module.exports.mqqNetType();
            }
            window.NETTYPE = localStorage.getItem(module.exports.key) || window.NETTYPE_DEFAULT;
        },
		wxNetType: function() {
            WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                switch (e.err_msg) {
                    case 'network_type:wifi':
                        localStorage.setItem(module.exports.key, window.NETTYPE_WIFI);
                        break;
                    case 'network_type:edge':
                        localStorage.setItem(module.exports.key, window.NETTYPE_EDGE);
                        break;
                    case 'network_type:wwan':
                        localStorage.setItem(module.exports.key, window.NETTYPE_EDGE);
                        break;
                    case 'network_type:fail':
                        localStorage.setItem(module.exports.key, window.NETTYPE_FAIL);
                        break;
                    default:
                        break;
                }
            });
        },
		mqqNetType: function() {
            mqq.device.getNetworkType(function(result) {
                switch (result) {
                    case 0:
                        localStorage.setItem(module.exports.key, window.NETTYPE_FAIL);
                        break;
                    case 1:
                        localStorage.setItem(module.exports.key, window.NETTYPE_WIFI);
                        break;
                    case 2:
                        localStorage.setItem(module.exports.key, window.NETTYPE_EDGE);
                        break;
                    case 3:
                        localStorage.setItem(module.exports.key, window.NETTYPE_3G);
                        break;
                    default:
                        break;
                }
            });
        }
	};
	//初始化nettype
    var netType = require('lib/netType');
    try {
        netType.init();
    } catch (e) {
        console.log('get netType error' + e);
    }
});
