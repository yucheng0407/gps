package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumCollect;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: mxding
 * @Date: 2019-02-26 16:22
 */
@Repository
public class ForumCollectDao extends BaseDao<SysForumCollect> implements IForumCollectDao {

    @Override
    public void cancelCollectTopic(Long topicId, Long userId) {
        super.jdbcTemplate.update("UPDATE SYS_FORUM_COLLECT SET SFYX_ST = '0', XGR_ID = ?, XGSJ= SYSDATE WHERE TOPIC_ID = ? AND SFYX_ST = '1'", userId, topicId);
    }

    @Override
    public boolean isTopicCollect(Long topicId, Long userId) {
        List list = super.findListByHql("from SysForumCollect where topicId=? and cjrId=? and sfyxSt='1'", topicId, userId);
        return !(list == null || list.size() == 0);
    }
}
