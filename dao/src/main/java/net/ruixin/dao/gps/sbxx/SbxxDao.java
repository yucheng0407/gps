package net.ruixin.dao.gps.sbxx;

import net.ruixin.dao.gps.sbst.ISbstDao;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class SbxxDao extends BaseDao<Map> implements ISbxxDao {

    @Override
    public FastPagination getSbxxList(Map map) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        sql.append("SELECT x.*,decode(t.zt,1,'在线','离线') zt,t.gxsj FROM T_GEO_JLZY_JBXX X left join T_GEO_JLZY_zt t on t.zyid=x.zyid WHERE x.CZBS<>3");
        if (RxStringUtils.isNotEmpty(map.get("sbmc"))) {
            sql.append(" and (");
            String sbmc=map.get("sbmc").toString();
            while (true) {
                int index = sbmc.indexOf(",", 2000);
                if (index > -1) {
                    sql.append("instr(?,x.sbmc)>0 or ");
                    params.add(sbmc.substring(0, index));
                    sbmc = sbmc.substring(index);
                } else {
                    sql.append("instr(?,x.sbmc)>0 or instr(x.sbmc,?)>0)");
                    params.add(sbmc);
                    params.add(sbmc);
                    break;
                }
            }
        }

        if (RxStringUtils.isNotEmpty(map.get("ssjg"))) {
            sql.append(" AND x.SSPCSMC LIKE ? ");
            params.add("%" + map.get("ssjg") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("ds"))&&!"6100".equals(map.get("ds"))) {//地市权限判断,陕西公安厅不做限制
            sql.append(" AND instr(x.SSPCSDM,?)>0 ");
            params.add(map.get("ds"));
        }
        if (RxStringUtils.isNotEmpty(map.get("zyid"))) {
            sql.append(" AND x.zyid LIKE ? ");
            params.add("%" + map.get("zyid") + "%");
        }
        sql.append(" order by x.sspcsmc");
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public Long sbxxDel(Long id) {

        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        params.add(id);
        sql.append("UPDATE T_GEO_JLZY_JBXX X SET X.CZBS='3' WHERE ID=?");
        return (long)getJdbcTemplate().update(sql.toString(),params.toArray());
    }
}
