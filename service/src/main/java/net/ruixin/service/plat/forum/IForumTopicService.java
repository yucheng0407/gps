package net.ruixin.service.plat.forum;

import net.ruixin.domain.plat.forum.SysForumTopic;
import net.ruixin.service.plat.common.IBaseService;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * @Author: mxding
 * @Date: 2019-02-15 13:24
 */
public interface IForumTopicService extends IBaseService {

    /**
     * 获取主题帖list
     * @param map 参数
     * @return
     */
    FastPagination getTopicList(Map map);

    /**
     * 保存主题帖子
     * @param forumTopic
     */
    void saveTopic(SysForumTopic forumTopic);

    /**
     * 获取主题帖和跟帖列表
     * @param map
     * @return
     */
    FastPagination getTopicAndFollowList(Map map);

    /**
     * 根据ID获取主题帖
     * @param topicId
     * @return
     */
    SysForumTopic getTopicById(Long topicId);
}
