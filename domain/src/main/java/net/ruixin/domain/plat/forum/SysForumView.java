package net.ruixin.domain.plat.forum;

import net.ruixin.domain.plat.BaseDomain;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 论坛查看
 * @Author: mxding
 * @Date: 2019-02-15 08:44
 */
@Table(name = "SYS_FORUM_VIEW")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysForumView extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_forum_view", sequenceName = "SEQ_SYS_FORUM_VIEW", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_forum_view")
    private Long id;

    @Column(name = "OBJECT_ID")
    private Long objectId;

    @Column(name = "VIEW_TYPE")
    private String viewType;

    @Column(name = "CJR_ID")
    private Long cjrId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public String getViewType() {
        return viewType;
    }

    public void setViewType(String viewType) {
        this.viewType = viewType;
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

    public SysForumView(Long objectId, String viewType) {
        this.setObjectId(objectId);
        this.setViewType(viewType);
    }
}
