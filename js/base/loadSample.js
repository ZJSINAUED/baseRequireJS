/**
 * author ClarkXia
 * createTime 20151021
 */
define(function(){
	//参数初始化
	var exports = {},
		numberList = new Array([1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1], [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1], [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1], [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1], [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]),  //canvas数字点阵
		canvas = document.createElement("canvas"),  //canvas主画布
		ctx = canvas.getContext('2d'),
		maskCanvas = document.createElement('canvas'),  //canvas遮罩缓存
		maskContext = maskCanvas.getContext('2d'),
		backgroundColor,  //背景色
		maskColor,  //遮罩颜色
		color,  //数字颜色
		step,  //每个点阵尺寸
		screenX,  //数字点阵位置偏移量
		screenY,   //数字点阵位置偏移量
		bodyWith = document.body.clientWidth || document.documentElement.clientWidth,
		bodyHeight = document.body.clientHeight || document.documentElement.clientHeight;
		canvas.width = bodyWith;
		canvas.height = bodyHeight;
		maskCanvas.width = bodyWith;
		maskCanvas.height = bodyHeight;
	function getNumber(value){   //获取数字点阵值
		return numberList[value];
	}
	/**
	 * @c 绘制画布
	 * @value 显示数字00-100
	 * @num_0 百位数点阵
	 * @num_1 十位数点阵
	 * @num_2 个位数点阵
	 * @color 绘制的颜色
	 **/
	function drawNum(c,value,num_0,num_1,num_2,color){
		c.clearRect(0,0,canvas.width,canvas.height);
		c.save();
		c.beginPath();
		c.fillStyle = backgroundColor;
		c.fillRect(0,0,canvas.width,canvas.height);
		c.closePath();
		c.beginPath();
		c.fillStyle = color;
		if (value >= 100) {
			for (i = 0; i < num_0.length; i++) {
				if (num_0[i] == 0) continue;
				c.rect(screenX + Math.floor(i % 3) * step - step * 2, screenY + Math.floor(i / 3) * step, step, step);
			}
		}
		for (i = 0; i < num_1.length; i++) {
			if (num_1[i] == 0) continue;
			c.rect(screenX + step + Math.floor(i % 3) * step, screenY + Math.floor(i / 3) * step, step, step);//数字间隔1个step
		}
		for (i = 0; i < num_2.length; i++) {
			if (num_2[i] == 0) continue;
			c.rect(screenX  + Math.floor(i % 3) * step + step * 5, screenY + Math.floor(i / 3) * step, step, step);
		}
		
		//绘制百分号
		c.moveTo(screenX + step + step * 9.7, screenY);
		c.lineTo(screenX + step + step * 10.5, screenY);
		c.lineTo(screenX + step + step * 9.3, screenY + step * 5);
		c.lineTo(screenX + step + step * 8.5, screenY + step * 5);
		c.lineTo(screenX + step + step * 9.7, screenY);
		
		c.moveTo(screenX + step + step * 8.5, screenY + step);
		c.arc(screenX + step + step * 8.5, screenY + step, step * 0.6, 0, 360 + Math.PI / 180);
		c.moveTo(screenX + step + step * 10.5, screenY + step * 4);
		c.arc(screenX + step + step * 10.5, screenY + step * 4, step * 0.6, 0, 360 + Math.PI / 180);
		
		c.fill();
		c.restore();
	}
	
	exports.setProgress = function(value){
		var num_0 = "",
		num_1, num_2, i;
		
		if (value >= 100) {
			num_0 = getNumber(1);
			num_1 = getNumber(0);
			num_2 = getNumber(0);
		} else if (value >= 10) {
			num_1 = getNumber(Math.floor(value / 10));
			num_2 = getNumber(value % 10);
		} else {
			num_1 = getNumber(0);
			num_2 = getNumber(value);
		}
		
		drawNum(ctx,value,num_0,num_1,num_2,color);
		drawNum(maskContext,value,num_0,num_1,num_2,maskColor);
		var offsetY = screenY + step * 5 * (100 - value) * 0.01;  //遮罩偏移量
		var imgData = maskContext.getImageData(0,offsetY,canvas.width,canvas.height - offsetY);
		ctx.putImageData(imgData,0,offsetY);
	}
	
	exports.init = function(params){
		params = params || {};
		backgroundColor = params.bgColor || "#000000";  
		maskColor = params.maskColor || "#aaaaaa";  
		color = params.textColor || "#ffffff";
		step = params.step || canvas.width * 0.5 / 15;  
		screenX = (canvas.width - step * 13) / 2;  
		screenY = (canvas.height - step * 5) / 2;  
		document.body.appendChild(canvas);
		exports.setProgress(0);
	}
	
	exports.remove = function(){
		document.body.removeChild(canvas);
	}
	return exports;
})