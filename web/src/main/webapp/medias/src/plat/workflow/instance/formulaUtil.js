/******************公式解析************************/
var FormulaUtil = {
    /**
     * 数字相加
     * @returns {number}
     */
    SUM: function () {
        //前置验证
        var v = 0, num;
        for (var i = 0, maxLength = arguments.length; i < maxLength; i++) {
            if ((num = parseFloat(arguments[i])) == arguments[i]) {
                v += parseFloat(num);
            }
        }
        return v;
    }
};
