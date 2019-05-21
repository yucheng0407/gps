package net.ruixin.service.gps.sbst;

import net.ruixin.dao.gps.sbst.ISbstDao;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.mapUtil.MapUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class SbstService extends BaseService implements ISbstService{
    @Autowired
    private ISbstDao sbstDao;
    @Override
    public List getSbbhTree(Integer sjjg, String sblx) {
        return sbstDao.getSbbhTree(sjjg,sblx);
    }

    @Override
    public Map getDsConfig(Long jgid) {
        return sbstDao.getDsConfig(jgid);
    }

    @Override
    public List getSbbhList(String zyids) {
        return  MapUtil.handleGeometryToArcgis( sbstDao.getSbbhList(zyids));
    }
}
