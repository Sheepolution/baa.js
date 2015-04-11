Game = Class.extend("Game");

Game.init = function () {
	this.players = baa.group.new();
	this.players.add(
		Player.new(300,200)
		// Player.new(300,60),
		// Player.new(300,54),
		// Player.new(300,80),
		// Player.new(300,120)
	)
	
	this.kaas = baa.rect.new(100,100,200,300);
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
	baa.graphics.setColor(255,0,0);
	this.kaas.draw();
}

