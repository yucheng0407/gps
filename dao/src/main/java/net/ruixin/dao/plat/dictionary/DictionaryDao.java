package net.ruixin.dao.plat.dictionary;

import net.ruixin.domain.plat.dictionary.SysDictionary;
import net.ruixin.domain.plat.dictionary.SysDictionaryItem;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by huchao on 2019/3/19 14:06
 */
@Repository
public class DictionaryDao extends BaseDao<SysDictionary> implements IDictionaryDao {
    @Autowired
    private IDictionaryItemDao dictionaryItemDao;

    @Override
    @SuppressWarnings("unchecked")
    public FastPagination<SysDictionary> getDictList(Map<String, String> map) {
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT D.ID,D.DICT_CODE,D.DICT_NAME,D.DESCRIPTION,D.XGSJ ")
                .append("FROM SYS_DICTIONARY D WHERE D.SFYX_ST='1' ");
        if (RxStringUtils.isNotEmpty(map.get("dictName"))) {
            sql.append(" AND D.DICT_NAME LIKE ? ");
            args.add("%" + map.get("dictName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("dictCode"))) {
            sql.append(" AND D.DICT_CODE LIKE ? ");
            args.add("%" + map.get("dictCode") + "%");
        }
        sql.append(" ORDER BY D.XGSJ DESC ");
        return super.getPaginationBySql(sql, args, map);
    }

    @Override
    public void saveDict(SysDictionary sysDictionary) {
        if(sysDictionary.getId() != null) {
            super.saveOrUpdate(sysDictionary);
        } else {
            List<SysDictionaryItem> sysDictionaryItemList = sysDictionary.getSysDictionaryItemList();
            sysDictionary.setSysDictionaryItemList(null);
            super.saveOrUpdate(sysDictionary);
            // 新增时，hibernate无法为非根节点的字典项维护dict_id,所以此处手动维护
            setDictIdForDictItem(sysDictionaryItemList, sysDictionary.getId());
            dictionaryItemDao.saveOrUpdateBatch(sysDictionaryItemList);
        }
    }

    /**
     * 递归为字典项设置关联的字典id
     * @param dictionaryItemList
     * @param dictId
     */
    private void setDictIdForDictItem(List<SysDictionaryItem> dictionaryItemList, Long dictId) {
        if(dictionaryItemList != null && dictionaryItemList.size() > 0) {
            dictionaryItemList.forEach(item -> {
                item.setDictId(dictId);
                setDictIdForDictItem(item.getChildren(), dictId);
            });
        }
    }
}
