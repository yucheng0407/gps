package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumBoard;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 论坛版块Dao
 * @Author: mxding
 * @Date: 2019-02-14 11:47
 */
@Repository
public class ForumBoardDao extends BaseDao<SysForumBoard> implements IForumBoardDao {

    @Override
    public FastPagination getBoardList(Map map) {
        StringBuilder sql = new StringBuilder();
        List<String> params = new ArrayList<>();
        sql.append("SELECT B.ID,\n" +
                "       B.CODE,\n" +
                "       B.TITLE,\n" +
                "       MU.USER_NAME MODERATOR,\n" +
                "       CU.USER_NAME CJR,\n" +
                "       B.CJSJ\n" +
                "  FROM SYS_FORUM_BOARD B\n" +
                "  LEFT JOIN SYS_USER MU\n" +
                "    ON B.MODERATOR = MU.ID\n" +
                "   AND MU.SFYX_ST = '1'\n" +
                "  LEFT JOIN SYS_USER CU\n" +
                "    ON B.CJR_ID = CU.ID\n" +
                "   AND CU.SFYX_ST = '1'\n" +
                " WHERE B.SFYX_ST = '1'");
        if (RxStringUtils.isNotEmpty(map.get("code"))) {
            sql.append(" AND B.CODE LIKE ? ");
            params.add("%" + map.get("code") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("title"))) {
            sql.append(" AND B.TITLE LIKE ? ");
            params.add("%" + map.get("title") + "%");
        }
        sql.append(" ORDER BY B.CJSJ DESC ");
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public List<Map<String, Object>> getForumActivity() {
        String sql = "SELECT * FROM V_FORUM_ACTIVITY";
        return getJdbcTemplate().queryForList(sql);
    }

}
