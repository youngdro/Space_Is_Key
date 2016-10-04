cc.Class({
    extends: cc.Component,

    properties: {
        moveDuration:0.5,
        moveMaxX:0,
        moveMaxY:0,
    },
    onLoad: function () {
        // 上下振动动作
        var move = cc.moveBy(this.moveDuration,cc.p(this.moveMaxX,this.moveMaxY));
        var moveReverse = move.reverse();
        this.node.runAction(cc.repeatForever(cc.sequence(move,moveReverse)));
    },
});
