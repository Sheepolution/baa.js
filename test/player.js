Player = baa.entity.extend("Player");

Player.init = function (x,y) {
	Player.super.init(this,x,y);
	this.setImage("player");
	this.velocity.x = 300;
	this.velocity.y = 300;
}

Player.update = function () {
	Player.super.update(this);

	if (this.bottom() > 500) {
		Camera.shake();
		this.bottom(500);
		this.velocity.y = - this.velocity.y;
	}


	if (this.right() > 800) {
		Camera.shake();
		this.right(800);
		this.velocity.x = - this.velocity.x;
	}

	if (this.top() < 0) {
		Camera.shake();
		this.top(0);
		this.velocity.y = - this.velocity.y;
	}

	if (this.left() < 0) {
		Camera.shake();
		this.left(0);
		this.velocity.x = - this.velocity.x;
	}

	
}

// Player.draw = function () {
// 	shape = function () {
// 		baa.graphics.star("scissor",this.x,this.y,30,50,5);
// 	}
// 	baa.graphics.setScissor(shape,this);

// 	Player.super.draw(this);
// }