cc.game.onStart = function(){
    cc.view.adjustViewPort(true);

    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new SysMenu.scene());
    }, this);
};

cc.game.run();