package net.ruixin.domain.plat.workflow.transactor;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 办理人来源关联表
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_TRANSACTOR_SOURCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbTransactorSource extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_glb_transactor_source", sequenceName = "SEQ_SYS_GLB_TRANSACTOR_SOURCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_glb_transactor_source")
    private Long id;

    //办理人来源ID
    @Column(name = "SOURCE_ID")
    private Long sourceId;

    //关联对象ID
    @Column(name = "OBJECT_ID")
    private Long objectId;

    //对象类型 1用户 2机构 3角色 4限定条件 5规则
    @Column(name = "OBJECT_TYPE")
    private String objectType;

    //来源对象，用于对象的展示
    @Transient
    private Object sourceObj;

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

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long object_id) {
        this.objectId = object_id;
    }

    public String getObjectType() {
        return objectType;
    }

    public void setObjectType(String objectType) {
        this.objectType = objectType;
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

    public Object getSourceObj() {
        return sourceObj;
    }

    public void setSourceObj(Object sourceObj) {
        this.sourceObj = sourceObj;
    }
}
