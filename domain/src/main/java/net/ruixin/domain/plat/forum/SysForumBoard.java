package net.ruixin.domain.plat.forum;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

/**
 * 论坛版块
 * @Author: mxding
 * @Date: 2019-02-14 11:22
 */
@Table(name = "SYS_FORUM_BOARD")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysForumBoard extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_forum_board", sequenceName = "SEQ_SYS_FORUM_BOARD", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_forum_board")
    private Long id;

    // 编码
    @Column(name = "CODE")
    @Restrict(rules = {@Rule(validateClass = "CheckUnique", name = "版块编码")})
    private String code;

    // 标题
    @Column(name = "TITLE")
    private String title;

    // 描述
    @Column(name = "DESCRIPTION")
    private String description;

    // 版主id
    @Column(name = "MODERATOR")
    private Long moderatorId;

    // 版主用户名
    @Formula("(SELECT U.USER_NAME FROM SYS_USER U WHERE U.ID = MODERATOR AND U.SFYX_ST = '1')")
    private String moderator;

    // 图标
    @Column(name = "ICON")
    private String icon;

    //创建人id
    @Column(name = "CJR_ID")
    private Long cjrId;

    // 创建人用户名
    @Formula("(SELECT U.USER_NAME FROM SYS_USER U WHERE U.ID = CJR_ID AND U.SFYX_ST = '1')")
    private String cjr;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //修改人id
    @Column(name = "XGR_ID")
    private Long xgrId;

    // 修改人用户名
    @Formula("(SELECT U.USER_NAME FROM SYS_USER U WHERE U.ID = XGR_ID AND U.SFYX_ST = '1')")
    private String xgr;

    //修改时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "XGSJ")
    private Date xgsj;

    //有效状态，0：无效，1：有效
    @Enumerated
    @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getModeratorId() {
        return moderatorId;
    }

    public void setModeratorId(Long moderatorId) {
        this.moderatorId = moderatorId;
    }

    public String getModerator() {
        return moderator;
    }

    public void setModerator(String moderator) {
        this.moderator = moderator;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Long getCjrId() {
        return cjrId;
    }

    public void setCjrId(Long cjrId) {
        this.cjrId = cjrId;
    }

    public String getCjr() {
        return cjr;
    }

    public void setCjr(String cjr) {
        this.cjr = cjr;
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

    public String getXgr() {
        return xgr;
    }

    public void setXgr(String xgr) {
        this.xgr = xgr;
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
