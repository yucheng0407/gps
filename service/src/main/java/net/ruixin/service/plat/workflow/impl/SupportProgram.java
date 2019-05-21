package net.ruixin.service.plat.workflow.impl;

import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.service.plat.workflow.ISupportProgram;

/**
 * 工作流后置程序接口抽象实现
 * Created by Jealous on 2016-8-22.
 */
@SuppressWarnings({"unused", "WeakerAccess"})
public abstract class SupportProgram implements ISupportProgram {

    protected SysNodeInstance nodeInstance;
    protected SysWorkflowInstance workflowInstance;
    protected SysTask sysTask;

    public SysNodeInstance getNodeInstance() { return nodeInstance; }

    public void setNodeInstance(SysNodeInstance nodeInstance) {
        this.nodeInstance = nodeInstance;
    }

    public SysWorkflowInstance getWorkflowInstance() { return workflowInstance; }

    public void setWorkflowInstance(SysWorkflowInstance workflowInstance) {
        this.workflowInstance = workflowInstance;
    }

    public SysTask getSysTask() {
        return sysTask;
    }

    public void setSysTask(SysTask sysTask) {
        this.sysTask = sysTask;
    }
}
