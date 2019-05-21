package net.ruixin.service.plat.form.impl;


import net.ruixin.dao.plat.form.IFormDao;
import net.ruixin.dao.plat.resource.IResourceDao;
import net.ruixin.dao.plat.workflow.ISysWorkflowPageDao;
import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.domain.plat.form.FormDef;
import net.ruixin.domain.plat.form.FormField;
import net.ruixin.domain.plat.resource.SysResource;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.service.plat.form.IFormService;
import net.ruixin.util.http.HttpKit;
import net.ruixin.util.json.JacksonUtil;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 表单设计
 */
@Service
public class FormService extends BaseService implements IFormService {

    @Autowired
    private IFormDao formDao;
    @Autowired
    private ISysWorkflowPageDao workflowPageDao;
    @Autowired
    private IResourceDao resourceDao;

    @Override
    @Transactional
    public void saveFormDef(FormDef formDef, Boolean fbFlg) {
        //保存基本数据
        //需要判断是否修改了比较大的影响，需要发布新版本，比如修改了列表展示字段，不影响展示，这时应该时不要发布新版本的
        if (null != fbFlg && fbFlg) {
            //增加、删除会发布版本？？？
            formDef.setId(null);
            //版本号清空
            formDef.setVersion(null);
            //是否主版本去除f
            formDef.setIsMain("");
            for (FormField field : formDef.getFields()) {
                field.setId(null);
                if (null != field.getColumns()) {
                    for (FormField childField : field.getColumns()) {
                        childField.setId(null);
                    }
                }
            }
        }

        this.save(formDef);
    }

    @Override
    public FormDef getFormDef(Long id) {
        return this.get(FormDef.class, id);
    }

    @Override
    public FastPagination getFormDefList(Map map) {
        return formDao.getFormDefList(map);
    }

    @Override
    @Transactional
    public void delFormDef(Long id) {
        this.deleteCascade(FormDef.class, id);
        //删除相关的资源信息
        resourceDao.delResourceByFormId(id);
    }

    @Override
    public Long saveFormData(Long formId, String dataJson) {
        return formDao.saveData(formId, dataJson);
    }

    @Override
    public Map<String, Object> getFormData(Long formId, Long id) {
        return formDao.getFormData(formId, id);
    }

    @Override
    public FastPagination getFormDataList(Map map) {
        return formDao.getFormDataList(map);
    }

    @Transactional
    @Override
    public String fbForm(Long formId) {
        FormDef formDef = this.get(FormDef.class, formId);
        String tableName = formDef.getTableName();
        //发布成功之后生成一条资源数据，供流程或者表单使用
        SysResource resource = new SysResource();
        resource.setUrl("/form/formEdit?formId=" + formDef.getId());
        resource.setFormId(formDef.getId());
        resource.setType("page");
        resource.setSfyxSt(SfyxSt.VALID);
        //第一次发布
        if (RxStringUtils.isEmpty(tableName)) {
            //设置资源
            resource.setName(formDef.getName() + "v(1)");
            resource.setCode(("diy_" + formDef.getKey() + 1).toUpperCase());
            this.save(resource);
            //修改formDef
            tableName = formDef.getKey();
            formDef.setVersion(1);
            //设置tableName
            formDef.setTableName(tableName);
            //Y标识是
            formDef.setIsMain("1");
            //保存
            this.save(formDef);
            formDao.createTable(formDef);
        } else {
            List<Map<String, Object>> list = formDao.getMaxSortFormDef(formDef);
            if (list.size() > 0) {
                Map<String, Object> map = list.get(0);
                //最大版本号
                int maxVersion = Integer.parseInt(map.get("VERSION").toString());
                resource.setName(formDef.getName() + "v(" + (maxVersion + 1) + ")");
                resource.setCode(("diy_" + formDef.getKey() + (maxVersion + 1)).toUpperCase());
                this.save(resource);
                //修改formDef
                //设置版本号
                formDef.setVersion(maxVersion + 1);
                //设为主版本
                formDef.setIsMain("1");
                this.save(formDef);
                Long preId = Long.parseLong(map.get("ID").toString());
                formDao.updateTable(formDef, preId);
            }
        }
        return formDef.getTableName();
    }

    @Override
    public void delFormData(Long id, Long formId) {
        formDao.delFormData(id, formId);
    }

    @Override
    public FastPagination getWfInsList(Map map) {
//        if (RxStringUtils.isNotEmpty(map.get("flowCode"))) {
        return formDao.getWfInsList(map);
//        } else {
//            return null;
//        }
    }

    @Override
    public Map<String, Object> getWfJson(Long flowId) {
        //获取流程sheets
        List<Map<String, Object>> sheets = workflowPageDao.querySheetsByWorkflow(flowId);
        //获取其中自定义的动态表单  PAGE_ID
        Map<String, Object> showFields = new HashMap<>();
        for (int i = 0; i < sheets.size(); i++) {
            Long pageId = Long.parseLong(sheets.get(i).get("sheet_id").toString());
            SysResource resource = this.get(SysResource.class, pageId);
            if (null != resource.getFormId()) {
                //是设计的表单，获取表单的信息
                FormDef formDef = this.get(FormDef.class, resource.getFormId());
                List<Object> list = new ArrayList<>();
                //获取其中需要展示在搜索列的数据
                List<FormField> fields = formDef.getFields();
                for (FormField field : fields) {
                    Map<String, Object> fieldOptions = JacksonUtil.readValue(field.getFieldOptions(), Map.class);
                    //列表展示字段
                    if (RxStringUtils.isNotEmpty(fieldOptions.get("show_table")) && "true".equals(fieldOptions.get("show_table").toString())) {
                        Map<String, Object> fieldM = new HashMap<>();
                        fieldM.put("label", field.getLabel());
                        fieldM.put("fieldType", field.getFieldType());
                        fieldM.put("code", field.getCode());
                        fieldM.put("fieldOptions", fieldOptions);
                        list.add(fieldM);
                    }
                }
                //数据表+字段的组合
                showFields.put(formDef.getTableName(), list);
            }
        }
        return showFields;
    }

    @Override
    public List getFormFieldTree(String ids) {
        List<Map<String, Object>> treeList = new ArrayList<>();
        Map<String, Object> treeData = null;
        String[] idArr = ids.split(",");
        for (int i = 0; i < idArr.length; i++) {
            String id = idArr[i];
            if (RxStringUtils.isNotEmpty(id)) {
                FormDef formDef = this.get(FormDef.class, Long.parseLong(id));
                if (null != formDef) {
                    //构建数据
                    treeData = new HashMap<>();
                    treeData.put("id", formDef.getId());
                    treeData.put("handleId", "form_" + formDef.getId());
                    treeData.put("name", formDef.getName() + "(" + formDef.getKey() + ")");
                    treeData.put("type", "form");
                    treeData.put("key", formDef.getKey());
                    treeData.put("open", true);
                    treeData.put("icon", HttpKit.handleCtxPath("/medias/style/plat/image/resource/res_menu.png"));
                    treeList.add(treeData);
                    //先构建基本数据，后续使用继续添加
                    List<FormField> formFields = formDef.getFields();
                    for (FormField field : formFields) {
                        if (field.getSfyxSt() != SfyxSt.UNVALID) {
                            if ("table".equals(field.getFieldType())) {
                                //构建子表数据
                            } else {
                                treeData = new HashMap<>();
                                treeData.put("id", field.getId());
                                treeData.put("handleId", "field_" + field.getId());
                                treeData.put("name", field.getLabel());
                                treeData.put("type", "field");
                                //直接记录数据库字段名称
                                treeData.put("key", field.getColumnName());
                                treeData.put("handleParentId", "form_" + formDef.getId());
                                treeData.put("icon", HttpKit.handleCtxPath("/medias/style/plat/image/resource/res_page.png"));
                                treeData.put("parentId", formDef.getId());
                                treeData.put("parentName", formDef.getName());
                                treeList.add(treeData);
                            }
                        }
                    }
                }
            }
        }
        return treeList;
    }
}
