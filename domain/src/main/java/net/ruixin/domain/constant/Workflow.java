package net.ruixin.domain.constant;

/**
 * 流程常量
 */
public interface Workflow {
    String COLUMN_DATA_ID = "DATA_ID";
    String COLUMN_TITLE = "TITLE";

    String SUBMIT = "SUBMIT";
    String BACK = "BACK";
    String RECOVER = "RECOVER";
    String SPECIAL_BACK = "SPECIAL_BACK"; //特送退回
    String ALL = "ALL";

    String WF_NOT_FOUND = "流程不存在";
    String NO_TITLE = "未设置流程实例标题";
    String START_SUCCESS = "流程启动成功";
    String START_FAIL = "流程启动失败";

    String TRANSACT_SUCCESS = "办理成功";
    String TRANSACT_FAIL = "办理失败";

    String SUBMIT_SUCCESS = "提交成功";
    String SUBMIT_FAIL = "提交失败";
    String BACK_SUCCESS = "退回成功";
    String BACK_FAIL = "退回失败";
    String RECOVER_SUCCESS = "撤回成功";
    String RECOVER_FAIL = "撤回失败";
    String SPECIAL_BACK_SUCCESS = "特送退回成功";
}
