package net.ruixin.domain.plat.workflow.transactor;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 办理人限定条件
 */
@SuppressWarnings("unused")
@Table(name = "SYS_NODE_ASSIGNEE_CONDITION")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysNodeAssigneeCondition extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_node_transactor", sequenceName = "SEQ_SYS_NODE_ASSIGNEE_CONDITIO", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_node_transactor")
    private Long id;

    //用户限定：1流程启动人 2上一环节办理人
    @Column(name = "USER_CONDITION")
    private String userCondition;

    //机构限定： 1无限制 2所属机构 3上级机构 4直接下级 5所有下级
    @Column(name = "ORGAN_CONDITION")
    private String organCondition;

    //限定时是否包含限定用户 0 否 1是
    @Column(name = "SELF_INCLUDED")
    private String selfIncluded;

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

    public String getUserCondition() {
        return userCondition;
    }

    public void setUserCondition(String userCondition) {
        this.userCondition = userCondition;
    }

    public String getOrganCondition() {
        return organCondition;
    }

    public void setOrganCondition(String organCondition) {
        this.organCondition = organCondition;
    }

    public String getSelfIncluded() {
        return selfIncluded;
    }

    public void setSelfIncluded(String selfIncluded) {
        this.selfIncluded = selfIncluded;
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
