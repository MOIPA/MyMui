
var urlreg = 'http://39.108.159.175/phpworkplace/mui/login/reg.php';
var urlregCom = 'http://39.108.159.175/phpworkplace/mui/login/regCom.php';
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
//					alert("seting");
					var userinfo = JSON.parse(data.uinfo);
//					alert(userinfo.aid);
					loginInfo.aid = userinfo.aid;
					users = [];
					loginInfo.loginstatus = 'online';
					loginInfo.name = userinfo.name;
					loginInfo.age = userinfo.age;
					loginInfo.sex = userinfo.sex;
					loginInfo.com=userinfo.com;
					loginInfo.identity = userinfo.identity;
//					loginInfo.notifyNum = 0;
//					alert(loginInfo.identity);
					users.push(loginInfo);
					localStorage.setItem('user', JSON.stringify(users));
//					users = localStorage.getItem('user');
//					var au = JSON.parse(localStorage.getItem('user'));
//					alert(au.length+" : "+users);


					return owner.createState(loginInfo.account, callback);
				}
			},
			error: function(xhr, type, errThrown) {
//				alert('请检查网络连接');
				return owner.createState(loginInfo.account, callback);
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
		var users = JSON.parse(localStorage.getItem('$user') || '[]');
		//start server connection

		mui.ajax(urlreg, {
			data: {
				account: regInfo.account,
				password: regInfo.password,
				email: regInfo.email,
				cid:regInfo.cid,
				identity:regInfo.identity
			},
			dataType: 'json',
			type: 'post',
			timeout: 3000,
			success: function(data) {
				if(data.status != 'success') return callback("注册失败 用户重复");
				else {
					users = [];
					regInfo.aid=data.aid;
					users.push(regInfo);
					localStorage.setItem('$user', JSON.stringify(users));
					return callback(new Number(data.aid));
				}
			},
			error: function(xhr, type, errThrown) {
				alert('something wrong with the server...');
			}
		});

		//ensure that there is only one account which is the one that user aregistered
		//		users.clear();

	};
	
	//注册社区成为管理员
	owner.regCom = function(regInfo, callback) {
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
		if(regInfo.cname.length<1) {
//			alert(regInfo.identity+"  "+regInfo.cname+"  "+regInfo.cname.length);
			return callback('请输入完整社区名');
		}
		var users = JSON.parse(localStorage.getItem('$user') || '[]');
		//start server connection

		mui.ajax(urlregCom, {
			data: {
				account: regInfo.account,
				password: regInfo.password,
				email: regInfo.email,
				cname:regInfo.cname,
				identity:regInfo.identity
			},
			dataType: 'json',
			type: 'post',
			timeout: 3000,
			success: function(data) {
				if(data.status != 'success') return callback(data);
				else {
					users = [];
					regInfo.aid=data.aid;
					users.push(regInfo);
					localStorage.setItem('$user', JSON.stringify(users));
					return callback(new Number(data.aid));
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
	owner.getUserState = function() {
		var stateText =JSON.parse(localStorage.getItem('user'));
		return stateText[0].loginstatus;
	};
	owner.getUserCom = function() {
		var stateText =JSON.parse(localStorage.getItem('user'));
		return stateText[0].com;
	};
	owner.getUserIden = function() {
		var stateText =JSON.parse(localStorage.getItem('user'));
		return stateText[0].identity;
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