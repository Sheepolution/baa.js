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
		if (typeof(this[key])=="function" && key!="isClass") {
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
	if (obj == null) { return false; }
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
		throw("Add a type name! class.extend([TYPE])");
	}
	return this._names[this._names.length-1];
}

Class.__clone = function(obj,supr) {
	if (supr) {
		var _super  = function () {
			var args = Array.prototype.slice.call(arguments);
			var _this = args[0];
			baa._checkType("this",_this,"Class");
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
		if (key == "__clone" || key == "isClass" || key == "new" || key.substring(0,2) == "__") { continue; }
		temp[key] = this.__clone(obj[key],supr);
	}
	return temp;
}

Class.isClass = function (c) {
	if (c!=null) {
		if (typeof(c) == "object") {
			if (c["_isClass"]) {
				return true;
			}
		}
	}
	return false;
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////


var _baa_init = function () {
	baa.graphics.canvas = document.getElementById('canvas');
	baa.graphics._defaultCanvas = baa.graphics.canvas;
	baa.graphics.ctx = baa.graphics.canvas.getContext('2d');
	baa.graphics._defaultCtx = baa.graphics.ctx;

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
	if (!this._typesafe) { return; };
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
	this._color;
}

baa.rect.draw = function (mode,r) {
	if (this._color) {
		baa.graphics.setColor(this._color);
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
	this.angle = 0;
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
	this.animate();
}

baa.sprite.draw = function () {
	if (this.image) {
		baa.graphics.setAlpha(this.alpha);
		this.image.draw(this.frames[this.currentFrame-1],
		this.x+this.offset.x + this.origin.x,this.y+this.offset.y + this.origin.y,
		this.angle,this.flip ? -this.scale.x : this.scale.x,this.scale.y,this.origin.x,this.origin.y);
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
	baa.graphics.setAlpha(1);
	baa.graphics.setLineWidth(2);
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

baa.button = baa.sprite.extend("baa.button");

baa.button.init = function (x,y) {
	baa.button.super.init(this,x,y);
}

baa.button.update = function () {
	if (this.overlaps(baa.mouse)) {
		baa.mouse.setCursor("hand")
	}
}

//TODO: FINISH THIS!




///////////////////////////////
///////////////////////////////

//Graphics
baa.graphics = {};
baa.graphics._defaultCtx;
baa.graphics._defaultCanvas;
baa.graphics._defaultSmooth = false;
baa.graphics._currentCanvas;
baa.graphics._images = {};
baa.graphics._color = {r:255,g:255,b:255,a:255};
baa.graphics._backgroundColor = {r:0,g:0,b:0};
baa.graphics._currentFont;
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
		
	}
}

//Drawing functions

baa.graphics.rectangle = function (mode,x,y,w,h,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number","baa.rect");
	

	if (Class.isClass(x) && x.is(baa.rect)) {
		r = y;
		y = x.y;
		w = x.width;
		h = x.height;
		x = x.x;
	}

	baa._checkType("y",y,"number");
	baa._checkType("width",w,"number");
	baa._checkType("height",h,"number");
	baa._checkType("rounding",r,"number",null);

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

	if (baa.debug) { baa.debug.drawCalls++; };
}

baa.graphics.circle = function (mode,x,y,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r",r,"number");

	this.ctx.beginPath();
	this.ctx.arc(x,y,Math.abs(r),0,2*Math.PI);
	this._mode(mode);
	this.ctx.closePath();

	if (baa.debug) { baa.debug.drawCalls++; };
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

	if (baa.debug) { baa.debug.drawCalls++; };
}

baa.graphics.star = function (mode,x,y,r1,r2,p,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r1",r1,"number");
	baa._checkType("r2",r2,"number");
	baa._checkType("p",p,"number");
	baa._checkType("r",r,"number",null);

	r = r || 0;

	p = Math.max(3,p);
	this.ctx.beginPath();

	for (var i = 0; i < p; i++) {
		this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI + r)*r1,
						y+Math.sin((i*(360/p))/180 *Math.PI + r)*r1);

		this.ctx.lineTo(x+Math.cos((i*(360/p)+(180/p))/180 *Math.PI + r)*r2,
						y+Math.sin((i*(360/p)+(180/p))/180 *Math.PI + r)*r2);

	}
	this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI + r)*r1,
					y+Math.sin((i*(360/p))/180 *Math.PI + r)*r1);

	this._mode(mode);

	if (baa.debug) { baa.debug.drawCalls++; };
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
	
	if (baa.debug) { baa.debug.drawCalls++; };
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

	if (baa.debug) { baa.debug.drawCalls++; };
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

	if (baa.debug) { baa.debug.drawCalls++; };
}

baa.graphics.clear = function () {
	this.ctx.fillStyle = this._rgb(this._backgroundColor.r,this._backgroundColor.b,this._backgroundColor.g);
	this._background();
	this.ctx.fillStyle = this._rgb(this._color.r,this._color.b,this._color.g);

	if (baa.debug) { baa.debug.drawCalls++; };
}

baa.graphics.print = function (t,align,limit,x,y,r,sx,sy,ox,oy,kx,ky) {
	if (typeof(align) == "number") {
		this._print(t,"left",align,limit,x,y,r,sx,sy,ox,oy);
	}
	else {
		this._print(t,align,x,y,r,sx,sy,ox,oy,kx,ky,limit);
	}

	if (baa.debug) { baa.debug.drawCalls++; };
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
				this.ctx.fillText(line, -ox,-oy+this._currentFont.size);
				this.ctx.restore();
				line = words[i] + ' ';
				y += this._currentFont.height+sy;
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
	this.ctx.fillText(line, -ox,-oy+this._currentFont.size);
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

	if (baa.debug) { baa.debug.drawCalls++; };
}

baa.graphics._draw = function (img,x,y,r,sx,sy,ox,oy,kx,ky,quad) {
	baa._checkType("image",img,"baa.graphics.image","string");
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
	
	var url = typeof(img) == "string" ? img : img.url;
	if (this._images[url]==null) {
		throw("Image doesn't exist. Did you forget to preload it?");
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

	var smooth = img.smooth == null ? this._defaultSmooth : img.smooth;
	this.ctx.imageSmoothingEnabled = smooth;
	this.ctx.mozImageSmoothingEnabled = smooth;
	this.ctx.oImageSmoothingEnabled = smooth;
	this.ctx.save();
	this.ctx.transform(1,ky,kx,1,0,0);
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
	if (quad) {
		this.ctx.drawImage(this._images[url],quad.x,quad.y,quad.width,quad.height,-ox,-oy,quad.width,quad.height);
	}
	else{
		this.ctx.drawImage(this._images[url],-ox,-oy);
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

// baa.graphics._canvas.addWidth = function () {
// //!!
// }


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
	this._defaultSmooth = smooth;
}

baa.graphics.setColor = function (r,g,b,a) {
	if (a && a > 1) { print("Warning: Alpha uses 0 to 1, not 0 to 255!"); }
	if (typeof(r)=="object") {
		baa._checkType("red",r[0],"number",null);
		baa._checkType("green",r[1],"number",null);
		baa._checkType("blue",r[2],"number",null);
		baa._checkType("alpha",r[3],"number",null);
		this._color.r = r[0];
		this._color.g = r[1];
		this._color.b = r[2];
		this._color.a = r[3];
	}
	else {
		baa._checkType("red",r,"number",null);
		baa._checkType("green",g,"number",null);
		baa._checkType("blue",b,"number",null);
		baa._checkType("alpha",a,"number",null);

		this._color.r = r==null ? this._color.r : r;
		this._color.g = g==null ? this._color.g : g;
		this._color.b = b==null ? this._color.b : b;
		this._color.a = a==null ? this._color.a : a;
	}
	this.ctx.fillStyle = this._rgb(this._color.r,this._color.g,this._color.b);
	this.ctx.strokeStyle = this._rgb(this._color.r,this._color.g,this._color.b);
	this.ctx.globalAlpha = this._color.a;
}

baa.graphics.setAlpha = function (a) {
	baa._checkType("alpha",a,"number");

	this._color.a = Math.min(1,Math.max(0,a));
	return this.ctx.globalAlpha = a;
}

baa.graphics.setBackgroundColor = function (r,g,b) {
	if (typeof(r)=="object") {
		baa._checkType("red",r[0],"number",null);
		baa._checkType("green",r[1],"number",null);
		baa._checkType("blue",r[2],"number",null);

		this._backgroundColor.r = r[0] || this._backgroundColor.r;
		this._backgroundColor.g = r[1] || this._backgroundColor.g;
		this._backgroundColor.b = r[2] || this._backgroundColor.b;
	}
	else {
		baa._checkType("red",r,"number",null);
		baa._checkType("green",g,"number",null);
		baa._checkType("blue",b,"number",null);

		this._backgroundColor.r = r==null ? this._backgroundColor.r : r;
		this._backgroundColor.g = g==null ? this._backgroundColor.g : g;
		this._backgroundColor.b = b==null ? this._backgroundColor.b : b;
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

	this._currentFont = fnt;
	this.ctx.font = fnt.style + " " + fnt.size + "pt " + fnt.name;

}

baa.graphics.setBlendMode = function (mode) {
	baa._checkType("mode",mode,"string");

	this.ctx.globalCompositeOperation = mode;
}

baa.graphics.setCanvas = function (cvs) {
	baa._checkType("canvas",cvs,"baa.graphics.canvas",null);

	if (cvs==null) {
		this.ctx = this._defaultCtx;
		this.canvas = this._defaultCanvas;
		this._currentCanvas = null;
	}
	else{
		this.ctx = cvs.context;
		this.canvas = cvs.drawable;
		this._currentCanvas = cvs;
	}
}

baa.graphics.setScissor = function (x,y,w,h) {
	if (x!=null) {
		this.push();
		this.ctx.beginPath();
		this.ctx.rect(x,y,w,h);
		this.ctx.closePath();
		this.ctx.clip();
	}
	else {
		this.pop();
	}
}


//Get functions

baa.graphics.getSmooth = function () {
	return this._defaultSmooth;
}

baa.graphics.getColor = function () {
	return [this._color.r,this._color.g,this._color.b,this._color.a];
}

baa.graphics.getAlpha = function () {
	return this._color.a;
}

baa.graphics.getBackgroundColor = function () {
	return [this._backgroundColor.r,this._backgroundColor.g,this._backgroundColor.b];
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

baa.graphics.getTextWidth = function (t) {
	return this.ctx.measureText(t).width;
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
	baa._checkType("mode",mode,"string");

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

	if (baa.debug) { baa.debug.drawCalls++; };
}

baa.graphics._background = function () {
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
}

baa.graphics._rgb = function (r,g,b) {
	var x = ((r << 16) | (g << 8) | b).toString(16);
	return "#000000".substring(0, 7 - x.length) + x;
}

baa.graphics._resetFont = function () {
	this.ctx.font = this._currentFont.size + "pt " + this._currentFont.name;
}


//Audio

baa.audio = {};
baa.audio._sources = {};
baa.audio._masterVolume = 1;

baa.audio.preload = function () {
	var ext = "." + arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var name = arguments[i];
		var snd;
		snd = new Audio();
		snd.oncanplaythrough = function(){
			baa._assetsLoaded++;
		}
		snd.src = "audio/" + name + ext;
		this._sources[name] = snd;
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
	if (typeof(arguments[0]) == "object") {
		arguments = arguments[0];
	}
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
		if (baa.debug) {
			baa.debug.mousepressed(mousepressed,event.clientX,event.clientY)
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
		if (baa.debug) {
			baa.debug.mousepressed(mousepressed,event.clientX,event.clientY)
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

baa.mouse.catchPressed = function (button) {
	baa._checkType("button",button,"string");
	for (var i = 0; i < this._pressed.length; i++) {
		if (button == this._pressed[i]) {
			this._pressed.splice(i,1);
			break;
		}
	}
}

baa.mouse.catchReleased = function (button) {
	baa._checkType("button",button,"string");
	for (var i = 0; i < this._released.length; i++) {
		if (button == this._released[i]) {
			this._released.splice(i,1);
			break;
		}
	}
}

baa.mouse.setCursor = function (cursor) {
	baa._checkType("button",cursor,"string");
	document.getElementById("canvas").style.cursor=cursor;
}


//Filesystem

baa.filesystem = {};

//Filesystem uses store.js
/* Copyright (c) 2010-2013 Marcus Westin */
(function(e){function o(){try{return r in e&&e[r]}catch(t){return!1}}var t={},n=e.document,r="localStorage",i="script",s;t.disabled=!1,t.set=function(e,t){},t.get=function(e){},t.remove=function(e){},t.clear=function(){},t.transact=function(e,n,r){var i=t.get(e);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),t.set(e,i)},t.getAll=function(){},t.forEach=function(){},t.serialize=function(e){return JSON.stringify(e)},t.deserialize=function(e){if(typeof e!="string")return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}};if(o())s=e[r],t.set=function(e,n){return n===undefined?t.remove(e):(s.setItem(e,t.serialize(n)),n)},t.get=function(e){return t.deserialize(s.getItem(e))},t.remove=function(e){s.removeItem(e)},t.clear=function(){s.clear()},t.getAll=function(){var e={};return t.forEach(function(t,n){e[t]=n}),e},t.forEach=function(e){for(var n=0;n<s.length;n++){var r=s.key(n);e(r,t.get(r))}};else if(n.documentElement.addBehavior){var u,a;try{a=new ActiveXObject("htmlfile"),a.open(),a.write("<"+i+">document.w=window</"+i+'><iframe src="/favicon.ico"></iframe>'),a.close(),u=a.w.frames[0].document,s=u.createElement("div")}catch(f){s=n.createElement("div"),u=n.body}function l(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(s),u.appendChild(s),s.addBehavior("#default#userData"),s.load(r);var i=e.apply(t,n);return u.removeChild(s),i}}var c=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");function h(e){return e.replace(/^d/,"___$&").replace(c,"___")}t.set=l(function(e,n,i){return n=h(n),i===undefined?t.remove(n):(e.setAttribute(n,t.serialize(i)),e.save(r),i)}),t.get=l(function(e,n){return n=h(n),t.deserialize(e.getAttribute(n))}),t.remove=l(function(e,t){t=h(t),e.removeAttribute(t),e.save(r)}),t.clear=l(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),t.getAll=function(e){var n={};return t.forEach(function(e,t){n[e]=t}),n},t.forEach=l(function(e,n){var r=e.XMLDocument.documentElement.attributes;for(var i=0,s;s=r[i];++i)n(s.name,t.deserialize(e.getAttribute(s.name)))})}try{var p="__storejs__";t.set(p,p),t.get(p)!=p&&(t.disabled=!0),t.remove(p)}catch(f){t.disabled=!0}t.enabled=!t.disabled,typeof module!="undefined"&&module.exports&&this.module!==module?module.exports=t:typeof define=="function"&&define.amd?define(t):e.store=t})(Function("return this")());

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
	ot = (baa.time.dt > 0) ? baa.time.dt : 1/60;
	dt = Math.min(ot,1/60);

	if (baa.debug) {
		baa.debug.fps = 1000 / (time - baa.time.last);
		baa.debug.update();
	}

	if (baa.update) {
		baa.mouse.setCursor("default");
		baa.update();
		Timer.update();
		Tween.update();
	}

	if (baa.debug) {
		baa.debug.updateWindows();
	}


	baa.graphics.drawloop();

	baa.keyboard._pressed = [];
	baa.keyboard._released = [];
	baa.mouse._pressed = [];
	baa.mouse._released = [];

	baa.time.last = time;
	window.requestAnimFrame(baa.loop);
}

baa.graphics.drawloop = function (a) {
	if (baa.draw) {
		// this._clearScreen();
		this.ctx.fillStyle = this._rgb(this._backgroundColor.r,this._backgroundColor.g,this._backgroundColor.b);
		this.ctx.globalAlpha = 1;
		this._background();
		this.ctx.globalAlpha = this._color.a;
		this.ctx.fillStyle = this._rgb(this._color.r,this._color.g,this._color.b);
		this.ctx.strokeStyle = this._rgb(this._color.r,this._color.g,this._color.b);
		this.setFont(this.newFont("arial",10));
		baa.draw();

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
	baa._checkType("object",obj,"object");

	this.object = obj;
	this.list = {};
}

baa.once.do = function (f,args) {
	baa._checkType("function",f,"string");
	baa._checkType("arguments",args,"object");

	if (!this.list[f]) {
		this.list[f] = true;
		return this.object[f].apply(this.object,args);
	}
	return;
}

baa.once.back = function (f,nf,args) {
	baa._checkType("function",f,"string");
	baa._checkType("newFunction",nf,"string");
	baa._checkType("arguments",args,"object");

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
	baa._checkType("a",a,"number");

	return a >= 0 ? 1 : -1;
}

baa.util.any = function (arr,f) {
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");

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
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");

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
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");
	
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

baa.util.findAll = function (arr,f) {
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");
	
	var newarr = [];
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				newarr.push(i);
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						newarr.push(i);
					}
				}
			}
		}
	}
	return newarr;
}

baa.util.has = function () {
	var arr = arguments[0];
	baa._checkType("array",arr,"object");
	f = Array.prototype.slice.call(arguments);
	f.splice(0,1);
	for (var i = 0; i < f.length; i++) {
		baa._checkType("key",f[i],"string");
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
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");
	
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
	baa._checkType("a",a,"number");
	baa._checkType("min",min,"number");
	baa._checkType("max",max,"number");
	
	return Math.min(max,Math.max(min,a));
}

baa.util.getAngle = function (a,b,c,d) {
	baa._checkType("x1",a,"number");
	baa._checkType("y1",b,"number");
	baa._checkType("x2",c,"number");
	baa._checkType("y2",d,"number");

	if (!c) {
		return Math.atan2(b.y - a.y,b.x - a.x);
	}
	else {
		return Math.atan2(d - b, c - a);
	}
}

baa.util.random = function (s,e) {
	if (e==null) {
		baa._checkType("value",s,"number");
		return Math.floor(Math.random()*s);
	}
	else {
		baa._checkType("min",s,"number");
		baa._checkType("max",e,"number");
		return s+Math.floor(Math.random()*(e-s+1));
	}
}

baa.util.choose = function (arr) {
	baa._checkType("array",arr,"object");

	return arr[Math.floor(Math.random()*arr.length)];
}

baa.util.same = function (arr1,arr2) {
	baa._checkType("array1",arr2,"object");
	baa._checkType("array2",arr1,"object");

	var arr = [];
	for (var i = 0; i < arr1.length; i++) {
		for (var j = 0; j < arr2.length; j++) {
			if (arr1[i] == arr2[j]) {
				arr.push(arr1[i]);
			}
		}
	}
	return arr;
}

baa.util.remove = function (arr,f) {
	//find does the checktypes
	arr.splice(this.find(arr,f));
	return arr;
}

///////////
// Group //
///////////

baa.group = Class.extend("baa.group");

//Use .other if you want obj A to apply to obj B and vise versa
//Use .one if you want obj B to apply to obj A only if obj A applied to obj B returns false
baa.group.other = "__GroupOthers";
baa.group.one = "__GroupOne";
baa.group.forward = "_GroupForward";

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
				for (var key in arguments[i]) {
					if (!this.hasOwnProperty(key)) {
						if (typeof(arguments[i][key]) == "function") {
							this._makeFunc(key);
						}
					}
				}
			}
		}
		else if (Class.isClass(obj) && obj.is(baa.group)) {
			for (var i=0; i < obj.length; i++) {
				this[this.length] = obj[i];
				this.length++;
				for (var key in obj[i]) {
					if (!this.hasOwnProperty(key)) {
						if (typeof(obj[i][key]) == "function") {
							this._makeFunc(key);
						}
					}
				}
			}
		}
		else {
			this[this.length] = obj;
			this.length++;
			for (var key in obj) {
				if (!this.hasOwnProperty(key)) {
					if (typeof(obj[key]) == "function") {
						this._makeFunc(key);
					}
				}
			}
		}
	}
}

baa.group.remove = function (obj) {
	baa._checkType("object",obj,"number","object");

	if (obj == null) { return false; }
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

baa.group._makeFunc = function (k) {
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
			if (arguments[0] == baa.group.forward) {
				for (var i=0; i < this.length; i++) {
					if (this[i].hasOwnProperty(k)) {
						this[i][k].apply(this[i],arguments);
					}
				}
			}
			else {
				for (var i = this.length-1; i >= 0; i--) {
					if (this[i].hasOwnProperty(k)) {
						this[i][k].apply(this[i],arguments);
					}
				}	
			}
			
			
		}
	}
}

baa.group.do = function (f) {
	baa._checkType("function",f,"function");

	for (var i=0; i < this.length; i++) {
		f(this[i]);
	}
}

baa.group.set = function (key,value) {
	baa._checkType("key",key,"string");

	for (var i = 0; i < this.length; i++) {
		if (this[i].hasOwnProperty(key)) {
			this[i][key] = value;
		}
	}
}

baa.group.count = function (f) {
	baa._checkType("condition",f,"function","object");

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
	baa._checkType("condition",f,"function","object");

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
	for (var key in obj) {
		if (!this.hasOwnProperty(key)) {
			if (typeof(obj[key]) == "function") {
				this._makeFunc(key);
			}
		}
	}
}

baa.group.flush = function () {
	for (var i=0; i < this.length; i++) {
		delete(this[i]); 
	}
	this.length = 0;
}

baa.group.sort = function (a,lowToHigh) {
	baa._checkType("key",a,"string");
	baa._checkType("lowToHigh",lowToHigh,"boolean");

	sorted = false;

	var danger = 10000;

	while (!sorted && danger > 0) {
		danger--;
		sorted = true;
		for (var i = 0; i < this.length-1; i++) {
			for (var j = i; j < this.length; j++) {
				if (lowToHigh) {
					if (this[i][a] > this[j][a]) {
						var old = this[j];
						this[j] = this[i];
						this[i] = old;
						sorted = false;
					}
				}
				else {
					if (this[i][a] < this[j][a]) {
						var old = this[j];
						this[j] = this[i];
						this[i] = old;
						sorted = false;
					}
				}
			}
		}
	}
	//TODO: Dit weghalen
	if (danger <= 0) {
		print("SAVED FROM INFINITE LOOP!");
	}
	else {
		print("Sorting succesfull");
	}
}


//Timer
//////////////////////////////////
baa.timerManager = Class.extend("baa.timerManager");

baa.timerManager.init = function (object) {
	baa._checkType("object",object,"object",null);
	this.obj = object;
	this.timers = [];
	this.playing = true;
	this.new = this.newTimer;
	this.newTimer = null;
}

baa.timerManager.setObject = function (object) {
	baa._checkType("object",object,"object");
	this.obj = object;
}

baa.timerManager.getObject = function () {
	return this.obj;
}

baa.timerManager.newTimer = function (obj,time,loop,once,cond,func,args) {
	var t;
	if (typeof(obj) == "number") {
		t = baa.timer.new(obj,time,loop,once,this.obj,cond,func,this);
	}
	else {
		t = baa.timer.new(time,loop,once,obj,cond,func,args,this);
	}
	this.timers.push(t);
	return t;

}
baa.timerManager.update = function () {
	if (this.playing) 	{
		for (var i = this.timers.length - 1; i >= 0; i--) {
			if (this.timers[i].dead) { this.timers.splice(i,1); continue; }
			this.timers[i].update();
		}
	}
}

baa.timerManager.play = function () {
	this.playing = true;
}

baa.timerManager.pause = function () {
	this.playing = false;
}

Timer = baa.timerManager.new();

baa.timer = Class.extend("baa.timer");

/**
 * Create a new timer
 * @param  {float} time    			The length of the timer
 * @param  {bool} loop    			If the timer should loop or not (default: false);
 * @param  {object} obj     		The object used for the next arguments
 * @param  {object}{function} cond  Set what condition to be true for the timer to run. Can be function or object.
 * @param  {function}{string} func  What function to call when the timer is finished
 * @param  {array} args    			An array of arguments for the function
 * @param  {object} manager 		The manager assigned to this timer
 * @return {object}         		The timer
 */
baa.timer.init = function (time,loop,once,obj,cond,func,args,manager) {
	baa._checkType("time",time,"number");
	baa._checkType("loop",loop,"boolean",null);
	baa._checkType("once",once,"boolean",null);
	baa._checkType("object",obj,"object",null);
	baa._checkType("condition",cond,"object","function",null);
	baa._checkType("function",func,"function","string",null);
	baa._checkType("arguments",args,"object",null);

	this.manager = manager;
	this.time = time;
	this.timeStart = time;
	this.condition = cond;
	this.condType = typeof(this.condition);
	this.loop = loop || false;
	this.once = once || false;
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
	return this.obj || (this.manager ? this.manager.getObject() : null);
}

baa.timer.setCondition = function (condition) {
	baa._checkType("condition",condition,"function","object");

	this.condition = condition || function () { return true; }
	this.condType = typeof(this.condition);
}

baa.timer.update = function () {
	if (this.playing && !this.dead) {
		if (this.loop) {
			this.ended = false;
		}
		if (!this.ended) {
			var succes = true
			var obj = this.getObject();
			if (this.condition) {
				if (this.condType == "object") {
					for (var key in this.condition) {
						if (this.condition[key] != obj[key]) {
							succes = false;
						}
					}
				}
				else {
					succes = this.condition(obj);
				}
			}
				
			if (succes) {
				this.time -= dt;
				if (this.time < 0) {
					if (this.func) {
						obj[this.func].apply(obj,this.args);
					}

					this.ended = true;

					if (this.once) {
						this.kill();
						return;
					}
					
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
	this.playing = false;
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
}

baa.tweenManager.to = function (obj,rate,vars,force) {
	
	if (typeof(obj) == "number") {
		force = vars;
		vars = rate;
		rate = obj;
		obj = this.obj;
	}
	baa._checkType("rate",rate,"number");
	baa._checkType("vars",vars,"object");
	baa._checkType("force",force,"boolean",null);
	baa._checkType("object",obj,"object");

	var tween = baa.tween.new(this);
	tween.obj = obj || this.obj;
	tween.rate = rate > 0 ? 1/rate : 1;
	tween.vars = vars;
	tween.force = force || false;
	this.tweens.push(tween);
	return tween;
}

baa.tweenManager.update = function () {
	for (var i = this.tweens.length - 1; i >= 0; i--) {
		if (this.tweens[i].dead) { this.tweens.splice(i,1); continue; }
		this.tweens[i].update();
	}
}

baa.tweenManager.getObject = function () {
	return this.obj;
} 

Tween = baa.tweenManager.new();

baa.tween = Class.extend("baa.tween");

baa.tween.init = function (manager) {
	this.manager = manager
	this._delay = 0;
	this.inited = false;
	this.progress = 0;
	this.inout = "in";
	this.easing = "linear";
	this.dead = false;
	this.obj = this.manager.getObject();
}

baa.tween.update = function () {
	if (this.dead) { return; };
	if (this._delay > 0) { this._delay -= dt; return;};
	if (!this.inited) { 
		this.start();
		if (this.startFunc) {
			baa.tween.__call(this.startObj,this.startFunc);
		}
	}
	this.progress += this.rate * dt;
	var p = this.progress;
	p = p >= 1 ? 1 : p;
	p = baa.tween.__ease(p,this.inout,this.easing);
	for (var prop in this.vars) {
		this.obj[prop] =  this.vars[prop].start + p * this.vars[prop].diff;
	}
	if (this.updateFunc) {
		baa.tween.__call(this.updateObj,this.updateFunc);
	}
	if (this.progress >= 1) {
		if (this.completeFunc) { 
			baa.tween.__call(this.completeObj,this.completeFunc);
		}
		this.dead = true;
		if (this._after) {
			this.manager.tweens.push(this._after);
		}
	}
}

baa.tween.start = function() {
	//Check if there are duplicates
	for (var i = 0; i < this.manager.tweens.length; i++) {
		var twn = this.manager.tweens[i];

		//We only check for inited, alive tweens.
		//Since this tween itself is not inited yet, we automatically check if it is itself.
		if (twn.inited && !twn.dead) {
			//If they are the same object
			if (this.obj == twn.obj) {
				//Make an array of all they keys both tweens have
				var same = [];
				for (var key in this.vars) {
					for (var key2 in twn.vars) {
						if (key == key2) {
							same.push(key);
						}
					}
				}
				for (var j = 0; j < same.length; j++) {
					//Wh1ether we use force to overwrite it or not
					if (this.force) {
						delete(twn.vars[same[j]]);
					}
					else {
						delete(this.vars[same[j]]);
					}
				}
			}
		}
	}

	for (var prop in this.vars) {
		this.vars[prop] = {
		start : this.obj[prop],
		diff : this.vars[prop] - this.obj[prop]
		};
	}

	this.inited = true;
}

baa.tween.delay = function (delay) {
	baa._checkType("delay",delay,"number");

	this._delay = delay;
	return this;
}

baa.tween.ease = function (inout,easing) {
	baa._checkType("inout",inout,"string");
	baa._checkType("easing",easing,"string");

	this.inout = inout;
	this.easing = easing;
	return this;
}

baa.tween.onStart = function (f,obj) {
	baa._checkType("function",f,"function","string");
	baa._checkType("object",obj,"object",null);

	this.startFunc = f;
	this.startObj = obj || this.obj;
	return this;
}

baa.tween.onUpdate = function (f,obj) {
	baa._checkType("function",f,"function","string");
	baa._checkType("object",obj,"object",null);

	this.updateFunc = f;
	this.updateObj = obj || this.obj;
	return this;
}

baa.tween.onComplete = function(f,obj) {
	baa._checkType("function",f,"function","string");
	baa._checkType("object",obj,"object",null);

	this.completeFunc = f;
	this.completeObj = obj || this.obj;
	return this;
}

baa.tween.stop = function () {
	this.dead = true;
}

baa.tween.rush = function () {
	this.progress = 1;
}

baa.tween.to = function (obj,rate,vars,force) {
	if (typeof(obj) == "number") {
		force = vars;
		vars = rate;
		rate = obj;
		obj = this.obj;
	}

	baa._checkType("rate",rate,"number");
	baa._checkType("vars",vars,"object");
	baa._checkType("force",force,"boolean",null);
	
	this._after = baa.tween.new(this.manager);
	this._after.obj = obj;
	this._after.rate = rate > 0 ? 1/rate : 1;
	this._after.vars = vars;
	this._after.force = force || false;
	return this._after;
}

baa.tween.__call = function (obj,func) {
	typeof(func) == "string" ? obj[func]() : func(obj);
}

baa.tween.__ease = function (p,inout,easing) {
	if (inout == "out") {
		p = 1 - p;
		p = 1 - baa.tween["__" + easing](p);
	}
	else if (inout == "in") {
		p = baa.tween["__" + easing](p);
	}
	else if (inout == "inout") {
		p = p * 2;
		if (p < 1) {
			return .5 * (baa.tween["__" + easing](p));
		}
		else {
			p = 2 - p;
			return .5 * (1 - (baa.tween["__" + easing](p))) + .5;
		}
	}
	return p;
}

baa.tween.__linear = function (p) {
	return p;
}

baa.tween.__quad = function (p) {
	return p * p;
}

baa.tween.__cubic = function (p) {
	return p * p * p;
}

baa.tween.__quart = function (p) {
	return p * p * p * p;
}

baa.tween.__quint = function (p) {
	return p * p * p * p *p;
}

baa.tween.__expo = function (p) {
	return Math.pow(2, (10 * (p - 1)));
}

baa.tween.__sine = function (p) {
	return -Math.cos(p * (Math.PI * .5)) + 1;
}

baa.tween.__circ = function (p) {
	return -(Math.sqrt(1 - (p * p)) - 1);
}

baa.tween.__back = function (p) {
	return p * p * (2.7 * p - 1.7);
}

baa.tween.__elastic = function (p) {
	return -(Math.pow(2,(10*(p-1)))*Math.sin((p-1.075)*(Math.PI*2)/.3));
}

/////////////////////////////
/////////////////////////////

//Debug
baa._debug = Class.extend("baa._debug");

baa._debug.init = function () {
	this.active = false;

	this.playing = true;
	this.hide = false;
	this.speed = 1;

	this.activeHold = ["shift","d"];
	this.activePress = "b";

	this.drawCalls = 0;
	this.oldDrawCalls //We don't want to count the debug drawcalls, so we store the original value in this
	this.barFont = baa.graphics.newFont("arial",16);

	//Buttons
	this.buttonHide = baa.rect.new(260,0,40,40);
	this.buttonRewind = baa.rect.new(300,0,40,40);
	this.buttonPlay = baa.rect.new(340,0,40,40);
	this.buttonForward = baa.rect.new(380,0,40,40);

	this.windows = baa.group.new();
	this.windows.prepare(baa._debug.window);
}

baa._debug.update = function () {
	this.drawCalls = 0;
	if (this.active) {
		if (baa.keyboard.isDown(this.activeHold) && baa.keyboard.isPressed(this.activePress)) {
			this.active = false;
			return;
		}


		if (baa.mouse.isPressed("l")) {
			if (this.buttonPlay.overlaps(baa.mouse)) {
				this.playing = !this.playing;
			}
			else if (this.buttonRewind.overlaps(baa.mouse)) {
				this.speed -= 0.25;
			}
			else if (this.buttonForward.overlaps(baa.mouse)) {
				this.speed += 0.25;
			}
			else if (this.buttonHide.overlaps(baa.mouse)) {
				this.hide = !this.hide;
			}
		}

		dt = dt * this.speed;
		if (!this.playing) {
			dt = 0;
			if (baa.mouse.isPressed("m")) {
				if (this.buttonRewind.overlaps(baa.mouse)) {
					dt = -ot;
				}
				else if (this.buttonForward.overlaps(baa.mouse)) {
					dt = ot;
				} 

			}
		}
	}
	else {
		if (baa.keyboard.isDown(this.activeHold) && baa.keyboard.isPressed(this.activePress)) {
			this.active = true;
		}
	}
}

baa._debug.updateWindows = function () {
	if (this.active && !this.hide) {
		this.windows.update();
	}
}

baa._debug.draw = function () {
	if (this.active) {
		baa.graphics.setLineWidth(3);
		this.oDrawCalls = this.drawCalls;
		baa.graphics.origin();
		if (this.active && !this.hide) {
			this.windows.draw(baa.group.forward);
		}
		this.drawToolBar();

		baa.graphics.setColor(255,255,255,1);
		baa.graphics.setLineWidth(1);
	}
}

baa._debug.drawToolBar = function () {
	baa.graphics.setColor(255,255,255);
	baa.graphics.setAlpha(0.8);
	baa.graphics.rectangle("fill",0,0,baa.graphics.width,40);
	baa.graphics.setColor(0,0,0);
	baa.graphics.setFont(this.barFont);
	baa.graphics.print("FPS: " + Math.floor(this.fps),5,9);
	baa.graphics.line(92,0,92,40);
	baa.graphics.print("Drawcalls: " + this.oDrawCalls,100,9);
	baa.graphics.line(260,0,260,40);
	this.drawToolButtons();
	baa.graphics.setColor(0,0,0);
	baa.graphics.print("Speed: " + this.speed,this.buttonForward.x + 50,10);
}

baa._debug.drawToolButtons = function () {

	//Hide
	baa.graphics.setColor(0,0,0);
	this.buttonHide.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonHide.draw("line");

	//Play
	baa.graphics.setColor(0,0,0);
	this.buttonPlay.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonPlay.draw("line");


	//Rewind
	baa.graphics.setColor(0,0,0);
	this.buttonRewind.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonRewind.draw("line");

	//Forward
	baa.graphics.setColor(0,0,0);
	this.buttonForward.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonForward.draw("line");

	baa.graphics.setColor(255,255,255,1);

	//Hide
	baa.graphics.rectangle("line",this.buttonHide.x + 10,this.buttonHide.y + 10, 20, 20)

	//Rewind
	baa.graphics.star("fill",this.buttonRewind.x + 15, this.buttonRewind.y + 18,10,5,1,Math.PI);
	baa.graphics.star("fill",this.buttonRewind.x + 27, this.buttonRewind.y + 18,10,5,1,Math.PI);

	//Forward
	baa.graphics.star("fill",this.buttonForward.x + 13, this.buttonForward.y + 18,10,5,1);
	baa.graphics.star("fill",this.buttonForward.x + 25, this.buttonRewind.y + 18,10,5,1);
	
	if (this.playing) {
		//Pause
		baa.graphics.rectangle("fill",this.buttonPlay.x + 7,this.buttonPlay.y + 5,10,30);
		baa.graphics.rectangle("fill",this.buttonPlay.x + 23,this.buttonPlay.y + 5,10,30);
	}
	else {
		//Play
		baa.graphics.star("fill",this.buttonPlay.x + 17, this.buttonPlay.y + 19,16,8,3);
	}
}

baa._debug.watch = function (obj,name) {
	this.windows.set("z",0);
	var wndow = baa._debug.window.new( obj, name, 10 + 220 * this.windows.length, 100 );
	wndow.z = 10;
	this.windows.add(wndow);
	this.windows.sort("z",true);

}

baa._debug.mousepressed = function (button,x,y) {
	this.windows.mousepressed(button,x,y);
}

baa._debug.keypressed = function (key) {
	this.windows.keypressed(key);
}

baa._debug.focus = function (wndow) {
	this.windows.set("z",0);
	wndow.z = 10;
	this.windows.sort("z",true);
}

baa._debug.kill = function (wndow) {
	this.windows.remove(wndow);
}

baa._debug.setActivate = function () {
	this.activePress = arguments[arguments.length-1];
	this.activeHold = Array.prototype.slice.call(arguments);
	this.activeHold.splice(arguments.length-1,1)
}


baa._debug.window = Class.extend("baa._debug.window");

baa._debug.types = {
	"object" : [200,100,100],
	"string" : [100,200,100],
	"number" : [100,100,255],
	"boolean" : [200,200,100],
	"array" : [150,50,50]
}

baa._debug.window.init = function (obj,name,x,y) {
	this.x = x;
	this.y = y;
	this.z = Math.random();
	this.dataY = 50;
	this.selectorY = -200;
	this.width = 210;
	this.height = 400;
	this.rounding = 0.5

	this.obj = obj;
	this.originalObject = obj;
	this.objects = [];

	this.showPrivates = false;
	this.longestKeyWord = 0;
	this.textHeightMargin = 20;
	this.textWidth = 8.3;
	this.keysWidth = 0;
	this.longestValueLimit = 13;

	this.selectedKey = "";

	this.editing = false;
	this.editValue = 0;
	this.editType = "number";
	this.editKey = "";
	this.editTimer = 0;

	this.name = name;
	this.names = [];

	this.numberOfValues = 0;

	this.titleBar = baa.rect.new(this.x,this.y,this.width,this.dataY / 2.5);
	this.moving = false;

	this.resizer = baa.rect.new(this.x + this.width - 15,this.y + this.height - 15,20,20);
	this.resizing = false;

	//Menu
	this.buttonBack = baa.rect.new(this.x,this.y + this.dataY / 2.5, 25, 27);
	this.buttonPrivate = baa.rect.new(this.x + 25,this.y + this.dataY / 2.5, 25, 27);
	this.buttonClose = baa.rect.new(this.x + 50,this.y + this.dataY / 2.5, 25, 27);
	
	//Scrolling
	this.scrollHeight = 0;
	this.scrollLimit = 100;


}

baa._debug.window.update = function () {
	// this.width = this.keysWidth;
	// this.keysWidth = this.longestKeyWord * this.textWidth + 10;
	this.longestValueLimit = Math.floor( (this.width - this.keysWidth) / this.textWidth);
	this.scrollLimit = this.numberOfValues * (this.textHeightMargin+1) - (this.height - this.dataY/1.8);

	if (baa.mouse.isPressed("l")) {
		if (this.resizer.overlaps(baa.mouse)) {
			baa.mouse.catchPressed("l");
			this.resizing = true;
		}
		else if (this.titleBar.overlaps(baa.mouse)) {
			baa.debug.focus(this);
			this.moving = true;
			baa.mouse.catchPressed("l");
		}
		else if (this.buttonBack.overlaps(baa.mouse)) {
			if (this.objects.length > 0) {
				this.goBackObject();
			}
			baa.mouse.catchPressed("l");
		}
		else if (this.buttonPrivate.overlaps(baa.mouse)) {
			this.showPrivates = !this.showPrivates;
			baa.mouse.catchPressed("l");
		}
		else if (this.buttonClose.overlaps(baa.mouse)) {
			baa.debug.kill(this);
		}
	}

	if (baa.mouse.isReleased("l")) {
		this.resizing = false;
		this.moving = false;
	}

	if (this.resizing) {
		this.width = baa.mouse.getX() - this.x + 10;
		this.height = baa.mouse.getY() - this.y + 10;
		this.titleBar.width = this.width;
		this.scrollHeight = 0;
	}

	if (this.moving) {
		this.setPosition(baa.mouse.getX(),baa.mouse.getY());
	}

	this.resizer.x = this.x + this.width - 15;
	this.resizer.y = this.y + this.height - 15;

	this.editTimer += dt;
	if (this.editTimer > 1.5) {
		this.editTimer = 0;
	}
}

baa._debug.window.draw = function () {
	this.drawData();
	this.drawButtons();
	this.drawRectangle();
	this.drawName();
	if (!this.resizing && !this.moving) {
		this.drawSelector();
	}
	baa.graphics.setColor(255,255,255);
	this.resizer.draw("both",2);
}

baa._debug.window.drawRectangle = function () {
	baa.graphics.setColor(255,255,255,1);
	baa.graphics.setLineWidth(3);
	baa.graphics.rectangle("line",this.x,this.y,this.width,this.height,this.rounding);
}

baa._debug.window.drawName = function () {
	baa.graphics.setColor(255,255,255,1);
	this.titleBar.draw("both",1.8);
	baa.graphics.setColor(0,0,0);
	var str = this.name;
	for (var i = 0; i < this.names.length; i++) {
		str = str + " -> ";
		str = str + this.names[i];
	}
	baa.graphics.print(str,this.x+5,this.y+4);
}

baa._debug.window.drawButtons = function () {
	baa.graphics.setColor(0,0,0);
	baa.graphics.rectangle("fill",this.buttonBack.x,this.buttonBack.y,this.width,27);

	if (this.objects.length > 0) {
		baa.graphics.setColor(255,255,255,1);
		this.buttonBack.draw();
		baa.graphics.setAlpha(0.3)
		baa.graphics.setColor(0,0,0);
		this.buttonBack.draw("line");
		baa.graphics.setAlpha(1)
		baa.graphics.print("B",this.buttonBack.x+8,this.buttonBack.y+8);
	}

	baa.graphics.setColor(255,255,255);
	this.buttonPrivate.draw();
	baa.graphics.setColor(0,0,0);
	baa.graphics.setAlpha(0.3)
	this.buttonPrivate.draw("line");
	baa.graphics.setAlpha(1)
	baa.graphics.print("P",this.buttonPrivate.x+8,this.buttonPrivate.y+8);

	baa.graphics.setColor(255,255,255);
	this.buttonClose.draw();
	baa.graphics.setColor(0,0,0);
	baa.graphics.setAlpha(0.3);
	this.buttonClose.draw("line");
	baa.graphics.setAlpha(1);
	baa.graphics.print("X",this.buttonClose.x+8,this.buttonClose.y+8);

	baa.graphics.setColor(255,255,255);
	baa.graphics.rectangle("line",this.buttonBack.x,this.buttonBack.y,this.width,27);
}

baa._debug.window.drawData = function () {
	//TODO: Zorg ervoor dat dit niet meer in draw staat. Veel shit wordt hier gemaakt
	//en geupdate, wat in de update loop moet. Bovendien zorgt het voor die bug
	//die er voor zorgt dat je op dingen achteraan eerst klikt. Dank u!
	baa.graphics.setScissor(this.x,this.y,this.width,this.height);
	var i = 0;

	this.longestKeyWord = 0;

	for (var key in this.obj) {
		if (this.obj[key] == undefined) {
			if (key == "") {
				delete(this.obj[key]);
			}
		}
		var type = typeof(this.obj[key]);
		var sbstr = key.substring(0,1);
		var value = this.obj[key];
		var rect = baa.rect.new();
		
		if (type == "number") {
			//We don't want long decimals.
			value = Math.floor(value*100)/100;
		}
		else if (type == "string") {
			value = '"' + value + '"';
		}
		else if (type == "object") {
			if (Class.isClass(this.obj[key])) {
				value = this.obj[key].type();
			}
			else if (Array.isArray(this.obj[key])) {
				type = "array"
				value = "Array (" + this.obj[key].length + ")";
			}
		}

		if (type != "function" /* && this.obj[key]!=undefined */) {
			if (sbstr == "_" && this.showPrivates || sbstr != "_" ) {
				baa.graphics.setAlpha(0.8);
				baa.graphics.setColor(baa.debug.types[type])
				var y = this.getDataY(i) - 3;
				rect.set(this.x,y,this.width,this.textHeightMargin);
				if (y > this.y + 40 && y < this.y + this.height) {
					rect.draw("fill");
					if (!this.resizing) {
						if (rect.overlaps(baa.mouse)) {
							this.selectorY = rect.y;
							if (baa.mouse.isPressed("l") || baa.mouse.isPressed("m")) {
								var shouldBreak = this.clickedOnKey(key,type);
								// baa.mouse.catchPressed("l");
								// baa.mouse.catchPressed("m");
								if (shouldBreak) {
									break;
								}
							}
						}
					}
					baa.graphics.setColor(255,255,255,1)
					baa.graphics.print(key, this.x+10, this.getDataY(i));
					if (this.editing && this.editKey == key) {
						baa.graphics.print(this.editValue + (this.editTimer > 0.75 ? "_" : ""), this.x + this.keysWidth + 10, this.getDataY(i));
					}
					else {
						baa.graphics.print("" + value, this.x + this.keysWidth + 10, this.getDataY(i));
					}
					this.keysWidth = Math.max(this.keysWidth,baa.graphics.getTextWidth(key) + 10);
				}
				i++;
			}
		}
	}

	this.numberOfValues = i;

	baa.graphics.setScissor();
}

baa._debug.window.drawSelector = function () {
	if (this.selectorY > this.y + 40) {
		baa.graphics.setAlpha(0.4);
		baa.graphics.setColor(255,255,255);
		baa.graphics.rectangle("fill",this.x,this.selectorY,this.width,this.textHeightMargin);
		baa.graphics.setAlpha(1);
	}
}

baa._debug.window.getDataY = function (i) {
	return this.y - this.scrollHeight + this.textHeightMargin * i + this.dataY;
}

baa._debug.window.setPosition = function (x,y) {
	this.x = x-this.width/2;
	this.y = y-this.titleBar.height/2;
	this.titleBar.x = this.x;
	this.titleBar.y = this.y;

	this.buttonBack.x = this.x
	this.buttonBack.y = this.y + this.dataY / 2.5;

	this.buttonPrivate.x = this.x + 25;
	this.buttonPrivate.y = this.y + this.dataY / 2.5;

	this.buttonClose.x = this.x + 50;
	this.buttonClose.y = this.y + this.dataY / 2.5;
}

baa._debug.window.mousepressed = function (button,x,y) {
	if (button == "wd") {
		if (this.scrollLimit > 0) {
			this.scrollHeight = Math.min(this.scrollHeight + 20, this.scrollLimit);
		}
	}
	else if (button == "wu") {
		this.scrollHeight = Math.max(this.scrollHeight - 20, 0);
	}
}

baa._debug.window.keypressed = function (key) {
	if (this.editing) {
		if (key == "return") {
			this.confirmEdit();
		}
		else if (key == "escape") {
			this.cancelEdit();
		}
		else if (this.editType == "number") {
			this.pressNumber(key);
		}
		else if (this.editType == "string") {
			this.pressString(key);
		}
	}
	else if (key == "return") {
		if (this.editKey != "") {
			this.editing = true
		}
	}
}

baa._debug.window.pressNumber = function (key) {
	if (!isNaN(key)) {
		this.editValue = this.editValue + key;
	}
	else {
		if (key == "backspace") {
			this.editValue = this.editValue.substring(0,this.editValue.length-1);
		}
		else if (key == "." && this.editValue.length > 0 && this.editValue.indexOf(".") == -1 && this.editValue.indexOf("-") < this.editValue.length-1) {
			this.editValue = this.editValue + ".";
		}
		else if (key == "-" && this.editValue.length == 0) {
			this.editValue = this.editValue + "-";
		} 
	}
}

baa._debug.window.pressString = function (key) {
	if (key.length == 1) {
		if (baa.keyboard.isDown("shift")) {
			this.editValue = this.editValue + key.toUpperCase();
		}
		else {
			this.editValue = this.editValue + key;
		}
	}
	else {
		if (key == "backspace") {
			this.editValue = this.editValue.substring(0,this.editValue.length-1);
		}
	}
}


baa._debug.window.clickedOnKey = function (key,type,pressed) {
	baa.mouse.catchPressed("l");
	if (type == "boolean") {
		this.obj[key] = !this.obj[key];
		this.cancelEdit();
		return false;
	}
	else if (type == "number" || type == "string") {
		if (key == this.editKey && this.editing) {
			this.editValue = "";
			return false;
		}
		else {
			if (this.editing) { this.cancelEdit(); }

			if (type == "number") {
				this.editValue = "" + Math.floor(this.obj[key]*100)/100;
			}
			else {
				this.editValue = "" + this.obj[key];
			}
			this.editType = type;
			this.editKey = key;
			this.editing = true;
			this.editOriginal = this.obj[key];
			return false;
		}
	}
	else if (type == "object" || type == "array") {
		if (baa.mouse.isPressed("m")) {
			baa.debug.watch(this.obj[key],key);
			baa.mouse.catchPressed("m");
			return false;
		}
		else {
			this.setObject(this.obj[key],key);
			return true;
		}
	}
}

baa._debug.window.setObject = function (obj,name) {
	this.cancelEdit();
	this.editKey = "";
	this.scrollHeight = 0;
	this.obj = obj;
	this.objects.push(obj);
	this.names.push(name);
}

baa._debug.window.goBackObject = function () {
	this.cancelEdit();
	this.editKey = "";
	this.scrollHeight = 0;
	if (this.objects.length > 1) {
		this.obj = this.objects[this.objects.length-2];
		this.objects.pop();
		this.names.pop();
	}
	else {
		this.obj = this.originalObject;
		this.names = [];
		this.objects = [];
	}
}

baa._debug.window.cancelEdit = function () {
	if (this.editing) {
		this.editing = false;
		this.obj[this.editKey] = this.editOriginal;
		this.editKey = "";
	}
}

baa._debug.window.confirmEdit = function () {
	if (this.editing) {
		if (this.editKey != "") {
			this.editing = false;
			if (this.editType == "number") {
				this.obj[this.editKey] = Number(this.editValue);
			}
			else {
				this.obj[this.editKey] = this.editValue;
			}
		}
	}
}

// baa._debug.window.draw

baa.debug = baa._debug.new();


//Oh en misschien ook object debug drawing (body rectangle shizzle, van die rode vierkanten)

//Zorg dat windows niet out of bounds kunnen. ( eh..)

//Button to see fps graph (????)


//TODO
////DEBUUGGG
//Make windows contain objects.
//Er is een main window, en door in het main window op variables te klikken
//met middle mouse knop open je een nieuw window.
//Het main window moet 'game' bevatten.


//List of stuff to add:
/*
baa.graphics.push and pop for colors, linewidth, all that stuff.

baa.button class



 */
