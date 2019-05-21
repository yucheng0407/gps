package net.ruixin.service.plat.forum;

import net.ruixin.dao.plat.forum.IForumTopicDao;
import net.ruixin.domain.plat.forum.SysForumTopic;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @Author: mxding
 * @Date: 2019-02-15 13:24
 */
@Service
public class ForumTopicService extends BaseService implements IForumTopicService {

    @Autowired
    IForumTopicDao forumTopicDao;

    @Override
    public FastPagination getTopicList(Map map) {
        return forumTopicDao.getTopicList(map);
    }

    @Override
    public void saveTopic(SysForumTopic forumTopic) {
        forumTopicDao.saveOrUpdate(forumTopic);
    }

    @Override
    public FastPagination getTopicAndFollowList(Map map) {
        return forumTopicDao.getTopicAndFollowList(map);
    }

    @Override
    public SysForumTopic getTopicById(Long topicId) {
        return forumTopicDao.get(topicId);
    }
}
