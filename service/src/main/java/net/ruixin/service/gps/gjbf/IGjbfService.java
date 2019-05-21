package net.ruixin.service.gps.gjbf;

import java.util.List;

public interface IGjbfService {
  List getSbbh(String sbmc);

    List searchSbbh(String sbmc, String zyid, String kssj, String jssj);
}
