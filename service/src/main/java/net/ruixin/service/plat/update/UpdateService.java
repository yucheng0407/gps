package net.ruixin.service.plat.update;

import net.ruixin.dao.plat.update.IUpdateDao;
import net.ruixin.service.plat.common.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UpdateService extends BaseService implements IUpdateService{

    @Autowired
    private IUpdateDao updateDao;

    @Override
    public Map<String, Object> getUpdateVali(String hash,String userroleid) {
        return updateDao.getUpdateVali(hash,userroleid);
    }

    @Override
    public void updateDownloadTimes(Long pid){
        updateDao.updateDownloadTimes(pid);
    }
}
