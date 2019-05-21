package net.ruixin.service.plat.mainpage;

import net.ruixin.service.plat.common.IBaseService;

import java.util.List;
import java.util.Map;


/**
 * @author Pitcher
 */
public interface IMainPageService extends IBaseService {

    List<Map<String, Object>> getDbrwListWithoutNbrw(Long userId);

    /**
     * 获取代办任务
     * @param userId 用户id
     * @return
     */
    List<Map<String, Object>> getDbrwList(Long userId);

    /**
     * 获取已办任务
     * @param userId
     * @return
     */
    List<Map<String, Object>> getYbrwList(Long userId);

    /**
     * 获取在办任务
     * @param userId
     * @return
     */
    List<Map<String, Object>> getZbrwList(Long userId);

    /**
     * 获取代办任务图标展示数据
     * @param userId
     * @return
     */
    List<Map<String, Object>> getImageDbrw(Long userId);

    List<Map<String,Object>> getWorkflowTjWithFlowType(Long userId);

    /**
     * 获取办理情况
     * @param userId
     * @return
     */
    List<Map<String, Object>> getGzqkList(Long userId);


    List<Map<String, Object>> getNbrwList(Long userId);

    Map<String,Integer> getGzqkNum(String timeType, Long userId);

    Map<String, Object> getUserTj(Long userId);

}
