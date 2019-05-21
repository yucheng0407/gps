package net.ruixin.service.plat.forum;

import net.ruixin.domain.plat.forum.SysForumBoard;
import net.ruixin.service.plat.common.IBaseService;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * @Author: mxding
 * @Date: 2019-02-14 11:38
 */
public interface IForumBoardService extends IBaseService {

    /**
     * 获取版块列表
     * @param map
     * @return
     */
    FastPagination getBoardList(Map map);

    /**
     * 保存论坛版块
     * @param sysForumBoard
     */
    void saveBoard(SysForumBoard sysForumBoard);

    /**
     * 删除版块
     * @param boardId
     */
    void deleteBoard(Long boardId);

    /**
     * 根据ID获取版块信息
     * @param boardId
     * @return
     */
    SysForumBoard getBoardById(Long boardId);

    /**
     * 获取论坛最新动态
     * @return
     */
    List<Map<String,Object>> getForumActivity();

    /**
     * 验证用户是否为版主
     * @param boardId 版块ID
     * @param userId 用户ID
     * @return
     */
    boolean isModerator(Long boardId, Long userId);
}
