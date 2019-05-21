package net.ruixin.dao.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDictionary;
import net.ruixin.util.hibernate.IBaseDao;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * Created by huchao on 2019/3/19 14:06
 */
public interface IDictionaryDao extends IBaseDao<SysDictionary> {
    /**
     * 按条件分页查询字典
     * @param map
     * @return
     */
    FastPagination<SysDictionary> getDictList(Map<String, String> map);

    /**
     * 保存字典
     * @param sysDictionary
     */
    void saveDict(SysDictionary sysDictionary);
}
