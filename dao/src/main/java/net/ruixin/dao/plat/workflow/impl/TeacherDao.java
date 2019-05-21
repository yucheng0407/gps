package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.domain.plat.workflow.test.Teacher;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class TeacherDao extends BaseDao<Teacher> {

    public FastPagination getBlList(Map map) {
        String flowCode = "flowImageTest";//测试请假流程编码
//        String flowCode = "CSFZJH";//测试分支聚合流程编码
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT PKG_WF.F_WF_GET_STATUS(V.WORKFLOW_INSTANCE_ID) STATUS,\n" +
                "       WI.TITLE,\n" +
                "       W.ID AS WF_ID,\n" +
                "       WI.ID WF_INS_ID,\n" +
                "       V.CJSJ AS XGSJ,\n" +
                "       U.USER_NAME\n" +
                "  FROM V_WORKFLOW_LASTEST V, SYS_WORKFLOW W, SYS_WORKFLOW_INSTANCE WI, SYS_USER U\n" +
                " WHERE V.USER_ID = U.ID AND U.SFYX_ST <> '0'\n" +
                "   AND W.ID = V.WORKFLOW_ID AND W.SFYX_ST = '1'\n" +
                "   AND WI.ID = V.WORKFLOW_INSTANCE_ID AND WI.SFYX_ST = '1'\n" +
                "   AND W.CODE = 'flowImageTest'   \n");
        if (RxStringUtils.isNotEmpty(map.get("title"))) {
            sql.append(" AND BW.TITLE LIKE ?");
            args.add("%" + map.get("title") + "%");
        }
        sql.append(" ORDER BY V.CJSJ DESC ");
        return super.getPaginationBySql(sql, args, map);
    }
}
