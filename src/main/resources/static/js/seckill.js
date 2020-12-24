/*
* 用于实现秒杀业务的js，这里使用模块化开发，它是一种类似面向对象的思想
* seckillObj 是一个json对象，里边有若干属性，这些属性可以是基本格式，也可以是json对象格式或函数格式
* 其中url和fun就是两个属性且是json对象类型
* url对象中可以拥有若干属性，这里的属性大多是函数类型，用于返回一个请求url地址路径起到了地址路径重用
* fun对象中可以拥有若干个属性，这里的属性大多数是函数类型，主要完成秒杀的业务逻辑控制
* */
var secKillObj={
    url:{
        getSystemTime:function () {
            return "/getSystemTime"
        },
        getRandomNameByGoodsId:function (goodsId) {
            return "/getRandomNameByGoodsId?goodsId="+goodsId;
        },
        secKill:function (goodsId, randomName,buyPrice) {
            return "/secKill?goodsId="+goodsId+"&randomName="+randomName+"buyPrice="+buyPrice;
        }
    },
    fun:{

        initSecKill:function (goodsId, startTime, endTime,buyPrice) {

            $.ajax({
                url:secKillObj.url.getSystemTime(),
                dataType:"json",
                type:"get",
                success:function (data) {
                    //alert(111)
                    /*统一错误逻辑控制*/
                    if (data.code!=0){
                        alert(data.message)
                        return false;
                    }
                    /*判断秒杀时间*/

                    var v_systemTime = data.result;
                    //alert(v_systemTime)
                    if (v_systemTime<startTime){
                        /*当前时间小于开始时间*/
                        //alert("活动还没有开始");
                        secKillObj.fun.secKillCountdown(goodsId,startTime,buyPrice);
                        return false;
                    }
                    if (v_systemTime>endTime){
                        /*当前时间小于开始时间*/
                        //alert("活动已经结束");
                        $("#secKillSpan").html('<span style="color: red">活动已经结束</span>')
                        return false;
                    }
                    //alert("可以秒杀")
                   secKillObj.fun.doSecKill(goodsId,buyPrice)
                },
                error:function () {
                    alert("系统忙，请稍后重试")
                }
            })
        },
        /**
         * 秒杀的倒计时函数，主要用在商品还没有开始时显示的倒计时时间
         * @param goodsId  当前商品的id
         * @param startTime 活动的开始时间
         *
         */
        secKillCountdown:function (goodsId,startTime,buyPrice) {
            //使用jquery的倒计时插件实现倒计时
            /* killTime倒计时的目标时间，取值为活动的开始时间(把startTime字符串转换为数字)*/
            var killTime = new Date(startTime*1);
            //使用任意Jquery对象来调用倒计时函数countdown
            //参数1 为目标函数
            //参数2 为回调函数：每秒钟会自动调用一次，用于更新页面计时
            $("#secKillSpan").countdown(killTime, function (event) {
                //时间格式
                var format = event.strftime('距秒杀开始还有: %D天 %H时 %M分 %S秒');
                //更新页面中某个Html元素内容
                $("#secKillSpan").html("<span style='color:red;'>"+format+"</span>");
            }).on('finish.countdown', function () {
                //倒计时结束后回调事件，已经开始秒杀，用户可以进行秒杀了，有两种方式：
                //1、刷新当前页面，千万不要刷新页面(一般不用)这样一定会出现高并发服务器可能直接宕机
                //location.reload();
                //或者2、调用秒杀开始的函数
                secKillObj.fun.doSecKill(goodsId,buyPrice)
            });
        },
        /**倒计时结束准备抢购按钮
         * 准备秒杀的函数,这里主要为按钮绑定点击事件
         * @param goodsId 当前商品id
         */
        doSecKill:function (goodsId,buyPrice) {
            $("#secKillSpan").html('<input type="button" value="立即抢购" id="secKillBut">')
            //按钮绑定事件
            $("#secKillBut").bind("click",function () {
                //设置按钮在本次访问中点击一次后不可用，让按钮不可用（刷新后就失效了）
                // 防止用户重复提交购买请求,这里不能100%拦截住用户的所有重复购买请求,只能拦截住一部分
                $(this).attr("disabled",true);
                $.ajax({
                    url:secKillObj.url.getRandomNameByGoodsId(goodsId),
                    dataType:"json",
                    type:"get",
                    success:function (data) {
                        //alert(111)
                        /*统一错误逻辑控制*/
                        if (data.code!=0){
                            alert(data.message)
                            return false;
                        }
                       var v_randomName = data.result;
                        //调用秒杀业务
                       secKillObj.fun.secKill(goodsId,v_randomName,buyPrice)


                    },
                    error:function () {
                        alert("系统忙，请稍后重试")
                    }
                })
            })
        },
        secKill:function (goodsId, randomName,buyPrice) {
            $.ajax({
                url:secKillObj.url.secKill(goodsId,randomName,buyPrice),
                dataType:"json",
                type:"get",
                success:function (data) {
                    /*统一错误逻辑控制*/
                    if (data.code!=0){
                        alert(data.message)
                        return false;
                    }
                    alert("下单成功--"+ data.code+"---"+data.result+data.message)

                },
                error:function () {
                    alert("系统忙，请稍后重试")
                }
        })
    }

}





