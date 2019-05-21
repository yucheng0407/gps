package net.ruixin.dao.gps.gjbf;

import java.util.List;
import java.util.Map;

public interface IGjbfDao {
    List getSbbh(String sbmc);

    List searchSbbh(String sbmc, String zyid, String kssj, String jssj);
}
