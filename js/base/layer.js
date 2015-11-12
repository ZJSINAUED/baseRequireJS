//触屏事件
var touch = "ontouchend" in window,eventTouch = function(elem, fn){
    var move;
    elem.addEventListener('touchmove', function(){
        move = true;
    }, false);
    elem.addEventListener('touchend', function(e){
        e.preventDefault();
        move || fn.call(this, e);
        move = false;
    }, false); 
};
/**
 * layer提供基础alert,message,confirm,loading方法
 *
 **/
var layer = {
	alert : function(content,options){
		var that = this;
		options = options || {};
		var s = new structure({
			content : content,
			btn : [options.btn || "OK"],
			yes : options.yes || function(i){that.close(i);}
		});
		return index;
	},
	msg : function(content,title){
		var s = new structure({
			content : content,
			maskClose : (!!title ? false : true),
			title : title || ""
		});
		return index;
	},
	open : function(options){
		new structure(options);
		return index;
	},
	confirm : function(content,options){
		var that = this;
		options = options || {};
		btnArr = [];
		if (typeof options.btns == "object"){
			btnArr = options.btns;
		}
		
		var s = new structure({
			content : content,
			btn : [btnArr[0] || "OK",btnArr[1] || "CANCEL"],
			yes : options.yes || function(i){that.close(i);},
			no : options.no||function(){}
		});
		return index;
	},
	close : function(index){
		var container = document.getElementById(classes[0]+index);
        if(!container) return;
        container.innerHTML = '';
        document.body.removeChild(container);
	}
}
var extend = function(source,obj){
	var newobj = JSON.parse(JSON.stringify(source));
	for(var i in obj){
		newobj[i] = obj[i];
	}
	return newobj;
}
/**
 * structure 提供HTML结构
 * @params options对象
 * 		mask {Boolean} 是否生成遮罩 {String} 生成的遮罩样式
 * 		anim {Boolean} 是否添加动画类 类名：layer-anim
 * 		maskClose {Boolean} 是否点击遮罩即关闭
 * 		fixed {Boolean} 默认display样式
 * 		style {String} fixed失效是样式
 * 		top {String} fixed失效top参数，默认100
 * 		title {String} 标题 {Array} 第一项为标题 第二项为标题样式
 * 		btn {Array} 按钮名称数组
 * 		yes {Function} 第一个按钮对应回调函数
 * 		no{Function} 第二个按钮对应回调函数
 * 		success {Function} 结构生成成功回调函数
 * 		cancel {Function} 关闭弹框回调函数
 **/
var index = 0, classes = ['layer-container'],structure  = function(options){
	this.config = extend(this.config,options);
	this.create();
}

var pt = structure.prototype;

pt.config = {
	mask : true,
	maskClose : false,
	fixed : true,
	animation : true,
}

pt.create = function(){
	var that = this,config = that.config,container = document.createElement("div");
	
	that.id = container.id = classes[0] + index;
    container.setAttribute('class', classes[0] + ' ' + classes[0]+(config.type || 0));
    container.setAttribute('index', index);
	config.zIndex && (container.style.zIndex = config.zIndex);
	
	var title = (function(){
        var titleType = typeof config.title === 'object';
        return config.title
        ? '<div class="layer-title"><h3 style="'+ (titleType ? config.title[1] : '') +'">'+ (titleType ? config.title[0] : config.title)  +'</h3><button class="layer-close-icon"></button></div>'
        : '';
    }());
	var button = (function(){
        var btns = (config.btn || []).length, btndom;
        if(btns === 0 || !config.btn){
            return '';
        }
        btndom = '<span type="1">'+ config.btn[0] +'</span>'
		//仅考虑2个按钮
        if(btns === 2){
            btndom += '<span type="0">'+ config.btn[1] +'</span>';
        }
        return '<div class="layer-btn">'+ btndom + '</div>';
    }());
	
	if(!config.fixed){
        config.top = config.hasOwnProperty('top') ?  config.top : 100;
        config.style = config.style || '';
        config.style += ' top:'+ ( doc.body.scrollTop + config.top) + 'px';
    }
	
	container.innerHTML = (config.mask ? '<div '+ (typeof config.mask === 'string' ? 'style="'+ config.mask +'"' : '') +' class="layer-mask"></div>' : '')
    +'<div class="layer-main" '+ (!config.fixed ? 'style="position:static;"' : '') +'>'
        +'<div class="section">'
            +'<div class="layer-child'+ (config.className ? " "+config.className : '') + (config.anim ? ' layer-anim' : '') +'" ' + ( config.style ? 'style="'+config.style+'"' : '' ) +'>'
                + title
                +'<div class="layer-cont">'+ config.content +'</div>'
                + button
            +'</div>'
        +'</div>'
    +'</div>';
    
    
    document.body.appendChild(container);
    var elem = that.elem = container;
    config.success && config.success(container);
    
    that.__bindEvent(config, elem);
	that.index = index++;
	
}

pt.__bindEvent = function(config, elem){
    var that = this;
    
    //关闭按钮
	var closeFunc = function(){
		config.cancel && config.cancel();
		that.close(elem);
	};
    if(config.title){
        var close = elem.getElementsByClassName("layer-close-icon")[0];
        touch ? eventTouch(close,closeFunc) : close.onclick = closeFunc;
    }
    
    //确认取消
    var btnFunc = function(){
        var type = this.getAttribute('type');
        if(type == 0){
            config.no && config.no();
            that.close(elem);
        } else {
            config.yes ? config.yes(that.index) : that.close(elem);
        }
    };
    if(config.btn){
        var btns = elem.getElementsByClassName("layer-btn")[0].children, btnlen = btns.length;
        for(var i = 0; i < btnlen; i++){
			touch ? eventTouch(btns[i],btnFunc) : btns[i].onclick = btnFunc;
        }
    }
    //点遮罩关闭
    if(config.mask && config.maskClose){
        var mask = elem.getElementsByClassName("layer-mask")[0];
		touch ? eventTouch(mask,closeFunc) : mask.onclick = closeFunc;
    }
};

pt.close = function(elem){
	elem.innerHTML = '';
	document.body.removeChild(elem);
}
