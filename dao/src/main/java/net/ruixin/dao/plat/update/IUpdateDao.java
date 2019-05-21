package net.ruixin.dao.plat.update;

import java.util.List;
import java.util.Map;

public interface IUpdateDao {

    Map<String, Object> getUpdateVali(String hash,String userroleid);

    void updateDownloadTimes(Long pid);
}
