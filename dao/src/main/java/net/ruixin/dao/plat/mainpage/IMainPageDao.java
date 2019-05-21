package net.ruixin.dao.plat.mainpage;

import java.util.List;
import java.util.Map;

/**
 * 操作日志DAO接口
 */
public interface IMainPageDao {
    /**
     * 获取代办任务
     *
     * @param userId 用户id
     * @return
     */
    List<Map<String, Object>> getDbrwList(Long userId);

    /**
     * 获取已办
     *
     * @param userId
     * @return
     */
    List<Map<String, Object>> getYbrwList(Long userId);

    /**
     * 获取在办
     *
     * @param userId
     * @return
     */
    List<Map<String, Object>> getZbrwList(Long userId);

    /**
     * 获取统计数据
     * @param userId
     * @return
     */
    List<Map<String,Object>> getWorkflowTj(Long userId);

    Map<String, Object> getUserTj(Long userId);

    List<Map<String, Object>> getWorkflowTjWithFlowType(Long userId);

    List<Map<String, Object>> getDbrwListWithoutNbrw(Long userId);

    List<Map<String, Object>> getNbrwList(Long userId);

    Map<String,Integer> getGzqkNum(String timeType, Long userId);
}
