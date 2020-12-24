package com.seckill.service;

import com.seckill.commons.ReturnObject;
import com.seckill.goods.model.Goods;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

/**从这里调用远程服务
 * 21:11 2020/12/11
 * 岩
 */
//调用远程服务
@FeignClient(name = "seckill-goods-service")
public interface GoodsService {
    //调用远程服务的请求
    @RequestMapping("/getGoodsList")
    ReturnObject<List<Goods>> getGoodsList();

    @RequestMapping("/getGoodsById")
    ReturnObject<Goods> getGoodsById(@RequestParam("id") Integer id);

    @RequestMapping("/secKill")
    ReturnObject secKill(@RequestParam("goodsid") Integer goodsid,
                         @RequestParam("randomName") String randomName,
                         @RequestParam("uid") Integer uid,
                         @RequestParam("buyPrice") BigDecimal buyPrice);
}
