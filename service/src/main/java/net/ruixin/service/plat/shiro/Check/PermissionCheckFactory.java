package net.ruixin.service.plat.shiro.Check;

import net.ruixin.util.spring.SpringContextHolder;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 权限自定义检查
 */
@Service
@DependsOn("springContextHolder")
@Transactional(readOnly = true)
public class PermissionCheckFactory implements ICheck {

    public static ICheck me() {
        return SpringContextHolder.getBean(ICheck.class);
    }

    @Override
    public boolean check(Object[] permissions) {
//        ShiroUser user = ShiroKit.getUser();
//        if (null == user) {
//            return false;
//        }
//        String join = CollectionKit.join(permissions, ",");
        //Todo:ShiroKit调整后需确认
//        if (ShiroKit.hasAnyRoles(join)) {
//            return true;
//        }
        return false;
    }

    @Override
    public boolean checkAll() {
//        HttpServletRequest request = HttpKit.getRequest();
//        ShiroUser user = ShiroKit.getUser();
//        if (null == user) {
//            return false;
//        }
//        String requestURI = request.getRequestURI().replaceFirst(ConfigListener.getConf().get("contextPath"), "");
//        String[] str = requestURI.split("/");
//        if (str.length > 3) {
//            requestURI = "/" + str[1] + "/" + str[2];
//        }
        //Todo:ShiroKit调整后需确认
//        if (ShiroKit.hasPermission(requestURI)) {
//            return true;
//        }
        return false;
    }

}
