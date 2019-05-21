package net.ruixin.domain.plat.message;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 消息用户关联实体类
 * @author Pitcher
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_MESSAGE_USER")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbMsgUser extends BaseDomain {

    //主键
    @Id
    @SequenceGenerator(name = "seq_message_user", sequenceName = "SEQ_SYS_GLB_MESSAGE_USER", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_message_user")
    private Long id;

    //消息id
    @Column(name = "MESSAGE_ID")
    private Long messageId;

    //用户id
    @Column(name = "USER_ID")
    private Long userId;

    //状态（字典项 1：未阅 2：已阅 3：已办理）
    @Column(name = "STATUS")
    private String status;

    //接收时间
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "RECEIVE_TIME")
    private Date receiveTime;

    //有效标志（1：有效 0：无效）
    @Enumerated
   @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public SysGlbMsgUser() {
        this.sfyxSt = SfyxSt.VALID;
        this.status="1";
    }

    public SysGlbMsgUser(Long userId) {
        this.userId = userId;
        this.sfyxSt = SfyxSt.VALID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getReceiveTime() {
        return receiveTime;
    }

    public void setReceiveTime(Date receiveTime) {
        this.receiveTime = receiveTime;
    }

    public SfyxSt getSfyxSt() {
        return sfyxSt;
    }

    public void setSfyxSt(SfyxSt sfyxSt) {
        this.sfyxSt = sfyxSt;
    }
}
