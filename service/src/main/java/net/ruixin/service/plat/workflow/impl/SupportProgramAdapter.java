package net.ruixin.service.plat.workflow.impl;

/**
 * 后置程序适配器
 * 可以继承此类复写部分方法
 * @Author: mxding
 * @Date: 2019-02-02 14:21
 */
public abstract class SupportProgramAdapter extends SupportProgram {
    @Override
    public void postRecover() {}

    @Override
    public void postSubmit(String opinion, String branch, String fjId) {}

    @Override
    public void postBack(String opinion, String branch, String fjId) {}

    @Override
    public void postSpecialBack(String opinion, String fjId) {}
}
