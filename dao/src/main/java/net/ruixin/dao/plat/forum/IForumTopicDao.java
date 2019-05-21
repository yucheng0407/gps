package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumTopic;
import net.ruixin.util.hibernate.IBaseDao;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * @Author: mxding
 * @Date: 2019-02-15 13:04
 */
public interface IForumTopicDao extends IBaseDao<SysForumTopic> {

    /**
     * 获取主题帖list
     * @param map 参数
     * @return
     */
    FastPagination getTopicList(Map map);

    /**
     * 获取主题帖和跟帖列表
     * @param map
     * @return
     */
    FastPagination getTopicAndFollowList(Map map);
}
