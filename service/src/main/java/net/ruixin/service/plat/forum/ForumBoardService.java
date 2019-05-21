package net.ruixin.service.plat.forum;

import net.ruixin.dao.plat.forum.IForumBoardDao;
import net.ruixin.domain.plat.forum.SysForumBoard;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 论坛板块服务
 *
 * @Author: mxding
 * @Date: 2019-02-14 11:43
 */
@Service
public class ForumBoardService extends BaseService implements IForumBoardService {

    @Autowired
    IForumBoardDao forumBoardDao;

    @Override
    public FastPagination getBoardList(Map map) {
        return forumBoardDao.getBoardList(map);
    }

    @Override
    @Transactional
    public void saveBoard(SysForumBoard sysForumBoard) {
        forumBoardDao.saveOrUpdate(sysForumBoard);
    }

    @Override
    @Transactional
    public void deleteBoard(Long boardId) {
        forumBoardDao.delete(boardId);
    }

    @Override
    public SysForumBoard getBoardById(Long boardId) {
        return forumBoardDao.get(boardId);
    }

    @Override
    public List<Map<String, Object>> getForumActivity() {
        return forumBoardDao.getForumActivity();
    }

    @Override
    public boolean isModerator(Long boardId, Long userId) {
        SysForumBoard forumBoard = forumBoardDao.get(boardId);
        return userId != null && userId.equals(forumBoard.getModeratorId());
    }


}
