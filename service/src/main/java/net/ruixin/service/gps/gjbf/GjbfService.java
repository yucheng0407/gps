package net.ruixin.service.gps.gjbf;

import net.ruixin.dao.gps.gjbf.IGjbfDao;
import net.ruixin.dao.gps.sbst.ISbstDao;
import net.ruixin.service.gps.sbst.ISbstService;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.mapUtil.MapUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class GjbfService extends BaseService implements IGjbfService{
    @Autowired
    private IGjbfDao gjbfDao;
    @Override
    public List getSbbh(String sbmc) {
        return gjbfDao.getSbbh(sbmc);
    }

    @Override
    public List searchSbbh(String sbmc, String zyid, String kssj, String jssj) {
            return gjbfDao.searchSbbh(sbmc,zyid,kssj,jssj);
    }
}
