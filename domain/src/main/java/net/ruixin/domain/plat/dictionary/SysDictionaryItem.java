package net.ruixin.domain.plat.dictionary;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by huchao on 2019/3/19 13:57
 */
@Table(name = "SYS_DICTIONARY_ITEM")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysDictionaryItem extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_dictionary_item", sequenceName = "SEQ_SYS_DICTIONARY_ITEM", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_dictionary_item")
    private Long id;

    //字典ID
    @Column(name = "DICT_ID")
    private Long dictId;

    //字典编码
    @Column(name = "DICT_CODE")
    private String dictCode;

    //字典名称
    @Column(name = "DICT_NAME")
    private String dictName;

    //字典项编码
    @Column(name = "CODE")
    private String code;

    //字典项值
    @Column(name = "VALUE")
    private String value;

    //序号
    @Column(name = "SORT")
    private Integer sort;

    //层级
    @Column(name = "GRADE")
    private Integer grade;

    //上级字典项ID
    @Column(name = "PID")
    private String pId;

    //上级字典项编码
    @Column(name = "PCODE")
    private String pCode;

    //备注
    @Column(name = "REMARK")
    private String remark;

    //业务扩展
    @Column(name = "BIZ_EXTEND")
    private String bizExtend;

    //创建人id
    @Column(name = "CJR_ID")
    private Long cjrId;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date cjsj;

    //修改人id
    @Column(name = "XGR_ID")
    private Long xgrId;

    //修改时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date xgsj;

    //有效状态，0：无效，1：有效
    @Enumerated
    @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "PID", referencedColumnName = "ID")
    @Where(clause = "SFYX_ST='1'")
    @OrderBy("sort")
    private List<SysDictionaryItem> children;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDictId() {
        return dictId;
    }

    public void setDictId(Long dictId) {
        this.dictId = dictId;
    }

    public String getDictCode() {
        return dictCode;
    }

    public void setDictCode(String dictCode) {
        this.dictCode = dictCode;
    }

    public String getDictName() {
        return dictName;
    }

    public void setDictName(String dictName) {
        this.dictName = dictName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Integer getGrade() {
        return grade;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }

    public String getpId() {
        return pId;
    }

    public void setpId(String pId) {
        this.pId = pId;
    }

    public String getpCode() {
        return pCode;
    }

    public void setpCode(String pCode) {
        this.pCode = pCode;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getBizExtend() {
        return bizExtend;
    }

    public void setBizExtend(String bizExtend) {
        this.bizExtend = bizExtend;
    }

    public Long getCjrId() {
        return cjrId;
    }

    public void setCjrId(Long cjrId) {
        this.cjrId = cjrId;
    }

    public Date getCjsj() {
        return cjsj;
    }

    public void setCjsj(Date cjsj) {
        this.cjsj = cjsj;
    }

    public Long getXgrId() {
        return xgrId;
    }

    public void setXgrId(Long xgrId) {
        this.xgrId = xgrId;
    }

    public Date getXgsj() {
        return xgsj;
    }

    public void setXgsj(Date xgsj) {
        this.xgsj = xgsj;
    }

    public SfyxSt getSfyxSt() {
        return sfyxSt;
    }

    public void setSfyxSt(SfyxSt sfyxSt) {
        this.sfyxSt = sfyxSt;
    }

    public List<SysDictionaryItem> getChildren() {
        return children;
    }

    public void setChildren(List<SysDictionaryItem> children) {
        this.children = children;
    }
}
