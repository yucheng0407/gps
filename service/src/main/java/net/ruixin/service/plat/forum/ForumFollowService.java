package net.ruixin.service.plat.forum;

import net.ruixin.dao.plat.forum.IForumFollowDao;
import net.ruixin.domain.plat.forum.SysForumFollow;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.exception.BussinessException;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Author: mxding
 * @Date: 2019-02-22 14:29
 */
@Service
public class ForumFollowService extends BaseService implements IForumFollowService {

    @Autowired
    IForumFollowDao forumFollowDao;

    @Override
    @Transactional
    public void saveFollow(SysForumFollow forumFollow) {
        if(RxStringUtils.isEmpty(forumFollow.getId())) {
            if(RxStringUtils.isEmpty(forumFollow.getTopicId())) {
                throw new BussinessException("跟帖对应的主题帖ID为空");
            }
            Long floor = forumFollowDao.getFollowFloor(forumFollow.getTopicId());
            forumFollow.setFloor(floor);
        }
        forumFollowDao.saveOrUpdate(forumFollow);
    }
}
