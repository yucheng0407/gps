package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodePageAuthDao;
import net.ruixin.domain.plat.workflow.structure.page.SysNodePageAuth;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * 环节页面权限DAO接口实现
 */
@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysNodePageAuthDao extends BaseDao<SysNodePageAuth> implements ISysNodePageAuthDao {

    @Override
    public List<Map<String, Object>> getAuths(Long pageId, String domId) {
        String sql = "SELECT NO.*, FI.LABEL, DEF.NAME \n" +
                "    FROM SYS_NODE_PAGE_AUTH NO, SYS_FORM_FIELD FI, SYS_FORM_DEF DEF\n" +
                "   WHERE NO.FORM_ID = FI.FORM_ID\n" +
                "     AND NO.CODE = FI.CODE\n" +
                "     AND DEF.ID = NO.FORM_ID\n" +
                "     AND NO.TYPE = 'field'\n" +
                "     AND NO.SFYX_ST = '1'\n" +
                "     AND FI.SFYX_ST = '1'\n" +
                "     AND DEF.SFYX_ST = '1'\n" +
                "   AND NO.PAGE_ID = ? " +
                "   AND NO.DOM_ID = ? " +
                "     UNION \n" +
                "     --subField\n" +
                "   SELECT NO.*, FI.LABEL, FI.NAME \n" +
                "     FROM SYS_NODE_PAGE_AUTH NO\n" +
                "    INNER JOIN (SELECT FFI.ID,\n" +
                "                       ZFI.CODE  CODE,\n" +
                "                       ZFI.LABEL,\n" +
                "                       FFI.LABEL NAME\n" +
                "                  FROM SYS_FORM_FIELD ZFI, SYS_FORM_FIELD FFI\n" +
                "                 WHERE ZFI.SFYX_ST = '1'\n" +
                "                   AND FFI.SFYX_ST = '1'\n" +
                "                   AND FFI.ID = ZFI.PARENT_ID) FI\n" +
                "       ON FI.ID = NO.FORM_ID\n" +
                "      AND FI.CODE = NO.CODE \n" +
                "    WHERE NO.TYPE = 'subField'\n" +
                "      AND NO.SFYX_ST = '1'" +
                "   AND NO.PAGE_ID = ? " +
                "   AND NO.DOM_ID = ? ";
        return getJdbcTemplate().queryForList(sql, pageId, domId, pageId, domId);
    }

    @Override
    public void saveNodePageAuth(List<SysNodePageAuth> nodePageAuths, Long pageId, String domId) {
        //先删除pageId和domId的数据
        String delSql = "DELETE FROM SYS_NODE_PAGE_AUTH WHERE PAGE_ID = ? AND DOM_ID = ?";
        this.getJdbcTemplate().update(delSql, pageId, domId);
        //保存
        this.saveOrUpdateBatch(nodePageAuths);
    }

    @Override
    public void delNodePageAuth(String domId, String unDelPageIds) {
        List<Object> params = new ArrayList<>();
        String delSql = "DELETE FROM SYS_NODE_PAGE_AUTH\n" +
                " WHERE DOM_ID = ?";
        params.add(domId);
        if (RxStringUtils.isNotEmpty(unDelPageIds)) {
            delSql += " AND PAGE_ID NOT IN (SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(?, ','))) ";
            params.add(unDelPageIds);
        }
        this.getJdbcTemplate().update(delSql, params.toArray());
    }
}
