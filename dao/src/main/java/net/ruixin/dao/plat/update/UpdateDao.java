package net.ruixin.dao.plat.update;

import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class UpdateDao extends BaseDao implements IUpdateDao {
    private Map<String, Object> queryForMap(String sql, Object... params) {
        List<Map<String, Object>> result = super.getJdbcTemplate().queryForList(sql, params);
        if (result.size() > 0) {
            return result.get(0);
        } else {
            return null;
        }
    }

    @Override
    public Map<String, Object> getUpdateVali(String hash, String userroleid) {
        String sql = "SELECT d.build_code,d.release_type,d.app_id,r.role_id,p.id PACKAGEID\n" +
                "  FROM SYS_APP_PACKAGE P\n" +
                "  LEFT JOIN SYS_APP_DEPLOYMENT D\n" +
                "    ON P.DEPLOYMENT_ID = D.ID\n" +
                "   left join sys_app a on d.app_id=a.id \n" +
                "   left join sys_app_gray_release r on r.app_id=a.id  and r.role_id in (" + userroleid + ") \n" +
                " WHERE P.PACKAGE_HASH = ? ";
        String sqlGray = "SELECT *\n" +
                "  FROM (SELECT D.LAST_DEPLOYMENT_ID,\n" +
                "               D.DESCRIPTIONS,\n" +
                "               d.build_code,\n" +
                "               D.UPDATE_INSTALL,\n" +
                "               D.RELEASE_TYPE,\n" +
                "               P.ATTACHMENT_ID,\n" +
                "               P.SIZES,P.ID PACKAGEID\n" +
                "          FROM SYS_APP_PACKAGE P\n" +
                "          JOIN SYS_APP_DEPLOYMENT D\n" +
                "            ON P.DEPLOYMENT_ID = D.ID\n" +
                "           AND D.SFYX_ST = '1'\n" +
                "          left join sys_app a\n" +
                "            on d.app_id = a.id\n" +
                "           AND a.SFYX_ST = '1'\n" +
                "         WHERE P.SFYX_ST = '1'\n" +
                "         ORDER BY D.BUIlD_CODE DESC)\n" +
                " WHERE ROWNUM = 1";
        String sqlRelease = "SELECT *\n" +
                "  FROM (SELECT D.LAST_DEPLOYMENT_ID,\n" +
                "               D.DESCRIPTIONS,\n" +
                "               d.BUILD_CODE,\n" +
                "               D.UPDATE_INSTALL,\n" +
                "               D.RELEASE_TYPE,\n" +
                "               P.ATTACHMENT_ID,\n" +
                "               P.SIZES,P.ID PACKAGEID\n" +
                "          FROM SYS_APP_PACKAGE P\n" +
                "          JOIN SYS_APP_DEPLOYMENT D\n" +
                "            ON P.DEPLOYMENT_ID = D.ID\n" +
                "           AND D.SFYX_ST = '1' and d.release_type='1'\n" +
                "          left join sys_app a\n" +
                "            on d.app_id = a.id\n" +
                "           AND a.SFYX_ST = '1'\n" +
                "         WHERE P.SFYX_ST = '1'\n" +
                "         ORDER BY D.BUIlD_CODE DESC)\n" +
                " WHERE ROWNUM = 1";
        Map<String, Object> resultOld = this.queryForMap(sql, hash);
        Map<String, Object> resultGray = this.queryForMap(sqlGray);
        Map<String, Object> resultRelease = this.queryForMap(sqlRelease);
        /*该角色为灰度角色，版本为正式版--->灰度版||版本为灰度版--->灰度版，
           则只查找最新的，和当前版本比较，不等于，则返回最新的(有退回)*/
        //该角色为正式角色，版本为正式版--->正式版
        //该角色为正式角色，版本为灰度版--->正式版
        if (resultOld != null) {
            double clientBuild = Double.parseDouble(resultOld.get("BUILD_CODE").toString());
            double grayBuild = Double.parseDouble(Objects.requireNonNull(resultGray).get("BUILD_CODE").toString());
            double releaseBuild = Double.parseDouble(Objects.requireNonNull(resultRelease).get("BUILD_CODE").toString());
            if (null != resultOld.get("role_id") && !"".equals(resultOld.get("role_id"))) {
                if (clientBuild < grayBuild) {
                    //增加不是回退
                    resultGray.put("isth", "0");
                    return resultGray;
                } else if (clientBuild > grayBuild) {
                    //增加是回退
                    resultGray.put("isth", "1");
                    return resultGray;
                } else {
                    return Collections.emptyMap();
                }
            } else {
                if (clientBuild < releaseBuild) {
                    //增加不是回退
                    resultRelease.put("isth", "0");
                    return resultRelease;
                } else if (clientBuild > releaseBuild) {
                    //增加是回退
                    resultRelease.put("isth", "1");
                    return resultRelease;
                } else {
                    return Collections.emptyMap();
                }
            }
        } else {
            return Collections.emptyMap();
        }

    }

    @Override
    public void updateDownloadTimes(Long pid) {
        String sql = "UPDATE SYS_APP_PACKAGE SET DOWNLOADS=DOWNLOADS+1 WHERE ID=? ";
        this.jdbcTemplate.update(sql, pid);
    }
}
