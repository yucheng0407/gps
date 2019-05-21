package net.ruixin.service.plat.forum;

import net.ruixin.dao.plat.forum.IForumViewDao;
import net.ruixin.domain.plat.forum.SysForumView;
import net.ruixin.service.plat.common.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Author: mxding
 * @Date: 2019-02-15 09:00
 */
@Service
public class ForumViewService extends BaseService implements IForumViewService {

    @Autowired
    IForumViewDao forumViewDao;

    @Override
    @Transactional
    public void saveForumView(Long objectId, String viewType) {
        SysForumView forumView = new SysForumView(objectId, viewType);
        forumViewDao.saveOrUpdate(forumView);
    }
}
