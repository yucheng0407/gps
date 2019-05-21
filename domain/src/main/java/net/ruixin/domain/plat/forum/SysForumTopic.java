package net.ruixin.domain.plat.forum;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.enumerate.plat.TopicStatus;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 主题帖实体
 * @Author: mxding
 * @Date: 2019-02-15 13:05
 */
@Table(name = "SYS_FORUM_TOPIC")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysForumTopic extends BaseDomain {

    @Id
    @SequenceGenerator(name = "seq_sys_forum_topic", sequenceName = "SEQ_SYS_FORUM_TOPIC", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_forum_topic")
    private Long id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "CONTENT", columnDefinition = "CLOB")
    private String content;

    @Column(name = "BOARD_ID")
    private Long boardId;

    @Enumerated
    @Column(name = "STATUS")
    private TopicStatus topicStatus;

    @Column(name = "TOP")
    private Boolean isTop;

    @Column(name = "BEST")
    private Boolean isBest;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getBoardId() {
        return boardId;
    }

    public void setBoardId(Long boardId) {
        this.boardId = boardId;
    }

    public TopicStatus getTopicStatus() {
        return topicStatus;
    }

    public void setTopicStatus(TopicStatus topicStatus) {
        this.topicStatus = topicStatus;
    }

    public Boolean getTop() {
        return isTop;
    }

    public void setTop(Boolean top) {
        isTop = top;
    }

    public Boolean getBest() {
        return isBest;
    }

    public void setBest(Boolean best) {
        isBest = best;
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
