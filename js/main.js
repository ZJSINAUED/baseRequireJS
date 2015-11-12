require.config({
	paths: {
        zepto: 'lib/zepto.min',
		swiper: 'lib/swiper.min',
		sinaSSOManager: 'http://i.sso.sina.com.cn/js/sinaSSOManager',
		sinaSSOController: 'http://i.sso.sina.com.cn/js/ssologin',
		wx : 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
		jsonp : 'base/jsonp',
		imgLoad : 'base/imgLoad',
		music : 'base/music',
		weiboAPI : 'base/weiboAPI',
		actInterface : 'base/actInterface',
		weixinSign : 'base/weixinSign',
		loadSample : 'base/loadSample',
		SpriteSheet : 'base/SpriteSheet',
		Sprite : 'base/Sprite',
		animation : 'base/animation',
		baseTools : 'base/baseTools',
		tween : 'base/tween'
    },
	shim : {
		'zepto':{
			exports: '$'
		},
		'swiper':{
			exports : 'swiper'
		},
		'sinaSSOManager':{
			exports : 'sinaSSOManager'
		},
		'sinaSSOController':{
			deps :['sinaSSOManager'],
			exports : 'sinaSSOController'
		},
		'wx' : {
			exports : 'wx'
		}
	}
});
require(['animation','tween'],function(animation,tween){
	console.log(tween)
	var ani = new animation(document.getElementById("t"),{height:18,left:100},1500,function(){console.log("a")},tween.Bounce.easeIn);
	ani.start();
})

//帧动画使用
/*require(['SpriteSheet','Sprite'],function(SpriteSheet,Sprite){
	
	var s = new SpriteSheet({
		framerate: 12,
		"images": ["http://api.xuexinet.com/lxu/images/sprite/p1-a-0.jpg",
				   "http://api.xuexinet.com/lxu/images/sprite/p1-a-1.jpg",
				   "http://api.xuexinet.com/lxu/images/sprite/p1-a-2.jpg",
				   "http://api.xuexinet.com/lxu/images/sprite/p1-a-3.jpg"],
		"frames": [
			[0, 0, 320, 515, 0, 0, 0, "w0000"],
			[0, 515, 320, 515, 0, 0, 0, "w0001"],
			[0, 1030, 320, 515, 0, 0, 0, "w0002"],
			[320, 0, 320, 515, 0, 0, 0, "w0003"],
			[320, 515, 320, 515, 0, 0, 0, "w0004"],
			[320, 1030, 320, 515, 0, 0, 0, "w0005"],
			[640, 0, 320, 515, 0, 0, 0, "w0006"],
			[640, 515, 320, 515, 0, 0, 0, "w0007"],
			[640, 1030, 320, 515, 0, 0, 0, "w0008"],
			[960, 0, 320, 515, 0, 0, 0, "w0009"],
			[1280, 0, 320, 515, 0, 0, 0, "w0010"],
			[1600, 0, 320, 515, 0, 0, 0, "w0011"],
			[960, 515, 320, 515, 0, 0, 0, "w0012"],
			[960, 1030, 320, 515, 0, 0, 0, "w0013"],
			[1280, 515, 320, 515, 0, 0, 0, "w0014"],
			[1280, 1030, 320, 515, 0, 0, 0, "w0015"],
			[1600, 515, 320, 515, 0, 0, 0, "w0016"],
			[1600, 1030, 320, 515, 0, 0, 0, "w0017"],
			[0, 0, 320, 515, 1, 0, 0, "w0018"],
			[0, 515, 320, 515, 1, 0, 0, "w0019"],
			[0, 1030, 320, 515, 1, 0, 0, "w0020"],
			[320, 0, 320, 515, 1, 0, 0, "w0021"],
			[320, 515, 320, 515, 1, 0, 0, "w0022"],
			[320, 1030, 320, 515, 1, 0, 0, "w0023"],
			[640, 0, 320, 515, 1, 0, 0, "w0024"],
			[640, 515, 320, 515, 1, 0, 0, "w0025"],
			[640, 1030, 320, 515, 1, 0, 0, "w0026"],
			[960, 0, 320, 515, 1, 0, 0, "w0027"],
			[1280, 0, 320, 515, 1, 0, 0, "w0028"],
			[1600, 0, 320, 515, 1, 0, 0, "w0029"],
			[960, 515, 320, 515, 1, 0, 0, "w0030"],
			[960, 1030, 320, 515, 1, 0, 0, "w0031"],
			[1280, 515, 320, 515, 1, 0, 0, "w0032"],
			[1280, 1030, 320, 515, 1, 0, 0, "w0033"],
			[1600, 515, 320, 515, 1, 0, 0, "w0034"],
			[1600, 1030, 320, 515, 1, 0, 0, "w0035"],
			[0, 0, 320, 515, 2, 0, 0, "w0036"],
			[0, 515, 320, 515, 2, 0, 0, "w0037"],
			[0, 1030, 320, 515, 2, 0, 0, "w0038"],
			[320, 0, 320, 515, 2, 0, 0, "w0039"],
			[320, 515, 320, 515, 2, 0, 0, "w0040"],
			[320, 1030, 320, 515, 2, 0, 0, "w0041"],
			[640, 0, 320, 515, 2, 0, 0, "w0042"],
			[640, 515, 320, 515, 2, 0, 0, "w0043"],
			[640, 1030, 320, 515, 2, 0, 0, "w0044"],
			[960, 0, 320, 515, 2, 0, 0, "w0045"],
			[1280, 0, 320, 515, 2, 0, 0, "w0046"],
			[1600, 0, 320, 515, 2, 0, 0, "w0047"],
			[960, 515, 320, 515, 2, 0, 0, "w0048"],
			[960, 1030, 320, 515, 2, 0, 0, "w0049"],
			[1280, 515, 320, 515, 2, 0, 0, "w0050"],
			[1280, 1030, 320, 515, 2, 0, 0, "w0051"],
			[1600, 515, 320, 515, 2, 0, 0, "w0052"],
			[1600, 1030, 320, 515, 2, 0, 0, "w0053"],
			[0, 0, 320, 515, 3, 0, 0, "w0054"],
			[320, 0, 320, 515, 3, 0, 0, "w0055"],
			[640, 0, 320, 515, 3, 0, 0, "w0056"],
			[960, 0, 320, 515, 3, 0, 0, "w0057"],
			[1280, 0, 320, 515, 3, 0, 0, "w0058"],
			[1600, 0, 320, 515, 3, 0, 0, "w0059"]
		],
		"animations": {
			"animation": [0, 47, "loop"],
			"loop": [48, 59]
		}
	})

	
	var ctx = document.getElementById("test").getContext("2d");
	var f = new Sprite(ctx,s);
	f.gotoAndPlay("animation");
	var time = 100;
	
	
	//循序执行动画
	play();
	function play(){
		setTimeout(function(){
			f.advance(time);
			play();
		},time)
	}
})*/

/*require(['swiper'],function(swiper){
	
})*/
/*require(['imgLoad'],function(imgLoad){
	
})*/
/*require(['music'],function(e){
	//e("http://zj.sinaimg.cn/zj_2015/yaoshengji2015/music.mp3",{w:'90',h:'90',size:45},{left:"30px",top:"30px"});
})*/

/*require(['weiboAPI'],function(wb){
	wb.postWeibo("中文",'',function(){
		alert("中文");
	});
	wb.repostWeibo("D08F8vp3A","转发",3,function(rsp){
		console.log(rsp)
	});
})*/

/*require(['actInterface'],function(act){
	act.changeLockFlag(false);
	act.getOneWork(12341);
	act.getOneWork(12341);
	act.getRecordList({act_id:12112})
})*/

/*require(['weixinSign'],function(weixin){
	weixin.setWxShare({
		title : '姚生记#核你在一起#',
		desc : '姚生记#核你在一起#',
		link : 'http://zj.sina.com.cn/zt/yaoshengji2015/index.html',
		imgUrl : 'http://zj.sinaimg.cn/zj_2015/yaoshengji2015/images/share_pic.jpg'
	});
})*/

/*require(['sinaSSOController'],function(sinaSSOController){
	console.log(sinaSSOController.getSinaCookie());
})
*/
/*
require(['imgLoad','loadSample'],function(imgLoad,loadSample){
	loadSample.init({maskColor:"#ec5e46"});
	imgLoad.loadImageArr(["http://zj.sinaimg.cn/zj_2015/yaoshengji2015/images/ani1.png",
						"http://zj.sinaimg.cn/zj_2015/yaoshengji2015/images/mask.png"],
		function(per){
			loadSample.setProgress(per);
		}
	)
})*/
