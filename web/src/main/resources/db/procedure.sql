-----------------------------------------------------------
-- Export file for user DEV4@192.168.0.110:1522/BASEORCL --
-- Created by Administrator on 2019-03-21, 18:28:29 -------
-----------------------------------------------------------

set define off
spool procedure.log

prompt
prompt Creating package PKG_BASEPLAT
prompt =============================
prompt
CREATE OR REPLACE PACKAGE PKG_BASEPLAT IS

  --功能：保存机构、岗位、用户时，更新SYS_GLB_ROLE_USER、SYS_GLB_ROLE_POST表数据
  --创建人：wcy
  --创建时间：2017.12.19
  --最后修改人：wcy
  --最后修改时间：2017.12.19
  PROCEDURE P_SAVE_ORGAN_POST_USER(IN_ID     INTEGER, --输入ID
                                   IN_TYPE   VARCHAR2, --操作类型
                                   OUT_ERROR OUT VARCHAR2); --程序运行是否成功

  --功能：生成用户与角色关联关系
  --创建人：wcy
  --创建时间：2017.12.19
  --最后修改人：wcy
  --最后修改时间：2017.12.19
  PROCEDURE P_SET_USER_ROLES(IN_USER_IDS VARCHAR2); --用户ID字符串,逗号拼接

  --功能：保存机构时，新增了角色，当该机构下的用户已经有了该角色，删除用户的这个角色。
  --保存机构时，删除了角色，当某个用户已经有该角色且处于禁用时，且该用户所在的其它机构没有该角色删除该用户的角色，
  --若该用户所在的其它机构也有该角色，怎么不能删除这条禁用关系。
  --创建人：pc
  --创建时间：2018.6.26
  --最后修改人：pc
  --最后修改时间：2018.6.26
  PROCEDURE P_DEL_USER_ROLE_IF_ORGAN_EXIST(IN_ORGAN_ID INTEGER, --当前保存的机构id
                                           ADD_ROLES    VARCHAR2, --该机构新增的角色
                                           DEL_ROLES VARCHAR2,--该机构删除的角色
                                           OUT_ERROR   OUT VARCHAR2); --返回程序运行结果


  --功能：为角色分配关联要素时后置数据处理
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_SAVE_ROLE_RELATIONS(IN_ROLE_ID        INTEGER, --角色ID
                                  IN_ORGANS_ADD     CLOB, --增加机构
                                  IN_ORGANS_DEL     CLOB, --删除机构
                                 /* IN_BASE_POSTS_ADD CLOB, --增加基础岗位
                                  IN_BASE_POSTS_DEL CLOB, --删除基础岗位
                                  IN_POSTS_INCLUDE  CLOB, --包含具体岗位
                                  IN_POSTS_EXCLUDE  CLOB, --排除具体岗位
                                  IN_POSTS_TURN     CLOB, --取消包含、排除具体岗位*/
                                  IN_USERS_INCLUDE  CLOB, --包含用户
                                  IN_USERS_EXCLUDE  CLOB, --排除用户
                                  IN_USERS_TURN     CLOB, --取消包含、排除用户
                                  OUT_ERROR         OUT VARCHAR2); --返回程序运行结果

  --增加机构、基础岗位与角色关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_ADD_ORGAN_OR_BASE_POST(IN_ROLE_ID INTEGER, --角色ID
                                     IN_TYPE    VARCHAR2, --操作类型
                                     IN_ROLE_TYPE VARCHAR2); --角色类型

  --删除机构、基础岗位与角色关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_DEL_ORGAN_OR_BASE_POST(IN_ROLE_ID INTEGER, --角色ID
                                     IN_TYPE    VARCHAR2); --操作类型

  --增加具体岗位、用户与角色包含关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_ADD_POST_OR_USER_INCLUDE(IN_ROLE_ID INTEGER, --角色ID
                                       IN_TYPE    VARCHAR2, --操作类型
                                       IN_ROLE_TYPE VARCHAR2); --角色类型

  --增加具体岗位、用户与角色排除关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_ADD_POST_OR_USER_EXCLUDE(IN_ROLE_ID INTEGER, --角色ID
                                       IN_TYPE    VARCHAR2, --操作类型
                                       IN_ROLE_TYPE VARCHAR2); --角色类型

  --删除具体岗位、用户与角色的包含、排除关系
  PROCEDURE P_DEL_POST_OR_USER_TURN(IN_ROLE_ID INTEGER, --角色ID
                                    IN_TYPE    VARCHAR2); --操作类型

  --生成角色与具体岗位、用户关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_SET_ROLE_POST_AND_USER(IN_ROLE_ID INTEGER, --角色ID
                                     OUT_ERROR  OUT VARCHAR2); --返回程序运行结果

  --删除机构、岗位、基础岗位、用户
  --创建人：wcy
  --创建时间：2018.1
  --最后修改人：wcy
  --最后修改时间：2018.1
  PROCEDURE P_DELETE_ORGAN_POST_USER(IN_ID        INTEGER, --输入ID
                                     IN_TYPE      VARCHAR2, --操作类型
                                     IN_CHANGE_ID INTEGER, --输入变化ID
                                     OUT_ERROR    OUT VARCHAR2); --运行结果

                                     --删除机构、岗位、基础岗位、用户
  --创建人：zxh
  --创建时间：2018.4
  --最后修改人：zxh
  --最后修改时间：2018.4
  PROCEDURE P_DEFAULT_RESOURCE_CONFIG(OUT_ERROR    OUT VARCHAR2); --运行结果

    --更新数据权限
  --创建人：wcy
  --创建时间：2018.3
  --最后修改人：wcy
  --最后修改时间：2018.3
 PROCEDURE P_UPDATE_DATA_AUTH(IN_OBJECT_ID INTEGER, --对象类型ID
                               IN_USER_IDS  CLOB, --用户IDS
                               IN_OIDS      CLOB, --对象IDS
                               IN_USER_ID   INTEGER, --当前用户ID
                               OUT_ERROR    OUT VARCHAR2); --运行结果
  --组合角色分解
  --创建人：dmx
  --创建时间：2018.6.25
 PROCEDURE P_FACTOR_COMBINE_ROLE(IN_ROLE_ID IN INTEGER, --分解角色ID
                                 OUT_ERROR  OUT VARCHAR2);--程序运行结果

  --角色删除后置处理
  --创建人：dmx
  --创建时间：2018.6.28
 PROCEDURE P_AFTER_DELETE_ROLE(IN_ROLE_ID IN INTEGER, --角色ID
                                OUT_ERROR  OUT VARCHAR2); --程序运行结果

END PKG_BASEPLAT;
/

prompt
prompt Creating package PKG_FORM_DEF
prompt =============================
prompt
create or replace package PKG_FORM_DEF is

  -- Author  : MRQ
  -- Created : 2018/8/27 11:53:52
  -- Purpose :

  --创建表
  PROCEDURE P_CREATE_FORMTABLE(IN_TABLE_NAME VARCHAR2, --数据库名称
                            IN_TABLE_SQL VARCHAR2, -- 建表语句
                            OUT_ERROR    OUT VARCHAR2); --返回程序执行情况
end PKG_FORM_DEF;
/

prompt
prompt Creating package PKG_TASK
prompt =========================
prompt
CREATE OR REPLACE PACKAGE PKG_TASK IS

  --签收任务 LB 2016.9
  PROCEDURE P_TASK_SIGN(IN_TASK_ID INTEGER, --任务实例ID
                        OUT_STR    OUT VARCHAR2, --返回签收情况信息
                        OUT_ERROR  OUT VARCHAR2); --返回程序执行情况

  --办理任务 DMX 2019.03.07
  PROCEDURE P_TASK_SUBMIT(IN_TASK_ID       INTEGER, --任务ID
                          IN_NODE_USER_IDS VARCHAR2, --执行环节和办理人 格式:N1|USER11,USER12;N2|USER21
                          IN_DECISION      VARCHAR2, --决策条件(手动决策)
                          IN_BLYJ          VARCHAR2, --办理意见
                          IN_FJ_ID         VARCHAR2, --附件ID
                          OUT_STR          OUT VARCHAR2, --返回不能提交的原因
                          OUT_ERROR        OUT VARCHAR2); --返回程序执行情况

  --任务退回 DMX 2019.03.07
  PROCEDURE P_TASK_BACK(IN_TASK_ID      INTEGER, --任务ID
                        IN_NODE_WF_USER VARCHAR2, --指定退回环节、流程实例和办理人 格式:N1|W1|U1,U2;..或N1|W1;..
                        IN_BLYJ         VARCHAR2, --办理意见
                        IN_FJ_ID        VARCHAR2, --附件ID
                        OUT_STR         OUT VARCHAR2, --返回不能退回的原因
                        OUT_ERROR       OUT VARCHAR2); --返回程序执行情况

  --撤回任务
  PROCEDURE P_TASK_RECOVER(IN_TASK_ID INTEGER, --回撤任务实例ID
                           OUT_STR    OUT VARCHAR2, --返回信息
                           OUT_ERROR  OUT VARCHAR2); --返回程序执行情况

  --任务转办
  PROCEDURE P_TASK_TRANSFER(IN_TASK_ID INTEGER, --任务ID
                            IN_USER_ID INTEGER, --新办理人
                            OUT_STR    OUT VARCHAR2, --执行正常返回信息
                            OUT_ERROR  OUT VARCHAR2); --程序执行结果

  --重建TASK任务
  PROCEDURE P_REBUILD_TASK(IN_TASK_ID NUMBER, --撤回任务实例ID
                           OUT_ERROR  OUT VARCHAR2); --返回程序执行情况

  --操作按钮显隐控制
  PROCEDURE P_BUTTON_IFSHOW(IN_TASK_ID INTEGER, --当前任务
                            IN_NODE_ID INTEGER, --当前环节
                            IN_USER_ID INTEGER, --当前登录用户
                            OUT_STR    OUT VARCHAR2, --返回值
                            OUT_ERROR  OUT VARCHAR2); --程序运行结果

  --产生消息、清理消息
  PROCEDURE P_PRODUCE_MESSAGE(IN_TASK_ID INTEGER, --任务ID
                              IN_ACTION  CHAR); --操作类型

  --记录任务操作记录
  --创建时间：2019/03/07
  --创建人：dmx
  PROCEDURE P_LOG_TASK(IN_TASK_ID INTEGER, IN_TASK_TYPE VARCHAR2);

END PKG_TASK;
/

prompt
prompt Creating package PKG_TRANSACTOR
prompt ===============================
prompt
CREATE OR REPLACE PACKAGE PKG_TRANSACTOR IS
  --功能：办理人查找、处理
  --创建人：dmx
  --创建时间：2019.02.12

  --办理人对象类型
  TYPE_USER      CONSTANT CHAR(1) := '1'; --用户
  TYPE_ORGAN     CONSTANT CHAR(1) := '2'; --机构
  TYPE_ROLE      CONSTANT CHAR(1) := '3'; --角色
  TYPE_CONDITION CONSTANT CHAR(1) := '4'; --限定条件
  TYPE_RULE      CONSTANT CHAR(1) := '5'; --规则

  --办理人来源
  ORIGIN_USER      CONSTANT CHAR(1) := '1'; --指定用户
  ORIGIN_ORGAN     CONSTANT CHAR(1) := '2'; --指定机构
  ORIGIN_ROLE      CONSTANT CHAR(1) := '3'; --角色
  ORIGIN_CONDITION CONSTANT CHAR(1) := '4'; --限定条件
  ORIGIN_CUSTOM    CONSTANT CHAR(1) := '5'; --自定义规则

  --限定条件
  RESTRICT_USER_START         CONSTANT CHAR(1) := '1'; --用户限定：流程启动人
  RESTRICT_USER_PREV          CONSTANT CHAR(1) := '2'; --用户限定：上一环节办理人
  RESTRICT_ORGAN_NON          CONSTANT CHAR(1) := '1'; --机构限定：不限定
  RESTRICT_ORGAN_BELONG       CONSTANT CHAR(1) := '2'; --机构限定：所属机构
  RESTRICT_ORGAN_PARENT       CONSTANT CHAR(1) := '3'; --机构限定：上级机构
  RESTRICT_ORGAN_DIRECT_CHILD CONSTANT CHAR(1) := '4'; --机构限定：直接下级
  RESTRICT_ORGAN_ALL_CHILD    CONSTANT CHAR(1) := '5'; --机构限定：所有下级
  RESTRICT_ORGAN_SIBLING      CONSTANT CHAR(1) := '6'; --机构限定：同级机构

  --用户ID类型嵌套表
  TYPE TAB_USER IS TABLE OF INTEGER;

  --计算环节办理人
  PROCEDURE P_CALC_TRANSACTOR(IN_WF_INS_ID       INTEGER, --流程实例ID
                              IN_NODE_ID         INTEGER, --要获取环节办理人的环节ID
                              IN_PRE_NODE_INS_ID INTEGER, --上一环节实例ID
                              IN_USER_ID         INTEGER); --当前用户ID

  --计算限定条件办理人
  PROCEDURE P_CALC_CONDITION_TRANSACTOR(IN_CONDITION_ID    INTEGER, --限定条件ID
                                        IN_WF_INS_ID       INTEGER, --流程实例ID
                                        IN_PRE_NODE_INS_ID INTEGER, --上一环节实例ID
                                        IN_USER_ID         INTEGER); --当前用户ID

  --计算自定义规则办理人
  PROCEDURE P_CALC_CUSTOM_TRANSACTOR(IN_RULE_ID   INTEGER, --规则ID
                                     IN_WF_INS_ID INTEGER); --流程实例ID

  --检查环节办理人是否包含某用户
  FUNCTION F_CHECK_BLR_CONTAINS_USER(IN_NODE_ID INTEGER, --环节ID
                                     IN_USER_ID INTEGER) RETURN CHAR;

  --查找流程启动人
  PROCEDURE P_WORKFLOW_START_USER(IN_WF_INS_ID INTEGER); --流程实例ID

END PKG_TRANSACTOR;
/

prompt
prompt Creating type TAB_INT
prompt =====================
prompt
CREATE OR REPLACE TYPE TAB_INT IS TABLE OF INTEGER
/

prompt
prompt Creating type TAB_STR
prompt =====================
prompt
CREATE OR REPLACE TYPE TAB_STR IS TABLE OF VARCHAR2(4000)
/

prompt
prompt Creating package PKG_UTIL
prompt =========================
prompt
CREATE OR REPLACE PACKAGE PKG_UTIL AUTHID CURRENT_USER
/**
 * @desc: 工具包
 * @author: dingmx
 * @date: 2018/07/30
 */
 IS
  --全库搜索字符串
  PROCEDURE P_SEARCH_ALL(P_STR IN VARCHAR2);

  --全库清理
  PROCEDURE P_CLEAR_ALL;

  --重新编译无效对象
  PROCEDURE P_RECOMPILE_INVALID;

  --根据表名创建序列
  PROCEDURE P_CREATE_SEQUENCE(IN_TAB_NAME IN VARCHAR2);

  --根据表名获取序列名称
  FUNCTION F_GET_SEQ_NAME(IN_TAB_NAME IN VARCHAR2) RETURN VARCHAR2;

  --TAB_INT添加数据
  PROCEDURE P_TAB_PUSH(V_TAB_INT IN OUT TAB_INT, IN_VAL INTEGER);

  --TAB_STR添加数据
  PROCEDURE P_TAB_PUSH(V_TAB_STR IN OUT TAB_STR, IN_VAL VARCHAR2);
END PKG_UTIL;
/

prompt
prompt Creating package PKG_VALIDATE
prompt =============================
prompt
CREATE OR REPLACE PACKAGE PKG_VALIDATE IS
  PROCEDURE USP_OBJECT_VALIDATE(IN_TABLE_NAME   VARCHAR2, --表物理名
                                IN_COLUMNS_NAME VARCHAR2, --字段物理名多个用逗号隔开
                                OUT_ERRWORD     OUT VARCHAR2, --返回验证的情况
                                OUT_ERROR       OUT VARCHAR2); --返回程序执行情况
/*--------------------------------------*/
---名称/功能：对象和属性验证
---创建人：骆斌
---创建时间：2016.10.11
---修改人：
---修改时间：
---修改内容：
/*--------------------------------------*/
END PKG_VALIDATE;
/

prompt
prompt Creating package PKG_WF
prompt =======================
prompt
CREATE OR REPLACE PACKAGE PKG_WF IS
  --启动流程
  PROCEDURE P_WORKFLOW_START(IN_WF_ID       INTEGER, --流程ID
                             IN_USER_ID     INTEGER, --流程发起人用户ID(如果是嵌套的话则是环节实例ID)
                             IN_TYPE        INTEGER, --流程发起类型:0是人工，1是嵌套
                             IN_WF_VARS     VARCHAR2, --流程启动变量VAR1:VAL1;VAR2:VAL2
                             IN_NODE_INS_ID INTEGER, --嵌套环节实例ID
                             IN_DATAID      INTEGER, --数据ID
                             IN_TITLE       VARCHAR2, --标题
                             IN_SOURCE      VARCHAR2, --对象ID的集合
                             OUT_STR        OUT VARCHAR2, --返回信息
                             OUT_ERROR      OUT VARCHAR2); --返回程序执行情况

  --实例化环节
  PROCEDURE P_WORKFLOW_INSTANCE_NODE(IN_NODE_ID   INTEGER, --本环节ID
                                     IN_USER_IDS  VARCHAR2, --指定办理人IDS，用逗号分隔
                                     IN_WF_INS_ID INTEGER, --流程实例ID
                                     IN_FROM_INFO VARCHAR2, --来源信息 FIRST,NODE_ID OR ACTION,NODE_INS_ID
                                     OUT_STR      OUT VARCHAR2, --返回信息
                                     OUT_ERROR    OUT VARCHAR2); --返回程序执行情况

  --查找下一环节
  PROCEDURE P_WORKFLOW_NEXT_NODE(IN_NODE_ID   INTEGER, --环节ID
                                 IN_DECISION  VARCHAR2, --决策条件
                                 IN_WF_INS_ID INTEGER, --流程实例ID
                                 OUT_CUR      OUT SYS_REFCURSOR, --返回下一环节的ID，NAME集合
                                 OUT_STR      OUT VARCHAR2, --返回信息
                                 OUT_ERROR    OUT VARCHAR2); --返回程序执行情况

  --删除流程
  PROCEDURE P_WORKFLOW_DELETE(IN_WF_ID  NUMBER, --流程ID
                              OUT_STR   OUT VARCHAR2, --执行结果
                              OUT_ERROR OUT VARCHAR2); --返回程序执行情况

  --删除流程实例
  PROCEDURE P_WORKFLOW_INSTANCE_DELETE(IN_WF_INS_ID NUMBER, --流程实例ID
                                       OUT_STR      OUT VARCHAR2, --执行结果
                                       OUT_ERROR    OUT VARCHAR2); --返回程序执行情况

  --完成工作流
  --创建人：dmx
  --创建时间：2019/03/07
  PROCEDURE P_WORKFLOW_FINISH(IN_WF_INS_ID INTEGER, --流程实例ID
                              OUT_STR      OUT VARCHAR2, --执行结果
                              OUT_ERROR    OUT VARCHAR2); --返回程序执行情况

  --批量办理、一键办理程序，返回办理成功数量和办理失败数量和未办理数量 LB
  PROCEDURE P_WORKFLOW_BATCH_HANDLE(IN_WF_INS_IDS VARCHAR2, --流程实例IDS,多个用逗号拼接
                                    IN_USERID     NUMBER, --用户ID
                                    IN_BLYJ       VARCHAR2, --办理意见
                                    IN_FLAG       VARCHAR2, --同意，不同意标志位，0：不同意 1：同意
                                    OUT_STR       OUT VARCHAR2, --执行结果
                                    OUT_ERROR     OUT VARCHAR2); --返回程序执行情况

  --流程变量初始化
  PROCEDURE P_WORKFLOW_VARIABLE_INSTANCE(IN_WORKFLOW_ID     NUMBER, --流程ID
                                         IN_WORKFLOW_INS_ID NUMBER); --流程实例ID

  --更新流程变量实例
  PROCEDURE P_WF_INIT_VARIABLE(IN_TASK_ID INTEGER, --任务ID
                               IN_WF_VARS VARCHAR2, --流程变量及值
                               OUT_ERROR  OUT VARCHAR2); --程序运行结果

  --获取下一环节办理人(含机构环节等信息)
  PROCEDURE P_WF_NEXT_NODE_USER(IN_TASK_ID          INTEGER, --任务实例ID
                                IN_DECISION         VARCHAR2, --决策条件
                                IN_FLAG             VARCHAR2, --退回还是提交 0退回 1提交
                                IN_BACK_NODE_WF_IDS VARCHAR2, --指定的退回环节流程实例N1|W1,
                                OUT_CUR             OUT SYS_REFCURSOR, --环节、办理人、所属机构集合
                                OUT_STR             OUT VARCHAR2, --返回信息
                                OUT_ERROR           OUT VARCHAR2); --返回程序执行情况

  --功能：拷贝节点关联对象
  --创建人：wangyang
  --创建时间：2018.9.11
  PROCEDURE P_NODE_COPY_RELATED_OBJECTS(IN_SOURCE_NODE_ID INTEGER, --源节点
                                        IN_TARGET_NODE_ID INTEGER, --目标节点
                                        IN_USER_ID        INTEGER, --操作用户ID
                                        OUT_STR           OUT VARCHAR2, --执行结果
                                        OUT_ERROR         OUT VARCHAR2); --返回程序执行情况

  --获取流程业务状态
  --创建人：dmx
  --创建时间：2019.01.29
  FUNCTION F_WF_GET_STATUS(IN_WF_INS_ID IN INTEGER) RETURN VARCHAR2;

  --获取某一环节办理人IDS
  --返回用户ID用逗号隔开
  --创建时间：2019/01/30
  --创建人：dmx
  FUNCTION F_WF_GET_NODE_USERS(IN_NODE_INS_ID INTEGER) RETURN VARCHAR2;

  --获取环节的前一活动环节
  --创建时间：2019/01/30
  --创建人：dmx
  FUNCTION F_WF_GET_PRE_ACT_NODE(IN_NODE_ID INTEGER) RETURN VARCHAR2;

  --获取办理人可选配置 1表示可选，0表示不可选
  --创建时间：2019/01/30
  --创建人：dmx
  FUNCTION F_WF_GET_BLR_CHOOSE_CONFIG(IN_NODE_ID INTEGER) RETURN CHAR;

  --获取流程开始环节后第一活动环节
  --返回第一活动环节ID
  --创建人：dmx
  --创建时间：2019/02/19
  FUNCTION F_WF_GET_FIRST_ACT_NODE(IN_WF_ID         INTEGER, --流程ID
                                   IN_START_WF_VARS VARCHAR2, --流程变量值如 VAR1:VAL1;VAR2:VAL2
                                   IN_USER_ID       INTEGER) RETURN INTEGER; --当前用户ID
  --是否为第一活动环节
  --1表示是，0表示否
  --创建人：dmx
  --创建时间：2019/02/19
  FUNCTION F_WF_CHECK_FIRST_ACT_NODE(IN_NODE_INS_ID IN INTEGER) RETURN CHAR;

  --计算流程环节的分支点和聚合点
  --创建人：dmx
  --创建时间：2019/03/06
  PROCEDURE P_WF_CALC_FORK_JOIN(IN_WF_ID INTEGER, OUT_ERROR OUT VARCHAR2);

  --验证环节是否可以实例化
  --返回1表示可以实例化0表示不可实例化
  --创建人：dmx
  --创建时间：2019/03/06
  FUNCTION F_WF_CHECK_NODE_CAN_INSTANCE(IN_NODE_ID   INTEGER,
                                        IN_WF_INS_ID INTEGER) RETURN CHAR;

  --获取下一可以实例化的环节(含结束环节、活动环节、嵌套环节)
  --创建人：dmx
  --创建时间：2019/03/07
  FUNCTION F_WF_NEXT_INSTANCE_NODE(IN_NODE_ID   INTEGER, --当前环节ID
                                   IN_DECISION  VARCHAR2, --决策条件
                                   IN_WF_INS_ID INTEGER) --流程实例ID
   RETURN TAB_INT;

  --获取环节的退回环节
  --创建人：dmx
  --创建时间：2019/03/08
  FUNCTION F_WF_GET_BACK_NODES(IN_NODE_ID INTEGER, IN_WF_INS_ID INTEGER)
    RETURN SYS_REFCURSOR;

  --检查流程是否已完成，含父流程 1完成0未完成
  FUNCTION F_WF_CHECK_IS_FINISH(IN_WF_INS_ID INTEGER) RETURN CHAR;

END PKG_WF;
/

prompt
prompt Creating package PKG_WF_DAMIC_USER
prompt ==================================
prompt
CREATE OR REPLACE PACKAGE PKG_WF_DAMIC_USER IS
  TYPE MYCURSOR IS REF CURSOR;

  --查找流程启动人
  PROCEDURE P_WORKFLOW_START_USER(IN_WF_INS_ID NUMBER); --流程实例ID

  --验证动态角色是否能够找到用户
  PROCEDURE P_WORKFLOW_DAMIC_USER_YZ(IN_WORKFLOW_CODE VARCHAR2, --流程代码
                                     IN_DATA_ID       NUMBER, --业务数据ID
                                     OUT_STR          OUT VARCHAR2, --返回信息
                                     OUT_ERROR        OUT VARCHAR2); --返回程序执行情况
END PKG_WF_DAMIC_USER;
/

prompt
prompt Creating package TEST_PKG_BASEPLAT
prompt ==================================
prompt
CREATE OR REPLACE PACKAGE TEST_PKG_BASEPLAT IS
                PROCEDURE TEST_P_SAVE_ORGAN_POST_USER(IN_ID     VARCHAR2, --输入dsadasdadID
                IN_TYPE   VARCHAR2, --操作类型
                OUT_ERROR OUT VARCHAR2); --程序运行是否成功
            END TEST_PKG_BASEPLAT;
/

prompt
prompt Creating function FUN_CHECKIDCARD
prompt =================================
prompt
CREATE OR REPLACE Function Fun_checkIdcard (p_idcard in varchar2) Return Number
/*校验身份证号码是否合法，合法返回1*/
Is
    v_sum         Number;
    v_mod         Number;
    v_length      Number;
    v_date        Varchar2(10);
    v_isDate      Boolean;
    v_isNumber    Boolean;
    v_isNumber_17 Boolean;
    v_checkbit    CHAR (1);
    v_checkcode   CHAR (11)       := '10X98765432';
    v_areacode    VARCHAR2 (2000) := '11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91,';

    --[isNumber]--
    Function isNumber (p_string in varchar2) Return Boolean
    Is
        i           number;
        k           number;
        flag        boolean;
        v_length    number;
    Begin
        /*
        算法:
            通过ASCII码判断是否数字，介于[48, 57]之间。
            select ascii('0'),ascii('1'),ascii('2'),ascii('3'),ascii('4'),ascii('5'),ascii('6'),ascii('7'),ascii('8'),ascii('9') from dual;
        */

        flag := True;
        select length(p_string) into v_length from dual;

        for i in 1..v_length loop
            k := ascii(substr(p_string,i,1));
            if k < 48 or k > 57 then
                flag := False;
                Exit;
            end if;
        end loop;

        Return flag;
    End isNumber;

    --[isDate]--
    Function isDate (p_date in varchar2) Return Boolean
    Is
        v_flag          boolean;
        v_year          number;
        v_month         number;
        v_day           number;
        v_isLeapYear    boolean;
    Begin
        --[初始化]--
        v_flag := True;

        --[获取信息]--
        v_year  := to_number(substr(p_date,1,4));
        v_month := to_number(substr(p_date,5,2));
        v_day   := to_number(substr(p_date,7,2));

        --[判断是否为闰年]--
        if (mod(v_year,400) = 0) Or (mod(v_year,100) <> 0 And mod(v_year,4) = 0) then
            v_isLeapYear := True;
        else
            v_isLeapYear := False;
        end if;

        --[判断月份]--
        if v_month < 1 Or v_month > 12 then
            v_flag := False;
            Return v_flag;
        end if;

        --[判断日期]--
        if v_month in (1,3,5,7,8,10,12) and (v_day < 1 or v_day > 31) then
            v_flag := False;
        end if;
        if v_month in (4,6,9,11) and (v_day < 1 or v_day > 30) then
            v_flag := False;
        end if;
        if v_month in (2) then
            if (v_isLeapYear) then
                --[闰年]--
                if (v_day < 1 or v_day > 29) then
                    v_flag := False;
                end if;
            else
                --[非闰年]--
                if (v_day < 1 or v_day > 28) then
                    v_flag := False;
                end if;
            end if;
        end if;

        --[返回结果]--
        Return v_flag;
    End isDate;
Begin
    /*
    返回值说明:
        -1      身份证号码位数不对
        -2      身份证号码出生日期超出范围
        -3      身份证号码含有非法字符
        -4      身份证号码校验码错误
        -5      身份证号码地区码非法
        1       身份证号码通过校验
    */
    --[长度校验]--
    select lengthb(p_idcard) into v_length from dual;
    if v_length not in (15,18) then
        return -1;
    end if;

    --[区位码校验]--
    if instrb(v_areacode, substr(p_idcard, 1, 2)||',') = 0 then
        return -5;
    end if;

    --[格式化校验]--
    if v_length = 15 then
        v_isNumber := isNumber (p_idcard);
        if not (v_isNumber) then
            return -3;
        end if;
    elsif v_length = 18 then
        v_isNumber    := isNumber (p_idcard);
        v_isNumber_17 := isNumber (substr(p_idcard,1,17));
        if not ((v_isNumber) or (v_isNumber_17 and upper(substr(p_idcard,18,1)) = 'X')) then
            return -3;
        end if;
    end if;

    --[出生日期校验]--
    if v_length = 15 then
        select '19'||substr(p_idcard,7,6) into v_date from dual;
    elsif v_length = 18 then
        select substr(p_idcard,7,8) into v_date from dual;
    end if;
    v_isDate := isDate (v_date);
    if not (v_isDate) then
        return -2;
    end if;

    --[校验码校验]--
    if v_length = 18 then
        v_sum :=
               (  TO_NUMBER (SUBSTRB (p_idcard, 1, 1))
                + TO_NUMBER (SUBSTRB (p_idcard, 11, 1))
               )
             * 7
           +   (  TO_NUMBER (SUBSTRB (p_idcard, 2, 1))
                + TO_NUMBER (SUBSTRB (p_idcard, 12, 1))
               )
             * 9
           +   (  TO_NUMBER (SUBSTRB (p_idcard, 3, 1))
                + TO_NUMBER (SUBSTRB (p_idcard, 13, 1))
               )
             * 10
           +   (  TO_NUMBER (SUBSTRB (p_idcard, 4, 1))
                + TO_NUMBER (SUBSTRB (p_idcard, 14, 1))
               )
             * 5
           +   (  TO_NUMBER (SUBSTRB (p_idcard, 5, 1))
                + TO_NUMBER (SUBSTRB (p_idcard, 15, 1))
               )
             * 8
           +   (  TO_NUMBER (SUBSTRB (p_idcard, 6, 1))
                + TO_NUMBER (SUBSTRB (p_idcard, 16, 1))
               )
             * 4
           +   (  TO_NUMBER (SUBSTRB (p_idcard, 7, 1))
                + TO_NUMBER (SUBSTRB (p_idcard, 17, 1))
               )
             * 2
           + TO_NUMBER (SUBSTRB (p_idcard, 8, 1)) * 1
           + TO_NUMBER (SUBSTRB (p_idcard, 9, 1)) * 6
           + TO_NUMBER (SUBSTRB (p_idcard, 10, 1)) * 3;
        v_mod := MOD (v_sum, 11);
        v_checkbit := SUBSTRB (v_checkcode, v_mod + 1, 1);

        if v_checkbit = upper(substrb(p_idcard,18,1)) then
           return 1;
        else
           return -4;
        end if;
    else
        return 1;
    end if;
End Fun_checkIdcard;
/

prompt
prompt Creating function F_DEL_LAST_CHAR
prompt =================================
prompt
CREATE OR REPLACE FUNCTION F_DEL_LAST_CHAR(IN_STR IN VARCHAR2) --入参字符串
 RETURN VARCHAR2 AS
BEGIN
  RETURN SUBSTR(IN_STR, 1, LENGTH(IN_STR) - 1);
END F_DEL_LAST_CHAR;
/

prompt
prompt Creating function F_GET_ID
prompt ==========================
prompt
create or replace function f_get_id(in_id integer) return integer as
V_WF_STATUS CHAR(1);
begin
SELECT in_id + 1 INTO V_WF_STATUS FROM DUAL;
return V_WF_STATUS;
end;
/

prompt
prompt Creating function GET_DICT_VALUE
prompt ================================
prompt
CREATE OR REPLACE FUNCTION GET_DICT_VALUE(IN_SUBDICT_CODE IN VARCHAR2, --字典项编码
                                          IN_DICT_CODE    IN VARCHAR2) --字典编码
  --根据字典项编码查询字典项值
 RETURN VARCHAR2 AS
  V_VALUE VARCHAR2(200) := '';
  V_SQL   VARCHAR2(4000);
BEGIN
  --当字典编码为null时，使用字典项编码（含字典编码）
  IF IN_DICT_CODE IS NULL THEN
    V_SQL := 'SELECT SS.VALUE FROM SYS_SUBDICT SS WHERE SS.DICT_CODE =
    SUBSTR(:SUBDICT_CODE, 1, INSTR(:SUBDICT_CODE, ''_'') - 1) AND SS.CODE = :SUBDICT_CODE AND SS.SFYX_ST = ''1''';
    EXECUTE IMMEDIATE V_SQL
      INTO V_VALUE
      USING IN_SUBDICT_CODE, IN_SUBDICT_CODE, IN_SUBDICT_CODE;
  ELSE
    --当字典编码不为null时
    V_SQL := 'SELECT SS.VALUE FROM SYS_SUBDICT SS WHERE SS.DICT_CODE = :DICT_CODE AND SS.CODE = :SUBDICT_CODE AND SS.SFYX_ST = ''1''';
    EXECUTE IMMEDIATE V_SQL
      INTO V_VALUE
      USING IN_DICT_CODE, IN_SUBDICT_CODE;
  END IF;
  RETURN V_VALUE;
END GET_DICT_VALUE;
/

prompt
prompt Creating function SPLITSTR
prompt ==========================
prompt
CREATE OR REPLACE FUNCTION SPLITSTR(P_STRING    IN VARCHAR2,
                                    P_DELIMITER IN VARCHAR2)
  RETURN TAB_STR
  PIPELINED AS
  V_LENGTH NUMBER := LENGTH(P_STRING);
  V_START  NUMBER := 1;
  V_INDEX  NUMBER;
BEGIN
  WHILE (V_START <= V_LENGTH) LOOP
    V_INDEX := INSTR(P_STRING, P_DELIMITER, V_START);

    IF V_INDEX = 0 THEN
      PIPE ROW(SUBSTR(P_STRING, V_START));
      V_START := V_LENGTH + 1;
    ELSE
      PIPE ROW(SUBSTR(P_STRING, V_START, V_INDEX - V_START));
      V_START := V_INDEX + 1;
    END IF;
  END LOOP;

  RETURN;
END SPLITSTR;
/

prompt
prompt Creating function NUM_AREA_FORMAT
prompt =================================
prompt
CREATE OR REPLACE FUNCTION NUM_AREA_FORMAT(SOURCE_DATA   IN NUMBER, --数据字段
                                           SIDES_SETTING IN VARCHAR2) --范围边界配置，如“0-10,11-20,21-30,31+”
 RETURN VARCHAR2 AS
  V_SIDES   VARCHAR2(51);
  V_C_INDEX NUMBER;
  MIN_SIDE  VARCHAR2(25);
  MAX_SIDE  VARCHAR2(25);
  CURSOR C IS
    SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(SIDES_SETTING, ','));
BEGIN
  OPEN C;

  LOOP
    FETCH C
      INTO V_SIDES;
    MIN_SIDE := null;
    MAX_SIDE := null;
    select instr(V_SIDES, '-', -1) INTO V_C_INDEX from dual;
    IF V_C_INDEX > 0 THEN
      select substr(V_SIDES, 1, V_C_INDEX - 1) INTO MIN_SIDE from dual;
      select substr(V_SIDES, V_C_INDEX + 1) INTO MAX_SIDE from dual;
    ELSE
      select substr(V_SIDES, 1, instr(V_SIDES, '+', -1) - 1)
        INTO MIN_SIDE
        from dual;
    END IF;
    EXIT WHEN((MIN_SIDE <= SOURCE_DATA) AND
              (MAX_SIDE is null OR MAX_SIDE >= SOURCE_DATA)) OR C%NOTFOUND;
  END LOOP;

  CLOSE C;
  RETURN V_SIDES;
END NUM_AREA_FORMAT;
/

prompt
prompt Creating function RX_COUNT
prompt ==========================
prompt
CREATE OR REPLACE FUNCTION RX_COUNT(SOURCE_STR IN VARCHAR2, --传入字符窜
                                    SEARCH_STR IN VARCHAR2, --搜索字符窜
                                    DELIMITER  IN VARCHAR2) --定界符
 RETURN NUMBER AS
  V_NUM NUMBER := 0;
BEGIN
  FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(SOURCE_STR, DELIMITER))) LOOP
    IF K.COLUMN_VALUE = SEARCH_STR THEN
      V_NUM := V_NUM + 1;
    END IF;
  END LOOP;
  RETURN V_NUM;
END RX_COUNT;
/

prompt
prompt Creating function RX_COUNT2
prompt ===========================
prompt
CREATE OR REPLACE FUNCTION RX_COUNT2(SOURCE_STR IN VARCHAR2, --传入字符窜
                                     SEARCH_STR IN VARCHAR2) --搜索字符窜
 RETURN NUMBER AS
  V_NUM NUMBER; --计数
BEGIN
  SELECT (LENGTH(SOURCE_STR) - LENGTH(REPLACE(SOURCE_STR, SEARCH_STR))) /
         LENGTH(SEARCH_STR)
    INTO V_NUM
    FROM DUAL;
  RETURN V_NUM;
END RX_COUNT2;
/

prompt
prompt Creating function RX_GETSTR
prompt ===========================
prompt
CREATE OR REPLACE FUNCTION RX_GETSTR(SOURCE_STR IN VARCHAR2, --逗号隔开的源字符串 如 '1,2,3,4,5'
                                     SORT       IN NUMBER) --检索序号

 RETURN NUMBER AS
  V_ORGAN NUMBER;
  V_COUNT NUMBER := 0;
  CURSOR C IS
    SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(SOURCE_STR, ','));
BEGIN
  OPEN C;

  LOOP
    FETCH C
      INTO V_ORGAN;
    V_COUNT := V_COUNT + 1;
    EXIT WHEN SORT = V_COUNT OR C%NOTFOUND;

  END LOOP;

  CLOSE C;
  RETURN V_ORGAN;
END RX_GETSTR;
/

prompt
prompt Creating function RX_INSTR
prompt ==========================
prompt
CREATE OR REPLACE FUNCTION RX_INSTR(SOURCE_STR  IN VARCHAR2, --逗号隔开的源字符串 如 '1,2,3,4,5'
                                    SEARCH_STR  IN VARCHAR2, --逗号隔开的检索字符串 如 '2,3'
                                    SEARCH_TYPE IN CHAR) --检索类型 1  2
  --检索类型为1 只要 在源字符串中搜索到检索字符串的任意项 就 返回 1
  --检索类型为2 必须 在源字符串中搜索到检索字符串的所有项 才 返回 1
 RETURN CHAR AS

  TAG          CHAR(1);
  V_SOURCE_STR VARCHAR2(4000);
  V_SEARCH_STR VARCHAR2(4000);
  V_TEMP       VARCHAR2(100);
  V_COUNT      NUMBER := 0;
  V_LENGTH     NUMBER;
BEGIN
  V_SOURCE_STR := REPLACE(SOURCE_STR, ' ', '');
  V_SEARCH_STR := REPLACE(SEARCH_STR, ' ', '');
  --V_LENGTH     := LENGTH(V_SOURCE_STR) - LENGTH(REPLACE(V_SOURCE_STR, ',')) + 1;
  SELECT COUNT(1) INTO V_LENGTH FROM TABLE(SPLITSTR(SEARCH_STR, ','));
  IF SEARCH_TYPE = '1' THEN
    FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(V_SEARCH_STR, ','))) LOOP
      V_TEMP := ',' || K.COLUMN_VALUE || ',';
      IF INSTR(',' || V_SOURCE_STR || ',', V_TEMP) > 0 THEN
        V_COUNT := V_COUNT + 1;
      END IF;
    END LOOP;
    IF V_COUNT > 0 THEN
      TAG := '1';
    ELSE
      TAG := '0';
    END IF;
  ELSIF SEARCH_TYPE = '2' THEN
    FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(V_SEARCH_STR, ','))) LOOP
      V_TEMP := ',' || K.COLUMN_VALUE || ',';
      IF INSTR(',' || V_SOURCE_STR || ',', V_TEMP) > 0 THEN
        V_COUNT := V_COUNT + 1;
      END IF;
    END LOOP;
    IF V_COUNT > 0 AND V_COUNT = V_LENGTH THEN
      TAG := '1';
    ELSE
      TAG := '0';
    END IF;
  END IF;

  RETURN TAG;

END RX_INSTR;
/

prompt
prompt Creating function SPLITCLOB
prompt ===========================
prompt
CREATE OR REPLACE FUNCTION SPLITCLOB(P_STRING    IN CLOB,
                                     P_DELIMITER IN VARCHAR2)
  RETURN TAB_STR
  PIPELINED AS
  V_LENGTH NUMBER := DBMS_LOB.GETLENGTH(P_STRING);
  V_START  NUMBER := 1;
  V_INDEX  NUMBER;
  V_LAST   NUMBER;
BEGIN
  WHILE (V_START <= V_LENGTH) LOOP
    V_INDEX := DBMS_LOB.INSTR(P_STRING, P_DELIMITER, V_START);
    IF V_INDEX = 0 THEN
      V_LAST := V_LENGTH - V_START + 1;
      PIPE ROW(DBMS_LOB.SUBSTR(P_STRING, V_LAST, V_START));
      V_START := V_LENGTH + 1;
    ELSE
      PIPE ROW(DBMS_LOB.SUBSTR(P_STRING, V_INDEX - V_START, V_START));
      V_START := V_INDEX + 1;
    END IF;
  END LOOP;

  RETURN;
END SPLITCLOB;
/

prompt
prompt Creating function SPLITSTR_QC
prompt =============================
prompt
CREATE OR REPLACE FUNCTION SPLITSTR_QC(ACCOUNT_ID_LIST IN VARCHAR2)
/*对逗号分隔的字符串去重再拼接*/
 RETURN VARCHAR2 AS
  V_ACCOUNT_ID_LIST VARCHAR2(4000);
BEGIN
  WITH ACCTS AS
   (SELECT DISTINCT STR
      FROM (SELECT REGEXP_SUBSTR(REPLACE(ACCOUNT_ID_LIST, ', ', ','),
                                 '[^,]+',
                                 1,
                                 LEVEL,
                                 'i') AS STR
              FROM DUAL
            CONNECT BY LEVEL <= LENGTH(REPLACE(ACCOUNT_ID_LIST, ', ', ',')) -
                       LENGTH(REGEXP_REPLACE(REPLACE(ACCOUNT_ID_LIST,
                                                              ', ',
                                                              ','),
                                                      ',',
                                                      '')) + 1))
  SELECT WM_CONCAT(STR) INTO V_ACCOUNT_ID_LIST FROM ACCTS;

  RETURN V_ACCOUNT_ID_LIST;

END SPLITSTR_QC;
/

prompt
prompt Creating procedure ANALYZEALLTABLE
prompt ==================================
prompt
CREATE OR REPLACE PROCEDURE AnalyzeAllTable
IS
--2009-10-18 wallimn
--分析所有表及索引。便于有效的使用CBO优化器
BEGIN
   --分析所有表：analyze table TABLENAME compute statistics
   for cur_item in (select table_name from user_tables) loop
      begin
          execute immediate 'analyze table '|| cur_item.table_name
                               || ' compute statistics';
     exception
       when others then
         dbms_output.put_line('分析表异常：'||sqlerrm);
     end;
   end loop;

  --分析所有索引：analyze index INDEXNAME estimate statistics
   for cur_item in (select index_name from user_indexes) loop
      begin
          execute immediate 'analyze index '|| cur_item.index_name
                                || ' estimate statistics';
     exception
       when others then
         dbms_output.put_line('分析索引异常：'||sqlerrm);
     end;
   end loop;
END AnalyzeAllTable;
/

prompt
prompt Creating procedure PHOTO_DUMP
prompt =============================
prompt
create or replace procedure photo_dump(IDENTITYID in varchar2,
                                       filename   in varchar2) is
  l_file     UTL_FILE.FILE_TYPE;
  l_buffer   RAW(32767);
  l_amount   BINARY_INTEGER := 32767;
  l_pos      INTEGER := 1;
  l_blob     BLOB;
  l_blob_len INTEGER;
begin
  SELECT tpnr INTO l_blob FROM p_ycyj_gzqkdjtp_xc WHERE ID = IDENTITYID;
  l_blob_len := DBMS_LOB.GETLENGTH(l_blob);
  l_file     := UTL_FILE.FOPEN('PHOTO_DIR', filename, 'wb', 32767);
  WHILE l_pos < l_blob_len LOOP
    DBMS_LOB.READ(l_blob, l_amount, l_pos, l_buffer);
    UTL_FILE.PUT_RAW(l_file, l_buffer, TRUE);
    l_pos := l_pos + l_amount;
  END LOOP;
  UTL_FILE.FCLOSE(l_file);
EXCEPTION
  WHEN OTHERS THEN
    dbms_output.put_line(SQLERRM);
    IF UTL_FILE.IS_OPEN(l_file) THEN
      UTL_FILE.FCLOSE(l_file);
    END IF;
    RAISE;
end photo_dump;
/

prompt
prompt Creating procedure OUT_PUT_PHOTO
prompt ================================
prompt
create or replace procedure out_put_photo is
  IDENTITYID varchar2(300);
  WJMC varchar2(500);
  cursor cur is
    select ID,djrxm || '_' || gzrzID || '_' || ID  WJMC
      FROM p_ycyj_gzqkdjtp_xc
     where djsj >= to_date('2016-08-01', 'yyyy-mm-dd')
       and djsj <= to_date('2016-09-01', 'yyyy-mm-dd')
       and yxzt = 1;
  cur_result cur%rowtype;
begin
  if cur%isopen = false then
    open cur;
  end if;
  loop
    fetch cur
      into cur_result;
    exit when cur%notfound;
    IDENTITYID := cur_result.ID;
    WJMC := cur_result.WJMC;
    photo_dump(identityid => IDENTITYID, filename => WJMC || '.jpg');
  end loop;
  close cur;
end out_put_photo;
/

prompt
prompt Creating procedure PRO_CREATE_USER
prompt ==================================
prompt
create or replace procedure pro_create_user(v_username   in varchar2, --用户名
                                            v_password   in varchar2, --密码
                                            v_dropcreate in char default '0') --0：不重新创建，1:删除重新创建
authid current_user as
  --create by codemaker
  v_cnt integer;
  --datafile路径
  v_df_path varchar2(200);
begin
  --查询用户是否存在
  select count(1)
    into v_cnt
    from dba_users u
   where u.username = upper(v_username);
  dbms_output.put_line(v_cnt);
  -- 若存在，且不是删除重建则抛出异常
  if v_cnt > 0 then
    if v_dropcreate = '0' then
      raise_application_error(-20001,'user[' || v_username || '] is exist');
    else
      --删除用户
      execute immediate 'drop user ' || v_username || ' cascade';
    end if;
  end if;
  --删除表空间
  select count(1)
    into v_cnt
    from dba_tablespaces t
   where t.tablespace_name = upper(v_username || '_data');
  if v_cnt > 0 then
    execute immediate 'drop tablespace ' || v_username || '_data' ||
                      ' including contents and datafiles';
  end if;
  --删除临时表空间
  select count(1)
    into v_cnt
    from dba_tablespaces t
   where t.tablespace_name = upper(v_username || '_temp');
  if v_cnt > 0 then
    execute immediate 'drop tablespace ' || v_username || '_temp' ||
                      ' including contents and datafiles';
  end if;
  --查询数据文件存放路径
  select substr(t.file_name, 0, instr(t.file_name, '\', -1))
    into v_df_path
    from user_users u
   inner join dba_data_files t
      on u.default_tablespace = t.tablespace_name
   where rownum = 1;
  --raise_application_error(-20002,''''||v_df_path || v_username || '_data.dbf''');
  --创建表空间
  execute immediate 'create tablespace ' || v_username ||
                    '_data datafile ''' || v_df_path || v_username ||
                    '_data.dbf'' size 10m autoextend on next 10m';
  --创建临时表空间
  execute immediate 'create temporary tablespace ' || v_username ||
                    '_temp tempfile ''' || v_df_path || v_username ||
                    '_temp.dbf'' size 10m autoextend on next 10m';
  --创建用户
  execute immediate 'create user ' || v_username || ' identified by "' ||
                    v_password || '" default tablespace ' || v_username ||
                    '_data temporary tablespace ' || v_username || '_temp';
  --赋权限
  execute immediate 'grant connect,resource,dba to ' || v_username;
end;
/

prompt
prompt Creating procedure P_TEST_POST
prompt ==============================
prompt
CREATE OR REPLACE PROCEDURE P_TEST_POST(IN_WF_INS_ID INTEGER, OUT_STR OUT VARCHAR2) AS
  V_NAME VARCHAR2(100);
BEGIN
  SELECT W.NAME
    INTO V_NAME
    FROM SYS_WORKFLOW_INSTANCE WI, SYS_WORKFLOW W
   WHERE WI.ID = IN_WF_INS_ID
     AND WI.WORKFLOW_ID = W.ID
     AND W.SFYX_ST = '1'
     AND WI.SFYX_ST = '1';
  INSERT INTO TEST_POST(TYPE,VALUE) VALUES ('PROCEDURE', V_NAME);
  OUT_STR := 'SUCCESS';
END;
/

prompt
prompt Creating procedure TEST_PRO
prompt ===========================
prompt
create or replace procedure test_pro  is
    v_sn integer;
  begin
    update sys_user s set s.cjsj = sysdate where s.id = 7818;
    dbms_output.put_line(v_sn);
    commit;
    EXCEPTION
      WHEN OTHERS THEN
        BEGIN
          ROLLBACK;
        END;
end test_pro;
/

prompt
prompt Creating procedure USP_DELETE_UNVALID
prompt =====================================
prompt
CREATE OR REPLACE PROCEDURE USP_DELETE_UNVALID AUTHID CURRENT_USER IS
  CURSOR CUR_TABLES IS
    SELECT TABLE_NAME
      FROM SYS.USER_TAB_COLUMNS
     WHERE COLUMN_NAME = 'SFYX_ST'
       AND DATA_TYPE = 'CHAR'
       AND (TABLE_NAME LIKE 'T_%' OR TABLE_NAME LIKE 'SYS_%');
  V_SQL        VARCHAR2(200);
  V_TABLE_NAME VARCHAR2(100);
BEGIN
  OPEN CUR_TABLES;
  LOOP
    FETCH CUR_TABLES
      INTO V_TABLE_NAME;
    EXIT WHEN CUR_TABLES%NOTFOUND;
    V_SQL := 'DELETE FROM ' || V_TABLE_NAME || ' T WHERE T.SFYX_ST=''0'' ';
    EXECUTE IMMEDIATE V_SQL;
    COMMIT;
  END LOOP;
  CLOSE CUR_TABLES;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
END USP_DELETE_UNVALID;
/

prompt
prompt Creating procedure USP_SEQ_CREATE
prompt =================================
prompt
CREATE OR REPLACE PROCEDURE USP_SEQ_CREATE AUTHID CURRENT_USER IS
  CURSOR C IS
    SELECT TABLE_NAME
      FROM SYS.USER_TAB_COLUMNS
     WHERE COLUMN_NAME = 'ID'
       AND DATA_TYPE = 'NUMBER'
       AND (TABLE_NAME LIKE 'T_%' OR TABLE_NAME LIKE 'SYS_%');
  CURSOR S IS
    SELECT T.SEQUENCE_NAME
      FROM SYS.USER_SEQUENCES T
     WHERE T.SEQUENCE_NAME LIKE 'SEQ_T_%'
        OR T.SEQUENCE_NAME LIKE 'SEQ_SYS_%';
  V_SQL VARCHAR2(3000);
  V_TAB VARCHAR2(300);
  V_SEQ VARCHAR2(300);
  V_CT  NUMBER;
  V_ID  NUMBER;
BEGIN
  --删除所有以 SEQ_T_、SEQ_SYS_ 开头的序列
  OPEN S;
  LOOP
    FETCH S
      INTO V_TAB;
    EXIT WHEN S%NOTFOUND;
    EXECUTE IMMEDIATE 'DROP SEQUENCE ' || V_TAB;
  END LOOP;
  CLOSE S;
  --创建新序列
  OPEN C;
  LOOP
    FETCH C
      INTO V_TAB;
    EXIT WHEN C%NOTFOUND;
    --以 SEQ_ 加表名作为默认序列名
    V_SEQ := 'SEQ_' || V_TAB;
    --当序列名长度超过30，只保留30
    IF LENGTH(V_SEQ) > 30 THEN
      V_SEQ := SUBSTR(V_SEQ, 1, 30);
    END IF;
    --查找序列是否存在
    SELECT COUNT(1)
      INTO V_CT
      FROM SYS.USER_SEQUENCES
     WHERE SEQUENCE_NAME = V_SEQ;
    --当序列不存在时，创建序列
    IF V_CT = 0 THEN
      --获取序列起始ID
      V_SQL := 'SELECT NVL(MAX(ID),50)*2 FROM ' || V_TAB;
      EXECUTE IMMEDIATE V_SQL
        INTO V_ID;
      --创建序列
      V_SQL := 'CREATE SEQUENCE ' || V_SEQ || ' INCREMENT BY 1 START WITH ' || V_ID;
      EXECUTE IMMEDIATE V_SQL;
    END IF;
  END LOOP;
  CLOSE C;
END USP_SEQ_CREATE;
/

prompt
prompt Creating package body PKG_BASEPLAT
prompt ==================================
prompt
CREATE OR REPLACE PACKAGE BODY PKG_BASEPLAT IS

  --功能：保存机构、岗位、用户时，更新SYS_GLB_ROLE_USER、SYS_GLB_ROLE_POST表数据
  --创建人：wcy
  --创建时间：2017.12.19
  --最后修改人：wcy
  --最后修改时间：2017.12.19
  PROCEDURE P_SAVE_ORGAN_POST_USER(IN_ID     INTEGER, --输入ID
                                   IN_TYPE   VARCHAR2, --操作类型
                                   OUT_ERROR OUT VARCHAR2) --程序运行是否成功
   AS
    V_USER_IDS VARCHAR2(4000); --用户ID字符串,逗号拼接
  BEGIN
    --默认程序运行成功
    OUT_ERROR := 'SUCCESS';

    --操作类型为ORGAN，输入ID为机构ID
    IF IN_TYPE = 'ORGAN' THEN
      --查找机构下用户
      SELECT WM_CONCAT(OUP.USER_ID)
        INTO V_USER_IDS
        FROM SYS_GLB_USER OUP
       WHERE OUP.ORGAN_ID = IN_ID
         AND OUP.SFYX_ST = '1';
      --生成机构下用户与角色关系
      PKG_BASEPLAT.P_SET_USER_ROLES(V_USER_IDS);

      --操作类型为USER，输入ID为用户ID
    ELSIF IN_TYPE = 'USER' THEN
      --生成用户与角色关系
      PKG_BASEPLAT.P_SET_USER_ROLES(IN_ID);

    ELSE
      OUT_ERROR := '操作类型不匹配，请检查入参：IN_TYPE';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_SAVE_ORGAN_POST_USER;

  --功能：生成用户与角色关联关系
  --创建人：wcy
  --创建时间：2017.12.19
  --最后修改人：wcy
  --最后修改时间：2017.12.19
  PROCEDURE P_SET_USER_ROLES(IN_USER_IDS VARCHAR2) --用户ID字符串,逗号拼接
   AS
    V_COUNT NUMBER;
  BEGIN
    --对所有的用户ID进行循环处理
    FOR I IN (SELECT COLUMN_VALUE USER_ID
                FROM TABLE(SPLITSTR(IN_USER_IDS, ','))) LOOP
      --删除某个用户所有角色关联数据
      DELETE FROM SYS_GLB_ROLE_USER RU WHERE RU.USER_ID = I.USER_ID;
      --重新插入用户关联角色数据 （关联类型 3:用户  2:组织 4:岗位）
      FOR K IN (
                --用户关联角色
                SELECT ROLE_ID
                  FROM SYS_GLB_ROLE
                 WHERE GL_TYPE = '3'
                   AND SFYX_ST = '1'
                   AND SFQY_ST = '1'
                   AND GL_ID = I.USER_ID
                UNION
                --用户关联的岗位角色
                SELECT OUP.POST_ID ROLE_ID
                  FROM SYS_GLB_USER OUP
                 WHERE OUP.USER_ID = I.USER_ID
                   AND OUP.SFYX_ST = '1'
                   AND OUP.POST_ID IS NOT NULL

                UNION
                --用户关联机构对应角色,但是排除岗位角色
                SELECT GR.ROLE_ID
                  FROM SYS_GLB_USER OUP, SYS_GLB_ROLE GR
                 WHERE OUP.USER_ID = I.USER_ID
                   AND OUP.ORGAN_ID = GR.GL_ID
                   AND GR.GL_TYPE = '2'
                   AND OUP.SFYX_ST = '1'
                   AND GR.SFYX_ST = '1'
                   AND GR.SFQY_ST = '1'
                   AND (GR.ROLE_TYPE='1' OR  GR.ROLE_TYPE='2')
                ) LOOP
        --判断角色是否为禁用关系
        SELECT COUNT(1)
          INTO V_COUNT
          FROM DUAL
         WHERE K.ROLE_ID IN
               (
                --用户关联角色（禁用）
                SELECT ROLE_ID
                  FROM SYS_GLB_ROLE
                 WHERE GL_TYPE = '3'
                   AND SFYX_ST = '1'
                   AND SFQY_ST = '0'
                   AND GL_ID = I.USER_ID
                   AND ROLE_ID = K.ROLE_ID
               );
        --角色未被禁用
        IF V_COUNT = 0 THEN
          INSERT INTO SYS_GLB_ROLE_USER
            (ID, ROLE_ID, USER_ID)
          VALUES
            (SEQ_SYS_GLB_ROLE_USER.NEXTVAL, K.ROLE_ID, I.USER_ID);
        END IF;
      END LOOP;
    END LOOP;
  END P_SET_USER_ROLES;

  --功能：保存机构时，新增了角色，当该机构下的用户已经有了该角色，删除用户的这个角色。
  --保存机构时，删除了角色，当某个用户已经有该角色且处于禁用时，且该用户所在的其它机构没有该角色删除该用户的角色，
  --若该用户所在的其它机构也有该角色，怎么不能删除这条禁用关系。
  --创建人：pc
  --创建时间：2018.6.26
  --最后修改人：pc
  --最后修改时间：2018.6.26
  PROCEDURE P_DEL_USER_ROLE_IF_ORGAN_EXIST(IN_ORGAN_ID INTEGER, --当前保存的机构id
                                           ADD_ROLES   VARCHAR2, --该机构新增的角色
                                           DEL_ROLES   VARCHAR2, --该机构删除的角色
                                           OUT_ERROR   OUT VARCHAR2) AS
    V_USER_IDS          VARCHAR2(4000);
    V_ORGAN_IDS         VARCHAR2(4000);
    V_ORGANS_ROLE_COUNT integer;
  BEGIN
    --获取当前机构下所有的用户
    SELECT WM_CONCAT(USER_ID)
      INTO V_USER_IDS
      FROM SYS_GLB_USER
     WHERE ORGAN_ID = IN_ORGAN_ID;

    FOR I IN (SELECT COLUMN_VALUE ROLE_ID
                FROM TABLE(SPLITSTR(ADD_ROLES, ','))) LOOP
      --删除用户已有的个性该角色
      FOR K IN (SELECT COLUMN_VALUE USER_ID
                  FROM TABLE(SPLITSTR(V_USER_IDS, ','))) LOOP
        DELETE SYS_GLB_ROLE T
         WHERE T.GL_ID = K.USER_ID
           AND T.ROLE_ID = I.ROLE_ID
           AND T.GL_TYPE = '3';
      END LOOP;

    END LOOP;

    FOR I IN (SELECT COLUMN_VALUE ROLE_ID
                FROM TABLE(SPLITSTR(DEL_ROLES, ','))) LOOP

      --删除用户已有的个性该角色
      FOR K IN (SELECT COLUMN_VALUE USER_ID
                  FROM TABLE(SPLITSTR(V_USER_IDS, ','))) LOOP
        SELECT WM_CONCAT(GOUP.ORGAN_ID)
          INTO V_ORGAN_IDS
          FROM SYS_GLB_USER GOUP
         WHERE GOUP.USER_ID = USER_ID; --获取该用户的机构总数

        SELECT COUNT(*)
          into V_ORGANS_ROLE_COUNT
          FROM SYS_GLB_ROLE
         WHERE ROLE_ID = I.ROLE_ID
           AND GL_ID IN (V_ORGAN_IDS);
        IF V_ORGANS_ROLE_COUNT = 1 THEN
          DELETE SYS_GLB_ROLE T
           WHERE T.GL_ID = K.USER_ID
             AND T.ROLE_ID = I.ROLE_ID
             AND T.GL_TYPE = '3';
        end if;

      END LOOP;
    END LOOP;

    OUT_ERROR := 'SUCCESS';
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := 'PROCEDURE:P_SAVE_ROLE_RELATIONS执行异常 ' || SQLERRM;
      ROLLBACK;

  END P_DEL_USER_ROLE_IF_ORGAN_EXIST;

  --功能：为角色分配关联要素时后置数据处理
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_SAVE_ROLE_RELATIONS(IN_ROLE_ID        INTEGER, --角色ID
                                  IN_ORGANS_ADD     CLOB, --增加机构
                                  IN_ORGANS_DEL     CLOB, --删除机构
                                  IN_USERS_INCLUDE  CLOB, --包含用户
                                  IN_USERS_EXCLUDE  CLOB, --排除用户
                                  IN_USERS_TURN     CLOB, --取消包含、排除用户
                                  OUT_ERROR         OUT VARCHAR2) --返回程序运行结果
   AS
     V_ROLE_TYPE VARCHAR2(20); --角色类型
  BEGIN
    OUT_ERROR := 'SUCCESS';
    SELECT ROLE_TYPE
          INTO V_ROLE_TYPE
          FROM SYS_ROLE WHERE ID = IN_ROLE_ID;
    IF IN_ORGANS_ADD IS NOT NULL THEN
      DELETE FROM TEMP_IDS_CLOB;
      INSERT INTO TEMP_IDS_CLOB (IDS) VALUES (IN_ORGANS_ADD);
      --增加机构与角色关系
      PKG_BASEPLAT.P_ADD_ORGAN_OR_BASE_POST(IN_ROLE_ID, 'ORGAN', V_ROLE_TYPE);
    END IF;

    IF IN_ORGANS_DEL IS NOT NULL THEN
      DELETE FROM TEMP_IDS_CLOB;
      INSERT INTO TEMP_IDS_CLOB (IDS) VALUES (IN_ORGANS_DEL);
      --删除机构与角色关系
      PKG_BASEPLAT.P_DEL_ORGAN_OR_BASE_POST(IN_ROLE_ID, 'ORGAN');
    END IF;

    IF IN_USERS_INCLUDE IS NOT NULL THEN
      DELETE FROM TEMP_IDS_CLOB;
      INSERT INTO TEMP_IDS_CLOB (IDS) VALUES (IN_USERS_INCLUDE);
      --增加用户与角色包含关系
      PKG_BASEPLAT.P_ADD_POST_OR_USER_INCLUDE(IN_ROLE_ID, 'USER',V_ROLE_TYPE);
    END IF;

    IF IN_USERS_EXCLUDE IS NOT NULL THEN
      DELETE FROM TEMP_IDS_CLOB;
      INSERT INTO TEMP_IDS_CLOB (IDS) VALUES (IN_USERS_EXCLUDE);
      --增加用户与角色排除关系
      PKG_BASEPLAT.P_ADD_POST_OR_USER_EXCLUDE(IN_ROLE_ID, 'USER',V_ROLE_TYPE);
    END IF;

    IF IN_USERS_TURN IS NOT NULL THEN
      DELETE FROM TEMP_IDS_CLOB;
      INSERT INTO TEMP_IDS_CLOB (IDS) VALUES (IN_USERS_TURN);
      --删除用户与角色的包含、排除关系
      PKG_BASEPLAT.P_DEL_POST_OR_USER_TURN(IN_ROLE_ID, 'USER');
    END IF;

    --生成角色与具体岗位、用户关系
    PKG_BASEPLAT.P_SET_ROLE_POST_AND_USER(IN_ROLE_ID, OUT_ERROR);

  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := 'PROCEDURE:P_SAVE_ROLE_RELATIONS执行异常 ' || SQLERRM;
      ROLLBACK;
  END P_SAVE_ROLE_RELATIONS;

  --增加机构、基础岗位与角色关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_ADD_ORGAN_OR_BASE_POST(IN_ROLE_ID INTEGER, --角色ID
                                     IN_TYPE    VARCHAR2,  --操作类型
                                     IN_ROLE_TYPE VARCHAR2)   --角色类型
   AS
    V_GL_ID NUMBER; --关联ID
    V_NUM   NUMBER; --数量
    V_IDS   CLOB; --CLOB变量
  BEGIN
    SELECT IDS INTO V_IDS FROM TEMP_IDS_CLOB;
    IF V_IDS IS NOT NULL THEN
      FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITCLOB(V_IDS, ','))) LOOP
        V_GL_ID := TO_NUMBER(K.COLUMN_VALUE);
        SELECT COUNT(1)
          INTO V_NUM
          FROM SYS_GLB_ROLE GR
         WHERE GR.ROLE_ID = IN_ROLE_ID
           AND GR.GL_ID = V_GL_ID
           AND GR.GL_TYPE = DECODE(IN_TYPE,
                                   'ORGAN',
                                   '2',
                                   'USER',
                                   '3')
           AND GR.SFQY_ST = '1'
           AND GR.SFYX_ST = '1';
        IF V_NUM = 0 THEN
          INSERT INTO SYS_GLB_ROLE
            (ID, ROLE_ID, GL_ID, GL_TYPE, SFQY_ST, SFYX_ST,ROLE_TYPE)
          VALUES
            (SEQ_SYS_GLB_ROLE.NEXTVAL,
             IN_ROLE_ID,
             V_GL_ID,
             DECODE(IN_TYPE,
                    'ORGAN',
                    '2',
                    'USER',
                    '3'),
             '1',
             '1',
             IN_ROLE_TYPE);
        END IF;
      END LOOP;
    END IF;
  END P_ADD_ORGAN_OR_BASE_POST;

  --删除机构、基础岗位与角色关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_DEL_ORGAN_OR_BASE_POST(IN_ROLE_ID INTEGER, --角色ID
                                     IN_TYPE    VARCHAR2) --操作类型
   AS
    V_GL_ID NUMBER; --关联ID
    V_IDS   CLOB; --CLOB变量
  BEGIN
    SELECT IDS INTO V_IDS FROM TEMP_IDS_CLOB;
    IF V_IDS IS NOT NULL THEN
      FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITCLOB(V_IDS, ','))) LOOP
        V_GL_ID := TO_NUMBER(K.COLUMN_VALUE);
        DELETE FROM SYS_GLB_ROLE GR
         WHERE GR.ROLE_ID = IN_ROLE_ID
           AND GR.GL_ID = V_GL_ID
           AND GR.GL_TYPE = DECODE(IN_TYPE,
                                   'ORGAN',
                                   '2',
                                   'USER',
                                   '3');
      END LOOP;
    END IF;
  END P_DEL_ORGAN_OR_BASE_POST;

  --增加具体岗位、用户与角色包含关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_ADD_POST_OR_USER_INCLUDE(IN_ROLE_ID INTEGER, --角色ID
                                       IN_TYPE    VARCHAR2, --操作类型
                                       IN_ROLE_TYPE VARCHAR2 )  --角色类型
   AS
    V_GL_ID NUMBER; --关联ID
    V_NUM   NUMBER; --数量
    V_IDS   CLOB; --CLOB变量
  BEGIN
    SELECT IDS INTO V_IDS FROM TEMP_IDS_CLOB;
    IF V_IDS IS NOT NULL THEN
      FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITCLOB(V_IDS, ','))) LOOP
        V_GL_ID := TO_NUMBER(K.COLUMN_VALUE);
        SELECT COUNT(1)
          INTO V_NUM
          FROM SYS_GLB_ROLE GR
         WHERE GR.ROLE_ID = IN_ROLE_ID
           AND GR.GL_ID = V_GL_ID
           AND GR.GL_TYPE = DECODE(IN_TYPE,
                                   'ORGAN',
                                   '2',
                                   'USER',
                                   '3')
           AND GR.SFQY_ST = '1'
           AND GR.SFYX_ST = '1';
        IF V_NUM = 0 THEN
          INSERT INTO SYS_GLB_ROLE
            (ID, ROLE_ID, GL_ID, GL_TYPE, SFQY_ST, SFYX_ST,ROLE_TYPE)
          VALUES
            (SEQ_SYS_GLB_ROLE.NEXTVAL,
             IN_ROLE_ID,
             V_GL_ID,
             DECODE(IN_TYPE,
                    'ORGAN',
                    '2',
                    'USER',
                    '3'),
             '1',
             '1',
             IN_ROLE_TYPE);
        END IF;
      END LOOP;
    END IF;
  END P_ADD_POST_OR_USER_INCLUDE;

  --增加具体岗位、用户与角色排除关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_ADD_POST_OR_USER_EXCLUDE(IN_ROLE_ID INTEGER, --角色ID
                                       IN_TYPE    VARCHAR2, --操作类型
                                       IN_ROLE_TYPE VARCHAR2) --角色类型
   AS
    V_GL_ID NUMBER; --关联ID
    V_NUM   NUMBER; --数量
    V_IDS   CLOB; --CLOB变量
  BEGIN
    SELECT IDS INTO V_IDS FROM TEMP_IDS_CLOB;
    IF V_IDS IS NOT NULL THEN
      FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITCLOB(V_IDS, ','))) LOOP
        V_GL_ID := TO_NUMBER(K.COLUMN_VALUE);
        SELECT COUNT(1)
          INTO V_NUM
          FROM SYS_GLB_ROLE GR
         WHERE GR.ROLE_ID = IN_ROLE_ID
           AND GR.GL_ID = V_GL_ID
           AND GR.GL_TYPE = DECODE(IN_TYPE,
                                   'ORGAN',
                                   '2',
                                   'USER',
                                   '3')
           AND GR.SFQY_ST = '0'
           AND GR.SFYX_ST = '1';
        IF V_NUM = 0 THEN
          INSERT INTO SYS_GLB_ROLE
            (ID, ROLE_ID, GL_ID, GL_TYPE, SFQY_ST, SFYX_ST,ROLE_TYPE)
          VALUES
            (SEQ_SYS_GLB_ROLE.NEXTVAL,
             IN_ROLE_ID,
             V_GL_ID,
             DECODE(IN_TYPE,
                    'ORGAN',
                    '2',
                    'USER',
                    '3'),
             '0',
             '1',
             IN_ROLE_TYPE);
        END IF;
      END LOOP;
    END IF;
  END P_ADD_POST_OR_USER_EXCLUDE;

  --删除具体岗位、用户与角色的包含、排除关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_DEL_POST_OR_USER_TURN(IN_ROLE_ID INTEGER, --角色ID
                                    IN_TYPE    VARCHAR2) --操作类型
   AS
    V_GL_ID NUMBER; --关联ID
    V_IDS   CLOB; --CLOB变量
  BEGIN
    SELECT IDS INTO V_IDS FROM TEMP_IDS_CLOB;
    IF V_IDS IS NOT NULL THEN
      FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITCLOB(V_IDS, ','))) LOOP
        V_GL_ID := TO_NUMBER(K.COLUMN_VALUE);
        DELETE FROM SYS_GLB_ROLE GR
         WHERE GR.ROLE_ID = IN_ROLE_ID
           AND GR.GL_ID = V_GL_ID
           AND GR.GL_TYPE = DECODE(IN_TYPE,
                                   'ORGAN',
                                   '2',
                                   'USER',
                                   '3');
      END LOOP;
    END IF;
  END P_DEL_POST_OR_USER_TURN;

  --生成角色与具体岗位、用户关系
  --创建人：wcy
  --创建时间：2017.12.29
  --最后修改人：wcy
  --最后修改时间：2017.12.29
  PROCEDURE P_SET_ROLE_POST_AND_USER(IN_ROLE_ID INTEGER, --角色ID
                                     OUT_ERROR  OUT VARCHAR2) --程序运行是否成功
   AS
    V_COUNT NUMBER;
  BEGIN
    OUT_ERROR := 'SUCCESS';
    --删除角色与用户关系
    DELETE FROM SYS_GLB_ROLE_USER GRU WHERE GRU.ROLE_ID = IN_ROLE_ID;
    --重新生成角色与用户关系
    FOR K IN ( --角色关联用户
              SELECT GL_ID USER_ID
                FROM SYS_GLB_ROLE
               WHERE GL_TYPE = '3'
                 AND SFYX_ST = '1'
                 AND SFQY_ST = '1'
                 AND ROLE_ID = IN_ROLE_ID
              UNION
              --角色关联机构下用户
              SELECT OUP.USER_ID
                FROM SYS_GLB_ROLE GR, SYS_GLB_USER OUP
               WHERE GR.ROLE_ID = IN_ROLE_ID
                 AND GR.GL_ID = OUP.ORGAN_ID
                 AND GR.GL_TYPE = '2'
                 AND OUP.SFYX_ST = '1'
                 AND GR.SFYX_ST = '1'
                 AND GR.SFQY_ST = '1') LOOP
      --判断角色是否为禁用关系
      SELECT COUNT(1)
        INTO V_COUNT
        FROM DUAL
       WHERE K.USER_ID IN
             (
              --角色关联用户（禁用）
              SELECT GL_ID
                FROM SYS_GLB_ROLE
               WHERE GL_TYPE = '3'
                 AND SFYX_ST = '1'
                 AND SFQY_ST = '0'
                 AND GL_ID = K.USER_ID
                 AND ROLE_ID = IN_ROLE_ID);
      --角色未被禁用
      IF V_COUNT = 0 THEN
        INSERT INTO SYS_GLB_ROLE_USER
          (ID, ROLE_ID, USER_ID)
        VALUES
          (SEQ_SYS_GLB_ROLE_USER.NEXTVAL, IN_ROLE_ID, K.USER_ID);
      END IF;
    END LOOP;
    --异常处理
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_SET_ROLE_POST_AND_USER;

  --删除机构、岗位角色、用户
  --创建人：wcy
  --创建时间：2018.1
  --最后修改人：pc
  --最后修改时间：2018.6
  PROCEDURE P_DELETE_ORGAN_POST_USER(IN_ID        INTEGER, --输入ID
                                     IN_TYPE      VARCHAR2, --操作类型
                                     IN_CHANGE_ID INTEGER, --输入变化ID
                                     OUT_ERROR    OUT VARCHAR2) --运行结果
   AS
    V_USER_IDS VARCHAR2(4000);
    ERR_DELETE_OPU EXCEPTION;
  BEGIN
    OUT_ERROR := 'SUCCESS';
    --操作类型为USER，输入ID为用户ID
    IF IN_TYPE = 'USER' THEN
      --删除三要素表中用户关联数据
      DELETE FROM SYS_GLB_USER WHERE USER_ID = IN_ID;
      --删除角色关联表中用户关联数据
      DELETE FROM SYS_GLB_ROLE
       WHERE GL_ID = IN_ID
         AND GL_TYPE = '3';
      --删除角色用户分解表中用户关联数据
      DELETE FROM SYS_GLB_ROLE_USER WHERE USER_ID = IN_ID;

      --操作类型为ORGAN，输入ID为机构ID
    ELSIF IN_TYPE = 'ORGAN' THEN
      IF IN_CHANGE_ID IS NOT NULL THEN
        --删除角色关联表数据(包括岗位角色)
        DELETE FROM SYS_GLB_ROLE
         WHERE GL_ID = IN_ID
           AND GL_TYPE = '2';
        --更新机构上级机构
        UPDATE SYS_ORGAN O
           SET O.PARENT_ORG = IN_CHANGE_ID
         WHERE O.PARENT_ORG = IN_ID
           AND O.SFYX_ST = '1';
        --查找机构下用户
        SELECT WM_CONCAT(OUP.USER_ID)
          INTO V_USER_IDS
          FROM SYS_GLB_USER OUP
         WHERE OUP.ORGAN_ID = IN_ID
           AND OUP.SFYX_ST = '1';

        --默认机构的改变（当机构下用户的默认机构，是该机构时，将默认机构改为替换的机构。）
        UPDATE SYS_USER U SET U.DEFAULT_ORGAN_ID=IN_CHANGE_ID WHERE U.DEFAULT_ORGAN_ID=IN_ID;

        --更新三要素表中数据,岗位id为空，机构换成传入的新机构
        UPDATE SYS_GLB_USER OUP
           SET OUP.POST_ID = '', OUP.ORGAN_ID = IN_CHANGE_ID
         WHERE OUP.ORGAN_ID = IN_ID
           AND OUP.SFYX_ST = '1';
        --生成用户与角色关联数据
        PKG_BASEPLAT.P_SET_USER_ROLES(V_USER_IDS);
      ELSE
        OUT_ERROR := '未指定调整后机构';
        RAISE ERR_DELETE_OPU;
      END IF;
    ELSE
      OUT_ERROR := '入参IN_TYPE值非法';
      RAISE ERR_DELETE_OPU;
    END IF;
    --异常处理
  EXCEPTION
    WHEN ERR_DELETE_OPU THEN
      ROLLBACK;
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_DELETE_ORGAN_POST_USER;

  --创建人：zxh
  --创建时间：2018.4
  --最后修改人：zxh
  --最后修改时间：2018.4
  PROCEDURE P_DEFAULT_RESOURCE_CONFIG(OUT_ERROR OUT VARCHAR2) --运行结果
   AS
    ERR_DELETE_OPU EXCEPTION;
  BEGIN
    OUT_ERROR := 'SUCCESS';
    EXECUTE IMMEDIATE 'DELETE FROM SYS_CONFIG C WHERE (INSTR(C.CODE, ''res_'') > -0 OR C.CODE = ''resType'') AND C.BIZ_TYPE = 2 AND LEVELS = 1';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''包含资源'', ''resType'', ''app,menu,page,func'', ''包含资源类目，各类资源具体配置以资源res_+类型开头。'', 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源属性：应用'', ''res_app_column'', ''url,icon.bizType'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源属性：菜单'', ''res_menu_column'', ''icon,url'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源属性：页面'', ''res_page_column'', ''url'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源属性：功能'', ''res_func_column'', ''url'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源图标：应用'', ''res_app_icon'', ''/medias/style/plat/image/resource/res_app.png'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源图标：菜单'', ''res_menu_icon'', ''/medias/style/plat/image/resource/res_menu.png'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源图标：页面'', ''res_page_icon'', ''/medias/style/plat/image/resource/res_page.png'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源图标：功能'', ''res_func_icon'', ''/medias/style/plat/image/resource/res_func.png'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源名称：应用'', ''res_app_name'', ''应用'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源名称：菜单'', ''res_menu_name'', ''菜单'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源名称：页面'', ''res_page_name'', ''页面'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源名称：功能'', ''res_func_name'', ''功能'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源上级：应用'', ''res_app_parent'', null, null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源上级：菜单'', ''res_menu_parent'', ''app,menu'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源上级：页面'', ''res_page_parent'', ''menu'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源上级：功能'', ''res_func_parent'', ''page'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源图标选择：应用'', ''res_app_iconpath'', ''/resource/iconfontSelect'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源业务字典：应用'', ''res_app_bizdict'', ''APPBIZTYPE'', ''资源业务字典：app'', 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源图标选择：菜单'', ''res_menu_iconpath'', ''/resource/iconfontSelect'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源灰色图标：页面'', ''res_page_garyicon'', ''/medias/style/plat/image/resource/res_page_gary.png'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';
    EXECUTE IMMEDIATE 'insert into SYS_CONFIG (id, name, code, value, description, cjr_id, cjsj, xgr_id, xgsj, sfyx_st, levels, biz_type, app_id)' ||
                      'values (seq_sys_config.nextval, ''资源地址选择：菜单'', ''res_menu_urlselect'', ''/resource/menuUrlSelect'', null, 286, sysdate, 286, sysdate, ''1'', ''1'', ''2'', null)';

  EXCEPTION
    WHEN ERR_DELETE_OPU THEN
      ROLLBACK;
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_DEFAULT_RESOURCE_CONFIG;

  --更新数据权限
  --创建人：wcy
  --创建时间：2018.3
  --最后修改人：wcy
  --最后修改时间：2018.3
  PROCEDURE P_UPDATE_DATA_AUTH(IN_OBJECT_ID INTEGER, --对象类型ID
                               IN_USER_IDS  CLOB, --用户IDS
                               IN_OIDS      CLOB, --对象IDS
                               IN_USER_ID   INTEGER, --当前用户ID
                               OUT_ERROR    OUT VARCHAR2) --运行结果
   AS
    V_USER_ID INTEGER;
    V_NUM     INTEGER;
    V_COUNT   INTEGER;
    ERR_DATA_AUTH EXCEPTION;
  BEGIN
    OUT_ERROR := 'SUCCESS';
    IF IN_OBJECT_ID IS NOT NULL THEN
      IF IN_USER_IDS IS NOT NULL THEN
        FOR K IN (SELECT COLUMN_VALUE
                    FROM TABLE(SPLITCLOB(IN_USER_IDS, ','))) LOOP
          V_USER_ID := TO_NUMBER(K.COLUMN_VALUE);
          --设置部分数据权限
          IF IN_OIDS IS NOT NULL THEN
            --查看原有权限是否为全部数据权限
            SELECT COUNT(1)
              INTO V_NUM
              FROM SYS_DATA_AUTH A
             WHERE A.OBJECT_ID = IN_OBJECT_ID
               AND A.USER_ID = V_USER_ID
               AND A.OIDS IS NULL
               AND A.SFYX_ST = '1';
            --否
            IF V_NUM = 0 THEN
              FOR J IN (SELECT COLUMN_VALUE
                          FROM TABLE(SPLITCLOB(IN_OIDS, ','))) LOOP
                SELECT COUNT(1)
                  INTO V_COUNT
                  FROM SYS_DATA_AUTH A
                 WHERE A.OBJECT_ID = IN_OBJECT_ID
                   AND A.USER_ID = V_USER_ID
                   AND A.OIDS = J.COLUMN_VALUE
                   AND A.SFYX_ST = '1';
                --当用户没有此权限时，新增此权限
                IF V_COUNT = 0 THEN
                  INSERT INTO SYS_DATA_AUTH
                    (ID, OBJECT_ID, USER_ID, OIDS, CJR_ID, CJSJ, SFYX_ST)
                  VALUES
                    (SEQ_SYS_DATA_AUTH.NEXTVAL,
                     IN_OBJECT_ID,
                     V_USER_ID,
                     J.COLUMN_VALUE,
                     IN_USER_ID,
                     SYSDATE,
                     '1');
                END IF;
              END LOOP;
            END IF;
            --设置全部数据权限
          ELSE
            --删除原有权限
            DELETE FROM SYS_DATA_AUTH A
             WHERE A.OBJECT_ID = IN_OBJECT_ID
               AND A.USER_ID = V_USER_ID;
            --设置新权限
            INSERT INTO SYS_DATA_AUTH
              (ID, OBJECT_ID, USER_ID, OIDS, CJR_ID, CJSJ, SFYX_ST)
            VALUES
              (SEQ_SYS_DATA_AUTH.NEXTVAL,
               IN_OBJECT_ID,
               V_USER_ID,
               NULL,
               IN_USER_ID,
               SYSDATE,
               '1');
          END IF;
        END LOOP;
      ELSE
        OUT_ERROR := '未指定用户';
        RAISE ERR_DATA_AUTH;
      END IF;
    ELSE
      OUT_ERROR := '未指定对象类型';
      RAISE ERR_DATA_AUTH;
    END IF;
    --异常处理
  EXCEPTION
    WHEN ERR_DATA_AUTH THEN
      ROLLBACK;
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_UPDATE_DATA_AUTH;

  --组合角色分解
  --创建人：dmx
  --创建时间：2018.6.25
  PROCEDURE P_FACTOR_COMBINE_ROLE(IN_ROLE_ID IN INTEGER, --角色ID
                                  OUT_ERROR  OUT VARCHAR2) --程序运行结果
   AS
   IS_COMBINE CHAR(1);--是否是组合角色
  BEGIN
    OUT_ERROR := 'SUCCESS';
    IF IN_ROLE_ID IS NULL OR TRIM(IN_ROLE_ID) IS NULL THEN
      OUT_ERROR := '要分解的角色编号为空';
      RETURN;
    END IF;
    BEGIN
      SELECT R.IS_COMBINE
        INTO IS_COMBINE
        FROM SYS_ROLE R
       WHERE R.ID = IN_ROLE_ID;
      --不是组合角色直接返回
      IF IS_COMBINE = '0' THEN
        RETURN;
      END IF;
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        OUT_ERROR := '不存在角色ID为' || IN_ROLE_ID || '的有效角色';
    END;
    --向上递归查询所有父亲角色
    FOR L_CUR IN (SELECT DISTINCT R.COMBINE_ROLE_ID
                    FROM (SELECT C.COMBINE_ROLE_ID, C.ROLE_ID
                            FROM SYS_GLB_COMBINE_ROLE C
                           WHERE C.SFYX_ST = '1') R
                   WHERE R.COMBINE_ROLE_ID <> IN_ROLE_ID
                   START WITH R.ROLE_ID = IN_ROLE_ID
                  CONNECT BY NOCYCLE PRIOR R.COMBINE_ROLE_ID = R.ROLE_ID
                  UNION ALL
                  SELECT IN_ROLE_ID
                    FROM DUAL) LOOP
      --清除原分解数据
      DELETE FROM SYS_GLB_COMBINE_ROLE_FJ S
       WHERE S.COMBINE_ROLE_ID = L_CUR.COMBINE_ROLE_ID;
      --递归查询组合角色下的普通角色
      FOR LL_CUR IN (SELECT DISTINCT R1.ROLE_ID
                       FROM (SELECT C1.COMBINE_ROLE_ID, C1.ROLE_ID
                               FROM SYS_GLB_COMBINE_ROLE C1
                              WHERE C1.SFYX_ST = '1') R1
                      WHERE R1.ROLE_ID <> L_CUR.COMBINE_ROLE_ID
                      START WITH R1.COMBINE_ROLE_ID = L_CUR.COMBINE_ROLE_ID
                     CONNECT BY NOCYCLE
                      R1.COMBINE_ROLE_ID = PRIOR R1.ROLE_ID) LOOP
        --插入角色分解表
        INSERT INTO SYS_GLB_COMBINE_ROLE_FJ
          (ID, COMBINE_ROLE_ID, ROLE_ID, SFYX_ST)
        VALUES
          (SEQ_SYS_GLB_COMBINE_ROLE_FJ.NEXTVAL,
           L_CUR.COMBINE_ROLE_ID,
           LL_CUR.ROLE_ID,
           '1');
      END LOOP;
    END LOOP;
    --提交数据
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      --出现异常回滚
      ROLLBACK;
  END P_FACTOR_COMBINE_ROLE;

  --角色删除后置处理
  --创建人：dmx
  --创建时间：2018.6.28
  PROCEDURE P_AFTER_DELETE_ROLE(IN_ROLE_ID IN INTEGER, --角色ID
                                OUT_ERROR  OUT VARCHAR2) --程序运行结果
   AS
  BEGIN
    OUT_ERROR := 'SUCCESS';
    --更新角色关联表
    UPDATE SYS_GLB_ROLE SET SFYX_ST = '0' WHERE ROLE_ID = IN_ROLE_ID;
    --更新角色关联资源表
    UPDATE SYS_GLB_ROLE_RESOURCE
       SET SFYX_ST = '0'
     WHERE ROLE_ID = IN_ROLE_ID;
    --删除角色关联岗位表
   -- DELETE SYS_GLB_ROLE_POST WHERE ROLE_ID = IN_ROLE_ID;
    --删除角色关联用户表
    DELETE SYS_GLB_ROLE_USER WHERE ROLE_ID = IN_ROLE_ID;
    --更新角色关联规则表
    UPDATE SYS_GLB_ROLE_AUTHRULE
       SET SFYX_ST = '0'
     WHERE ROLE_ID = IN_ROLE_ID;
    --更新角色组合
    UPDATE SYS_GLB_COMBINE_ROLE S
       SET S.SFYX_ST = '0'
     WHERE S.COMBINE_ROLE_ID = IN_ROLE_ID;
    --更新父级角色组合
    UPDATE SYS_GLB_COMBINE_ROLE S
       SET S.SFYX_ST = '0'
     WHERE S.ROLE_ID = IN_ROLE_ID;
    --刷新父级角色分解
    P_FACTOR_COMBINE_ROLE(IN_ROLE_ID, OUT_ERROR);
    --删除角色分解
    DELETE SYS_GLB_COMBINE_ROLE_FJ F WHERE F.COMBINE_ROLE_ID = IN_ROLE_ID;
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      --出现异常回滚
      ROLLBACK;
  END P_AFTER_DELETE_ROLE;

END PKG_BASEPLAT;
/

prompt
prompt Creating package body PKG_FORM_DEF
prompt ==================================
prompt
create or replace package body PKG_FORM_DEF is

  --功能：创建表
  --创建人：mrq
  --创建时间：2018.8
  PROCEDURE P_CREATE_FORMTABLE(IN_TABLE_NAME VARCHAR2, --数据库表名称
                            IN_TABLE_SQL VARCHAR2, --建表sql
                            OUT_ERROR    OUT VARCHAR2) --返回程序执行情况
   AS
    V_NUM        number; --流程实例ID
    V_TABLE_NAME VARCHAR2(50); --表名
    V_SEQ_NAME   VARCHAR2(50); --序列名
  BEGIN
    OUT_ERROR    := 'SUCCESS';
    V_TABLE_NAME := UPPER(IN_TABLE_NAME);
    --删除表
    select count(1)
      into V_NUM
      from user_tables
     where table_name = V_TABLE_NAME;
    if V_NUM > 0 then
      execute immediate CONCAT('drop table ', V_TABLE_NAME);
    end if;
    --删除序列
    V_SEQ_NAME := UPPER(CONCAT('SEQ_', V_TABLE_NAME));
    select count(1)
      into V_NUM
      from user_sequences
     where sequence_name = V_SEQ_NAME;
    if V_NUM > 0 then
      execute immediate CONCAT('drop SEQUENCE ', V_SEQ_NAME);
    end if;
    execute immediate IN_TABLE_SQL;
    execute immediate CONCAT(CONCAT('CREATE SEQUENCE ', V_SEQ_NAME),
                             ' start with 1 increment by 1');
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_CREATE_FORMTABLE;
end PKG_FORM_DEF;
/

prompt
prompt Creating package body PKG_TASK
prompt ==============================
prompt
CREATE OR REPLACE PACKAGE BODY PKG_TASK IS

  V_VALID            CONSTANT CHAR(1) := '1'; --有效状态 有效
  V_SUCCESS_FLAG     CONSTANT VARCHAR2(10) := 'SUCCESS'; --程序运行成功标识 与JAVA代码对应
  V_ACTION_SUBMIT    CONSTANT VARCHAR2(10) := 'SUBMIT'; --任务提交
  V_ACTION_BACK      CONSTANT VARCHAR2(10) := 'BACK'; --任务退回
  V_ACTION_RECOVER   CONSTANT VARCHAR2(10) := 'RECOVER'; --任务撤回
  V_SUBMIT_SUCCESS   CONSTANT VARCHAR2(20) := '提交成功'; --提交成功提示
  V_BACK_SUCCESS     CONSTANT VARCHAR2(20) := '退回成功'; --退回成功提示
  V_RECOVER_SUCCESS  CONSTANT VARCHAR2(20) := '撤回成功'; --撤回成功提示
  V_SIGN_SUCCESS     CONSTANT VARCHAR2(20) := '签收成功'; --签收成功提示
  V_TRANSFER_SUCCESS CONSTANT VARCHAR2(20) := '转办成功'; --转办成功提示

  --功能：签收任务
  PROCEDURE P_TASK_SIGN(IN_TASK_ID INTEGER, --任务实例ID
                        OUT_STR    OUT VARCHAR2, --返回签收情况信息
                        OUT_ERROR  OUT VARCHAR2) --返回程序执行情况
   AS
    V_NODE_TYPE     CHAR(1); --环节类型
    V_TRANSACT_TYPE CHAR(1); --办理方式，抢占或嵌套
    V_WF_INS_ID     INTEGER; --流程实例ID
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --查找任务所在环节类型 流程实例
    SELECT NODE.TYPE, TASK.WORKFLOW_INSTANCE_ID
      INTO V_NODE_TYPE, V_WF_INS_ID
      FROM SYS_TASK_INSTANCE TASK, SYS_NODE NODE, SYS_NODE_INSTANCE S
     WHERE TASK.ID = IN_TASK_ID
       AND S.NODE_ID = NODE.ID
       AND S.ID = TASK.NODE_INSTANCE_ID
       AND TASK.SFYX_ST = V_VALID
       AND NODE.SFYX_ST = V_VALID
       AND S.SFYX_ST = V_VALID;
    IF V_NODE_TYPE = '2' THEN
      --如果是活动环节，再判断是否抢占
      SELECT NODE.TRANSACT_TYPE
        INTO V_TRANSACT_TYPE
        FROM SYS_TASK_INSTANCE TASK,
             SYS_ACTIVITY_NODE NODE,
             SYS_NODE_INSTANCE S
       WHERE TASK.ID = IN_TASK_ID
         AND S.NODE_ID = NODE.ID
         AND S.ID = TASK.NODE_INSTANCE_ID
         AND TASK.SFYX_ST = V_VALID
         AND S.SFYX_ST = V_VALID;
      IF V_TRANSACT_TYPE = '0' THEN
        --如果抢占，则将该环节下其他任务状态置为抢占终止，动作为无动作，是否完成为已完成
        UPDATE SYS_TASK_INSTANCE TA
           SET TA.STATUS      = '3',
               TA.ACTION      = '1',
               TA.IS_FINISH   = '1',
               TA.FINISH_DATE = SYSDATE
         WHERE TA.NODE_INSTANCE_ID IN
               (SELECT S.NODE_INSTANCE_ID
                  FROM SYS_TASK_INSTANCE S
                 WHERE S.ID = IN_TASK_ID
                   AND S.SFYX_ST = V_VALID)
           AND TA.ID <> IN_TASK_ID
           AND TA.SFYX_ST = V_VALID;
      END IF;
    END IF;
    --将该任务状态改为在办，动作为签收
    UPDATE SYS_TASK_INSTANCE
       SET STATUS      = '1',
           ACTION      = '2',
           ACCEPT_DATE = SYSDATE,
           IS_FINISH   = '0'
     WHERE ID = IN_TASK_ID
       AND SFYX_ST = V_VALID;
    --记录操作日志
    PKG_TASK.P_LOG_TASK(IN_TASK_ID, 'SIGN');
    --返回信息
    OUT_STR := V_SIGN_SUCCESS;
  EXCEPTION
    WHEN OTHERS THEN
      OUT_STR   := '签收时出现' || SQLERRM;
      OUT_ERROR := '签收时出现' || SQLERRM;
  END P_TASK_SIGN;

  --任务办理
  PROCEDURE P_TASK_SUBMIT(IN_TASK_ID       INTEGER, --任务ID
                          IN_NODE_USER_IDS VARCHAR2, --指定环节和办理人 格式:N1|USER11,USER12;N2|USER21
                          IN_DECISION      VARCHAR2, --决策条件(手动决策)
                          IN_BLYJ          VARCHAR2, --办理意见
                          IN_FJ_ID         VARCHAR2, --附件ID
                          OUT_STR          OUT VARCHAR2, --返回不能提交的原因
                          OUT_ERROR        OUT VARCHAR2) --返回程序执行情况
   AS
    V_TASK_FINISH           SYS_TASK_INSTANCE.IS_FINISH%TYPE; --任务是否完成 0未完成1完成
    V_TASK_STATUS           SYS_TASK_INSTANCE.STATUS%TYPE; --任务状态 0待办1在办2已办3抢占终止4会签终止7被撤回8被退回
    V_WF_INS_ID             INTEGER; --流程实例ID
    V_WF_INS_STATUS         SYS_WORKFLOW_INSTANCE.STATUS%TYPE; --流程状态 0完成（正常结束）1挂起2运行5未提交
    V_NODE_INS_ID           INTEGER; --环节实例ID
    V_NODE_ID               INTEGER; --环节ID
    V_NODE_TYPE             SYS_NODE.TYPE%TYPE; --环节类别 0开始环节1结束环节2活动环节4决策环节5嵌套环节
    V_TASK_OPINION          VARCHAR2(200); --任务意见
    V_TRANSACT_TYPE         SYS_ACTIVITY_NODE.TRANSACT_TYPE%TYPE; --多人办理方式 0抢占1会签
    V_COUNTERSIGN_PARAMETER SYS_ACTIVITY_NODE.COUNTERSIGN_PARAMETER%TYPE; --会签处理参数 0全部 1比例 2固定
    V_COUNTERSIGN_VALUE     SYS_ACTIVITY_NODE.COUNTERSIGN_VALUE%TYPE; --会签处理参数值
    V_NODE_INS_CAN_FINISH   BOOLEAN := FALSE; --环节实例是否可以完成
    V_TOTAL_TASK_NUM        INTEGER; --当前任务所在的环节实例下任务总数
    V_FINISH_TASK_NUM       INTEGER; --当前任务所在的环节实例下完成任务数量
    TYPE TYPE_NODE_TAB IS TABLE OF VARCHAR2(4000) INDEX BY BINARY_INTEGER;
    V_NODE_TAB        TYPE_NODE_TAB; --环节ID与USERIDS键值对
    V_ASSIGN_NODE_ID  INTEGER; --指定环节ID
    V_ASSIGN_USER_IDS VARCHAR2(4000); --指定用户IDS
    V_CAN_INSTANCE    CHAR(1); --环节是否可以实例化1是0否
    V_COUNT           INTEGER; --临时计数
    ERR_TASK_SUBMIT EXCEPTION; --自定义异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --更新任务表单实例中的审批意见
    UPDATE SYS_TASK_PAGE_INSTANCE TPI
       SET TPI.TASK_PAGE_OPINION =
           (SELECT T.BLYJ
              FROM TEMP_TASK_PAGE_BLYJ T
             WHERE T.NODE_PAGE_ID = TPI.NODE_PAGE_ID)
     WHERE TPI.TASK_INSTANCE_ID = IN_TASK_ID
       AND TPI.SFYX_ST = V_VALID;
    --清除审批意见临时表数据
    DELETE FROM TEMP_TASK_PAGE_BLYJ;
    --将任务表单实例中的草稿数据JSON清空
    UPDATE SYS_TASK_PAGE_INSTANCE
       SET TMP_DATA_JSON = NULL
     WHERE TASK_INSTANCE_ID = IN_TASK_ID;
    --查询任务是否完成、任务状态、流程实例ID、环节实例ID
    SELECT TI.IS_FINISH,
           TI.STATUS,
           TI.WORKFLOW_INSTANCE_ID,
           TI.NODE_INSTANCE_ID
      INTO V_TASK_FINISH, V_TASK_STATUS, V_WF_INS_ID, V_NODE_INS_ID
      FROM SYS_TASK_INSTANCE TI
     WHERE TI.ID = IN_TASK_ID
       AND TI.SFYX_ST = V_VALID;
    --若任务已完成则不能办理
    IF V_TASK_FINISH = '1' THEN
      OUT_STR := '该任务已完成，不能办理';
      RAISE ERR_TASK_SUBMIT;
    END IF;
    --若任务不是在办或待办不能办理
    IF V_TASK_STATUS NOT IN ('0', '1') THEN
      OUT_STR := '当前任务状态不是在办或待办，不能提交';
      RAISE ERR_TASK_SUBMIT;
    END IF;
    --查询环节ID、环节类别
    SELECT N.ID, N.TYPE, N.OPINION
      INTO V_NODE_ID, V_NODE_TYPE, V_TASK_OPINION
      FROM SYS_NODE_INSTANCE NI, SYS_NODE N
     WHERE NI.NODE_ID = N.ID
       AND NI.ID = V_NODE_INS_ID
       AND NI.SFYX_ST = '1'
       AND N.SFYX_ST = '1';
    --若不是活动环节不能提交办理
    IF V_NODE_TYPE <> '2' THEN
      OUT_STR := '当前任务所在环节不是活动环节，不能提交';
      RAISE ERR_TASK_SUBMIT;
    END IF;
    --查找本流程实例的状态
    SELECT WI.STATUS
      INTO V_WF_INS_STATUS
      FROM SYS_WORKFLOW_INSTANCE WI
     WHERE ID = V_WF_INS_ID
       AND SFYX_ST = V_VALID;
    --如果是未提交，改为运行
    IF V_WF_INS_STATUS = '5' THEN
      UPDATE SYS_WORKFLOW_INSTANCE
         SET STATUS = '2'
       WHERE ID = V_WF_INS_ID
         AND SFYX_ST = V_VALID;
    END IF;
    --若传入意见为空则取环节默认意见
    IF IN_BLYJ IS NOT NULL THEN
      V_TASK_OPINION := IN_BLYJ;
    END IF;
    --更新当前任务实例是否完成为已完成，办理动作为提交
    UPDATE SYS_TASK_INSTANCE T
       SET T.IS_FINISH   = '1', --完成
           T.STATUS      = '2', --已办
           T.FINISH_DATE = SYSDATE,
           T.OPINION     = V_TASK_OPINION,
           T.ACTION      = '3', --提交
           T.FJ_ID       = IN_FJ_ID
     WHERE T.ID = IN_TASK_ID
       AND T.SFYX_ST = V_VALID;
    --查询环节办理方式、会签处理参数、会签处理参数值
    SELECT AN.TRANSACT_TYPE, AN.COUNTERSIGN_PARAMETER, AN.COUNTERSIGN_VALUE
      INTO V_TRANSACT_TYPE, V_COUNTERSIGN_PARAMETER, V_COUNTERSIGN_VALUE
      FROM SYS_ACTIVITY_NODE AN
     WHERE AN.ID = V_NODE_ID;
    --办理方式为抢占
    IF V_TRANSACT_TYPE = '0' THEN
      --更新环节实例下其他任务实例的任务状态为抢占终止，是否完成为完成
      UPDATE SYS_TASK_INSTANCE T
         SET T.IS_FINISH   = '1', --完成
             T.STATUS      = '3', --抢占终止
             T.FINISH_DATE = SYSDATE
       WHERE T.ID <> IN_TASK_ID
         AND T.IS_FINISH = '0'
         AND T.NODE_INSTANCE_ID = V_NODE_INS_ID;
      --更新环节实例可以完成
      V_NODE_INS_CAN_FINISH := TRUE;
      --办理方式为会签
    ELSIF V_TRANSACT_TYPE = '1' THEN
      --查询当前任务所在的环节实例下的任务总数，与已完成的任务数
      SELECT COUNT(1),
             SUM(CASE
                   WHEN T.IS_FINISH = '1' THEN
                    1
                   ELSE
                    0
                 END)
        INTO V_TOTAL_TASK_NUM, V_FINISH_TASK_NUM
        FROM SYS_TASK_INSTANCE T
       WHERE T.NODE_INSTANCE_ID = V_NODE_INS_ID
         AND T.ACTION <> '5' --撤回
         AND T.SFYX_ST = V_VALID;
      --如果会签处理参数为全部人员
      IF V_COUNTERSIGN_PARAMETER = '0' THEN
        --任务全部完成
        IF V_FINISH_TASK_NUM = V_TOTAL_TASK_NUM THEN
          --更新环节实例可以完成
          V_NODE_INS_CAN_FINISH := TRUE;
        END IF;
        --如果会签处理参数为比例
      ELSIF V_COUNTERSIGN_PARAMETER = '1' THEN
        IF (V_FINISH_TASK_NUM / V_TOTAL_TASK_NUM) * 100 >=
           V_COUNTERSIGN_VALUE THEN
          --将尚未完成任务状态置为会签终止，是否完成置为完成
          UPDATE SYS_TASK_INSTANCE T
             SET T.IS_FINISH   = '1', --完成
                 T.STATUS      = '4', --会签终止
                 T.FINISH_DATE = SYSDATE
           WHERE T.NODE_INSTANCE_ID = V_NODE_INS_ID
             AND T.IS_FINISH = '0'
             AND T.SFYX_ST = V_VALID;
          --更新环节实例可以完成
          V_NODE_INS_CAN_FINISH := TRUE;
        END IF;
        ----如果会签处理参数为固定人数
      ELSIF V_COUNTERSIGN_PARAMETER = '2' THEN
        IF V_FINISH_TASK_NUM >= V_COUNTERSIGN_VALUE THEN
          --将尚未完成任务状态置为会签终止，是否完成置为完成
          UPDATE SYS_TASK_INSTANCE T
             SET T.IS_FINISH = '1', T.STATUS = '4', T.FINISH_DATE = SYSDATE
           WHERE T.NODE_INSTANCE_ID = V_NODE_INS_ID
             AND T.IS_FINISH = '0'
             AND T.SFYX_ST = V_VALID;
          --更新环节实例可以完成
          V_NODE_INS_CAN_FINISH := TRUE;
        END IF;
      END IF;
    END IF;
    --当前任务所在环节实例可以完成
    IF V_NODE_INS_CAN_FINISH THEN
      --更新环节实例状态为完成
      UPDATE SYS_NODE_INSTANCE T
         SET T.STATUS      = '2', --完成
             T.FINISH_DATE = SYSDATE
       WHERE T.ID = V_NODE_INS_ID
         AND T.SFYX_ST = V_VALID;
      --初始化指定环节用户 格式:N1|USER11,USER12;N2|USER21
      IF IN_NODE_USER_IDS IS NOT NULL THEN
        FOR L_CUR IN (SELECT * FROM TABLE(SPLITSTR(IN_NODE_USER_IDS, ';'))) LOOP
          V_ASSIGN_NODE_ID := SUBSTR(L_CUR.COLUMN_VALUE,
                                     0,
                                     INSTR(L_CUR.COLUMN_VALUE, '|') - 1);
          V_ASSIGN_USER_IDS := SUBSTR(L_CUR.COLUMN_VALUE,
                                      INSTR(L_CUR.COLUMN_VALUE, '|') + 1);
          V_NODE_TAB(V_ASSIGN_NODE_ID) := V_ASSIGN_USER_IDS;
        END LOOP;
      END IF;
      --实例化下一环节
      FOR L_CUR IN (SELECT N.ID, N.TYPE
                      FROM SYS_NODE N,
                           TABLE(PKG_WF.F_WF_NEXT_INSTANCE_NODE(V_NODE_ID,
                                                                IN_DECISION,
                                                                V_WF_INS_ID)) T
                     WHERE N.ID = T.COLUMN_VALUE
                       AND N.SFYX_ST = '1') LOOP
        V_ASSIGN_USER_IDS := '';
        IF V_NODE_TAB.EXISTS(L_CUR.ID) THEN
          V_ASSIGN_USER_IDS := V_NODE_TAB(L_CUR.ID);
        END IF;
        --检查下一环节是否可以实例化
        V_CAN_INSTANCE := PKG_WF.F_WF_CHECK_NODE_CAN_INSTANCE(L_CUR.ID,
                                                              V_WF_INS_ID);
        IF V_CAN_INSTANCE = '1' THEN
          --实例化环节
          PKG_WF.P_WORKFLOW_INSTANCE_NODE(L_CUR.ID,
                                          V_ASSIGN_USER_IDS,
                                          V_WF_INS_ID,
                                          V_ACTION_SUBMIT || ',' ||
                                          V_NODE_INS_ID,
                                          OUT_STR,
                                          OUT_ERROR);
          --若实例化环节返回不为空则实例化环节异常
          IF OUT_STR IS NOT NULL THEN
            RAISE ERR_TASK_SUBMIT;
          END IF;
        END IF;
        --若当前实例化的环节为结束环节则需检查该流程是否可以完成
        IF L_CUR.TYPE = '1' THEN
          --检查是否还有环节实例未完成
          SELECT COUNT(1)
            INTO V_COUNT
            FROM SYS_NODE_INSTANCE NI
           WHERE NI.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
             AND NI.STATUS = '1' --运行
             AND NI.SFYX_ST = '1';
          IF V_COUNT = 0 THEN
            --完成工作流
            PKG_WF.P_WORKFLOW_FINISH(V_WF_INS_ID, OUT_STR, OUT_ERROR);
            IF OUT_ERROR <> V_SUCCESS_FLAG THEN
              OUT_STR := OUT_ERROR;
              RAISE ERR_TASK_SUBMIT;
            END IF;
            EXIT;
          END IF;
        END IF;
      END LOOP;
    END IF;
    --若返回不为空则抛异常
    IF OUT_STR IS NOT NULL THEN
      RAISE ERR_TASK_SUBMIT;
    END IF;
    --记录办理成功记录
    PKG_TASK.P_LOG_TASK(IN_TASK_ID, 'SUBMIT');
    OUT_STR := V_SUBMIT_SUCCESS;
  EXCEPTION
    WHEN ERR_TASK_SUBMIT THEN
      OUT_ERROR := '办理任务时出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '办理任务时出现' || SQLERRM;
  END P_TASK_SUBMIT;

  --任务退回
  PROCEDURE P_TASK_BACK(IN_TASK_ID      INTEGER, --任务ID
                        IN_NODE_WF_USER VARCHAR2, --指定退回环节、流程实例和办理人 格式:N1|W1|U1,U2;..或N1|W1;..
                        IN_BLYJ         VARCHAR2, --办理意见
                        IN_FJ_ID        VARCHAR2, --附件ID
                        OUT_STR         OUT VARCHAR2, --返回不能退回的原因
                        OUT_ERROR       OUT VARCHAR2) --返回程序执行情况
   AS
    V_WF_INS_ID        INTEGER; --流程实例ID
    V_NODE_INS_ID      INTEGER; --环节实例ID
    V_NODE_ID          INTEGER; --环节ID
    V_BACK_NODE_INS_ID INTEGER; --退回环节实例ID
    V_NODE_TYPE        SYS_NODE.TYPE%TYPE; --环节类别
    V_TASK_FINISH      SYS_TASK_INSTANCE.IS_FINISH%TYPE; --任务是否完成 0未完成1完成
    V_TASK_STATUS      SYS_TASK_INSTANCE.STATUS%TYPE; --任务状态 0待办1在办2已办3抢占终止4会签终止7被撤回8被退回
    ERR_TASK_BACK EXCEPTION; --退回异常
    TYPE TYPE_NODE_WF_USER_TAB IS TABLE OF VARCHAR2(4000) INDEX BY VARCHAR2(20);
    V_NODE_WF_USER_TAB     TYPE_NODE_WF_USER_TAB; --环节ID|流程实例ID与USERIDS键值对
    V_NODE_WF_TAB          TAB_STR; --存储退回环节ID|流程实例ID
    V_ASSIGN_NODE_WF       VARCHAR2(20); --指定环节ID|流程实例ID
    V_ASSIGN_USER_IDS      VARCHAR2(4000); --指定用户IDS
    V_INDEX                INTEGER; --下标
    V_USER_IDS             VARCHAR2(4000); --退回环节办理人IDS
    V_WF_INS_STATUS        CHAR(1); --流程实例状态
    V_NEST_NODE_INS_ID     INTEGER; --嵌套环节实例ID
    V_NEST_NODE_INS_STATUS CHAR(1); --嵌套环节实例状态
    V_ROW_NODE_WF          TEMP_NODE_WF%ROWTYPE;
    V_BACK_NODE_CURSOR     SYS_REFCURSOR;
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --更新任务表单实例中的审批意见
    UPDATE SYS_TASK_PAGE_INSTANCE TPI
       SET TPI.TASK_PAGE_OPINION =
           (SELECT T.BLYJ
              FROM TEMP_TASK_PAGE_BLYJ T
             WHERE T.NODE_PAGE_ID = TPI.NODE_PAGE_ID)
     WHERE TPI.TASK_INSTANCE_ID = IN_TASK_ID
       AND TPI.SFYX_ST = V_VALID;
    --清除审批意见临时表数据
    DELETE FROM TEMP_TASK_PAGE_BLYJ;
    --将任务表单实例中的临时数据JSON清空
    UPDATE SYS_TASK_PAGE_INSTANCE
       SET TMP_DATA_JSON = NULL
     WHERE TASK_INSTANCE_ID = IN_TASK_ID;
    --查询任务是否完成、任务状态、流程实例ID、环节实例ID
    SELECT TI.IS_FINISH,
           TI.STATUS,
           TI.WORKFLOW_INSTANCE_ID,
           TI.NODE_INSTANCE_ID
      INTO V_TASK_FINISH, V_TASK_STATUS, V_WF_INS_ID, V_NODE_INS_ID
      FROM SYS_TASK_INSTANCE TI
     WHERE TI.ID = IN_TASK_ID
       AND TI.SFYX_ST = V_VALID;
    --若任务已完成则不能退回
    IF V_TASK_FINISH = '1' THEN
      OUT_STR := '该任务已完成，不能退回';
      RAISE ERR_TASK_BACK;
    END IF;
    --若任务不是在办或待办不能退回
    IF V_TASK_STATUS NOT IN ('0', '1') THEN
      OUT_STR := '当前任务状态不是在办或待办，不能退回';
      RAISE ERR_TASK_BACK;
    END IF;
    --查询环节ID、环节类别
    SELECT N.ID, N.TYPE
      INTO V_NODE_ID, V_NODE_TYPE
      FROM SYS_NODE_INSTANCE NI, SYS_NODE N
     WHERE NI.NODE_ID = N.ID
       AND NI.ID = V_NODE_INS_ID
       AND NI.SFYX_ST = '1'
       AND N.SFYX_ST = '1';
    --若不是活动环节不能退回办理
    IF V_NODE_TYPE <> '2' THEN
      OUT_STR := '当前任务所在环节不是活动环节，不能退回';
      RAISE ERR_TASK_BACK;
    END IF;
    --更新当前任务
    UPDATE SYS_TASK_INSTANCE TI
       SET TI.OPINION     = IN_BLYJ,
           TI.ACTION      = '4', --退回
           TI.STATUS      = '8', --被退回
           TI.IS_FINISH   = '1', --完成
           TI.FJ_ID       = IN_FJ_ID,
           TI.FINISH_DATE = SYSDATE
     WHERE TI.ID = IN_TASK_ID
       AND TI.IS_FINISH = '0'
       AND TI.SFYX_ST = V_VALID;
    --更新环节实例下其它任务
    UPDATE SYS_TASK_INSTANCE TI
       SET TI.STATUS = '8', TI.IS_FINISH = '1', TI.FINISH_DATE = SYSDATE
     WHERE TI.ID <> IN_TASK_ID
       AND TI.IS_FINISH = '0'
       AND TI.NODE_INSTANCE_ID = V_NODE_INS_ID
       AND TI.SFYX_ST = V_VALID;
    --更新环节实例状态为完成
    UPDATE SYS_NODE_INSTANCE
       SET STATUS = '2', FINISH_DATE = SYSDATE
     WHERE ID = V_NODE_INS_ID
       AND SFYX_ST = V_VALID;
    --指定退回环节
    IF IN_NODE_WF_USER IS NOT NULL THEN
      FOR L_CUR IN (SELECT * FROM TABLE(SPLITSTR(IN_NODE_WF_USER, ';'))) LOOP
        V_INDEX := INSTR(L_CUR.COLUMN_VALUE, '|', 1, 2);
        IF V_INDEX > 0 THEN
          --指定了环节办理人
          V_ASSIGN_NODE_WF := SUBSTR(L_CUR.COLUMN_VALUE, 0, V_INDEX - 1);
          V_ASSIGN_USER_IDS := SUBSTR(L_CUR.COLUMN_VALUE, V_INDEX + 1);
          V_NODE_WF_USER_TAB(V_ASSIGN_NODE_WF) := V_ASSIGN_USER_IDS;
        ELSE
          --只指定了退回环节和流程实例
          PKG_UTIL.P_TAB_PUSH(V_NODE_WF_TAB, L_CUR.COLUMN_VALUE);
        END IF;
      END LOOP;
    ELSE
      --获取退回环节
      V_BACK_NODE_CURSOR := PKG_WF.F_WF_GET_BACK_NODES(V_NODE_ID,
                                                       V_WF_INS_ID);
      LOOP
        FETCH V_BACK_NODE_CURSOR
          INTO V_ROW_NODE_WF;
        EXIT WHEN V_BACK_NODE_CURSOR%NOTFOUND;
        PKG_UTIL.P_TAB_PUSH(V_NODE_WF_TAB,
                            V_ROW_NODE_WF.NODE_ID || '|' ||
                            V_ROW_NODE_WF.WF_INS_ID);
      END LOOP;
      CLOSE V_BACK_NODE_CURSOR;
    END IF;
    --循环退回环节
    FOR L_CUR IN (SELECT N.ID NODE_ID,
                         N.NAME NODE_NAME,
                         TO_NUMBER(SUBSTR(T.COLUMN_VALUE,
                                          INSTR(T.COLUMN_VALUE, '|') + 1)) WF_INS_ID,
                         T.COLUMN_VALUE NODE_WF
                    FROM TABLE(V_NODE_WF_TAB) T, SYS_NODE N
                   WHERE TO_NUMBER(SUBSTR(T.COLUMN_VALUE,
                                          0,
                                          INSTR(T.COLUMN_VALUE, '|') - 1)) = N.ID
                     AND N.SFYX_ST = '1') LOOP
      --查找退回环节最大已完成环节实例
      SELECT MAX(NI.ID)
        INTO V_BACK_NODE_INS_ID
        FROM SYS_NODE_INSTANCE NI
       WHERE NI.NODE_ID = L_CUR.NODE_ID
         AND NI.WORKFLOW_INSTANCE_ID = L_CUR.WF_INS_ID
         AND NI.STATUS = '2'
         AND NI.SFYX_ST = V_VALID;
      --若是第一活动环节则取原办理人否则重新找人
      IF PKG_WF.F_WF_CHECK_FIRST_ACT_NODE(V_BACK_NODE_INS_ID) = '1' THEN
        --查找原任务办理人
        SELECT WM_CONCAT(TI.USER_ID)
          INTO V_USER_IDS
          FROM SYS_TASK_INSTANCE TI
         WHERE TI.NODE_INSTANCE_ID = V_BACK_NODE_INS_ID
           AND TI.SFYX_ST = V_VALID;
      ELSE
        --若指定了办理人
        IF V_NODE_WF_USER_TAB.EXISTS(L_CUR.NODE_WF) THEN
          V_USER_IDS := V_NODE_WF_USER_TAB(L_CUR.NODE_WF);
        ELSE
          --没指定重新找人
          V_USER_IDS := PKG_WF.F_WF_GET_NODE_USERS(V_BACK_NODE_INS_ID);
        END IF;
      END IF;
      IF V_USER_IDS IS NULL THEN
        OUT_STR := '退回环节[' || L_CUR.NODE_NAME || ']时未找到办理人';
        RAISE ERR_TASK_BACK;
      END IF;
      --对退回到的环节进行实例化
      PKG_WF.P_WORKFLOW_INSTANCE_NODE(L_CUR.NODE_ID,
                                      V_USER_IDS,
                                      L_CUR.WF_INS_ID,
                                      V_ACTION_BACK || ',' ||
                                      V_BACK_NODE_INS_ID,
                                      OUT_STR,
                                      OUT_ERROR);
      IF OUT_STR IS NOT NULL THEN
        RAISE ERR_TASK_BACK;
      END IF;
      --检查流程实例状态
      SELECT WI.STATUS, WI.NODE_INSTANCE_ID
        INTO V_WF_INS_STATUS, V_NEST_NODE_INS_ID
        FROM SYS_WORKFLOW_INSTANCE WI
       WHERE WI.ID = L_CUR.WF_INS_ID
         AND WI.SFYX_ST = '1';
      IF V_WF_INS_STATUS = '0' THEN
        --更新流程状态
        UPDATE SYS_WORKFLOW_INSTANCE WI
           SET WI.STATUS = '2'
         WHERE WI.ID = L_CUR.WF_INS_ID
           AND WI.SFYX_ST = '1';
        IF V_NEST_NODE_INS_ID IS NOT NULL THEN
          --获取嵌套环节状态
          SELECT NI.STATUS
            INTO V_NEST_NODE_INS_STATUS
            FROM SYS_NODE_INSTANCE NI
           WHERE NI.ID = V_NEST_NODE_INS_ID
             AND NI.SFYX_ST = '1';
          --若嵌套环节已完成
          IF V_NEST_NODE_INS_STATUS = '2' THEN
            --更新嵌套环节状态
            UPDATE SYS_NODE_INSTANCE NI
               SET NI.STATUS = '1', NI.FINISH_DATE = NULL
             WHERE NI.ID = V_NEST_NODE_INS_ID
               AND NI.SFYX_ST = '1';
          END IF;
        END IF;
      END IF;
      --更新运行中的环节实例
      FOR V_CUR IN (SELECT NI.ID, NI.NODE_ID, N.TYPE
                      FROM SYS_NODE_INSTANCE NI, SYS_NODE N
                     WHERE NI.NODE_ID = N.ID
                       AND NI.SFYX_ST = '1'
                       AND N.SFYX_ST = '1'
                       AND NI.WORKFLOW_INSTANCE_ID = L_CUR.WF_INS_ID
                       AND NI.STATUS = '1' --运行中
                       AND N.ID IN
                           (SELECT R.END_NODE_ID
                              FROM SYS_ROUTER R
                             START WITH R.START_NODE_ID = L_CUR.NODE_ID
                            CONNECT BY NOCYCLE
                             R.START_NODE_ID = PRIOR R.END_NODE_ID
                                   AND R.SFYX_ST = '1')) LOOP
        --更新环节状态完成
        UPDATE SYS_NODE_INSTANCE NI
           SET NI.STATUS = '2', NI.FINISH_DATE = SYSDATE
         WHERE NI.ID = V_CUR.ID;
        --嵌套环节
        IF V_CUR.TYPE = '5' THEN
          --更新子流程实例状态
          UPDATE SYS_WORKFLOW_INSTANCE WI
             SET WI.STATUS      = '7', --退回终止
                 WI.FINISH_DATE = SYSDATE
           WHERE WI.NODE_INSTANCE_ID = V_CUR.ID
             AND WI.STATUS = '2' --运行
             AND WI.SFYX_ST = '1';
          --更新所有子流程未完成的任务
          UPDATE SYS_TASK_INSTANCE TI
             SET TI.STATUS      = '8',
                 TI.IS_FINISH   = '1',
                 TI.FINISH_DATE = SYSDATE
           WHERE TI.IS_FINISH = '0' --未完成
             AND TI.WORKFLOW_INSTANCE_ID IN
                 (SELECT WI.ID
                    FROM SYS_WORKFLOW_INSTANCE WI
                   WHERE WI.NODE_INSTANCE_ID = V_CUR.ID
                     AND WI.SFYX_ST = '1')
             AND TI.SFYX_ST = V_VALID;
          --更新所有子流程未完成的流程实例
          UPDATE SYS_NODE_INSTANCE NI
             SET NI.STATUS = '2', NI.FINISH_DATE = SYSDATE
           WHERE NI.STATUS = '1' --运行
             AND NI.WORKFLOW_INSTANCE_ID IN
                 (SELECT WI.ID
                    FROM SYS_WORKFLOW_INSTANCE WI
                   WHERE WI.NODE_INSTANCE_ID = V_CUR.ID
                     AND WI.SFYX_ST = '1')
             AND NI.SFYX_ST = V_VALID;
        ELSE
          --更新退回环节后面运行环节任务状态
          UPDATE SYS_TASK_INSTANCE TI
             SET TI.STATUS      = '8', --被退回
                 TI.IS_FINISH   = '1', --完成
                 TI.FINISH_DATE = SYSDATE
           WHERE TI.NODE_INSTANCE_ID = V_CUR.ID
             AND TI.IS_FINISH = '0' --运行
             AND TI.SFYX_ST = V_VALID;
        END IF;
      END LOOP;
    END LOOP;
    --若返回不为空则抛异常
    IF OUT_STR IS NOT NULL THEN
      RAISE ERR_TASK_BACK;
    END IF;
    OUT_STR := V_BACK_SUCCESS;
    --记录退回成功记录
    PKG_TASK.P_LOG_TASK(IN_TASK_ID, 'BACK');
  EXCEPTION
    WHEN ERR_TASK_BACK THEN
      OUT_ERROR := '退回任务时出现 ' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '退回任务时出现 ' || SQLERRM;
  END P_TASK_BACK;

  --撤回任务
  PROCEDURE P_TASK_RECOVER(IN_TASK_ID INTEGER, --撤回任务实例ID
                           OUT_STR    OUT VARCHAR2, --返回信息
                           OUT_ERROR  OUT VARCHAR2) --返回程序执行情况
   AS
    V_NODE_ID              INTEGER; --环节ID
    V_WF_INS_STATUS        CHAR(1); --流程实例状态
    V_NODE_INS_STATUS      CHAR(1); --环节实例状态
    V_TASK_RECORD          SYS_TASK_INSTANCE%ROWTYPE;
    V_USER_IDS             VARCHAR2(4000); --用户IDS
    V_NEST_NODE_INS_ID     INTEGER; --嵌套环节实例ID(启动流程环节实例)
    V_NEST_NODE_INS_STATUS CHAR(1); --嵌套环节实例状态
    V_MASTER_WF_INS_ID     INTEGER; --主流程实例ID
    V_WF_START_TYPE        CHAR(1); --流程启动方式
    V_LOOP_TAB_NODE        TAB_INT;
    V_LOOP_NODE_IDS        VARCHAR2(4000);
    ERR_TASK_RECOVER EXCEPTION; --撤回异常
  BEGIN
    --查询环节实例ID、流程实例ID、任务动作
    SELECT TI.*
      INTO V_TASK_RECORD
      FROM SYS_TASK_INSTANCE TI
     WHERE TI.ID = IN_TASK_ID
       AND TI.SFYX_ST = '1';
    --检查任务是否已被撤回
    IF V_TASK_RECORD.ACTION = '5' THEN
      OUT_STR := '该任务已撤回，不能撤回';
      RAISE ERR_TASK_RECOVER;
    END IF;
    --将当前任务动作置为5（撤回）
    UPDATE SYS_TASK_INSTANCE TI
       SET TI.ACTION = '5' --撤回
     WHERE TI.ID = IN_TASK_ID
       AND TI.SFYX_ST = V_VALID;
    --获取环节实例状态
    SELECT NI.STATUS, N.ID
      INTO V_NODE_INS_STATUS, V_NODE_ID
      FROM SYS_NODE_INSTANCE NI, SYS_NODE N
     WHERE NI.NODE_ID = N.ID
       AND NI.ID = V_TASK_RECORD.NODE_INSTANCE_ID
       AND NI.SFYX_ST = '1'
       AND N.SFYX_ST = '1';
    --若环节实例还未完成
    IF V_NODE_INS_STATUS = '1' THEN
      --重建任务
      PKG_TASK.P_REBUILD_TASK(IN_TASK_ID, OUT_ERROR);
      IF OUT_ERROR <> V_SUCCESS_FLAG THEN
        OUT_STR := OUT_ERROR;
        RAISE ERR_TASK_RECOVER;
      END IF;
    ELSE
      --获取流程的启动方式
      SELECT WI.STARTUP_TYPE
        INTO V_WF_START_TYPE
        FROM SYS_WORKFLOW_INSTANCE WI
       WHERE WI.SFYX_ST = '1'
         AND WI.ID = V_TASK_RECORD.WORKFLOW_INSTANCE_ID;
      --加入循环
      PKG_UTIL.P_TAB_PUSH(V_LOOP_TAB_NODE, V_TASK_RECORD.NODE_INSTANCE_ID);
      LOOP
        EXIT WHEN V_LOOP_TAB_NODE.COUNT = 0;
        SELECT WM_CONCAT(COLUMN_VALUE)
          INTO V_LOOP_NODE_IDS
          FROM TABLE(V_LOOP_TAB_NODE);
        V_LOOP_TAB_NODE.DELETE;
        --遍历实例化的环节
        FOR L_CUR IN (SELECT NI.ID, N.TYPE, NI.WORKFLOW_INSTANCE_ID
                        FROM SYS_NODE_INSTANCE NI, SYS_NODE N
                       WHERE NI.FROM_NODE_INS_ID IN (V_LOOP_NODE_IDS)
                         AND NI.NODE_ID = N.ID
                         AND (NI.STATUS = '1' OR N.TYPE = '1')
                         AND N.SFYX_ST = '1'
                         AND NI.SFYX_ST = '1') LOOP
          --若是嵌套环节
          IF L_CUR.TYPE = '5' THEN
            --更新嵌套环节实例为完成
            UPDATE SYS_NODE_INSTANCE NI
               SET NI.STATUS = '2', NI.FINISH_DATE = SYSDATE
             WHERE NI.ID = L_CUR.ID
               AND NI.STATUS = '1' --运行
               AND NI.SFYX_ST = V_VALID;
            --更新所有子流程状态为完成
            UPDATE SYS_WORKFLOW_INSTANCE WI
               SET WI.STATUS      = '6', --撤回终止
                   WI.FINISH_DATE = SYSDATE
             WHERE WI.NODE_INSTANCE_ID = L_CUR.ID
               AND WI.STATUS = '2' --运行
               AND WI.SFYX_ST = '1';
            --更新所有子流程实例化的环节为完成
            UPDATE SYS_NODE_INSTANCE NI
               SET NI.STATUS = '2', NI.FINISH_DATE = SYSDATE
             WHERE NI.WORKFLOW_INSTANCE_ID IN
                   (SELECT WI.ID
                      FROM SYS_WORKFLOW_INSTANCE WI
                     WHERE WI.NODE_INSTANCE_ID = L_CUR.ID
                       AND WI.SFYX_ST = '1')
               AND NI.STATUS = '1' --运行
               AND NI.SFYX_ST = V_VALID;
            --更新所有子流程任务被撤回
            UPDATE SYS_TASK_INSTANCE TI
               SET TI.STATUS      = '7',
                   TI.IS_FINISH   = '1',
                   TI.OPINION     = '被撤回',
                   TI.FINISH_DATE = SYSDATE
             WHERE TI.WORKFLOW_INSTANCE_ID IN
                   (SELECT WI.ID
                      FROM SYS_WORKFLOW_INSTANCE WI
                     WHERE WI.NODE_INSTANCE_ID = L_CUR.ID
                       AND WI.SFYX_ST = '1')
               AND TI.SFYX_ST = V_VALID;
          ELSIF L_CUR.TYPE = '2' THEN
            --更新实例化的环节为完成
            UPDATE SYS_NODE_INSTANCE NI
               SET NI.STATUS = '2', NI.FINISH_DATE = SYSDATE
             WHERE NI.ID = L_CUR.ID
               AND NI.STATUS = '1' --运行
               AND NI.SFYX_ST = V_VALID;
            --更新实例化的环节任务被撤回
            UPDATE SYS_TASK_INSTANCE TI
               SET TI.STATUS      = '7',
                   TI.IS_FINISH   = '1',
                   TI.OPINION     = '被撤回',
                   TI.FINISH_DATE = SYSDATE
             WHERE TI.NODE_INSTANCE_ID = L_CUR.ID
               AND TI.SFYX_ST = V_VALID;
            --结束环节
          ELSIF L_CUR.TYPE = '1' THEN
            SELECT WI.STATUS, WI.NODE_INSTANCE_ID
              INTO V_WF_INS_STATUS, V_NEST_NODE_INS_ID
              FROM SYS_WORKFLOW_INSTANCE WI
             WHERE WI.ID = L_CUR.WORKFLOW_INSTANCE_ID
               AND WI.SFYX_ST = '1';
            --完成
            IF V_WF_INS_STATUS = '0' THEN
              --手工启动
              IF V_WF_START_TYPE = '0' THEN
                OUT_STR := '流程已完成，不能撤回';
                RAISE ERR_TASK_RECOVER;
              ELSIF V_WF_START_TYPE = '1' THEN
                --嵌套启动
                SELECT NI.STATUS, NI.WORKFLOW_INSTANCE_ID
                  INTO V_NEST_NODE_INS_STATUS, V_MASTER_WF_INS_ID
                  FROM SYS_NODE_INSTANCE NI
                 WHERE NI.ID = V_NEST_NODE_INS_ID
                   AND NI.SFYX_ST = '1';
                IF V_NEST_NODE_INS_STATUS = '2' THEN
                  UPDATE SYS_NODE_INSTANCE NI
                     SET NI.STATUS      = '1', --运行
                         NI.FINISH_DATE = NULL
                   WHERE NI.ID = V_NEST_NODE_INS_ID;
                  --加入下次循环
                  PKG_UTIL.P_TAB_PUSH(V_LOOP_TAB_NODE, V_NEST_NODE_INS_ID);
                END IF;
                --更新流程状态为运行
                UPDATE SYS_WORKFLOW_INSTANCE WI
                   SET WI.STATUS      = '2', --运行
                       WI.FINISH_DATE = NULL
                 WHERE WI.ID = L_CUR.WORKFLOW_INSTANCE_ID
                   AND WI.SFYX_ST = '1';
              END IF;
            END IF;
          END IF;
        END LOOP;
      END LOOP;
      --找出原办理人
      SELECT WM_CONCAT(TI.USER_ID)
        INTO V_USER_IDS
        FROM SYS_TASK_INSTANCE TI
       WHERE TI.NODE_INSTANCE_ID = V_TASK_RECORD.NODE_INSTANCE_ID
         AND TI.SFYX_ST = V_VALID;
      --重新实例化该环节
      PKG_WF.P_WORKFLOW_INSTANCE_NODE(V_NODE_ID,
                                      V_USER_IDS,
                                      V_TASK_RECORD.WORKFLOW_INSTANCE_ID,
                                      V_ACTION_RECOVER || ',' ||
                                      V_TASK_RECORD.NODE_INSTANCE_ID,
                                      OUT_STR,
                                      OUT_ERROR);
      IF OUT_STR IS NOT NULL THEN
        RAISE ERR_TASK_RECOVER;
      END IF;
    END IF;
    --记录撤回操作记录
    PKG_TASK.P_LOG_TASK(IN_TASK_ID, 'RECOVER');
    OUT_STR := V_RECOVER_SUCCESS;
  EXCEPTION
    WHEN ERR_TASK_RECOVER THEN
      OUT_ERROR := '撤回任务时出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '撤回任务时出现' || SQLERRM;
  END P_TASK_RECOVER;

  --任务转办
  PROCEDURE P_TASK_TRANSFER(IN_TASK_ID INTEGER, --任务ID
                            IN_USER_ID INTEGER, --新办理人
                            OUT_STR    OUT VARCHAR2, --执行正常返回信息
                            OUT_ERROR  OUT VARCHAR2) --程序执行结果
   AS
    V_TASK_ID INTEGER;
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --更新任务状态为已办，动作为转办，已完成，完成日期
    UPDATE SYS_TASK_INSTANCE TI
       SET TI.STATUS      = '2', --已办
           TI.ACTION      = '6', --转办
           TI.IS_FINISH   = '1', --完成
           TI.FINISH_DATE = SYSDATE
     WHERE TI.ID = IN_TASK_ID
       AND TI.SFYX_ST = V_VALID;
    --生成新办理人的任务
    SELECT SEQ_SYS_TASK_INSTANCE.NEXTVAL INTO V_TASK_ID FROM DUAL;
    INSERT INTO SYS_TASK_INSTANCE
      (ID,
       USER_ID,
       NODE_INSTANCE_ID,
       WORKFLOW_INSTANCE_ID,
       STATUS,
       ACTION,
       OPINION,
       BRANCH,
       IS_FINISH,
       CJSJ,
       ACCEPT_DATE,
       FINISH_DATE,
       FJ_ID,
       IS_WBRW,
       FORMER_USER_ID,
       SFYX_ST)
      SELECT V_TASK_ID,
             IN_USER_ID,
             TI.NODE_INSTANCE_ID,
             TI.WORKFLOW_INSTANCE_ID,
             '0',
             '1',
             '',
             '',
             '0',
             SYSDATE,
             NULL,
             NULL,
             TI.FJ_ID,
             '0',
             NULL,
             V_VALID
        FROM SYS_TASK_INSTANCE TI
       WHERE TI.ID = IN_TASK_ID
         AND TI.SFYX_ST = V_VALID;
    INSERT INTO SYS_TASK_PAGE_INSTANCE
      (ID,
       TASK_INSTANCE_ID,
       WORKFLOW_PAGE_ID,
       DATA_ID,
       TMP_DATA_JSON,
       CJSJ,
       SFYX_ST,
       XGSJ,
       NODE_PAGE_ID,
       PAGE_ID,
       TASK_PAGE_OPINION,
       IF_OPINION_SHOW)
      SELECT SEQ_SYS_TASK_PAGE_INSTANCE.NEXTVAL,
             V_TASK_ID,
             TPI.WORKFLOW_PAGE_ID,
             TPI.DATA_ID,
             TPI.TMP_DATA_JSON,
             SYSDATE,
             V_VALID,
             SYSDATE,
             TPI.NODE_PAGE_ID,
             TPI.PAGE_ID,
             TPI.TASK_PAGE_OPINION,
             TPI.IF_OPINION_SHOW
        FROM SYS_TASK_PAGE_INSTANCE TPI
       WHERE TPI.TASK_INSTANCE_ID = IN_TASK_ID
         AND TPI.SFYX_ST = V_VALID;
    --记录转办操作记录
    PKG_TASK.P_LOG_TASK(IN_TASK_ID, 'RECOVER');
    OUT_STR := V_TRANSFER_SUCCESS;
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := '转办任务时出现' || SQLERRM;
  END P_TASK_TRANSFER;

  --重建TASK任务
  PROCEDURE P_REBUILD_TASK(IN_TASK_ID NUMBER, --撤回任务实例ID
                           OUT_ERROR  OUT VARCHAR2) --返回程序执行情况
   AS
    V_TASK_ID INTEGER;
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --获取新任务号
    SELECT SEQ_SYS_TASK_INSTANCE.NEXTVAL INTO V_TASK_ID FROM DUAL;
    --插入任务
    INSERT INTO SYS_TASK_INSTANCE
      (ID,
       USER_ID,
       NODE_INSTANCE_ID,
       WORKFLOW_INSTANCE_ID,
       STATUS,
       ACTION,
       OPINION,
       BRANCH,
       IS_FINISH,
       CJSJ,
       ACCEPT_DATE,
       FINISH_DATE,
       FJ_ID,
       SFYX_ST,
       IS_WBRW,
       FORMER_USER_ID)
      SELECT V_TASK_ID,
             S.USER_ID,
             S.NODE_INSTANCE_ID,
             S.WORKFLOW_INSTANCE_ID,
             '0', --待办
             '1', --无动作
             '',
             S.BRANCH,
             '0', --未完成
             SYSDATE,
             SYSDATE,
             NULL,
             S.FJ_ID,
             V_VALID,
             S.IS_WBRW,
             S.FORMER_USER_ID
        FROM SYS_TASK_INSTANCE S
       WHERE S.ID = IN_TASK_ID
         AND S.SFYX_ST = V_VALID;
    --插入任务关联表单
    INSERT INTO SYS_TASK_PAGE_INSTANCE
      (ID,
       TASK_INSTANCE_ID,
       WORKFLOW_PAGE_ID,
       DATA_ID,
       TMP_DATA_JSON,
       CJSJ,
       SFYX_ST,
       XGSJ,
       NODE_PAGE_ID,
       PAGE_ID)
      SELECT SEQ_SYS_TASK_PAGE_INSTANCE.NEXTVAL,
             V_TASK_ID,
             WP.ID,
             NULL,
             NULL,
             SYSDATE,
             V_VALID,
             SYSDATE,
             NP.ID,
             NP.PAGE_ID
        FROM SYS_TASK_INSTANCE     TI,
             SYS_NODE_INSTANCE     NI,
             SYS_NODE_PAGE         NP,
             SYS_WORKFLOW_PAGE     WP,
             SYS_WORKFLOW_INSTANCE WI
       WHERE TI.ID = V_TASK_ID
         AND TI.NODE_INSTANCE_ID = NI.ID
         AND TI.WORKFLOW_INSTANCE_ID = WI.ID
         AND WI.WORKFLOW_ID = WP.WORKFLOW_ID
         AND NI.NODE_ID = NP.NODE_ID
         AND WP.PAGE_ID = NP.PAGE_ID
         AND TI.SFYX_ST = V_VALID
         AND NI.SFYX_ST = V_VALID
         AND WI.SFYX_ST = V_VALID
         AND NP.SFYX_ST = V_VALID
         AND WP.SFYX_ST = V_VALID;
    --异常部分
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := '重建任务时出现' || SQLERRM;
  END P_REBUILD_TASK;

  --内置按钮是否显示（提交、退回、草稿、删除、撤回）
  PROCEDURE P_BUTTON_IFSHOW(IN_TASK_ID INTEGER, --当前任务
                            IN_NODE_ID INTEGER, --当前环节,可能任务为空
                            IN_USER_ID INTEGER, --当前登录用户
                            OUT_STR    OUT VARCHAR2, --返回值
                            OUT_ERROR  OUT VARCHAR2) --程序运行结果
   AS
    V_SFXSTJ           SYS_NODE.SFXSTJ%TYPE; --是否显示提交
    V_SFXSCG           SYS_NODE.SFXSCG%TYPE; --是否显示草稿
    V_SFXSCB           SYS_NODE.SFXSCB%TYPE; --是否显示催办
    V_TASK             SYS_TASK_INSTANCE%ROWTYPE; --任务记录行
    V_WF_INS           SYS_WORKFLOW_INSTANCE%ROWTYPE; --流程实例记录行
    V_WF_INS_STATUS    CHAR(1); --流程状态
    V_NEST_NODE_INS_ID INTEGER; --嵌套环节实例ID
    V_NODE_INS_STATUS  CHAR(1); --环节实例状态
    V_COUNT            INTEGER; --临时计数
    V_LOOP_TAB_NODE    TAB_INT;
    V_LOOP_NODE_IDS    VARCHAR2(4000);
    TYPE TAB_BUTTON IS TABLE OF CHAR(1) INDEX BY VARCHAR2(10);
    V_TAB_BTN TAB_BUTTON;
    ERR_BUTTON_SHOW EXCEPTION;
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --任务ID为空
    IF IN_TASK_ID IS NULL THEN
      IF IN_NODE_ID IS NULL THEN
        OUT_STR := '任务ID和环节ID为空，无法判断';
        RAISE ERR_BUTTON_SHOW;
      END IF;
      --查询环节配置
      SELECT N.SFXSTJ, N.SFXSCG
        INTO V_SFXSTJ, V_SFXSCG
        FROM SYS_NODE N
       WHERE N.ID = IN_NODE_ID
         AND N.SFYX_ST = '1';
      V_TAB_BTN('submit') := NVL(V_SFXSTJ, '0');
      V_TAB_BTN('draft') := NVL(V_SFXSCG, '0');
    ELSE
      SELECT TI.*
        INTO V_TASK
        FROM SYS_TASK_INSTANCE TI
       WHERE TI.ID = IN_TASK_ID
         AND TI.SFYX_ST = '1';
      SELECT WI.*
        INTO V_WF_INS
        FROM SYS_WORKFLOW_INSTANCE WI
       WHERE WI.ID = V_TASK.WORKFLOW_INSTANCE_ID
         AND WI.SFYX_ST = '1';
      --当前用户必须为任务办理人且流程未完成
      IF V_TASK.USER_ID = IN_USER_ID AND
         PKG_WF.F_WF_CHECK_IS_FINISH(V_WF_INS.ID) = '0' THEN
        --查询环节配置
        SELECT N.SFXSTJ, N.SFXSCG, N.SFXSCB
          INTO V_SFXSTJ, V_SFXSCG, V_SFXSCB
          FROM SYS_NODE N
         WHERE N.ID = IN_NODE_ID
           AND N.SFYX_ST = '1';
        --当任务是待办或者在办且配置了提交则可以提交
        IF V_TASK.STATUS IN ('0', '1') AND V_SFXSTJ = '1' THEN
          V_TAB_BTN('submit') := '1';
        END IF;
        --当流程未提交则可以删除
        IF V_WF_INS.STATUS = '5' THEN
          V_TAB_BTN('del') := '1';
        END IF;
        --当任务是待办或者在办且配置了草稿则显示草稿
        IF V_TASK.STATUS IN ('0', '1') AND V_SFXSCG = '1' THEN
          V_TAB_BTN('draft') := '1';
        END IF;
        --当任务已完成且配置了催办则显示催办
        IF V_TASK.IS_FINISH = '1' AND V_SFXSCB = '1' THEN
          V_TAB_BTN('press') := '1';
        END IF;
        ---------退回-------------
        --任务在办或者待办
        IF V_TASK.STATUS IN ('0', '1') THEN
          V_TAB_BTN('refuse') := '1';
          --手动启动的
          IF V_WF_INS.STARTUP_TYPE = '0' THEN
            --查找结构在当前环节之前的环节实例个数
            SELECT COUNT(1)
              INTO V_COUNT
              FROM SYS_NODE_INSTANCE NI
             WHERE NI.WORKFLOW_INSTANCE_ID = V_WF_INS.ID
               AND NI.NODE_ID IN
                   (SELECT N.ID
                      FROM SYS_ROUTER R
                     INNER JOIN SYS_NODE N
                        ON R.START_NODE_ID = N.ID
                       AND N.SFYX_ST = '1'
                     WHERE N.TYPE IN ('2', '5')
                     START WITH R.END_NODE_ID = IN_NODE_ID
                    CONNECT BY PRIOR R.START_NODE_ID = R.END_NODE_ID
                           AND R.SFYX_ST = '1');
            --若不存在则无退回环节了
            IF V_COUNT = 0 THEN
              V_TAB_BTN('refuse') := '0';
            END IF;
          END IF;
        END IF;
        ---------撤回-------------
        --当前任务为已办
        IF V_TASK.STATUS = '2' THEN
          V_TAB_BTN('cancel') := '1';
          --查询当前环节状态
          SELECT NI.STATUS
            INTO V_NODE_INS_STATUS
            FROM SYS_NODE_INSTANCE NI
           WHERE NI.ID = V_TASK.NODE_INSTANCE_ID
             AND NI.SFYX_ST = '1';
          --完成
          IF V_NODE_INS_STATUS = '2' THEN
            --检查该环节是否有其他人办理过
            SELECT COUNT(1)
              INTO V_COUNT
              FROM SYS_TASK_INSTANCE T
             WHERE T.WORKFLOW_INSTANCE_ID = V_WF_INS.ID
               AND T.SFYX_ST = V_VALID
               AND T.STATUS = '2' --已办
               AND T.ACTION = '3' --提交
               AND T.IS_FINISH = '1' --完成
               AND T.NODE_INSTANCE_ID = V_TASK.NODE_INSTANCE_ID
               AND T.USER_ID <> IN_USER_ID;
            IF V_COUNT > 0 THEN
              V_TAB_BTN('cancel') := '0';
            ELSE
              PKG_UTIL.P_TAB_PUSH(V_LOOP_TAB_NODE, V_TASK.NODE_INSTANCE_ID);
              LOOP
                EXIT WHEN V_LOOP_TAB_NODE.COUNT = 0;
                SELECT WM_CONCAT(COLUMN_VALUE)
                  INTO V_LOOP_NODE_IDS
                  FROM TABLE(V_LOOP_TAB_NODE);
                V_LOOP_TAB_NODE.DELETE;
                --完成
                FOR L_CUR IN (SELECT NI.ID, N.TYPE, NI.WORKFLOW_INSTANCE_ID
                                FROM SYS_NODE_INSTANCE NI, SYS_NODE N
                               WHERE NI.FROM_NODE_INS_ID IN
                                     (V_LOOP_NODE_IDS)
                                 AND NI.NODE_ID = N.ID
                                 AND (NI.STATUS = '1' OR N.TYPE = '1')
                                 AND N.SFYX_ST = '1'
                                 AND NI.SFYX_ST = '1') LOOP
                  --嵌套环节
                  IF L_CUR.TYPE = '5' THEN
                    SELECT COUNT(1)
                      INTO V_COUNT
                      FROM SYS_TASK_INSTANCE TI
                     WHERE TI.WORKFLOW_INSTANCE_ID IN
                           (SELECT WI.ID
                              FROM SYS_WORKFLOW_INSTANCE WI
                             WHERE WI.NODE_INSTANCE_ID = L_CUR.ID
                               AND WI.SFYX_ST = '1')
                       AND TI.ACTION <> '1' --无动作
                       AND TI.SFYX_ST = '1';
                    IF V_COUNT > 0 THEN
                      V_TAB_BTN('cancel') := '0';
                    END IF;
                  ELSIF L_CUR.TYPE = '2' THEN
                    --活动环节
                    SELECT COUNT(1)
                      INTO V_COUNT
                      FROM SYS_TASK_INSTANCE TI
                     WHERE TI.NODE_INSTANCE_ID = L_CUR.ID
                       AND TI.ACTION <> '1'
                       AND TI.SFYX_ST = '1';
                    IF V_COUNT > 0 THEN
                      V_TAB_BTN('cancel') := '0';
                    END IF;
                  ELSIF L_CUR.TYPE = '1' THEN
                    --结束环节
                    SELECT WI.STATUS, WI.NODE_INSTANCE_ID
                      INTO V_WF_INS_STATUS, V_NEST_NODE_INS_ID
                      FROM SYS_WORKFLOW_INSTANCE WI
                     WHERE WI.ID = L_CUR.WORKFLOW_INSTANCE_ID
                       AND WI.SFYX_ST = '1';
                    --若已完成
                    IF V_WF_INS_STATUS = '0' AND
                       V_NEST_NODE_INS_ID IS NOT NULL THEN
                      --加入下次循环
                      PKG_UTIL.P_TAB_PUSH(V_LOOP_TAB_NODE,
                                          V_NEST_NODE_INS_ID);
                    END IF;
                  END IF;
                END LOOP;
              END LOOP;
            END IF;
          END IF;
        END IF;
      END IF;
    END IF;
    --构造输出字符串
    FOR L_CUR IN (SELECT *
                    FROM TABLE(SPLITSTR('submit,draft,del,press,cancel,refuse',
                                        ','))) LOOP
      OUT_STR := OUT_STR || L_CUR.COLUMN_VALUE || ':' || (CASE
                   WHEN V_TAB_BTN.EXISTS(L_CUR.COLUMN_VALUE) THEN
                    V_TAB_BTN(L_CUR.COLUMN_VALUE)
                   ELSE
                    '0'
                 END) || ',';
    END LOOP;
    --去除最后一个逗号
    OUT_STR := SUBSTR(OUT_STR, 1, LENGTH(OUT_STR) - 1);
  EXCEPTION
    WHEN ERR_BUTTON_SHOW THEN
      OUT_ERROR := '获取按钮是否显示出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '获取按钮是否显示出现' || SQLERRM;
  END P_BUTTON_IFSHOW;

  --产生消息、清理消息
  PROCEDURE P_PRODUCE_MESSAGE(IN_TASK_ID INTEGER, --任务ID
                              IN_ACTION  CHAR) --操作类型 2、签收  3、提交  4、退回  5、撤回  6、转办
   AS
    V_COUNT           INTEGER;
    V_USER_ID         INTEGER;
    V_WF_INS_ID       INTEGER;
    V_MESSAGE_ID      INTEGER;
    V_NODE_INS_ID     INTEGER;
    V_WF_INS_TITLE    VARCHAR2(200);
    V_WF_NAME         VARCHAR2(200);
    V_TITLE           VARCHAR2(200);
    V_CONTENT         VARCHAR2(200);
    V_USER_NAME       VARCHAR2(100);
    V_TODO_USERS      VARCHAR2(200);
    V_TODO_TASKS      VARCHAR2(200);
    V_ACTION          CHAR(1);
    V_NODE_INS_STATUS CHAR(1);
    V_TRANSACT_TYPE   CHAR(1);
  BEGIN
    IF IN_ACTION <> '2' THEN
      --1.产生新消息
      --查找任务办理人、流程实例ID、流程实例标题、流程名称
      SELECT TI.USER_ID, TI.ACTION, WI.ID, WI.TITLE, W.NAME
        INTO V_USER_ID, V_ACTION, V_WF_INS_ID, V_WF_INS_TITLE, V_WF_NAME
        FROM SYS_TASK_INSTANCE TI, SYS_WORKFLOW_INSTANCE WI, SYS_WORKFLOW W
       WHERE TI.ID = IN_TASK_ID
         AND TI.WORKFLOW_INSTANCE_ID = WI.ID
         AND WI.WORKFLOW_ID = W.ID
         AND TI.SFYX_ST = V_VALID
         AND WI.SFYX_ST = V_VALID
         AND W.SFYX_ST = V_VALID;
      --查找任务办理人姓名
      SELECT USER_NAME
        INTO V_USER_NAME
        FROM SYS_USER
       WHERE ID = V_USER_ID
         AND SFYX_ST = V_VALID;
      --办理动作:1、无动作  2、签收  3、提交  4、退回  5、撤回  6、转办
      --查找当前流程实例下所有待办任务、待办人
      SELECT WM_CONCAT(TI.ID), WM_CONCAT(TI.USER_ID)
        INTO V_TODO_TASKS, V_TODO_USERS
        FROM SYS_TASK_INSTANCE TI
       WHERE TI.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
         AND TI.IS_FINISH = '0'
         AND TI.SFYX_ST = V_VALID;
      --拼接消息标题、内容
      V_TITLE   := '[' || V_WF_NAME || ']消息';
      V_CONTENT := V_USER_NAME || (CASE V_ACTION
                     WHEN '2' THEN
                      '签收'
                     WHEN '3' THEN
                      '提交'
                     WHEN '4' THEN
                      '退回'
                     WHEN '5' THEN
                      '撤回'
                     WHEN '6' THEN
                      '转办'
                   END) || V_WF_INS_TITLE || ',请及时办理';
      SELECT SEQ_SYS_MESSAGE.NEXTVAL INTO V_MESSAGE_ID FROM DUAL;
      --插入消息
      INSERT INTO SYS_MESSAGE
        (ID, TITLE, CONTENT, SOURCE, TYPE_CODE, PARAM, SFYX_ST)
      VALUES
        (V_MESSAGE_ID, V_TITLE, V_CONTENT, NULL, 'WORKFLOW', NULL, V_VALID);
      --插入消息用户关联
      V_COUNT := 0;
      FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(V_TODO_USERS, ','))) LOOP
        V_COUNT := V_COUNT + 1;
        INSERT INTO SYS_GLB_MESSAGE_USER
          (ID,
           MESSAGE_ID,
           USER_ID,
           TASK_ID,
           STATUS,
           RECEIVE_TIME,
           DEAL_TIME,
           SFYX_ST)
        VALUES
          (SEQ_SYS_GLB_MESSAGE_USER.NEXTVAL,
           V_MESSAGE_ID,
           K.COLUMN_VALUE,
           RX_GETSTR(V_TODO_TASKS, V_COUNT),
           '1',
           SYSDATE,
           NULL,
           V_VALID);
      END LOOP;
      --2.清理旧消息
      SELECT NI.STATUS, NI.ID
        INTO V_NODE_INS_STATUS, V_NODE_INS_ID
        FROM SYS_TASK_INSTANCE TI, SYS_NODE_INSTANCE NI
       WHERE TI.NODE_INSTANCE_ID = NI.ID
         AND TI.SFYX_ST = V_VALID
         AND NI.SFYX_ST = V_VALID;
      UPDATE SYS_GLB_MESSAGE_USER GMU
         SET GMU.STATUS = '3'
       WHERE GMU.TASK_ID = IN_TASK_ID
         AND GMU.SFYX_ST = V_VALID;
      IF V_NODE_INS_STATUS = '2' THEN
        UPDATE SYS_GLB_MESSAGE_USER GMU
           SET GMU.STATUS = '3'
         WHERE GMU.TASK_ID IN (SELECT TI.ID
                                 FROM SYS_TASK_INSTANCE TI
                                WHERE TI.NODE_INSTANCE_ID = V_NODE_INS_ID
                                  AND TI.IS_FINISH = '0'
                                  AND TI.SFYX_ST = V_VALID)
           AND GMU.SFYX_ST = V_VALID;
      END IF;
    ELSE
      --签收
      UPDATE SYS_GLB_MESSAGE_USER GMU
         SET GMU.STATUS = '2'
       WHERE GMU.TASK_ID = IN_TASK_ID
         AND GMU.SFYX_ST = V_VALID;
      --查找办理方式/环节实例ID
      SELECT AN.TRANSACT_TYPE, NI.ID
        INTO V_TRANSACT_TYPE, V_NODE_INS_ID
        FROM SYS_TASK_INSTANCE TI,
             SYS_ACTIVITY_NODE AN,
             SYS_NODE_INSTANCE NI
       WHERE TI.ID = IN_TASK_ID
         AND NI.NODE_ID = AN.ID
         AND NI.ID = TI.NODE_INSTANCE_ID
         AND TI.SFYX_ST = V_VALID
         AND NI.SFYX_ST = V_VALID;
      --抢占式
      IF V_TRANSACT_TYPE = '0' THEN
        UPDATE SYS_GLB_MESSAGE_USER GMU
           SET GMU.STATUS = '4'
         WHERE GMU.TASK_ID IN (SELECT TI.ID
                                 FROM SYS_TASK_INSTANCE TI
                                WHERE TI.NODE_INSTANCE_ID = V_NODE_INS_ID
                                  AND TI.SFYX_ST = V_VALID)
           AND GMU.TASK_ID <> IN_TASK_ID;
      END IF;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
  END P_PRODUCE_MESSAGE;

  --记录任务操作记录
  PROCEDURE P_LOG_TASK(IN_TASK_ID INTEGER, IN_TASK_TYPE VARCHAR2) AS
    V_WF_ID       INTEGER;
    V_WF_INS_ID   INTEGER;
    V_USER_ID     INTEGER;
    V_NODE_INS_ID INTEGER; --环节实例ID
    V_NODE_GENRE  CHAR(1); --环节类型，0提交,1审批
  BEGIN
    --根据任务ID获取流程实例ID、流程ID和办理人
    SELECT W.ID, WI.ID, TI.USER_ID, TI.NODE_INSTANCE_ID
      INTO V_WF_ID, V_WF_INS_ID, V_USER_ID, V_NODE_INS_ID
      FROM SYS_WORKFLOW W, SYS_WORKFLOW_INSTANCE WI, SYS_TASK_INSTANCE TI
     WHERE W.ID = WI.WORKFLOW_ID
       AND TI.WORKFLOW_INSTANCE_ID = WI.ID
       AND TI.ID = IN_TASK_ID
       AND TI.SFYX_ST = '1'
       AND W.SFYX_ST = '1'
       AND WI.SFYX_ST = '1';
    --更新最新标识
    UPDATE SYS_WORKFLOW_OPERATION O
       SET O.IS_LASTEST = '0'
     WHERE O.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
       AND O.IS_LASTEST = '1';
    --更新流程操作最新标识
    UPDATE SYS_WORKFLOW_OPERATION O
       SET O.IS_LASTEST_OPERATION = '0'
     WHERE O.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
       AND O.OPERATION = IN_TASK_TYPE
       AND O.IS_LASTEST_OPERATION = '1';
    IF IN_TASK_TYPE = 'SUBMIT' THEN
      --查询环节类型
      SELECT AN.NODE_GENRE
        INTO V_NODE_GENRE
        FROM SYS_NODE_INSTANCE NI, SYS_NODE N, SYS_ACTIVITY_NODE AN
       WHERE NI.NODE_ID = N.ID
         AND NI.ID = V_NODE_INS_ID
         AND AN.ID = N.ID
         AND N.SFYX_ST = '1'
         AND NI.SFYX_ST = '1';
    END IF;
    --插入流程办理记录
    INSERT INTO SYS_WORKFLOW_OPERATION
      (ID,
       WORKFLOW_ID,
       WORKFLOW_INSTANCE_ID,
       TASK_ID,
       OPERATION,
       USER_ID,
       IS_LASTEST,
       IS_LASTEST_OPERATION,
       CJSJ)
    VALUES
      (SEQ_SYS_WORKFLOW_OPERATION.NEXTVAL,
       V_WF_ID,
       V_WF_INS_ID,
       IN_TASK_ID,
       (CASE WHEN V_NODE_GENRE = '1' THEN 'AGREE' ELSE IN_TASK_TYPE END),
       V_USER_ID,
       '1',
       '1',
       SYSDATE);
  END P_LOG_TASK;

END PKG_TASK;
/

prompt
prompt Creating package body PKG_TRANSACTOR
prompt ====================================
prompt
CREATE OR REPLACE PACKAGE BODY PKG_TRANSACTOR IS

  --计算环节办理人
  PROCEDURE P_CALC_TRANSACTOR(IN_WF_INS_ID       INTEGER, --流程实例ID
                              IN_NODE_ID         INTEGER, --要获取环节办理人的环节ID
                              IN_PRE_NODE_INS_ID INTEGER, --上一环节实例ID
                              IN_USER_ID         INTEGER) --当前用户ID
   AS
    V_CNT          INTEGER; --临时计数
    V_CONDITION_ID INTEGER; --限定条件ID
  BEGIN
    --清理用户临时表
    DELETE FROM TEMP_USER;
    SELECT COUNT(1)
      INTO V_CNT
      FROM SYS_NODE_TRANSACTOR NT
     WHERE NT.NODE_ID = IN_NODE_ID
       AND NT.SFYX_ST = '1';
    IF V_CNT = 0 THEN
      --若没配置则默认是流程启动人
      PKG_TRANSACTOR.P_WORKFLOW_START_USER(IN_WF_INS_ID);
    ELSE
      --遍历当前环节对应的办理人
      FOR L_CUR IN (SELECT TS.ID        SOURCE_ID, --来源ID
                           TS.TYPE      SOURCE_TYPE, --来源类型
                           WT.ID        TRANSACTOR_ID, --办理人ID
                           TS.HAS_EXTRA HAS_EXTRA --是否包含限定条件
                      FROM SYS_NODE                       N,
                           SYS_NODE_TRANSACTOR            NT,
                           SYS_WORKFLOW_TRANSACTOR        WT,
                           SYS_WORKFLOW_TRANSACTOR_SOURCE TS
                     WHERE N.ID = IN_NODE_ID
                       AND NT.NODE_ID = N.ID
                       AND WT.ID = NT.TRANSACTOR_ID
                       AND TS.TRANSACTOR_ID = WT.ID
                       AND N.SFYX_ST = '1'
                       AND NT.SFYX_ST = '1'
                       AND WT.SFYX_ST = '1'
                       AND TS.SFYX_ST = '1') LOOP
        --根据来源类型走不同分支
        CASE L_CUR.SOURCE_TYPE
          WHEN PKG_TRANSACTOR.ORIGIN_USER THEN
            --来源：指定用户
            INSERT INTO TEMP_USER
              SELECT U.ID
                FROM SYS_GLB_TRANSACTOR_SOURCE GTS, SYS_USER U
               WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                 AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_USER
                 AND GTS.OBJECT_ID = U.ID
                 AND GTS.SFYX_ST = '1'
                 AND U.SFYX_ST = '1';
          WHEN PKG_TRANSACTOR.ORIGIN_ORGAN THEN
            --来源：指定机构
            IF L_CUR.HAS_EXTRA = '1' THEN
              --含有角色限定条件
              INSERT INTO TEMP_USER
                SELECT DISTINCT U.ID
                  FROM SYS_GLB_TRANSACTOR_SOURCE GTS,
                       SYS_ORGAN                 O,
                       SYS_GLB_USER              GU,
                       SYS_USER                  U
                 WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                   AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_ORGAN --机构类型
                   AND GTS.OBJECT_ID = O.ID
                   AND GU.ORGAN_ID = O.ID
                   AND U.ID = GU.USER_ID
                   AND GTS.SFYX_ST = '1'
                   AND O.SFYX_ST = '1'
                   AND GU.SFYX_ST = '1'
                   AND U.SFYX_ST = '1'
                INTERSECT --取机构关联用户和角色关联用户的交集
                SELECT DISTINCT U.ID
                  FROM SYS_GLB_TRANSACTOR_SOURCE GTS,
                       SYS_ROLE                  R,
                       SYS_GLB_ROLE_USER         GR,
                       SYS_USER                  U
                 WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                   AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_ROLE --角色类型
                   AND GTS.OBJECT_ID = R.ID
                   AND R.ID = GR.ROLE_ID
                   AND GR.USER_ID = U.ID
                   AND GTS.SFYX_ST = '1'
                   AND R.SFYX_ST = '1'
                   AND U.SFYX_ST = '1';
            ELSE
              --不含有角色限定条件
              INSERT INTO TEMP_USER
                SELECT DISTINCT U.ID
                  FROM SYS_GLB_TRANSACTOR_SOURCE GTS,
                       SYS_ORGAN                 O,
                       SYS_GLB_USER              GU,
                       SYS_USER                  U
                 WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                   AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_ORGAN --机构类型
                   AND GTS.OBJECT_ID = O.ID
                   AND GU.ORGAN_ID = O.ID
                   AND U.ID = GU.USER_ID
                   AND GTS.SFYX_ST = '1'
                   AND O.SFYX_ST = '1'
                   AND GU.SFYX_ST = '1'
                   AND U.SFYX_ST = '1';
            END IF;
          WHEN PKG_TRANSACTOR.ORIGIN_ROLE THEN
            --来源：角色
            IF L_CUR.HAS_EXTRA = '1' AND IN_WF_INS_ID IS NOT NULL THEN
              --含有限定条件
              --查找限定条件ID
              SELECT GTS.OBJECT_ID
                INTO V_CONDITION_ID
                FROM SYS_GLB_TRANSACTOR_SOURCE GTS
               WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                 AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_CONDITION
                 AND GTS.SFYX_ST = '1'
                 AND ROWNUM = 1;
              --调用计算限定条件办理人过程
              PKG_TRANSACTOR.P_CALC_CONDITION_TRANSACTOR(V_CONDITION_ID,
                                                         IN_WF_INS_ID,
                                                         IN_PRE_NODE_INS_ID,
                                                         IN_USER_ID);
              INSERT INTO TEMP_USER
                SELECT DISTINCT TT.USER_ID
                  FROM TEMP_TRANSACTOR TT
                INTERSECT
                SELECT DISTINCT U.ID
                  FROM SYS_GLB_TRANSACTOR_SOURCE GTS,
                       SYS_ROLE                  R,
                       SYS_GLB_ROLE_USER         GR,
                       SYS_USER                  U
                 WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                   AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_ROLE --角色类型
                   AND GTS.OBJECT_ID = R.ID
                   AND R.ID = GR.ROLE_ID
                   AND GR.USER_ID = U.ID
                   AND GTS.SFYX_ST = '1'
                   AND R.SFYX_ST = '1'
                   AND U.SFYX_ST = '1';
            ELSE
              --不含限定条件
              INSERT INTO TEMP_USER
                SELECT DISTINCT U.ID
                  FROM SYS_GLB_TRANSACTOR_SOURCE GTS,
                       SYS_ROLE                  R,
                       SYS_GLB_ROLE_USER         GR,
                       SYS_USER                  U
                 WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                   AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_ROLE --角色类型
                   AND GTS.OBJECT_ID = R.ID
                   AND R.ID = GR.ROLE_ID
                   AND GR.USER_ID = U.ID
                   AND GTS.SFYX_ST = '1'
                   AND R.SFYX_ST = '1'
                   AND U.SFYX_ST = '1';
            END IF;
          WHEN PKG_TRANSACTOR.ORIGIN_CONDITION THEN
            --来源：限定条件
            --查找限定条件ID
            SELECT GTS.OBJECT_ID
              INTO V_CONDITION_ID
              FROM SYS_GLB_TRANSACTOR_SOURCE GTS
             WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
               AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_CONDITION
               AND GTS.SFYX_ST = '1'
               AND ROWNUM = 1;
            --调用计算限定条件办理人过程
            PKG_TRANSACTOR.P_CALC_CONDITION_TRANSACTOR(V_CONDITION_ID,
                                                       IN_WF_INS_ID,
                                                       IN_PRE_NODE_INS_ID,
                                                       IN_USER_ID);
            INSERT INTO TEMP_USER
              SELECT DISTINCT TT.USER_ID FROM TEMP_TRANSACTOR TT;
          WHEN PKG_TRANSACTOR.ORIGIN_CUSTOM THEN
            --来源：用户自定义
            FOR LL_CUR IN (SELECT R.ID RULE_ID
                             FROM SYS_GLB_TRANSACTOR_SOURCE GTS,
                                  SYS_BASE_RULE             R
                            WHERE GTS.SOURCE_ID = L_CUR.SOURCE_ID
                              AND GTS.OBJECT_TYPE = PKG_TRANSACTOR.TYPE_RULE
                              AND GTS.OBJECT_ID = R.ID
                              AND GTS.SFYX_ST = '1'
                              AND R.SFYX_ST = '1') LOOP
              --调用计算自定义规则办理人过程
              PKG_TRANSACTOR.P_CALC_CUSTOM_TRANSACTOR(LL_CUR.RULE_ID,
                                                      IN_WF_INS_ID);
            END LOOP;
          ELSE
            RAISE_APPLICATION_ERROR(-20007,
                                    '不支持类型为[' || L_CUR.SOURCE_TYPE ||
                                    ']的办理人来源');
        END CASE;
      END LOOP;
    END IF;
  END P_CALC_TRANSACTOR;

  --计算限定条件办理人
  PROCEDURE P_CALC_CONDITION_TRANSACTOR(IN_CONDITION_ID    INTEGER, --限定条件ID
                                        IN_WF_INS_ID       INTEGER, --流程实例ID
                                        IN_PRE_NODE_INS_ID INTEGER, --上一环节实例ID
                                        IN_USER_ID         INTEGER) --当前用户ID
   AS
    V_SQL                VARCHAR2(4000); --SQL语句
    V_START_USER_ID      INTEGER; --流程启动人
    V_TEMP_SQL           VARCHAR2(1000); --临时SQL
    V_SUPPORT_MULTIORGAN VARCHAR2(100); --是否支持多机构
    V_USER_CONDITION     SYS_NODE_ASSIGNEE_CONDITION.USER_CONDITION%TYPE; --用户限定
    V_ORGAN_CONDITION    SYS_NODE_ASSIGNEE_CONDITION.ORGAN_CONDITION%TYPE; --机构限定
    V_SELF_INCLUDED      SYS_NODE_ASSIGNEE_CONDITION.SELF_INCLUDED%TYPE; --是否包含限定用户
  BEGIN
    --获取用户限定、机构限定、是否包含限定用户
    SELECT AC.USER_CONDITION, AC.ORGAN_CONDITION, AC.SELF_INCLUDED
      INTO V_USER_CONDITION, V_ORGAN_CONDITION, V_SELF_INCLUDED
      FROM SYS_NODE_ASSIGNEE_CONDITION AC
     WHERE AC.ID = IN_CONDITION_ID
       AND AC.SFYX_ST = '1';
    --查询平台配置是支持多机构
    SELECT C.VALUE
      INTO V_SUPPORT_MULTIORGAN
      FROM SYS_CONFIG C
     WHERE C.CODE = 'supportMultiOrgan'
       AND C.SFYX_ST = '1';
    IF V_SUPPORT_MULTIORGAN = 'true' THEN
      --准备SQL
      V_SQL := 'INSERT INTO TEMP_TRANSACTOR ' ||
               'SELECT DISTINCT U.ID FROM SYS_USER U, SYS_ORGAN O, SYS_GLB_USER GU ' ||
               'WHERE U.ID = GU.USER_ID AND O.ID = GU.ORGAN_ID AND U.SFYX_ST = ''1'' ' ||
               'AND O.SFYX_ST = ''1'' AND GU.SFYX_ST = ''1'' ' ||
               'AND O.ID IN ';
    ELSE
      --准备SQL
      V_SQL := 'INSERT INTO TEMP_TRANSACTOR ' ||
               'SELECT DISTINCT U.ID FROM SYS_USER U, SYS_ORGAN O ' ||
               'WHERE U.DEFAULT_ORGAN_ID = O.ID AND U.SFYX_ST = ''1'' AND O.SFYX_ST = ''1'' ' ||
               'AND O.ID IN ';
    END IF;
    CASE V_ORGAN_CONDITION
      WHEN PKG_TRANSACTOR.RESTRICT_ORGAN_NON THEN
        --机构限制：无限制
        V_SQL := 'INSERT INTO TEMP_TRANSACTOR SELECT U.ID FROM SYS_USER U WHERE U.SFYX_ST = ''1'' ';
      WHEN PKG_TRANSACTOR.RESTRICT_ORGAN_BELONG THEN
        --机构限制：所属机构
        V_SQL := V_SQL || '(SELECT DISTINCT SO.ID
                      FROM SYS_ORGAN SO, ${USER_TABLE} SU
                     WHERE SO.ID = SU.${ORGAN_ID}
                       AND SU.${USER_ID} IN (:USER_IDS)
                       AND SO.SFYX_ST = ''1''
                       AND SU.SFYX_ST = ''1'')';
      WHEN PKG_TRANSACTOR.RESTRICT_ORGAN_PARENT THEN
        --机构限制：上级机构
        V_SQL := V_SQL || '(SELECT DISTINCT SO.PARENT_ORG
                      FROM SYS_ORGAN SO, ${USER_TABLE} SU
                     WHERE SU.${ORGAN_ID} = SO.ID
                       AND SU.${USER_ID} IN (:USER_IDS)
                       AND SU.SFYX_ST = ''1''
                       AND SO.SFYX_ST = ''1'')';
      WHEN PKG_TRANSACTOR.RESTRICT_ORGAN_DIRECT_CHILD THEN
        --机构限制：直接下级
        V_SQL := V_SQL || '(SELECT DISTINCT SO.ID
                      FROM SYS_ORGAN SO, ${USER_TABLE} SU
                     WHERE SU.${ORGAN_ID} = SO.PARENT_ORG
                       AND SU.${USER_ID} IN (:USER_IDS)
                       AND SU.SFYX_ST = ''1''
                       AND SO.SFYX_ST = ''1'')';
      WHEN PKG_TRANSACTOR.RESTRICT_ORGAN_ALL_CHILD THEN
        --机构限制：所有下级
        V_SQL := V_SQL ||
                 '(SELECT DISTINCT SO.ID
                      FROM SYS_ORGAN SO
                     WHERE SO.ID NOT IN (SELECT SU.${ORGAN_ID}
                                           FROM ${USER_TABLE} SU
                                          WHERE SU.${USER_ID} IN (:USER_IDS)
                                            AND SU.SFYX_ST = ''1'')
                     START WITH SO.ID IN (SELECT SU.${ORGAN_ID}
                                            FROM ${USER_TABLE} SU
                                           WHERE SU.${USER_ID} IN (:USER_IDS)
                                             AND SU.SFYX_ST = ''1'')
                            AND SO.SFYX_ST = ''1''
                    CONNECT BY NOCYCLE PRIOR SO.ID = SO.PARENT_ORG
                           AND SO.SFYX_ST = ''1'')';
      WHEN PKG_TRANSACTOR.RESTRICT_ORGAN_SIBLING THEN
        --机构限制：同级机构
        V_SQL := V_SQL || '(SELECT DISTINCT VO.ID
                  FROM SYS_ORGAN VO
                 WHERE VO.PARENT_ORG IN (SELECT DISTINCT SO.PARENT_ORG
                                           FROM SYS_ORGAN SO, ${USER_TABLE} SU
                                          WHERE SU.${ORGAN_ID} = SO.ID
                                            AND SU.${USER_ID} IN (:USER_IDS)
                                            AND SU.SFYX_ST = ''1''
                                            AND SO.SFYX_ST = ''1'')
                   AND VO.ID NOT IN (SELECT DISTINCT SO.ID
                                       FROM SYS_ORGAN SO, ${USER_TABLE} SU
                                      WHERE SO.ID = SU.${ORGAN_ID}
                                        AND SU.${USER_ID} IN (:USER_IDS)
                                        AND SO.SFYX_ST = ''1''
                                        AND SU.SFYX_ST = ''1'')
                  AND VO.SFYX_ST = ''1'')';
      ELSE
        RAISE_APPLICATION_ERROR(-20008,
                                '不支持类型为[' || V_ORGAN_CONDITION || ']机构限制条件');
    END CASE;
    IF V_SUPPORT_MULTIORGAN = 'true' THEN
      --支持多机构
      V_SQL := REPLACE(V_SQL, '${USER_ID}', 'USER_ID');
      V_SQL := REPLACE(V_SQL, '${USER_TABLE}', 'SYS_GLB_USER');
      V_SQL := REPLACE(V_SQL, '${ORGAN_ID}', 'ORGAN_ID');
    ELSE
      --不支持多机构，使用默认机构
      V_SQL := REPLACE(V_SQL, '${USER_ID}', 'ID');
      V_SQL := REPLACE(V_SQL, '${USER_TABLE}', 'SYS_USER');
      V_SQL := REPLACE(V_SQL, '${ORGAN_ID}', 'DEFAULT_ORGAN_ID');
    END IF;
    --不包含限定用户
    IF V_SELF_INCLUDED = '0' THEN
      V_SQL := V_SQL || ' AND U.ID NOT IN (:USER_IDS) ';
    END IF;
    --根据不同的限制条件分别处理
    IF V_USER_CONDITION = PKG_TRANSACTOR.RESTRICT_USER_START THEN
      --用户限制：流程启动人
      --查找流程启动人
      SELECT WI.STARTUP_USER_ID
        INTO V_START_USER_ID
        FROM SYS_WORKFLOW_INSTANCE WI, SYS_USER U
       WHERE WI.ID = IN_WF_INS_ID
         AND WI.STARTUP_USER_ID = U.ID
         AND WI.SFYX_ST = '1'
         AND (U.SFYX_ST = '1' OR U.SFYX_ST = '3');
      --替换:USER_IDS
      V_SQL := REPLACE(V_SQL, ':USER_IDS', V_START_USER_ID);
    ELSIF IN_PRE_NODE_INS_ID IS NOT NULL THEN
      --用户限制：上一环节办理人
      --查找上一环节提交办理人
      V_TEMP_SQL := 'SELECT T.USER_ID
                      FROM SYS_TASK_INSTANCE T, SYS_USER U
                     WHERE T.NODE_INSTANCE_ID = :IN_PRE_NODE_INS_ID
                       AND T.ACTION = ''3''
                       AND T.USER_ID = U.ID
                       AND (U.SFYX_ST = ''1'' OR U.SFYX_ST = ''3'')
                       AND T.SFYX_ST = ''1''';
      IF IN_USER_ID IS NOT NULL THEN
        V_TEMP_SQL := V_TEMP_SQL ||
                      ' UNION ALL SELECT :IN_USER_ID FROM DUAL';
        V_TEMP_SQL := REPLACE(V_TEMP_SQL, ':IN_USER_ID', IN_USER_ID);
      END IF;
      V_TEMP_SQL := REPLACE(V_TEMP_SQL,
                            ':IN_PRE_NODE_INS_ID',
                            IN_PRE_NODE_INS_ID);
      --替换:USER_IDS
      V_SQL := REPLACE(V_SQL, ':USER_IDS', V_TEMP_SQL);
    END IF;
    --清空办理人临时表
    DELETE FROM TEMP_TRANSACTOR;
    --执行
    EXECUTE IMMEDIATE V_SQL;
  END P_CALC_CONDITION_TRANSACTOR;

  --计算自定义规则办理人
  PROCEDURE P_CALC_CUSTOM_TRANSACTOR(IN_RULE_ID   INTEGER, --规则ID
                                     IN_WF_INS_ID INTEGER) --流程实例ID
   AS
    V_RULE_SXFS   SYS_BASE_RULE.SXFS%TYPE; --实现方式 1.SQL 2.PROCEDURE
    V_RULE_DETAIL SYS_BASE_RULE.RULE_DETAIL%TYPE; --规则内容
    V_DATA_ID     INTEGER; --业务数据ID
  BEGIN
    --获取规则的实现方式和内容
    SELECT BR.SXFS, BR.RULE_DETAIL
      INTO V_RULE_SXFS, V_RULE_DETAIL
      FROM SYS_BASE_RULE BR
     WHERE BR.ID = IN_RULE_ID
       AND BR.SFYX_ST = '1';
    --暂时只能支持SQL和PROCEDURE
    IF V_RULE_SXFS = '1' THEN
      --SQL
      BEGIN
        --查询业务数据ID
        SELECT WI.DATA_ID
          INTO V_DATA_ID
          FROM SYS_WORKFLOW_INSTANCE WI
         WHERE WI.ID = IN_WF_INS_ID
           AND WI.SFYX_ST = '1';
        --替换业务数据ID绑定变量
        V_RULE_DETAIL := REPLACE(UPPER(V_RULE_DETAIL),
                                 ':DATA_ID',
                                 V_DATA_ID);
        V_RULE_DETAIL := REPLACE(V_RULE_DETAIL, '<BR>', ' '); --替换换行
        EXECUTE IMMEDIATE 'INSERT INTO TEMP_USER ' || V_RULE_DETAIL;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE_APPLICATION_ERROR(-20009,
                                  '根据SQL规则[' || IN_RULE_ID || ']获取办理人异常:' ||
                                  SQLERRM);
      END;
    ELSIF V_RULE_SXFS = '2' THEN
      BEGIN
        --PROCEDURE
        EXECUTE IMMEDIATE 'CALL ' || V_RULE_DETAIL || '(:WF_INS_ID)'
          USING IN_WF_INS_ID;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE_APPLICATION_ERROR(-20010,
                                  '根据存储过程规则[' || IN_RULE_ID || ']获取办理人异常:' ||
                                  SQLERRM);
      END;
    ELSE
      RAISE_APPLICATION_ERROR(-20011,
                              '暂不支持实现方式为[' || V_RULE_SXFS || ']的规则[' ||
                              IN_RULE_ID || ']获取办理人');
    END IF;
  END P_CALC_CUSTOM_TRANSACTOR;

  --检查环节办理人是否包含某用户
  FUNCTION F_CHECK_BLR_CONTAINS_USER(IN_NODE_ID INTEGER,
                                     IN_USER_ID INTEGER) RETURN CHAR AS
    V_CNT       INTEGER; --临时计数
    V_NODE_TYPE SYS_NODE.TYPE%TYPE; --环节类型
    V_RESULT    CHAR(1); --0不包含1包含
  BEGIN
    SELECT N.TYPE
      INTO V_NODE_TYPE
      FROM SYS_NODE N
     WHERE N.ID = IN_NODE_ID
       AND N.SFYX_ST = '1';
    --若不是活动环节则直接返回否
    IF V_NODE_TYPE <> '2' THEN
      RETURN '0';
    END IF;
    SELECT COUNT(1)
      INTO V_CNT
      FROM SYS_NODE_TRANSACTOR NT
     WHERE NT.NODE_ID = IN_NODE_ID
       AND NT.SFYX_ST = '1';
    --没有配置办理人的时候默认所有人都是办理人
    IF V_CNT = 0 THEN
      RETURN '1';
    END IF;
    SELECT COUNT(1)
      INTO V_CNT
      FROM SYS_NODE_TRANSACTOR            NT,
           SYS_WORKFLOW_TRANSACTOR        T,
           SYS_WORKFLOW_TRANSACTOR_SOURCE TS
     WHERE NT.NODE_ID = IN_NODE_ID
       AND NT.TRANSACTOR_ID = T.ID
       AND T.ID = TS.TRANSACTOR_ID
       AND TS.TYPE IN ('4', '5')
       AND NT.SFYX_ST = '1'
       AND T.SFYX_ST = '1'
       AND TS.SFYX_ST = '1';
    IF V_CNT > 0 THEN
      --若配置了限定条件或者自定义规则来源办理人则默认返回包含
      V_RESULT := '1';
    ELSE
      --调用办理人计算过程
      PKG_TRANSACTOR.P_CALC_TRANSACTOR(NULL, IN_NODE_ID, NULL, NULL);
      SELECT COUNT(1)
        INTO V_CNT
        FROM TEMP_USER T
       WHERE T.USER_ID = IN_USER_ID;
      --若办理人结果表包含用户则返回是否则返回零
      V_RESULT := CASE
                    WHEN V_CNT = 0 THEN
                     '0'
                    ELSE
                     '1'
                  END;
      RETURN V_RESULT;
    END IF;
    RETURN V_RESULT;
  END F_CHECK_BLR_CONTAINS_USER;

  --查找流程启动人
  PROCEDURE P_WORKFLOW_START_USER(IN_WF_INS_ID INTEGER) ----流程实例ID
   AS
    V_WF_START_USER_ID INTEGER; --流程启动人ID
  BEGIN
    SELECT WI.STARTUP_USER_ID
      INTO V_WF_START_USER_ID
      FROM SYS_WORKFLOW_INSTANCE WI, SYS_USER U
     WHERE WI.ID = IN_WF_INS_ID
       AND WI.STARTUP_USER_ID = U.ID
       AND WI.SFYX_ST = '1'
       AND (U.SFYX_ST = '1' OR U.SFYX_ST = '3');
    INSERT INTO TEMP_USER VALUES (V_WF_START_USER_ID);
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20005,
                              '找不到流程[ID:' || IN_WF_INS_ID || ']启动人');
  END P_WORKFLOW_START_USER;

END PKG_TRANSACTOR;
/

prompt
prompt Creating package body PKG_UTIL
prompt ==============================
prompt
CREATE OR REPLACE PACKAGE BODY PKG_UTIL
/**
 * @desc: 工具包
 * @author: dingmx
 * @date: 2018/07/30
 */
 IS
  --全库搜索字符串
  PROCEDURE P_SEARCH_ALL(P_STR IN VARCHAR2) AS
    V_SQL     VARCHAR2(500);
    V_CURSOR  SYS_REFCURSOR;
    V_COL_VAL VARCHAR2(200);
  BEGIN
    IF P_STR IS NULL OR TRIM(P_STR) IS NULL THEN
      DBMS_OUTPUT.PUT_LINE('请输入查询字符串');
      RETURN;
    END IF;
    FOR L_CUR IN (SELECT T.TABLE_NAME FROM USER_TABLES T) LOOP
      FOR LL_CUR IN (SELECT C.COLUMN_NAME
                       FROM USER_TAB_COLUMNS C
                      WHERE C.TABLE_NAME = L_CUR.TABLE_NAME) LOOP
        BEGIN
          V_SQL := 'SELECT ' || LL_CUR.COLUMN_NAME || ' FROM ' ||
                   L_CUR.TABLE_NAME || ' WHERE ' || LL_CUR.COLUMN_NAME ||
                   ' LIKE ''%' || P_STR || '%''';
          OPEN V_CURSOR FOR V_SQL;
          LOOP
            FETCH V_CURSOR
              INTO V_COL_VAL;
            EXIT WHEN V_CURSOR%NOTFOUND;
            DBMS_OUTPUT.PUT_LINE('[' || L_CUR.TABLE_NAME || '][' ||
                                 LL_CUR.COLUMN_NAME || ']' || V_COL_VAL);
          END LOOP;
        EXCEPTION
          WHEN OTHERS THEN
            NULL;
        END;
      END LOOP;
    END LOOP;
  END P_SEARCH_ALL;

  --全库清理
  PROCEDURE P_CLEAR_ALL AS
  BEGIN
    --暂未实现
    NULL;
  END P_CLEAR_ALL;

  --重新编译无效对象
  PROCEDURE P_RECOMPILE_INVALID AS
  BEGIN
    FOR L_CUR IN (SELECT A.OBJECT_NAME, A.OBJECT_TYPE
                    FROM USER_OBJECTS A
                   WHERE A.STATUS = 'INVALID') LOOP
      BEGIN
        IF UPPER(L_CUR.OBJECT_TYPE) = 'PACKAGE BODY' THEN
          EXECUTE IMMEDIATE 'ALTER PACKAGE ' || L_CUR.OBJECT_NAME ||
                            ' COMPILE BODY';
        ELSE
          EXECUTE IMMEDIATE 'ALTER ' || L_CUR.OBJECT_TYPE || ' ' ||
                            L_CUR.OBJECT_NAME || ' COMPILE';
        END IF;
        DBMS_OUTPUT.PUT_LINE(L_CUR.OBJECT_TYPE || ':' || L_CUR.OBJECT_NAME ||
                             ' RECOMPLIED SUCCESSFULLY');
      EXCEPTION
        WHEN OTHERS THEN
          DBMS_OUTPUT.PUT_LINE(L_CUR.OBJECT_TYPE || ':' ||
                               L_CUR.OBJECT_NAME ||
                               ' RECOMPLIED UNSUCCESSFULLY');
      END;
    END LOOP;
  END P_RECOMPILE_INVALID;

  --创建序列
  PROCEDURE P_CREATE_SEQUENCE(IN_TAB_NAME IN VARCHAR2) --表名
   AS
    V_COUNT         INTEGER; --临时计数
    V_START_VALUE   INTEGER; --序列起始值
    V_SEQUENCE_NAME VARCHAR2(100); --序列名
  BEGIN
    IF IN_TAB_NAME IS NULL THEN
      RAISE_APPLICATION_ERROR(-20005, '表名为空');
    END IF;
    --获取序列名称
    V_SEQUENCE_NAME := PKG_UTIL.F_GET_SEQ_NAME(IN_TAB_NAME);
    SELECT COUNT(1)
      INTO V_COUNT
      FROM USER_SEQUENCES S
     WHERE S.SEQUENCE_NAME = V_SEQUENCE_NAME;
    IF V_COUNT = 0 THEN
      --获取序列起始值
      EXECUTE IMMEDIATE 'SELECT NVL(MAX(ID), 0) + 1 FROM ' || IN_TAB_NAME
        INTO V_START_VALUE;
      --创建序列
      EXECUTE IMMEDIATE 'CREATE SEQUENCE ' || V_SEQUENCE_NAME ||
                        ' INCREMENT BY 1 START WITH ' || V_START_VALUE;
    ELSE
      RAISE_APPLICATION_ERROR(-20006, V_SEQUENCE_NAME || '序列已存在');
    END IF;
  END P_CREATE_SEQUENCE;

  --根据表名获取序列名称
  FUNCTION F_GET_SEQ_NAME(IN_TAB_NAME IN VARCHAR2) RETURN VARCHAR2 AS
    V_SEQUENCE_NAME VARCHAR2(100); --序列名
  BEGIN
    V_SEQUENCE_NAME := 'SEQ_' || UPPER(IN_TAB_NAME);
    --若长度超过30截取前30位
    IF LENGTH(V_SEQUENCE_NAME) > 30 THEN
      V_SEQUENCE_NAME := SUBSTR(V_SEQUENCE_NAME, 0, 30);
    END IF;
    RETURN V_SEQUENCE_NAME;
  END F_GET_SEQ_NAME;

  --TAB_INT添加数据
  PROCEDURE P_TAB_PUSH(V_TAB_INT IN OUT TAB_INT, IN_VAL INTEGER) AS
  BEGIN
    IF V_TAB_INT IS NULL THEN
      V_TAB_INT := TAB_INT();
    END IF;
    V_TAB_INT.EXTEND(1);
    V_TAB_INT(V_TAB_INT.LAST) := IN_VAL;
  END P_TAB_PUSH;

  --TAB_STR添加数据
  PROCEDURE P_TAB_PUSH(V_TAB_STR IN OUT TAB_STR, IN_VAL VARCHAR2) AS
  BEGIN
    IF V_TAB_STR IS NULL THEN
      V_TAB_STR := TAB_STR();
    END IF;
    V_TAB_STR.EXTEND(1);
    V_TAB_STR(V_TAB_STR.LAST) := IN_VAL;
  END P_TAB_PUSH;

END PKG_UTIL;
/

prompt
prompt Creating package body PKG_VALIDATE
prompt ==================================
prompt
CREATE OR REPLACE PACKAGE BODY PKG_VALIDATE IS
  PROCEDURE USP_OBJECT_VALIDATE(IN_TABLE_NAME   VARCHAR2, --表物理名
                                IN_COLUMNS_NAME VARCHAR2, --字段物理名多个用逗号隔开
                                OUT_ERRWORD     OUT VARCHAR2, --返回验证的情况
                                OUT_ERROR       OUT VARCHAR2) --返回程序执行情况
    /*--------------------------------------*/
    ---名称/功能：对象和属性验证
    ---创建人：骆斌
    ---创建时间：2016.10.11
    ---修改人：
    ---修改时间：
    ---修改内容：
    /*--------------------------------------*/
   AS
    V_CT     NUMBER; --计数
    V_NUMBER NUMBER := 0; --计数
  BEGIN
    OUT_ERROR   := 'SUCCESS';
    OUT_ERRWORD := '';
    --验证表是否存在
    SELECT COUNT(1)
      INTO V_CT
      FROM USER_TAB_COLUMNS
     WHERE TABLE_NAME = UPPER(IN_TABLE_NAME);
    IF V_CT = 0 THEN
      OUT_ERRWORD := '数据库表' || UPPER(IN_TABLE_NAME) || '不存在';
    ELSE
      --验证对象属性是否存在
      FOR I IN (SELECT COLUMN_VALUE COLUMN_NAME
                  FROM TABLE(splitstr(IN_COLUMNS_NAME, ','))) LOOP
        SELECT COUNT(1)
          INTO V_CT
          FROM USER_TAB_COLUMNS
         WHERE TABLE_NAME = UPPER(IN_TABLE_NAME)
           AND COLUMN_NAME = UPPER(I.COLUMN_NAME);
        IF V_CT = 0 THEN
          V_NUMBER    := V_NUMBER + 1;
          OUT_ERRWORD := OUT_ERRWORD || ',' || UPPER(I.COLUMN_NAME);
        END IF;
      END LOOP;
      IF V_NUMBER > 0 THEN
        OUT_ERRWORD := '数据库表'||UPPER(IN_TABLE_NAME)||'存在，表中字段' || OUT_ERRWORD || '不存在';
      END IF;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      OUT_ERROR := SQLERRM;
  END USP_OBJECT_VALIDATE;
END PKG_VALIDATE;
/

prompt
prompt Creating package body PKG_WF
prompt ============================
prompt
CREATE OR REPLACE PACKAGE BODY PKG_WF IS

  V_VALID            CONSTANT CHAR(1) := '1'; --有效状态 有效
  V_SUCCESS_FLAG     CONSTANT VARCHAR2(10) := 'SUCCESS'; --程序运行成功标识
  V_START_SUCCESS    CONSTANT VARCHAR2(20) := '流程启动成功'; --流程启动成功提示信息
  V_ACTION_FIRST     CONSTANT VARCHAR2(10) := 'FIRST'; --启动流程，实例化第一环节
  V_ACTION_SUB_FIRST CONSTANT VARCHAR2(10) := 'SUB_FIRST'; --子流程启动启动流程，实例化第一环节
  V_ACTION_FINISH    CONSTANT VARCHAR2(10) := 'FINISH'; --子流程完成，嵌套下一环节实例化

  --功能：启动流程
  --创建人：lb
  --创建时间：2016.9
  PROCEDURE P_WORKFLOW_START(IN_WF_ID       INTEGER, --流程ID
                             IN_USER_ID     INTEGER, --流程发起人
                             IN_TYPE        INTEGER, --流程发起类型 0:人工 1:嵌套
                             IN_WF_VARS     VARCHAR2, --流程启动变量VAR1:VAL1;VAR2:VAL2
                             IN_NODE_INS_ID INTEGER, --嵌套环节实例ID
                             IN_DATAID      INTEGER, --业务数据ID
                             IN_TITLE       VARCHAR2, --流程实例标题
                             IN_SOURCE      VARCHAR2, --对象ID的集合
                             OUT_STR        OUT VARCHAR2, --返回信息
                             OUT_ERROR      OUT VARCHAR2) --返回程序执行情况
   AS
    V_NEXT_NODE INTEGER; --开始环节下一环节ID
    V_WF_INS_ID INTEGER; --流程实例ID
    V_WF_TITLE  VARCHAR2(200); --流程标题
    ERR_START_WORKFLOW EXCEPTION; --自定义异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --获取流程标题,嵌套启动取子流程名称
    V_WF_TITLE := IN_TITLE;
    IF IN_TYPE = '1' THEN
      SELECT W.NAME
        INTO V_WF_TITLE
        FROM SYS_WORKFLOW W
       WHERE W.ID = IN_WF_ID
         AND W.SFYX_ST = '1';
    END IF;
    --实例化流程，判断办理类型，如果是人工办理则插入人员ID，若嵌套则插入环节ID
    SELECT SEQ_SYS_WORKFLOW_INSTANCE.NEXTVAL INTO V_WF_INS_ID FROM DUAL;
    INSERT INTO SYS_WORKFLOW_INSTANCE
      (ID,
       WORKFLOW_ID,
       TITLE,
       INITIAL_VALUE,
       STATUS,
       STARTUP_USER_ID,
       DATA_ID,
       SOURCE_DATA,
       STARTUP_TYPE,
       NODE_INSTANCE_ID,
       CJSJ,
       SFYX_ST)
    VALUES
      (V_WF_INS_ID,
       IN_WF_ID,
       V_WF_TITLE,
       NULL,
       DECODE(IN_TYPE, '0', '5', '2'), --人工未提交否则运行
       IN_USER_ID,
       IN_DATAID,
       IN_SOURCE,
       TO_CHAR(IN_TYPE), --启动类型 0：人工  1：嵌套
       IN_NODE_INS_ID,
       SYSDATE,
       V_VALID);
    --流程变量初始化
    PKG_WF.P_WORKFLOW_VARIABLE_INSTANCE(IN_WF_ID, V_WF_INS_ID);
    --更新流程变量值
    FOR L_CUR IN (SELECT * FROM TABLE(SPLITSTR(IN_WF_VARS, ';'))) LOOP
      UPDATE SYS_WORKFLOW_VARIABLE_INSTANCE VI
         SET VI.VALUE = SUBSTR(L_CUR.COLUMN_VALUE,
                               INSTR(L_CUR.COLUMN_VALUE, ':') + 1)
       WHERE VI.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
         AND VI.VARIABLE_ID = (SELECT V.ID
                                 FROM SYS_WORKFLOW_VARIABLE V
                                WHERE V.WORKFLOW_ID = IN_WF_ID
                                  AND V.NAME =
                                      SUBSTR(L_CUR.COLUMN_VALUE,
                                             0,
                                             INSTR(L_CUR.COLUMN_VALUE, ':') - 1)
                                  AND V.SFYX_ST = '1'
                                  AND ROWNUM = 1)
         AND VI.SFYX_ST = '1';
    END LOOP;
    --调用函数获取第一活动节点
    V_NEXT_NODE := PKG_WF.F_WF_GET_FIRST_ACT_NODE(IN_WF_ID,
                                                  IN_WF_VARS,
                                                  IN_USER_ID);
    IF V_NEXT_NODE IS NULL THEN
      OUT_STR := '未找到开始环节后的活动环节';
    ELSE
      --调用环节实例化存储过程
      PKG_WF.P_WORKFLOW_INSTANCE_NODE(V_NEXT_NODE,
                                      IN_USER_ID,
                                      V_WF_INS_ID,
                                      (CASE IN_TYPE WHEN '0' THEN
                                       V_ACTION_FIRST ELSE
                                       V_ACTION_SUB_FIRST END) || ',' ||
                                      V_NEXT_NODE,
                                      OUT_STR,
                                      OUT_ERROR);
    END IF;
    --返回输出字符串
    IF OUT_STR IS NULL AND IN_TYPE = '0' THEN
      OUT_STR := V_START_SUCCESS || ',' || V_WF_INS_ID;
    ELSIF IN_TYPE = '1' AND OUT_STR NOT LIKE V_START_SUCCESS || '%' THEN
      RAISE ERR_START_WORKFLOW;
    END IF;
  EXCEPTION
    WHEN ERR_START_WORKFLOW THEN
      OUT_ERROR := '启动流程时出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '启动流程时出现' || SQLERRM;
  END P_WORKFLOW_START;

  --实例化环节
  PROCEDURE P_WORKFLOW_INSTANCE_NODE(IN_NODE_ID   INTEGER, --本环节ID
                                     IN_USER_IDS  VARCHAR2, --指定办理人IDS，用逗号分隔
                                     IN_WF_INS_ID INTEGER, --流程实例ID
                                     IN_FROM_INFO VARCHAR2, --来源信息 FIRST,NODE_ID OR ACTION,NODE_INS_ID
                                     OUT_STR      OUT VARCHAR2, --返回信息
                                     OUT_ERROR    OUT VARCHAR2) --返回程序执行情况
   AS
    V_NODE_INS_ID      INTEGER; --环节实例ID
    V_NODE_TYPE        SYS_NODE.TYPE%TYPE; --环节类型
    V_FROM_NODE_SORT   SYS_NODE.SORT%TYPE; --来源环节序号
    V_FROM_NODE_ID     INTEGER; --来源环节ID
    V_FROM_NODE_INS_ID INTEGER; --来源环节实例ID
    V_FROM_ACTION      VARCHAR2(10); --来源动作 FIRST,SUBMIT,BACK,RECOVER..
    V_COUNT            INTEGER; --临时计数
    V_SUB_WF_ID        INTEGER; --子流程ID
    ERR_INSTANCE_NODE EXCEPTION; --实例化异常
    ERR_START_SUB_WF  EXCEPTION; --启动子流程异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --获取该实例化环节类型
    SELECT N.TYPE
      INTO V_NODE_TYPE
      FROM SYS_NODE N
     WHERE N.ID = IN_NODE_ID
       AND N.SFYX_ST = '1';
    --环节类别：0开始环节 1结束环节 2活动环节 3传阅环节 4决策环节 5嵌套环节 6复合环节
    IF V_NODE_TYPE NOT IN ('1', '2', '5') THEN
      SELECT DECODE(V_NODE_TYPE,
                    '0',
                    '开始环节',
                    '3',
                    '传阅环节',
                    '4',
                    '决策环节',
                    '6',
                    '复合环节',
                    V_NODE_TYPE) || '不能实例化'
        INTO OUT_STR
        FROM DUAL;
      RAISE ERR_INSTANCE_NODE;
    END IF;
    --验证来源环节信息
    IF IN_FROM_INFO IS NULL OR INSTR(IN_FROM_INFO, ',') = 0 THEN
      OUT_STR := '实例化环节时获取来源环节信息不正确';
      RAISE ERR_INSTANCE_NODE;
    END IF;
    --获取来源动作
    V_FROM_ACTION := SUBSTR(IN_FROM_INFO, 1, INSTR(IN_FROM_INFO, ',') - 1);
    IF V_FROM_ACTION = 'FIRST' OR V_FROM_ACTION = 'SUB_FIRST' THEN
      V_FROM_NODE_ID := SUBSTR(IN_FROM_INFO, INSTR(IN_FROM_INFO, ',') + 1);
      SELECT N.SORT
        INTO V_FROM_NODE_SORT
        FROM SYS_NODE N
       WHERE N.ID = V_FROM_NODE_ID
         AND N.SFYX_ST = '1';
    ELSE
      V_FROM_NODE_INS_ID := SUBSTR(IN_FROM_INFO,
                                   INSTR(IN_FROM_INFO, ',') + 1);
      SELECT N.SORT
        INTO V_FROM_NODE_SORT
        FROM SYS_NODE_INSTANCE NI, SYS_NODE N
       WHERE NI.NODE_ID = N.ID
         AND NI.ID = V_FROM_NODE_INS_ID
         AND NI.SFYX_ST = '1'
         AND N.SFYX_ST = '1';
    END IF;
    --获取环节实例ID
    SELECT SEQ_SYS_NODE_INSTANCE.NEXTVAL INTO V_NODE_INS_ID FROM DUAL;
    --实例化环节
    INSERT INTO SYS_NODE_INSTANCE
      (ID,
       NODE_ID,
       WORKFLOW_INSTANCE_ID,
       STATUS,
       CJSJ,
       SFYX_ST,
       TYPE,
       FROM_NODE_SORT,
       FROM_NODE_INS_ID)
    VALUES
      (V_NODE_INS_ID,
       IN_NODE_ID,
       IN_WF_INS_ID,
       CASE WHEN V_NODE_TYPE = '1' THEN '2' ELSE '1' END, --结束环节实例化直接完成
       SYSDATE,
       V_VALID,
       V_FROM_ACTION,
       V_FROM_NODE_SORT,
       V_FROM_NODE_INS_ID);
    --若是嵌套环节的退回则结束
    IF V_NODE_TYPE = '5' AND V_FROM_ACTION = 'BACK' THEN
      RETURN;
    END IF;
    --清空办理人临时表
    DELETE FROM TEMP_USER;
    DELETE FROM TEMP_CONDUCT;
    --获取环节办理人
    IF IN_USER_IDS IS NOT NULL THEN
      INSERT INTO TEMP_USER T
        SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(IN_USER_IDS, ','));
    ELSE
      --调用过程获取办理人
      PKG_TRANSACTOR.P_CALC_TRANSACTOR(IN_WF_INS_ID,
                                       IN_NODE_ID,
                                       V_FROM_NODE_INS_ID,
                                       NULL);
    END IF;
    --验证办理人是否为空
    SELECT COUNT(1) INTO V_COUNT FROM TEMP_USER;
    IF V_COUNT = 0 THEN
      OUT_STR := '实例化环节时出现办理人为空';
      RAISE ERR_INSTANCE_NODE;
    END IF;
    --验证办理人是否找不到
    SELECT COUNT(1)
      INTO V_COUNT
      FROM TEMP_USER T
     WHERE NOT EXISTS (SELECT 1
              FROM SYS_USER U
             WHERE U.ID = T.USER_ID
               AND U.SFYX_ST <> '0');
    IF V_COUNT > 0 THEN
      SELECT '实例化环节时出现办理人[' || WM_CONCAT(CASE
                                           WHEN SU.USER_NAME IS NULL THEN
                                            TO_CHAR(SU.ID)
                                           ELSE
                                            SU.USER_NAME
                                         END) || ']找不到'
        INTO OUT_STR
        FROM SYS_USER SU
       WHERE SU.ID IN (SELECT T.USER_ID
                         FROM TEMP_USER T
                        WHERE NOT EXISTS (SELECT 1
                                 FROM SYS_USER U
                                WHERE U.ID = T.USER_ID
                                  AND U.SFYX_ST <> '0'));
      RAISE ERR_INSTANCE_NODE;
    END IF;
    --活动环节实例化初始化任务
    IF V_NODE_TYPE = '2' THEN
      --实例化任务
      INSERT INTO SYS_TASK_INSTANCE
        (ID,
         NODE_INSTANCE_ID,
         WORKFLOW_INSTANCE_ID,
         USER_ID,
         ACCEPT_DATE,
         CJSJ,
         FINISH_DATE,
         STATUS,
         ACTION,
         IS_FINISH,
         SFYX_ST,
         IS_WBRW)
        SELECT SEQ_SYS_TASK_INSTANCE.NEXTVAL,
               V_NODE_INS_ID,
               IN_WF_INS_ID,
               T.USER_ID,
               DECODE(V_FROM_ACTION, 'FIRST', SYSDATE, NULL) ACCEPT_DATE, --签收时间首次提交默认签收
               SYSDATE CJSJ,
               '' FINISH_DATE,
               DECODE(V_FROM_ACTION, 'FIRST', '1', '0') STATUS, --任务状态首次提交默认在办否则待办
               DECODE(V_FROM_ACTION, 'FIRST', '2', '1') ACTION, --动作首次提交默认签收否则无动作
               '0' IS_FINISH, --未完成
               V_VALID,
               '0' IS_WBRW --不是委办
          FROM TEMP_USER T;
      --实例化任务流程环节关系
      INSERT INTO SYS_TASK_PAGE_INSTANCE
        (ID,
         TASK_INSTANCE_ID,
         WORKFLOW_PAGE_ID,
         CJSJ,
         SFYX_ST,
         XGSJ,
         NODE_PAGE_ID,
         PAGE_ID)
        SELECT SEQ_SYS_TASK_PAGE_INSTANCE.NEXTVAL,
               TI.ID,
               WP.ID,
               SYSDATE,
               V_VALID,
               SYSDATE,
               NP.ID,
               NP.PAGE_ID
          FROM SYS_TASK_INSTANCE     TI,
               SYS_NODE_INSTANCE     NI,
               SYS_NODE_PAGE         NP,
               SYS_WORKFLOW_PAGE     WP,
               SYS_WORKFLOW_INSTANCE WI
         WHERE TI.NODE_INSTANCE_ID = NI.ID
           AND NI.ID = V_NODE_INS_ID
           AND TI.WORKFLOW_INSTANCE_ID = WI.ID
           AND WI.WORKFLOW_ID = WP.WORKFLOW_ID
           AND NI.NODE_ID = NP.NODE_ID
           AND WP.PAGE_ID = NP.PAGE_ID
           AND TI.SFYX_ST = V_VALID
           AND NI.SFYX_ST = V_VALID
           AND WI.SFYX_ST = V_VALID
           AND NP.SFYX_ST = V_VALID
           AND WP.SFYX_ST = V_VALID;
      --嵌套环节实例化启动子流程
    ELSIF V_NODE_TYPE = '5' THEN
      --查找嵌套环节关联的子流程(查询关联的code获取启用版本）
      SELECT W.ID
        INTO V_SUB_WF_ID
        FROM SYS_WORKFLOW W
       WHERE W.CODE = (SELECT N.WORKFLOW_CODE
                         FROM SYS_NESTED_NODE N
                        WHERE N.ID = IN_NODE_ID)
         AND W.STATUS = '1' --启用
         AND W.SFYX_ST = '1';
      --循环创建子流程
      FOR L_CUR IN (SELECT U.ID, U.USER_NAME
                      FROM TEMP_USER T, SYS_USER U
                     WHERE T.USER_ID = U.ID
                       AND U.SFYX_ST <> '0') LOOP
        --启动子流程
        PKG_WF.P_WORKFLOW_START(V_SUB_WF_ID,
                                L_CUR.ID,
                                '1',
                                '',
                                V_NODE_INS_ID,
                                '',
                                '',
                                '',
                                OUT_STR,
                                OUT_ERROR);
        IF OUT_ERROR <> V_SUCCESS_FLAG THEN
          OUT_STR := '启动子流程[启动人:' || L_CUR.USER_NAME || ']出现' || OUT_STR;
          RAISE ERR_START_SUB_WF;
        END IF;
      END LOOP;
    END IF;
  EXCEPTION
    WHEN ERR_START_SUB_WF THEN
      OUT_ERROR := OUT_STR;
    WHEN ERR_INSTANCE_NODE THEN
      OUT_ERROR := '环节实例化时出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '环节实例化时出现' || SQLERRM;
  END P_WORKFLOW_INSTANCE_NODE;

  --查找下一环节
  PROCEDURE P_WORKFLOW_NEXT_NODE(IN_NODE_ID   INTEGER, --环节ID
                                 IN_DECISION  VARCHAR2, --决策条件
                                 IN_WF_INS_ID INTEGER, --流程实例ID
                                 OUT_CUR      OUT SYS_REFCURSOR, --返回下一环节的ID，NAME集合
                                 OUT_STR      OUT VARCHAR2, --返回信息
                                 OUT_ERROR    OUT VARCHAR2) --返回程序执行情况
   AS
    V_TAB_NODE      TAB_INT;
    V_NEXT_NODE_TAB TAB_INT;
    ERR_NEXT_NODE EXCEPTION; --获取下一环节异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --获取下一环节可实例化环节ID
    V_TAB_NODE := PKG_WF.F_WF_NEXT_INSTANCE_NODE(IN_NODE_ID,
                                                 IN_DECISION,
                                                 IN_WF_INS_ID);
    IF V_TAB_NODE.COUNT = 0 THEN
      OUT_STR := '获取下一环节为空';
      RAISE ERR_NEXT_NODE;
    END IF;
    FOR L_CUR IN (SELECT N.ID, N.TYPE
                    FROM TABLE(V_TAB_NODE) T, SYS_NODE N
                   WHERE T.COLUMN_VALUE = N.ID
                     AND N.SFYX_ST = '1') LOOP
      IF L_CUR.TYPE = '1' THEN
        IF V_TAB_NODE.COUNT = 1 THEN
          OPEN OUT_CUR FOR
            SELECT NULL FROM DUAL;
          OUT_STR := '下一环节为结束环节，取出空值';
          RETURN;
        END IF;
      ELSE
        PKG_UTIL.P_TAB_PUSH(V_NEXT_NODE_TAB, L_CUR.ID);
      END IF;
    END LOOP;
    --返回游标
    OPEN OUT_CUR FOR
      SELECT N.ID, N.NAME
        FROM TABLE(V_NEXT_NODE_TAB) T, SYS_NODE N
       WHERE T.COLUMN_VALUE = N.ID
         AND N.SFYX_ST = '1';
  EXCEPTION
    WHEN ERR_NEXT_NODE THEN
      OUT_ERROR := '查找下一活动环节出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '查找下一活动环节异常' || SQLERRM;
  END P_WORKFLOW_NEXT_NODE;

  --删除流程(逻辑删除)
  PROCEDURE P_WORKFLOW_DELETE(IN_WF_ID  NUMBER, --流程ID
                              OUT_STR   OUT VARCHAR2, --执行结果
                              OUT_ERROR OUT VARCHAR2) --返回程序执行情况
   IS
    V_COUNT INTEGER; --临时计数
    UNVALID CONSTANT CHAR(1) := '0'; --无效
    ERR_WF_DELETE EXCEPTION; --流程删除异常
  BEGIN
    OUT_ERROR := 'SUCCESS';
    --查找是否有当前流程
    SELECT COUNT(1)
      INTO V_COUNT
      FROM SYS_WORKFLOW W
     WHERE W.ID = IN_WF_ID
       AND W.SFYX_ST = V_VALID;
    IF V_COUNT = 1 THEN
      --删除当前流程
      UPDATE SYS_WORKFLOW W SET W.SFYX_ST = UNVALID WHERE W.ID = IN_WF_ID;
      --删除流程变量
      UPDATE SYS_WORKFLOW_VARIABLE WV
         SET WV.SFYX_ST = UNVALID
       WHERE WV.WORKFLOW_ID = IN_WF_ID;
      --删除流程表单
      UPDATE SYS_WORKFLOW_PAGE WP
         SET WP.SFYX_ST = UNVALID
       WHERE WP.WORKFLOW_ID = IN_WF_ID;
      --删除流程的所有环节
      UPDATE SYS_NODE N
         SET N.SFYX_ST = UNVALID
       WHERE N.WORKFLOW_ID = IN_WF_ID;
      --删除环节按钮
      UPDATE SYS_NODE_BUTTON NB
         SET NB.SFYX_ST = UNVALID
       WHERE NOT EXISTS (SELECT 1
                FROM SYS_NODE N
               WHERE N.ID = NB.NODE_ID
                 AND N.SFYX_ST = V_VALID);
      --删除环节变量
      UPDATE SYS_NODE_VARIABLE_ASSIGN VA
         SET VA.SFYX_ST = UNVALID
       WHERE NOT EXISTS (SELECT 1
                FROM SYS_NODE N
               WHERE N.ID = VA.NODE_ID
                 AND N.SFYX_ST = V_VALID);
      --删除环节表单
      UPDATE SYS_NODE_PAGE NP
         SET NP.SFYX_ST = UNVALID
       WHERE NOT EXISTS (SELECT 1
                FROM SYS_NODE N
               WHERE N.ID = NP.NODE_ID
                 AND N.SFYX_ST = V_VALID);
      --删除流向
      UPDATE SYS_ROUTER R
         SET R.SFYX_ST = UNVALID
       WHERE R.WORKFLOW_ID = IN_WF_ID;
      OUT_STR := '流程删除成功';
    ELSE
      OUT_STR := '流程已删除，不能再次删除';
      RAISE ERR_WF_DELETE;
    END IF;
  EXCEPTION
    WHEN ERR_WF_DELETE THEN
      OUT_ERROR := '删除流程时出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '删除流程时出现' || SQLERRM;
  END P_WORKFLOW_DELETE;

  --删除流程实例(逻辑删除)
  PROCEDURE P_WORKFLOW_INSTANCE_DELETE(IN_WF_INS_ID NUMBER, --流程实例ID
                                       OUT_STR      OUT VARCHAR2, --执行结果
                                       OUT_ERROR    OUT VARCHAR2) --返回程序执行情况
   IS
    V_COUNT INTEGER; --临时计数
    UNVALID CONSTANT CHAR(1) := '0'; --无效
    V_WF_STARTUP_TYPE CHAR(1); --流程启动方式
    ERR_WF_INS_DELETE EXCEPTION; --流程删除异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --查找是否有当前流程实例
    SELECT COUNT(1)
      INTO V_COUNT
      FROM SYS_WORKFLOW_INSTANCE T
     WHERE T.ID = IN_WF_INS_ID
       AND T.SFYX_ST = V_VALID;
    IF V_COUNT = 1 THEN
      --查询流程启动方式
      SELECT WI.STARTUP_TYPE
        INTO V_WF_STARTUP_TYPE
        FROM SYS_WORKFLOW_INSTANCE WI
       WHERE WI.ID = IN_WF_INS_ID
         AND WI.SFYX_ST = V_VALID;
      --若是嵌套流程实例
      IF V_WF_STARTUP_TYPE = '1' THEN
        OUT_STR := '子流程实例不允许删除，请删除主流程实例';
        RAISE ERR_WF_INS_DELETE;
      END IF;
      --查找子流程实例
      FOR L_CUR IN (SELECT WI.ID
                      FROM SYS_WORKFLOW_INSTANCE WI
                     WHERE WI.NODE_INSTANCE_ID IN
                           (SELECT NI.ID
                              FROM SYS_NODE_INSTANCE NI, SYS_NODE N
                             WHERE NI.NODE_ID = N.ID
                               AND NI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID
                               AND N.TYPE = '5' --嵌套
                               AND NI.SFYX_ST = '1'
                               AND N.SFYX_ST = '1')) LOOP
        --删除子流程实例
        PKG_WF.P_WORKFLOW_INSTANCE_DELETE(L_CUR.ID, OUT_STR, OUT_ERROR);
        IF OUT_ERROR <> V_SUCCESS_FLAG THEN
          RAISE ERR_WF_INS_DELETE;
        END IF;
      END LOOP;
      --删除当前流程实例
      UPDATE SYS_WORKFLOW_INSTANCE WI
         SET WI.SFYX_ST = UNVALID
       WHERE WI.ID = IN_WF_INS_ID;
      --删除流程变量实例
      UPDATE SYS_WORKFLOW_VARIABLE_INSTANCE WVI
         SET WVI.SFYX_ST = UNVALID
       WHERE WVI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID;
      --删除流程实例下的所有环节实例
      UPDATE SYS_NODE_INSTANCE NI
         SET NI.SFYX_ST = UNVALID
       WHERE NI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID;
      --删除流程实例下所有任务
      UPDATE SYS_TASK_INSTANCE TI
         SET TI.SFYX_ST = UNVALID
       WHERE TI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID;
      --删除任务表单实例
      UPDATE SYS_TASK_PAGE_INSTANCE TPI
         SET TPI.SFYX_ST = UNVALID
       WHERE NOT EXISTS (SELECT 1
                FROM SYS_TASK_INSTANCE TI
               WHERE TI.ID = TPI.TASK_INSTANCE_ID
                 AND TI.SFYX_ST = V_VALID);
    ELSE
      OUT_STR := '流程已删除，不能再次删除';
      RAISE ERR_WF_INS_DELETE;
    END IF;
  EXCEPTION
    WHEN ERR_WF_INS_DELETE THEN
      OUT_ERROR := '删除流程时出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '删除流程时出现' || SQLERRM;
  END P_WORKFLOW_INSTANCE_DELETE;

  --完成流程
  PROCEDURE P_WORKFLOW_FINISH(IN_WF_INS_ID INTEGER, --流程实例ID
                              OUT_STR      OUT VARCHAR2, --执行结果
                              OUT_ERROR    OUT VARCHAR2) --执行成功标识
   AS
    V_COUNT            INTEGER; --临时计数
    V_NEST_NODE_ID     INTEGER; --嵌套环节ID
    V_NEST_NODE_INS_ID INTEGER; --嵌套环节实例ID
    V_MASTER_WF_INS_ID INTEGER; --主流程实例ID
    V_WF_START_TYPE    SYS_WORKFLOW_INSTANCE.STARTUP_TYPE%TYPE; --流程启动类型 0人工 1嵌套
    ERR_FINISH_WORKFLOW EXCEPTION; --完成异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --将未完成流程实例状态设为完成
    UPDATE SYS_WORKFLOW_INSTANCE WI
       SET WI.STATUS = '0', WI.FINISH_DATE = SYSDATE
     WHERE WI.ID = IN_WF_INS_ID
       AND WI.STATUS <> '0'
       AND WI.SFYX_ST = V_VALID;
    --将流程实例下所有运行环节实例状态设为完成
    UPDATE SYS_NODE_INSTANCE NI
       SET NI.STATUS = '2', NI.FINISH_DATE = SYSDATE
     WHERE NI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID
       AND NI.STATUS = '1'
       AND NI.SFYX_ST = V_VALID;
    --将未完成任务状态设为完成
    UPDATE SYS_TASK_INSTANCE TI
       SET TI.STATUS      = '2', --已办
           TI.ACTION      = '1', --无动作
           TI.IS_FINISH   = '1', --完成
           TI.FINISH_DATE = SYSDATE
     WHERE TI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID
       AND TI.IS_FINISH = '0'
       AND TI.SFYX_ST = V_VALID;
    --获取流程启动类别和嵌套环节实例ID
    SELECT WI.STARTUP_TYPE, WI.NODE_INSTANCE_ID
      INTO V_WF_START_TYPE, V_NEST_NODE_INS_ID
      FROM SYS_WORKFLOW_INSTANCE WI
     WHERE WI.ID = IN_WF_INS_ID
       AND WI.SFYX_ST = '1';
    --若为嵌套子流程的完成则需检查对应的嵌套环节实例是否可以完成
    IF V_WF_START_TYPE = '1' THEN
      SELECT COUNT(1)
        INTO V_COUNT
        FROM SYS_WORKFLOW_INSTANCE WI
       WHERE WI.SFYX_ST = '1'
         AND WI.NODE_INSTANCE_ID = V_NEST_NODE_INS_ID
         AND WI.STATUS NOT IN ('0', '3'); --不是完成和终止的
      --子流程都已完成
      IF V_COUNT = 0 THEN
        --更新嵌套环节状态为完成
        UPDATE SYS_NODE_INSTANCE T
           SET T.STATUS      = '2', --完成
               T.FINISH_DATE = SYSDATE
         WHERE T.ID = V_NEST_NODE_INS_ID
           AND T.SFYX_ST = V_VALID;
        --获取嵌套环节ID和主流程实例ID
        SELECT NI.NODE_ID, NI.WORKFLOW_INSTANCE_ID
          INTO V_NEST_NODE_ID, V_MASTER_WF_INS_ID
          FROM SYS_NODE_INSTANCE NI
         WHERE NI.ID = V_NEST_NODE_INS_ID
           AND NI.SFYX_ST = '1';
        --获取下一实例化环节
        FOR L_CUR IN (SELECT *
                        FROM TABLE(PKG_WF.F_WF_NEXT_INSTANCE_NODE(V_NEST_NODE_ID,
                                                                  '',
                                                                  V_MASTER_WF_INS_ID))) LOOP
          --验证下一环节是否可以实例化
          IF PKG_WF.F_WF_CHECK_NODE_CAN_INSTANCE(L_CUR.COLUMN_VALUE,
                                                 V_MASTER_WF_INS_ID) = '1' THEN
            --实例化环节
            PKG_WF.P_WORKFLOW_INSTANCE_NODE(L_CUR.COLUMN_VALUE,
                                            NULL,
                                            V_MASTER_WF_INS_ID,
                                            V_ACTION_FINISH || ',' ||
                                            V_NEST_NODE_INS_ID,
                                            OUT_STR,
                                            OUT_ERROR);
            --若实例化环节返回不为空则实例化环节异常
            IF OUT_STR IS NOT NULL THEN
              RAISE ERR_FINISH_WORKFLOW;
            END IF;
          END IF;
        END LOOP;
        --验证主流程是否可以完成, 检查未完成的环节实例个数
        SELECT COUNT(1)
          INTO V_COUNT
          FROM SYS_NODE_INSTANCE N
         WHERE N.WORKFLOW_INSTANCE_ID = V_MASTER_WF_INS_ID
           AND N.STATUS = '1' --运行
           AND N.SFYX_ST = '1';
        --所有环节都已完成
        IF V_COUNT = 0 THEN
          --完成主流程
          PKG_WF.P_WORKFLOW_FINISH(V_MASTER_WF_INS_ID, OUT_STR, OUT_ERROR);
          IF OUT_STR IS NOT NULL THEN
            RAISE ERR_FINISH_WORKFLOW;
          END IF;
        END IF;
      END IF;
    END IF;
  EXCEPTION
    WHEN ERR_FINISH_WORKFLOW THEN
      OUT_ERROR := '完成工作流时出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '完成工作流时出现' || SQLERRM;
  END P_WORKFLOW_FINISH;

  --批量办理、一键办理程序，返回办理成功数量和办理失败数量和未办理数量 LB
  PROCEDURE P_WORKFLOW_BATCH_HANDLE(IN_WF_INS_IDS VARCHAR2, --流程实例IDS,多个用逗号拼接
                                    IN_USERID     NUMBER, --用户ID
                                    IN_BLYJ       VARCHAR2, --办理意见
                                    IN_FLAG       VARCHAR2, --同意，不同意标志位，0：不同意 1：同意
                                    OUT_STR       OUT VARCHAR2, --执行结果
                                    OUT_ERROR     OUT VARCHAR2) --返回程序执行情况
   AS
    V_WF_INS_IDS VARCHAR2(4000); --流程实例IDS,多个用逗号拼接
    V_ZS         NUMBER; --总任务数
    V_XYBLSL     NUMBER; --需要办理的数量
    V_BLCGSL     NUMBER := 0; --办理成功数量
    V_BLSBSL     NUMBER := 0; --办理失败数量
    V_WBLSL      NUMBER; --未办理数量
    ERR_BATCH_HANDLE EXCEPTION; --批量办理异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --如果流程实例IDS是空的话说明是一键办理，查找出需要办理的流程实例IDS
    IF IN_WF_INS_IDS IS NULL THEN
      SELECT WM_CONCAT(WI.ID)
        INTO V_WF_INS_IDS　
        FROM SYS_WORKFLOW_INSTANCE WI, SYS_TASK_INSTANCE TI
       WHERE WI.ID = TI.WORKFLOW_INSTANCE_ID
         AND TI.USER_ID = IN_USERID
         AND TI.IS_FINISH = '0'
         AND WI.SFYX_ST = V_VALID
         AND TI.SFYX_ST = V_VALID;
    ELSE
      V_WF_INS_IDS := IN_WF_INS_IDS;
    END IF;
    --查找总任务数
    SELECT LENGTH(REGEXP_REPLACE(V_WF_INS_IDS || ',', '[^,]+', ''))
      INTO V_ZS
      FROM DUAL;
    --查找需要办理的任务数量
    SELECT COUNT(1)
      INTO V_XYBLSL
      FROM SYS_TASK_INSTANCE
     WHERE WORKFLOW_INSTANCE_ID IN
           (SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(V_WF_INS_IDS, ',')))
       AND SFYX_ST = V_VALID
       AND IS_FINISH = '0'
       AND USER_ID = IN_USERID;
    --获取未办理的数量
    V_WBLSL := V_ZS - V_XYBLSL;
    --对需要办理的任务进行循环处理
    FOR I IN (SELECT ID TASK_INS_ID
                FROM SYS_TASK_INSTANCE
               WHERE WORKFLOW_INSTANCE_ID IN
                     (SELECT COLUMN_VALUE
                        FROM TABLE(SPLITSTR(V_WF_INS_IDS, ',')))
                 AND SFYX_ST = V_VALID
                 AND IS_FINISH = '0'
                 AND USER_ID = IN_USERID) LOOP
      --调用任务提交的程序
      IF IN_FLAG = '1' THEN
        --提交
        PKG_TASK.P_TASK_SUBMIT(I.TASK_INS_ID,
                               NULL,
                               NULL,
                               IN_BLYJ,
                               NULL,
                               OUT_STR,
                               OUT_ERROR);
      ELSIF IN_FLAG = '0' THEN
        --退回
        PKG_TASK.P_TASK_BACK(I.TASK_INS_ID,
                             NULL,
                             IN_BLYJ,
                             NULL,
                             OUT_STR,
                             OUT_ERROR);
      END IF;
      --更新任务表单意见
      UPDATE SYS_TASK_PAGE_INSTANCE TPI
         SET TPI.TASK_PAGE_OPINION = IN_BLYJ
       WHERE TPI.TASK_INSTANCE_ID = I.TASK_INS_ID
         AND TPI.SFYX_ST = V_VALID;
      --如果任务提交成功则办理成功数量+1，如果任务提交失败则办理失败数量+1
      IF OUT_ERROR = 'SUCCESS' THEN
        V_BLCGSL := V_BLCGSL + 1;
      ELSE
        V_BLSBSL := V_BLSBSL + 1;
      END IF;
    END LOOP;
    OUT_STR := '总任务数:' || V_ZS || '</br>办理成功任务数:' || V_BLCGSL ||
               '</br>办理失败任务数:' || V_BLSBSL || '</br>未办理任务数:' || V_WBLSL;
    --异常部分
  EXCEPTION
    WHEN ERR_BATCH_HANDLE THEN
      OUT_ERROR := '批量办理出现' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '批量办理出现' || SQLERRM;
  END P_WORKFLOW_BATCH_HANDLE;

  --流程变量初始化 wcy 2017.4
  PROCEDURE P_WORKFLOW_VARIABLE_INSTANCE(IN_WORKFLOW_ID     NUMBER, --流程ID
                                         IN_WORKFLOW_INS_ID NUMBER) --流程实例ID
   AS
  BEGIN
    INSERT INTO SYS_WORKFLOW_VARIABLE_INSTANCE
      (ID, WORKFLOW_INSTANCE_ID, VARIABLE_ID, VALUE, CJSJ, SFYX_ST)
      SELECT SEQ_SYS_WORKFLOW_VARIABLE_INST.NEXTVAL,
             IN_WORKFLOW_INS_ID,
             WV.ID,
             WV.INITIAL_VALUE,
             SYSDATE,
             V_VALID
        FROM SYS_WORKFLOW_VARIABLE WV
       WHERE WV.WORKFLOW_ID = IN_WORKFLOW_ID
         AND WV.SFYX_ST = V_VALID;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
  END P_WORKFLOW_VARIABLE_INSTANCE;

  --更新流程变量实例
  --创建人：wcy
  --创建时间：2018.1.3
  PROCEDURE P_WF_INIT_VARIABLE(IN_TASK_ID INTEGER, --任务ID
                               IN_WF_VARS VARCHAR2, --流程变量及值
                               OUT_ERROR  OUT VARCHAR2) --程序运行结果
   AS
    V_CT        NUMBER; --数量
    V_WF_ID     INTEGER; --流程ID
    V_WF_INS_ID INTEGER; --流程实例ID
    V_VAR_ID    INTEGER; --流程变量ID
    V_KEY       VARCHAR2(100); --流程变量名
    V_VALUE     VARCHAR2(100); --流程变量值
    ERR_NUM EXCEPTION; --自定义异常
    ERR_VAR EXCEPTION; --自定义异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    IF IN_WF_VARS IS NOT NULL THEN
      --根据任务ID查找流程实例ID
      SELECT TI.WORKFLOW_INSTANCE_ID, WI.WORKFLOW_ID
        INTO V_WF_INS_ID, V_WF_ID
        FROM SYS_TASK_INSTANCE TI, SYS_WORKFLOW_INSTANCE WI
       WHERE TI.ID = IN_TASK_ID
         AND TI.WORKFLOW_INSTANCE_ID = WI.ID
         AND WI.SFYX_ST = V_VALID
         AND TI.SFYX_ST = V_VALID;
      --循环更新每个流程变量
      FOR K IN (SELECT COLUMN_VALUE FROM TABLE(SPLITSTR(IN_WF_VARS, ','))) LOOP
        V_KEY   := SUBSTR(K.COLUMN_VALUE, 1, INSTR(K.COLUMN_VALUE, ':') - 1);
        V_VALUE := SUBSTR(K.COLUMN_VALUE, INSTR(K.COLUMN_VALUE, ':') + 1);
        --根据流程ID 变量名查找变量ID
        SELECT MAX(WV.ID)
          INTO V_VAR_ID
          FROM SYS_WORKFLOW_VARIABLE WV
         WHERE WV.WORKFLOW_ID = V_WF_ID
           AND WV.NAME = V_KEY
           AND WV.SFYX_ST = V_VALID;
        IF V_VAR_ID IS NULL THEN
          RAISE ERR_VAR;
        END IF;
        --根据流程实例ID 变量ID查找流程变量实例
        SELECT COUNT(1)
          INTO V_CT
          FROM SYS_WORKFLOW_VARIABLE_INSTANCE WVI
         WHERE WVI.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
           AND WVI.VARIABLE_ID = V_VAR_ID
           AND WVI.SFYX_ST = V_VALID;
        --当不存在时，插入流程变量实例
        IF V_CT = 0 THEN
          INSERT INTO SYS_WORKFLOW_VARIABLE_INSTANCE
            (ID, WORKFLOW_INSTANCE_ID, VARIABLE_ID, VALUE, CJSJ, SFYX_ST)
          VALUES
            (SEQ_SYS_WORKFLOW_VARIABLE_INST.NEXTVAL,
             V_WF_INS_ID,
             V_VAR_ID,
             V_VALUE,
             SYSDATE,
             V_VALID);
          --当存在时，更新流程变量实例
        ELSIF V_CT = 1 THEN
          UPDATE SYS_WORKFLOW_VARIABLE_INSTANCE WVI
             SET WVI.VALUE = V_VALUE
           WHERE WVI.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
             AND WVI.VARIABLE_ID = V_VAR_ID
             AND WVI.SFYX_ST = V_VALID;
          --当数量大于1时，抛出异常信息
        ELSE
          RAISE ERR_NUM;
        END IF;
      END LOOP;
    END IF;
    --异常处理
  EXCEPTION
    WHEN ERR_VAR THEN
      OUT_ERROR := '流程中未配置该变量';
      ROLLBACK;
    WHEN ERR_NUM THEN
      OUT_ERROR := '流程变量实例数量异常';
      ROLLBACK;
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_WF_INIT_VARIABLE;

  --获取下一环节办理人(含机构信息)
  PROCEDURE P_WF_NEXT_NODE_USER(IN_TASK_ID          INTEGER, --任务实例ID
                                IN_DECISION         VARCHAR2, --决策条件
                                IN_FLAG             VARCHAR2, --退回还是提交 0退回 1提交
                                IN_BACK_NODE_WF_IDS VARCHAR2, --指定的退回环节流程实例IDS NODE_ID|WF_INS_ID;
                                OUT_CUR             OUT SYS_REFCURSOR, --环节、办理人、所属机构集合
                                OUT_STR             OUT VARCHAR2, --返回信息
                                OUT_ERROR           OUT VARCHAR2) --返回程序执行情况
   AS
    V_NODE_ID          INTEGER; --环节ID
    V_NODE_INS_ID      INTEGER; --环节实例ID
    V_WF_INS_ID        INTEGER; --流程实例ID
    V_TASK_USER_ID     INTEGER; --当前任务办理人ID
    V_COUNT            INTEGER; --临时计数
    V_TAB_NODE         TAB_INT; --环节存储表
    V_BACK_NODE_WF_TAB TAB_STR; --退回环节存储表 NODE_ID|WF_INS_ID
    V_BACK_NODE_INS_ID INTEGER; -- 退回环节实例ID
    V_BACK_USER_IDS    VARCHAR2(4000); --退回办理人IDS
    V_ROW_NODE_WF      TEMP_NODE_WF%ROWTYPE;
    V_BACK_NODE_CURSOR SYS_REFCURSOR;
    ERR_NEXT_NODE_USER EXCEPTION; --获取下一环节办理人自定义异常
  BEGIN
    OUT_ERROR := V_SUCCESS_FLAG;
    --获取当前任务环节ID、环节实例ID、任务办理人
    SELECT TI.USER_ID, NI.ID, N.ID, TI.WORKFLOW_INSTANCE_ID
      INTO V_TASK_USER_ID, V_NODE_INS_ID, V_NODE_ID, V_WF_INS_ID
      FROM SYS_TASK_INSTANCE TI, SYS_NODE_INSTANCE NI, SYS_NODE N
     WHERE TI.NODE_INSTANCE_ID = NI.ID
       AND NI.NODE_ID = N.ID
       AND TI.ID = IN_TASK_ID
       AND TI.SFYX_ST = '1'
       AND NI.SFYX_ST = '1'
       AND N.SFYX_ST = '1';
    --提交
    IF IN_FLAG = '1' THEN
      --清空环节办理人临时表
      DELETE FROM TEMP_NODE_USER;
      --获取下一可以实例化环节
      V_TAB_NODE := PKG_WF.F_WF_NEXT_INSTANCE_NODE(V_NODE_ID,
                                                   IN_DECISION,
                                                   V_WF_INS_ID);
      --获取可以实例化环节数量
      SELECT COUNT(1) INTO V_COUNT FROM TABLE(V_TAB_NODE);
      IF V_COUNT > 0 THEN
        --循环查找办理人
        FOR L_CUR IN (SELECT N.ID, N.TYPE
                        FROM TABLE(V_TAB_NODE) T, SYS_NODE N
                       WHERE T.COLUMN_VALUE = N.ID
                         AND N.SFYX_ST = '1') LOOP
          --结束环节不返回办理人
          IF L_CUR.TYPE = '1' THEN
            IF V_COUNT = 1 THEN
              OUT_STR := '下一环节是结束环节';
              --返回NULL
              OPEN OUT_CUR FOR
                SELECT NULL FROM DUAL;
              RETURN;
            END IF;
          ELSE
            --清空办理人临时表
            DELETE FROM TEMP_USER;
            --调用过程计算办理人
            PKG_TRANSACTOR.P_CALC_TRANSACTOR(V_WF_INS_ID,
                                             L_CUR.ID,
                                             V_NODE_INS_ID,
                                             V_TASK_USER_ID);
            --插入环节办理人临时表
            INSERT INTO TEMP_NODE_USER
              SELECT L_CUR.ID, TU.USER_ID FROM TEMP_USER TU;
          END IF;
        END LOOP;
        --返回游标
        OPEN OUT_CUR FOR
          SELECT N.ID NEXT_NODE_ID,
                 N.NAME NEXT_NODE_NAME,
                 U.ID USER_ID,
                 U.USER_NAME,
                 O.ORGAN_NAME,
                 PKG_WF.F_WF_GET_BLR_CHOOSE_CONFIG(N.ID) BLR_CHOOSE
            FROM TEMP_NODE_USER NU
           INNER JOIN SYS_USER U
              ON NU.USER_ID = U.ID
             AND U.SFYX_ST <> '0'
           INNER JOIN SYS_NODE N
              ON NU.NODE_ID = N.ID
             AND N.SFYX_ST = V_VALID
            LEFT JOIN SYS_ORGAN O
              ON U.DEFAULT_ORGAN_ID = O.ID
             AND O.SFYX_ST = V_VALID;
      ELSE
        OUT_STR := '找不到下一办理环节';
        RAISE ERR_NEXT_NODE_USER;
      END IF;
      --退回
    ELSIF IN_FLAG = '0' THEN
      --若指定了退回环节
      IF IN_BACK_NODE_WF_IDS IS NOT NULL THEN
        FOR L_CUR IN (SELECT *
                        FROM TABLE(SPLITSTR(IN_BACK_NODE_WF_IDS, ';'))) LOOP
          PKG_UTIL.P_TAB_PUSH(V_BACK_NODE_WF_TAB, L_CUR.COLUMN_VALUE);
        END LOOP;
      ELSE
        --获取退回环节
        V_BACK_NODE_CURSOR := PKG_WF.F_WF_GET_BACK_NODES(V_NODE_ID,
                                                         V_WF_INS_ID);
        LOOP
          FETCH V_BACK_NODE_CURSOR
            INTO V_ROW_NODE_WF;
          EXIT WHEN V_BACK_NODE_CURSOR%NOTFOUND;
          PKG_UTIL.P_TAB_PUSH(V_BACK_NODE_WF_TAB,
                              V_ROW_NODE_WF.NODE_ID || '|' ||
                              V_ROW_NODE_WF.WF_INS_ID);
        END LOOP;
        CLOSE V_BACK_NODE_CURSOR;
      END IF;
      --清空退回环节办理人临时表
      DELETE FROM TEMP_BACK_USER;
      --循环查找办理人
      FOR L_CUR IN (SELECT N.ID,
                           N.NAME,
                           TO_NUMBER(SUBSTR(T.COLUMN_VALUE,
                                            INSTR(T.COLUMN_VALUE, '|') + 1)) WF_INS_ID
                      FROM TABLE(V_BACK_NODE_WF_TAB) T, SYS_NODE N
                     WHERE TO_NUMBER(SUBSTR(T.COLUMN_VALUE,
                                            0,
                                            INSTR(T.COLUMN_VALUE, '|') - 1)) = N.ID
                       AND N.SFYX_ST = '1') LOOP
        --找出退回环节环节实例
        SELECT MAX(NI.ID)
          INTO V_BACK_NODE_INS_ID
          FROM SYS_NODE_INSTANCE NI
         WHERE NI.WORKFLOW_INSTANCE_ID = L_CUR.WF_INS_ID
           AND NI.NODE_ID = L_CUR.ID
           AND NI.STATUS = '2'
           AND NI.SFYX_ST = V_VALID;
        --查找原任务办理人
        INSERT INTO TEMP_BACK_USER
          SELECT TI.USER_ID,
                 U.USER_NAME,
                 O.ORGAN_NAME,
                 L_CUR.ID,
                 L_CUR.NAME,
                 '1',
                 L_CUR.WF_INS_ID
            FROM SYS_TASK_INSTANCE TI
            LEFT JOIN SYS_USER U
              ON TI.USER_ID = U.ID
            LEFT JOIN SYS_ORGAN O
              ON U.DEFAULT_ORGAN_ID = O.ID
           WHERE TI.NODE_INSTANCE_ID = V_BACK_NODE_INS_ID
             AND TI.SFYX_ST = '1';
        --若不是第一活动环节需要重新查找人添加新人
        IF PKG_WF.F_WF_CHECK_FIRST_ACT_NODE(V_BACK_NODE_INS_ID) = '0' THEN
          --获取现退回环节办理人
          V_BACK_USER_IDS := PKG_WF.F_WF_GET_NODE_USERS(V_BACK_NODE_INS_ID);
          --添加新增的人
          INSERT INTO TEMP_BACK_USER
            SELECT U.ID,
                   U.USER_NAME,
                   O.ORGAN_NAME,
                   L_CUR.ID,
                   L_CUR.NAME,
                   '3',
                   L_CUR.WF_INS_ID
              FROM TABLE(SPLITSTR(V_BACK_USER_IDS, ',')) T,
                   SYS_USER U,
                   SYS_ORGAN O
             WHERE T.COLUMN_VALUE = U.ID
               AND U.DEFAULT_ORGAN_ID = O.ID
               AND NOT EXISTS (SELECT 1
                      FROM TEMP_BACK_USER TB
                     WHERE TB.USER_ID = T.COLUMN_VALUE
                       AND TB.NODE_ID = L_CUR.ID)
               AND O.SFYX_ST = '1'
               AND U.SFYX_ST <> '0';
        END IF;
      END LOOP;
      --更新办理人不存在的情况
      UPDATE TEMP_BACK_USER T
         SET T.TAG = '0'
       WHERE NOT EXISTS (SELECT 1
                FROM SYS_USER U
               WHERE U.ID = T.USER_ID
                 AND U.SFYX_ST <> '0');
      --返回用户列表
      OPEN OUT_CUR FOR
        SELECT B.USER_ID,
               B.USER_NAME,
               B.ORGAN_NAME,
               B.NODE_ID NEXT_NODE_ID,
               B.NODE_NAME NEXT_NODE_NAME,
               '0' BLR_CHOOSE, --退回时默认办理人不可选
               B.TAG,
               B.WF_INS_ID,
               WI.TITLE WF_TITLE,
               U.USER_NAME START_USER_NAME
          FROM TEMP_BACK_USER B, SYS_WORKFLOW_INSTANCE WI, SYS_USER U
         WHERE WI.STARTUP_USER_ID = U.ID
           AND B.WF_INS_ID = WI.ID
           AND WI.SFYX_ST = '1'
           AND U.SFYX_ST <> '0';
    END IF;
    OUT_STR := '取出成功';
  EXCEPTION
    WHEN ERR_NEXT_NODE_USER THEN
      OUT_ERROR := '取出失败：' || OUT_STR;
    WHEN OTHERS THEN
      OUT_ERROR := '取出失败：' || SQLERRM;
  END P_WF_NEXT_NODE_USER;

  --获取当前环节办理人
  FUNCTION F_WF_GET_NODE_USERS(IN_NODE_INS_ID INTEGER) --环节实例ID
   RETURN VARCHAR2 AS
    V_WF_INS_ID       INTEGER; --流程实例ID
    V_NODE_ID         INTEGER; --环节ID
    V_PRE_NODE_INS_ID INTEGER; --上一环节实例ID
    V_USER_IDS        VARCHAR2(2000);
  BEGIN
    --查找流程实例ID环节ID
    SELECT NI.NODE_ID, NI.WORKFLOW_INSTANCE_ID
      INTO V_NODE_ID, V_WF_INS_ID
      FROM SYS_NODE_INSTANCE NI
     WHERE NI.ID = IN_NODE_INS_ID
       AND NI.SFYX_ST = '1';
    --获取上一环节实例
    BEGIN
      SELECT TI.NODE_INSTANCE_ID
        INTO V_PRE_NODE_INS_ID
        FROM SYS_TASK_INSTANCE TI
       WHERE TI.ID =
             (SELECT MAX(T1.ID)
                FROM SYS_TASK_INSTANCE T1, SYS_NODE_INSTANCE NI
               WHERE T1.ID < (SELECT MIN(T2.ID)
                                FROM SYS_TASK_INSTANCE T2
                               WHERE T2.NODE_INSTANCE_ID = IN_NODE_INS_ID
                                 AND T2.SFYX_ST = '1')
                 AND T1.NODE_INSTANCE_ID IN
                     (SELECT T3.NODE_INSTANCE_ID
                        FROM SYS_TASK_INSTANCE T3
                       WHERE T3.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
                         AND T3.SFYX_ST = '1'
                       GROUP BY T3.NODE_INSTANCE_ID
                      HAVING MAX(T3.ACTION) IN(3, 6))
                 AND T1.NODE_INSTANCE_ID = NI.ID
                 AND NI.NODE_ID IN
                     (SELECT *
                        FROM TABLE(SPLITSTR(PKG_WF.F_WF_GET_PRE_ACT_NODE(V_NODE_ID),
                                            ',')))
                 AND NI.SFYX_ST = '1'
                 AND T1.SFYX_ST = '1')
         AND TI.SFYX_ST = '1';
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('找不到当前环节实例的前一环节实例');
    END;
    --清空临时表
    DELETE FROM TEMP_USER;
    --查找环节办理人
    PKG_TRANSACTOR.P_CALC_TRANSACTOR(V_WF_INS_ID,
                                     V_NODE_ID,
                                     V_PRE_NODE_INS_ID,
                                     NULL);
    --将临时表的数据返回
    SELECT WM_CONCAT(T.USER_ID) INTO V_USER_IDS FROM TEMP_USER T;
    RETURN V_USER_IDS;
  END F_WF_GET_NODE_USERS;

  --环节的前一个活动节点
  --多个环节ID用逗号隔开
  FUNCTION F_WF_GET_PRE_ACT_NODE(IN_NODE_ID INTEGER) RETURN VARCHAR2 AS
    V_RESULT         VARCHAR2(1000) := '';
    V_START_NODE_IDS VARCHAR2(1000);
    V_NODE_TYPE      SYS_NODE.TYPE%TYPE;
  BEGIN
    SELECT WM_CONCAT(R.START_NODE_ID)
      INTO V_START_NODE_IDS
      FROM SYS_ROUTER R, SYS_NODE S, SYS_NODE E
     WHERE R.START_NODE_ID = S.ID
       AND R.END_NODE_ID = E.ID
       AND R.SFYX_ST = '1'
       AND S.SFYX_ST = '1'
       AND E.SFYX_ST = '1'
       AND R.END_NODE_ID = IN_NODE_ID;
    --筛选活动环节
    FOR L_CUR IN (SELECT * FROM TABLE(SPLITSTR(V_START_NODE_IDS, ','))) LOOP
      SELECT N.TYPE
        INTO V_NODE_TYPE
        FROM SYS_NODE N
       WHERE N.ID = L_CUR.COLUMN_VALUE
         AND N.SFYX_ST = '1';
      IF V_NODE_TYPE = '2' THEN
        V_RESULT := V_RESULT || L_CUR.COLUMN_VALUE || ',';
      ELSE
        V_RESULT := V_RESULT ||
                    PKG_WF.F_WF_GET_PRE_ACT_NODE(L_CUR.COLUMN_VALUE);
      END IF;
    END LOOP;
    RETURN V_RESULT;
  END F_WF_GET_PRE_ACT_NODE;

  --功能：拷贝节点关联对象
  --创建人：wangyang
  --创建时间：2018.9.11
  PROCEDURE P_NODE_COPY_RELATED_OBJECTS(IN_SOURCE_NODE_ID INTEGER, --源节点
                                        IN_TARGET_NODE_ID INTEGER, --目标节点
                                        IN_USER_ID        INTEGER, --操作用户ID
                                        OUT_STR           OUT VARCHAR2, --执行结果
                                        OUT_ERROR         OUT VARCHAR2) --返回程序执行情况
   AS
  BEGIN
    --拷贝表单
    INSERT INTO SYS_NODE_PAGE
      (ID,
       TITLE,
       NODE_ID,
       PAGE_ID,
       CONTROL,
       SORT,
       CJR_ID,
       CJSJ,
       SFYX_ST,
       SPX_NAME,
       SPX_SORT,
       SPX_PRINT)
      SELECT SEQ_SYS_NODE_PAGE.NEXTVAL,
             TITLE,
             IN_TARGET_NODE_ID,
             PAGE_ID,
             CONTROL,
             SORT,
             IN_USER_ID,
             SYSDATE,
             SFYX_ST,
             SPX_NAME,
             SPX_SORT,
             SPX_PRINT
        FROM SYS_NODE_PAGE T
       WHERE NODE_ID = IN_SOURCE_NODE_ID
         AND SFYX_ST = '1';

    --拷贝按钮
    INSERT INTO SYS_NODE_BUTTON
      (ID,
       NAME,
       CODE,
       ICON,
       FLAG,
       FUNCNAME,
       NODE_ID,
       SFYX_ST,
       CJSJ,
       XGSJ,
       CJR_ID,
       XGR_ID,
       SORT,
       ISSHOWINHANDLE,
       TYPE,
       OPINION)
      SELECT SEQ_SYS_NODE_BUTTON.NEXTVAL,
             NAME,
             CODE,
             ICON,
             FLAG,
             FUNCNAME,
             IN_TARGET_NODE_ID,
             SFYX_ST,
             SYSDATE,
             SYSDATE,
             IN_USER_ID,
             IN_USER_ID,
             SORT,
             ISSHOWINHANDLE,
             TYPE,
             OPINION
        FROM SYS_NODE_BUTTON T
       WHERE NODE_ID = IN_SOURCE_NODE_ID
         AND SFYX_ST = '1';

    --拷贝变量赋值
    INSERT INTO SYS_NODE_VARIABLE_ASSIGN
      (ID, VARIABLE_ID, NODE_ID, EXPRESSION, SFYX_ST)
      SELECT SEQ_SYS_NODE_VARIABLE_ASSIGN.NEXTVAL,
             VARIABLE_ID,
             IN_TARGET_NODE_ID,
             EXPRESSION,
             SFYX_ST
        FROM SYS_NODE_VARIABLE_ASSIGN T
       WHERE NODE_ID = IN_SOURCE_NODE_ID
         AND SFYX_ST = '1';
    OUT_STR   := V_SUCCESS_FLAG;
    OUT_ERROR := V_SUCCESS_FLAG;
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := SQLERRM;
      ROLLBACK;
  END P_NODE_COPY_RELATED_OBJECTS;

  --获取流程业务状态
  FUNCTION F_WF_GET_STATUS(IN_WF_INS_ID IN INTEGER) RETURN VARCHAR2 AS
    V_DICTCODE  VARCHAR2(30);
    V_WF_STATUS CHAR(1);
    V_STATUS    VARCHAR2(1000);
    V_NODE_NAME VARCHAR2(1000);
  BEGIN
    --查找流程业务状态字典
    SELECT W.WORKFLOWYWZTZD, WI.STATUS
      INTO V_DICTCODE, V_WF_STATUS
      FROM SYS_WORKFLOW_INSTANCE WI, SYS_WORKFLOW W
     WHERE WI.WORKFLOW_ID = W.ID
       AND WI.ID = IN_WF_INS_ID
       AND WI.SFYX_ST = '1'
       AND W.SFYX_ST = '1';
    --查找当前流程实例的状态(运行状态的环节实例对应业务状态)
    SELECT WM_CONCAT(N.YWZT), WM_CONCAT(N.NAME)
      INTO V_STATUS, V_NODE_NAME
      FROM SYS_WORKFLOW_INSTANCE WI, SYS_NODE_INSTANCE NI, SYS_NODE N
     WHERE WI.ID = NI.WORKFLOW_INSTANCE_ID
       AND NI.NODE_ID = N.ID
       AND WI.ID = IN_WF_INS_ID
       AND NI.STATUS = '1'
       AND WI.SFYX_ST = '1'
       AND NI.SFYX_ST = '1'
       AND N.SFYX_ST = '1';
    --当没有配置业务状态字典时，使用环节名称
    IF V_DICTCODE IS NULL THEN
      V_STATUS := V_NODE_NAME;
      IF V_WF_STATUS = '5' THEN
        V_STATUS := '待提交';
      END IF;
      IF V_WF_STATUS = '0' THEN
        V_STATUS := '完成';
      END IF;
      IF V_WF_STATUS = '6' THEN
        V_STATUS := '撤回终止';
      END IF;
      IF V_WF_STATUS = '7' THEN
        V_STATUS := '退回终止';
      END IF;
    ELSE
      IF V_WF_STATUS = '0' THEN
        SELECT NVL(MAX(CODE), '完成')
          INTO V_STATUS
          FROM SYS_SUBDICT
         WHERE DICT_CODE = V_DICTCODE
           AND VALUE = '完成';
      END IF;
    END IF;
    RETURN V_STATUS;
  END F_WF_GET_STATUS;

  --获取办理人可选配置 1表示可选，0表示不可选
  FUNCTION F_WF_GET_BLR_CHOOSE_CONFIG(IN_NODE_ID INTEGER) RETURN CHAR AS
    V_IS_BLR_CHOOSE      VARCHAR2(10);
    V_BLR_CHOOSE_DEF_VAL VARCHAR2(10);
    V_NODE_BLR_CHOOSE    CHAR(1);
    V_NODE_TYPE          SYS_NODE.TYPE%TYPE;
  BEGIN
    SELECT C.VALUE
      INTO V_IS_BLR_CHOOSE
      FROM SYS_CONFIG C
     WHERE C.CODE = 'isBlrChoose'
       AND C.SFYX_ST = '1';
    IF V_IS_BLR_CHOOSE = 'false' THEN
      RETURN '0';
    END IF;
    --获取环节类型
    SELECT N.TYPE
      INTO V_NODE_TYPE
      FROM SYS_NODE N
     WHERE N.ID = IN_NODE_ID
       AND N.SFYX_ST = '1';
    IF V_NODE_TYPE = '2' THEN
      --活动环节
      SELECT A.BLR_CHOOSE
        INTO V_NODE_BLR_CHOOSE
        FROM SYS_ACTIVITY_NODE A, SYS_NODE N
       WHERE A.ID = IN_NODE_ID
         AND N.ID = A.ID
         AND N.SFYX_ST = '1';
    ELSIF V_NODE_TYPE = '5' THEN
      --嵌套环节
      SELECT A.BLR_CHOOSE
        INTO V_NODE_BLR_CHOOSE
        FROM SYS_NESTED_NODE A, SYS_NODE N
       WHERE A.ID = IN_NODE_ID
         AND N.ID = A.ID
         AND N.SFYX_ST = '1';
    ELSE
      --不是嵌套不是活动环节则返回0
      RETURN '0';
    END IF;
    IF V_NODE_BLR_CHOOSE = '1' THEN
      RETURN '1';
    ELSIF V_NODE_BLR_CHOOSE = '2' THEN
      RETURN '0';
    ELSE
      --默认，取系统配置
      SELECT C.VALUE
        INTO V_BLR_CHOOSE_DEF_VAL
        FROM SYS_CONFIG C
       WHERE C.CODE = 'blrChooseDefault'
         AND C.SFYX_ST = '1';
      RETURN CASE V_BLR_CHOOSE_DEF_VAL WHEN 'true' THEN '1' ELSE '0' END;
    END IF;
  END F_WF_GET_BLR_CHOOSE_CONFIG;

  --获取流程开始环节后第一活动环节
  FUNCTION F_WF_GET_FIRST_ACT_NODE(IN_WF_ID         INTEGER, --流程ID
                                   IN_START_WF_VARS VARCHAR2, --流程变量值如 VAR1:VAL1;VAR2:VAL2
                                   IN_USER_ID       INTEGER) --当前用户ID
   RETURN INTEGER AS
    V_CNT            INTEGER; --临时变量
    V_BRANCH         VARCHAR2(1000); --分支条件
    V_VAR_NAME       VARCHAR2(1000); --流程变量名
    V_VAR_VALUE      VARCHAR2(1000); --流程变量值
    V_FIRST_ACT_NODE INTEGER; --第一活动环节ID
    TYPE TYPE_VAR_TAB IS TABLE OF VARCHAR2(1000) INDEX BY VARCHAR2(1000);
    V_VAR_TAB TYPE_VAR_TAB; --用于临时存储流程变量
  BEGIN
    --解析传入流程变量存入临时表变量
    IF IN_START_WF_VARS IS NOT NULL THEN
      FOR L_CUR IN (SELECT * FROM TABLE(SPLITSTR(IN_START_WF_VARS, ';'))) LOOP
        V_VAR_NAME := SUBSTR(L_CUR.COLUMN_VALUE,
                             0,
                             INSTR(L_CUR.COLUMN_VALUE, ':') - 1);
        V_VAR_VALUE := SUBSTR(L_CUR.COLUMN_VALUE,
                              INSTR(L_CUR.COLUMN_VALUE, ':') + 1);
        V_VAR_TAB(V_VAR_NAME) := V_VAR_VALUE;
      END LOOP;
    END IF;
    --循环查找第一活动环节
    FOR L_CUR IN (SELECT R.BRANCH, R.END_NODE_ID
                    FROM SYS_ROUTER R, SYS_NODE NS, SYS_NODE NE
                   WHERE R.START_NODE_ID = NS.ID
                     AND R.END_NODE_ID = NE.ID
                     AND R.WORKFLOW_ID = IN_WF_ID
                     AND NS.TYPE = '0' -- 开始环节
                     AND NE.TYPE = '2' -- 活动环节
                     AND R.SFYX_ST = '1'
                     AND NS.SFYX_ST = '1'
                     AND NE.SFYX_ST = '1'
                   ORDER BY R.BRANCH NULLS LAST, NE.SORT) LOOP
      IF L_CUR.BRANCH IS NOT NULL THEN
        V_BRANCH := L_CUR.BRANCH;
        --循环替换流程变量值
        FOR LL_CUR IN (SELECT V.NAME, V.INITIAL_VALUE
                         FROM SYS_WORKFLOW_VARIABLE V
                        WHERE V.WORKFLOW_ID = IN_WF_ID
                          AND V.SFYX_ST = '1') LOOP
          --赋初始值
          V_VAR_VALUE := LL_CUR.INITIAL_VALUE;
          IF V_VAR_TAB.EXISTS(LL_CUR.NAME) THEN
            V_VAR_VALUE := V_VAR_TAB(LL_CUR.NAME);
          END IF;
          --替换流程变量值
          V_BRANCH := REPLACE(V_BRANCH,
                              '[WF:' || LL_CUR.NAME || ']',
                              V_VAR_VALUE);
        END LOOP;
        --计算条件表达式
        EXECUTE IMMEDIATE 'SELECT COUNT(1) FROM DUAL WHERE ' || V_BRANCH
          INTO V_CNT;
        IF V_CNT > 0 THEN
          --检查传入用户是否为办理人
          IF PKG_TRANSACTOR.F_CHECK_BLR_CONTAINS_USER(L_CUR.END_NODE_ID,
                                                      IN_USER_ID) = '1' THEN
            V_FIRST_ACT_NODE := L_CUR.END_NODE_ID;
            EXIT;
          END IF;
        END IF;
      ELSE
        --检查传入用户是否为办理人
        IF PKG_TRANSACTOR.F_CHECK_BLR_CONTAINS_USER(L_CUR.END_NODE_ID,
                                                    IN_USER_ID) = '1' THEN
          V_FIRST_ACT_NODE := L_CUR.END_NODE_ID;
          EXIT;
        END IF;
      END IF;
    END LOOP;
    --返回第一活动环节ID
    RETURN V_FIRST_ACT_NODE;
  END F_WF_GET_FIRST_ACT_NODE;

  --是否为第一活动环节
  FUNCTION F_WF_CHECK_FIRST_ACT_NODE(IN_NODE_INS_ID IN INTEGER) RETURN CHAR AS
    V_RESULT CHAR(1); --1是0否
  BEGIN
    SELECT (CASE
             WHEN TT.NODE_INSTANCE_ID = IN_NODE_INS_ID THEN
              '1'
             ELSE
              '0'
           END)
      INTO V_RESULT
      FROM SYS_TASK_INSTANCE TT
     WHERE TT.ID = (SELECT MIN(T.ID)
                      FROM SYS_TASK_INSTANCE T
                     WHERE T.WORKFLOW_INSTANCE_ID =
                           (SELECT TI.WORKFLOW_INSTANCE_ID
                              FROM SYS_TASK_INSTANCE TI
                             WHERE TI.NODE_INSTANCE_ID = IN_NODE_INS_ID
                               AND TI.SFYX_ST = '1'
                               AND ROWNUM = 1)
                       AND T.SFYX_ST = '1')
       AND TT.SFYX_ST = '1';
    RETURN V_RESULT;
  END F_WF_CHECK_FIRST_ACT_NODE;

  --计算流程所有环节的分支聚合点
  PROCEDURE P_WF_CALC_FORK_JOIN(IN_WF_ID INTEGER, OUT_ERROR OUT VARCHAR2)
  --计算聚合分支点
   AS
    V_ALL_PATH_TAB  TAB_STR; --从开始到结束全路径表
    V_NODE_PATH_TAB TAB_STR; --某环节路径表
    V_SHORT_PATH    VARCHAR2(4000); --最短路径
    V_FORK_ID       VARCHAR2(100); --分支点
    V_JOIN_ID       VARCHAR2(100); --聚合点
    V_FORK_PATH     VARCHAR2(4000); --查找分支的路径
    V_JOIN_PATH     VARCHAR2(4000); --查找聚合的路径
    V_COUNT         INTEGER; --临时计数
  BEGIN
    OUT_ERROR := 'SUCCESS';
    --将从开始到结束的所有路径计算出来放入路径表
    SELECT SUBSTR(PATH, INSTR(PATH, ',', 1, 2) + 1)
      BULK COLLECT
      INTO V_ALL_PATH_TAB
      FROM (SELECT DISTINCT SYS_CONNECT_BY_PATH(R.START_NODE_ID, ',') AS PATH
              FROM SYS_ROUTER R
             WHERE CONNECT_BY_ISLEAF = '1'
             START WITH R.START_NODE_ID IN
                        (SELECT N.ID
                           FROM SYS_NODE N
                          WHERE N.WORKFLOW_ID = IN_WF_ID
                            AND N.SFYX_ST = '1'
                            AND N.TYPE = '0')
            CONNECT BY NOCYCLE R.START_NODE_ID = PRIOR R.END_NODE_ID
                   AND R.SFYX_ST = '1')
     ORDER BY LENGTH(PATH);
    IF V_ALL_PATH_TAB.COUNT > 0 THEN
      --循环处理流程所有节点
      FOR L_CUR IN (SELECT DISTINCT N.ID,
                                    (SELECT COUNT(1)
                                       FROM SYS_ROUTER R
                                      WHERE R.START_NODE_ID = N.ID
                                        AND R.SFYX_ST = '1') AS FORK_NUM,
                                    (SELECT COUNT(1)
                                       FROM SYS_ROUTER R
                                      WHERE R.END_NODE_ID = N.ID
                                        AND R.SFYX_ST = '1') AS JOIN_NUM
                      FROM SYS_NODE N
                     WHERE N.WORKFLOW_ID = IN_WF_ID
                       AND N.SFYX_ST = '1') LOOP
        V_JOIN_ID       := '';
        V_FORK_ID       := '';
        V_SHORT_PATH    := '';
        V_NODE_PATH_TAB := TAB_STR();
        --筛选此节点所在路径
        FOR I IN 1 .. V_ALL_PATH_TAB.COUNT LOOP
          IF INSTR(V_ALL_PATH_TAB(I), L_CUR.ID) > 0 THEN
            --获取最短路径
            IF V_SHORT_PATH IS NULL OR
               LENGTH(V_SHORT_PATH) > LENGTH(V_ALL_PATH_TAB(I)) THEN
              V_SHORT_PATH := V_ALL_PATH_TAB(I);
            END IF;
            PKG_UTIL.P_TAB_PUSH(V_NODE_PATH_TAB, V_ALL_PATH_TAB(I));
          END IF;
        END LOOP;
        --就一条路径的话则没有分支点和聚合点
        IF V_SHORT_PATH IS NOT NULL AND V_NODE_PATH_TAB.COUNT > 1 THEN
          V_FORK_PATH := SUBSTR(V_SHORT_PATH,
                                0,
                                INSTR(V_SHORT_PATH, L_CUR.ID) - 1);
          V_JOIN_PATH := SUBSTR(V_SHORT_PATH,
                                INSTR(V_SHORT_PATH, L_CUR.ID) +
                                LENGTH(L_CUR.ID) + 1);
          --聚合条数大于1采取找分支点
          IF L_CUR.JOIN_NUM > 1 THEN
            --查找分支点
            FOR LL_CUR IN (SELECT *
                             FROM TABLE(SPLITSTR(V_FORK_PATH, ','))
                            ORDER BY ROWNUM DESC) LOOP
              V_COUNT := 0; --初始化数量
              FOR I IN 1 .. V_NODE_PATH_TAB.COUNT LOOP
                IF INSTR(SUBSTR(V_NODE_PATH_TAB(I),
                                0,
                                INSTR(V_NODE_PATH_TAB(I), L_CUR.ID) - 1),
                         LL_CUR.COLUMN_VALUE) > 0 THEN
                  V_COUNT := V_COUNT + 1;
                END IF;
              END LOOP;
              IF V_COUNT = V_NODE_PATH_TAB.COUNT THEN
                V_FORK_ID := LL_CUR.COLUMN_VALUE;
                EXIT;
              END IF;
            END LOOP;
          END IF;
          --分支条数大于1才去找聚合点
          IF L_CUR.FORK_NUM > 1 THEN
            --查找聚合点
            FOR LL_CUR IN (SELECT * FROM TABLE(SPLITSTR(V_JOIN_PATH, ','))) LOOP
              V_COUNT := 0; --初始化数量
              FOR I IN 1 .. V_NODE_PATH_TAB.COUNT LOOP
                IF INSTR(SUBSTR(V_NODE_PATH_TAB(I),
                                INSTR(V_NODE_PATH_TAB(I), L_CUR.ID) +
                                LENGTH(L_CUR.ID) + 1),
                         LL_CUR.COLUMN_VALUE) > 0 THEN
                  V_COUNT := V_COUNT + 1;
                END IF;
              END LOOP;
              IF V_COUNT = V_NODE_PATH_TAB.COUNT THEN
                V_JOIN_ID := LL_CUR.COLUMN_VALUE;
                EXIT;
              END IF;
            END LOOP;
          END IF;
        END IF;
        --更新环节分支点和聚合点
        UPDATE SYS_NODE N
           SET N.FORK_NODE_ID = V_FORK_ID, N.JOIN_NODE_ID = V_JOIN_ID
         WHERE N.ID = L_CUR.ID;
      END LOOP;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := '计算流程分支聚合环节点出现' || SQLERRM;
  END P_WF_CALC_FORK_JOIN;

  --验证环节是否可以实例化
  --返回1表示可以实例化0表示不可实例化
  FUNCTION F_WF_CHECK_NODE_CAN_INSTANCE(IN_NODE_ID   INTEGER,
                                        IN_WF_INS_ID INTEGER) RETURN CHAR AS
    --V_FORK_NODE_ID     INTEGER; --分支环节ID
    --V_FORK_NODE_INS_ID INTEGER; --分支环节实例ID
    V_COUNT INTEGER; --临时计数
  BEGIN
    --查找在此环节前的未完成的环节实例个数
    SELECT COUNT(1)
      INTO V_COUNT
      FROM SYS_NODE_INSTANCE NI
     WHERE NI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID
       AND NI.SFYX_ST = '1'
       AND NI.STATUS = '1' --运行
       AND NI.NODE_ID IN
           (SELECT DISTINCT R.START_NODE_ID
              FROM SYS_ROUTER R
             START WITH R.END_NODE_ID = IN_NODE_ID
            CONNECT BY NOCYCLE PRIOR R.START_NODE_ID = R.END_NODE_ID
                   AND R.SFYX_ST = '1');
    --若存在未完成的环节实例则不能实例化
    IF V_COUNT > 0 THEN
      RETURN '0';
    END IF;
    RETURN '1';
    /*SELECT N.FORK_NODE_ID
      INTO V_FORK_NODE_ID
      FROM SYS_NODE N
     WHERE N.ID = IN_NODE_ID
       AND N.SFYX_ST = '1';
    --分支点不为空则此环节为聚合环节
    IF V_FORK_NODE_ID IS NOT NULL THEN
      --获取分支环节实例ID
      SELECT MAX(NI.ID)
        INTO V_FORK_NODE_INS_ID
        FROM SYS_NODE_INSTANCE NI
       WHERE NI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID
         AND NI.SFYX_ST = '1'
         AND NI.NODE_ID = V_FORK_NODE_ID;
      --统计在分支聚合之间节点实例还未完成的个数
      SELECT COUNT(NI.ID)
        INTO V_COUNT
        FROM SYS_NODE_INSTANCE NI
       WHERE NI.WORKFLOW_INSTANCE_ID = IN_WF_INS_ID
         AND NI.SFYX_ST = '1'
         AND NI.STATUS = '1' --运行
         AND NI.ID > V_FORK_NODE_INS_ID --在分支环节实例化之后实例化的
         AND NI.NODE_ID IN --查找聚合和分支环节中间环节
             (SELECT DISTINCT R.END_NODE_ID
                FROM SYS_ROUTER R
               START WITH R.START_NODE_ID = V_FORK_NODE_ID
              CONNECT BY NOCYCLE R.START_NODE_ID = PRIOR R.END_NODE_ID
                     AND R.SFYX_ST = '1'
              INTERSECT
              SELECT DISTINCT R.START_NODE_ID
                FROM SYS_ROUTER R
               START WITH R.END_NODE_ID = IN_NODE_ID
              CONNECT BY NOCYCLE PRIOR R.START_NODE_ID = R.END_NODE_ID
                     AND R.SFYX_ST = '1');
      --若存在未完成的环节实例则不能实例化
      IF V_COUNT > 0 THEN
        RETURN '0';
      END IF;
    END IF;
    RETURN '1';*/
  END F_WF_CHECK_NODE_CAN_INSTANCE;

  --获取下一可以实例化的环节(含结束环节、活动环节、嵌套环节)
  FUNCTION F_WF_NEXT_INSTANCE_NODE(IN_NODE_ID   INTEGER, --当前环节ID
                                   IN_DECISION  VARCHAR2, --决策条件
                                   IN_WF_INS_ID INTEGER) --流程实例ID
   RETURN TAB_INT AS
    V_COUNT          INTEGER; --临时计数
    V_START_NODE_IDS VARCHAR2(4000); --起始环节IDS
    V_LOOP_TAB_NODE  TAB_INT := TAB_INT(IN_NODE_ID); --用于循环环节表
    V_DECISION_TYPE  SYS_DECISION_NODE.DECISION_TYPE%TYPE; --决策类型
    V_BRANCH         VARCHAR2(1000); --分支决策条件
    V_MATCH_BRANCH   BOOLEAN; --是否满足决策条件
    V_TAB_NODE       TAB_INT := TAB_INT(); --结果集
  BEGIN
    LOOP
      --退出条件当循环环节表为空
      EXIT WHEN V_LOOP_TAB_NODE.COUNT = 0;
      --临时存储用于循环的初始环节ID
      SELECT WM_CONCAT(COLUMN_VALUE)
        INTO V_START_NODE_IDS
        FROM TABLE(V_LOOP_TAB_NODE);
      --清空循环环节表
      V_LOOP_TAB_NODE.DELETE;
      --遍历下一环节
      FOR L_CUR IN (SELECT NS.ID    NS_ID,
                           NS.TYPE  NS_TYPE,
                           NE.ID    NE_ID,
                           NE.TYPE  NE_TYPE,
                           R.BRANCH
                      FROM SYS_ROUTER R, SYS_NODE NS, SYS_NODE NE
                     WHERE R.START_NODE_ID IN (V_START_NODE_IDS)
                       AND R.START_NODE_ID = NS.ID
                       AND R.END_NODE_ID = NE.ID
                       AND R.SFYX_ST = '1'
                       AND NS.SFYX_ST = '1'
                       AND NE.SFYX_ST = '1') LOOP
        --初始化决策匹配结果
        V_MATCH_BRANCH := FALSE;
        --若起始环节为决策环节
        IF L_CUR.NS_TYPE = '4' THEN
          --获取决策类型
          SELECT DN.DECISION_TYPE
            INTO V_DECISION_TYPE
            FROM SYS_DECISION_NODE DN
           WHERE DN.ID = L_CUR.NS_ID;
          --手动决策
          IF V_DECISION_TYPE = '0' THEN
            IF IN_DECISION = L_CUR.BRANCH THEN
              V_MATCH_BRANCH := TRUE;
            END IF;
            --自动决策
          ELSIF V_DECISION_TYPE = '1' THEN
            V_BRANCH := L_CUR.BRANCH;
            IF V_BRANCH IS NOT NULL THEN
              --替换流程变量值
              FOR V_CUR IN (SELECT P.NAME, P.VALUE
                              FROM (SELECT V.NAME,
                                           VI.VALUE,
                                           RANK() OVER(PARTITION BY VI.VARIABLE_ID ORDER BY VI.ID DESC) RN
                                      FROM SYS_WORKFLOW_VARIABLE          V,
                                           SYS_WORKFLOW_VARIABLE_INSTANCE VI
                                     WHERE V.ID = VI.VARIABLE_ID
                                       AND VI.WORKFLOW_INSTANCE_ID =
                                           IN_WF_INS_ID
                                       AND V.SFYX_ST = '1'
                                       AND VI.SFYX_ST = '1') P
                             WHERE P.RN = 1) LOOP
                --替换流程变量值
                V_BRANCH := REPLACE(V_BRANCH,
                                    '[WF:' || V_CUR.NAME || ']',
                                    V_CUR.VALUE);
              END LOOP;
              --计算条件表达式
              EXECUTE IMMEDIATE 'SELECT COUNT(1) FROM DUAL WHERE ' ||
                                V_BRANCH
                INTO V_COUNT;
              IF V_COUNT > 0 THEN
                V_MATCH_BRANCH := TRUE;
              END IF;
            ELSE
              --决策条件为空也匹配
              V_MATCH_BRANCH := TRUE;
            END IF;
          END IF;
        END IF;
        IF L_CUR.NS_TYPE <> '4' OR V_MATCH_BRANCH THEN
          --结束环节、活动环节、嵌套环节
          IF L_CUR.NE_TYPE IN ('1', '2', '5') THEN
            PKG_UTIL.P_TAB_PUSH(V_TAB_NODE, L_CUR.NE_ID);
          ELSIF L_CUR.NE_TYPE = '4' THEN
            PKG_UTIL.P_TAB_PUSH(V_LOOP_TAB_NODE, L_CUR.NE_ID);
          END IF;
        END IF;
      END LOOP;
    END LOOP;
    RETURN V_TAB_NODE;
  END F_WF_NEXT_INSTANCE_NODE;

  --获取退回环节ID,NAME数据集
  FUNCTION F_WF_GET_BACK_NODES(IN_NODE_ID INTEGER, IN_WF_INS_ID INTEGER)
    RETURN SYS_REFCURSOR AS
    V_OUT_CUR            SYS_REFCURSOR;
    V_TAB_NODE_WF        TAB_STR := TAB_STR(IN_NODE_ID || '|' ||
                                            IN_WF_INS_ID);
    V_NODE_INS_ID        INTEGER; --环节实例ID
    V_NODE_TYPE          CHAR(1); --环节类型
    V_STARTUP_TYPE       CHAR(1); --启动方式
    V_NODE_WF_IDS        VARCHAR2(4000);
    V_NEST_NODE_INS_ID   INTEGER; --嵌套流程ID
    V_DISAGREE_NODE_ID   INTEGER; --指定的退回环节ID
    V_DEF_BACK_NODE_ID   INTEGER; --嵌套流程默认退回环节ID
    V_DEF_BACK_NODE_NAME SYS_NODE.NAME%TYPE; --嵌套流程默认退回环节名称
    V_COUNT              INTEGER; --临时计数
    V_WF_INS_ID          INTEGER := IN_WF_INS_ID;
  BEGIN
    --清空临时表结果集
    DELETE FROM TEMP_NODE_WF;
    --查看环节类型
    SELECT N.TYPE
      INTO V_NODE_TYPE
      FROM SYS_NODE N
     WHERE N.ID = IN_NODE_ID
       AND N.SFYX_ST = '1';
    --活动环节可以指定退回点
    IF V_NODE_TYPE = '2' THEN
      --获取流程的启动方式
      SELECT WI.STARTUP_TYPE, WI.NODE_INSTANCE_ID
        INTO V_STARTUP_TYPE, V_NEST_NODE_INS_ID
        FROM SYS_WORKFLOW_INSTANCE WI
       WHERE WI.ID = V_WF_INS_ID
         AND WI.SFYX_ST = '1';
      --获取环节实例ID
      SELECT MAX(NI.ID)
        INTO V_NODE_INS_ID
        FROM SYS_NODE_INSTANCE NI
       WHERE NI.NODE_ID = IN_NODE_ID
         AND NI.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
         AND NI.SFYX_ST = '1';
      --若是嵌套启动且退回环节为子流程的第一活动环节
      IF V_STARTUP_TYPE = '1' AND V_NEST_NODE_INS_ID IS NOT NULL AND
         PKG_WF.F_WF_CHECK_FIRST_ACT_NODE(V_NODE_INS_ID) = '1' THEN
        --获取嵌套环节默认退回点
        SELECT NN.DISAGREE_NODE_ID, NI.WORKFLOW_INSTANCE_ID
          INTO V_DISAGREE_NODE_ID, V_WF_INS_ID
          FROM SYS_NESTED_NODE NN, SYS_NODE_INSTANCE NI
         WHERE NN.ID = NI.NODE_ID
           AND NI.ID = V_NEST_NODE_INS_ID
           AND NI.SFYX_ST = '1';
        --初始化循环查找开始环节
        SELECT NI.NODE_ID || '|' || NI.WORKFLOW_INSTANCE_ID
          BULK COLLECT
          INTO V_TAB_NODE_WF
          FROM SYS_NODE_INSTANCE NI
         WHERE NI.ID = V_NEST_NODE_INS_ID
           AND NI.SFYX_ST = '1';
      ELSE
        --查找指定退回点
        SELECT A.DISAGREE_NODE_ID
          INTO V_DISAGREE_NODE_ID
          FROM SYS_ACTIVITY_NODE A
         WHERE A.ID = IN_NODE_ID;
      END IF;
      IF V_DISAGREE_NODE_ID IS NOT NULL THEN
        --查看是否实例化过
        SELECT COUNT(1)
          INTO V_COUNT
          FROM SYS_NODE_INSTANCE NI
         WHERE NI.WORKFLOW_INSTANCE_ID = V_WF_INS_ID
           AND NI.NODE_ID = V_DISAGREE_NODE_ID
           AND NI.SFYX_ST = '1';
      END IF;
    END IF;
    --指定退回点存在且实例化过
    IF V_DISAGREE_NODE_ID IS NOT NULL AND V_COUNT > 0 THEN
      INSERT INTO TEMP_NODE_WF
        (NODE_ID, NODE_NAME, WF_INS_ID)
        SELECT N.ID, N.NAME, V_WF_INS_ID
          FROM SYS_NODE N
         WHERE N.ID = V_DISAGREE_NODE_ID
           AND N.SFYX_ST = '1';
    ELSE
      LOOP
        EXIT WHEN V_TAB_NODE_WF.COUNT = 0;
        SELECT WM_CONCAT(COLUMN_VALUE)
          INTO V_NODE_WF_IDS
          FROM TABLE(V_TAB_NODE_WF);
        V_TAB_NODE_WF.DELETE;
        --循环处理所有分支
        FOR L_CUR IN (SELECT N.ID,
                             N.TYPE,
                             N.NAME,
                             TO_NUMBER(SUBSTR(T.COLUMN_VALUE,
                                              INSTR(T.COLUMN_VALUE, '|') + 1)) WF_INS_ID
                        FROM TABLE(SPLITSTR(V_NODE_WF_IDS, ',')) T,
                             SYS_ROUTER R,
                             SYS_NODE N
                       WHERE TO_NUMBER(SUBSTR(T.COLUMN_VALUE,
                                              0,
                                              INSTR(T.COLUMN_VALUE, '|') - 1)) =
                             R.END_NODE_ID
                         AND R.START_NODE_ID = N.ID
                         AND R.SFYX_ST = '1'
                         AND N.SFYX_ST = '1') LOOP
          --活动环节
          IF L_CUR.TYPE = '2' THEN
            --加入结果集
            INSERT INTO TEMP_NODE_WF
              (NODE_ID, NODE_NAME, WF_INS_ID)
            VALUES
              (L_CUR.ID, L_CUR.NAME, L_CUR.WF_INS_ID);
            --嵌套环节
          ELSIF L_CUR.TYPE = '5' THEN
            --获取嵌套环节实例ID
            SELECT MAX(NI.ID)
              INTO V_NEST_NODE_INS_ID
              FROM SYS_NODE_INSTANCE NI
             WHERE NI.WORKFLOW_INSTANCE_ID = L_CUR.WF_INS_ID
               AND NI.NODE_ID = L_CUR.ID
               AND NI.SFYX_ST = '1';
            --获取默认退回环节
            SELECT N.DEFAULT_BACK_NODE_ID
              INTO V_DEF_BACK_NODE_ID
              FROM SYS_NESTED_NODE N
             WHERE N.ID = L_CUR.ID;
            --循环处理子流程
            FOR V_CUR IN (SELECT WI.ID
                            FROM SYS_WORKFLOW_INSTANCE WI
                           WHERE WI.NODE_INSTANCE_ID = V_NEST_NODE_INS_ID
                             AND WI.SFYX_ST = '1'
                             AND WI.STATUS = '0'
                             AND WI.STARTUP_TYPE = '1') LOOP
              --验证是否存在默认退回环节实例
              IF V_DEF_BACK_NODE_ID IS NOT NULL THEN
                SELECT COUNT(1)
                  INTO V_COUNT
                  FROM SYS_NODE_INSTANCE NI
                 WHERE NI.SFYX_ST = '1'
                   AND NI.WORKFLOW_INSTANCE_ID = V_CUR.ID
                   AND NI.NODE_ID = V_DEF_BACK_NODE_ID;
              END IF;
              --若默认退回环节为空或者没有环节实例取最后一个活动环节实例
              IF V_DEF_BACK_NODE_ID IS NULL OR V_COUNT = 0 THEN
                SELECT NP.ID, NP.NAME
                  INTO V_DEF_BACK_NODE_ID, V_DEF_BACK_NODE_NAME
                  FROM (SELECT N.ID, N.NAME
                          FROM SYS_NODE_INSTANCE NI, SYS_NODE N
                         WHERE NI.NODE_ID = N.ID
                           AND NI.WORKFLOW_INSTANCE_ID = V_CUR.ID
                           AND N.TYPE = '2' --活动环节
                           AND NI.SFYX_ST = '1'
                           AND N.SFYX_ST = '1'
                         ORDER BY NI.ID DESC) NP
                 WHERE ROWNUM = 1;
              END IF;
              --插入结果集
              INSERT INTO TEMP_NODE_WF
                (NODE_ID,
                 NODE_NAME,
                 NEST_NODE_ID,
                 NEST_NODE_NAME,
                 WF_INS_ID)
              VALUES
                (V_DEF_BACK_NODE_ID,
                 V_DEF_BACK_NODE_NAME,
                 L_CUR.ID,
                 L_CUR.NAME,
                 V_CUR.ID);
            END LOOP;
            --决策环节
          ELSIF L_CUR.TYPE = '4' THEN
            --加入下次循环
            PKG_UTIL.P_TAB_PUSH(V_TAB_NODE_WF,
                                L_CUR.ID || '|' || L_CUR.WF_INS_ID);
          END IF;
        END LOOP;
      END LOOP;
    END IF;
    --打开游标
    OPEN V_OUT_CUR FOR
      SELECT T.NODE_ID,
             T.NODE_NAME,
             T.NEST_NODE_ID,
             T.NEST_NODE_NAME,
             T.WF_INS_ID,
             U.USER_NAME
        FROM TEMP_NODE_WF T, SYS_WORKFLOW_INSTANCE WI, SYS_USER U
       WHERE T.WF_INS_ID = WI.ID
         AND WI.STARTUP_USER_ID = U.ID
         AND WI.SFYX_ST = '1'
         AND U.SFYX_ST <> '0'
         AND EXISTS (SELECT 1
                FROM SYS_NODE_INSTANCE NI
               WHERE NI.WORKFLOW_INSTANCE_ID = T.WF_INS_ID
                 AND T.NODE_ID = NI.NODE_ID
                 AND NI.SFYX_ST = '1');
    RETURN V_OUT_CUR;
  END F_WF_GET_BACK_NODES;

  --检查流程是否已完成，含父流程 1完成0未完成
  FUNCTION F_WF_CHECK_IS_FINISH(IN_WF_INS_ID INTEGER) RETURN CHAR AS
    V_WF_INS       SYS_WORKFLOW_INSTANCE%ROWTYPE;
    V_MASTER_WF_ID INTEGER; --父流程实例ID
  BEGIN
    --查询流程实例记录
    SElECT WI.*
      INTO V_WF_INS
      FROM SYS_WORKFLOW_INSTANCE WI
     WHERE WI.ID = IN_WF_INS_ID
       AND WI.SFYX_ST = '1';
    --若手动启动且完成则完成
    IF V_WF_INS.STARTUP_TYPE = '0' THEN
      IF V_WF_INS.STATUS IN ('0', '3') THEN
        RETURN '1';
      ELSE
        RETURN '0';
      END IF;
    ELSIF V_WF_INS.STARTUP_TYPE = '1' THEN
      IF V_WF_INS.STATUS IN ('0', '3') THEN
        --查询父流程实例ID
        SELECT NI.WORKFLOW_INSTANCE_ID
          INTO V_MASTER_WF_ID
          FROM SYS_NODE_INSTANCE NI
         WHERE NI.ID = V_WF_INS.NODE_INSTANCE_ID
           AND NI.SFYX_ST = '1';
        RETURN PKG_WF.F_WF_CHECK_IS_FINISH(V_MASTER_WF_ID);
      ELSE
        RETURN '0';
      END IF;
    ELSE
      RAISE_APPLICATION_ERROR(-20005,
                              '暂不支持的流程启动方式[' || V_WF_INS.STARTUP_TYPE || ']');
    END IF;
  END F_WF_CHECK_IS_FINISH;

END PKG_WF;
/

prompt
prompt Creating package body PKG_WF_DAMIC_USER
prompt =======================================
prompt
CREATE OR REPLACE PACKAGE BODY PKG_WF_DAMIC_USER IS
  PROCEDURE P_WORKFLOW_START_USER(IN_WF_INS_ID NUMBER) ----流程实例ID
    /*--------------------------------------*/
    ---名称/功能：查找流程启动人
    ---创建人：骆斌
    ---创建时间：2016.11-29
   IS
  BEGIN
    INSERT INTO TEMP_USER
      SELECT WI.STARTUP_USER_ID
        FROM SYS_WORKFLOW_INSTANCE WI
       WHERE WI.ID = IN_WF_INS_ID
         AND WI.STARTUP_TYPE = '0'
         AND WI.SFYX_ST = '1';

  END P_WORKFLOW_START_USER;

  PROCEDURE P_WORKFLOW_START_USER_MANAGER(IN_WF_INS_ID NUMBER) IS
    V_START_USER_ID       NUMBER; -- 启动人ID
    V_START_USER_ORGAN_ID NUMBER; --启动人机构ID
  BEGIN
    SELECT U.ID, U.DEFAULT_ORGAN_ID
      INTO V_START_USER_ID, V_START_USER_ORGAN_ID
      FROM SYS_USER U, SYS_WORKFLOW_INSTANCE WI
     WHERE U.ID = WI.STARTUP_USER_ID
       AND WI.ID = IN_WF_INS_ID
       AND WI.SFYX_ST = '1'
       AND WI.STARTUP_TYPE = '0'
       AND U.SFYX_ST = '1';

    INSERT INTO TEMP_USER
      SELECT G.USER_ID
        FROM SYS_GLB_USER G
       WHERE G.ORGAN_ID = V_START_USER_ORGAN_ID
         AND G.SFYX_ST = '1'
      INTERSECT
      SELECT GR.USER_ID
        FROM SYS_GLB_ROLE_USER GR, SYS_ROLE R
       WHERE GR.ROLE_ID = R.ID
         AND R.SFYX_ST = '1'
         AND R.ROLE_CODE = 'JINGLI';

  END;

  PROCEDURE P_WORKFLOW_DAMIC_USER_YZ(IN_WORKFLOW_CODE VARCHAR2, --流程代码
                                     IN_DATA_ID       NUMBER, --业务数据ID
                                     OUT_STR          OUT VARCHAR2, --返回信息
                                     OUT_ERROR        OUT VARCHAR2) --返回程序执行情况
    /*--------------------------------------*/
    ---名称/功能：验证工作流中sql维护的动态角色是否都能找到办理人
    /*--------------------------------------*/
   IS
    V_WORKFLOW_ID NUMBER; --流程ID
    V_CT          NUMBER; --计数
    V_ROLE_SQL    VARCHAR2(4000); --执行的动态SQL
  BEGIN
    OUT_ERROR := 'SUCCESS';
    --找出流程ID
    SELECT MAX(ID)
      INTO V_WORKFLOW_ID
      FROM SYS_WORKFLOW
     WHERE CODE = IN_WORKFLOW_CODE
       AND SFYX_ST = '1';
    --查出该工作流是否维护了SQL规则的动态角色
    SELECT COUNT(1)
      INTO V_CT
      FROM SYS_NODE              N,
           SYS_TRANSACT_NODE     TN,
           SYS_ROLE              R,
           SYS_GLB_ROLE_AUTHRULE T,
           SYS_AUTH_RULE         A,
           SYS_BASE_RULE         B
     WHERE N.WORKFLOW_ID = V_WORKFLOW_ID
       AND N.ID = TN.ID
       AND TN.ROLE_ID = R.ID
       AND T.ROLE_ID = R.ID
       AND T.RULE_ID = A.ID
       AND A.GL_RULE_ID = B.ID
       AND N.SFYX_ST = '1'
       AND R.SFYX_ST = '1'
       AND T.SFYX_ST = '1'
       AND A.SFYX_ST = '1'
       AND B.SFYX_ST = '1'
       AND B.SXFS = '1';
    --如果没有维护SQL规则的动态角色则返回无，如果有维护的话则查找是否有办理人
    IF V_CT = 0 THEN
      OUT_STR := '无';
    ELSE
      OUT_STR := '有';
      --找出所有的规则并对规则是否查出办理人进行判断
      FOR I IN (SELECT B.RULE_DETAIL, R.ROLE_NAME
                  FROM SYS_NODE              N,
                       SYS_TRANSACT_NODE     TN,
                       SYS_ROLE              R,
                       SYS_GLB_ROLE_AUTHRULE T,
                       SYS_AUTH_RULE         A,
                       SYS_BASE_RULE         B
                 WHERE N.WORKFLOW_ID = V_WORKFLOW_ID
                   AND N.ID = TN.ID
                   AND TN.ROLE_ID = R.ID
                   AND T.ROLE_ID = R.ID
                   AND T.RULE_ID = A.ID
                   AND A.GL_RULE_ID = B.ID
                   AND N.SFYX_ST = '1'
                   AND R.SFYX_ST = '1'
                   AND T.SFYX_ST = '1'
                   AND A.SFYX_ST = '1'
                   AND B.SFYX_ST = '1'
                   AND B.SXFS = '1') LOOP
        V_ROLE_SQL := REPLACE(UPPER(I.RULE_DETAIL), ':DATA_ID', IN_DATA_ID);
        V_ROLE_SQL := REPLACE(V_ROLE_SQL, '<BR>', ' ');
        V_ROLE_SQL := 'SELECT COUNT(1) FROM ( ' || V_ROLE_SQL || ')';
        EXECUTE IMMEDIATE V_ROLE_SQL
          INTO V_CT;
        IF V_CT = 0 THEN
          OUT_STR := OUT_STR || ',' || I.ROLE_NAME || '未找到相关人员';
        END IF;
      END LOOP;
    END IF;
    IF OUT_STR <> '有' AND OUT_STR <> '无' THEN
      OUT_STR := OUT_STR || ',' || '请维护好相关人员后再发起流程';
    END IF;
    --异常处理
  EXCEPTION
    WHEN OTHERS THEN
      OUT_ERROR := '验证sql维护的动态角色时发生异常: ' || SQLERRM;
      ROLLBACK;
  END P_WORKFLOW_DAMIC_USER_YZ;

END PKG_WF_DAMIC_USER;
/


spool off
