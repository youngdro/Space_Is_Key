cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onLoad: function () {
        // 切换至菜单场景
        this.node.on(cc.Node.EventType.TOUCH_END,function(){
            cc.director.loadScene("Menu");
        });
    },
    
});
