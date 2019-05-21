package net.ruixin.enumerate.plat;

public enum WorkflowInstanceStatus {
    /**
     * 流程实例状态
     */
    COMPLETE("完成", "0"),
    PENDING("挂起", "1"),
    RUNNING("运行", "2"),
    END("终止", "3"),
    START_ERROR("未正常启动", "4"),
    NOT_SUBMITTED("未提交", "5"),
    TERMINATION_WITHDRAWAL("撤回终止", "6"),
    TERMINATION_RETURN("退回终止", "7");

    public final String name;

    public final String id;

    WorkflowInstanceStatus(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public static String getName(String id) {
        for (WorkflowInstanceStatus c : WorkflowInstanceStatus.values()) {
            if (c.id.equals(id)) {
                return c.name;
            }
        }
        return null;
    }

    public static WorkflowInstanceStatus get(String id) {
        for (WorkflowInstanceStatus c : WorkflowInstanceStatus.values()) {
            if (c.id.equals(id)) {
                return c;
            }
        }
        return null;
    }

    public String getId() {
        return id;
    }
}
