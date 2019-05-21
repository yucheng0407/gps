package net.ruixin.dao.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDictionaryItem;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by huchao on 2019/3/20 16:58
 */
@Repository
public class DictionaryItemDao extends BaseDao<SysDictionaryItem> implements IDictionaryItemDao {
    @Override
    public List<SysDictionaryItem> getDictItemListByDictId(Long dictId) {
        return super.findListByHql("from SysDictionaryItem where dictId=? and sfyxSt='1'",
                dictId);
    }

    @Override
    public void deleteByDictId(Long dictId) {
        super.executeSqlUpdate("UPDATE SYS_DICTIONARY_ITEM SET SFYX_ST='0' WHERE DICT_ID=? AND SFYX_ST='1'",
                dictId);
    }
}
