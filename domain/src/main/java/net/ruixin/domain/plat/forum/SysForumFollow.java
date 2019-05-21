package net.ruixin.domain.plat.forum;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import javax.persistence.*;
import java.util.Date;

/**
 * 跟帖
 * @Author: mxding
 * @Date: 2019-02-14 11:22
 */
@Table(name = "SYS_FORUM_FOLLOW")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysForumFollow extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_forum_follow", sequenceName = "SEQ_SYS_FORUM_FOLLOW", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_forum_follow")
    private Long id;

    //版块ID
    @Column(name = "BOARD_ID")
    private Long boardId;

    //主题帖ID
    @Column(name = "TOPIC_ID")
    private Long topicId;

    //内容
    @Column(name = "CONTENT", columnDefinition = "CLOB")
    private String content;

    //楼层
    @Column(name = "FLOOR")
    private Long floor;

    //创建人id
    @Column(name = "CJR_ID")
    private Long cjrId;

    //创建时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CJSJ")
    private Date cjsj;

    //修改人id
    @Column(name = "XGR_ID")
    private Long xgrId;

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

    public Long getBoardId() {
        return boardId;
    }

    public void setBoardId(Long boardId) {
        this.boardId = boardId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getFloor() {
        return floor;
    }

    public void setFloor(Long floor) {
        this.floor = floor;
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
