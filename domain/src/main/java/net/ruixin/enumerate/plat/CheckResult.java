package net.ruixin.enumerate.plat;

/**
 * 帖子审核结果
 * @Author: mxding
 * @Date: 2018-10-31 12:06
 */
public enum CheckResult {
    UNAPPROVED("0"), // 审核未通过
    APPROVED("1"); // 审核通过

    public final String value;

    CheckResult(String value) {
        this.value = value;
    }
}
