require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BackToMenu":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'be768etGvBM76YCnp3Y2TYX', 'BackToMenu');
// Script\BackToMenu.js

cc.Class({
    "extends": cc.Component,

    properties: {},
    onLoad: function onLoad() {
        // 切换至菜单场景
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            cc.director.loadScene("Menu");
        });
    }

});

cc._RFpop();
},{}],"BarrierShake ":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5195dE9v5JDOLP/5wTsZgj8', 'BarrierShake ');
// Script\BarrierShake .js

cc.Class({
    "extends": cc.Component,

    properties: {
        moveDuration: 0.5,
        moveMaxX: 0,
        moveMaxY: 0
    },
    onLoad: function onLoad() {
        // 上下振动动作
        var move = cc.moveBy(this.moveDuration, cc.p(this.moveMaxX, this.moveMaxY));
        var moveReverse = move.reverse();
        this.node.runAction(cc.repeatForever(cc.sequence(move, moveReverse)));
    }
});

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7ddefBeJ/FGCp3/3upYv9hX', 'Game');
// Script\Game.js

cc.Class({
    "extends": cc.Component,

    properties: {
        //方块角色
        playerPrefab: {
            "default": null,
            type: cc.Prefab
        },
        // 碰撞后溅射的小方块
        bongPrefab: {
            "default": null,
            type: cc.Prefab
        },
        // 关卡进度显示
        levelPrefab: {
            "default": null,
            type: cc.Prefab
        },
        // 返回菜单按钮
        toMenuPrefab: {
            "default": null,
            type: cc.Prefab
        },
        //方块移动方向
        direction: 1,
        //方块在该场景中所在的层数
        level: 1,
        //游戏现在所在的关卡数
        gameLevel: 1
    },
    onLoad: function onLoad() {
        // 打开碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        // 得到当前的关卡数
        var levelCur = cc.director.getScene().children[0].name;
        this.gameLevel = parseInt(levelCur.replace("Level", ""));

        var self = this;
        //取得背景容器
        var bgcontainer = this.node.getChildByName("bgcontainer");
        this.bg1 = bgcontainer.getChildByName("bg1");
        this.bg2 = bgcontainer.getChildByName("bg2");
        this.bg3 = bgcontainer.getChildByName("bg3");

        //创建cube
        this.createPlayer(-this.node.width / 2, this.node.height / 6 + 20);
        this.player.getComponent('Player').mediaWidth = this.node.width;
        this.player.getComponent('Player').mediaHeight = this.node.height;

        // 第6关之后方块移动加速
        if (this.gameLevel >= 6) {
            this.player.getComponent('Player').moveDuration = 2.5;
        }

        // 位于菜单场景中特定的快速移动
        if (levelCur == "Menu") {
            this.gameLevel = 0;
            this.player.getComponent('Player').moveDuration = 1;
        }
        // 方块移动
        this.movePlayer(this.direction);

        if (this.gameLevel > 0) {
            // 显示关卡进度
            var levelPrefab = cc.instantiate(this.levelPrefab);
            this.node.addChild(levelPrefab);
            levelPrefab.setPosition(cc.p(0, 290));
            levelPrefab.color = this.bg2.color;
            levelPrefab.getComponent(cc.Label).string = this.gameLevel + "/10";
            //显示返回菜单
            var toMenuPrefab = cc.instantiate(this.toMenuPrefab);
            this.node.addChild(toMenuPrefab);
            toMenuPrefab.setPosition(cc.p(420, 290));
            toMenuPrefab.color = this.bg2.color;
        } else {
            // 菜单场景中动画显示about按钮
            var about = this.node.getChildByName("about");
            setTimeout(function () {
                about.runAction(cc.moveBy(0.3, cc.p(0, -80)).easing(cc.easeCubicActionOut()));
            }, 1000);
        }

        //设置小方块初始颜色
        this.player.color = this.bg2.color;

        // 监听方块成功走完一层的事件
        this.node.on("moveEnd", function () {
            self.level++;
            if (self.level > 3) {
                self.gameOver();
            } else {
                self.direction = -self.direction;
                self.restart(self.level);
            }
        });
        // 监听方块碰撞事件
        this.node.on("collision", function (e) {
            var x = e.target.x;
            var y = e.target.y;
            self.toBong(x, y);
            self.restart(self.level);
        });
        //监听屏幕触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            self.touch();
        });
    },
    // 屏幕触摸时小方块跳跃
    touch: function touch() {
        this.player.getComponent('Player').jump();
    },
    // 移动方块函数
    movePlayer: function movePlayer(direction) {
        this.player.getComponent('Player').goMove(direction);
    },
    //创建方块角色函数
    createPlayer: function createPlayer(x, y) {
        this.player = cc.instantiate(this.playerPrefab);
        this.node.addChild(this.player);
        this.player.setPosition(cc.p(x, y));
    },
    // 创建碰撞碎片函数
    createBong: function createBong(x, y) {
        var bong = cc.instantiate(this.bongPrefab);
        this.node.addChild(bong);
        bong.setPosition(cc.p(x, y));
        this.bongDestroy(bong);
        bong.color = this.player.color;
        return bong;
    },
    // 碰撞产生碎片
    toBong: function toBong(x, y) {
        var n = parseInt(Math.random() * 10 + 5);
        for (var i = 0; i < n; i++) {
            var length = Math.random() * 150 + 80;
            var deg = Math.random() * 360;
            var vx = length * Math.cos(deg);
            var vy = length * Math.sin(deg);
            var move = cc.moveBy(1, cc.p(vx, -vy)).easing(cc.easeCubicActionOut());
            var scale = cc.scaleBy(1, 0.2, 0.2);
            this.createBong(x, y).runAction(move);
        }
    },
    // 销毁碰撞碎片
    bongDestroy: function bongDestroy(bong) {
        var time = Math.random() * 300 + bong.getComponent('bong').endTime * 1000;
        setTimeout(function () {
            bong.destroy();
        }, time);
    },
    // 重新开始该层
    restart: function restart(level) {
        this.player.destroy();
        this.createPlayer(-(this.direction * this.node.width / 2 + this.player.width / 2), this.node.height / 2 - level * this.node.height / 3 + 20);
        this.player.getComponent('Player').mediaWidth = this.node.width;
        this.player.getComponent('Player').mediaHeight = this.node.height;
        if (this.gameLevel >= 6) {
            this.player.getComponent('Player').moveDuration = 2.5;
        }
        if (this.gameLevel === 0) {
            this.player.getComponent('Player').moveDuration = 1;
        }
        this.movePlayer(this.direction);
        if (level == 1 || level == 3) {
            //设置小方块颜色
            this.player.color = this.bg2.color;
        }
        if (level == 2) {
            //设置小方块颜色
            this.player.color = this.bg3.color;
        }
    },
    gameOver: function gameOver() {
        // 进入下一关卡
        if (this.gameLevel !== 0) {
            this.gameLevel++;
            cc.director.loadScene('Level' + this.gameLevel);
        } else {
            this.player.destroy();
        }
    }

});

cc._RFpop();
},{}],"LevelSelect":[function(require,module,exports){
"use strict";
cc._RFpush(module, '937beUaNDRKHqXyt5Jj+Oe7', 'LevelSelect');
// Script\LevelSelect.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var canvas = cc.director.getScene().getChildByName("LevelSelect");
        var levelBtn = canvas.children;
        //为关卡选择场景里的按钮绑定touch事件，点击后跳转至相应关卡
        for (var i = 0; i < levelBtn.length; i++) {
            if (levelBtn[i].name == "levelButton") {
                levelBtn[i].on(cc.Node.EventType.TOUCH_END, function (e) {
                    var btn = e.target;
                    var levelNum = btn.getChildByName("levelNum").getComponent(cc.Label).string;
                    cc.director.loadScene("Level" + levelNum);
                });
            }
            if (levelBtn[i].name == "backButton") {
                levelBtn[i].on(cc.Node.EventType.TOUCH_END, function (e) {
                    cc.director.loadScene("Menu");
                });
            }
        }
    }
});

cc._RFpop();
},{}],"Menu":[function(require,module,exports){
"use strict";
cc._RFpush(module, '766c2L9UN5PR5SLhjS01hQJ', 'Menu');
// Script\Menu.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var self = this;
        var canvas = cc.director.getScene().getChildByName("Menu");
        var levelBtn = canvas.children;
        // 为菜单上的按钮绑定touch事件
        for (var i = 0; i < levelBtn.length; i++) {
            if (levelBtn[i].name == "newGame") {
                levelBtn[i].on(cc.Node.EventType.TOUCH_END, function (e) {
                    self.newGame();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END, function (e) {
                    self.newGame();
                });
            }
            if (levelBtn[i].name == "selectLevel") {
                levelBtn[i].on(cc.Node.EventType.TOUCH_END, function (e) {
                    self.selectLevel();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END, function (e) {
                    self.selectLevel();
                });
            }
        }
    },
    // 加载第一关
    newGame: function newGame() {
        cc.director.loadScene("Level1");
    },
    //切换至关卡选择场景
    selectLevel: function selectLevel() {
        cc.director.loadScene("LevelSelect");
    }
});

cc._RFpop();
},{}],"Player":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cf1a39AvjJN/o8IuN1l7IhH', 'Player');
// Script\Player.js

cc.Class({
    'extends': cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0.35,
        moveDuration: 3.4,
        allowJump: true,
        originY: 0,
        mediaWidth: 0,
        mediadHeight: 0,
        pointPrefab: {
            'default': null,
            type: cc.Prefab
        }
    },
    onLoad: function onLoad() {
        this.jumpAction = this.setJumpAction();
        this.setInputControl();
    },
    jump: function jump() {
        if (this.allowJump) {
            this.node.runAction(this.jumpAction);
        }
    },
    goMove: function goMove(direction) {
        this.moveAction = this.setMoveAction(direction);
        this.node.runAction(this.moveAction);
    },
    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var jumpRotate = cc.rotateBy(this.jumpDuration * 2, 180, 180);
        var callback = cc.callFunc(function () {
            this.allowJump = true;
        }, this);
        var forbidJump = cc.callFunc(function () {
            this.allowJump = false;
        }, this);

        return cc.spawn(jumpRotate, cc.sequence(forbidJump, jumpUp, jumpDown, callback));
    },
    // 设置移动动画
    setMoveAction: function setMoveAction(direction) {
        var moveToRight = cc.moveBy(this.moveDuration, cc.p((this.mediaWidth + this.node.width) * direction, 0));
        var moveEnd = cc.callFunc(function () {
            this.node.dispatchEvent(new cc.Event.EventCustom('moveEnd', true));
        }, this);
        return cc.sequence(moveToRight, moveEnd);
    },
    setInputControl: function setInputControl() {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.space:
                        self.jump();
                        break;
                }
            }
        }, self.node);
    },
    // 监听方块碰撞
    onCollisionEnter: function onCollisionEnter(other, self) {
        if (other.node.name == "barrier") {
            // 碰撞障碍
            this.node.dispatchEvent(new cc.Event.EventCustom('collision', true));
        } else {
            // 接触到point或者星星
            this.pointGain(other.node);
        }
    },
    //接触到point或者星星
    pointGain: function pointGain(point) {
        var move = cc.moveBy(0.2, cc.p(0, 30)).easing(cc.easeCubicActionOut());
        var scale = cc.scaleTo(0.2, 1.5, 1.5).easing(cc.easeCubicActionOut());
        var fade = cc.fadeTo(0.2, 0);
        var callback = cc.callFunc(function () {
            point.destroy();
        }, this);
        point.runAction(cc.sequence(cc.spawn(move, scale, fade), callback));
    }
});

cc._RFpop();
},{}],"Point":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7db100GFLRAQKGLy56O8/eT', 'Point');
// Script\Point.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // 控制移动的barrier
        targetBarrier: {
            "default": null,
            type: cc.Node
        },
        moveX: 0,
        moveY: 0,
        moveDuration: 0,
        destroyThen: false
    },
    onLoad: function onLoad() {},
    onCollisionEnter: function onCollisionEnter(other, self) {
        var _this = this;
        if (other.node.name == "cube") {
            var barrier = this.targetBarrier;
            var callback = cc.callFunc(function () {
                if (_this.destroyThen) {
                    barrier.destroy();
                }
            }, this);
            if (barrier) {
                var move = cc.moveBy(this.moveDuration, cc.p(this.moveX, this.moveY)).easing(cc.easeCubicActionOut());
                barrier.runAction(cc.sequence(move, callback));
            }
        }
    }
});

cc._RFpop();
},{}],"Rotate":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd1184d2sNNN2LAlYAc91c7n', 'Rotate');
// Script\Rotate.js

cc.Class({
    "extends": cc.Component,

    properties: {},
    onLoad: function onLoad() {
        // 旋转
        var rotate = cc.rotateBy(1.5, 360, 360);
        this.node.runAction(cc.repeatForever(rotate));
    }

});

cc._RFpop();
},{}],"ToAbout":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a69e0gKaYBLWpS+EqCrp0Gc', 'ToAbout');
// Script\ToAbout.js

cc.Class({
    "extends": cc.Component,

    properties: {},
    onLoad: function onLoad() {
        // 切换至About场景
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            cc.director.loadScene("About");
        });
    }

});

cc._RFpop();
},{}],"bong":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dcfb3ilwWlHBpVD0uMxm7mJ', 'bong');
// Script\bong.js

cc.Class({
    "extends": cc.Component,

    properties: {
        startTime: 0,
        endTime: 1,
        minScale: 0.2
    },

    onLoad: function onLoad() {},
    // 小方块溅射时更新其透明度和缩小
    update: function update(dt) {
        var minOpacity = 0;
        this.startTime += dt;
        var Ratio = 1 - this.startTime / this.endTime;
        this.node.opacity = minOpacity + Math.floor(Ratio * (255 - minOpacity));
        this.node.scaleX = this.minScale + Ratio * (1 - this.minScale);
        this.node.scaleY = this.node.scaleX;
    }
});

cc._RFpop();
},{}]},{},["BarrierShake ","Menu","Point","Game","LevelSelect","ToAbout","BackToMenu","Player","Rotate","bong"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIlNjcmlwdC9CYWNrVG9NZW51LmpzIiwiU2NyaXB0L0JhcnJpZXJTaGFrZSAuanMiLCJTY3JpcHQvR2FtZS5qcyIsIlNjcmlwdC9MZXZlbFNlbGVjdC5qcyIsIlNjcmlwdC9NZW51LmpzIiwiU2NyaXB0L1BsYXllci5qcyIsIlNjcmlwdC9Qb2ludC5qcyIsIlNjcmlwdC9Sb3RhdGUuanMiLCJTY3JpcHQvVG9BYm91dC5qcyIsIlNjcmlwdC9ib25nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYmU3NjhldEd2Qk03NllDbnAzWTJUWVgnLCAnQmFja1RvTWVudScpO1xuLy8gU2NyaXB0XFxCYWNrVG9NZW51LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIOWIh+aNouiHs+iPnOWNleWcuuaZr1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJNZW51XCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTE5NWRFOXY1SkRPTFAvNXdUc1pnajgnLCAnQmFycmllclNoYWtlICcpO1xuLy8gU2NyaXB0XFxCYXJyaWVyU2hha2UgLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBtb3ZlRHVyYXRpb246IDAuNSxcbiAgICAgICAgbW92ZU1heFg6IDAsXG4gICAgICAgIG1vdmVNYXhZOiAwXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy8g5LiK5LiL5oyv5Yqo5Yqo5L2cXG4gICAgICAgIHZhciBtb3ZlID0gY2MubW92ZUJ5KHRoaXMubW92ZUR1cmF0aW9uLCBjYy5wKHRoaXMubW92ZU1heFgsIHRoaXMubW92ZU1heFkpKTtcbiAgICAgICAgdmFyIG1vdmVSZXZlcnNlID0gbW92ZS5yZXZlcnNlKCk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShtb3ZlLCBtb3ZlUmV2ZXJzZSkpKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzdkZGVmQmVKL0ZHQ3AzLzN1cFl2OWhYJywgJ0dhbWUnKTtcbi8vIFNjcmlwdFxcR2FtZS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy/mlrnlnZfop5LoibJcbiAgICAgICAgcGxheWVyUHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICAvLyDnorDmkp7lkI7muoXlsITnmoTlsI/mlrnlnZdcbiAgICAgICAgYm9uZ1ByZWZhYjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5YWz5Y2h6L+b5bqm5pi+56S6XG4gICAgICAgIGxldmVsUHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICAvLyDov5Tlm57oj5zljZXmjInpkq5cbiAgICAgICAgdG9NZW51UHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICAvL+aWueWdl+enu+WKqOaWueWQkVxuICAgICAgICBkaXJlY3Rpb246IDEsXG4gICAgICAgIC8v5pa55Z2X5Zyo6K+l5Zy65pmv5Lit5omA5Zyo55qE5bGC5pWwXG4gICAgICAgIGxldmVsOiAxLFxuICAgICAgICAvL+a4uOaIj+eOsOWcqOaJgOWcqOeahOWFs+WNoeaVsFxuICAgICAgICBnYW1lTGV2ZWw6IDFcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICAvLyDmiZPlvIDnorDmkp7ns7vnu59cbiAgICAgICAgdmFyIG1hbmFnZXIgPSBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCk7XG4gICAgICAgIG1hbmFnZXIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgLy8g5b6X5Yiw5b2T5YmN55qE5YWz5Y2h5pWwXG4gICAgICAgIHZhciBsZXZlbEN1ciA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuY2hpbGRyZW5bMF0ubmFtZTtcbiAgICAgICAgdGhpcy5nYW1lTGV2ZWwgPSBwYXJzZUludChsZXZlbEN1ci5yZXBsYWNlKFwiTGV2ZWxcIiwgXCJcIikpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy/lj5blvpfog4zmma/lrrnlmahcbiAgICAgICAgdmFyIGJnY29udGFpbmVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiYmdjb250YWluZXJcIik7XG4gICAgICAgIHRoaXMuYmcxID0gYmdjb250YWluZXIuZ2V0Q2hpbGRCeU5hbWUoXCJiZzFcIik7XG4gICAgICAgIHRoaXMuYmcyID0gYmdjb250YWluZXIuZ2V0Q2hpbGRCeU5hbWUoXCJiZzJcIik7XG4gICAgICAgIHRoaXMuYmczID0gYmdjb250YWluZXIuZ2V0Q2hpbGRCeU5hbWUoXCJiZzNcIik7XG5cbiAgICAgICAgLy/liJvlu7pjdWJlXG4gICAgICAgIHRoaXMuY3JlYXRlUGxheWVyKC10aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm5vZGUuaGVpZ2h0IC8gNiArIDIwKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5tZWRpYVdpZHRoID0gdGhpcy5ub2RlLndpZHRoO1xuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLm1lZGlhSGVpZ2h0ID0gdGhpcy5ub2RlLmhlaWdodDtcblxuICAgICAgICAvLyDnrKw25YWz5LmL5ZCO5pa55Z2X56e75Yqo5Yqg6YCfXG4gICAgICAgIGlmICh0aGlzLmdhbWVMZXZlbCA+PSA2KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLm1vdmVEdXJhdGlvbiA9IDIuNTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOS9jeS6juiPnOWNleWcuuaZr+S4reeJueWumueahOW/q+mAn+enu+WKqFxuICAgICAgICBpZiAobGV2ZWxDdXIgPT0gXCJNZW51XCIpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZUxldmVsID0gMDtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnUGxheWVyJykubW92ZUR1cmF0aW9uID0gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyDmlrnlnZfnp7vliqhcbiAgICAgICAgdGhpcy5tb3ZlUGxheWVyKHRoaXMuZGlyZWN0aW9uKTtcblxuICAgICAgICBpZiAodGhpcy5nYW1lTGV2ZWwgPiAwKSB7XG4gICAgICAgICAgICAvLyDmmL7npLrlhbPljaHov5vluqZcbiAgICAgICAgICAgIHZhciBsZXZlbFByZWZhYiA9IGNjLmluc3RhbnRpYXRlKHRoaXMubGV2ZWxQcmVmYWIpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGxldmVsUHJlZmFiKTtcbiAgICAgICAgICAgIGxldmVsUHJlZmFiLnNldFBvc2l0aW9uKGNjLnAoMCwgMjkwKSk7XG4gICAgICAgICAgICBsZXZlbFByZWZhYi5jb2xvciA9IHRoaXMuYmcyLmNvbG9yO1xuICAgICAgICAgICAgbGV2ZWxQcmVmYWIuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLmdhbWVMZXZlbCArIFwiLzEwXCI7XG4gICAgICAgICAgICAvL+aYvuekuui/lOWbnuiPnOWNlVxuICAgICAgICAgICAgdmFyIHRvTWVudVByZWZhYiA9IGNjLmluc3RhbnRpYXRlKHRoaXMudG9NZW51UHJlZmFiKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0b01lbnVQcmVmYWIpO1xuICAgICAgICAgICAgdG9NZW51UHJlZmFiLnNldFBvc2l0aW9uKGNjLnAoNDIwLCAyOTApKTtcbiAgICAgICAgICAgIHRvTWVudVByZWZhYi5jb2xvciA9IHRoaXMuYmcyLmNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g6I+c5Y2V5Zy65pmv5Lit5Yqo55S75pi+56S6YWJvdXTmjInpkq5cbiAgICAgICAgICAgIHZhciBhYm91dCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImFib3V0XCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWJvdXQucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjMsIGNjLnAoMCwgLTgwKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKSk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v6K6+572u5bCP5pa55Z2X5Yid5aeL6aKc6ImyXG4gICAgICAgIHRoaXMucGxheWVyLmNvbG9yID0gdGhpcy5iZzIuY29sb3I7XG5cbiAgICAgICAgLy8g55uR5ZCs5pa55Z2X5oiQ5Yqf6LWw5a6M5LiA5bGC55qE5LqL5Lu2XG4gICAgICAgIHRoaXMubm9kZS5vbihcIm1vdmVFbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5sZXZlbCsrO1xuICAgICAgICAgICAgaWYgKHNlbGYubGV2ZWwgPiAzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5nYW1lT3ZlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRpcmVjdGlvbiA9IC1zZWxmLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3RhcnQoc2VsZi5sZXZlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyDnm5HlkKzmlrnlnZfnorDmkp7kuovku7ZcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwiY29sbGlzaW9uXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgeCA9IGUudGFyZ2V0Lng7XG4gICAgICAgICAgICB2YXIgeSA9IGUudGFyZ2V0Lnk7XG4gICAgICAgICAgICBzZWxmLnRvQm9uZyh4LCB5KTtcbiAgICAgICAgICAgIHNlbGYucmVzdGFydChzZWxmLmxldmVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8v55uR5ZCs5bGP5bmV6Kem5pG45LqL5Lu2XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi50b3VjaCgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIC8vIOWxj+W5leinpuaRuOaXtuWwj+aWueWdl+i3s+i3g1xuICAgIHRvdWNoOiBmdW5jdGlvbiB0b3VjaCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5qdW1wKCk7XG4gICAgfSxcbiAgICAvLyDnp7vliqjmlrnlnZflh73mlbBcbiAgICBtb3ZlUGxheWVyOiBmdW5jdGlvbiBtb3ZlUGxheWVyKGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLmdvTW92ZShkaXJlY3Rpb24pO1xuICAgIH0sXG4gICAgLy/liJvlu7rmlrnlnZfop5LoibLlh73mlbBcbiAgICBjcmVhdGVQbGF5ZXI6IGZ1bmN0aW9uIGNyZWF0ZVBsYXllcih4LCB5KSB7XG4gICAgICAgIHRoaXMucGxheWVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXJQcmVmYWIpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5wbGF5ZXIpO1xuICAgICAgICB0aGlzLnBsYXllci5zZXRQb3NpdGlvbihjYy5wKHgsIHkpKTtcbiAgICB9LFxuICAgIC8vIOWIm+W7uueisOaSnueijueJh+WHveaVsFxuICAgIGNyZWF0ZUJvbmc6IGZ1bmN0aW9uIGNyZWF0ZUJvbmcoeCwgeSkge1xuICAgICAgICB2YXIgYm9uZyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm9uZ1ByZWZhYik7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChib25nKTtcbiAgICAgICAgYm9uZy5zZXRQb3NpdGlvbihjYy5wKHgsIHkpKTtcbiAgICAgICAgdGhpcy5ib25nRGVzdHJveShib25nKTtcbiAgICAgICAgYm9uZy5jb2xvciA9IHRoaXMucGxheWVyLmNvbG9yO1xuICAgICAgICByZXR1cm4gYm9uZztcbiAgICB9LFxuICAgIC8vIOeisOaSnuS6p+eUn+eijueJh1xuICAgIHRvQm9uZzogZnVuY3Rpb24gdG9Cb25nKHgsIHkpIHtcbiAgICAgICAgdmFyIG4gPSBwYXJzZUludChNYXRoLnJhbmRvbSgpICogMTAgKyA1KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBNYXRoLnJhbmRvbSgpICogMTUwICsgODA7XG4gICAgICAgICAgICB2YXIgZGVnID0gTWF0aC5yYW5kb20oKSAqIDM2MDtcbiAgICAgICAgICAgIHZhciB2eCA9IGxlbmd0aCAqIE1hdGguY29zKGRlZyk7XG4gICAgICAgICAgICB2YXIgdnkgPSBsZW5ndGggKiBNYXRoLnNpbihkZWcpO1xuICAgICAgICAgICAgdmFyIG1vdmUgPSBjYy5tb3ZlQnkoMSwgY2MucCh2eCwgLXZ5KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IGNjLnNjYWxlQnkoMSwgMC4yLCAwLjIpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVCb25nKHgsIHkpLnJ1bkFjdGlvbihtb3ZlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8g6ZSA5q+B56Kw5pKe56KO54mHXG4gICAgYm9uZ0Rlc3Ryb3k6IGZ1bmN0aW9uIGJvbmdEZXN0cm95KGJvbmcpIHtcbiAgICAgICAgdmFyIHRpbWUgPSBNYXRoLnJhbmRvbSgpICogMzAwICsgYm9uZy5nZXRDb21wb25lbnQoJ2JvbmcnKS5lbmRUaW1lICogMTAwMDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBib25nLmRlc3Ryb3koKTtcbiAgICAgICAgfSwgdGltZSk7XG4gICAgfSxcbiAgICAvLyDph43mlrDlvIDlp4vor6XlsYJcbiAgICByZXN0YXJ0OiBmdW5jdGlvbiByZXN0YXJ0KGxldmVsKSB7XG4gICAgICAgIHRoaXMucGxheWVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQbGF5ZXIoLSh0aGlzLmRpcmVjdGlvbiAqIHRoaXMubm9kZS53aWR0aCAvIDIgKyB0aGlzLnBsYXllci53aWR0aCAvIDIpLCB0aGlzLm5vZGUuaGVpZ2h0IC8gMiAtIGxldmVsICogdGhpcy5ub2RlLmhlaWdodCAvIDMgKyAyMCk7XG4gICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnUGxheWVyJykubWVkaWFXaWR0aCA9IHRoaXMubm9kZS53aWR0aDtcbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5tZWRpYUhlaWdodCA9IHRoaXMubm9kZS5oZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLmdhbWVMZXZlbCA+PSA2KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ1BsYXllcicpLm1vdmVEdXJhdGlvbiA9IDIuNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nYW1lTGV2ZWwgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnUGxheWVyJykubW92ZUR1cmF0aW9uID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVQbGF5ZXIodGhpcy5kaXJlY3Rpb24pO1xuICAgICAgICBpZiAobGV2ZWwgPT0gMSB8fCBsZXZlbCA9PSAzKSB7XG4gICAgICAgICAgICAvL+iuvue9ruWwj+aWueWdl+minOiJslxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuY29sb3IgPSB0aGlzLmJnMi5jb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGV2ZWwgPT0gMikge1xuICAgICAgICAgICAgLy/orr7nva7lsI/mlrnlnZfpopzoibJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmNvbG9yID0gdGhpcy5iZzMuY29sb3I7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICAgICAgLy8g6L+b5YWl5LiL5LiA5YWz5Y2hXG4gICAgICAgIGlmICh0aGlzLmdhbWVMZXZlbCAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lTGV2ZWwrKztcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnTGV2ZWwnICsgdGhpcy5nYW1lTGV2ZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkzN2JlVWFORFJLSHFYeXQ1SmorT2U3JywgJ0xldmVsU2VsZWN0Jyk7XG4vLyBTY3JpcHRcXExldmVsU2VsZWN0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJMZXZlbFNlbGVjdFwiKTtcbiAgICAgICAgdmFyIGxldmVsQnRuID0gY2FudmFzLmNoaWxkcmVuO1xuICAgICAgICAvL+S4uuWFs+WNoemAieaLqeWcuuaZr+mHjOeahOaMiemSrue7keWumnRvdWNo5LqL5Lu277yM54K55Ye75ZCO6Lez6L2s6Iez55u45bqU5YWz5Y2hXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWxCdG4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChsZXZlbEJ0bltpXS5uYW1lID09IFwibGV2ZWxCdXR0b25cIikge1xuICAgICAgICAgICAgICAgIGxldmVsQnRuW2ldLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ0biA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGV2ZWxOdW0gPSBidG4uZ2V0Q2hpbGRCeU5hbWUoXCJsZXZlbE51bVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiTGV2ZWxcIiArIGxldmVsTnVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsZXZlbEJ0bltpXS5uYW1lID09IFwiYmFja0J1dHRvblwiKSB7XG4gICAgICAgICAgICAgICAgbGV2ZWxCdG5baV0ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJNZW51XCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3NjZjMkw5VU41UFI1U0xoalMwMWhRSicsICdNZW51Jyk7XG4vLyBTY3JpcHRcXE1lbnUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjYW52YXMgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiTWVudVwiKTtcbiAgICAgICAgdmFyIGxldmVsQnRuID0gY2FudmFzLmNoaWxkcmVuO1xuICAgICAgICAvLyDkuLroj5zljZXkuIrnmoTmjInpkq7nu5Hlrpp0b3VjaOS6i+S7tlxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsQnRuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobGV2ZWxCdG5baV0ubmFtZSA9PSBcIm5ld0dhbWVcIikge1xuICAgICAgICAgICAgICAgIGxldmVsQnRuW2ldLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXdHYW1lKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV2ZWxCdG5baV0uZ2V0Q2hpbGRCeU5hbWUoXCJMYWJlbFwiKS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV3R2FtZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxldmVsQnRuW2ldLm5hbWUgPT0gXCJzZWxlY3RMZXZlbFwiKSB7XG4gICAgICAgICAgICAgICAgbGV2ZWxCdG5baV0ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdExldmVsKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV2ZWxCdG5baV0uZ2V0Q2hpbGRCeU5hbWUoXCJMYWJlbFwiKS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0TGV2ZWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8g5Yqg6L2956ys5LiA5YWzXG4gICAgbmV3R2FtZTogZnVuY3Rpb24gbmV3R2FtZSgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiTGV2ZWwxXCIpO1xuICAgIH0sXG4gICAgLy/liIfmjaLoh7PlhbPljaHpgInmi6nlnLrmma9cbiAgICBzZWxlY3RMZXZlbDogZnVuY3Rpb24gc2VsZWN0TGV2ZWwoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxldmVsU2VsZWN0XCIpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnY2YxYTM5QXZqSk4vbzhJdU4xbDdJaEgnLCAnUGxheWVyJyk7XG4vLyBTY3JpcHRcXFBsYXllci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGp1bXBIZWlnaHQ6IDAsXG4gICAgICAgIGp1bXBEdXJhdGlvbjogMC4zNSxcbiAgICAgICAgbW92ZUR1cmF0aW9uOiAzLjQsXG4gICAgICAgIGFsbG93SnVtcDogdHJ1ZSxcbiAgICAgICAgb3JpZ2luWTogMCxcbiAgICAgICAgbWVkaWFXaWR0aDogMCxcbiAgICAgICAgbWVkaWFkSGVpZ2h0OiAwLFxuICAgICAgICBwb2ludFByZWZhYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmp1bXBBY3Rpb24gPSB0aGlzLnNldEp1bXBBY3Rpb24oKTtcbiAgICAgICAgdGhpcy5zZXRJbnB1dENvbnRyb2woKTtcbiAgICB9LFxuICAgIGp1bXA6IGZ1bmN0aW9uIGp1bXAoKSB7XG4gICAgICAgIGlmICh0aGlzLmFsbG93SnVtcCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbih0aGlzLmp1bXBBY3Rpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnb01vdmU6IGZ1bmN0aW9uIGdvTW92ZShkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5tb3ZlQWN0aW9uID0gdGhpcy5zZXRNb3ZlQWN0aW9uKGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5tb3ZlQWN0aW9uKTtcbiAgICB9LFxuICAgIHNldEp1bXBBY3Rpb246IGZ1bmN0aW9uIHNldEp1bXBBY3Rpb24oKSB7XG4gICAgICAgIC8vIOi3s+i3g+S4iuWNh1xuICAgICAgICB2YXIganVtcFVwID0gY2MubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy5wKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIC8vIOS4i+iQvVxuICAgICAgICB2YXIganVtcERvd24gPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnAoMCwgLXRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcbiAgICAgICAgdmFyIGp1bXBSb3RhdGUgPSBjYy5yb3RhdGVCeSh0aGlzLmp1bXBEdXJhdGlvbiAqIDIsIDE4MCwgMTgwKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5hbGxvd0p1bXAgPSB0cnVlO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdmFyIGZvcmJpZEp1bXAgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmFsbG93SnVtcCA9IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gY2Muc3Bhd24oanVtcFJvdGF0ZSwgY2Muc2VxdWVuY2UoZm9yYmlkSnVtcCwganVtcFVwLCBqdW1wRG93biwgY2FsbGJhY2spKTtcbiAgICB9LFxuICAgIC8vIOiuvue9ruenu+WKqOWKqOeUu1xuICAgIHNldE1vdmVBY3Rpb246IGZ1bmN0aW9uIHNldE1vdmVBY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBtb3ZlVG9SaWdodCA9IGNjLm1vdmVCeSh0aGlzLm1vdmVEdXJhdGlvbiwgY2MucCgodGhpcy5tZWRpYVdpZHRoICsgdGhpcy5ub2RlLndpZHRoKSAqIGRpcmVjdGlvbiwgMCkpO1xuICAgICAgICB2YXIgbW92ZUVuZCA9IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnbW92ZUVuZCcsIHRydWUpKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShtb3ZlVG9SaWdodCwgbW92ZUVuZCk7XG4gICAgfSxcbiAgICBzZXRJbnB1dENvbnRyb2w6IGZ1bmN0aW9uIHNldElucHV0Q29udHJvbCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyDmt7vliqDplK7nm5jkuovku7bnm5HlkKxcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuc3BhY2U6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmp1bXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc2VsZi5ub2RlKTtcbiAgICB9LFxuICAgIC8vIOebkeWQrOaWueWdl+eisOaSnlxuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIG9uQ29sbGlzaW9uRW50ZXIob3RoZXIsIHNlbGYpIHtcbiAgICAgICAgaWYgKG90aGVyLm5vZGUubmFtZSA9PSBcImJhcnJpZXJcIikge1xuICAgICAgICAgICAgLy8g56Kw5pKe6Zqc56KNXG4gICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2NvbGxpc2lvbicsIHRydWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOaOpeinpuWIsHBvaW505oiW6ICF5pif5pifXG4gICAgICAgICAgICB0aGlzLnBvaW50R2FpbihvdGhlci5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/mjqXop6bliLBwb2ludOaIluiAheaYn+aYn1xuICAgIHBvaW50R2FpbjogZnVuY3Rpb24gcG9pbnRHYWluKHBvaW50KSB7XG4gICAgICAgIHZhciBtb3ZlID0gY2MubW92ZUJ5KDAuMiwgY2MucCgwLCAzMCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIHZhciBzY2FsZSA9IGNjLnNjYWxlVG8oMC4yLCAxLjUsIDEuNSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcbiAgICAgICAgdmFyIGZhZGUgPSBjYy5mYWRlVG8oMC4yLCAwKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcG9pbnQuZGVzdHJveSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgcG9pbnQucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLnNwYXduKG1vdmUsIHNjYWxlLCBmYWRlKSwgY2FsbGJhY2spKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzdkYjEwMEdGTFJBUUtHTHk1Nk84L2VUJywgJ1BvaW50Jyk7XG4vLyBTY3JpcHRcXFBvaW50LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyDmjqfliLbnp7vliqjnmoRiYXJyaWVyXG4gICAgICAgIHRhcmdldEJhcnJpZXI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBtb3ZlWDogMCxcbiAgICAgICAgbW92ZVk6IDAsXG4gICAgICAgIG1vdmVEdXJhdGlvbjogMCxcbiAgICAgICAgZGVzdHJveVRoZW46IGZhbHNlXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIG9uQ29sbGlzaW9uRW50ZXIob3RoZXIsIHNlbGYpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG90aGVyLm5vZGUubmFtZSA9PSBcImN1YmVcIikge1xuICAgICAgICAgICAgdmFyIGJhcnJpZXIgPSB0aGlzLnRhcmdldEJhcnJpZXI7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmRlc3Ryb3lUaGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhcnJpZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgaWYgKGJhcnJpZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbW92ZSA9IGNjLm1vdmVCeSh0aGlzLm1vdmVEdXJhdGlvbiwgY2MucCh0aGlzLm1vdmVYLCB0aGlzLm1vdmVZKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcbiAgICAgICAgICAgICAgICBiYXJyaWVyLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShtb3ZlLCBjYWxsYmFjaykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkMTE4NGQyc05OTjJMQWxZQWM5MWM3bicsICdSb3RhdGUnKTtcbi8vIFNjcmlwdFxcUm90YXRlLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIOaXi+i9rFxuICAgICAgICB2YXIgcm90YXRlID0gY2Mucm90YXRlQnkoMS41LCAzNjAsIDM2MCk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihyb3RhdGUpKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYTY5ZTBnS2FZQkxXcFMrRXFDcnAwR2MnLCAnVG9BYm91dCcpO1xuLy8gU2NyaXB0XFxUb0Fib3V0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIOWIh+aNouiHs0Fib3V05Zy65pmvXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkFib3V0XCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZGNmYjNpbHdXbEhCcFZEMHVNeG03bUonLCAnYm9uZycpO1xuLy8gU2NyaXB0XFxib25nLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgIGVuZFRpbWU6IDEsXG4gICAgICAgIG1pblNjYWxlOiAwLjJcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcbiAgICAvLyDlsI/mlrnlnZfmuoXlsITml7bmm7TmlrDlhbbpgI/mmI7luqblkoznvKnlsI9cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB2YXIgbWluT3BhY2l0eSA9IDA7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lICs9IGR0O1xuICAgICAgICB2YXIgUmF0aW8gPSAxIC0gdGhpcy5zdGFydFRpbWUgLyB0aGlzLmVuZFRpbWU7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gbWluT3BhY2l0eSArIE1hdGguZmxvb3IoUmF0aW8gKiAoMjU1IC0gbWluT3BhY2l0eSkpO1xuICAgICAgICB0aGlzLm5vZGUuc2NhbGVYID0gdGhpcy5taW5TY2FsZSArIFJhdGlvICogKDEgLSB0aGlzLm1pblNjYWxlKTtcbiAgICAgICAgdGhpcy5ub2RlLnNjYWxlWSA9IHRoaXMubm9kZS5zY2FsZVg7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
