Game = Class.extend("Game");

Game.init = function () {
	this.players = baa.group.new();
	this.players.add(
		Player.new(300,200)
	)

	// Timer.new(this,2,"once").onUpdate("lol");

	this.background = baa.sprite.new();
	this.background.setImage("logo",0,0,true);
	this.background.origin.set(0,0);
	this.background.scale.set(4,4);

	// Camera.setWorld(-100,-20,400,500);
	Camera.setFollow(this.players[0]);
	Camera.speed = 20;
}

Game.update = function () {
	this.players.update();
	// this.cameras.update();
}

Game.draw = function () {
	this.background.draw();
	this.players.draw();
}