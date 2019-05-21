package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.enumerate.plat.ConvergeType;
import net.ruixin.enumerate.plat.CountersignParameter;
import net.ruixin.enumerate.plat.TransactType;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * Created by Jealous on 2015/10/15.
 * 实体类：活动环节
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ACTIVITY_NODE")
@Entity
@PrimaryKeyJoinColumn(name="ID")
@DynamicInsert
@DynamicUpdate
public class SysActivityNode extends SysTransactNode{
    //多人办理方式
    @Enumerated
    @Column(name = "TRANSACT_TYPE")
    private TransactType transactType;
    //会签处理参数
    @Enumerated
    @Column(name = "COUNTERSIGN_PARAMETER")
    private CountersignParameter countersignParameter;
    //会签处理参数值
    @Column(name = "COUNTERSIGN_VALUE")
    private Integer countersignValue;
    //聚合方式
    @Column(name = "CONVERGE_TYPE")
    private ConvergeType convergeType;
    //不同意跳转环节ID
    @Column(name="DISAGREE_NODE_ID")
    private Long disagree_node_id;
    //旧版流程设计器
    @Transient
    private String disagree_nodedom_id;
    //同意跳转环节DOM ID（新版）
    @Formula("(SELECT SN.DOM_ID FROM SYS_NODE SN WHERE SN.ID=disagree_node_id)")
    private String disagreeNodeDomid;

    //提交个性设置名称
    @Column (name = "SUBMITNAME")
    private String submitName;

    //保存个性设置名称
    @Column (name = "SAVENAME")
    private String saveName;

    //办理人是否可选 0：默认 1：可选 2：不可选
    @Column (name="BLR_CHOOSE")
    private String blrChoose;

    //环节类型，0提交,1审批
    @Column(name = "NODE_GENRE")
    private String nodeGenre;

    public TransactType getTransactType() {
        return transactType;
    }

    public void setTransactType(TransactType transactType) {
        this.transactType = transactType;
    }

    public CountersignParameter getCountersignParameter() {
        return countersignParameter;
    }

    public void setCountersignParameter(CountersignParameter countersignParameter) {
        this.countersignParameter = countersignParameter;
    }

    public Integer getCountersignValue() {
        return countersignValue;
    }

    public void setCountersignValue(Integer countersignValue) {
        this.countersignValue = countersignValue;
    }

    public ConvergeType getConvergeType() {
        return convergeType;
    }

    public void setConvergeType(ConvergeType convergeType) {
        this.convergeType = convergeType;
    }

    public Long getDisagree_node_id() {
        return disagree_node_id;
    }

    public void setDisagree_node_id(Long disagree_node_id) {
        this.disagree_node_id = disagree_node_id;
    }

    public String getDisagree_nodedom_id() {
        return disagree_nodedom_id;
    }

    public void setDisagree_nodedom_id(String disagree_nodedom_id) {
        this.disagree_nodedom_id = disagree_nodedom_id;
    }

    public String getSubmitName() {
        return submitName;
    }

    public void setSubmitName(String submitName) {
        this.submitName = submitName;
    }

    public String getSaveName() {
        return saveName;
    }

    public void setSaveName(String saveName) {
        this.saveName = saveName;
    }

    public String getDisagreeNodeDomid() {
        return disagreeNodeDomid;
    }

    public void setDisagreeNodeDomid(String disagreeNodeDomid) {
        this.disagreeNodeDomid = disagreeNodeDomid;
    }

    public String getBlrChoose() {
        return blrChoose;
    }

    public void setBlrChoose(String blrChoose) {
        this.blrChoose = blrChoose;
    }

    public String getNodeGenre() {
        return nodeGenre;
    }

    public void setNodeGenre(String nodeGenre) {
        this.nodeGenre = nodeGenre;
    }
}
