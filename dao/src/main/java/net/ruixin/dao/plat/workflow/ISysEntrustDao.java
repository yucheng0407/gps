package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysEntrust;
import net.ruixin.util.paginate.FastPagination;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/12/12 0012
 */
/*
* 委办
* */
public interface ISysEntrustDao {
    /*
    * 获取委办列表
    * */
    FastPagination getEntrustList(Map map, Long userId);

    SysEntrust getEntrustById(Long id);
    Integer getEntrustByryId(Long ry_id);

    Long saveEntrust(SysEntrust sysEntrust, Integer flag);

    List getEntrustByDate(Date date, Long userId);
    /**
     * 检查委办计划信息
     *
     * @param wbjh
     */
    Integer checkWbjh(SysEntrust wbjh);
    /**
     * 删除委办计划
     */
    void delWbjh(Long id);
}
