package net.ruixin.dao.gps.sbst;
import net.ruixin.util.data.AjaxReturn;

import java.util.List;
import java.util.Map;

public interface ISbstDao {
    List getSbbhTree(Integer sjjg, String sblx);
    Map getDsConfig(Long jgid);

    List getSbbhList(String zyids);
}
