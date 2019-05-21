package net.ruixin.domain.plat.workflow.transactor;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 办理人表
 */
@SuppressWarnings("unused")
@Table(name = "SYS_WORKFLOW_TRANSACTOR")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysWorkflowTransactor extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_workflow_transactor", sequenceName = "SEQ_SYS_WORKFLOW_TRANSACTOR", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_workflow_transactor")
    private Long id;

    //名称
    @Column(name = "NAME")
    private String name;

    //与来源一对多
    @OneToMany(targetEntity = SysWorkflowTransactorSource.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns(@JoinColumn(name = "TRANSACTOR_ID", referencedColumnName = "ID"))
    private List<SysWorkflowTransactorSource> sourceList;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public List<SysWorkflowTransactorSource> getSourceList() {
        return sourceList;
    }

    public void setSourceList(List<SysWorkflowTransactorSource> sourceList) {
        this.sourceList = sourceList;
    }
}
