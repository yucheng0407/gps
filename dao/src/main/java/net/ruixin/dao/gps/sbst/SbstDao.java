package net.ruixin.dao.gps.sbst;

import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class SbstDao extends BaseDao<Map> implements ISbstDao {
    /**
     * 地市信息
     *
     * @param jgid
     * @return
     */
    public Map getDsConfig(Long jgid) {
        List list = getJdbcTemplate().queryForList("select n.*,e.id,e.organ_name\n" +
                "  from t_ds_config n, SYS_ORGAN e\n" +
                " where instr((select organ_code from SYS_ORGAN where id =?),n.ds)>0\n" +
                "   and e.organ_code = n.sjdm", jgid);
        if (list.size() > 0) {
            return (Map) list.get(0);
        } else {
            return null;
        }

    }

    /**
     * 在线状态查询
     * @param zyids
     * @return
     */
    @Override
    public List getSbbhList(String zyids) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        sql.append("select to_char(GXSJ,'yyyy-mm-dd hh24:mi:ss') gxsj,shape SHOW_GEOMETRY, zyid, sspcsmc, sbmc, zt,decode(sblx,2,decode(zt,1,'在线警车',0,'离线警车'),'未知') lxmc,sblx,decode(zt,1,'在线',0,'离线') zxzt, decode(zt,1,'jc',0,'lxjc') \"optionName\"\n" +
                "  from T_GEO_JLZY_ZT\n" +
                " where 1=1");
        if (RxStringUtils.isNotEmpty(zyids)) {
            sql.append(" and (");
            while (true) {
                int index = zyids.indexOf(",", 2000);
                if (index > -1) {
                    sql.append("instr(?,zyid)>0 or ");
                    params.add(zyids.substring(0, index));
                    zyids = zyids.substring(index);
                } else {
                    sql.append("instr(?,zyid)>0)");
                    params.add(zyids);
                    break;
                }
            }
        }
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    @Override
    public List getSbbhTree(Integer sjjg, String sblx) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        params.add(sblx);
        params.add(sjjg);
        params.add(sblx);
        params.add(sjjg);
        sql.append("select *\n" +
                "  from (select '../medias/src/gps/treeImg/pcs.png' \"icon\",\n" +
                "               'jg' || id \"id\",\n" +
                "               'jg' || parent_org \"pId\",\n" +
                "               to_char(t.organ_name) \"name\",\n" +
                "               to_char(t.organ_code) \"zyid\",\n" +
                "               'jg' \"lx\",\n" +
                "               'true' \"nocheck\",\n" +
                "               decode((select count(1) s\n" +
                "                         from sys_organ g\n" +
                "                        where g.parent_org = t.id\n" +
                "                          and g.sfyx_st <> 3) +\n" +
                "                      (select count(1)\n" +
                "                         from T_GEO_JLZY_JBXX xx\n" +
                "                        where xx.sspcsdm = t.organ_code\n" +
                "                          and xx.czbs <> 3\n" +
                "                          and instr(?, xx.sblx) > 0),\n" +
                "                      0,\n" +
                "                      'false',\n" +
                "                      'true') \"isParent\"\n" +
                "          from sys_organ t\n" +
                "         where parent_org = ?\n" +
                "           and t.sfyx_st <> 3\n" +
                "         order by t.organ_code)\n" +
                "union all\n" +
                "select *\n" +
                "  from (select '../medias/src/gps/treeImg/' || x.tbmc \"icon\",\n" +
                "               to_char(x.id) \"id\",\n" +
                "               'jg' || parent_org \"pId\",\n" +
                "               to_char(sbmc) \"name\",\n" +
                "               to_char(zyid) \"zyid\",\n" +
                "               'jl' \"lx\",\n" +
                "               'false' \"nocheck\",\n" +
                "               'false' \"isParent\"\n" +
                "          from T_GEO_JLZY_JBXX x, sys_organ g\n" +
                "         where g.organ_code = x.sspcsdm\n" +
                "           and x.czbs <> 3\n" +
                "           and g.sfyx_st <> 3\n" +
                "           and instr(?, x.sblx) > 0\n" +
                "           and g.id = ?\n" +
                "         order by sblx, sbbh)");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }
}
