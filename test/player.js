Player = baa.entity.extend("Player");

Player.init = function (x,y) {
	Player.super.init(this,x,y);
	// this.teleTimer = baa.timer.new();
	// this.initTween();
	this.setImage("logo")
	// this.twnmanger.to(2,{x:500},true).delay(0.2);
	baa.debug.watch(this,"Player");
	this.rotate = 1;

}

Player.update = function () {
	this.x -= 100 * dt;
}

// Player.draw = function () {
// 	// baa.graphics.setScissor(400,100,300,50)
// 	baa.graphics.rectangle("fill",this.x,this.y,100,100);
// 	// baa.graphics.pop();
// }

Player.teleport = function () {
	this.x = 0
}

Player.initTween = function () {
	Tween.to(this,0.5,{x:300}).ease("inout","back").to(0.2,{x:100}).to(0.1,{y:300}).to(1.5,{x:500}).onStart("changeBackgroundColor").ease("out","elastic").to(0.4,{y:100}).to(0.3,{x:100}).onComplete("initTween");
}

Player.changeBackgroundColor = function () {
	baa.graphics.setBackgroundColor(Math.random()*255,Math.random()*255,Math.random()*255);
}