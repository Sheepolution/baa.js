Game = Class.extend("Game");

Game.init = function () {
	this.players = baa.group.new();
	this.players.add(
		Player.new(200,100)
	)
}

Game.update = function () {
	this.players.update();
}

Game.draw = function () {
	this.players.draw();
}