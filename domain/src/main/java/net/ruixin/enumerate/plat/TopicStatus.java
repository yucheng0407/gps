package net.ruixin.enumerate.plat;

/**
 * 论坛主题帖状态
 * @Author: mxding
 * @Date: 2018-10-31 11:28
 */
public enum TopicStatus {

    DRAFT("0"), // 草稿
    PENDING("1"), // 待审核
    APPROVED("2"), // 审核通过
    UNAPPROVED("3"); // 审核未通过

    public final String value;

    TopicStatus(String value) {
        this.value = value;
    }
}
