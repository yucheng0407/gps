package net.ruixin.util.tools;

/**
 * jexl中的公式解析
 * 考虑公式包含公式的情况，计算结果的传递
 * 数字的精度问题
 */
public class FormulaResolve {

    //相加
    public Object SUM(Object obj1, Object obj2) {
        //直接返回值，不会做二次转换，不会将返回的obj1+obj2计算
        Object res;
        Float f = Float.parseFloat(obj1.toString()) + Float.parseFloat(obj2.toString());
        //需要判断含不含小数位，如果小数位是0，则转化为整数
        //还是提供直接转化为int的函数？？
        String[] fArr = f.toString().split("\\.");
        if (fArr.length == 1 || (fArr.length == 2 && Long.parseLong(fArr[1]) == 0)) {
            res = fArr[0];
        } else {
            res = f;
        }
        return res;
    }

    //整除
    public Object AVERAGE(Object obj1) {
        return "";
    }

    //在不再里面
    //true or false
    public Object INSTR() {
        return true;
    }
}
