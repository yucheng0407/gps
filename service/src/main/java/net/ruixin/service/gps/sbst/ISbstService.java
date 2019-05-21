package net.ruixin.service.gps.sbst;
import net.ruixin.util.data.AjaxReturn;

import java.util.List;
import java.util.Map;

public interface ISbstService {
    List getSbbhTree(Integer jg, String sblx);

    Map getDsConfig(Long jgid);

    List getSbbhList(String zyids);

}
