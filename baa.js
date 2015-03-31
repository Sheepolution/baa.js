/*
BBBBBBBBBBBBBBBBB               AAA                              AAA               
B::::::::::::::::B             A:::A                            A:::A              
B::::::BBBBBB:::::B           A:::::A                          A:::::A             
BB:::::B     B:::::B         A:::::::A                        A:::::::A            
  B::::B     B:::::B        A:::::::::A                      A:::::::::A           
  B::::B     B:::::B       A:::::A:::::A                    A:::::A:::::A          
  B::::BBBBBB:::::B       A:::::A A:::::A                  A:::::A A:::::A         
  B:::::::::::::BB       A:::::A   A:::::A                A:::::A   A:::::A        
  B::::BBBBBB:::::B     A:::::A     A:::::A              A:::::A     A:::::A       
  B::::B     B:::::B   A:::::AAAAAAAAA:::::A            A:::::AAAAAAAAA:::::A      
  B::::B     B:::::B  A:::::::::::::::::::::A          A:::::::::::::::::::::A     
  B::::B     B:::::B A:::::AAAAAAAAAAAAA:::::A        A:::::AAAAAAAAAAAAA:::::A    
BB:::::BBBBBB::::::BA:::::A             A:::::A      A:::::A             A:::::A   
B:::::::::::::::::BA:::::A               A:::::A    A:::::A               A:::::A  
B::::::::::::::::BA:::::A                 A:::::A  A:::::A                 A:::::A 
BBBBBBBBBBBBBBBBBAAAAAAA                   AAAAAAAAAAAAAA                   AAAAAAA*/



//Print function like in Lua
print = function () {
	var str = ""
	for (var i = 0; i < arguments.length; i++) {
		if (i<arguments.length-1) {
			str = str + arguments[i] +", ";
		}
		else {
			str = str + arguments[i];
		}
	}
	console.log(str);
}

printf = function () {
	console.log(arguments);
}

//////////////
///CLASSIST///
//////////////

Class = {};

Class._names = ["Class"];
Class._isClass = true;

Class.extend = function (name) {
	if (typeof(name) != "string") {
		throw("Error: Missing argument name in Class.extend");
	}
	var temp = {};
	var supr = {};
	for(var key in this) {
		temp[key] = this.__clone(this[key]);
		if (typeof(this[key])=="function" && key!="__clone" && key!="isClass") {
			supr[key] = this.__clone(this[key],true);
		}
	}
	temp.super = supr;
	temp._names.push(name);
	return temp;
}


Class.new = function () {
	var self = this.__clone(this);

	if (!self.init) {
		throw(this.type() + " has no constructor");
	}

	self.init.apply(self,arguments);
	
	return self;
}


Class.implement = function (obj) {
	for(var key in obj) {
		if (this[key] == null) {
			this[key] = this.__clone(obj[key]);
		}
	}
}


Class.is = function (obj) {
	var t = typeof(obj);
	for (var i = 0; i < this._names.length; i++) {
		if ((t == "object" && this._names[i] == obj.type()) || (obj == this._names[i])) {
			return true;
		}
	}
	return false;
}


Class.type = function () {
	if (this._names[this._names.length-1].length == null) {
		throw("Add a type name! class:extend([TYPE])");
	}
	return this._names[this._names.length-1];
}

Class.__clone = function(obj,supr) {
	if (supr) {
		var _super  = function () {
			var args = Array.prototype.slice.call(arguments);
			var _this = args[0];
			args.splice(0,1);
			// _this.__superWasCalled = true;
			return obj.apply(_this,args);
		}
		return _super;
	}
	if(obj == null || typeof(obj) != "object") {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.slice(0);
	}
	var temp = obj.constructor();
	for(var key in obj) {
		if (key == "super") { continue; }
		if (key == "__clone" || key == "isClass" || key == "new") { continue; }
		temp[key] = this.__clone(obj[key],supr);
	}
	return temp;
}

Class.isClass = function (c) {
	if (c!=null) {
		if (c["_isClass"]) {
			return true;
		}
	}
	return false;
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////


var _baa_init = function () {
	baa.graphics.canvas = document.getElementById('canvas');
	baa.graphics.defaultCanvas = baa.graphics.canvas;
	baa.graphics.ctx = baa.graphics.canvas.getContext('2d');
	baa.graphics.defaultCtx = baa.graphics.ctx;

	document.addEventListener("keydown",baa.keyboard._downHandler, false);
	document.addEventListener("keyup",baa.keyboard._upHandler, false);
	document.addEventListener("mousemove",baa.mouse._move, false);
	document.addEventListener("mousedown",baa.mouse._downHandler, false);
	document.addEventListener("mouseup",baa.mouse._upHandler, false);
	document.addEventListener("mousewheel",baa.mouse._wheelHandler, false);
}

baa = {};
baa._typesafe = true;

baa._checkType = function () {
	if (!this._typesafe) { return };
	var name = arguments[0];
	var obj = arguments[1];

	str = ""
	var type = obj == null ? null : typeof(obj);
	var clss =  Class.isClass(obj);
	for (var i = 2; i < arguments.length; i++) {
		
		str = str + arguments[i];
		if (arguments[i] == type) {
			return;
		}
		else if (clss && (obj.is(arguments[i]))) {
			return;
		}
	
		if (i != arguments.length-1) {
			str = str + ", ";
		}
	}
	throw("Wrong type '" + type + "' for " + name + ". Correct types: " + str);
}

// //Turns "images/player.png" into "player"
// baa._delDir = function (name) {
// 	var newName;
// 	name = name.substring(0, name.length - name.lastIndexOf(".") + 3);
// 	print(name);


// 	return newName
// }

baa._assetsLoaded = 0;
baa._assetsToBeLoaded = 0;

//Time

baa.timestamp = function () {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

baa.time = {now:0,dt:0,last:0};
baa.time.last = baa.timestamp();

////////////////////////////////
///////////////////////////////




//Point
//////////////////////////////////

baa.point = Class.extend("baa.point");

baa.point.init = function (x,y) {
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);
	
	this.x = x || 0;
	this.y = y == null ? this.x : y;
}

baa.point.set = function (x,y) {
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);

	this.x = x || 0;
	this.y = y == null ? this.x : y;
}

baa.point.clone = function (p) {
	baa._checkType("point",p,"baa.point");

	this.x = p.x;
	this.y = p.y;
}

baa.point.overlaps = function (r) {
	baa._checkType("rectangle",r,"baa.rect");
	return r.x + r.width > this.x && r.x < this.x
		&& r.y + r.height > this.y && r.y < this.y;
}

//Rect
//////////////////////////////////

baa.rect = baa.point.extend("baa.rect");

baa.rect.init = function (x,y,width,height) {
	baa.rect.super.init(this,x,y);
	baa._checkType("width",width,"number",null);
	baa._checkType("height",height,"number",null);

	this.width = width || 0;
	this.height = height == null ? this.width : height;
	this.color;
}

baa.rect.draw = function (mode,r) {
	if (this.color) {
		baa.graphics.setColor(this.color);
	}
	baa.graphics.rectangle(mode || "fill",this.x,this.y,this.width,this.height,r);
}


baa.rect.set = function (x,y,width,height) {
	baa.rect.super.init(x,y);
	baa._checkType("width",width,"number",null);
	baa._checkType("height",height,"number",null);

	this.x = x;
	this.y = y == null ? this.x : y;
	this.width = width;
	this.height = height == null ? width : height;
}

baa.rect.clone = function (r) {
	baa._checkType("rect",r,"baa.rect");

	this.x = r.x;
	this.y = r.y;
	this.width = r.width;
	this.height = r.height;
}

baa.rect.left = function (v) {
	baa._checkType("x",v,"number",null);

	if (v!=null) { this.x = v; }
	return this.x;
}

baa.rect.right = function (v) {
	baa._checkType("x",v,"number",null);

	if (v!=null) { this.x = v - this.width};
	return this.x + this.width;
}

baa.rect.top = function (v) {
	baa._checkType("y",v,"number",null);

	if (v!=null) { this.y = v; }
	return this.y;
}

baa.rect.bottom = function (v) {
	baa._checkType("y",v,"number",null);

	if (v!=null) { this.y = v - this.height};
	return this.y + this.height;
}

baa.rect.xCenter = function (v) {
	baa._checkType("x",v,"number",null);

	if (v!=null) { this.x = v - this.width/2 };
	return this.x + this.width/2;
}

baa.rect.yCenter = function (v) {
	baa._checkType("y",v,"number",null);

	if (v!=null) { this.y = v - this.height/2 };
	return this.y + this.height/2;
}

baa.rect.overlaps = function (r) {
	baa._checkType("rect",r,"baa.rect","baa.point");
	return this.x + this.width > r.x && this.x < r.x + (r.width || 0) 
		&& this.y + this.height > r.y && this.y < r.y + (r.height || 0) ;
}

baa.rect.overlapsX = function (r) {
	baa._checkType("rect",r,"baa.rect","baa.point");

	return this.x + this.width > r.x && this.x < r.x + r.width;
}

baa.rect.overlapsY = function (r) {
	baa._checkType("rect",r,"baa.rect","baa.point");

	return this.y + this.height > r.y && this.y < r.y + r.height;
}

//Sprite
//////////////////////////////

baa.sprite = baa.rect.extend("baa.sprite");

baa.sprite.init = function (x,y) {
	baa.sprite.super.init(this,x,y);
	this.origin = baa.point.new(0,0);
	this.offset = baa.point.new(0,0);
	this.scale = baa.point.new(1,1);
	this.alpha = 1;
	this.rotation = 0;
	this.flip = false;

	this.image;
	this.frames = [];
	this.animations = {}
	this.frameTimer = 1;
	this.frameTimerDir = 1;
	this.currentFrame = 1;
	this.currentAnim = "idle";
	this.animPlaying = true;
	this.animEnded = false;
}

baa.sprite.update = function () {
	this.animate()
}

baa.sprite.draw = function () {
	if (this.image) {
		baa.graphics.setAlpha(this.alpha);
		this.image.draw(this.frames[this.currentFrame-1],
		this.x+this.offset.x + this.origin.x,this.y+this.offset.y + this.origin.y,
		this.rotation,this.scale.x,this.scale.y,this.origin.x,this.origin.y)
		baa.graphics.setAlpha(1);
	}
}

baa.sprite.centerOrigin = function () {
	this.origin.x = this.width/2;
	this.origin.y = this.height/2;
}

baa.sprite.setImage = function (url,width,height,smooth) {
	this.image = baa.graphics.newImage(url,smooth);
	this.width = width || this.image.getWidth();
	this.height = height || this.image.getHeight();
	this.frames = [];
	for (var i=0; i < this.image.getHeight()/this.height; i++) {
		for (var j=0; j < this.image.getWidth()/this.width; j++) {
			this.frames.push({x:j*this.width,y:i*this.height,width:this.width,height:this.height});
		}
	}
	this.centerOrigin();
}

baa.sprite.addAnimation = function (name,start,finish,speed,mode,semi) {
	this.animations[name] = {};
	var obj = this.animations[name];
	obj.start = start;
	obj.finish = finish;
	obj.speed = speed || 15;
	obj.mode = mode || "loop";
	if (semi==null) {
		obj.semi = start;
	}
	else {
		this.animations[name].hasSemi = true;
		this.animations[name].semi = semi;
	}
		
}

baa.sprite.setAnimation = function (anim) {
	if (this.currentAnim != anim) {
		this.currentAnim = anim;
		this.animEnded = false;
		this.currentAnim = this.anim;
		this.frameTimer = this.anims[this.anim].start;
		this.frameTimerDir = this.anims[this.anim].direction;
	}
}

baa.sprite.animate = function () {
	if (this.animPlaying) {
		if (this.animations.hasOwnProperty(this.currentAnim)) {
			var anim = this.animations[this.currentAnim];
			if (anim.start == anim.finish) {
				this.frameTimer = anim.start;
				this.frame = this.frameTimer;
				return;
			}
			if (typeof(anim.speed) == "number") {
				this.frameTimer += dt * anim.speed * this.frameTimerDir;
			}
			else {
				this.frameTimer += dt * anim.speed[this.frame] * this.frameTimerDir;
			}
			if (this.frameTimer > anim.finish+1 || this.frameTimer < anim.start) {
				if (anim.mode == "loop") {
					this.frameTimer = anim.semi;
					if (anim.hasSemi) {
						this.animEnded = true;
					}
				}
				else if (anim.mode == "once") {
					this.frameTimer = anim.finish;
					this.animPlaying = false;
					this.animEnded = true;
				}
				else if (anim.mode == "pingpong") {
					this.frameTimer = this.frameTimeDir > 0 ? anim.finish : anim.start;
					this.frameTimerDir = -this.frameTimerDir;
				}
			}
			this.currentFrame = Math.floor(this.frameTimer);
		}
	}
}

baa.sprite.playAnimation = function () {
	this.animPlaying = true;
}

baa.sprite.pauseAnimation = function () {
	this.animPlaying = false;
}

baa.sprite.stopAnimation = function () {
	this.animPlaying = false;
	this.setFrame(1);
	this.animEnded = false;
}

baa.sprite.replayAnimation = function () {
	this.animPlaying = true;
	this.setFrame(1);
	this.animEnded = false;
}

baa.sprite.hasAnimationEnded = function () {
	return this.animEnded;
}

baa.sprite.isAnimationPlaying = function () {
	return this.animPlaying;
}

baa.sprite.getAnimationFrame = function () {
	return this.frame - this.anims[this.currentAnim].start+1;
}

baa.sprite.setAnimationFrame = function (f) {
	var anim = this.animations[this.currentAnim];
	if (anim.finish - anim.start < f) {
		throw("There are only " + anim.finish - anim.start + " frames. Not " + f);
	}
	this.frame = anim.start + f;
	this.frameTimer = this.frame;
}


//Entity
//////////////////////////////

baa.entity = baa.sprite.extend("baa.entity");

baa.entity.init = function (x,y,w,h) {
	baa.entity.super.init(this,x,y,w,h);
	this.last = baa.rect.new(x,y,w,h);
	this.velocity = baa.point.new();
	this.maxVelocity = baa.point.new(99999,99999);
	this.accel = baa.point.new();
	this.drag = baa.point.new();
	this.bounce = baa.point.new();


	this.separatePriority = 0;
	this.solid = true;
	this.dead = false;

	this.once = baa.once.new(this);
}

baa.entity.update = function () {
	baa.entity.super.update(this);
	this.updateMovement();
}

baa.entity.draw = function () {
	baa.entity.super.draw(this);
	if (baa.debug && baa.debug.active) {
		this.drawDebug();
	}

}

baa.entity.drawDebug = function () {
	baa.graphics.setAlpha(0.5);
	baa.graphics.setColor(100,255,0);
	baa.graphics.setLineWidth(0.5);
	baa.graphics.rectangle("line",this.last.x,this.last.y,this.last.width,this.last.height);

	baa.graphics.setAlpha(1);
	baa.graphics.setColor(255,0,0);
	baa.graphics.rectangle("line",this.x,this.y,this.width,this.height);
}

baa.entity.updateMovement = function () {
	this.last.clone(this);

	this.velocity.x += this.accel.x * dt;
	if (Math.abs(this.velocity.x) > this.maxVelocity.x) {
		this.velocity.x = this.maxVelocity.x * (this.velocity.x > 0 ? 1 : -1);
	}
	this.x += this.velocity.x * dt;
	if (this.accel.x == 0 && this.velocity.x != 0 && this.drag.x != 0) {
		if (this.drag.x * dt > Math.abs(this.velocity.x)) {
			this.velocity.x = 0;
		}
		else {
			this.velocity.x += this.drag.x * dt * (this.velocity.x>0 ? -1 : 1);
		}
	}

	this.velocity.y += this.accel.y * dt;

	if (Math.abs(this.velocity.y) > this.maxVelocity.y) {
		this.velocity.y = this.maxVelocity.y * (this.velocity.y > 0 ? 1 : -1);
	}

	this.y += this.velocity.y * dt;

	if (this.accel.y == 0 && this.velocity.y != 0 && this.drag.y != 0) {
		if (this.drag.y * dt > Math.abs(this.velocity.y)) {
			this.velocity.y = 0;
		}
		else {
			this.velocity.y += this.drag.y * dt * (this.velocity.y>0 ? -1 : 1);
		}
	}
}

baa.entity.resolveCollision = function (e) {
	if (this.overlaps(e)) {
		this.onOverlap(e);
	}
}

baa.entity.overlaps = function (e) {
	return this!= e && !this.dead && !e.dead && baa.entity.super.overlaps(this,e);
}

baa.entity.onOverlap = function (e) {
	// if (this.solid && e.solid && this.separatePriority != e.separatePriority) {
	if (this.solid && e.solid) {
		this.separate(e);
		return true;
	} 
}

baa.entity.separate = function (e) {
	this.separateAxis(e, this.last.overlapsY(e.last) ? "x" : "y");
}

baa.entity.separateAxis = function (e, a) {
	var s = (a == "x") ? "width" : "height";
	if (this.separatePriority >= e.separatePriority) {
		if ((e.last[a] + e.last[s] / 2) < (this.last[a] + this.last[s] / 2)) {
			e[a] = this[a] - e[s];
		}
		else {
			e[a] = this[a] + this[s];
		}
		e.velocity[a] = e.velocity[a] * -e.bounce[a];
	}
	else {
		e.separateAxis(this, a);
	}
}




///////////////////////////////
///////////////////////////////

//Graphics
baa.graphics = {};
baa.graphics.defaultCtx;
baa.graphics.defaultCanvas;
baa.graphics.defaultSmooth = false;
baa.graphics.currentCanvas;
baa.graphics._images = {};
baa.graphics.color = {r:255,g:255,b:255,a:255};
baa.graphics.backgroundColor = {r:0,g:0,b:0};
baa.graphics.pointSize = 1;
baa.graphics.currentFont;
baa.graphics.width;
baa.graphics.height;

baa.graphics.preload = function () {
	var ext = "." + arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var name = arguments[i];
		var img;
		img = new Image();
		img.onload = function(){
			baa._assetsLoaded++;
		}
		img.src = "images/" + name + ext;
		this._images[name] = img;
		baa._assetsToBeLoaded++;
		
	};
}

//Drawing functions

baa.graphics.rectangle = function (mode,x,y,w,h,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number","baa.rect");
	baa._checkType("y",y,"number",null);
	baa._checkType("width",w,"number",null);
	baa._checkType("height",h,"number",null);
	baa._checkType("rounding",r,"number",null);

	if (Class.isClass(x) && x.is(baa.rect)) {
		r = y;
		y = x.y;
		w = x.width;
		h = x.height;
		x = x.x;
	}

	if (r==null) {
		this.ctx.beginPath();
		h = h==null ? w : h;
		this.ctx.rect(x,y,w,h);
		this._mode(mode);
	}
	else {
		r = Math.min(7,Math.max(0,r));
		r*=Math.min(w/25,h/25);
		x += r;
		w -= r*2;
		y += r;
		h -= r*2;
		this.ctx.beginPath();
		this.ctx.moveTo(x+r, y-r);
		this.ctx.lineTo(x+w-r, y-r);
		this.ctx.quadraticCurveTo(x+w+r, y-r, x+w+r, y+r);
		this.ctx.lineTo(x+w+r, y+h-r);
		this.ctx.quadraticCurveTo(x+w+r, y+h+r, x+w-r, y+h+r);
		this.ctx.lineTo(x+r, y+h+r);
		this.ctx.quadraticCurveTo(x-r, y+h+r, x-r, y+h-r);
		this.ctx.lineTo(x-r, y+r);
		this.ctx.quadraticCurveTo(x-r, y-r, x+r, y-r);
		this._mode(mode);
	}
}

baa.graphics.circle = function (mode,x,y,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r",r,"number");

	this.ctx.beginPath();
	this.ctx.arc(x,y,Math.abs(r),0,2*Math.PI);
	this._mode(mode)
	this.ctx.closePath();
}

baa.graphics.convex = function (mode,x,y,r,p) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r",r,"number");
	baa._checkType("p",p,"number");

	p = Math.max(3,p);
	this.ctx.beginPath();
	for (var i = 0; i < p; i++) {
		this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI)*r,
						y+Math.sin((i*(360/p))/180 *Math.PI)*r);
	}
	this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI)*r,
					y+Math.sin((i*(360/p))/180 *Math.PI)*r);
	this._mode(mode);
}

baa.graphics.star = function (mode,x,y,r1,r2,p) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r1",r1,"number");
	baa._checkType("r2",r2,"number");
	baa._checkType("p",p,"number");

	p = Math.max(3,p);
	this.ctx.beginPath();
	for (var i = 0; i < p; i++) {
		this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI)*r1,
						y+Math.sin((i*(360/p))/180 *Math.PI)*r1);

		this.ctx.lineTo(x+Math.cos((i*(360/p)+(180/p))/180 *Math.PI)*r2,
						y+Math.sin((i*(360/p)+(180/p))/180 *Math.PI)*r2)

	}
	this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI)*r1,
					y+Math.sin((i*(360/p))/180 *Math.PI)*r1);

	this._mode(mode);
}

baa.graphics.arc = function (mode,x,y,r,a1,a2) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r",r,"number");
	baa._checkType("a1",a1,"number");
	baa._checkType("a2",a2,"number");

	this.ctx.beginPath();
	this.ctx.lineTo(x,y);
	this.ctx.arc(x,y,Math.abs(r),a1,a2);
	this.ctx.lineTo(x,y);
	this._mode(mode);
}


baa.graphics.line = function () {

	this.ctx.beginPath();
	if (typeof(arguments[0]) == "object") {
		var verts = arguments[0];

		baa._checkType("verts",verts[0],"number",null);
		baa._checkType("verts",verts[1],"number",null);
	
		this.ctx.moveTo(verts[0],verts[1]);
		for (var i = 0; i < verts.length-2; i+=2) {
		
			baa._checkType("verts",verts[i+2],"number",null);
			baa._checkType("verts",verts[i+3],"number",null);
		
			this.ctx.lineTo(verts[i+2],verts[i+3]);
		};
		
	}
	else {
		baa._checkType("verts",arguments[0],"number",null);
		baa._checkType("verts",arguments[1],"number",null);
		
		this.ctx.moveTo(arguments[0],arguments[1]);
		for (var i = 0; i < arguments.length-2; i+=2) {

			baa._checkType("verts",arguments[i+2],"number",null);
			baa._checkType("verts",arguments[i+3],"number",null);
		
			this.ctx.lineTo(arguments[i+2],arguments[i+3]);
		};
	}
	this.ctx.stroke();
}

baa.graphics.polygon = function (mode) {
	baa._checkType("mode",mode,"string");
	this.ctx.beginPath();
	if (typeof(arguments[1]) == "object") {
		var verts = arguments[1];

		baa._checkType("verts",verts[1],"number",null);
		baa._checkType("verts",verts[2],"number",null);
	
		this.ctx.moveTo(verts[1],verts[2]);
		for (var i = 1; i < verts.length-2; i+=2) {
		
			baa._checkType("verts",verts[i+2],"number",null);
			baa._checkType("verts",verts[i+3],"number",null);
		
			this.ctx.lineTo(verts[i+2],verts[i+3]);
		};
		
	}
	else {
		baa._checkType("verts",arguments[1],"number",null);
		baa._checkType("verts",arguments[2],"number",null);
		
		this.ctx.moveTo(arguments[1],arguments[2]);
		for (var i = 0; i < arguments.length-2; i+=2) {

			baa._checkType("verts",arguments[i+2],"number",null);
			baa._checkType("verts",arguments[i+3],"number",null);
		
			this.ctx.lineTo(arguments[i+2],arguments[i+3]);
		};
	}
	this.ctx.closePath();
	this._mode(mode);
}

baa.graphics.clear = function () {
	this.ctx.fillStyle = this._rgb(this.backgroundColor.r,this.backgroundColor.b,this.backgroundColor.g);
	this._background();
	this.ctx.fillStyle = this._rgb(this.color.r,this.color.b,this.color.g);
}

baa.graphics.print = function (t,align,limit,x,y,r,sx,sy,ox,oy,kx,ky) {
	if (typeof(align) == "number") {
		this._print(t,"left",align,limit,x,y,r,sx,sy,ox,oy)
	}
	else {
		this._print(t,align,x,y,r,sx,sy,ox,oy,kx,ky,limit);
	}
}

baa.graphics._print = function (t,align,x,y,r,sx,sy,ox,oy,kx,ky,limit) {
	baa._checkType("text",t,"string","number",null);
	baa._checkType("align",align,"string",null);
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);
	baa._checkType("r",r,"number",null);
	baa._checkType("sx",sx,"number",null);
	baa._checkType("sy",sy,"number",null);
	baa._checkType("ox",ox,"number",null);
	baa._checkType("oy",oy,"number",null);
	baa._checkType("kx",kx,"number",null);
	baa._checkType("ky",ky,"number",null);
	baa._checkType("limit",limit,"number",null);

	x = x == null ? 0 : x;
	y = y == null ? x : y;
	r = r == null ? 0 : r;
	sx = sx == null ? 1 : sx;
	sy = sy == null ? sx : sy;
	ox = ox == null ? 0 : ox;
	oy = oy == null ? ox : oy;
	kx = kx == null ? 0 : kx;
	ky = ky == null ? kx : ky;
	this.ctx.textAlign=align;
	if (limit!=null) {
		var words = t.toString().split(' ');
		var line = '';
		for(var i = 0; i < words.length; i++) {
			var testLine = line + words[i] + ' ';
			var metrics = this.ctx.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > limit && i > 0) {
				this.ctx.save();
				this.ctx.transform(1,ky,kx,1,0,0);
				this.ctx.translate(x,y);
				this.ctx.scale(sx,sy);
				this.ctx.rotate(r);
				this.ctx.fillText(line, -ox,-oy+this.currentFont.size);
				this.ctx.restore();
				line = words[i] + ' ';
				y += this.currentFont.height+sy;
			}
			else {
				line = testLine;
			}
		}
	}
	else {
		line = t;
	}
 	this.ctx.save();
	this.ctx.transform(1,ky,kx,1,0,0);
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
  	this.ctx.fillText(line, -ox,-oy+this.currentFont.size);
	this.ctx.restore();
	this.ctx.textAlign="left";
}


baa.graphics.draw = function (img,quad,x,y,r,sx,sy,ox,oy,kx,ky) {
	

	if (typeof(quad) != "object") {
		this._draw(img,quad,x,y,r,sx,sy,ox,oy,kx,ky);
	}
	else{
		this._draw(img,x,y,r,sx,sy,ox,oy,kx,ky,quad);
	}
}

baa.graphics._draw = function (img,x,y,r,sx,sy,ox,oy,kx,ky,quad) {
	baa._checkType("image",img,"baa.graphics.image");
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);
	baa._checkType("r",r,"number",null);
	baa._checkType("sx",sx,"number",null);
	baa._checkType("sy",sy,"number",null);
	baa._checkType("ox",ox,"number",null);
	baa._checkType("oy",oy,"number",null);
	baa._checkType("kx",kx,"number",null);
	baa._checkType("ky",ky,"number",null);
	baa._checkType("quad",quad,"object",null);
	
	if (this._images[img.url]==null) {
		throw("Image doesn't exist. Did you forget to preload it?")
	}

	x = x == null ? 0 : x;
	y = y == null ? x : y;
	r = r == null ? 0 : r;
	sx = sx == null ? 1 : sx;
	sy = sy == null ? sx : sy;
	ox = ox == null ? 0 : ox;
	oy = oy == null ? ox : oy;
	kx = kx == null ? 0 : kx;
	ky = ky == null ? kx : ky;

	var smooth = img.smooth == null ? this.defaultSmooth : img.smooth;
	this.ctx.imageSmoothingEnabled = img.smooth;
	this.ctx.mozImageSmoothingEnabled = img.smooth;
	this.ctx.oImageSmoothingEnabled = img.smooth;;
	// this.ctx.webkitImageSmoothingEnabled = img.smooth;
	this.ctx.save();
	this.ctx.transform(1,ky,kx,1,0,0);
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
	if (quad) {
		this.ctx.drawImage(this._images[img.url],quad.x,quad.y,quad.width,quad.height,-ox,-oy,quad.width,quad.height);
	}
	else{
		this.ctx.drawImage(this._images[img.url],-ox,-oy);
	}
	this.ctx.restore();
	this.ctx.imageSmoothingEnabled = this.defaultFilter == "linear";
}



//image
///////////////////

baa.graphics._image = Class.extend("baa.graphics.image");

baa.graphics._image.init = function (url,smooth) {
	baa._checkType("url",url,"string");
	baa._checkType("smooth",smooth,"boolean",null);
	if (baa.graphics._images[url]==null) { throw ("Image '" + url + "' doesn't exist. Did you forgot to preload it?")}
	this.url = url;
	this.smooth = smooth;
}

baa.graphics._image.draw = function (quad,x,y,r,sx,sy,ox,oy,kx,ky) {
	baa.graphics.draw(this,quad,x,y,r,sx,sy,ox,oy,kx,ky);
}

baa.graphics._image.setSmooth = function (smooth) {
	baa._checkType("smooth",smooth,"boolean",null);
	return this.smooth = smooth;
}

baa.graphics._image.getSmooth = function () {
	return this.smooth;
}

baa.graphics._image.getWidth = function () {
	return baa.graphics._images[this.url].width;
}

baa.graphics._image.getHeight = function () {
	return baa.graphics._images[this.url].height;
}

baa.graphics.newImage = function (url,smooth) {
	return this._image.new(url, smooth);
}




//font
/////////////////

baa.graphics._font = Class.extend("baa.graphics.font");

baa.graphics._font.init = function (name,size,style,height) {
	baa._checkType("name",name,"string");
	baa._checkType("size",size,"number");
	baa._checkType("style",style,"string",null);
	baa._checkType("height",height,"number",null);

	this.name = name;
	this.size = size;
	this.style = style || "normal";
	this.height = height==null ? size*2 : height;
}

baa.graphics._font.setSize = function (size) {
	baa._checkType("size",size,"number");
	this.size = size;
	baa.graphics._resetFont();
	return this.size;
}

baa.graphics._font.getSize = function () {
	return this.size;
}

baa.graphics._font.setHeight = function (height) {
	baa._checkType("height",height,"number");
	this.height = height;
	baa.graphics._resetFont();
	return this.height;
}

baa.graphics._font.getHeight = function () {
	return this.height;
}

baa.graphics.newFont = function (name,size,style,height) {
	return this._font.new(name,size,style,height);
}


//Canvas
/////////////////

baa.graphics._canvas = Class.extend("baa.graphics.canvas");

baa.graphics._canvas.init = function (width,height,smooth) {
	baa._checkType("width",width,"number");
	baa._checkType("height",height,"number");
	baa._checkType("smooth",smooth,"boolean");

	this.drawable = document.createElement('canvas');
	this.context = this.drawable.getContext('2d');
	this.smooth = true;
	width = Math.max(0,width);
	height = Math.max(0,height);
	this.drawable.width = width;
	this.drawable.height = height;
}

baa.graphics._canvas.getWidth = function () {
	return this.drawable.width;
}

baa.graphics._canvas.getHeight = function () {
	return this.drawable.height;
}

baa.graphics._canvas.setWidth = function (width) {
	baa._checkType("width",width,"number");
	width = Math.max(0,width);
	return this.drawable.width = width;
}

baa.graphics._canvas.addWidth = function () {
//!!
}

baa.graphics._canvas.setHeight = function (height) {
	baa._checkType("height",height,"number");
	height = Math.max(0,height);
	return this.drawable.height = height;
}

baa.graphics._canvas.setSmooth = function (smooth) {
	baa._checkType("smooth",smooth,"boolean");
	return this.smooth = smooth;
}

baa.graphics._canvas.getSmooth = function () {
	return this.smooth;
}

baa.graphics.newCanvas = function (width,height) {
	return this._canvas.new(width,height);
}

////////////////


//Set functions

baa.graphics.setSmooth = function (smooth) {
	baa._checkType("smooth",smooth,"boolean");
	this.defaultSmooth = smooth;
}

baa.graphics.setColor = function (r,g,b,a) {
	if (typeof(r)=="object") {
		baa._checkType("red",r[0],"number",null);
		baa._checkType("green",r[1],"number",null);
		baa._checkType("blue",r[2],"number",null);
		baa._checkType("alpha",r[3],"number",null);
		this.color.r = r[0];
		this.color.g = r[1];
		this.color.b = r[2];
		this.color.a = r[3];
	}
	else {
		baa._checkType("red",r,"number",null);
		baa._checkType("green",g,"number",null);
		baa._checkType("blue",b,"number",null);
		baa._checkType("alpha",a,"number",null);

		this.color.r = r==null ? this.color.r : r;
		this.color.g = g==null ? this.color.g : g;
		this.color.b = b==null ? this.color.b : b;
		this.color.a = a==null ? this.color.a : a;
	}
	this.ctx.fillStyle = this._rgb(this.color.r,this.color.g,this.color.b);
	this.ctx.strokeStyle = this._rgb(this.color.r,this.color.g,this.color.b);
	this.ctx.globalAlpha = this.color.a;
}



baa.graphics.setAlpha = function (a) {
	baa._checkType("alpha",a,"number");

	this.color.a = Math.min(1,Math.max(0,a));
	return this.ctx.globalAlpha = a;
}

baa.graphics.getAlpha = function () {
	this.color.a;
}

baa.graphics.setBackgroundColor = function (r,g,b) {
	if (typeof(r)=="object") {
		baa._checkType("red",r[0],"number",null);
		baa._checkType("green",r[1],"number",null);
		baa._checkType("blue",r[2],"number",null);

		this.backgroundColor.r = r[0] || this.backgroundColor.r;
		this.backgroundColor.g = r[1] || this.backgroundColor.g;
		this.backgroundColor.b = r[2] || this.backgroundColor.b;
	}
	else {
		baa._checkType("red",r,"number",null);
		baa._checkType("green",g,"number",null);
		baa._checkType("blue",b,"number",null);

		this.backgroundColor.r = r==null ? this.backgroundColor.r : r;
		this.backgroundColor.g = g==null ? this.backgroundColor.g : g;
		this.backgroundColor.b = b==null ? this.backgroundColor.b : b;
	}
}

baa.graphics.setLineWidth = function (width) {
	baa._checkType("width",width,"number",null);

	this.ctx.lineWidth = width;
}

baa.graphics.setNewFont = function (fnt,size,style,height) {
	fnt = this.newFont(fnt,size,style,height);
	this.setFont(fnt);
	return fnt;
}

baa.graphics.setFont = function (fnt) {
	baa._checkType("font",fnt,"baa.graphics.font");

	this.currentFont = fnt;
	this.ctx.font = fnt.style + " " + fnt.size + "pt " + fnt.name;

}

baa.graphics.setBlendMode = function (mode) {
	baa._checkType("mode",mode,"string");

	this.ctx.globalCompositeOperation = mode;
}

baa.graphics.setCanvas = function (cvs) {
	baa._checkType("canvas",cvs,"baa.graphics.canvas",null);

	if (cvs==null) {
		this.ctx = this.defaultCtx;
		this.canvas = this.defaultCanvas;
		this.currentCanvas = null;
	}
	else{
		this.ctx = cvs.context;
		this.canvas = cvs.drawable;
		this.currentCanvas = cvs;
	}
}

baa.graphics.setScissor = function (x,y,w,h) {
	this.ctx.rect(x, y, w, h);
	this.ctx.clip();

}

baa.graphics.removeScissor = function () {
	this.ctx.clip();
}


//Get functions

baa.graphics.getSmooth = function () {
	return this.defaultSmooth;
}

baa.graphics.getColor = function () {
	return [this.color.r,this.color.g,this.color.b,this.color.a];
}

baa.graphics.getAlpha = function () {
	return this.color.a;
}

baa.graphics.getBackgroundColor = function () {
	return [this.backgroundColor.r,this.backgroundColor.g,this.backgroundColor.b];
}

baa.graphics.getLineWidth = function () {
	return this.ctx.lineWidth;
}

baa.graphics.getFont = function () {
	return this.font;
}

baa.graphics.getCanvas = function () {
	return this.cvs;
}

baa.graphics.getWidth = function () {
	return this.canvas.width;
}

baa.graphics.getHeight = function () {
	return this.canvas.height;
}


//Coordinate System

baa.graphics.origin = function () {
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

baa.graphics.translate = function (x,y) {
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number",null);
	y = y == null ? x : y;
	this.ctx.translate(x,y);
}

baa.graphics.rotate = function (r) {
	baa._checkType("r",r,"number");
	this.ctx.rotate(r);
}

baa.graphics.scale = function (x,y) {
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number",null);
	y = y == null ? x : y;
	this.ctx.scale(x,y);
}

baa.graphics.shear = function (x,y) {
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number",null);
	y = y == null ? x : y;
	this.ctx.transform(1,y,x,1,0,0);
}

baa.graphics.push = function () {
	this.ctx.save();
}

baa.graphics.pop = function () {
	this.ctx.restore();
}

//Utils

baa.graphics._mode = function (mode) {
	if (mode == "fill") {
		this.ctx.fill();
	}
	else if (mode == "line") {
		this.ctx.stroke();
	}
	else if (mode == "both") {
		this.ctx.fill();
		this.ctx.stroke();
	}
	else {
		throw new Error("Invalid mode " + mode);
	}
	return false;
}

baa.graphics._clearScreen = function () {
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
}

baa.graphics._background = function () {
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
}

baa.graphics._rgb = function (r,g,b) {
	var x = ((r << 16) | (g << 8) | b).toString(16);
	return "#000000".substring(0, 7 - x.length) + x;
}

baa.graphics._resetFont = function () {
	this.ctx.font = this.currentFont.size + "pt " + this.currentFont.name;
}

//Audio

baa.audio = {};
baa.audio.sources = {};
baa.audio.masterVolume = 1;

baa.audio.preload = function () {
	for (var i = 0; i < arguments.length; i++) {
		var name = arguments[i];
		baa._checkType("url",name,"string");
		var source;
		source = new Audio();
		source.src = name;
		source.oncanplaythrough = function(){
			baa._assetsLoaded++;
		}
		baa.audio.sources[name] = source;
		baa._assetsToBeLoaded++;
	}
}

//Recorder functions

baa.audio.play = function (source) {
	baa._checkType("source",source,"baa.audio.source");
	source.audio.play();
	source.stopped = false;
	source.playing = true;
}

baa.audio.stop = function (source) {
	baa._checkType("source",source,"baa.audio.source");
	source.audio.pause();
	source.stopped = true;
	source.playing = false;
	source.audio.currentTime = 0;
}

baa.audio.rewind = function (source) {
	baa._checkType("source",source,"baa.audio.source");
	source.audio.currentTime = 0;
}

baa.audio.pause = function (source) {
	baa._checkType("source",source,"baa.audio.source");
	source.audio.pause();
	source.playing = false;
}

baa.audio.resume = function (source) {
	baa._checkType("source",source,"baa.audio.source");
	if (source.audio.currentTime > 0) {
		source.audio.play();
		source.playing = true;
	}
}

baa.audio.setVolume = function (volume) {
	baa._checkType("volume",volume,"number");
	this.masterVolume = volume;
}


//New functions

baa.audio._source = Class.extend("baa.audio.source");

baa.audio._source.init = function (url) {
	baa._checkType("url",url,"string");
	this.audio = baa.audio.sources[url];
	this.stopped = false;
	this.playing = false;
}

baa.audio._source.play = function () {
	var oVol = this.audio.volume;
	this.audio.volume *= baa.audio.masterVolume;
	this.audio.play();
	this.stopped = false;
	this.playing = true;
	this.audio.volume = oVol;
}

baa.audio._source.stop = function () {
	this.audio.pause();
	this.stopped = true;
	this.audio.currentTime = 0;
}

baa.audio._source.pause = function () {
	this.audio.pause();
	this.playing = false;
}

baa.audio._source.resume = function () {
	if (this.audio.currentTime>0) {
		this.audio.play();
		this.playing = true;
	}
}

baa.audio._source.rewind = function () {
	this.audio.currentTime = 0;
}

baa.audio._source.getVolume = function () {
	return this.audio.volume;
}

baa.audio._source.setVolume = function (volume) {
	baa._checkType("volume",volume,"number");
	this.audio.volume = volume;
}

baa.audio._source.isLooping = function () {
	return this.audio.loop;
}

baa.audio._source.setLooping = function (loop) {
	baa._checkType("loop",loop,"boolean");
	this.audio.loop = loop;
}

baa.audio._source.isPlaying = function () {
	return this.playing;
}

baa.audio._source.isPaused = function () {
	return this.audio.paused;
}

baa.audio._source.isStopped = function () {
	return this.stopped;
}

baa.audio._source.setPitch = function (pitch) {
	baa._checkType("pitch",pitch,"number");
	this.audio.playbackRate = pitch;
}

baa.audio._source.getPtich = function () {
	return this.audio.playbackRate;
}

baa.audio._source.seek = function (position) {
	baa._checkType("position",position,"number");
	this.audio.currentTime = position;
}

baa.audio._source.tell = function () {
	return this.audio.currentTime;
}

baa.audio.newSource = function (url) {
	return this._source.new(url);
}


//Keyboard

baa.keyboard = {};
baa.keyboard._keysDown = {};
baa.keyboard._pressed = [];
baa.keyboard._released = [];

baa.keyboard._constant = {
	8: "backspace",
	9: "tab",
	13: "return",
	16: "shift",
	17: "ctrl",
	18: "alt",
	19: "pause",
	20: "capslock",
	27: "escape",
	33: "pageup",
	34: "pagedown",
	35: "end",
	36: "home",
	45: "insert",
	46: "delete",
	37: "left",
	38: "up",
	39: "right",
	40: "down",
	91: "lmeta",
	92: "rmeta",
	93: "mode",
	96: "kp0",
	97: "kp1",
	98: "kp2",
	99: "kp3",
	100: "kp4",
	101: "kp5",
	102: "kp6",
	103: "kp7",
	104: "kp8",
	105: "kp9",
	106: "kp*",
	107: "kp+",
	109: "kp-",
	110: "kp.",
	111: "kp/",
	112: "f1",
	113: "f2",
	114: "f3",
	115: "f4",
	116: "f5",
	117: "f6",
	118: "f7",
	119: "f8",
	120: "f9",
	121: "f10",
	122: "f11",
	123: "f12",
	144: "numlock",
	145: "scrolllock",
	186: ",",
	187: "=",
	188: ",",
	189: "-",
	190: ".",
	191: "/",
	192: "`",
	219: "[",
	220: "\\",
	221: "]",
	222: "'"
};

baa.keyboard._downHandler = function(event) {
	event.preventDefault();
	var keyPressed = baa.keyboard._constant[event.keyCode] || String.fromCharCode(event.keyCode).toLowerCase();
	if (!baa.keyboard._keysDown[keyPressed]) {
		baa.keyboard._pressed.push(keyPressed);
		if (baa.keyPressed) {
			baa.keyPressed(keyPressed);
		}
		if (baa.debug) {
			baa.debug.keypressed(keyPressed,event.keyCode);
		}
	}
	baa.keyboard._keysDown[keyPressed] = true;
}

baa.keyboard._upHandler = function(event) {
	var keyReleased = baa.keyboard._constant[event.keyCode] || String.fromCharCode(event.keyCode).toLowerCase();
	baa.keyboard._released.push(keyReleased);
	if (baa.keyReleased) {
		baa.keyReleased(keyReleased);
	}
	baa.keyboard._keysDown[keyReleased] = false;
}


baa.keyboard.isDown = function() {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("key",arguments[i],"string");
		if (baa.keyboard._keysDown[arguments[i]]) {
			return true;
		}
	}
	return false;
}

baa.keyboard.isPressed = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("key",arguments[i],"string");
		for (var j = 0; j < this._pressed.length; j++) {
			if (arguments[i] == this._pressed[j]) {
				return true;
			}
		}
	}
	return false;
}

baa.keyboard.isReleased = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("key",arguments[i],"string");
		for (var j = 0; j < this._released.length; j++) {
			if (arguments[i] == this._released[j]) {
				return true;
			}
		}
	}
	return false;
}

//Mouse

baa.mouse = baa.point.new();
baa.mouse._buttonsDown = [];
baa.mouse._pressed = [];
baa.mouse._released = [];
baa.mouse._constant = {
	0:"l",
	1:"m",
	2:"r",
	4:"wu",
	5:"wd"
};

baa.mouse._move = function (event) {
	baa.mouse.x = event.clientX-4;
	baa.mouse.y = event.clientY-9;
}

baa.mouse._downHandler = function (event) {
	var mousepressed = baa.mouse._constant[event.button];
	if (!baa.mouse._buttonsDown[mousepressed]) {
		baa.mouse._pressed.push(mousepressed);
		if (baa.mousepressed) {
			baa.mousepressed(mousepressed,event.clientX,event.clientY);
		}
	}
	baa.mouse._buttonsDown[mousepressed] = true;
}

baa.mouse._upHandler = function (event) {
	var mousereleased = baa.mouse._constant[event.button];
	if (baa.mouse._buttonsDown[mousereleased]) {
		baa.mouse._released.push(mousereleased);
		if (baa.mousereleased) {
			baa.mousereleased(mousereleased,event.clientX,event.clientY);
		}
	}
	baa.mouse._buttonsDown[mousereleased] = false;
}

baa.mouse._wheelHandler = function (event) {
	var mousepressed = baa.mouse._constant[event.wheelDelta > 0 ? 4 : 5];
	if (!baa.mouse._buttonsDown[mousepressed]) {
		baa.mouse._pressed.push(mousepressed);
		if (baa.mousepressed) {
			baa.mousepressed(mousepressed,event.clientX,event.clientY);
		}
	}
}

baa.mouse.getX = function () {
	return this.x;
}

baa.mouse.getY = function () {
	return this.y;
}

baa.mouse.isDown = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("button",arguments[i],"string");
		if (baa.mouse._buttonsDown[arguments[i]]) {
			return true;
		}
	}
	return false;
}

baa.mouse.isPressed = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("button",arguments[i],"string");
		for (var j = 0; j < this._pressed.length; j++) {
			if (arguments[i] == this._pressed[j]) {
				return true;
			}
		}
	}
	return false;
}

baa.mouse.isReleased = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("button",arguments[i],"string");
		for (var j = 0; j < this._released.length; j++) {
			if (arguments[i] == this._released[j]) {
				return true;
			}
		}
	}
	return false;
}

baa.mouse.setCursor = function (cursor) {
	baa._checkType("button",arguments[i],"string");
	document.getElementById("canvas").style.cursor=cursor;
}


//Filesystem

baa.filesystem = {};

//Filesystem uses store.js
/* Copyright (c) 2010-2013 Marcus Westin */
(function(e){function o(){try{return r in e&&e[r]}catch(t){return!1}}var t={},n=e.document,r="localStorage",i="script",s;t.disabled=!1,t.set=function(e,t){},t.get=function(e){},t.remove=function(e){},t.clear=function(){},t.transact=function(e,n,r){var i=t.get(e);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),t.set(e,i)},t.getAll=function(){},t.forEach=function(){},t.serialize=function(e){return JSON.stringify(e)},t.deserialize=function(e){if(typeof e!="string")return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}};if(o())s=e[r],t.set=function(e,n){return n===undefined?t.remove(e):(s.setItem(e,t.serialize(n)),n)},t.get=function(e){return t.deserialize(s.getItem(e))},t.remove=function(e){s.removeItem(e)},t.clear=function(){s.clear()},t.getAll=function(){var e={};return t.forEach(function(t,n){e[t]=n}),e},t.forEach=function(e){for(var n=0;n<s.length;n++){var r=s.key(n);e(r,t.get(r))}};else if(n.documentElement.addBehavior){var u,a;try{a=new ActiveXObject("htmlfile"),a.open(),a.write("<"+i+">document.w=window</"+i+'><iframe src="/favicon.ico"></iframe>'),a.close(),u=a.w.frames[0].document,s=u.createElement("div")}catch(f){s=n.createElement("div"),u=n.body}function l(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(s),u.appendChild(s),s.addBehavior("#default#userData"),s.load(r);var i=e.apply(t,n);return u.removeChild(s),i}}var c=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");function h(e){return e.replace(/^d/,"___$&").replace(c,"___")}t.set=l(function(e,n,i){return n=h(n),i===undefined?t.remove(n):(e.setAttribute(n,t.serialize(i)),e.save(r),i)}),t.get=l(function(e,n){return n=h(n),t.deserialize(e.getAttribute(n))}),t.remove=l(function(e,t){t=h(t),e.removeAttribute(t),e.save(r)}),t.clear=l(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),t.getAll=function(e){var n={};return t.forEach(function(e,t){n[e]=t}),n},t.forEach=l(function(e,n){var r=e.XMLDocument.documentElement.attributes;for(var i=0,s;s=r[i];++i)n(s.name,t.deserialize(e.getAttribute(s.name)))})}try{var p="__storejs__";t.set(p,p),t.get(p)!=p&&(t.disabled=!0),t.remove(p)}catch(f){t.disabled=!0}t.enabled=!t.disabled,typeof module!="undefined"&&module.exports&&this.module!==module?module.exports=t:typeof define=="function"&&define.amd?define(t):e.store=t})(Function("return this")())

baa.filesystem.read = function (name) {
	baa._checkType("file",name,"string");
	this._check();
	return store.get(this.identity+name);
}

baa.filesystem.write = function (name,content) {
	baa._checkType("file",name,"string");
	this._check();
	return store.set(this.identity+name,content);
}

baa.filesystem.remove = function (name) {
	baa._checkType("file",name,"string");
	this._check();
	return store.remove(this.identity+name);
}

baa.filesystem.exists = function (name) {
	baa._checkType("file",name,"string");
	this._check();
	return store.get(this.identity+name) != null;
}

baa.filesystem.setIdentity = function (name) {
	baa._checkType("file",name,"string");
	if (typeof(name) != "string") { throw("Please provide a string as identity"); }
	this.identity = name+"/";
}

baa.filesystem._check = function () {
	if (!store.enabled) { alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')};
	if (this.identity == null) { throw("Please set an identity before using filesystem!");}
}


//Run

baa.run = function () {
		window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame   ||  //Chromium 
			window.webkitRequestAnimationFrame ||  //Webkit
			window.mozRequestAnimationFrame    || //Mozilla Geko
			window.oRequestAnimationFrame      || //Opera Presto
			window.msRequestAnimationFrame     || //IE Trident?
			function(callback, element){ //Fallback function
				window.setTimeout(callback, 1000/60);                
			}
		})();
		
		window.cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
	
	if (baa._assetsLoaded == baa._assetsToBeLoaded) {
		if (baa.graphics.ctx) {
			if (baa.config) {
				var conf = {};
				baa.config(conf);
				baa.graphics.canvas.width = conf.width != null ? conf.width : 800;
				baa.graphics.canvas.height = conf.height != null ? conf.height : 600;
				baa.graphics.width = baa.graphics.canvas.width;
				baa.graphics.height = baa.graphics.canvas.height;
				baa.filesystem.identity = typeof(conf.identity) == "string" ? conf.identity + "/" : null;
				if (conf.release) {
					baa.debug = null;
					baa.typesafe = false;
				}
			}
			baa.graphics.imageSmoothingEnabled = true;
			baa.graphics.ctx.strokeStyle = baa.graphics._rgb(255,255,255);
			baa.graphics.setFont(baa.graphics.newFont("arial",10));
			
			baa.load();
			baa.graphics._background();
			baa.loop(0);
			window.cancelAnimFrame(baa.run);
		}
		else {
			window.requestAnimFrame(baa.run);
		}
	}
	else {
		window.requestAnimFrame(baa.run);
	}
}

baa.loop = function (time) {
	baa.time.dt = (time - baa.time.last) / 1000;
	dt = (baa.time.dt > 0) ? baa.time.dt : 1/60;
	if (baa.update) {
		baa.update();
	}
	if (baa.debug) {
	 	baa.debug.update();
	}
	baa.keyboard._pressed = [];
	baa.keyboard._released = [];
	baa.mouse._pressed = [];
	baa.mouse._released = [];
	baa.graphics.drawloop();
	baa.time.last = time;
	window.requestAnimFrame(baa.loop);
}

baa.graphics.drawloop = function (a) {
	if (baa.draw) {
		// this._clearScreen();
		this.ctx.fillStyle = this._rgb(this.backgroundColor.r,this.backgroundColor.g,this.backgroundColor.b);
		this.ctx.globalAlpha = 1;
		this._background();
		this.ctx.globalAlpha = this.color.a;
		this.ctx.fillStyle = this._rgb(this.color.r,this.color.g,this.color.b);
		this.ctx.strokeStyle = this._rgb(this.color.r,this.color.g,this.color.b);
		this.setFont(this.newFont("arial",10));
	 	baa.draw();
		this.origin();
		if (baa.debug) {
		 	baa.debug.draw();
		}
	}
}



window.addEventListener('load', _baa_init);

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//////////
///ONCE///
//////////

baa.once = Class.extend("baa.once");

baa.once.init = function (obj) {
	this.object = obj;
	this.list = {};
}

baa.once.do = function (f,args) {
	if (!this.list[f]) {
		this.list[f] = true;
		return this.object[f].apply(this.object,args);
	}
	return;
}

baa.once.back = function (f,nf,args) {
	if (this.list[f]) {
		this.list[f] = null;
		if (nf) {
			return this.object[nf].apply(this.object,args);
		}
		else {
			return true;
		}
	}
	return;
}


////////////
// Class //
////////////

// baa.class = Class.extend("baa.class");

// baa.class.init = function () {
// 	this.once = baa.Once.new();
// }

///////////
// Utils //
///////////

baa.util = {};

baa.util.TAU = Math.PI*2;

baa.util.sign = function (a) {
	return a >= 0 ? 1 : -1;
}

baa.util.any = function (arr,f) {
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				return true;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						return true;
					}
				}
			}
		}
	}
	return false;
}

baa.util.all = function (arr,f) {
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (!f(arr[i])) {
				return false;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] != f[key]) {
						return false;
					}
				}
				else {
					return false;
				}
			}
		}
	}
	return true;
}

baa.util.find = function (arr,f) {
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				return i;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						return i;
					}
				}
			}
		}
	}
	return null;
}

baa.util.has = function () {
	var arr = arguments[0];
	f = Array.prototype.slice.call(arguments);
	f.splice(0,1);
	for (var i = 0; i < f.length; i++) {
		succes = false;
		for (var j = 0; j < arr.length; j++) {
			if (arr[j] == f[i]) {
				succes = true;
			}
		}
		if (!succes) {
			return false;
		}
	}
	return true
}

baa.util.count = function (arr,f) {
	var c = 0;
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				c++;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						return c++;
					}
				}
			}
		}
	}
	return c;
}


baa.util.clamp = function (a,min,max) {
	return Math.min(max,Math.max(min,a));
}

baa.util.getAngle = function (a,b,c,d) {
	if (!c) {
		return Math.atan2(b.y - a.y,b.x - a.x);
	}
	else {
		return Math.atan2(d - b, c - a);
	}
}

baa.util.random = function (s,e,d) {
	if (e==null) {
		return Math.floor(Math.random()*s);
	}
	else {
		return s+Math.floor(Math.random()*(e-s+1));
	}
}

baa.util.choose = function (arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}


///////////
// Group //
///////////

baa.group = Class.extend("baa.group");

//Use .other if you want obj A to apply to obj B and vise versa
//Use .one if you want obj B to apply to obj A only if obj A applied to obj B returns false
baa.group.other = "__GroupOthers";
baa.group.one = "_GroupOne";

baa.group.init = function () {
	this.length = 0;
	baa.group.add.apply(this,arguments);
}

baa.group.add = function (obj) {
	if (obj) {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				this[this.length] = arguments[i];
				this.length++;
				// print(arguments[i].type());
				for (key in arguments[i]) {
					if (!this.hasOwnProperty(key)) {
						if (typeof(arguments[i][key]) == "function") {
							this.makeFunc(key);
						}
					}
				}
			}
		}
		else if (Class.isClass(obj) && obj.is(baa.group)) {
			for (var i=0; i < obj.length; i++) {
				this[this.length] = obj[i];
				this.length++;
				for (key in obj[i]) {
					if (!this.hasOwnProperty(key)) {
						if (typeof(obj[i][key]) == "function") {
							this.makeFunc(key);
						}
					}
				}
			}
		}
		else {
			this[this.length] = obj;
			this.length++;
			for (key in obj) {
				if (!this.hasOwnProperty(key)) {
					if (typeof(obj[key]) == "function") {
						this.makeFunc(key);
					}
				}
			}
		}
	}
}

baa.group.remove = function (obj) {
	if (obj == null) { return false; }
	var dead;
	if (typeof(obj) == "object") {
		for (var i=0; i < this.length; i++) {
			if (this[i] == obj) {
				dead = i;
				break;
			}
		}
		// print("dead");
		this[dead] = null;
	}
	else {
		this[obj] = null;
		dead = obj;
	}
	for (var i = dead+1; i < this.length; i++) {
		this[i-1] = this[i];
	}
	this.length--;
	this[this.length] = null;
	// print(this.length)
}

baa.group.remove = function (obj) {
	var dead;
	if (typeof(obj) == "object") {
		for (var i=0; i < this.length; i++) {
			if (this[i] == obj) {
				dead = i;
				break;
			}
		}
		this[dead] = null;
	}
	else {
		this[obj] = null;
		dead = obj;
	}
	for (var i = dead+1; i < this.length; i++) {
		this[i-1] = this[i];
	}
	this.length--;
	this[this.length] = null;
}

baa.group.makeFunc = function (k) {
	this[k] = function () {
		var other = arguments[0]
		if (other == baa.group.other || other == baa.group.one) {
			for (var i=0; i < this.length-1; i++) {
				for (var j=i; j < this.length; j++) {
					if (i!=j) {
						if (this[i].hasOwnProperty(k) && this[j].hasOwnProperty(k)) {
							arguments[0] = this[j];
							var a = this[i][k].apply(this[i],arguments);
							if (other == baa.group.one) {
								continue;
							}
							var b = this[j][k].apply(this[j],arguments);
						}
					}
				}
			}
		}
		else {
			for (var i=0; i < this.length; i++) {
				if (this[i].hasOwnProperty(k)) {
					this[i][k].apply(this[i],arguments);
				}
			}
		}
	}
}

baa.group.do = function (f) {
	for (var i=0; i < this.length; i++) {
		f(this[i]);
	}
}

baa.group.count = function (f) {
	var c = 0;
	if (typeof(f)=="function") {
		for (var i=0; i < this.length; i++) {
			if (f(this[i])) {
				c++;
			}
		}
	}
	else {
		for (var i=0; i < this.length; i++) {
			for (var key in f) {
				if (this[i][key]!=undefined) {
					if (this[i][key] == f[key]) {
						return c++;
					}
				}
			}
		}
	}
	return c;
}

baa.group.find = function (f) {
	if (typeof(f)=="function") {
		for (var i=0; i < this.length; i++) {
			if (f(this[i])) {
				return i;
			}
		}
	}
	else {
		for (var i=0; i < this.length; i++) {
			for (var key in f) {
				if (this[i][key]!=undefined) {
					if (this[i][key] == f[key]) {
						return i;
					}
				}
			}
		}
	}
	return null;
}

baa.group.prepare = function (obj) {
	for (key in obj) {
		if (!this.hasOwnProperty(key)) {
			if (typeof(obj[key]) == "function") {
				this.makeFunc(key);
			}
		}
	}
}


//Timer
//////////////////////////////////
baa.timeManager = Class.extend("baa.timeManager");

baa.timeManager.init = function (object) {
	this.timers = [];
	this.obj = object;
	this.playing = true;
}

baa.timeManager.setObject = function (object) {
	this.obj = object;
}

baa.timeManager.getObject = function () {
	return this.obj;
}

baa.timeManager.newTimer = function (time,loop,cond,func,args) {
	var t = baa.timer.new(this,time,loop,cond,this.obj,func,args);
	this.timers.push(t);
	return t;
}

baa.timeManager.update = function () {
	if (this.playing) {
		for (var i = 0; i < this.timers.length; i++) {
			this.timers[i].update();
		}
	}
}

baa.timeManager.play = function () {
	this.playing = true;
}

baa.timeManager.pause = function () {
	this.playing = false;
}

baa.timer = Class.extend("baa.timer");

baa.timer.init = function (manager,time,loop,cond,obj,func,args) {
	this.manager = manager;
	this.time = time;
	this.timeStart = time;
	this.condition = cond || function () { return true; };
	this.condType = typeof(this.condition);
	this.loop = loop;
	this.obj = obj;
	this.func = func;
	this.args = args;
	this.playing = true;
	this.ended = false;
	this.dead = false;
}

baa.timer.setObject = function (obj) {
	this.obj = obj;
}

baa.timer.getObject = function () {
	return this.obj || this.manager.getObject();
}

baa.timer.setCondition = function (condition) {
	this.condition = condition || function () { return true; }
	this.condType = typeof(this.condition);
}

baa.timer.update = function () {
	if (this.playing) {
		if (this.loop) {
			this.ended = false;
		}
		if (!this.ended) {
			var succes = false
			var obj = this.manager.getObject();
			if (this.condition) {
				if (this.condType == "object") {
					for (var key in this.condition) {
						if (this.condition[key] == obj[key]) {
							succes = true;
						}
					}
				}
				else {
					succes = this.condition(obj);
				}
			}
			else {
				succes = true;
			}
			if (succes) {
				this.time -= dt;
				if (this.time < 0) {
					if (this.func) {
						obj[this.func].apply(obj,this.args);
					}

					this.ended = true;
					
					if (this.loop) {
						this.time += this.timeStart;
					}
				}
			}
		}
	}
}

baa.timer.reset = function () {
	this.ended = false;
	this.time = this.timeStart;
	this.playing = true;
}

baa.timer.pause = function () {
	this.playing = false; 
}

baa.timer.play = function () {
	this.playing = true;
}

baa.timer.stop = function () {
	this.playing = false;
	this.time = this.timeStart;
}

baa.timer.kill = function () {
	this.dead = true;
}

baa.timer.isDone = function () {
	return this.ended;
}

//Tween
//////////////////////////////////
baa.tweenManager = Class.extend("baa.tweenManager");

baa.tweenManager.init = function (obj) {
	this.obj = obj;
	this.tweens = [];
	this.afters = [];
}

baa.tweenManager.to = function (rate,vars,obj) {
	var tween = baa.tween.new(this);
	tween.obj = obj || this.obj;
	tween.rate = 1/rate;
	tween.vars = vars;
	this.tweens.push(tween);
	return tween;
}

baa.tweenManager.update = function () {
	for (var i = 0; i < this.tweens.length; i++) {
		if (this.tweens[i].dead) { this.tweens.splice(i,1); continue; }
		this.tweens[i].update();
	}
}


baa.tween = Class.extend("baa.tween");

baa.tween.init = function (manager) {
	this.manager = manager
	this._delay = 0;
	this.inited = false;
	this.progress = 0;
	this.inout = "in";
	this.easing = "linear";
	this.dead = false;
}

baa.tween.update = function () {
	if (this.dead) { return; };
	if (this._delay > 0) { this._delay -= dt; return;};
	if (!this.inited) { this.start(); if (this.startFunc) { this.startFunc(this.startObj);} };
	this.progress += this.rate * dt;
	var p = this.progress;
	p = p >= 1 ? 1 : p;
	p = this.ease(p,this.inout,this.easing);
	for (var prop in this.vars) {
		this.obj[prop] =  this.vars[prop].start + p * this.vars[prop].diff;
	}
	if (this.progress >= 1) {
		if (this.completeFunc) { this.completeFunc(this.completeObj); }
		this.dead = true;
		if (this._after) {
			this.manager.tweens.push(this._after);
		}
	}
}

baa.tween.start = function() {
	for (var prop in this.vars) {
		this.vars[prop] = {
		start : this.obj[prop],
		diff : this.vars[prop] - this.obj[prop]
		};
	}
	this.inited = true;
}

baa.tween.delay = function (x) {
	this._delay = x;
	return this;
}

baa.tween.easing = function (inout,easing) {
	this.inout = inout;
	this.easing = easing;
	return this;
}

baa.tween.onComplete = function(f,obj) {
	this.completeFunc = f;
	this.completeObj = obj || this.obj;
	return this;
}

baa.tween.onStart = function (f,obj) {
	this.startFunc = f;
	this.startObj = obj || this.obj;
}

baa.tween.stop = function () {
	this.dead = true;
}

baa.tween.rush = function () {
	this.progress = 1;
}

baa.tween.after = function (rate,vars,obj) {
	this._after = baa.tween.new(this.manager);
	this._after.obj = obj || this.obj;
	this._after.rate = 1/rate;
	this._after.vars = vars;
	return this._after;
}

baa.tween.ease = function (p,inout,easing) {
	if (inout == "out") {
		p = 1 - p;
		if (easing == "back") {
			p = 1 - this.back(p);
		}
		else if (easing == "quad") {
			p = 1 - this.quad(p);
		}
	}
	if (inout == "in") {
		if (easing == "back") {
			p = this.back(p);
		}
		else if (easing == "quad") {
			p = this.quad(p);
		}
	}
	if (inout == "inout") {
		p = p * 2 
	    if (p < 1) {
	      return .5 * (this.quad(p));
	    }
	    else
	      p = 2 - p
	      return .5 * (1 - (this.quad(p))) + .5
	    end 
	}
	return p;
}



//Debug
///////////////////////////////

baa.debug = Class.extend("baa.debug");

baa.debug.font = baa.graphics.newFont("Courier new",12,"bold");

baa.debug._window = baa.rect.extend("baa.debug.window");

baa.debug._window.init = function (x,y,w,h) {
	baa.debug._window.super.init(this,x,y,w,h);

	this.maxVars = Math.floor(13*(h/200));
	this.numberOfVars = 0;
	
	this.position = 0;

	this.titleBarHeight = 30;
	this.titleBar = baa.rect.new(x,y-this.titleBarHeight,w,this.titleBarHeight);

	this.title = "Debug Menu";

	this.object;

	this.scrollBarWidth = 14;

	this.scrollbarBG = baa.rect.new(x+w,y,this.scrollBarWidth,h);
	this.scrollbar = baa.rect.new(x+w+3,y+5,9,h-10);
	
	this.selector = baa.rect.new(0,0,w,15);
	this.selectorMargin = y % 15;
	this.hover;
	this.selected;
	this.prevSelected;
	this.selectedType;

	this.blinkTimer = 0;

	this.tempValue = "";

	this.keys = [];

	this.path = [];

	this.moving = false;

	this.mouseMargin = baa.point.new();
}

baa.debug._window.update = function () {

	this.blinkTimer+= dt;

	if (this.blinkTimer > 1) {
		this.blinkTimer = 0;
	}

	this.selector.x = this.x;
	this.hover = Math.floor((baa.mouse.getY() - this.y)/15);

	if (this.overlaps(baa.mouse)) {
		if (baa.keyboard.isDown("shift")) {
			if (baa.mouse.isPressed("wu")) {
				this.position = Math.max(0,this.position - 3);
			}
			else if (baa.mouse.isPressed("wd")) {
				this.position = Math.min(this.numberOfVars-this.maxVars,this.position + 3);
			}
			else if (baa.mouse.isPressed("l")) {
				if (this.path.length > 0 && this.hover == 0 && this.position == 0) {
					this.setObject(this.path[this.path.length-1]);
					this.path.pop();
				}
				else {
					var key = this.keys[this.hover + this.position - (this.path.length > 0 ? 1 : 0)];
					if (key == this.selected) {
						this.tempValue = "";
					}
					else {
						this.selectedType = typeof(this.object[key]);
						if (this.selectedType == "boolean") {
							this.object[key] = !this.object[key];
						}
						else if (this.selectedType == "number" || this.selectedType == "string") {
							this.selected = key;
							this.tempValue = this.object[this.selected].toString();
						}
						else if (this.selectedType == "object") {
							this.path.push(this.object);
							this.setObject(this.object[key]);
						}
					}
				}
			}
		}
		this.selector.y = (this.y + this.hover*15);
	}

	if (this.titleBar.overlaps(baa.mouse)) {
		if (baa.mouse.isPressed("l")) {
			this.mouseMargin.x = baa.mouse.getX() - this.titleBar.x;
			this.mouseMargin.y = baa.mouse.getY() - this.titleBar.y;
			this.moving = true;
		}
	}

	if (baa.mouse.isReleased("l")) {
		this.moving = false;
	}

	if (this.moving) {
		this.move();
	}

	this.scrollbar.y = this.y + (this.position * (this.height/(this.numberOfVars)))+2;
	if (baa.keyboard.isDown("shift")) {
		if (baa.keyboard.isDown("down")) {
			this.height += 500 * dt;
			this.maxVars = Math.floor(13*(this.height/200));
			this.scrollbarBG.height = this.height;
			this.scrollbar.height = (12/this.numberOfVars) * this.height;

		}
		if (baa.keyboard.isDown("up")) {
			this.height -= 500 * dt;
			this.maxVars = Math.floor(13*(this.height/200));
			this.scrollbarBG.height = this.height;
			this.scrollbar.height = (12/this.numberOfVars) * this.height;
		}
		if (baa.keyboard.isDown("right")) {
			this.width += 500 * dt;
			this.selector.width += 500 * dt;
			this.titleBar.width += 500 * dt;
			this.scrollbarBG.x = this.x + this.width;
			this.scrollbar.x = this.scrollbarBG.x + 3;
		}
		if (baa.keyboard.isDown("left")) {
			this.width -= 500 * dt;
			this.selector.width -= 500 * dt;
			this.titleBar.width -= 500 * dt;
			this.scrollbarBG.x = this.x + this.width;
			this.scrollbar.x = this.scrollbarBG.x + 3;
		}
	}

}

baa.debug._window.draw = function () {
	baa.graphics.setColor(0,0,0);
	baa.debug._window.super.draw(this,"fill");
	baa.graphics.setLineWidth(2);
	baa.graphics.setColor(200,200,200);
	baa.debug._window.super.draw(this,"line");
	
	//Scrollbar
	if (this.numberOfVars > this.maxVars) {
		this.scrollbarBG.draw("fill");
		baa.graphics.setColor(0,0,0);
		this.scrollbar.draw("fill");
	}
	
	//Title
	baa.graphics.setColor(0,0,0);
	this.titleBar.draw("fill");
	baa.graphics.setColor(200,200,200);
	this.titleBar.draw("line");

	baa.graphics.setColor(255,255,255)
	baa.graphics.setFont(baa.debug.font);
	baa.graphics.print(this.title,"center",1000,this.titleBar.x+this.titleBar.width/2,this.titleBar.y+7)
	
	if (this.overlaps(baa.mouse)) {
		baa.graphics.setColor(150,150,150);
		this.selector.draw();
	}

	var i = 0;
	var j = 0;
	var obj;
	var str = "";
	var mkey;
	for (var key in this.object) {
		obj = this.object[key];

		if (this.position == 0 && j == 0 && this.path.length > 0) {
			baa.graphics.setColor(255,255,255)
			baa.graphics.print("<- back",this.x,this.y)
			j++;
		}
		
		if (typeof(obj)!="function" && key.charAt(0)!="_") {

			if (i >= this.position && j < this.maxVars) {

				mkey = key.substring(0,18);
				if (key.length == 19) {
					mkey = key;
				}
				else if (key.length > 19) {
					mkey = mkey + "~"
				}


				if (typeof(obj) == "object") {
					if (Class.isClass(obj)) {
						baa.graphics.setColor(255,200,200);
						str = mkey + ": " + obj.type();
					}
					else {
						if (Array.isArray(obj)) {
							baa.graphics.setColor(255,255,200);
							str = mkey + ": array(" + obj.length + ")";
						}
						else {
							baa.graphics.setColor(200,255,200);
							str = mkey + ": object";
						}
					}
				}
				else {
					if (typeof(obj) == "string") {
						baa.graphics.setColor(200,255,200);
						if (key == this.selected) {
							str = mkey + ": " + '"' + (this.tempValue||"") + (this.blinkTimer > 0.5 ? "|" : " ") + '"';
						}
						else {
							str = mkey + ": " + '"' + obj + '"';
						}
					}
					else {
						baa.graphics.setColor(255,255,255);
						if (key == this.selected) {
							str = mkey + ": " + (this.tempValue||"") + (this.blinkTimer > 0.5 ? "|" : "");
						}
						else {
							str = mkey + ": " + obj;
						}
					}
				}
				baa.graphics.print(str,this.x+5,this.y+2+15*j);
				j++;
			}
			i++;
		}
	}
}

baa.debug._window.setObject = function (v) {
	this.object = v;
	this.numberOfVars = 0;
	this.keys = [];
	this.selected = null;
	this.position = 0;
	for (var key in this.object) {
		if (typeof(this.object[key]) !="function" && key.charAt(0)!="_") {
			this.numberOfVars++;
			this.keys.push(key);
		}
	}
	this.scrollbar.height = (12/this.numberOfVars) * this.height;
}

baa.debug._window.move = function () {
	this.x = baa.mouse.getX() - this.mouseMargin.x; 
	this.y = baa.mouse.getY() + this.titleBarHeight - this.mouseMargin.y;
	this.titleBar.x = this.x;
	this.titleBar.y = this.y-this.titleBarHeight;

	this.scrollbarBG.x = this.x+this.width;
	this.scrollbarBG.y = this.y;

	this.scrollbar.x = this.scrollbarBG.x + 3;
	this.scrollbar.y = this.y + 5;
}

baa.debug._window.keyPressed = function (key,keycode) {
	if (this.selected) {
		if (key == "backspace") {
			this.tempValue = this.tempValue.substring(0,this.tempValue.length-1);
		}
		else if (key == "return") {
			if (this.selectedType == "number") {
				this.object[this.selected] = parseFloat(this.tempValue) || 0;
			}
			else {
				this.object[this.selected] = this.tempValue;
			}
			this.prevSelected = this.selected;
			this.selected = null;
		}
		else if (key == "escape") {
			this.prevSelected = this.selected;
			this.selected = null;
		}
		else {
			if (this.selectedType == "number") {
				if (keycode >= 48 && keycode <= 57) {
					this.tempValue = this.tempValue + key;
				}
			}
			else {
				if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || key == " ") {
					this.tempValue = this.tempValue + key;
				}
			}
		}
	}
	else {
		if (baa.keyboard.isPressed("return")) {
			if (this.prevSelected) {
				this.selected = this.prevSelected;
			}
		}
	}
}

baa.debug.active = false;

baa.debug.update = function () {
	if (this.active) {
		baa.debug.windows.update();
	}
}

baa.debug.draw = function () {
	if (this.active) {
		baa.debug.windows.draw();
	}
	baa.graphics.setColor(255,255,255);
}

baa.debug.set = function (v) {
	this.windows[0].setObject(v);
	
}

baa.debug.keypressed = function (key,u) {
	if (key == " ") {
		if (baa.keyboard.isDown("shift")) {
			this.active = !this.active;
		}
	}
	if (this.active) {
		this.windows.keyPressed(key,u);
	}
}

baa.debug.windows = baa.group.new(baa.debug._window.new(100,107,300,200));

//TODO
//Make windows contain objects.
//Er is een main window, en door in het main window op variables te klikken
//met middle mouse knop open je een nieuw window.
//Het main window moet 'game' bevatten.


//List of stuff to add:
/*
Group:
	Group.refresh/reset : remove all elements from the group (functions stay)









 */
