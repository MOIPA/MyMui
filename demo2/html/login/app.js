/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/

var urlreg = 'http://39.108.159.175/phpworkplace/mui/login/reg.php';
var urllogin = 'http://39.108.159.175/phpworkplace/mui/login/login.php';

(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		
		var users = JSON.parse(localStorage.getItem('user') || '[]');
		
		mui.ajax(urllogin,{
			data:{
				account:loginInfo.account,
				password:loginInfo.password
			},
			type:'post',
			dataType:'json',
			timeout: 3000,
			success: function(data) {
				if(data.status != 'success') {
//				alert(data.status);
					return callback('用户名或密码错误');
				}
				else {
					var userinfo = JSON.parse(data.uinfo);
//					alert(userinfo.aid);
					loginInfo.aid = userinfo.aid;
					users = [];
					loginInfo.loginstatus = 'online';
					loginInfo.name = userinfo.name;
					loginInfo.age = userinfo.age;
					loginInfo.sex = userinfo.sex;
					loginInfo.com=userinfo.com;
					users.push(loginInfo);
					localStorage.setItem('user', JSON.stringify(users));
					users = localStorage.getItem('user');
//					alert(users);
					return owner.createState(loginInfo.account, callback);
				}
			},
			error: function(xhr, type, errThrown) {
				alert('something wrong with the server... call 18952448323 tangrui to fix');
			}
		});
		
//		var authed = users.some(function(user) {
//			return loginInfo.account == user.account && loginInfo.password == user.password;
//		});
//		if(authed) {
//			return owner.createState(loginInfo.account, callback);
//		} else {
//			return callback('用户名或密码错误');
//		}
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if(regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if(!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		if(regInfo.com.length<=0){
			return callback('请输入社区');
		}
		var users = JSON.parse(localStorage.getItem('$user') || '[]');
		//start server connection

		mui.ajax(urlreg, {
			data: {
				account: regInfo.account,
				password: regInfo.password,
				email: regInfo.email,
				com:regInfo.com
			},
			dataType: 'json',
			type: 'post',
			timeout: 3000,
			success: function(data) {
				if(data.status != 'success') return callback("注册失败 用户重复");
				else {
					users = [];
					users.push(regInfo);
					localStorage.setItem('$user', JSON.stringify(users));
					return callback();
				}
			},
			error: function(xhr, type, errThrown) {
				alert('something wrong with the server...');
			}
		});

		//ensure that there is only one account which is the one that user aregistered
		//		users.clear();

	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));