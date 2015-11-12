/**
 * @params {ctx} 画布环境
 * @params {spriteSheet} 基于SpriteSheet输出的帧动画数据
 * @params {frameOrAnimation} 开始运行的动画片段，存在于SpriteSheet的_animations列表中
 *
 **/
define(function(){

function Sprite(ctx, spriteSheet, frameOrAnimation) {
	if (ctx == null){return;}
	this.ctx = ctx;
	
	/**
	 * public
	 **/
	//current frame index 
	this.currentFrame = 0;
	//current animation
	this.currentAnimation = null;
	//pause flag
	this.paused = true;
	//SpriteSheet data
	this.spriteSheet = spriteSheet;
	//current frame index，根据canvas渲染间隔记录的帧数 肯能非整数
	this.currentAnimationFrame = 0;
	//每秒帧数
	this.framerate = 0;
	
	/**
	 * private
	 **/
	this._animation = null;
	this._currentFrame = null;
	
	/**
	 * 指定播放动画，则立即调用gotoAndPlay，否则需另外调用
	 **/
	if (frameOrAnimation) { this.gotoAndPlay(frameOrAnimation); }
}
var p = Sprite.prototype;
/**
 * 绘制当前帧
 **/
p.draw = function() {
	var o = this.spriteSheet.getFrame(this._currentFrame|0);
	if (!o) { return false; }
	var rect = o.rect;
	if (rect.width && rect.height) { 
		this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
		this.ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height); 
	}
	return true;
};
/**
 * 播放被停止的动画
 **/
p.play = function() {
	this.paused = false;
};
/**
 * 停止动画
 **/
p.stop = function() {
	this.paused = true;
};
/**
 * 播放某一段动画
 * @params {frameOrAnimation}
 **/
p.gotoAndPlay = function(frameOrAnimation) {
	this.paused = false;
	this._goto(frameOrAnimation);
};
/**
 * 初始化到某一段动画的第一帧
 * @params {frameOrAnimation}
 **/
p.gotoAndStop = function(frameOrAnimation) {
	this.paused = true;
	this._goto(frameOrAnimation);
};
/**
 * 循环调用来执行动画播放
 * @params {time} 绘制的时间间隔
 **/
p.advance = function(time) {
	//同时考虑spriteSheet所需图片是否全部 加载完成
	if (!this.paused && this.spriteSheet.complete == true) {
		var fps = this.framerate || this.spriteSheet.framerate;
		var t = (fps && time != null) ? time/(1000/fps) : 1;
		this._normalizeFrame(t);
		this.draw();
	}
};
/**
 * 判断当前播放帧的变化
 * @params {frameDelta} 根据绘制时间及每秒指定帧数得出的跳帧数
 **/
p._normalizeFrame = function(frameDelta) {
	frameDelta = frameDelta || 0;
	var animation = this._animation;
	var paused = this.paused;
	var frame = this._currentFrame;
	var l;
	if (animation) {
		var speed = animation.speed || 1;
		var animFrame = this.currentAnimationFrame;
		l = animation.frames.length;
		if (animFrame + frameDelta * speed >= l) {
			var next = animation.next;
			if (next) {
				// 播放下一段动画
				return this._goto(next, frameDelta - (l - animFrame) / speed);
			} else {
				// end.
				this.paused = true;
				animFrame = animation.frames.length - 1;
			}
		} else {
			animFrame += frameDelta * speed;
		}
		this.currentAnimationFrame = animFrame;
		this._currentFrame = animation.frames[animFrame | 0]
	} else {
		frame = (this._currentFrame += frameDelta);
		l = this.spriteSheet.getNumFrames();
		if (frame >= l && l > 0) {
			// looped.
			if ((this._currentFrame -= l) >= l) { return this._normalizeFrame(); }
			
		}
	}
	frame = this._currentFrame | 0;
	if (this.currentFrame != frame) {
		this.currentFrame = frame;
	}
};
/**
 * 播放某一段动画
 * @params {frameOrAnimation} 播放动画名称
 * @params {frame} 播放开始帧
 **/
p._goto = function(frameOrAnimation, frame) {
	this.currentAnimationFrame = 0;
	if (isNaN(frameOrAnimation)) {
		var data = this.spriteSheet.getAnimation(frameOrAnimation);
		if (data) {
			this._animation = data;
			this.currentAnimation = frameOrAnimation;
			this._normalizeFrame(frame);
		}
	} else {
		this.currentAnimation = this._animation = null;
		this._currentFrame = frameOrAnimation;
		this._normalizeFrame();
	}
};

return Sprite;
});