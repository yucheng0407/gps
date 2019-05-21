package net.ruixin.controller.plat.dict.v2;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.dictionary.SysDictionary;
import net.ruixin.service.plat.dictionary.IDictionaryService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Created by huchao on 2019/3/19 9:41
 */
@Controller
@RequestMapping("/dictionary")
public class SysDictionaryHandler extends BaseController {

    @Autowired
    private IDictionaryService dictionaryService;

    /**
     * 查询字典列表
     * @param map
     * @return
     */
    @RequestMapping("/getSysDictionaryPageList")
    @ResponseBody
    @SuppressWarnings("unchecked")
    public AjaxReturn getSysDictionaryPageList(@SearchModel Object map) {
        FastPagination<SysDictionary> dictList = dictionaryService.getDictList((Map<String, String>) map);
        return success().setData(dictList);
    }

    /**
     * 保存字典列表(新增/更新)
     * @param sysDictionary
     * @return
     */
    @RequestMapping("/saveSysDictionary")
    @ResponseBody
    public AjaxReturn saveSysDictionary(@FormModel SysDictionary sysDictionary) {
        dictionaryService.saveDictionary(sysDictionary);
        return success();
    }

    /**
     * 查询字典详情
     * @param id
     * @return
     */
    @RequestMapping("/getSysDictionaryById")
    @ResponseBody
    public AjaxReturn getSysDictionaryById(Long id) {
        SysDictionary sysDictionary = dictionaryService.get(SysDictionary.class, id);
        return success().setData(sysDictionary);
    }

    /**
     * 删除字典
     * @param id
     * @return
     */
    @RequestMapping("/deleteDictionary")
    @ResponseBody
    public AjaxReturn deleteDictionary(Long id) {
        dictionaryService.deleteDictionaryById(id);
        return success();
    }
}
