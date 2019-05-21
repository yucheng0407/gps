package net.ruixin.dao.gps.gjbf;

import net.ruixin.dao.gps.sbst.ISbstDao;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.support.DateUtil;
import net.ruixin.util.tools.RxStringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Repository
public class GjbfDao extends BaseDao<Map> implements IGjbfDao {

    @Override
    public List getSbbh(String sbmc) {
        StringBuilder sb = new StringBuilder();
        List<Object> params = new ArrayList<>();
        params.add(sbmc);
        sb.append("SELECT SBMC NAME,ZYID ID from T_GEO_JLZY_JBXX  WHERE czbs<>3 and INSTR(SBMC, ?) > 0 and rownum<11");
        return jdbcTemplate.queryForList(sb.toString(), params.toArray());
    }
    @Override
    public List searchSbbh(String sbbh, String zyid, String kssj, String jssj) {
        List<Object> params = new ArrayList<>();
        params.add(kssj);
        params.add(jssj);
        if (RxStringUtils.isNotEmpty(zyid)) {
            params.add(zyid);
        } else {
            params.add(sbbh);
        }
        String tableName_1 = DateFormatUtils.format(DateUtil.parseTime(kssj), "yyyyMMdd");
        String tableName_2 = DateFormatUtils.format(DateUtil.parseTime(jssj), "yyyyMMdd");
        String curTime = DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss");
        StringBuffer tableSql = new StringBuffer();
        StringBuffer sql = new StringBuffer();
        if (DateUtil.getDaySub(jssj, curTime) > 1) {
            tableSql.append("select * from t_gps_jlzy_bak_").append(tableName_1);
            if (DateUtil.getDaySub(kssj, jssj) > 0) {
                tableSql.append(" union all select * from t_gps_jlzy_bak_").append(tableName_2);
            }
        } else {
            tableSql.append("select * from T_GPS_JLZY");
            if (DateUtil.getDaySub(kssj, curTime) > 1) {
                tableSql.append(" union all select * from t_gps_jlzy_bak_").append(tableName_1);
            }
        }
        sql.append("select t.SHAPE.SDO_POINT.X x,round(t.SHAPE.SDO_POINT.Y,4) y,gxsj sj\n" +
                "  from (").append(tableSql).append(") t\n" +
                " where gxsj >= to_date(?, 'yyyy-mm-dd hh24:mi:ss')\n" +
                "   and gxsj <= to_date(?, 'yyyy-mm-dd hh24:mi:ss')\n" +
                "   and " + (RxStringUtils.isNotEmpty(zyid) ? "ZYID" : "SBMC") + "=? \n" +
                " order by gxsj");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

}
