/**
 * Created by weiwenshen on 2014-06-29.
 */

/*
var GameOverLayer = cc.LayerColor.extend({
    init:function(){
        this._super();
        this.setColor(cc.c4(126, 126, 126, 126));

        var winSize = cc.director.getWinSize();
        var _label = cc.LabelTTF.create("GameOver","Arial", 60);
        _label.setPosition(cc.p(winSize.width / 2,winSize.height / 2));
        this.addChild(_label);
        return true;
    }
})

GameOverLayer.create = function(){
    var gameOverLayer = new GameOverLayer;
    if(gameOverLayer && gameOverLayer.init()){
        return gameOverLayer;
    }
    return null;
}

var GameOverScene = cc.Scene.extend({
    _layer:null,
    init:function(){
        this._layer = GameOverLayer.create();
        this.addChild(this._layer);
        return true;
    }
})


GameOverScene.create = function(){
    var scene = new GameOverScene;
    if(scene && scene.init()){
        return scene;
    }
    return null;
}
*/
/*
var GameOver = cc.Layer.extend({

    init:function () {
        var bRet = false;

        this._super();
        this.setColor(cc.c4(126, 126, 126, 126));

        var winSize = cc.director.getWinSize();
        var _label = cc.LabelTTF.create("GameOver","Arial", 60);
        _label.setPosition(cc.p(winSize.width / 2,winSize.height / 2));
        this.addChild(_label);
        return true;
    }

});

GameOver.create = function () {
    var sg = new GameOver();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameOver.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameOver.create();
    scene.addChild(layer);
    return scene;
};
*/