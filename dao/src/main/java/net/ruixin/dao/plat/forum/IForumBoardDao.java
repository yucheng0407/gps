package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumBoard;
import net.ruixin.util.hibernate.IBaseDao;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * @Author: mxding
 * @Date: 2019-02-14 11:45
 */
public interface IForumBoardDao extends IBaseDao<SysForumBoard> {

    /**
     * 获取板块list
     * @param map 参数
     * @return
     */
    FastPagination getBoardList(Map map);

    /**
     * 获取论坛最新动态
     * @return
     */
    List<Map<String,Object>> getForumActivity();
}
