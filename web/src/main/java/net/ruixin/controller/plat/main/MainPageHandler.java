package net.ruixin.controller.plat.main;

import net.ruixin.controller.BaseController;
import net.ruixin.service.plat.mainpage.IMainPageService;
import net.ruixin.util.data.AjaxReturn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * mianPage用于首页测试
 */
@Controller
@RequestMapping("/mainPage")
public class MainPageHandler extends BaseController {
    @Autowired
    private IMainPageService mainPageService;

    @RequestMapping("/getDbrw")
    @ResponseBody
    public AjaxReturn getDbrwList() {
        return success().setData(mainPageService.getDbrwList(getCurrentUserId()));
    }

    @RequestMapping("/getYbrw")
    @ResponseBody
    public AjaxReturn getYbrwList() {
        return success().setData(mainPageService.getYbrwList(getCurrentUserId()));
    }

    @RequestMapping("/getZbrw")
    @ResponseBody
    public AjaxReturn getZbrwList() {
        return success().setData(mainPageService.getZbrwList(getCurrentUserId()));
    }

    @RequestMapping("/getImageDbrw")
    @ResponseBody
    public AjaxReturn getImageDbrw() {
//        map = new HashMap<>();
//        map.put("name", "地址房屋");
//        map.put("icon", "&#xe62b;");
//        map.put("num", 20);
//        list.add(map);
        return success().setData(mainPageService.getImageDbrw(getCurrentUserId()));
    }

    @RequestMapping("/getDbrwWithoutNbrw")
    @ResponseBody
    public AjaxReturn getDbrwListWithoutNbrw() {
        return success().setData(mainPageService.getDbrwListWithoutNbrw(getCurrentUserId()));
    }

    @RequestMapping("/getNbrw")
    @ResponseBody
    public AjaxReturn getNbrwList() {
        return success().setData(mainPageService.getNbrwList(getCurrentUserId()));
    }

    @RequestMapping("/getGzqkNum")
    @ResponseBody
    public AjaxReturn getGzqkNum(String timeType, Long userId) {
        if(null == userId){
            userId = getCurrentUserId();
        }
        return success().setData(mainPageService.getGzqkNum(timeType, userId));
    }

    @RequestMapping("/getWorkflowTjWithFlowType")
    @ResponseBody
    public AjaxReturn getWorkflowTjWithFlowType() {
        return success().setData(mainPageService.getWorkflowTjWithFlowType(getCurrentUserId()));
    }

    @RequestMapping("/getUserTj")
    @ResponseBody
    public AjaxReturn getUserTj(Long userId) {
        if(null == userId){
            userId = getCurrentUserId();
        }
        return success().setData(mainPageService.getUserTj(userId));
    }
}

