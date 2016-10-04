cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        var self = this;
        var canvas = cc.director.getScene().getChildByName("Menu");
        var levelBtn = canvas.children;
        // 为菜单上的按钮绑定touch事件
        for(var i = 0; i < levelBtn.length; i++){
            if(levelBtn[i].name == "newGame"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    self.newGame();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                    self.newGame();
                });
            }
            if(levelBtn[i].name == "selectLevel"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    self.selectLevel();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                    self.selectLevel();
                });
            }
            if(levelBtn[i].name == "about"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    self.toAbout();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                    self.toAbout();
                });
            }
            if(levelBtn[i].name == "exit"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    cc.director.end();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                    cc.director.end();
                });
            }
        }
    },
    // 加载第一关
    newGame:function(){
         cc.director.loadScene("Level1");
    },
    //切换至关卡选择场景
    selectLevel:function(){
        cc.director.loadScene("LevelSelect");
    },
    //切换场景至about
    toAbout:function(){
        cc.director.loadScene("About");
    }
});
