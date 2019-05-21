package net.ruixin.service.plat.forum;

import net.ruixin.service.plat.common.IBaseService;

/**
 * @Author: mxding
 * @Date: 2019-02-26 16:23
 */
public interface IForumCollectService extends IBaseService {

    /**
     * 收藏主题帖
     * @param topicId
     */
    void collectTopic(Long topicId);

    /**
     * 取消收藏主题帖
     * @param topicId
     * @param userId 当前用户
     */
    void cancelCollectTopic(Long topicId, Long userId);

    /**
     * 主题帖是否被用户收藏
     * @param topicId
     * @param userId
     * @return
     */
    boolean isTopicCollect(Long topicId, Long userId);
}
