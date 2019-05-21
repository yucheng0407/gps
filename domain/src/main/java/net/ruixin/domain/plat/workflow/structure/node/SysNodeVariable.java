package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * 环节变量（决策环节）
 */
@SuppressWarnings("unused")
@Entity
@Table(name = "SYS_NODE_VARIABLE")
@Inheritance(strategy = InheritanceType.JOINED)
@DynamicInsert
@DynamicUpdate
public class SysNodeVariable extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_sys_node_variable", sequenceName = "SEQ_SYS_NODE_VARIABLE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_node_variable")
    private Long id;

    //显示名称
    @Column(name = "NAME")
    private String name;

    //code
    @Column(name = "CODE")
    private String code;

    //默认值
    @Column(name = "VALUE")
    private String value;

    //赋值表达式
    @Column(name = "ASSIGN_LOGIC")
    private String assignLogic;

    //环节
    @Column(name = "NODE_ID")
    private Long nodeId;

    //流程id
    @Column(name = "WORKFLOW_ID")
    private Long workflowId;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getAssignLogic() {
        return assignLogic;
    }

    public void setAssignLogic(String assignLogic) {
        this.assignLogic = assignLogic;
    }

    public Long getNodeId() {
        return nodeId;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public SfyxSt getSfyxSt() {
        return sfyxSt;
    }

    public void setSfyxSt(SfyxSt sfyxSt) {
        this.sfyxSt = sfyxSt;
    }

    public Long getWorkflowId() {
        return workflowId;
    }

    public void setWorkflowId(Long workflowId) {
        this.workflowId = workflowId;
    }
}
