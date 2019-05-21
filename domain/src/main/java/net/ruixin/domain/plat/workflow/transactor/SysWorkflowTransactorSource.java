package net.ruixin.domain.plat.workflow.transactor;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 办理人来源
 */
@SuppressWarnings("unused")
@Table(name = "SYS_WORKFLOW_TRANSACTOR_SOURCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflowTransactorSource extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_workflow_transactor_source", sequenceName = "SEQ_SYS_WORKFLOW_TRANSACTOR_SO", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_workflow_transactor_source")
    private Long id;

    //所属办理人ID
    @Column(name = "TRANSACTOR_ID")
    private Long transactorId;

    //来源类型 1指定用户 2指定机构 3角色 4限定条件 5自定义规则
    @Column(name = "TYPE")
    private String type;

    //是否包含额外条件  0 否 1是
    @Column(name = "HAS_EXTRA")
    private String hasExtra;

    @OneToMany(targetEntity = SysGlbTransactorSource.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns(@JoinColumn(name = "SOURCE_ID", referencedColumnName = "ID"))
    private List<SysGlbTransactorSource> glSourceList;

    //创建人
    @Column(name = "CJR_ID")
    private Long cjrId;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //修改人
    @Column(name = "XGR_ID")
    private Long xgrId;

    //修改时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;

    //有效标识:0无效，1有效
    @Enumerated
    @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTransactorId() {
        return transactorId;
    }

    public void setTransactorId(Long transactorId) {
        this.transactorId = transactorId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getHasExtra() {
        return hasExtra;
    }

    public void setHasExtra(String hasExtra) {
        this.hasExtra = hasExtra;
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

    public List<SysGlbTransactorSource> getGlSourceList() {
        return glSourceList;
    }

    public void setGlSourceList(List<SysGlbTransactorSource> glSourceList) {
        this.glSourceList = glSourceList;
    }
}
