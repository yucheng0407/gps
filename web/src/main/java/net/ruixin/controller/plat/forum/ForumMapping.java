package net.ruixin.controller.plat.forum;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: mxding
 * @Date: 2019-02-14 09:23
 */
@Controller
@RequestMapping("/forum")
public class ForumMapping {

    /**
     * 论坛主页
     * @return
     */
    @RequestMapping("/forumMain")
    public String forumMain() { return "/plat/forum/forumMain"; }

    /**
     * 版块列表
     * @return
     */
    @RequestMapping("/boardList")
    public String boardList() { return "/plat/forum/boardList"; }

    /**
     * 版块编辑
     * @return
     */
    @RequestMapping("/boardEdit")
    public String boardEdit() { return "/plat/forum/boardEdit"; }

    /**
     * 版块查看
     * @return
     */
    @RequestMapping("/boardView")
    public String boardView() { return "/plat/forum/boardView"; }

    /**
     * 版块主页
     * @return
     */
    @RequestMapping("/boardMain")
    public String boardMain() { return "/plat/forum/boardMain"; }


    /**
     * 帖子详情
     * @return
     */
    @RequestMapping("/topicDetail")
    public String topicDetail() { return "/plat/forum/topicDetail"; }
}
