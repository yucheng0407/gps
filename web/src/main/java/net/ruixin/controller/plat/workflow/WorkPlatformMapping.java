package net.ruixin.controller.plat.workflow;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/platform")
public class WorkPlatformMapping {
    //流程工作台风格A
    @RequestMapping("/flowCenterStyleA")
    public String flowCenterStyleA() {
        return "plat/workflow/platform/flowCenterStyleA";
    }

    //流程工作台风格B
    @RequestMapping("/flowCenterStyleB")
    public String flowCenterStyleB() {
        return "plat/workflow/platform/flowCenterStyleB";
    }

    //流程待办列表
    @RequestMapping("/dbList")
    public String dbList() {
        return "plat/workflow/platform/dbList";
    }

    //流程已办列表
    @RequestMapping("/ybList")
    public String ybList() {
        return "plat/workflow/platform/ybList";
    }

    //流程在办列表
    @RequestMapping("/zbList")
    public String zbList() {
        return "plat/workflow/platform/zbList";
    }

    //办理情况统计
    @RequestMapping("/blqktj")
    public String blqktj() {
        return "plat/workflow/platform/blqktj";
    }

    //统计图表
    @RequestMapping("/tjtb")
    public String tjtb() {
        return "plat/workflow/platform/tjtb";
    }

    //流程待办列表
    @RequestMapping("/nbList")
    public String nbList() {
        return "plat/workflow/platform/nbList";
    }

    //选择发起流程
    @RequestMapping("/chooseFlow")
    public String chooseFlow() {
        return "plat/workflow/platform/chooseFlow";
    }

    //办理情况详情
    @RequestMapping("/userBlqkView")
    public String userBlqkView() {
        return "plat/workflow/platform/userBlqkView";
    }

    //办理情况详情
    @RequestMapping("/organBlqkView")
    public String organBlqkView() {
        return "plat/workflow/platform/organBlqkView";
    }
}
