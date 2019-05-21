package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * @Author: mxding
 * @Date: 2019-02-02 14:19
 */
@Component
public class MySupportProgram extends SupportProgramAdapter {

    @Autowired
    ISysNodeDao nodeDao;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public void postSubmit(String opinion, String branch, String fjId) {
        super.postSubmit(opinion, branch, fjId);
        String name = nodeDao.get(sysTask.getNode_instance_id().getNode_id().getId()).getName();
        jdbcTemplate.execute("insert into test_post(type,value) values('JAVA','" + name + "')");
    }
}
