package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumTopic;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @Author: mxding
 * @Date: 2019-02-15 13:12
 */
@Repository
public class ForumTopicDao extends BaseDao<SysForumTopic> implements IForumTopicDao {

    @Override
    public FastPagination getTopicList(Map map) {
        StringBuilder sql = new StringBuilder();
        List<String> params = new ArrayList<>();
        sql.append("SELECT T.ID,\n" +
                "       T.TITLE,\n" +
                "       SUBSTR(T.CONTENT, 0, 30) AS SHORT_CONTENT,\n" +
                "       T.TOP,\n" +
                "       T.BEST,\n" +
                "       (SELECT U.USER_NAME\n" +
                "          FROM SYS_USER U\n" +
                "         WHERE U.ID = T.CJR_ID\n" +
                "           AND U.SFYX_ST = '1') AS AUTHOR,\n" +
                "       TO_CHAR(T.CJSJ, 'YYYY-MM-DD HH24:MI:SS') AS CJSJ,\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_FORUM_FOLLOW F\n" +
                "         WHERE F.TOPIC_ID = T.ID\n" +
                "           AND F.SFYX_ST = '1') AS COMMENT_NUM,\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_FORUM_VIEW V\n" +
                "         WHERE V.OBJECT_ID = T.ID\n" +
                "           AND V.VIEW_TYPE = 'TOPIC') AS VIEW_NUM\n" +
                "  FROM SYS_FORUM_TOPIC T\n" +
                " WHERE T.SFYX_ST = '1'");
        if (RxStringUtils.isNotEmpty(map.get("title"))) {
            sql.append(" AND T.TITLE LIKE ? ");
            params.add("%" + map.get("title") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("boardId"))) {
            sql.append(" AND T.BOARD_ID = ? ");
            params.add(map.get("boardId") + "");
        }
        if (RxStringUtils.isNotEmpty(map.get("isBest"))) { // 精品
            sql.append(" AND T.BEST = ? ");
            params.add(map.get("isBest") + "");
        }
        if (RxStringUtils.isNotEmpty(map.get("scrId"))) { // 收藏
            sql.append(" AND EXISTS (SELECT 1 FROM SYS_FORUM_COLLECT C WHERE C.TOPIC_ID = T.ID AND C.CJR_ID = ? AND C.SFYX_ST = '1')");
            params.add(map.get("scrId") + "");
        }
        sql.append(" ORDER BY T.TOP DESC, T.BEST DESC, T.CJSJ DESC ");
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public FastPagination getTopicAndFollowList(Map map) {
        if(RxStringUtils.isEmpty(map.get("topicId"))) {
            return null;
        }
        StringBuilder sql = new StringBuilder();
        List<String> params = new ArrayList<>();
        sql.append("SELECT P.ID,\n" +
                "       P.CONTENT,\n" +
                "       P.FLOOR,\n" +
                "       TO_CHAR(P.CJSJ, 'YYYY-MM-DD HH24:MI:SS') AS CJSJ,\n" +
                "       P.MASTER,\n" +
                "       P.CJR_ID,\n" +
                "       U.USER_NAME,\n" +
                "       DECODE(U.SEX, '1', '男', '0', '女') AS USER_SEX,\n" +
                "       '' AS USER_PHONE,\n" +
                "       '' AS USER_ADDRESS\n" +
                "  FROM (SELECT T.ID, T.CONTENT, 1 FLOOR, T.CJR_ID, T.CJSJ, '1' MASTER\n" +
                "          FROM SYS_FORUM_TOPIC T\n" +
                "         WHERE T.ID = ?\n" +
                "           AND T.SFYX_ST = '1'\n" +
                "        UNION ALL\n" +
                "        SELECT F.ID, F.CONTENT, F.FLOOR, F.CJR_ID, F.CJSJ, '0' MASTER\n" +
                "          FROM SYS_FORUM_FOLLOW F\n" +
                "         WHERE F.TOPIC_ID = ?\n" +
                "           AND F.SFYX_ST = '1') P\n" +
                "  LEFT JOIN SYS_USER U\n" +
                "    ON P.CJR_ID = U.ID\n");
        params.add(map.get("topicId") + "");
        params.add(map.get("topicId") + "");
        sql.append(" ORDER BY P.FLOOR ");
        return super.getPaginationBySql(sql, params, map);
    }

}
