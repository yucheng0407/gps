package net.ruixin.aop;

import java.lang.annotation.*;

/**
 * 缓存时间戳更新注解
 *
 * @example @UpdateTimestamp(name = "resourceTimestamp")
 */
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface UpdateTimestamp {
    /**
     * 待更新时间戳名称
     */
    String name() default "";
}
