package net.ruixin.dao.plat.mainpage.impl;

import net.ruixin.dao.plat.mainpage.IMainPageDao;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class MainPageDao extends BaseDao implements IMainPageDao {
    @Override
    public List<Map<String, Object>> getDbrwList(Long userId) {
        String sql = "SELECT * FROM V_WF_DBRW D WHERE USER_ID = ? AND ROWNUM < 10";
        return getJdbcTemplate().queryForList(sql, userId);
    }

    @Override
    public List<Map<String, Object>> getYbrwList(Long userId) {
        String sql = "SELECT * FROM V_WF_YBRW D WHERE USER_ID = ? AND ROWNUM < 10";
        return getJdbcTemplate().queryForList(sql, userId);
    }

    @Override
    public List<Map<String, Object>> getZbrwList(Long userId) {
        String sql = "SELECT * FROM V_WF_ZBLC D WHERE QDR_ID = ? AND ROWNUM < 10";
        return getJdbcTemplate().queryForList(sql, userId);
    }

    @Override
    public List<Map<String, Object>> getWorkflowTj(Long userId) {
        String sql = "SELECT WF_NAME \"name\",DBRW_NUM \"num\",WF_ID \"id\" FROM V_WF_NUM WHERE  USER_ID = ?";
        return getJdbcTemplate().queryForList(sql, userId);
    }

    @Override
    public Map<String, Object> getUserTj(Long userId) {
        String sql = "SELECT sum(DBRW_NUM) DBRW_NUM, sum(ZBLC_NUM) ZBLC_NUM, sum(YBRW_NUM) YBRW_NUM FROM V_WF_NUM WHERE  USER_ID = ? GROUP BY USER_ID";
        List<Map<String, Object>> result = getJdbcTemplate().queryForList(sql, userId);
        if(result.size() > 0){
            return result.get(0);
        }else{
            return new HashMap();
        }
    }

    @Override
    public List<Map<String, Object>> getWorkflowTjWithFlowType(Long userId) {
        String sql = "SELECT W.ID WF_ID, W.CODE WF_CODE, W.NAME WF_NAME, M.DBRW_NUM\n" +
                "  FROM SYS_WORKFLOW W\n" +
                "  LEFT JOIN (SELECT WF_NAME, DBRW_NUM, WF_ID\n" +
                "               FROM V_WF_NUM\n" +
                "              WHERE USER_ID = ?) M\n" +
                "    ON M.WF_ID = W.ID\n";
        return getJdbcTemplate().queryForList(sql, userId);
    }

    @Override
    public List<Map<String, Object>> getDbrwListWithoutNbrw(Long userId) {
        String sql = "SELECT * FROM V_WF_DBRW_NO_NBRW D WHERE USER_ID = ? AND ROWNUM < 10";
        return getJdbcTemplate().queryForList(sql, userId);
    }

    @Override
    public List<Map<String, Object>> getNbrwList(Long userId) {
        String sql = "SELECT * FROM V_WF_NBRW D WHERE USER_ID = ? AND ROWNUM < 10";
        return getJdbcTemplate().queryForList(sql, userId);
    }

    @Override
    public Map<String,Integer> getGzqkNum(String timeType, Long userId) {
        Map map = new HashMap();
        Integer time = 0;
        if(timeType.equals("week")){
            time = 7;
        }else if(timeType.equals("day")){
            time = 1;
        }else if(timeType.equals("month")){
            time = 31;
        }else if(timeType.equals("year")){
            time = 365;
        }
        String sql = " SELECT COUNT(*)\n" +
                "   FROM SYS_TASK_INSTANCE TI\n" +
                "  WHERE TI.USER_ID = ?\n" +
                "    AND (TI.STATUS = '0' OR TI.STATUS = '1')\n" +
                "    AND TI.CJSJ > SYSDATE - ? \n" +
                "    AND TI.SFYX_ST = '1'";
        map.put("dbrwNum", getJdbcTemplate().queryForObject(sql, Integer.class, userId, time));
        String sql2 = " SELECT COUNT(*)\n" +
                "   FROM SYS_TASK_INSTANCE TI\n" +
                "  WHERE TI.USER_ID = ?\n" +
                "    AND TI.STATUS = '2'\n" +
                "    AND TI.CJSJ > SYSDATE - ? \n" +
                "    AND TI.SFYX_ST = '1'";
        map.put("ybrwNum", getJdbcTemplate().queryForObject(sql2, Integer.class, userId, time));
        String sql3 = " SELECT COUNT(*)\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI\n" +
                " WHERE WI.STARTUP_USER_ID = ?\n" +
                "   AND WI.STATUS != '4'\n" +
                "   AND WI.STATUS != '5'\n" +
                "   AND WI.SFYX_ST = '1'\n" +
                "   AND WI.CJSJ > SYSDATE - ?\n";
        map.put("fqgzNum", getJdbcTemplate().queryForObject(sql3, Integer.class, userId, time));
        String sql4 = " SELECT COUNT(*)\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI\n" +
                " WHERE WI.STARTUP_USER_ID = ?\n" +
                "   AND WI.STATUS = '0' and WI.STATUS = '3'\n" +
                "   AND WI.SFYX_ST = '1'\n" +
                "   AND WI.CJSJ > SYSDATE - ?\n";
        map.put("wcgzNum", getJdbcTemplate().queryForObject(sql4, Integer.class, userId, time));
        return map;
    }
}
