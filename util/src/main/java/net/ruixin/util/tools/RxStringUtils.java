package net.ruixin.util.tools;

import com.fasterxml.jackson.core.JsonProcessingException;
import net.ruixin.util.json.JacksonMapper;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;

/**
 * 处理字符串的工具
 */
public class RxStringUtils {
    /**
     * 判断对象是否为null或空字符串
     *
     * @param str 待验证对象
     * @return Boolean
     */
    public static Boolean isEmpty(Object str) {
        return str == null || "".equals(str);
    }

    /**
     * 判断对象是否不为null或空字符串
     *
     * @param str 待验证对象
     * @return Boolean
     */
    public static Boolean isNotEmpty(Object str) {
        return str != null && !"".equals(str);
    }

    /**
     * 判断对象是否不为null或空字符串并且为“1”
     * zxh add 20171023
     *
     * @param str 待验证对象
     * @return Boolean
     */
    public static Boolean isNotEmptyAndEqualsOne(Object str) {
        return "1".equals(str);
    }

    /**
     * 判断对象是否不为null或空字符串并且为“0”
     * zxh add 20171023
     *
     * @param str 待验证对象
     * @return Boolean
     */
    public static Boolean isNotEmptyAndEqualsZero(Object str) {
        return "0".equals(str);
    }

    /**
     * Object对象转int 主要用于sql查询的BigDemical类型
     *
     * @param obj Object类型参数
     * @return int类型
     */
    public static int parseInt(Object obj) {
        return (obj == null) ? 0 : Integer.parseInt(obj.toString());
    }

    /**
     * Object对象转long 主要用于sql查询的BigDemical类型
     *
     * @param obj Object类型参数
     * @return long类型
     */
    public static long parseLong(Object obj) {
        return (obj == null) ? 0 : Long.parseLong(obj.toString());
    }

    /**
     * 将List类型转换为Json
     *
     * @param list List类型参数
     * @return String类型Json
     */
    public static String parseListToString(List list) {
        try {
            return JacksonMapper.getInstance().writeValueAsString(list);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 将字符串首字母转换为小写
     *
     * @param str 转换字符串
     * @return 转换后字符串
     */
    public static String toLowerCaseFirstOne(String str) {
        if (Character.isLowerCase(str.charAt(0))) {
            return str;
        } else {
            return (new StringBuilder()).append(Character.toLowerCase(str.charAt(0))).append(str.substring(1)).toString();
        }
    }

    /**
     * 将字符串首字母转换为大写
     *
     * @param str 转换字符串
     * @return 转换后字符串
     */
    public static String toUpperCaseFirstOne(String str) {
        if (Character.isUpperCase(str.charAt(0))) {
            return str;
        } else {
            return (new StringBuilder()).append(Character.toUpperCase(str.charAt(0))).append(str.substring(1)).toString();
        }
    }

    /**
     * 通过sql，拼接count字符串
     *
     * @param queryString 字符串
     * @return 字符串
     */
    public static String parseSelectCount(String queryString) {
        String hql = queryString.toLowerCase();
        int noBlankStart = 0;
        for (int len = hql.length(); noBlankStart < len; ++noBlankStart) {
            if (hql.charAt(noBlankStart) > ' ') {
                break;
            }
        }
        int pair = 0;
        if (!(followWithWord(hql, "select", noBlankStart))) {
            pair = 1;
        }
        int fromPos = -1;
        for (int i = noBlankStart; i < hql.length(); ) {
            if (followWithWord(hql, "select", i)) {
                ++pair;
                i += "select".length();
            } else if (followWithWord(hql, "from", i)) {
                --pair;
                if (pair == 0) {
                    fromPos = i;
                    break;
                }
                i += "from".length();
            } else {
                ++i;
            }
        }
        if (fromPos == -1) {
            throw new IllegalArgumentException("parse count sql error, check your sql/hql");
        }
        return "select count(*) " + queryString.substring(fromPos);
    }

    /**
     * 判断是否跟随某个字符
     */
    private static boolean followWithWord(String s, String sub, int pos) {
        int i = 0;
        for (; (pos < s.length()) && (i < sub.length()); ++i) {
            if (s.charAt(pos) != sub.charAt(i)) {
                return false;
            }
            ++pos;
        }

        return i >= sub.length() && (pos >= s.length() || (!(isAlpha(s.charAt(pos)))));

    }

    /**
     * 判断合法字符
     */
    private static boolean isAlpha(char c) {
        return ((c == '_') || (('0' <= c) && (c <= '9')) || (('a' <= c) && (c <= 'z')) || (('A' <= c) && (c <= 'Z')));
    }

    /**
     * 判断字符串是否为一个数字
     */
    public static boolean isNumber(String str) {
        return !(str == null || "".equals(str.trim())) && str.trim().matches("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$");
    }

    /**
     * 获取字符串长度
     */
    public static int getStrLength(String str) {
        int valueLength = 0;
        if (str == null) {
            return valueLength;
        }
        String chinese = "[\u0391-\uFFE5]";
        for (int i = 0; i < str.length(); i++) {
            /* 获取一个字符 */
            String temp = str.substring(i, i + 1);
            /* 判断是否为中文字符 */
            if (temp.matches(chinese)) {
                /* 中文字符长度为2 */
                valueLength += 2;
            } else {
                /* 其他字符长度为1 */
                valueLength += 1;
            }
        }
        return valueLength;
    }

    public static String getInSql(String zd, String ids) {
        StringBuilder sb = new StringBuilder();
        String[] idarray = ids.split(",");
        if (idarray != null && idarray.length > 0) {
            for (int i = 0; i < idarray.length; i++) {
                if (i == 0) {
                    sb.append(" (").append(zd).append(" in (");
                } else if (i % 500 == 0) {
                    sb.deleteCharAt(sb.length() - 1);
                    sb.append(") or ").append(zd).append(" in (");
                }
                sb.append(idarray[i]).append(",");
                if (i == idarray.length - 1) {
                    sb.deleteCharAt(sb.length() - 1);
                    sb.append(")) ");
                }
            }
        }
        return sb.toString();
    }

    public static String toEmptyString(Object src) {
        return isEmpty(src) ? "" : src.toString();
    }

    public static void handleDate(String date, StringBuilder sql, List<Object> params, String fieldName) {
        if (StringUtils.isNotBlank(date)) {
            String[] dateRange = date.split(" - ");
            String dateFormat = getByString(dateRange[0]);

            if (dateFormat != null) {
                switch (dateRange.length) {
                    case 1:
                        sql.append(" AND ").append(fieldName).append(" = TO_DATE(?,").append(dateFormat).append(")");
                        params.add(date);
                        break;
                    case 2:
                        if (dateFormat.equals("'YYYY-MM-DD'")) {
                            sql.append(" AND ").append(fieldName).append(" >= TO_DATE(?,").append(dateFormat).append(")").append("+1");
                            params.add(dateRange[0]);
                            sql.append(" AND ").append(fieldName).append(" <= TO_DATE(?,").append(dateFormat).append(")").append("+1");
                            params.add(dateRange[1]);
                        } else {
                            sql.append(" AND ").append(fieldName).append(" >= TO_DATE(?,").append(dateFormat).append(")");
                            params.add(dateRange[0]);
                            sql.append(" AND ").append(fieldName).append(" <= TO_DATE(?,").append(dateFormat).append(")");
                            params.add(dateRange[1]);
                        }
                        break;
                    default:
                        break;
                }
            } else {
                throw new RuntimeException("Unknown date format");
            }
        }
    }

    private static String getByString(String s) {
        switch (s.trim().length()) {
            case 10:
                return "'YYYY-MM-DD'";
            case 19:
                return "'YYYY-MM-DD HH:mm:ss'";
            case 8:
                return "'HH:mm:ss'";
            default:
                return null;
        }

    }

    /**
     * List<String>合并为字符串
     * @param list List<String>
     * @param separator 分隔符
     * @return
     */
    public static String listToString(List<String> list, char separator) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            sb.append(list.get(i)).append(separator);
        }
        return list.isEmpty()?"":sb.toString().substring(0, sb.toString().length() - 1);
    }

    /**
     * List<Map<String,Object>>合并为字符串
     * @param list List<Map<String,Object>>
     * @param separator 分隔符
     * @param key map中key
     * @return
     */
    public static String listToString(List<Map<String,Object>> list, char separator, String key) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            Object value = list.get(i).get(key);
            if(RxStringUtils.isNotEmpty(value)){
                sb.append(list.get(i).get(key)).append(separator);
            }
        }
        return list.isEmpty()?"":sb.toString().substring(0, sb.toString().length() - 1);
    }
}
