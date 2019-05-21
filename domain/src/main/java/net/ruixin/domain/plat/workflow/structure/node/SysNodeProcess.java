package net.ruixin.domain.plat.workflow.structure.node;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;

import javax.persistence.*;

/**
 * 环节后置程序
 * @Author: mxding
 * @Date: 2019-03-26 14:18
 */
@Table(name = "SYS_NODE_PROCESS")
@Entity
public class SysNodeProcess extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_node_process", sequenceName = "seq_sys_node_process", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_node_process")
    private Long id;

    /**
     * 环节ID
     */
    @Column(name = "NODE_ID")
    private Long nodeId;

    /**
     * 程序绑定的动作
     */
    @Column(name = "ACTION")
    private String action;

    /**
     * 程序类型
     */
    @Column(name = "TYPE")
    private String type;

    /**
     * 程序内容
     */
    @Column(name = "CONTENT")
    private String content;

    /**
     * 序号
     */
    @Column(name = "SORT")
    private Long sort;

    /**
     * 有效状态，0：无效，1：有效
     */
    @Enumerated
    @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNodeId() {
        return nodeId;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public SfyxSt getSfyxSt() {
        return sfyxSt;
    }

    public void setSfyxSt(SfyxSt sfyxSt) {
        this.sfyxSt = sfyxSt;
    }

    public Long getSort() {
        return sort;
    }

    public void setSort(Long sort) {
        this.sort = sort;
    }
}
