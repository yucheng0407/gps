package net.ruixin.util.tools;

import java.util.HashMap;
import java.util.Map;

public class CamelCaseUtils {

        private static final char SEPARATOR = '_';
        //下划线格式
        @SuppressWarnings("unused")
        public static String toUnderlineName(String s) {
            if (s == null) {
                return null;
            }

            StringBuilder sb = new StringBuilder();
            boolean upperCase = false;
            for (int i = 0; i < s.length(); i++) {
                char c = s.charAt(i);

                boolean nextUpperCase = true;

                if (i < (s.length() - 1)) {
                    nextUpperCase = Character.isUpperCase(s.charAt(i + 1));
                }

                if (Character.isUpperCase(c)) {
                    if (!upperCase || !nextUpperCase) {
                        if (i > 0) {
                            sb.append(SEPARATOR);
                        }
                    }
                    upperCase = true;
                } else {
                    upperCase = false;
                }

                sb.append(Character.toLowerCase(c));
            }

            return sb.toString();
        }
        //首字母小写驼峰格式
        private static String toCamelCase(String s) {
            if (s == null) {
                return null;
            }

            s = s.toLowerCase();

            StringBuilder sb = new StringBuilder(s.length());
            boolean upperCase = false;
            for (int i = 0; i < s.length(); i++) {
                char c = s.charAt(i);

                if (c == SEPARATOR) {
                    upperCase = true;
                } else if (upperCase) {
                    sb.append(Character.toUpperCase(c));
                    upperCase = false;
                } else {
                    sb.append(c);
                }
            }

            return sb.toString();
        }


        //首字母大写驼峰格式
        @SuppressWarnings("unused")
        public static String toCapitalizeCamelCase(String s) {
            if (s == null) {
                return null;
            }
            s = toCamelCase(s);
            return s.substring(0, 1).toUpperCase() + s.substring(1);
        }

        public static Map<String, Object> parseMapToCamelKeyMap(Map<String, Object> map){
            Map<String, Object> camelMap = new HashMap<>();
            if(null != map){
                for(Map.Entry entry : map.entrySet()){
                    if(null != entry.getKey()){
                        camelMap.put(toCamelCase(String.valueOf(entry.getKey())),entry.getValue());
                    }
                }
            }
            return camelMap;
        }

    }

