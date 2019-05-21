package net.ruixin.domain.plat.resource;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Zp on 2017/10/19.
 * 角色资源关联实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_ROLE_RESOURCE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbRoleResource extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_glb_role_resource", sequenceName = "SEQ_SYS_GLB_ROLE_RESOURCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_glb_role_resource")
    private Long id;

    //关联角色id
    @Column(name = "ROLE_ID")
    private Long roleId;

    //关联资源id
    @Column(name = "RESOURCE_ID")
    private Long resourceId;

    //创建人
    @Column(name = "CJR_ID")
    private Long cjrId;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //有效状态
    @Enumerated
   @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
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

    public SfyxSt getSfyxSt() {
        return sfyxSt;
    }

    public void setSfyxSt(SfyxSt sfyxSt) {
        this.sfyxSt = sfyxSt;
    }
}
