package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ITransactorDao;
import net.ruixin.domain.plat.auth.SysBaseRule;
import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.domain.plat.workflow.transactor.SysGlbTransactorSource;
import net.ruixin.domain.plat.workflow.transactor.SysNodeAssigneeCondition;
import net.ruixin.domain.plat.workflow.transactor.SysWorkflowTransactor;
import net.ruixin.domain.plat.workflow.transactor.SysWorkflowTransactorSource;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.service.plat.workflow.ITransactorService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;


@Service
public class TransactorService extends BaseService implements ITransactorService {
    @Autowired
    private ITransactorDao transactorDao;

    @Override
    @Transactional
    public Long saveTransactor(SysWorkflowTransactor transactor) {
        this.save(transactor);
        return transactor.getId();
    }

    @Override
    public SysWorkflowTransactor getTransactorById(Long id) {
        SysWorkflowTransactor sysWorkflowTransactor = this.get(SysWorkflowTransactor.class, id);
        for (SysWorkflowTransactorSource transactorSource : sysWorkflowTransactor.getSourceList()) {
            for (SysGlbTransactorSource glbTransactorSource : transactorSource.getGlSourceList()) {
                Object o = null;
                if (null != glbTransactorSource.getObjectType()) {
                    switch (glbTransactorSource.getObjectType()) {
                        //用户
                        case "1":
                            SysUser user = this.get(SysUser.class, glbTransactorSource.getObjectId());
                            if (null != user) {
                                Map<String, Object> map = new HashMap<>();
                                map.put("userName", user.getUserName());
                                map.put("sex", user.getSex());
                                map.put("dftOrganName", user.getDftOrganName());
                                o = map;
                            }
                            break;
                        case "2":
                            SysOrgan organ = this.get(SysOrgan.class, glbTransactorSource.getObjectId());
                            if (null != organ) {
                                Map<String, Object> map = new HashMap<>();
                                map.put("organName", organ.getOrganName());
                                if (null != organ.getParentOrg()) {
                                    SysOrgan parentOrgan = this.get(SysOrgan.class, organ.getParentOrg());
                                    if (null != parentOrgan) {
                                        map.put("parentOrgan", parentOrgan.getOrganName());
                                    }
                                }
                                map.put("fullName", organ.getFullName());
                                o = map;
                            }
                            break;
                        case "3":
                            SysRole role = this.get(SysRole.class, glbTransactorSource.getObjectId());
                            if (null != role) {
                                Map<String, Object> map = new HashMap<>();
                                map.put("roleName", role.getRoleName());
                                map.put("roleType", role.getRoleType());
                                o = map;
                            }
                            break;
                        case "4":
                            o = this.get(SysNodeAssigneeCondition.class, glbTransactorSource.getObjectId());
                            break;
                        case "5":
                            o = this.get(SysBaseRule.class, glbTransactorSource.getObjectId());
                            break;
                    }
                    if (null != o) {
                        glbTransactorSource.setSourceObj(o);
                    }
                }
            }
        }
        return sysWorkflowTransactor;
    }

    @Override
    @Transactional
    public Long saveCondition(SysNodeAssigneeCondition nodeAssigneeCondition) {
        this.save(nodeAssigneeCondition);
        return nodeAssigneeCondition.getId();
    }

    @Override
    public FastPagination getTransactorList(Map map) {
        return transactorDao.getTransactorList(map);
    }

    @Transactional
    @Override
    public void delTransactor(Long id) {
        this.deleteCascade(SysWorkflowTransactor.class, id);
    }
}
