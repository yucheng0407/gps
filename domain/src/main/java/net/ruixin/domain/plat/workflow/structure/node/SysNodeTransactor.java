package net.ruixin.domain.plat.workflow.structure.node;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.workflow.transactor.SysWorkflowTransactor;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

@Table(name = "SYS_NODE_TRANSACTOR")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysNodeTransactor extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_node_transactor", sequenceName = "SEQ_SYS_NODE_TRANSACTOR", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_node_transactor")
    private Long id;

    //所属环节
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "NODE_ID")
    @JsonIgnore
    private SysNode node;

    //办理人
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "TRANSACTOR_ID")
    private SysWorkflowTransactor transactor;

    @Transient
    private Long transactorId;

    @Transient
    private String transactorName;

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


    //有效标识
    @Enumerated
    @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SysNode getNode() {
        return node;
    }

    public void setNode(SysNode node) {
        this.node = node;
    }

    public SysWorkflowTransactor getTransactor() {
        return transactor;
    }

    public void setTransactor(SysWorkflowTransactor transactor) {
        this.transactor = transactor;
    }

    public Long getTransactorId() {
        if (transactor != null) {
            return transactor.getId();
        }
        return null;
    }

    public String getTransactorName() {
        if (transactor != null) {
            return transactor.getName();
        }
        return null;
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
}
