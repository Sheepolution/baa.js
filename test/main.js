baa.load = function () {
	game = Game.new();
	baa.debug.set(game);
}

baa.update = function () {
	game.update();
}

baa.draw = function () {
	game.draw();
}

baa.config = function (t) {

}

baa.graphics.preload ("png",
	"numbers"
);

baa.run();