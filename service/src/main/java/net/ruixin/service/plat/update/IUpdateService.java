package net.ruixin.service.plat.update;

import java.util.Map;

public interface IUpdateService {

    Map<String, Object> getUpdateVali(String hash,String userroleid);

    void updateDownloadTimes(Long pid);
}
