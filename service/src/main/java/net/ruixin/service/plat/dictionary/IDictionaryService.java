package net.ruixin.service.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDictionary;
import net.ruixin.domain.plat.dictionary.SysDictionaryItem;
import net.ruixin.service.plat.common.IBaseService;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * Created by huchao on 2019/3/19 14:09
 */
public interface IDictionaryService extends IBaseService {
    /**
     * 查询字典列表
     * @param map
     * @return
     */
    FastPagination<SysDictionary> getDictList(Map<String, String> map);

    /**
     * 根据字典id查询该字典所有字典项
     * @param dictId
     * @return
     */
    List<SysDictionaryItem> getDictionaryItemList(Long dictId);

    /**
     * 删除字典
     * @param id
     */
    void deleteDictionaryById(Long id);

    /**
     * 保存字典
     * @param sysDictionary
     */
    void saveDictionary(SysDictionary sysDictionary);
}
