package net.ruixin.service.plat.workflow;

/**
 * 工作流后置程序接口
 * Created by Jealous on 2016-8-22.
 */
@SuppressWarnings("unused")
public interface ISupportProgram {

    /**
     * 撤回后置
     */
    void postRecover();

    /**
     * 提交后置
     * @param opinion
     * @param branch
     * @param fjId
     */
    void postSubmit(String opinion, String branch, String fjId);

    /**
     * 退回后置
     * @param opinion
     * @param branch
     * @param fjId
     */
    void postBack(String opinion, String branch, String fjId);
    /**
     * 特送退回后置
     * @param opinion
     * @param fjId
     */
    void postSpecialBack(String opinion, String fjId);
}
