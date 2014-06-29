cc.sys.dump();

var SysMenu = cc.Layer.extend({
    _ship:null,

    init:function () {
        var bRet = false;

        if (this._super()) {
            this._size = cc.director.getWinSize(); // 获得游戏屏幕尺寸
            this.gameLayer = cc.Layer.create(); // 创建名为“gameLayer”的新图层
            this.addChild(this.gameLayer); //加在这个新图层

            var bg = cc.Sprite.create(res.s_HelloWorld_png); // 创建精灵加载图片“s_HelloWorld”
            //var bg = cc.Sprite.create(res.s_Jet); // 创建精灵加载图片“s_HelloWorld”
            //bg.anchorX = 0.5;
            //bg.anchorY = 0.5;
            //bg.x = this._size.width / 2;
            //bg.y = this._size.height / 2;
            this.gameLayer.addChild(bg, 1); //在gameLayer层上加载这个精灵

            bg.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点
            bg.setPosition(this._size.width / 2, this._size.height /2);// 设置位置


            var start01 = cc.Sprite.create(res.s_Menu, cc.rect(0, 0, 126, 33));
            var start02 = cc.Sprite.create(res.s_Menu, cc.rect(0, 33, 126, 33));
            var start03 = cc.Sprite.create(res.s_Menu, cc.rect(0, 2 * 33, 126, 33));
            var newGame = cc.MenuItemSprite.create(start01, start02, start03, this.onNewGame, this.gameLayer);

            var menu = cc.Menu.create(newGame);
            this.gameLayer.addChild(menu, 1, 2);
            menu.setPosition(this._size.width / 2, this._size.height / 2 + 100);


            //var audioEngine = cc.AudioEngine.getInstance();
            cc.audioEngine.playMusic("res/Sounds/background.wav",true);

            bRet = true;
        }
        return bRet;
    },

    onNewGame:function (pSender) {
        //load resources
        this._size = cc.director.getWinSize(); // 获得屏幕尺寸大小
        var scene = cc.Scene.create(); //创建新场景
        var gsl = new GameSceneLayer(); //创建新场景
        gsl.init(); // 初始化新图层
        scene.addChild(gsl,1); // 加载新场景

        var bgLayer = cc.Layer.create(); // 创建新层
        var bkPng = cc.Sprite.create(res.s_bg01); // 创建新精灵并加载图片

        bgLayer.addChild(bkPng); // 将精灵加在进层
        bkPng.setAnchorPoint(cc.p(0.5, 0.5)); // 设置锚点
        bkPng.setPosition(this._size.width / 2,this._size.height / 2); // 设施位置
        scene.addChild(bgLayer,0); //将层加载进场景

        //cc.director.replaceScene(cc.TransitionFade.create(1.2,scene));
        cc.director.runScene(cc.TransitionFade.create(1.2, scene));

        //add music
        //var musicStop = cc.AudioEngine.getInstance();
        //musicStop.stopMusic("res/Sounds/background.wav");
        cc.audioEngine.stopMusic();

        //var anotherMusicPlay = cc.AudioEngine.getInstance();
        //anotherMusicPlay.playMusic("res/Sounds/BGM.wav", true);
        cc.audioEngine.playMusic("res/sounds/BGM.wav",true);
    }



/*    onSettings:function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(SettingsLayer.create());
        cc.director.runScene(cc.TransitionFade.create(1.2, scene));
    },
    onAbout:function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(AboutLayer.create());
        cc.director.runScene(cc.TransitionFade.create(1.2, scene));
    },
    update:function () {
        if (this._ship.y > 480) {
            this._ship.x = Math.random() * winSize.width;
            this._ship.y = 10;
            this._ship.runAction( cc.MoveBy.create(
                parseInt(5 * Math.random(), 10),
                cc.p(Math.random() * winSize.width, this._ship.y + 480)));
        }
    },
    onButtonEffect:function(){
        if (MW.SOUND) {
            var s = cc.audioEngine.playEffect(res.buttonEffet_mp3);
        }
    }
*/
});

GameSceneLayer = cc.Layer.extend({

    isMouseDown: false,  // 鼠标反转：否
    helloImg: null,  // 设为全局变量，内容为“空”
    helloLabel: null, //设为全局变量，内容为“空”
    circle: null,  // 设为全局变量，内容为“空”
    sprite: null,  // 设为全局变量，内容为“空”
    _size: null,  // 设为全局变量，内容为“空”
    gameLayer: null,  // 设为全局变量，内容为“空”
    gameLayer02: null, // 设为全局变量，内容为“空”
    _jetSprite: null, // 设为全局变量，内容为“空”

    _targets:null,  // 设定敌机的全局变量

    _enemyBullet:null,

    lives01:null,   // 设定为全局变量
    number:null,   // 设定为全局变量
    score:0,  // 设定为全局变量，并赋值为0
    scoreBoard:null,  // 设定为全局变量


    init: function () {
        this._super();   //  必须调用父类init（）方法，很多bug都是由于没有调用父类init（）方法造成的
        this._size = cc.director.getWinSize();
        this.gameLayer02 = cc.Layer.create();
        this.addChild(this.gameLayer02);

        this._targets= []; // 敌机数组
        this.schedule(this.addTarget,0.5);  // 每0.5秒更新一次方法addTarget

        this._enemyBullet = [];  // 创建敌机子弹数组


        this.score = 0;
        this.scoreBoard =cc.LabelTTF.create(this.score,"Impact", 28);  // 创建这个字符，设置了字体和大小
        this.scoreBoard.setPosition(3 * this._size.width / 4,this._size.height - 40);  // 设置字体
        this.gameLayer02.addChild(this.scoreBoard, 6); // 加载进层

        this.number = 10; // 设立生命值为10
        this.lives01 = cc.LabelTTF.create(this.number,"Impact", 28);
        this.lives01.setPosition(this._size.width / 4,this._size.height - 40);
        this.gameLayer02.addChild(this.lives01, 5);

        this._jetSprite = cc.Sprite.create(res.s_Jet);
        this._jetSprite.setAnchorPoint(0.5, 0.5);
        this._jetSprite.setPosition(this._size.width / 2, this._size.height / 5);
        this._jetSprite.setScale(0.25);
        this.gameLayer02.addChild(this._jetSprite, 0);

        this.schedule(this.addBullet, 0.3); //  每0.3秒更新一次addBullet方法

        this.schedule(this.updateGame);  // 更新updateGame方法（未填入时间，则默认和游戏帧数频率相同）

        //this.setTouchEnabled(true);  // 设置触摸模式为：可用
        //this.setKeyboardEnabled(true);  // 设置键盘为：可用
        //this.setMouseEnabled(true);  // 设置鼠标为：可用

        this.setPosition(new cc.Point(0, 0));

        // accept touch now!
        if (cc.sys.capabilities.hasOwnProperty('keyboard'))
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    //MW.KEYS[key] = true;
                },
                onKeyReleased: function (key, event) {
                    //MW.KEYS[key] = false;
                }
            }, this);

        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    if (event.getButton() != undefined)
                        event.getCurrentTarget().processEvent(event);
                },
                onMouseDown: function (event) {

                },
                onMouseUp: function (event) {

                }
            }, this);

        if (cc.sys.capabilities.hasOwnProperty('touches')) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: function (touches, event) {
                    //event.getCurrentTarget().processEvent(touches[0]);
                }
            }, this);
        }



    },

    addBullet: function() {
        this._bullets = []; //  创建子弹数组


        var jetPosition = this._jetSprite.getPosition(); //  获得飞机位置
        var bulletDuration = 1;  //  子弹完成动作所需时间：1 秒（从屏幕底到屏幕顶）
        var bullet = cc.Sprite.create(res.s_bullets, cc.rect(0, 0, 33, 33));   //  获取在子弹图片内指定范围的内容
        bullet.setPosition(cc.p(jetPosition.x, jetPosition.y + bullet.getContentSize().height)); //  设定子弹位置，和飞机位置相同
        var timeScale = ((this._size.height - jetPosition.y - bullet.getContentSize().height / 2) / this._size.height); //  根据子弹出现的位置不同计算相应的子弹穿越时间
        var actionMove = cc.MoveTo.create(bulletDuration * timeScale, cc.p(jetPosition.x, this._size.height));  // 设定子弹动作
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished, this);// 设定子弹动作

        bullet.setTag(6); //  将子弹标记为“6”

        bullet.runAction(cc.Sequence.create(actionMove, actionMoveDone));//  运行子弹移动动作
        this._bullets.push(bullet);// 将子弹添加进数组
        this.gameLayer02.addChild(bullet, 0);  //  将子弹加载进层中},
    },

    processEvent: function (event) {
        //if (this._state == STATE_PLAYING) {
            var delta = event.getDelta();
            var curPos = cc.p(this._jetSprite.x, this._jetSprite.y);
            curPos = cc.pAdd(curPos, delta);
            curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(this._size.width, this._size.height));
            this._jetSprite.x = curPos.x;
            this._jetSprite.y = curPos.y;
            curPos = null;
        //}

    },
    /*processEvent:function (event) {
        var delta = event.getDelta();
        var curPos = this._jetSprite.getPosition();
        curPos = cc.pAdd(curPos, delta);
        curPos = cc.pClamp(curPos, cc.POINT_ZERO, cc.p(this._size.width, this._size.height));
        this._jetSprite.setPosition(curPos);
        //curPos = null;
    },*/ //这段代码是新的，但不能运行起来

    /*spriteMoveFinished:function(sprite){// 将元素移除出
        Layerthis.gameLayer02.removeChild(sprite,true);
        if(sprite.getTag()==6){// 把子弹从数组中移除
            var index = this._bullets.indexOf(sprite);  // 遍历数组中的子弹
            if(index > -1) {
                this._bullets.splice(index,1);  // 删除数组中的子弹
            }
        }
    }*/
    spriteMoveFinished:function(sprite){

        /*this.gameLayer02.removeChild(sprite, true);
        if(sprite.getTag()==6){

            var index = this._bullets.indexOf(sprite);
            if (index > -1) {
                this._bullets.splice(index, 1);
            }
        }*/  //修改前的代码

        this.gameLayer02.removeChild(sprite, true);
        if(sprite.getTag == 6){ // 如果目标的标签为6，则遍历子弹的数组，将里面的内容删除
            var index01 = this._bullets.indexOf(sprite);
            if(index01 > -1) {
                this._bullets.splice(index01, 1);
            } else if(sprite.getTag == 1){  // 如果目标标签为1，则遍历敌机数组，将里面的内容删除
                var index02 = this._targets.indexOf(sprite);
                if(index02 > -1) {
                    this._targets.splice(index02, 1);
                }
            } else if(sprite.getTag == 5){  // 如果目标标签为5，则遍历敌机子弹数组，将里面的内容删除
                var index03 = this._enemyBullet.indexOf(sprite);
                if(index03 > -1) {
                    this._enemyBullet.splice(index03, 1);
                }
            }
        }

    },

    addTarget:function(){
        var target = cc.Sprite.create(res.s_Jet); // 创建并载入敌机（图片和我放飞机一样）
        target.setScale(0.33); // 设置尺寸比例
        target.setRotation(180); // 设置角度，旋转180度
        var minRange = target.getContentSize().width / 2;  // 获得最小移动范围：图片尺寸的二分之一
        var maxRange = this._size.width -target.getContentSize().width / 2; // 获得最大移动范围：屏幕宽度减去图片尺寸的二分之一
        var showUpPosition = Math.random() * this._size.width;  // 随机出现地点

        var minDuration = 2.5;
        var maxDuration = 10.0;
        var differentDuration = maxDuration - minDuration;
        var actualDuration = Math.random() * differentDuration +minDuration;  //实际飞行时间

        target.setPosition(cc.p(showUpPosition,this._size.height)); // 设置敌机出现地点

        var actionMove = cc.MoveTo.create(actualDuration,cc.p(showUpPosition, 0 - target.getContentSize().height));
        var actionMoveDone =cc.CallFunc.create(this.spriteMoveFinished, this);

        target.runAction(cc.Sequence.create(actionMove,actionMoveDone));
        target.setTag(1);

        this._targets.push(target);
        this.gameLayer02.addChild(target, 0);


        var enemyBullet = cc.Sprite.create(res.s_bullets, cc.rect(0,50, 33, 70));
        enemyBullet.setRotation(180);
        var i;
        for(i in this._targets) {  // 遍历敌机数组，获取敌机位置，并赋值给敌机子弹
            var targetThisOne = this._targets[i];
            var targetPosition = targetThisOne.getPosition();
            enemyBullet.setPosition(targetPosition.x,targetPosition.y);
        }

        var enemyBulletDuration = 2;  // 子弹时间
        var enemyBulletTime = enemyBulletDuration *(targetPosition.y / this._size.height); // 实际子弹时间

        var ebActionMoveTo = cc.MoveTo.create(enemyBulletTime,cc.p(showUpPosition, -enemyBullet.getContentSize().height));
        var ebActionMoveDone =cc.CallFunc.create(this.spriteMoveFinished, this);

        enemyBullet.runAction(cc.Sequence.create(ebActionMoveTo,ebActionMoveDone)); // 子弹动作

        enemyBullet.setTag(5); // 设置子弹标签为5
        this._enemyBullet.push(enemyBullet); // 推入数组中
        this.gameLayer02.addChild(enemyBullet, 1); // 将子弹载入层中
    },

    updateGame: function(){
        var targets2Delete = [];   // 添加敌机删除数组，相撞的会被存储在这，之后删除
        var jetFighterRect = this._jetSprite.getBoundingBox();
        var i;
        var enemyBulletsDelete = [];   // 添加敌机子弹数组，相撞的会被存储在这，之后删除与敌机子弹碰撞，消除敌机子弹

        for(i in this._enemyBullet){  // 遍历敌机子弹
            var enemyBulletsKill = this._enemyBullet[i];  // 获取数组中的第i个子弹
            var enemyBulletRect = enemyBulletsKill.getBoundingBox(); // 获得相应子弹的图片边界
            if (cc.rectIntersectsRect(enemyBulletRect,jetFighterRect)){  // 判断敌机子弹图片是否和我方战机图片有交集的部分
                this.reduceLives();
                enemyBulletsDelete.push(enemyBulletsKill); // 将有交集的子弹送入敌机子弹删除数组
            }
            for(i in enemyBulletsDelete){  // 将敌机子弹删除数组中的内容删除
                var enemyBulletRemove = enemyBulletsDelete[i];
                var index =this._enemyBullet.indexOf(enemyBulletRemove);
                if(index > -1){
                    this._enemyBullet.splice(index, 1);
                }
                this.gameLayer02.removeChild(enemyBulletRemove);
            }
            enemyBulletsKill = null;
        }

            // 敌机与我方子弹|| 飞机碰撞，消除我方子弹|| 飞机和敌机
        for(i in this._targets){ // 遍历所有敌机
            var target = this._targets[i];   // 获取第i个敌机
            var targetRect = target.getBoundingBox(); // 获取相应敌机的图片边界
            var bullets2Delete = [];   // 我方子弹删除数组
            var targetRemove = [];  // 敌机删除数组
            if (cc.rectIntersectsRect(targetRect, jetFighterRect)){ // 判断敌机和我方战机是否有交集
                this.reduceLives();
                targetRemove.push(target);   // 将有交集的敌机送入数组中
            }
            for(i in targetRemove){ // 遍历删除数组中的内容并删除
                var targetAway = targetRemove[i];
                var index = this._targets.indexOf(targetAway);
                if(index > -1){
                    this._targets.splice(index, 1);
                }
                this.gameLayer02.removeChild(targetAway);
            }
            for(i in this._bullets){ // 子弹和敌机的碰撞检测，原理同上
                var bullet = this._bullets[i];
                var bulletRect = bullet.getBoundingBox();
                if(cc.rectIntersectsRect(bulletRect, targetRect)){
                    bullets2Delete.push(bullet);
                    this.score += 100;
                    this.scoreBoard.setString(this.score);
                }
            }
            if(bullets2Delete.length > 0){
                targets2Delete.push(target);
            }
            for(i in bullets2Delete){
                var bullet = bullets2Delete[i];
                var index = this._bullets.indexOf(bullet);
                if(index > -1){
                    this._bullets.splice(index, 1);
                }
                this.gameLayer02.removeChild(bullet);
            }
            bullets2Delete = null;
        }

        for(i in targets2Delete){
            var target = targets2Delete[i];
            var index = this._targets.indexOf(target);
            if(index > -1) {
                this._targets.splice(index, 1);
            }
            this.gameLayer02.removeChild(target);
        }
        targets2Delete = null;
    },

    reduceLives:function(){
        this.number -= 1;     // 调用这个方法时number数减1
        this.lives01.setString(this.number);  // 更新生命值数值

        if (this.number == 0){
            var gameOverScene = GameOverScene.create();// 创建结束场景
            cc.director.runScene(cc.TransitionProgressRadialCCW.create(1.2,gameOverScene));  // 场景转换代码

            //var musicStop = cc.AudioEngine.getInstance();
            //musicStop.stopMusic("res/Sounds/BGM.wav");
            cc.audioEngine.stopMusic();

        }  //老版本，运行有错误

        /*if (this.number == 0){
            var gameOverScene = cc.Scene.create();
            gameOverScene.addChild(GameOver.create());

            //cc.director.runScene(cc.TransitionProgressRadialCCW.create(1.2,gameOverScene));  // 场景转换代码
            cc.director.runScene(cc.TransitionFade.create(1.2,gameOverScene));  // 场景转换代码

        }*/
    }


});

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};


//
//for game over
var GameOverLayer = cc.LayerColor.extend({
    init:function(){
        this._super();
        //this.setColor(cc.c4(126, 126, 126, 126));
        this.setColor(cc.color(0, 255, 0, 126));

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