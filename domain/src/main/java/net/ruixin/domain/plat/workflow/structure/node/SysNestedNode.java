package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * 实体类：嵌套环节
 */
@SuppressWarnings("unused")
@Table(name = "SYS_NESTED_NODE")
@Entity
@PrimaryKeyJoinColumn(name = "ID")
@DynamicInsert
@DynamicUpdate
public class SysNestedNode extends SysTransactNode {
    //嵌套子流程
    @Column(name = "WORKFLOW_CODE")
    private String workflowCode;

    @Column(name = "BLR_CHOOSE")
    private String blrChoose;

    @Column(name="DEFAULT_BACK_NODE_ID")
    private Long rejectedNodeId;

    //不同意跳转环节ID
    @Column(name="DISAGREE_NODE_ID")
    private Long disagreeNodeId;

    //同意跳转环节DOM ID
    @Formula("(SELECT SN.DOM_ID FROM SYS_NODE SN WHERE SN.ID=disagree_node_id)")
    private String disagreeNodeDomid;

    public String getWorkflowCode() {
        return workflowCode;
    }

    public void setWorkflowCode(String workflowCode) {
        this.workflowCode = workflowCode;
    }

    public String getBlrChoose() {
        return blrChoose;
    }

    public void setBlrChoose(String blrChoose) {
        this.blrChoose = blrChoose;
    }

    public Long getRejectedNodeId() {
        return rejectedNodeId;
    }

    public void setRejectedNodeId(Long rejectedNodeId) {
        this.rejectedNodeId = rejectedNodeId;
    }

    public Long getDisagreeNodeId() {
        return disagreeNodeId;
    }

    public void setDisagreeNodeId(Long disagreeNodeId) {
        this.disagreeNodeId = disagreeNodeId;
    }

    public String getDisagreeNodeDomid() {
        return disagreeNodeDomid;
    }

    public void setDisagreeNodeDomid(String disagreeNodeDomid) {
        this.disagreeNodeDomid = disagreeNodeDomid;
    }
}
