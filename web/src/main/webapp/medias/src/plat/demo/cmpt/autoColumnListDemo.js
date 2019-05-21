var vm;
$(function () {

    vm = new Rxvm({
        el: '.base_box',
        data: {
            list: []
        },
        settings:{
            defaultNum: 2
        },
        config: config,
        methods: {
            addItem: function () {
                this.append("list", {sfyxSt: "VALID"});
            },
            removeItem: function (keypath) {
                this.set(keypath+".sfyxSt", "UNVALID");
            },
            changeNotNull:function(path,notNull){
                var item = this.get(path);
                for(var key in item){
                    if(item.hasOwnProperty(key) &&
                        key != "id" && key != "sfyxSt" && key != "order" && key != "unuse"){
                        if(notNull){
                            this.setConfig(path + "." + key, {rules: {checkSave: ["notNull"]},disabled:false});
                        }else{
                            this.setConfig(path + "." + key, {rules: {checkSave: []},disabled:true});
                        }
                    }
                }
            },
            useItem: function(keypath) {
                this.set(keypath+".unuse","");
                this.changeNotNull(keypath, true);
            },
            unuseItem: function(keypath){
                this.set(keypath+".unuse","1");
                this.changeNotNull(keypath, false);
            },
            computeItemOrder: function () {
                var list = this.get("list"),that = this;
                var order = 0;
                $.each(list, function (i, t) {
                    if (t.sfyxSt !== "UNVALID") {
                        that.set("list."+i+".order", order++);
                    }
                })
            },
            makeDefaultItem: function (){
                var num = this.$options.settings.defaultNum;
                var list = this.get("list") || [];
                if (num && list.length < num) {
                    for (var i = list.length; i < num; i++) {
                        this.addItem();
                    }
                }
            }
        },
        afterCreate: function () {
            this.makeDefaultItem();
            this.computeItemOrder();
            this.watch("list.*.sfyxSt", this.computeItemOrder);
        }
    });

    $("#save").click(function(){
        if(vm.ruleValidate()){
            var list = vm.getData(),useList = [];
            $.each(list,function(i,t){
                if(t.id){
                    useList.push(t);
                }else if(!t.unuse){
                    useList.push(t);
                }
            })
            console.log("保存数据为:"+JSON.stringify(useList));
        }
    })
});




