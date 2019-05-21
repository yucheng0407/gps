package net.ruixin.domain.plat.attachment;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * 附件数据实体类
 */
@SuppressWarnings("unused")
@Table(name = "SYS_ATTACHMENT_DATA")
@Entity
@DynamicInsert
@DynamicUpdate
public class AttachmentData extends BaseDomain {
    /**
     * ID
     */
    @Id
    @SequenceGenerator(name = "seq_attachment_data", sequenceName = "SEQ_SYS_ATTACHMENT_DATA", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_attachment_data")
    private Long id;

    //附件id
    @Column(name = "ATTACHMENT_ID")
    private Long attachmentId;

    @Column(name = "CONTENT")
    private byte[] content;

    /**
     * 是否有效  0:无效 1：有效
     */
    @Enumerated
   @Column(name = "SFYX_ST")
    private SfyxSt sfyxSt;

    public AttachmentData() {
    }

    public AttachmentData(Long attachmentId, byte[] content, SfyxSt sfyxSt) {
        this.attachmentId = attachmentId;
        this.content = content;
        this.sfyxSt = sfyxSt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(Long attachmentId) {
        this.attachmentId = attachmentId;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public SfyxSt getSfyxSt() {
        return sfyxSt;
    }

    public void setSfyxSt(SfyxSt sfyxSt) {
        this.sfyxSt = sfyxSt;
    }
}
