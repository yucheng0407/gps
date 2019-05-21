package net.ruixin.dao.gps.sbxx;

import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

public interface ISbxxDao {

    FastPagination getSbxxList(Map map);

    Long sbxxDel(Long id);
}
