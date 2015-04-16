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
	t.height = 300;
}

baa.graphics.preload("png",
	"numbers",
	"logo",
	"button_big",
	"player"
);

baa.audio.preload("ogg",
	"theme"
);

baa.run();