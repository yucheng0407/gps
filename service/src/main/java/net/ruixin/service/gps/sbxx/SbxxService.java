package net.ruixin.service.gps.sbxx;


import net.ruixin.dao.gps.sbxx.ISbxxDao;

import net.ruixin.domain.gps.Sbxx;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.mapUtil.MapUtil;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
@Transactional
public class SbxxService extends BaseService implements ISbxxService{
    @Autowired
    private ISbxxDao sbxxDao;

    @Override
    public FastPagination getSbxxList(Map map) {
        return sbxxDao.getSbxxList(map);
    }

    @Override
    public Sbxx getSbxx(Long id) {
        return super.get(Sbxx.class,id);
    }

    @Override
    public void saveSbxx(Sbxx sbxx) {
         super.save(sbxx);
    }

    @Override
    public Long sbxxDel(Long id) {
        return sbxxDao.sbxxDel(id);
    }
}
