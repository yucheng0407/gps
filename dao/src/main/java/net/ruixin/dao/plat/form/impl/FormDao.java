package net.ruixin.dao.plat.form.impl;

import net.ruixin.dao.plat.form.IFormDao;
import net.ruixin.domain.constant.Const;
import net.ruixin.domain.plat.form.FormDef;
import net.ruixin.domain.plat.form.FormField;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.enumerate.plat.WidgetType;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.http.HttpSessionHolder;
import net.ruixin.util.json.JacksonUtil;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * 表单设计DAO
 */
@SuppressWarnings("unchecked")
@Repository
public class FormDao extends BaseDao<FormDef> implements IFormDao {

    @Override
    public FastPagination getFormDefList(Map map) {
        //查主版本的数据
        StringBuilder sql = new StringBuilder("" +
                "SELECT DEF.ID, DEF.NAME, DEF.KEY,DEF.VERSION,DEF.IS_MAIN, DEF.DESCRIPTION, DEF.TYPE_ID,DEF.TABLE_NAME, DEF.XGSJ\n" +
                "  FROM SYS_FORM_DEF DEF\n" +
                " WHERE DEF.SFYX_ST = '1' ");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("name"))) {
            sql.append(" AND DEF.NAME LIKE ? ");
            args.add("%" + map.get("name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("key"))) {
            sql.append(" AND DEF.KEY = ? ");
            args.add(map.get("key"));
        }
        sql.append(" order by def.xgsj desc,def.id desc");
        return super.getPaginationBySql(sql, args, map);
    }

    @Override
    public Long saveFormData(Long formId, String dataJson) {
        Long id;
        FormDef formDef = this.get(formId);
        String tableName = formDef.getTableName();
        Map<String, Object> dataMap = JacksonUtil.readValue(dataJson, Map.class);
        List<Object> args = new ArrayList<>();
        //可能是更新数据，可能是插入数据
        StringBuilder sql = new StringBuilder("");
        Long userId = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        Date sysDate = getSysDate();
        if (RxStringUtils.isNotEmpty(dataMap.get("id"))) {
            id = Long.parseLong(dataMap.get("id").toString());
            //更新数据
            sql.append("update ").append(tableName).append(" set ");
            for (FormField field : formDef.getFields()) {
                sql.append(field.getCode()).append(" = ? ,");
                //值可能需要转化，字符串转化为日期
                args.add(parseValue(field, dataMap.get(field.getCode())));
            }
            //"xgrId"
            sql.append("XGR_ID = ?,");
            args.add(userId);
            //"xgsj"
            sql.append("XGSJ = ?");
            args.add(sysDate);
            sql.append(" WHERE ID = ? ");
            args.add(id);
        } else {
            //查询出id
            String seqSql = "select seq_" + tableName + ".nextval as id from dual";
            id = Long.parseLong(super.getJdbcTemplate().queryForMap(seqSql).get("id").toString());
            StringBuilder valueSql = new StringBuilder(") values(?");
            args.add(id);
            //插入数据
            sql.append("insert into ").append(tableName).append("(id");
            //还要添加修改人修改时间等字段
            //因为json数据中会存有关于附件的操作数据，所以不能遍历JSON数据，或者排除这些数据
            for (FormField field : formDef.getFields()) {
                sql.append(",").append(field.getCode());
                valueSql.append(",?");
                //值可能需要转化，字符串转化为日期
                args.add(parseValue(field, dataMap.get(field.getCode())));
            }
            //"cjrId"
            sql.append(",CJR_ID");
            valueSql.append(",?");
            args.add(userId);
            // "cjsj"
            sql.append(",CJSJ");
            valueSql.append(",?");
            args.add(sysDate);
            //"xgrId"
            sql.append(",XGR_ID");
            valueSql.append(",?");
            args.add(userId);
            //"xgsj"
            sql.append(",XGSJ");
            valueSql.append(",?");
            args.add(sysDate);
            //是否有效
            sql.append(",sfyx_st");
            valueSql.append(",?");
            args.add(SfyxSt.VALID.id);

            valueSql.append(")");
            sql.append(valueSql);
        }
        this.getJdbcTemplate().update(sql.toString(), args.toArray());
        //处理附件
        Map fjMap = (Map) dataMap.get("fjUpdateIds");
        if (fjMap != null) {
            super.updateFiles(fjMap.get("addIds").toString(), fjMap.get("delIds").toString());
        }
        return id;
    }

    private Object parseValue(FormField field, Object value) {
        String type = field.getFieldType();
        //日期
        if (WidgetType.DATEPICKER.getKey().equals(type)) {
            //获取日期格式
            Map options = JacksonUtil.readValue(field.getFieldOptions(), Map.class);
            SimpleDateFormat format = new SimpleDateFormat(options.get("datefmt").toString());
            try {
                if (value != null && !"".equals(value)) {
                    value = format.parse(value.toString());
                }
            } catch (ParseException e) {
                throw new RuntimeException("日期转换错误", e);
            }
        }
        return value;
    }

    @Override
    public Map<String, Object> getFormData(Long formId, Long id) {
        //查询表单
        //多的级联数据查询??
        FormDef formDef = this.get(formId);
        return getData(id, formDef.getTableName(), formDef.getFields(), "id");
    }

    //todo 代码优化，和getChildData
    private Map<String, Object> getData(Long id, String tableName, List<FormField> fields, String conditionCode) {
        Map<String, Object> map = new HashMap<>();
        StringBuilder sql = new StringBuilder("SELECT ID AS \"ID\" ");
        for (FormField field : fields) {
            if (field.getSfyxSt() == SfyxSt.VALID) {
                if ("table".equals(field.getFieldType())) {
                    //查询子表数据
                    map.put(field.getCode(), getChildData(id, field.getColumnName(), field.getColumns(), field.getCode()));
                } else {
                    //选择器，需要关联查询
                    if (WidgetType.SELECTOR.getKey().equals(field.getFieldType())) {
                        Map fieldOptions = JacksonUtil.readValue(field.getFieldOptions(), Map.class);
                        //获取选择器类型
                        //类型对应的sql
                        //todo 需要优化此段代码，不是在此判断
                        if ("user".equals(fieldOptions.get("selector_type"))) {
                            //用户
                            sql.append(",(SELECT US.USER_NAME FROM SYS_USER US WHERE US.ID = ").append(field.getCode()).append(") as \"").append(field.getCode()).append("_NAME\"");
                        }
                    }
                    sql.append(",").append(field.getCode()).append(" as \"").append(field.getCode()).append("\"");
                }
            }
        }
        sql.append(",").append("decode(SFYX_ST,1,'VALID','UNVALID')\n").append(" as \"sfyxSt\"");
        sql.append(" from ").append(tableName);
        sql.append(" where ").append(conditionCode).append(" = ?");
        try {
            map.putAll(this.getJdbcTemplate().queryForMap(sql.toString(), id));
        } catch (Exception e) {

        }
        return map;
    }

    private List<Map<String, Object>> getChildData(Long id, String tableName, List<FormField> fields, String conditionCode) {
        StringBuilder sql = new StringBuilder("SELECT ID AS \"ID\" ");
        for (FormField field : fields) {
            if (field.getSfyxSt() == SfyxSt.VALID) {
                sql.append(",").append(field.getCode()).append(" as \"").append(field.getCode()).append("\"");
                //选择器，需要关联查询
                if (WidgetType.SELECTOR.getKey().equals(field.getFieldType())) {
                    if ("table".equals(field.getFieldType())) {

                    } else {
                        Map fieldOptions = JacksonUtil.readValue(field.getFieldOptions(), Map.class);
                        //获取选择器类型
                        //类型对应的sql
                        //todo 需要优化此段代码，不是在此判断
                        if ("user".equals(fieldOptions.get("selector_type"))) {
                            //用户
                            sql.append(",(SELECT US.USER_NAME FROM SYS_USER US WHERE US.ID = ").append(field.getCode()).append(") as \"").append(field.getCode()).append("_NAME\"");
                        }
                    }
                }
            }
        }
        sql.append(",").append("decode(SFYX_ST,1,'VALID','UNVALID')\n").append(" as \"sfyxSt\"");
        sql.append(" from ").append(tableName);
        sql.append(" where " + conditionCode + " = ?");
        List<Map<String, Object>> list = null;
        try {
            list = this.getJdbcTemplate().queryForList(sql.toString(), id);
        } catch (Exception e) {

        }
        return list;
    }


    /**
     * todo 构建搜索区需要注意，一般日期会转化成开始-结束，选择器可能会转化为模糊匹配等等
     */
    @Override
    public FastPagination getFormDataList(Map map) {
        //tableNames必须存在的
        if (RxStringUtils.isNotEmpty(map.get("tableName"))) {
            List<Object> params = new ArrayList<>();
            StringBuilder sql = new StringBuilder("select ID ");
            //搜索区map
            Map<String, Object> searchMap = new HashMap<>();
            //todo 可以和工作流列表查询整合
            if (RxStringUtils.isNotEmpty(map.get("fields"))) {
                List<Map<String, Object>> fields = JacksonUtil.readValue(map.get("fields").toString(), List.class);
                for (int i = 0; i < fields.size(); i++) {
                    Map<String, Object> field = fields.get(i);
                    Map fieldOptions = (Map) field.get("fieldOptions");
                    if (WidgetType.SELECTOR.getKey().equals(field.get("fieldType").toString())) {
                        //todo 需要优化此段代码，不是在此判断
                        if ("user".equals(fieldOptions.get("selector_type"))) {
                            //用户
                            sql.append(",(SELECT US.USER_NAME FROM SYS_USER US WHERE US.ID = ").append(field.get("code").toString().toUpperCase()).append(") as ").append(field.get("code").toString().toUpperCase()).append("_NAME ");
                        }
                    } else {
                        sql.append(",").append(field.get("code").toString().toUpperCase());
                    }
                    if (RxStringUtils.isNotEmpty(fieldOptions.get("show_search"))) {
                        searchMap.put(field.get("code").toString().toUpperCase(), getFieldSearchSql(field, map.get("tableName").toString()));
                    }
                }
            }
            sql.append(" from ").append(map.get("tableName"));
            sql.append(" where sfyx_st = '1'");
            //添加搜索区
            for (Map.Entry<String, Object> entry : searchMap.entrySet()) {
                if (RxStringUtils.isNotEmpty(map.get(entry.getKey()))) {
                    sql.append("AND " + entry.getValue());
                    params.add(map.get(entry.getKey()));
                }
            }
            sql.append(" order by xgsj desc ");
            return super.getPaginationBySql(sql, params, map);
        } else {
            return null;
        }
    }

    @Override
    public void delFormData(Long id, Long formId) {
        FormDef formDef = this.get(formId);
        String tableName = formDef.getTableName();
        String delSql = "UPDATE " + tableName + " SET SFYX_ST = '0' WHERE ID=?";
        this.getJdbcTemplate().update(delSql, id);
        //遍历fied，查看是否存在子表单，删除子表单的数据
        for (FormField field : formDef.getFields()) {
            if ("table".equals(field.getFieldType())) {
                if (RxStringUtils.isNotEmpty(field.getColumnName())) {
                    //删除数据
                    this.getJdbcTemplate().update("UPDATE " + field.getFieldType() + " SET SFYX_ST = '0' WHERE " + field.getCode() + "=?", id);
                }
            }
        }
    }

    @Override
    public FastPagination getWfInsList(Map map) {
        //todo 可添加逻辑，如：未办理在前，自己的任务在前等
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT PKG_WF.F_WF_GET_STATUS(WI.ID) AS STATUS,\n" +
                "       DECODE(WI.STATUS, '5', WI.TITLE || '(草稿)', WI.TITLE) AS TITLE,\n" +
                "       W.ID AS WF_ID,\n" +
                "       WI.ID AS WF_INS_ID,\n" +
                "       NVL(V.CJSJ, WI.CJSJ) AS XGSJ,\n" +
                "       NVL(U1.USER_NAME, U2.USER_NAME) AS USER_NAME\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI\n" +
                " INNER JOIN SYS_WORKFLOW W\n" +
                "    ON WI.WORKFLOW_ID = W.ID\n" +
                "  LEFT JOIN V_WORKFLOW_LASTEST V\n" +
                "    ON WI.ID = V.WORKFLOW_INSTANCE_ID\n" +
                "  LEFT JOIN SYS_USER U1\n" +
                "    ON V.USER_ID = U1.ID\n" +
                "   AND U1.SFYX_ST <> '0'\n" +
                "  LEFT JOIN SYS_USER U2\n" +
                "    ON WI.STARTUP_USER_ID = U2.ID\n" +
                "   AND U2.SFYX_ST <> '0'\n" +
                "  WHERE WI.SFYX_ST = '1' ");
        if (RxStringUtils.isNotEmpty(map.get("flowCode"))) {
            sql.append(" AND W.CODE = ? ");
            args.add(map.get("flowCode"));
        }
        if (RxStringUtils.isNotEmpty(map.get("title"))) {
            sql.append(" AND WI.TITLE LIKE ?");
            args.add("%" + map.get("title") + "%");
        }
        sql.append(" ORDER BY NVL(V.CJSJ, WI.CJSJ) DESC ");
        return super.getPaginationBySql(sql, args, map);
    }

    @Override
    public Long saveData(Long formId, String dataJson) {
        FormDef formDef = this.get(formId);
        String tableName = formDef.getTableName();
        Map<String, Object> dataMap = JacksonUtil.readValue(dataJson, Map.class);
        Long userId = (Long) HttpSessionHolder.get().getAttribute(Const.USER_ID);
        Date sysDate = getSysDate();
        //处理附件
        Map fjMap = (Map) dataMap.get("fjUpdateIds");
        if (fjMap != null) {
            super.updateFiles(fjMap.get("addIds").toString(), fjMap.get("delIds").toString());
        }
        return save(dataMap, formDef.getFields(), tableName, userId, sysDate, null);
    }

    private Long save(Map<String, Object> data, List<FormField> fields, String tableName, Long userId, Date sysDate, Map<String, Object> addMap) {
        Long id;
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder("");
        if (RxStringUtils.isNotEmpty(data.get("ID"))) {
            //更新
            id = Long.parseLong(data.get("ID").toString());
            //更新数据
            sql.append("update ").append(tableName).append(" set ");
            for (FormField field : fields) {
                if ("table".equals(field.getFieldType())) {
                    List<Map<String, Object>> childDatas = (List<Map<String, Object>>) data.get(field.getCode());
                    Map<String, Object> childMap = new HashMap<>();
                    childMap.put(field.getCode(), id);
                    for (Map<String, Object> childData : childDatas) {
                        save(childData, field.getColumns(), field.getColumnName(), userId, sysDate, childMap);
                    }
                } else {
                    sql.append(field.getCode()).append(" = ? ,");
                    //值可能需要转化，字符串转化为日期
                    args.add(parseValue(field, data.get(field.getCode())));
                }
            }
            //"xgrId"
            sql.append("XGR_ID = ?,");
            args.add(userId);
            sql.append("SFYX_ST = ?,");
            args.add("UNVALID".equals(data.get("sfyxSt")) ? "0" : "1");
            //"xgsj"
            sql.append("XGSJ = ?");
            args.add(sysDate);
            sql.append(" WHERE ID = ? ");
            args.add(id);
        } else {
            //新增
            //查询出id
            String seqSql = "select seq_" + tableName + ".nextval as id from dual";
            id = Long.parseLong(super.getJdbcTemplate().queryForMap(seqSql).get("ID").toString());
            StringBuilder valueSql = new StringBuilder(") values(?");
            args.add(id);
            //插入数据
            sql.append("insert into ").append(tableName).append("(ID");
            //还要添加修改人修改时间等字段
            //因为json数据中会存有关于附件的操作数据，所以不能遍历JSON数据，或者排除这些数据
            for (FormField field : fields) {
                if ("table".equals(field.getFieldType())) {
                    List<Map<String, Object>> childDatas = (List<Map<String, Object>>) data.get(field.getCode());
                    Map<String, Object> aa = new HashMap<>();
                    aa.put(field.getCode(), id);
                    for (Map<String, Object> childData : childDatas) {
                        save(childData, field.getColumns(), field.getColumnName(), userId, sysDate, aa);
                    }
                } else {
                    sql.append(",").append(field.getCode());
                    valueSql.append(",?");
                    //值可能需要转化，字符串转化为日期
                    args.add(parseValue(field, data.get(field.getCode())));
                }
            }
            if (null != addMap) {
                for (Map.Entry<String, Object> entry : addMap.entrySet()) {
                    sql.append(",").append(entry.getKey());
                    valueSql.append(",?");
                    args.add(entry.getValue());
                }
            }
            //"cjrId"
            sql.append(",CJR_ID");
            valueSql.append(",?");
            args.add(userId);
            // "cjsj"
            sql.append(",CJSJ");
            valueSql.append(",?");
            args.add(sysDate);
            //"xgrId"
            sql.append(",XGR_ID");
            valueSql.append(",?");
            args.add(userId);
            //"xgsj"
            sql.append(",XGSJ");
            valueSql.append(",?");
            args.add(sysDate);
            //是否有效
            sql.append(",sfyx_st");
            valueSql.append(",?");
            args.add(SfyxSt.VALID.id);

            valueSql.append(")");
            sql.append(valueSql);
        }
        this.getJdbcTemplate().update(sql.toString(), args.toArray());
        return id;
    }

    /**
     * 获取搜索条件sql
     *
     * @param field
     * @return
     */
    private String getFieldSearchSql(Map<String, Object> field, String key) {
        String sql;
        //或者是like
        String fieldType = field.get("fieldType").toString();
        if (WidgetType.TEXT.getKey().equals(fieldType) || WidgetType.NUMBER.getKey().equals(fieldType)) {
            sql = " instr(" + key + "." + field.get("code").toString().toUpperCase() + ",?) > 0 ";
        } else if (WidgetType.DATEPICKER.getKey().equals(fieldType)) {
            //fieldName).append(" >= TO_DATE(?,")
            //todo 日期做成时间段搜索
            sql = "";
        } else {
            sql = key + "." + field.get("code").toString().toUpperCase() + "= ? ";
        }
        return sql;
    }

    /**
     * 创建表
     *
     * @param formDef 表单对象
     */
    @Override
    public void createTable(FormDef formDef) {
        executeTable(formDef.getKey(), formDef.getTableName(), formDef.getFields(), (formDef.getName() + (null == formDef.getDescription() ? "" : ("：" + formDef.getDescription()))), "", "");
    }

    /**
     * 执行建表生成
     *
     * @param parentCode
     * @param tableName
     * @param fields
     * @param description
     * @param appendCode  附加创建sql
     * @param childDes
     */
    private void executeTable(String parentCode, String tableName, List<FormField> fields, String description, String appendCode, String childDes) {
        ArrayList<String> commonSql = new ArrayList<>();
        //创建sql
        StringBuilder sql = new StringBuilder();
        sql.append("create table ").append(tableName).append("(");
        //创建主键
        sql.append("id INTEGER not null,");
        commonSql.add("COMMENT ON table  " + tableName + " IS '" + description + "'");
        for (FormField field : fields) {
            if (field.getSfyxSt() == SfyxSt.VALID) {
                if ("table".equals(field.getFieldType())) {
                    //创建子表
                    //子表数据创建规则，可能会存在多个，加上子表code，以c开头，column只在当前表单中不重复
                    //希望是C_+parentCode+childCode
                    String childTableName = ("C_" + parentCode + "_" + field.getCode()).toUpperCase();
                    executeTable(field.getCode(), childTableName, field.getColumns(), field.getLabel() + "：" + tableName + "的子表", field.getCode(), tableName);
                    field.setColumnName(childTableName);
                } else {
                    sql.append(field.getCode()).append(" ").append(getColumnType(field)).append(",");
                    field.setColumnName(field.getCode());
                    commonSql.add("COMMENT ON COLUMN " + tableName + "." + field.getCode() + " IS '" + field.getLabel() + "'");
                }
            }
        }
        //标志位，生成关联字段
        if (RxStringUtils.isNotEmpty(appendCode)) {
            //todo 需要备注是哪张主表的关联字段
            sql.append(appendCode + " INTEGER,");
            commonSql.add("COMMENT ON COLUMN " + tableName + "." + appendCode + " IS '" + childDes + "的关联字段'");
        }
        //创建内置字段
        sql.append("CJR_ID INTEGER,");
        sql.append("CJSJ DATE,");
        sql.append("XGR_ID INTEGER,");
        sql.append("XGSJ DATE,");
        sql.append("SFYX_ST CHAR(1),");
        //冗余一个版本号字段
        sql.append("F_VERSION INTEGER");
        sql.append(")");
        List<Object> params = new ArrayList<>();
        params.add(tableName);
        params.add(sql.toString());
        //建表
        this.prepareCallNoReturn("{call PKG_FORM_DEF.P_CREATE_FORMTABLE(?,?,?)}", params.toArray());
        for (String aCommonSql : commonSql) {
            this.getJdbcTemplate().update(aCommonSql);
        }
    }

    @Override
    public List<Map<String, Object>> getMaxSortFormDef(FormDef formDef) {
        //1、获取上个版本的数据，主要是获取新增的数据
        //查找最大版本号数据id和版本号
        String querySql = "SELECT F.ID,F.VERSION \n" +
                "  FROM SYS_FORM_DEF F\n" +
                " WHERE F.SFYX_ST = '1'\n" +
                "   AND F.VERSION IS NOT NULL\n" +
                "   AND F.KEY = ? \n" +
                " ORDER BY F.VERSION DESC";
        return this.getJdbcTemplate().queryForList(querySql, formDef.getKey());
    }

    @Override
    public void updateTable(FormDef formDef, Long preId) {
        FormDef preForm = this.get(preId);
        preForm.setIsMain("0");
        this.saveOrUpdate(preForm);
        //对建立的数据库表进行处理
        handleTable(formDef.getFields(), formDef.getKey(), formDef.getTableName(), formDef.getName());
    }

    //执行
    private void handleTable(List<FormField> fields, String parentCode, String tableName, String description) {
        //注释sql
        ArrayList<String> commonSql = new ArrayList<>();
        //添加的语句
        StringBuilder addSql = new StringBuilder();
        //更新表注释
        commonSql.add("COMMENT ON table  " + tableName + " IS '" + (RxStringUtils.isNotEmpty(description) ? description : "") + "'");
        for (FormField field : fields) {
            if (SfyxSt.UNVALID != field.getSfyxSt()) {
                //columnName存在表示已经生成过，需要更新备注
                if ("table".equals(field.getFieldType())) {
                    if (RxStringUtils.isEmpty(field.getColumnName())) {
                        //初次数据，需要建表
                        String childTableName = ("C_" + parentCode + "_" + field.getCode()).toUpperCase();
                        executeTable(field.getCode(), childTableName, field.getColumns(), field.getLabel() + "：" + tableName + "的子表", field.getCode(), tableName);
                        field.setColumnName(childTableName);
                    } else {
                        //查看数据，更新字段
                        handleTable(field.getColumns(), parentCode, field.getColumnName(), field.getLabel() + "：" + tableName + "的子表");
                    }
                } else {
                    if (RxStringUtils.isEmpty(field.getColumnName())) {
                        addSql.append(field.getCode()).append(" ").append(getColumnType(field)).append(",");
                        //保存column字段
                        field.setColumnName(field.getCode());
                        commonSql.add("COMMENT ON COLUMN " + tableName + "." + field.getCode() + " IS '" + field.getLabel() + "'");
                    } else {
                        //更新备注
                        commonSql.add("COMMENT ON COLUMN " + tableName + "." + field.getColumnName() + " IS '" + field.getLabel() + "'");
                    }
                }
            }
        }
        String addStr = addSql.toString();
        if (!"".equals(addStr)) {
            //存在更新语句`
            String updateSql = "alter table " + tableName + " add(" + addStr.substring(0, addStr.length() - 1) + ")";
            //更新表
            this.getJdbcTemplate().execute(updateSql);
        }
        for (String aCommonSql : commonSql) {
            this.getJdbcTemplate().update(aCommonSql);
        }
    }

    /**
     * 获取sql类型
     *
     * @param field 字段
     * @return String
     */
    private String getColumnType(FormField field) {
        /*
         *       filedType 分为
         *       text
         *       textarea
         *       number
         *       radio
         *       checkbox
         *       select
         *       datePicker
         *       attachment uuid
         *       selector 一般是id
         *       table
         */
        //还得获取设置的max_length，没有采取默认，先统一100
        //普通字段默认是100，textarea默认是500，maxLength少于按默认值按默认值
        //定义各种类型的数据类型，以及数据库默认长度
        String fieldType = field.getFieldType();
        String str;
        Map<String, Object> fieldOptions = JacksonUtil.readValue(field.getFieldOptions(), Map.class);
        int maxLength;
        //读取设置的最大长度????有意义？？？
        if (null != fieldOptions && null != fieldOptions.get("max_length")) {
            maxLength = Integer.parseInt(fieldOptions.get("max_length").toString());
        } else {
            maxLength = 100;
        }
        int maxNum = 100;
        if ("textarea".equals(fieldType)) {
            maxNum = 500;
        }
        if (maxLength > maxNum) {
            maxLength = maxNum;
        }
        switch (fieldType) {
            case "datePicker":
                str = "DATE";
                break;
            case "selector":
                str = "VARCHAR2(100)";
                break;
            case "database":
                if (null != fieldOptions && null != fieldOptions.get("database_type")) {
                    str = fieldOptions.get("database_type").toString();
                } else {
                    str = "VARCHAR2(50)";
                }
                break;
            default:
                str = "VARCHAR2(" + maxLength + ")";

        }
        return str;
    }

}
