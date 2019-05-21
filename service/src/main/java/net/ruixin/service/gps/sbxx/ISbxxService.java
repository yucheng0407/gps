package net.ruixin.service.gps.sbxx;

import net.ruixin.domain.gps.Sbxx;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

public interface ISbxxService {

    FastPagination getSbxxList(Map map);

    Sbxx getSbxx(Long id);

    void saveSbxx(Sbxx sbxx);

    Long sbxxDel(Long id);
}
