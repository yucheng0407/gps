package net.ruixin.service.plat.config;


import net.ruixin.domain.plat.config.SysConfig;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

public interface IConfigService {

    /**
     * 保存、修改配置
     *
     * @param config 配置
     */
    void saveConfig(SysConfig config);

    /**
     * 根据ID获取配置实体
     *
     * @param id 配置ID
     */
    SysConfig getConfigById(Long id);

    /**
     * 根据ID删除配置
     *
     * @param id 配置ID
     */
    void delConfig(Long id);

    /**
     * 分页列表查询
     *
     * @param map 查询条件
     */
    FastPagination getConfigList(Map<String, Object> map);

    /**
     * 配置按类别平铺数据获取
     */
    List<Map<String, Object>> getConfigListByType();

    /**
     * 批量保存资源配置
     * @param json
     */
    void saveAllResourceConfig(String json);

    /**
     * 恢复默认资源配置
     */
    void defaultResourceConfig();

    //重新缓存所有配置
    void recacheAllConfig();
}
