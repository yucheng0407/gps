package net.ruixin.controller;

import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/main")
public class MainMapping extends BaseController {
    @RequestMapping("/password")
    public String password() {
        return "/plat/main/password";
    }

    @RequestMapping("/center")
    public String center() {
        return "/plat/main/center";
    }

    @RequestMapping("/center2")
    public String center2() {
        return "/plat/main/center2";
    }

    @RequestMapping("/aidAccess")
    public String aidAccess() {
        addCookie("resourceTimestamp", CacheKit.get(Cache.CONSTANT, "resourceTimestamp"));
        return "/plat/main/aidAccess";
    }

    //传递消息页
    @RequestMapping("/postParentMsg")
    public String postParentMsg() {
        return "/plat/main/postParentMsg";
    }
}
