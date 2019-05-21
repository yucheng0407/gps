package net.ruixin.controller.plat.dict.v2;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by huchao on 2019/3/19 9:41
 */
@Controller
@RequestMapping("/dictionary")
public class SysDictionaryMapping {
    @RequestMapping("/sysDictionaryList")
    public String sysDictList() {
        return "plat/dict/v2/sysDictionaryList";
    }

    @RequestMapping("/sysDictionarySelect")
    public String sysDictionarySelect() {
        return "plat/dict/v2/sysDictionarySelect";
    }

    @RequestMapping("/sysDictionaryEdit")
    public String sysDictionaryEdit() {
        return "plat/dict/v2/sysDictionaryEdit";
    }

    @RequestMapping("/sysDictionaryView")
    public String sysDictionaryView() {
        return "plat/dict/v2/sysDictionaryView";
    }
}
