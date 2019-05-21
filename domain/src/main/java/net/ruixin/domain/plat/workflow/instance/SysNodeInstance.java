package net.ruixin.domain.plat.workflow.instance;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016/03/02.
 * 环节实例
 */
@SuppressWarnings("unused")
@Table(name = "SYS_NODE_INSTANCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysNodeInstance extends BaseDomain {
    // ID
    @Id
    @SequenceGenerator(name = "seq_sys_node_instance", sequenceName = "SEQ_SYS_NODE_INSTANCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_node_instance")
    private Long id;
    // 环节
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "NODE_ID")
    private SysNode node_id;

    // 流程实例
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_INSTANCE_ID")
    private SysWorkflowInstance workflow_instance_id;

    // 状态：1运行,2完成  3暂停  4无效
    @Column(name = "STATUS")
    private String status;

    // 创建时间
    @Column(name = "CJSJ")
    private Date cjsj;

    // 结束时间
    @Column(name = "FINISH_DATE")
    private Date finish_date;
    //有效标识
    @Enumerated
    @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    //子流程实例
    @Transient
    private List<Map<String,Object>> workflowInstanceList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SysNode getNode_id() {
        return node_id;
    }

    public void setNode_id(SysNode node_id) {
        this.node_id = node_id;
    }

    public SysWorkflowInstance getWorkflow_instance_id() {
        return workflow_instance_id;
    }

    public void setWorkflow_instance_id(SysWorkflowInstance workflow_instance_id) {
        this.workflow_instance_id = workflow_instance_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCjsj() {
        return cjsj;
    }

    public void setCjsj(Date cjsj) {
        this.cjsj = cjsj;
    }

    public Date getFinish_date() {
        return finish_date;
    }

    public void setFinish_date(Date finish_date) {
        this.finish_date = finish_date;
    }

    public SfyxSt getSfyxSt() {
        return sfyxSt;
    }

    public void setSfyxSt(SfyxSt sfyxSt) {
        this.sfyxSt = sfyxSt;
    }

    public List<Map<String, Object>> getWorkflowInstanceList() {
        return workflowInstanceList;
    }

    public void setWorkflowInstanceList(List<Map<String, Object>> workflowInstanceList) {
        this.workflowInstanceList = workflowInstanceList;
    }
}
