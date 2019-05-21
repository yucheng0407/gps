package net.ruixin.controller.plat.tree;

import net.ruixin.controller.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by admin on 2016-8-23.
 * 模型公用树
 */
@Controller
@RequestMapping("/tree")
public class TreeMapping extends BaseController {
    //获取ztree
    @RequestMapping(value = "/getTree")
    public String getTree() {
        return "plat/role/treeSelect";
    }
}
