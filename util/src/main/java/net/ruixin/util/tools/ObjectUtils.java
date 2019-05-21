package net.ruixin.util.tools;

import net.ruixin.domain.constant.Const;
import net.ruixin.domain.plat.auth.ShiroUser;
import net.ruixin.util.enumeration.EnumUtil;
import net.ruixin.util.http.HttpSessionHolder;
import net.ruixin.util.shiro.ShiroKit;
import org.apache.commons.beanutils.ConvertUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.FatalBeanException;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.sql.Blob;
import java.sql.Clob;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

/**
 * 对象工具类
 */
public class ObjectUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(ObjectUtils.class);

    /**
     * 判断获取实体对象主键并返回
     *
     * @param entity 实体对象
     * @param <T>    泛型
     * @return 主键对象
     */
    @SuppressWarnings("unchecked")
    public static <T> Object ifIdExist(T entity) {
        if (entity == null) {
            return null;
        }
        Class clazz = entity.getClass();
        try {
            Method m = clazz.getMethod("getId");
            return m.invoke(entity);
        } catch (Exception e) {
            LOGGER.error("获取实体主键异常", e);
            return null;
        }
    }

    /**
     * 判断是否是基础属性
     *
     * @param clazz 类对象
     * @return 是否clazz != Collection.class &&
     */
    @SuppressWarnings("unchecked")
    static boolean isBaseClass(Class<?> clazz) {
        try {
            return !Collection.class.isAssignableFrom(clazz) && (Enum.class.isAssignableFrom(clazz) || clazz.isPrimitive() || clazz == String.class || clazz == Date.class || clazz == Blob.class || clazz == Clob.class || clazz.isArray() || ((Class) clazz.getField("TYPE").get(null)).isPrimitive());
        } catch (Throwable e) {
            return false;
        }
    }

    /**
     * 对实体类中创建人、创建时间、修改人、修改时间进行参数设置
     *
     * @param entity        实体对象
     * @param sysDate       系统时间
     * @param propertyNames 属性参数
     */
    public static void setEntityValue(Object entity, Date sysDate, String... propertyNames) {
        ShiroUser shiroUser = ShiroKit.getUser();
        if (shiroUser != null) {
            Long userId = shiroUser.getId();
            try {
                for (String pro : propertyNames) {
                    PropertyDescriptor pd = RxBeanUtils.getPropertyDescriptor(entity.getClass(), pro);
                    if (pd == null) {
                        continue;
                    }
                    Object value = null;
                    switch (pro) {
                        case "cjrId":
                            value = userId;
                            break;
                        case "xgrId":
                            value = userId;
                            break;
                        case "cjsj":
                            value = sysDate;
                            break;
                        case "xgsj":
                            value = sysDate;
                            break;
                        default:
                            break;
                    }
                    Method writeMethod = pd.getWriteMethod();
                    if (!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())) {
                        writeMethod.setAccessible(true);
                    }
                    writeMethod.invoke(entity, value);
                }
                //递归级联对象创建人、创建时间、修改人、修改时间进行参数设置
                Field[] fields = entity.getClass().getDeclaredFields();
                Field.setAccessible(fields, true);
                for (Field f : fields) {
                    OneToOne oto = f.getAnnotation(OneToOne.class);
                    if (oto != null) {
                        CascadeType[] cascadeTypes = oto.cascade();
                        for (CascadeType cascadeType : cascadeTypes) {
                            if (cascadeType == CascadeType.ALL || cascadeType == CascadeType.REMOVE) {
                                //获取属性值
                                Object o = f.get(entity);
                                if (o == null) {
                                    break;
                                }
                                Object id = ifIdExist(o);
                                if (id != null) {
                                    setEntityValue(o, sysDate, "xgrId", "xgsj");
                                } else {
                                    setEntityValue(o, sysDate, "cjrId", "cjsj", "xgrId", "xgsj");
                                }
                                break;
                            }
                        }
                        continue;
                    }
                    OneToMany otm = f.getAnnotation(OneToMany.class);
                    if (otm != null) {
                        CascadeType[] cascadeTypes = otm.cascade();
                        for (CascadeType cascadeType : cascadeTypes) {
                            if (cascadeType == CascadeType.ALL || cascadeType == CascadeType.REMOVE) {
                                //获取属性值
                                Object o = f.get(entity);
                                if (o == null) {
                                    break;
                                }
                                if (o instanceof Collection<?>) {
                                    for (Object tmp : (Collection<?>) o) {
                                        //获取属性值
                                        Object id = ifIdExist(tmp);
                                        if (id != null) {
                                            setEntityValue(tmp, sysDate, "xgrId", "xgsj");
                                        } else {
                                            setEntityValue(tmp, sysDate, "cjrId", "cjsj", "xgrId", "xgsj");
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            } catch (Throwable ex) {
                throw new FatalBeanException("Set default system property error", ex);
            }
        }
    }

    /**
     * map转object
     *
     * @param map
     * @param clazz
     * @return
     */
    public static Object parseMapToObj(Map<String, Object> map, Class<?> clazz) {
        Object t;
        try {
            PropertyDescriptor[] props = Introspector
                    .getBeanInfo(clazz).getPropertyDescriptors();
            t = clazz.newInstance();
            for (Map.Entry<String, Object> entry : map
                    .entrySet()) {
                String attrName = entry.getKey();
                for (PropertyDescriptor prop : props) {
                    if (!"class".equals(prop.getName()) && !"interactionFields".equals(prop.getName()) && !"fjUpdateIds".equals(prop.getName())) {
                        String mapper;
                        Column c = clazz.getDeclaredField(prop.getName()).getAnnotation(Column.class);
                        if (c != null) {
                            mapper = c.name();
                        } else {
                            mapper = prop.getName();
                        }
                        if (!attrName.equals(mapper.toUpperCase())) {
                            continue;
                        }
                        Method method = prop.getWriteMethod();
                        Object value = entry.getValue();
                        if (value != null) {
                            if (prop.getPropertyType().isEnum()) {
                                value = EnumUtil.getEnum(prop.getPropertyType(), value.toString());
                            } else {
                                value = ConvertUtils.convert(value, prop.getPropertyType());
                            }
                        }
                        method.invoke(t, value);
                        break;
                    }
                }
            }
        } catch (Throwable ex) {
            throw new FatalBeanException("Parse Map to Entity:" + clazz.getName() + " error !", ex);
        }
        return t;
    }

    /**
     * 获取真实对象名称
     *
     * @param obj
     * @return
     */
    //domain.plat.organ.SysUser_$$_javassist_24
    public static String getRealClassName(Object obj) {
        String realClassName = obj.getClass().getName();
        int index = realClassName.indexOf("_$$_javassist");
        if (index != -1) {
            realClassName = realClassName.substring(0, index);
        }
        return realClassName;
    }

    /**
     * 判断对象是否为空
     *
     * @param o
     * @return
     */
    public static boolean isEmpty(Object o) {
        if (o == null) {
            return true;
        } else {
            if (o instanceof String) {
                return ((String) o).trim().length() == 0;
            } else if (o instanceof Collection) {
                return ((Collection) o).isEmpty();
            } else if (o.getClass().isArray()) {
                return ((Object[]) o).length == 0;
            } else if (o instanceof Map && mapEmpty(o)) {
                return true;
            }
            return false;
        }
    }

    private static boolean mapEmpty(Object o) {
        return ((Map) o).isEmpty();
    }

    public static boolean isNotEmpty(Object o) {
        return !isEmpty(o);
    }
}
