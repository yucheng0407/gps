package net.ruixin.service.plat.dictionary;

import net.ruixin.dao.plat.dictionary.IDictionaryDao;
import net.ruixin.dao.plat.dictionary.IDictionaryItemDao;
import net.ruixin.domain.plat.dictionary.SysDictionary;
import net.ruixin.domain.plat.dictionary.SysDictionaryItem;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by huchao on 2019/3/19 14:09
 */
@Service
@Transactional
public class DictionaryService extends BaseService implements IDictionaryService {
    @Autowired
    private IDictionaryDao dictionaryDao;
    @Autowired
    private IDictionaryItemDao dictionaryItemDao;

    @Override
    public FastPagination<SysDictionary> getDictList(Map<String, String> map) {
        return dictionaryDao.getDictList(map);
    }

    @Override
    public List<SysDictionaryItem> getDictionaryItemList(Long dictId) {
        return dictionaryItemDao.getDictItemListByDictId(dictId);
    }

    @Override
    public void deleteDictionaryById(Long id) {
        dictionaryDao.delete(id);
        // 逻辑删除该字典下的所有字典项
        dictionaryItemDao.deleteByDictId(id);
    }

    @Override
    public void saveDictionary(SysDictionary sysDictionary) {
        dictionaryDao.saveDict(sysDictionary);
    }
}
