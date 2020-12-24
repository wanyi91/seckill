package com.seckill.controller;

import com.seckill.commons.Constants;
import com.seckill.commons.ReturnObject;
import com.seckill.goods.model.Goods;
import com.seckill.service.GoodsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.List;

/**消费者
 * 接收浏览器请求
 * 20:25 2020/12/11
 * 岩
 */
@Controller
public class GoodsController {

    @Resource
    private GoodsService goodsService;
    //秒杀列表
    @RequestMapping("/")
    public String index(Model model){
        //拿到商品数据列表，要返回统一对象json
        ReturnObject<List<Goods>> returnObject = goodsService.getGoodsList();
        model.addAttribute("goodsList",returnObject.getResult());
        return "index";
    }

    //商品详情
    @RequestMapping("/goodsInfo")
    public String goodsInfo(Integer id,Model model){
        //拿到商品数据列表，要返回统一对象json
        ReturnObject<Goods> returnObject = goodsService.getGoodsById(id);
        model.addAttribute("goods",returnObject.getResult());
        return "goodsInfo";
    }

    //拿到系统时间
    @RequestMapping("/getSystemTime")
    public @ResponseBody Object getSystemTime(){
        //拿到商品数据列表，要返回统一对象json
        ReturnObject<Long> returnObject = new ReturnObject<Long>();
        returnObject.setResult(System.currentTimeMillis());
        returnObject.setMessage("获取系统时间成功");
        returnObject.setCode(Constants.OK);
        return returnObject;
    }
    //获取商品随机名
    @RequestMapping("/getRandomNameByGoodsId")
    public @ResponseBody Object getRandomNameByGoodsId(Integer goodsId){

        ReturnObject<String> returnObject = new ReturnObject<String>();
        ReturnObject<Goods> returnObject1 = goodsService.getGoodsById(goodsId);
        Goods goods = returnObject1.getResult();
        //进入表示根据主键没有获取商品，为了排除用户手动拼接的请求）
        if (goods==null){
            returnObject.setCode(Constants.ERROR);
            returnObject.setMessage("对不起，当前商品异常");
            returnObject.setResult(null);
            return returnObject;
        }
        //获取当前系统时间单位为毫秒
        long systemTime = System.currentTimeMillis();
        //进入if表示当前活动还没有开始（为了排除用户手动拼接的请求）
        if (systemTime<goods.getStartTime().getTime()){
            returnObject.setCode(Constants.ERROR);
            returnObject.setMessage("对不起，活动还没有开始");
            returnObject.setResult(null);
            return returnObject;
        }
        //进入if表示当前活动已经结束（为了排除用户手动拼接的请求或在抢购页面停留时间过久）
        if (systemTime>goods.getEndTime().getTime()){
            returnObject.setCode(Constants.ERROR);
            returnObject.setMessage("对不起，活动已经结束");
            returnObject.setResult(null);
            return returnObject;
        }
        //随机名不存在，可能程序没有及时写入（很少）
        if (goods.getRandomName()==null||"".equals(goods.getRandomName())){
            returnObject.setCode(Constants.ERROR);
            returnObject.setMessage("对不起，当前商品异常");
            returnObject.setResult(null);
            return returnObject;
        }
        returnObject.setResult(goods.getRandomName());
        returnObject.setMessage("获取系统时间成功");
        returnObject.setCode(Constants.OK);
        return returnObject;
    }

    //商品详情
    @RequestMapping("/secKill")
    public @ResponseBody Object secKill(Integer goodsid, String randomName, BigDecimal buyPrice){
        //当前用户id，来自session
        Integer uid = 1;
        ReturnObject returnObject = goodsService.secKill(goodsid,randomName,uid,buyPrice);

        return "goodsInfo";
    }

}
