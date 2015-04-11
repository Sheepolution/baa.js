Player = baa.entity.extend("Player");

Player.init = function (x,y) {
	Player.super.init(this,x,y);
	this.setImage("logo");
	Tween.to(this,2,{x:600})
	.delay(1);
}

Player.update = function () {
	Player.super.update(this);
}