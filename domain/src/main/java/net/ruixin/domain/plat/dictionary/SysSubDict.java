package net.ruixin.domain.plat.dictionary;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * 字典项实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_SUBDICT")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysSubDict extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_subdict", sequenceName = "SEQ_SYS_SUBDICT", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_subdict")
    private Long id;

    @Column(name = "DICT_CODE")
    private String dictCode;

    @Column(name = "CODE")
    private String code;

    @Column(name = "VALUE")
    private String value;

    @Column(name = "PCODE")
    private String pcode;

    @Formula("(SELECT T.VALUE FROM SYS_SUBDICT T  WHERE T.DICT_CODE=PDICT_CODE AND T.CODE=PCODE)")
    private String pName;

    @Column(name = "PDICT_CODE")
    private String pdictCode;

    //字典项扩展
    @Column(name = "REMARK")
    private String remark;

    //序号
    @Column(name = "SORT")
    private Integer sort;

    //创建人id
    @Column(name = "CJR_ID")
    private Long cjr_id;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //修改人id
    @Column(name = "XGR_ID")
    private Long xgrId;

    //修改时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;

    //有效状态，0：无效，1：有效
    @Enumerated
    @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDictCode() {
        return dictCode;
    }

    public void setDictCode(String dictCode) {
        this.dictCode = dictCode;
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


    public String getPcode() {
        return pcode;
    }

    public void setPcode(String pcode) {
        this.pcode = pcode;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public Long getCjr_id() {
        return cjr_id;
    }

    public void setCjr_id(Long cjr_id) {
        this.cjr_id = cjr_id;
    }

    public String getPdictCode() {
        return pdictCode;
    }

    public void setPdictCode(String pdictCode) {
        this.pdictCode = pdictCode;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Long getCjrId() {
        return cjr_id;
    }

    public void setCjrId(Long cjr_id) {
        this.cjr_id = cjr_id;
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
}
