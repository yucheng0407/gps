package net.ruixin.util.tools;

import org.apache.commons.jexl3.*;

import java.util.HashMap;
import java.util.Map;

public class JexlCalculate {
    private static JexlEngine jexlEngine;

    /**
     * 获取JexlEngine
     *
     * @return JexlEngine
     */
    private static JexlEngine getJexlEngine() {
        if (null == jexlEngine) {
            // 表达式调用 用户自定义函数
            Map<String, Object> funcs = new HashMap<>();
            funcs.put(null, new FormulaResolve());
            // 创建 JexlEngine
            jexlEngine = new JexlBuilder().namespaces(funcs).create();
        }
        return jexlEngine;
    }

    /**
     * 对外接口，传入需要计算的字符串，返回计算结果
     *
     * @param jexlExp 计算的字符串
     * @return Object
     */
    public static Object evaluateVars(String jexlExp) {
        //可以考虑在此基础上公式的解析，解析公式可以套公式，在进行新的一轮公式解析，用另一套???
        JexlExpression e = getJexlEngine().createExpression(jexlExp);
        // 创建context,用于传递参数
        JexlContext jc = new MapContext();
        return e.evaluate(jc);
    }

    public static void main(String[] args) {
        System.out.println(evaluateVars("SUM(SUM(1,2),2)"));
    }
}
