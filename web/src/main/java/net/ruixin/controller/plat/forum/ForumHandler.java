package net.ruixin.controller.plat.forum;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.forum.SysForumBoard;
import net.ruixin.domain.plat.forum.SysForumFollow;
import net.ruixin.domain.plat.forum.SysForumTopic;
import net.ruixin.service.plat.forum.*;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.exception.RuleException;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: mxding
 * @Date: 2019-02-14 09:22
 */
@Controller
@RequestMapping("/forum")
public class ForumHandler extends BaseController {

    @Autowired
    IForumViewService forumViewService;

    @Autowired
    IForumTopicService forumTopicService;

    @Autowired
    IForumBoardService forumBoardService;

    @Autowired
    IForumFollowService forumFollowService;

    @Autowired
    IForumCollectService forumCollectService;

    /**
     * 获取版块分页列表
     * @param map 传入参数
     * @return
     */
    @ResponseBody
    @RequestMapping("/getBoardList")
    public AjaxReturn getBoardList(@SearchModel Object map) {
        FastPagination fastPagination = forumBoardService.getBoardList((Map) map);
        return success().setData(fastPagination);
    }

    /**
     * 保存版块信息
     *
     * @param forumBoard 版块信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveBoard")
    public AjaxReturn saveBoard(@FormModel SysForumBoard forumBoard) {
        try {
            forumBoardService.saveBoard(forumBoard);
            return success().setData(forumBoard.getId());
        } catch (RuleException e) {
            return error().setMsg(e.getFriendlyMsg());
        }
    }

    /**
     * 根据ID查询版块信息
     *
     * @param id 版块ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getForumBoardById")
    public AjaxReturn getForumBoardById(Long id) {
        return success().setData(forumBoardService.getBoardById(id));
    }

    /**
     * 删除版块
     *
     * @param boardId 版块id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/deleteBoard")
    public AjaxReturn deleteBoard(Long boardId) {
        forumBoardService.deleteBoard(boardId);
        return success();
    }

    /**
     * 获取论坛动态
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getForumActivity")
    public AjaxReturn getForumActivity() {
        Map result = new HashMap();
        result.put("boardList", forumBoardService.getForumActivity());
        return success().setData(result);
    }

    /**
     * 获取主题帖分页列表
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getTopicList")
    public AjaxReturn getTopicList(@SearchModel Object map) {
        FastPagination fastPagination = forumTopicService.getTopicList((Map) map);
        return success().setData(fastPagination);
    }

    /**
     * 获取收藏主题帖分页列表
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getCollectTopicList")
    public AjaxReturn getCollectTopicList(@SearchModel Object map) {
        Map paramMap = (Map) map;
        paramMap.put("scrId", super.getCurrentUserId());
        FastPagination fastPagination = forumTopicService.getTopicList((Map) map);
        return success().setData(fastPagination);
    }

    /**
     * 保存主题帖子
     * @param forumTopic
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/saveTopic")
    public AjaxReturn saveTopic(@FormModel SysForumTopic forumTopic) {
        try {
            forumTopicService.saveTopic(forumTopic);
            return success().setData(forumTopic.getId());
        } catch (RuleException e) {
            return error().setMsg(e.getFriendlyMsg());
        }
    }

    /**
     * 保存论坛查看人数
     * @param objectId
     * @param type
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/saveForumView")
    public AjaxReturn saveForumView(Long objectId, String type) {
        try {
            forumViewService.saveForumView(objectId, type);
            return success();
        } catch (RuleException e) {
            return error().setMsg(e.getFriendlyMsg());
        }
    }

    /**
     * 获取主题帖和跟帖列表
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getTopicAndFollowList")
    public AjaxReturn getTopicAndFollowList(@SearchModel Object map) {
        FastPagination fastPagination = forumTopicService.getTopicAndFollowList((Map) map);
        return success().setData(fastPagination);
    }

    /**
     * 保存跟帖
     * @param forumFollow
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/saveFollow")
    public AjaxReturn saveForumFollow(@FormModel SysForumFollow forumFollow) {
        try {
            forumFollowService.saveFollow(forumFollow);
            return success();
        } catch (RuleException e) {
            return error().setMsg(e.getFriendlyMsg());
        }
    }

    /**
     * 获取主题帖相关信息
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getTopicDetail")
    public AjaxReturn getTopicDetail(Long topicId, Long boardId) {
        Map result = new HashMap();
        // 获取主题帖是否被当前用户收藏
        boolean isCollect = forumCollectService.isTopicCollect(topicId, super.getCurrentUserId());
        result.put("isCollect", isCollect);
        // 判断当前用户是否为版主
        boolean isModerator = forumBoardService.isModerator(boardId, super.getCurrentUserId());
        result.put("isModerator", isModerator);
        // 获取主题帖子相关信息
        result.put("topic", forumTopicService.getTopicById(topicId));
        return success().setData(result);
    }

    /**
     * 收藏帖子
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/collectTopic")
    public AjaxReturn collectTopic(Long topicId) {
        // 获取主题帖是否被当前用户收藏
        boolean isCollect = forumCollectService.isTopicCollect(topicId, super.getCurrentUserId());
        if(isCollect) {
            forumCollectService.cancelCollectTopic(topicId, super.getCurrentUserId());
        } else {
            forumCollectService.collectTopic(topicId);
        }
        return success();
    }

    /**
     * 置顶主题帖相关信息
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/topTopic")
    public AjaxReturn topTopic(Long topicId) {
        // 获取主题帖
        SysForumTopic forumTopic = forumTopicService.getTopicById(topicId);
        forumTopic.setTop(!forumTopic.getTop());
        forumTopicService.saveTopic(forumTopic);
        return success();
    }

    /**
     * 设置/取消精品
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/bestTopic")
    public AjaxReturn bestTopic(Long topicId) {
        // 获取主题帖
        SysForumTopic forumTopic = forumTopicService.getTopicById(topicId);
        forumTopic.setBest(!forumTopic.getBest());
        forumTopicService.saveTopic(forumTopic);
        return success();
    }
}
