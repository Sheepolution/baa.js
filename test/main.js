baa.load = function () {
	baa.graphics.setBackgroundColor(0,0,0);
	game = Game.new();
	bla = 0;
	baa.debug.watch(game,"Game");

	// baa.debug.setActivate("a","s","q");
}

baa.update = function () {
	game.update();
	// print(baa.mouse.isPressed("l"));
}

baa.draw = function () {
	game.draw();
}

baa.config = function (t) {

}

baa.graphics.preload("png",
	"numbers",
	"logo",
	"button_big"
);

baa.audio.preload("ogg",
	"theme"
);

baa.run();