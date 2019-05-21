package net.ruixin.dao.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDictionaryItem;
import net.ruixin.util.hibernate.IBaseDao;

import java.util.List;

/**
 * Created by huchao on 2019/3/20 16:57
 */
public interface IDictionaryItemDao extends IBaseDao<SysDictionaryItem> {
    /**
     * 获取字典项列表
     * @param dictId
     * @return
     */
    List<SysDictionaryItem> getDictItemListByDictId(Long dictId);

    /**
     * 删除字典的所有字典项
     * @param dictId
     */
    void deleteByDictId(Long dictId);
}
