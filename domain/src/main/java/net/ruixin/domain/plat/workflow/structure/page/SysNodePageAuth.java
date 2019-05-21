package net.ruixin.domain.plat.workflow.structure.page;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 环节页面权限
 */
@Table(name = "SYS_NODE_PAGE_AUTH")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysNodePageAuth extends BaseDomain {
    //ID
    @Id
    @SequenceGenerator(name = "seq_node_page_auth", sequenceName = "SEQ_NODE_PAGE_AUTH", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_node_page_auth")
    private Long id;
    //环节的domId

    @Column(name = "DOM_ID")
    private String domId;

    //页面id
    @Column(name = "PAGE_ID")
    private Long pageId;

    //类型，field、button、或者其它
    @Column(name = "TYPE")
    private String type;

    //所属表单id
    @Column(name = "FORM_ID")
    private Long formId;

    //表单字段code
    @Column(name = "CODE")
    private String code;

    //表单字段名称
    @Transient
    private String label;

    //权限
    @Column(name = "AUTH_ATTR")
    private String authAttr;

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

    //创建时间
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

    public String getDomId() {
        return domId;
    }

    public void setDomId(String domId) {
        this.domId = domId;
    }

    public Long getPageId() {
        return pageId;
    }

    public void setPageId(Long pageId) {
        this.pageId = pageId;
    }

    public String getAuthAttr() {
        return authAttr;
    }

    public void setAuthAttr(String authAttr) {
        this.authAttr = authAttr;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getFormId() {
        return formId;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
