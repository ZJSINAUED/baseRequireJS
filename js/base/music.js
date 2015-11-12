define(function(){
	var music = function(url,params,pos){
		var audioStatus = false,  //音频播放状态
			audioElement,  //音频元素
			iconElement,  //播放图标元素
			playIcon,
			initFlag,  //初始化播放标记
			eventName = "ontouchend" in document ? "touchstart" : "click",
			options = {},
			defaultOptions = {
				on:'http://zj.sinaimg.cn/zj_2015/summerholiday2015/images/music_on.png',
				off:'http://zj.sinaimg.cn/zj_2015/summerholiday2015/images/music_off.png',
				w:90,
				h:90,
				size:46
			}
		params = params || {};
		pos = pos || {};
		
		for (var key in defaultOptions) {
			options[key] = params[key] || defaultOptions[key];
		}
		createHTML(options,pos);
		createAudio(url);
		
		iconElement.addEventListener(eventName,_play,false);   //绑定icon音乐开关事件
		document.addEventListener(eventName,checkPlay,false);  //绑定事件触发播放
		
		/**
		 * 创建icon结构
		**/
		function createHTML(opt,pos){
			var posStr = '',htmlStr = '';
			
			for (var key in pos){
				posStr += key+':'+pos[key]+';'
			}
			if(posStr == ''){posStr = 'left:0;top:0;';}
			
			htmlStr='<style>.musiccontrol{position: absolute;width: '+opt.w+'px;height: '+opt.h+'px;z-index: 20;'+posStr+'}#musicPlay.off {background: url('+opt.off+') no-repeat center center;background-size: '+opt.size+'px;}#musicPlay.on {background: url('+opt.on+') no-repeat center center;background-size: '+opt.size+'px;}</style><div id="musicPlay" class="musiccontrol off"></div>';
			iconElement = document.createElement('div');
			iconElement.innerHTML = htmlStr;
			document.body.appendChild(iconElement);
			playIcon = document.getElementById('musicPlay');
		}
		
		/**
		 * 自动播放事件
		**/
		function setState(){
			if (audioStatus){
				return;
			}else{
				audioStatus = true;
				initFlag = true;
				playIcon.className = 'musiccontrol on';
				audioElement.removeEventListener("playing",setState,false)
			}
		}
		
		function createAudio(url){
			audioElement = document.createElement("audio");
			audioElement.src = url;
			audioElement.loop = 'loop';
			audioElement.play();
			audioElement.addEventListener("playing",setState,false);
		}
		
		/**
		 * 无法自动播放情况处理
		**/
		function checkPlay(){
			if (initFlag){
				document.removeEventListener(eventName,checkPlay,false);
			}else{
				initFlag = true;
				_play();
			}
		}
		
		function _play(){
			if (audioStatus){
				audioStatus = false;
				audioElement.pause();
				audioElement.currentTime = 0.0;
				playIcon.className = 'musiccontrol off';
			}else{
				audioStatus = true;
				audioElement.play();
				playIcon.className = 'musiccontrol on';
			}
		}
	}
	return music;
})