package net.ruixin.service.plat.shiro.server;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.SimpleSession;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;

public class SessionRedisDao  extends EnterpriseCacheSessionDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionRedisDao.class);

    // 创建session，保存到数据库
    @Override
    protected Serializable doCreate(Session session) {
        Serializable sessionId = super.doCreate(session);
        try {
            RedisHelper.setObject(sessionId.toString().getBytes("utf-8"), sessionToByte(session));
        } catch (UnsupportedEncodingException e) {
            LOGGER.error("编码不支持",e);
        }
        return sessionId;
    }

    // 获取session
    @Override
    protected Session doReadSession(Serializable sessionId) {
        // 先从缓存中获取session，如果没有再去数据库中获取
        Session session = super.doReadSession(sessionId);
        if(session == null){
            byte[] bytes = new byte[0];
            try {
                bytes = RedisHelper.getObject(sessionId.toString().getBytes("utf-8"));
            } catch (UnsupportedEncodingException e) {
                LOGGER.error("编码不支持",e);
            }
            if(bytes != null && bytes.length > 0){
                session = byteToSession(bytes);
            }
        }
        return session;
    }

    // 更新session的最后一次访问时间
    @Override
    protected void doUpdate(Session session) {
        super.doUpdate(session);
        try {
            RedisHelper.setObject(session.getId().toString().getBytes("utf-8"), sessionToByte(session));
        } catch (UnsupportedEncodingException e) {
            LOGGER.error("编码不支持",e);
        }
    }

    // 删除session
    @Override
    protected void doDelete(Session session) {
        super.doDelete(session);
        RedisHelper.delString(session.getId() + "");
    }

    // 把session对象转化为byte保存到redis中
    public byte[] sessionToByte(Session session){
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        byte[] bytes = null;
        try {
            ObjectOutputStream oo = new ObjectOutputStream(bo);
            oo.writeObject(session);
            bytes = bo.toByteArray();
        } catch (IOException e) {
            LOGGER.error("编码不支持",e);
        }
        return bytes;
    }

    // 把byte还原为session
    public Session byteToSession(byte[] bytes){
        ByteArrayInputStream bi = new ByteArrayInputStream(bytes);
        ObjectInputStream in;
        SimpleSession session = null;
        try {
            in = new ObjectInputStream(bi);
            session = (SimpleSession) in.readObject();
        } catch (ClassNotFoundException | IOException e) {
            LOGGER.error("byte还原为session失败",e);
        }
        return session;
    }


}
