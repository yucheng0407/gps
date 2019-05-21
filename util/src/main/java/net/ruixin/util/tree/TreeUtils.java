package net.ruixin.util.tree;

import net.ruixin.util.tools.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * 树控件
 */
public class TreeUtils {

    private TreeUtils() {

    }

    /**
     * @param list     数据源
     * @param root     更节点
     * @param id       主键字段
     * @param pId      关联字段
     * @param children 下级字段
     * @param <T>      node类型
     */
    public static <T> void createTree(List<T> list, T root, String id, String pId, String children) {
        Field keyField = ReflectionUtils.getField(id, root);
        Field parentKeyField = ReflectionUtils.getField(pId, root);
        Field subField = ReflectionUtils.getField(children, root);
        find(list, root, keyField, parentKeyField, subField);
    }

    private static <T> void find(List<T> list, T parent, Field keyField, Field parentKeyField, Field subField) {
        List<T> subs = getSubs(list, parent, keyField, parentKeyField);
        if (subs != null) {
            ReflectionUtils.setValueByField(subField, parent, subs);
            for (T sub : subs) {
                //递归找子节点
                find(list, sub, keyField, parentKeyField, subField);
            }
        }
    }

    private static <T> List<T> getSubs(List<T> list, T parent, Field keyField, Field parentKeyField) {
        List<T> subs = null;
        Iterator<T> it = list.iterator();
        while (it.hasNext()){
            T t = it.next();
            Object keyFieldValue = ReflectionUtils.getValueByField(keyField, parent);
            Object parentFieldValue = ReflectionUtils.getValueByField(parentKeyField, t);
            if (keyFieldValue.equals(parentFieldValue)) {
                if (subs == null) {
                    subs = new ArrayList<>();
                }
                subs.add(t);
                it.remove();
            }
        }
//        for (T t : list) {
//            Object keyFieldValue = ReflectionUtils.getValueByField(keyField, parent);
//            Object parentFieldValue = ReflectionUtils.getValueByField(parentKeyField, t);
//            if (keyFieldValue.equals(parentFieldValue)) {
//                if (subs == null) {
//                    subs = new ArrayList<>();
//                }
//                subs.add(t);
//            }
//        }
        return subs;
    }

    public static <T> void createTree(List<T> list, T root) {
        createTree(list, root, "handleId", "pId", "children");
    }

//    public static <T> void createTree(List<T> list) {
//        createTree(list, (T) list.stream().filter((T el) -> {
//            try {
//                Method md = BeanKit.getPropertyDescriptor(el.getClass(), "pId").getReadMethod();
//                return RxStringUtils.isEmpty(md.invoke(el));
//            } catch (IntrospectionException | IllegalAccessException | InvocationTargetException e) {
//                e.printStackTrace();
//                throw new BussinessException(BizExceptionEnum.TREE_ERROR);
//            }
//        }).findFirst(), "id", "pId", "children");
//    }
}
