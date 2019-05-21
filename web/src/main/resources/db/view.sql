-----------------------------------------------------------
-- Export file for user DEV4@192.168.0.110:1522/BASEORCL --
-- Created by Administrator on 2019-03-21, 18:29:36 -------
-----------------------------------------------------------

set define off
spool view.log

prompt
prompt Creating view VO_121
prompt ====================
prompt
create or replace force view vo_121 as
select "ID","LOGIN_NAME","LOGIN_PWD","USER_NAME","DEFAULT_ORGAN_ID","SORT","CJR_ID","CJSJ","XGR_ID","XGSJ","SFYX_ST","IS_BLOCKED","SEX","INFO_ID" from sys_user;

prompt
prompt Creating view VO_ORGAN_USERS
prompt ============================
prompt
CREATE OR REPLACE FORCE VIEW VO_ORGAN_USERS AS
SELECT o.id, o.organ_name, count(u.id) as user_num, wm_concat(u.user_name) user_names from sys_user u, sys_organ o where u.default_organ_id = o.id and o.sfyx_st = '1' and u.sfyx_st = '1' group by o.id, o.organ_name;

prompt
prompt Creating view VO_OUA
prompt ====================
prompt
CREATE OR REPLACE FORCE VIEW VO_OUA AS
SELECT u.id, u.user_name, u.cjsj, u.default_organ_id, o.organ_name, i.age from sys_user u left join sys_organ o on u.default_organ_id = o.id and o.sfyx_st = '1' left join sys_user_info i on i.id = u.info_id and i.sfyx_st = '1' where u.sfyx_st = '1';

prompt
prompt Creating view VO_T
prompt ==================
prompt
create or replace force view vo_t as
select login_name as loginWord, id from sys_user;

prompt
prompt Creating view VO_TEST
prompt =====================
prompt
CREATE OR REPLACE FORCE VIEW VO_TEST AS
SELECT "ID","LOGIN_NAME","LOGIN_PWD","USER_NAME","DEFAULT_ORGAN_ID","SORT","CJR_ID","CJSJ","XGR_ID","XGSJ","SFYX_ST","IS_BLOCKED","SEX","INFO_ID" FROM SYS_USER;

prompt
prompt Creating view VO_TEST21
prompt =======================
prompt
create or replace force view vo_test21 as
select "ID","LOGIN_NAME","LOGIN_PWD","USER_NAME","DEFAULT_ORGAN_ID","SORT","CJR_ID","CJSJ","XGR_ID","XGSJ","SFYX_ST","IS_BLOCKED","SEX","INFO_ID" from sys_user;

prompt
prompt Creating view VO_TEST_TEST
prompt ==========================
prompt
CREATE OR REPLACE FORCE VIEW VO_TEST_TEST AS
SELECT "ID","LOGIN_NAME","LOGIN_PWD","USER_NAME","DEFAULT_ORGAN_ID","SORT","CJR_ID","CJSJ","XGR_ID","XGSJ","SFYX_ST","IS_BLOCKED","SEX","INFO_ID" FROM SYS_USER;

prompt
prompt Creating view VO_TEST_TEST1
prompt ===========================
prompt
CREATE OR REPLACE FORCE VIEW VO_TEST_TEST1 AS
SELECT "ID","LOGIN_NAME","LOGIN_PWD","USER_NAME","DEFAULT_ORGAN_ID","SORT","CJR_ID","CJSJ","XGR_ID","XGSJ","SFYX_ST","IS_BLOCKED","SEX","INFO_ID" FROM VO_TEST_TEST;

prompt
prompt Creating view VO_TEST_VIEW
prompt ==========================
prompt
CREATE OR REPLACE FORCE VIEW VO_TEST_VIEW AS
SELECT "ID","SFZHM","SFYX_ST","USER_ID","XGSJ","CJSJ","XGR_ID","AGE" FROM SYS_USER_INFO;

prompt
prompt Creating view VO_USER_INFO
prompt ==========================
prompt
CREATE OR REPLACE FORCE VIEW VO_USER_INFO AS
SELECT u.id, u.user_name, u.cjsj, u.default_organ_id, o.organ_name, i.age from sys_user u left join sys_organ o on u.default_organ_id = o.id and o.sfyx_st = '1' left join sys_user_info i on i.id = u.info_id and i.sfyx_st = '1' where u.sfyx_st = '1';

prompt
prompt Creating view V_BIZ_WF
prompt ======================
prompt
CREATE OR REPLACE FORCE VIEW V_BIZ_WF AS
SELECT WI.DATA_ID AS "DATA_ID",
       FUN_GET_BIZ_WF_STATUS(WI.ID) AS "STATUS",
       WI.ID AS "WORKFLOW_INSTANCE_ID",
       NULL AS "P_WORKFLOW_INSTANCE_ID",
       NT.ID AS "TASK_INSTANCE_ID",
       NT.ACTION AS "ACTION",
       NT.USER_ID AS "USER_ID",
       W.CODE AS "WORKFLOW_CODE",
       (SELECT WM_CONCAT(TI_TODO.USER_ID)
          FROM SYS_TASK_INSTANCE TI_TODO
         WHERE TI_TODO.WORKFLOW_INSTANCE_ID = WI.ID
           AND TI_TODO.IS_FINISH = '0'
           AND TI_TODO.SFYX_ST = '1') AS "TODO_USERS",
       WI.TITLE AS "TITLE",
       (SELECT WM_CONCAT(TI_DONE.USER_ID)
          FROM SYS_TASK_INSTANCE TI_DONE
         WHERE TI_DONE.WORKFLOW_INSTANCE_ID = WI.ID
           AND TI_DONE.IS_FINISH = '1'
           AND TI_DONE.SFYX_ST = '1') AS "DONE_USERS"
  FROM SYS_WORKFLOW_INSTANCE WI
 INNER JOIN SYS_WORKFLOW W
    ON W.SFYX_ST = '1'
   AND W.ID = WI.WORKFLOW_ID
  LEFT JOIN (SELECT TI.ID,
                    TI.WORKFLOW_INSTANCE_ID,
                    TI.ACTION,
                    TI.USER_ID,
                    ROW_NUMBER() OVER(PARTITION BY TI.WORKFLOW_INSTANCE_ID ORDER BY NVL(NVL(TI.FINISH_DATE, TI.ACCEPT_DATE), TI.CJSJ) DESC) RNO
               FROM SYS_TASK_INSTANCE TI
              WHERE TI.SFYX_ST = '1') NT
    ON NT.WORKFLOW_INSTANCE_ID = WI.ID
   AND RNO = 1;

prompt
prompt Creating view V_COMPARE
prompt =======================
prompt
create or replace force view v_compare as
select "CC","DATA_ID","STATUS","WORKFLOW_INSTANCE_ID","P_WORKFLOW_INSTANCE_ID","TASK_INSTANCE_ID","ACTION","USER_ID","WORKFLOW_CODE","TODO_USERS","TITLE","DONE_USERS" from (
select distinct 'N' as cc,bf.DATA_ID,bf.STATUS,bf.WORKFLOW_INSTANCE_ID,bf.P_WORKFLOW_INSTANCE_ID,bf.TASK_INSTANCE_ID,
 bf.ACTION,bf.USER_ID,bf.WORKFLOW_CODE,bf.TODO_USERS,bf.TITLE,bf.DONE_USERS from sys_glb_biz_wf bf where bf.sfyx_st = '1'
 union all select distinct 'O' as cc,wf.DATA_ID,wf.STATUS,wf.WORKFLOW_INSTANCE_ID,wf.P_WORKFLOW_INSTANCE_ID,wf.TASK_INSTANCE_ID,
 wf.ACTION,wf.USER_ID,wf.WORKFLOW_CODE,wf.TODO_USERS,wf.TITLE,wf.DONE_USERS from v_biz_wf wf)
 where workflow_instance_id in (
 select WORKFLOW_INSTANCE_ID from (
 select distinct bf.DATA_ID,bf.STATUS,bf.WORKFLOW_INSTANCE_ID,bf.P_WORKFLOW_INSTANCE_ID,bf.TASK_INSTANCE_ID,
 bf.ACTION,bf.USER_ID,bf.WORKFLOW_CODE,bf.TODO_USERS,bf.TITLE,bf.DONE_USERS from sys_glb_biz_wf bf where bf.sfyx_st = '1'
minus select distinct wf.DATA_ID,wf.STATUS,wf.WORKFLOW_INSTANCE_ID,wf.P_WORKFLOW_INSTANCE_ID,wf.TASK_INSTANCE_ID,
 wf.ACTION,wf.USER_ID,wf.WORKFLOW_CODE,wf.TODO_USERS,wf.TITLE,wf.DONE_USERS from v_biz_wf wf)
 )
 order by  WORKFLOW_INSTANCE_ID,cc;

prompt
prompt Creating view V_FJ_GLB_ROLE
prompt ===========================
prompt
create or replace force view v_fj_glb_role as
select gr.role_id, gr.gl_id, gr.gl_type, gr.sfqy_st,
       (case
         when gr.gl_type = '2' then
          1
         when gr.gl_type = '3' and gr.sfqy_st = '1' then
          2
         when gr.gl_type = '3' and gr.sfqy_st = '0' then
          3
         else
          0
       end) as qz
  from sys_glb_role gr
 where gr.sfyx_st = '1';

prompt
prompt Creating view V_FJ_USER
prompt =======================
prompt
create or replace force view v_fj_user as
select "USER_ID","ORGAN_ID","GL_TYPE","GL_ID"
  from (select u.id as user_id, null as organ_id, '3' as gl_type, u.id as gl_id
          from sys_user u
         where u.sfyx_st = '1'
        union all
        select u.id as user_id, gu.organ_id as organ_id, '2' as gl_type, gu.organ_id as gl_id
          from sys_user u
         inner join sys_glb_user gu
            on gu.user_id = u.id
           and gu.organ_id is not null
         where u.sfyx_st = '1'
           and gu.sfyx_st = '1') uuo
 order by user_id asc;

prompt
prompt Creating view V_FJ_GLB_USER_ROLE
prompt ================================
prompt
create or replace force view v_fj_glb_user_role as
select ur.user_id, ur.role_id from (select u.user_id, r.role_id, max(r.qz) as qz
  from v_fj_user u
  left join v_fj_glb_role r
    on u.gl_type = r.gl_type
   and u.gl_id = r.gl_id
 where r.qz is not null
   and r.qz > 0
 group by u.user_id, r.role_id) ur where ur.qz = 1 or ur.qz = 2;

prompt
prompt Creating view V_FORUM_POST
prompt ==========================
prompt
CREATE OR REPLACE FORCE VIEW V_FORUM_POST AS
SELECT T.ID,T.BOARD_ID,T.CJSJ,T.CJR_ID,'TOPIC' TYPE FROM SYS_FORUM_TOPIC T WHERE T.SFYX_ST = '1'
UNION ALL
SELECT F.ID, F.BOARD_ID,F.CJSJ,F.CJR_ID,'FOLLOW' TYPE FROM SYS_FORUM_FOLLOW F WHERE F.SFYX_ST = '1';

prompt
prompt Creating view V_FORUM_ACTIVITY
prompt ==============================
prompt
CREATE OR REPLACE FORCE VIEW V_FORUM_ACTIVITY AS
SELECT BOARD_ID,
       TITLE,
       ICON,
       TOPIC_NUM,
       POST_NUM,
       TO_CHAR(LAST_POST_TIME, 'YYYY-MM-DD HH24:MI:SS') LAST_POST_TIME,
       LAST_POST_USER,
       VIEW_USER_NUM
  FROM (SELECT B.ID AS BOARD_ID,
               B.TITLE,
               B.ICON,
               (SELECT COUNT(1)
                  FROM SYS_FORUM_TOPIC T
                 WHERE T.BOARD_ID = B.ID
                   AND T.SFYX_ST = '1') AS TOPIC_NUM,
               (SELECT COUNT(1) FROM V_FORUM_POST P WHERE P.BOARD_ID = B.ID) AS POST_NUM,
               (SELECT MAX(P.CJSJ)
                  FROM V_FORUM_POST P
                 WHERE P.BOARD_ID = B.ID) AS LAST_POST_TIME,
               (SELECT U.USER_NAME
                  FROM (SELECT P.CJR_ID, P.BOARD_ID
                          FROM V_FORUM_POST P
                         ORDER BY P.CJSJ DESC) PP,
                       SYS_USER U
                 WHERE PP.BOARD_ID = B.ID
                   AND PP.CJR_ID = U.ID
                   AND U.SFYX_ST = '1'
                   AND ROWNUM = 1) AS LAST_POST_USER,
               (SELECT COUNT(1)
                  FROM SYS_FORUM_VIEW V
                 WHERE V.OBJECT_ID = B.ID
                   AND V.VIEW_TYPE = 'BOARD') AS VIEW_USER_NUM
          FROM SYS_FORUM_BOARD B
          WHERE B.SFYX_ST = '1') BP
 ORDER BY BP.LAST_POST_TIME DESC NULLS LAST;

prompt
prompt Creating view V_WF_DBRW
prompt =======================
prompt
CREATE OR REPLACE FORCE VIEW V_WF_DBRW AS
SELECT TI.ID AS "TASK_ID",
        'DBRW' "TYPE_CODE",
         WI.ID AS "WORKFLOW_INSTANCE_ID",
         W.CODE "WF_CODE",
         W.NAME "WF_NAME",
         TI.CJSJ "CJSJ",
         DECODE(WI.DATA_ID,
                NULL,
                '(草稿)' || WI.TITLE,
                WI.TITLE || '(' || N.NAME || ')') "WORKFLOW_NAME",
         TI.ID AS "RWID",
         TI.User_Id AS "USER_ID"
    FROM SYS_TASK_INSTANCE     TI,
         SYS_WORKFLOW_INSTANCE WI,
         SYS_WORKFLOW          W,
         SYS_NODE_INSTANCE     NI,
         SYS_NODE              N
   WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID
     AND WI.WORKFLOW_ID = W.ID
     AND TI.NODE_INSTANCE_ID = NI.ID
     AND NI.NODE_ID = N.ID
     AND NI.STATUS = '1'
     AND (WI.DATA_ID IS NOT NULL OR
         TI.ID IN (SELECT TASK_INSTANCE_ID
                      FROM SYS_TASK_PAGE_INSTANCE
                     WHERE TMP_DATA_JSON IS NOT NULL
                       AND SFYX_ST = '1'))
     AND (TI.STATUS = '0' OR TI.STATUS = '1')
     AND TI.SFYX_ST = '1'
     AND WI.SFYX_ST = '1'
     AND NI.SFYX_ST = '1'
     AND N.SFYX_ST = '1'
   ORDER BY TI.CJSJ DESC;

prompt
prompt Creating view V_WF_DBRW_NO_NBRW
prompt ===============================
prompt
CREATE OR REPLACE FORCE VIEW V_WF_DBRW_NO_NBRW AS
SELECT TI.ID AS "TASK_ID",
       WI.ID AS "WF_INS_ID",
       W.CODE "WF_CODE",
       W.NAME "WF_NAME",
       TI.CJSJ "CJSJ",
       N.NAME "NODE_NAME",
       W.ID "WF_ID",
       NI.TYPE "NODE_INS_TYPE",
       DECODE(NI.TYPE,
              'FIRST',
              '首次提交',
              'SUBMIT',
              '提交',
              'BACK',
              '退回',
              'RECOVER',
              '撤回',
              '') "NODE_INS_TYPE_NAME",
       WI.TITLE "TITLE",
       TI.USER_ID AS "USER_ID",
       PKG_WF.F_WF_GET_STATUS(WI.ID) "STATUS"
  FROM SYS_TASK_INSTANCE     TI,
       SYS_WORKFLOW_INSTANCE WI,
       SYS_WORKFLOW          W,
       SYS_NODE_INSTANCE     NI,
       SYS_NODE              N
 WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID
   AND WI.WORKFLOW_ID = W.ID
   AND TI.NODE_INSTANCE_ID = NI.ID
   AND NI.NODE_ID = N.ID
   AND NI.STATUS = '1'
   AND (TI.STATUS = '0' OR TI.STATUS = '1')
   AND WI.STATUS != '5'
   AND TI.SFYX_ST = '1'
   AND WI.SFYX_ST = '1'
   AND NI.SFYX_ST = '1'
   AND N.SFYX_ST = '1'
 ORDER BY TI.CJSJ DESC;

prompt
prompt Creating view V_WF_NBRW
prompt =======================
prompt
CREATE OR REPLACE FORCE VIEW V_WF_NBRW AS
SELECT TI.ID AS "TASK_ID",
       WI.ID AS "WF_INS_ID",
       W.CODE "WF_CODE",
       W.NAME "WF_NAME",
       TI.CJSJ "CJSJ",
       N.NAME "NODE_NAME",
       W.ID "WF_ID",
       NI.TYPE "NODE_INS_TYPE",
       DECODE(NI.TYPE,
              'FIRST',
              '首次提交',
              'SUBMIT',
              '提交',
              'BACK',
              '退回',
              'RECOVER',
              '撤回',
              '') "NODE_INS_TYPE_NAME",
       '(草稿)' || WI.TITLE "TITLE",
       TI.USER_ID AS "USER_ID",
       PKG_WF.F_WF_GET_STATUS(WI.ID) "STATUS"
  FROM SYS_TASK_INSTANCE     TI,
       SYS_WORKFLOW_INSTANCE WI,
       SYS_WORKFLOW          W,
       SYS_NODE_INSTANCE     NI,
       SYS_NODE              N
 WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID
   AND WI.WORKFLOW_ID = W.ID
   AND TI.NODE_INSTANCE_ID = NI.ID
   AND NI.NODE_ID = N.ID
   AND NI.STATUS = '1'
   AND (TI.STATUS = '0' OR TI.STATUS = '1')
   AND WI.STATUS = '5'
   AND TI.SFYX_ST = '1'
   AND WI.SFYX_ST = '1'
   AND NI.SFYX_ST = '1'
   AND N.SFYX_ST = '1'
 ORDER BY TI.CJSJ DESC;

prompt
prompt Creating view V_WF_NUM
prompt ======================
prompt
CREATE OR REPLACE FORCE VIEW V_WF_NUM AS
SELECT TI.USER_ID "USER_ID",
       WI.WORKFLOW_ID "WF_ID",
       W.NAME "WF_NAME",
       SUM(CASE
             WHEN (TI.STATUS = '0' OR TI.STATUS = '1') THEN
              1
             ELSE
              0
           END) AS "DBRW_NUM", --待办任务数目(含草稿)
       SUM(CASE
             WHEN TI.STATUS = '2' THEN
              1
             ELSE
              0
           END) AS "YBRW_NUM", --已办任务数目
       (SELECT COUNT(1)
          FROM SYS_WORKFLOW_INSTANCE SWI
         WHERE SWI.STARTUP_TYPE = '0'
           AND SWI.SFYX_ST = '1'
           AND SWI.STARTUP_USER_ID = TI.USER_ID
           AND SWI.WORKFLOW_ID = WI.WORKFLOW_ID) "ZBLC_NUM" --在办流程数目(我发起的流程)
  FROM SYS_TASK_INSTANCE TI, SYS_WORKFLOW_INSTANCE WI, SYS_WORKFLOW W
 WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID
   AND WI.WORKFLOW_ID = W.ID
   AND TI.SFYX_ST = '1'
   AND WI.SFYX_ST = '1'
   AND W.SFYX_ST = '1'
 GROUP BY TI.USER_ID, WI.WORKFLOW_ID, W.NAME
 ORDER BY USER_ID, WI.WORKFLOW_ID
;

prompt
prompt Creating view V_WF_YBRW
prompt =======================
prompt
CREATE OR REPLACE FORCE VIEW V_WF_YBRW AS
SELECT TI.ID "TASK_ID",
       TI.USER_ID,
       TI.ACTION,
       DECODE(TI.ACTION,
              '3',
              '提交',
              '4',
              '退回',
              '5',
              '撤回',
              '6',
              '转办',
              '其他') "BLDZ", --办理动作
       TI.OPINION,
       TI.CJSJ "CJSJ", --任务的创建时间
       TI.FINISH_DATE "TASK_FINISH_TIME", --任务的完成时间
       PKG_WF.F_WF_GET_STATUS(WI.ID) "STATUS",
       WI.FINISH_DATE "WF_FINISH_TIME",
       WI.STATUS "WF_STATUS",
       WI.TITLE,
       DECODE(WI.STATUS,
              '0',
              '完成',
              '1',
              '挂起',
              '2',
              '运行',
              '3',
              '终止',
              '其他') "LCZT", --流程当前状态
       N.ID "NODE_ID",
       N.NAME "NODE_NAME",
       NI.FINISH_DATE "NODE_FINISH_TIME"
  FROM SYS_TASK_INSTANCE     TI,
       SYS_WORKFLOW_INSTANCE WI,
       SYS_WORKFLOW          W,
       SYS_NODE_INSTANCE     NI,
       SYS_NODE              N
 WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID
   AND WI.WORKFLOW_ID = W.ID
   AND TI.NODE_INSTANCE_ID = NI.ID
   AND NI.NODE_ID = N.ID
   AND TI.STATUS = '2' --已办
   AND TI.SFYX_ST = '1'
   AND WI.SFYX_ST = '1'
   AND W.SFYX_ST = '1'
   AND NI.SFYX_ST = '1'
   AND N.SFYX_ST = '1'
 ORDER BY TI.FINISH_DATE DESC
;

prompt
prompt Creating view V_WORKFLOW_LASTEST
prompt ================================
prompt
CREATE OR REPLACE FORCE VIEW V_WORKFLOW_LASTEST AS
SELECT "ID",
       "WORKFLOW_ID",
       "WORKFLOW_INSTANCE_ID",
       "P_WORKFLOW_INSTANCE_ID",
       "TASK_ID",
       "OPERATION",
       "IS_LASTEST_OPERATION",
       "IS_LASTEST",
       "USER_ID",
       "CJSJ"
  FROM SYS_WORKFLOW_OPERATION O
 WHERE O.IS_LASTEST = '1';

prompt
prompt Creating view V_WF_ZBLC
prompt =======================
prompt
CREATE OR REPLACE FORCE VIEW V_WF_ZBLC AS
SELECT WI.ID "WF_INS_ID",
       WI.WORKFLOW_ID "WF_ID",
       WI.TITLE "TITLE",
       WI.STATUS "WF_STATUS",
       DECODE(WI.STATUS,
              '0',
              '完成',
              '1',
              '挂起',
              '2',
              '运行',
              '3',
              '终止',
              '5',
              '未提交',
              '其他') "LCZT", --流程状态
       WI.STARTUP_USER_ID "QDR_ID", --流程发起人ID
       PKG_WF.F_WF_GET_STATUS(WI.ID) AS "STATUS", --流程最新办理情况
       V.USER_ID "LAST_USER_ID", --最新办理人ID
       V.TASK_ID "LAST_TASK_ID", --最新办理任务ID
       V.CJSJ "LAST_TIME" --最新办理时间
  FROM SYS_WORKFLOW_INSTANCE WI, V_WORKFLOW_LASTEST V
 WHERE WI.ID = V.WORKFLOW_INSTANCE_ID
   AND WI.STARTUP_TYPE = '0'
   AND WI.SFYX_ST = '1'
 ORDER BY V.CJSJ DESC
;


spool off
