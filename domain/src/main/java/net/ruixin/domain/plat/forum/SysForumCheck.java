package net.ruixin.domain.plat.forum;

import net.ruixin.enumerate.plat.CheckResult;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import javax.persistence.*;
import java.util.Date;

/**
 * 帖子审核
 * @Author: mxding
 * @Date: 2018-10-31 11:04
 */
@Table(name = "SYS_TOPIC_CHECK")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysForumCheck {

    @Id
    @SequenceGenerator(name = "seq_sys_topic_check", sequenceName = "SEQ_SYS_TOPIC_CHECK", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_topic_check")
    private Long id;

    //主题ID
    @Column(name = "TOPIC_ID")
    private Long topicId;

    //审核人
    @Column(name = "SHR_ID")
    private Long checkUserId;

    //审核结果
    @Enumerated
    @Column(name = "SHJG")
    private CheckResult checkResult;

    //审核意见
    @Column(name = "OPINION")
    private String opinion;

    //审核时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "SHSJ")
    private Date checkTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Long getCheckUserId() {
        return checkUserId;
    }

    public void setCheckUserId(Long checkUserId) {
        this.checkUserId = checkUserId;
    }

    public CheckResult getCheckResult() {
        return checkResult;
    }

    public void setCheckResult(CheckResult checkResult) {
        this.checkResult = checkResult;
    }

    public String getOpinion() {
        return opinion;
    }

    public void setOpinion(String opinion) {
        this.opinion = opinion;
    }

    public Date getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(Date checkTime) {
        this.checkTime = checkTime;
    }
}
