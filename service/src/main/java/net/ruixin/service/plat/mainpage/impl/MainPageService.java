package net.ruixin.service.plat.mainpage.impl;

import net.ruixin.dao.plat.mainpage.IMainPageDao;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.service.plat.mainpage.IMainPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class MainPageService extends BaseService implements IMainPageService {


    @Autowired
    private IMainPageDao mainPageDao;


    /**
     * 转化为消息列表显示的数据结构
     *
     * @param dataList 数据
     * @param name     显示字段
     * @param time     显示的time字段
     * @return
     */
    private void turnIntoDbrw(List<Map<String, Object>> dataList, String name, String time) {
        for (Map<String, Object> map : dataList) {
            map.put("name", map.get(name));
            map.put("time", map.get(time));
        }
    }

    @Override
    public List<Map<String, Object>> getDbrwList(Long userId) {
        List<Map<String, Object>> arr = mainPageDao.getDbrwList(userId);
        turnIntoDbrw(arr, "WF_NAME", "CJSJ");
        return arr;
    }

    @Override
    public List<Map<String, Object>> getYbrwList(Long userId) {
        List<Map<String, Object>> arr = mainPageDao.getYbrwList(userId);
        turnIntoDbrw(arr, "TITLE", "NODE_FINISH_TIME");
        return arr;
    }

    @Override
    public List<Map<String, Object>> getZbrwList(Long userId) {
        List<Map<String, Object>> arr = mainPageDao.getZbrwList(userId);
        turnIntoDbrw(arr, "TITLE", "QDSJ");
        return arr;
    }

    @Override
    public List<Map<String, Object>> getImageDbrw(Long userId) {
        return mainPageDao.getWorkflowTj(userId);
    }

    @Override
    public List<Map<String,Object>> getWorkflowTjWithFlowType(Long userId){
        return mainPageDao.getWorkflowTjWithFlowType(userId);
    }

    @Override
    public List<Map<String, Object>> getGzqkList(Long userId) {
        return mainPageDao.getWorkflowTj(userId);
    }

    @Override
    public List<Map<String, Object>> getDbrwListWithoutNbrw(Long userId) {
        List<Map<String, Object>> arr = mainPageDao.getDbrwListWithoutNbrw(userId);
        turnIntoDbrw(arr, "WF_NAME", "CJSJ");
        return arr;
    }

    @Override
    public List<Map<String, Object>> getNbrwList(Long userId) {
        List<Map<String, Object>> arr = mainPageDao.getNbrwList(userId);
        turnIntoDbrw(arr, "WF_NAME", "CJSJ");
        return arr;
    }

    @Override
    public Map<String,Integer> getGzqkNum(String timeType, Long userId){
        return mainPageDao.getGzqkNum(timeType, userId);
    }

    @Override
    public Map<String, Object> getUserTj(Long userId){
        return mainPageDao.getUserTj(userId);
    }
}
