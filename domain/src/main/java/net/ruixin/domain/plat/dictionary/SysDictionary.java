package net.ruixin.domain.plat.dictionary;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by huchao on 2019/3/20 16:53
 */
@Table(name = "SYS_DICTIONARY")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysDictionary extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_dictionary", sequenceName = "SEQ_SYS_DICTIONARY", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_dictionary")
    private Long id;

    //字典编码
    @Column(name = "DICT_CODE")
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "字典编码")})
    private String dictCode;

    //字典名称
    @Column(name = "DICT_NAME")
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "字典名称")})
    private String dictName;

    //字典描述
    @Column(name = "DESCRIPTION")
    private String description;

    //创建人id
    @Column(name = "CJR_ID")
    private Long cjrId;

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

    //与字典项的一对多关系
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "DICT_ID", referencedColumnName = "ID")
    @Where(clause = "SFYX_ST='1' AND PID IS NULL")
    @OrderBy("sort")
    private List<SysDictionaryItem> sysDictionaryItemList;

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

    public String getDictName() {
        return dictName;
    }

    public void setDictName(String dictName) {
        this.dictName = dictName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<SysDictionaryItem> getSysDictionaryItemList() {
        return sysDictionaryItemList;
    }

    public void setSysDictionaryItemList(List<SysDictionaryItem> sysDictionaryItemList) {
        this.sysDictionaryItemList = sysDictionaryItemList;
    }
}
