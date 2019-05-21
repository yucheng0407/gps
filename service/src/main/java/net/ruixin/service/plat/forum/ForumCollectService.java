package net.ruixin.service.plat.forum;

import net.ruixin.dao.plat.forum.IForumCollectDao;
import net.ruixin.domain.plat.forum.SysForumCollect;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.service.plat.common.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Author: mxding
 * @Date: 2019-02-26 16:25
 */
@Service
public class ForumCollectService extends BaseService implements IForumCollectService {


    @Autowired
    IForumCollectDao forumCollectDao;

    @Override
    public void collectTopic(Long topicId) {
        SysForumCollect forumCollect = new SysForumCollect();
        forumCollect.setTopicId(topicId);
        forumCollect.setSfyxSt(SfyxSt.VALID);
        forumCollectDao.saveOrUpdate(forumCollect);
    }

    @Override
    public void cancelCollectTopic(Long topicId, Long userId) {
        forumCollectDao.cancelCollectTopic(topicId, userId);
    }

    @Override
    public boolean isTopicCollect(Long topicId, Long userId) {
        return forumCollectDao.isTopicCollect(topicId, userId);
    }

}
