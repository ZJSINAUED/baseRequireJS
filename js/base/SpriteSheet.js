/**
 * 组织帧动画数据
 * @params {data} 对象解析主要包括images、frames、animations，
 * images: ["path/image2.png", "path/image2.png"] 图片数组，也可以是img对象数组
 * frames: {width:64, height:64, count:20, regX: 32, regY:64, spacing:0, margin:0}  //自动计算帧动画位置
 * frames: [
 * 		// x, y, width, height, imageIndex*, regX*, regY*
 * 		[64, 0, 96, 64],
 * 		[0, 0, 64, 64, 1, 32, 32]
 * 		// etc.
 * ]
 * animations: {sit: 7}  //动画单帧
 * animations: {
 * 		// start, end, next*, speed*
 * 		run: [0, 8],
 * 		jump: [9, 12, "run", 2]
 * }
 * animations: {
 * 		walk: {
 * 			frames: [1,2,3,3,2,1]
 * 		},
 * 		shoot: {
 * 			frames: [1,4,5,6],
 * 			next: "walk",
 * 			speed: 0.5
 * 		}
 * }
 **/
define(function(){
 
function SpriteSheet(data){
	
	this.complete = false;
	
	this.framerate = 0;
	this._animations = null;
	this._frames = null;
	this._images = null;
	this._data = null;
	this._loadCount = 0;
	
	//比特图参数
	this._frameHeight = 0;
	this._frameWidth = 0;
	this._numFrames = 0;
	this._regX = 0;
	this._regY = 0;
	this._spacing = 0;
	this._margin = 0;
	
	//载入数据
	this._parseData(data);
}

var p = SpriteSheet.prototype;

p.getAnimations = function() {
	return this._animations.slice();
};
//通过设置get方法来默认获取animations的值
try {
	Object.defineProperties(p, {
		animations: { get: p.getAnimations }
	});
} catch (e) {}

p.getNumFrames = function(animation) {
	if (animation == null) {
		return this._frames ? this._frames.length : this._numFrames || 0;
	} else {
		var data = this._data[animation];
		if (data == null) { return 0; }
		else { return data.frames.length; }
	}
};

p.getAnimation = function(name) {
	return this._data[name];
};

p.getFrame = function(frameIndex) {
	var frame;
	if (this._frames && (frame=this._frames[frameIndex])) { return frame; }
	return null;
};

p.getFrameBounds = function(frameIndex, rectangle) {
	var frame = this.getFrame(frameIndex);
	return frame ? (rectangle||new Rectangle()).setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null;
};
/**
 * 解析数据
 * @params {data} 
 **/
p._parseData = function(data) {
	var i,l,o,a;
	if (data == null) { return; }

	this.framerate = data.framerate||0;

	// parse images:
	if (data.images && (l=data.images.length) > 0) {
		a = this._images = [];
		for (i=0; i<l; i++) {
			var img = data.images[i];
			if (typeof img == "string") {
				var src = img;
				img = document.createElement("img");
				img.src = src;
			}
			a.push(img);
			if (!img.getContext && !img.complete) {
				this._loadCount++;
				this.complete = false;
				(function(o) { img.onload = function() { o._handleImageLoad(); } })(this);
				
			}
		}
	}
	
	// parse frames:
	if (data.frames == null) { // nothing
	} else if (data.frames instanceof Array) {
		this._frames = [];
		a = data.frames;
		for (i=0,l=a.length;i<l;i++) {
			var arr = a[i];
			this._frames.push({image:this._images[arr[4]?arr[4]:0], rect:new Rectangle(arr[0],arr[1],arr[2],arr[3]), regX:arr[5]||0, regY:arr[6]||0 });
		}
	} else {
		o = data.frames;
		this._frameWidth = o.width;
		this._frameHeight = o.height;
		this._regX = o.regX||0;
		this._regY = o.regY||0;
		this._spacing = o.spacing||0;
		this._margin = o.margin||0;
		this._numFrames = o.count;
		if (this._loadCount == 0) {this._calculateFrames(); }
	}

	// parse animations:
	this._animations = [];
	if ((o=data.animations) != null) {
		this._data = {};
		var name;
		for (name in o) {
			var anim = {name:name};
			var obj = o[name];
			if (typeof obj == "number") { // single frame
				a = anim.frames = [obj];
			} else if (obj instanceof Array) { // simple
				if (obj.length == 1) { anim.frames = [obj[0]]; }
				else {
					anim.speed = obj[3];
					anim.next = obj[2];
					a = anim.frames = [];
					for (i=obj[0];i<=obj[1];i++) {
						a.push(i);
					}
				}
			} else { // complex
				anim.speed = obj.speed;
				anim.next = obj.next;
				var frames = obj.frames;
				a = anim.frames = (typeof frames == "number") ? [frames] : frames.slice(0);
			}
			if (anim.next === true || anim.next === undefined) { anim.next = name; } // loop
			if (anim.next === false || (a.length < 2 && anim.next == name)) { anim.next = null; } // stop
			if (!anim.speed) { anim.speed = 1; }
			this._animations.push(name);
			this._data[name] = anim;
		}
	}
};
// 图片载入完成
p._handleImageLoad = function() {
	if (--this._loadCount == 0) {
		this._calculateFrames();
		this.complete = true;
	}
};
/**
 * 自动计算帧参数
 **/
p._calculateFrames = function() {
	if (this._frames || this._frameWidth == 0) { return; }

	this._frames = [];

	var maxFrames = this._numFrames || 100000; // 限制最多帧数
	var frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
	var spacing = this._spacing, margin = this._margin;
	
	imgLoop:
	for (var i=0, imgs=this._images; i<imgs.length; i++) {
		var img = imgs[i], imgW = img.width, imgH = img.height;

		var y = margin;
		while (y <= imgH-margin-frameHeight) {
			var x = margin;
			while (x <= imgW-margin-frameWidth) {
				if (frameCount >= maxFrames) { break imgLoop; }
				frameCount++;
				this._frames.push({
						image: img,
						rect: new Rectangle(x, y, frameWidth, frameHeight),
						regX: this._regX,
						regY: this._regY
					});
				x += frameWidth+spacing;
			}
			y += frameHeight+spacing;
		}
	}
	this._numFrames = frameCount;
};

function Rectangle(x,y,w,h){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}
Rectangle.prototype.setValues = function(x,y,w,h){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}

return SpriteSheet;

});