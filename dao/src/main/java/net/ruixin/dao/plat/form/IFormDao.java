package net.ruixin.dao.plat.form;

import net.ruixin.domain.plat.form.FormDef;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;


/**
 * 表单设计Dao
 */
public interface IFormDao {

    /**
     * 获取list
     *
     * @param map
     * @return
     */
    FastPagination getFormDefList(Map map);

    /**
     * 保存数据
     *
     * @param formId
     * @param dataJson
     * @return
     */
    Long saveFormData(Long formId, String dataJson);

    /**
     * 获取
     *
     * @param formId
     * @param id
     * @return
     */
    Map<String, Object> getFormData(Long formId, Long id);

    /**
     * @param map
     * @return
     */
    FastPagination getFormDataList(Map map);

    /**
     * 创建
     *
     * @param formDef
     */
    void createTable(FormDef formDef);

    /**
     * 更新表
     *
     * @param formDef 表单对象
     */
    void updateTable(FormDef formDef, Long preId);

    /**
     * 获取最大sort的def
     *
     * @param formDef
     * @return
     */
    List<Map<String, Object>> getMaxSortFormDef(FormDef formDef);

    /**
     * 删除
     *
     * @param id
     * @param formId
     */
    void delFormData(Long id, Long formId);

    /**
     * @param map
     * @return
     */
    FastPagination getWfInsList(Map map);

    /**
     * 保存数据，类似于实体保存
     *
     * @param formId
     * @param dataJson
     * @return
     */
    Long saveData(Long formId, String dataJson);

}
