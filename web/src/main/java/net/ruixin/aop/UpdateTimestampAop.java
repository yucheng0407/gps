package net.ruixin.aop;

import net.ruixin.service.plat.log.aop.BussinessLog;
import net.ruixin.service.plat.shiro.Check.PermissionCheckManager;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.tools.RxStringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import javax.naming.NoPermissionException;
import java.lang.reflect.Method;
import java.util.Date;

/**
 * AOP 缓存时间戳更新
 */
@Aspect
@Component
public class UpdateTimestampAop {
    @Pointcut(value = "@annotation(UpdateTimestamp)")
    public void cutService() {
    }

    @Around("cutService()")
    public Object runUpdateTimestamp(ProceedingJoinPoint point) throws Throwable {
        //先执行业务
        Object result = point.proceed();
        //获取拦截的方法名
        Signature sig = point.getSignature();
        MethodSignature msig;
        if (!(sig instanceof MethodSignature)) {
            throw new IllegalArgumentException("该注解只能用于方法");
        }
        msig = (MethodSignature) sig;
        Object target = point.getTarget();
        Method currentMethod = target.getClass().getMethod(msig.getName(), msig.getParameterTypes());
        UpdateTimestamp annotation = currentMethod.getAnnotation(UpdateTimestamp.class);
        String timestampName = annotation.name();
        if(RxStringUtils.isNotEmpty(timestampName)){
            //重新设置时间戳
            CacheKit.put(net.ruixin.util.cache.Cache.CONSTANT, timestampName, String.valueOf(new Date().getTime()));
        }
        return result;
    }
}

