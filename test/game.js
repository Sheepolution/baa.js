Game = Class.extend("Game");

Game.init = function () {
	this.players = baa.group.new();
	this.players.add(
		Player.new(600,100)
		// Player.new(300,40),
		// Player.new(300,25),
		// Player.new(300,60),
		// Player.new(300,54),
		// Player.new(300,80),
		// Player.new(300,120)
	)

	// for (var i = 0; i < this.players.length; i++) {
	// 	print(this.players[i].y);
	// }

	// for (var i = 0; i < this.players.length; i++) {
	// 	print(this.players[i].y);
	// }	
}

Game.update = function () {
	this.players.update();
}

Game.draw = function () {
	this.players.draw();
}