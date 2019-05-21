package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumFollow;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

/**
 * @Author: mxding
 * @Date: 2019-02-22 14:27
 */
@Repository
public class ForumFollowDao extends BaseDao<SysForumFollow> implements IForumFollowDao {


    @Override
    public Long getFollowFloor(Long topicId) {
        String sql = "SELECT NVL(MAX(F.FLOOR), 1) + 1 FROM SYS_FORUM_FOLLOW F WHERE F.TOPIC_ID = ?";
        return super.getJdbcTemplate().queryForObject(sql, Long.class, topicId);
    }
}
