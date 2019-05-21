package net.ruixin.service.plat.shiro.server;

import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.exceptions.JedisException;

public class RedisHelper {
    private static JedisPool jedisPool;
    private static Logger logger = LoggerFactory.getLogger(RedisHelper.class);

    static {
        initPool();
    }

    private static void initPool() {
        JedisPoolConfig config = new JedisPoolConfig();
        //最大连接数
        config.setMaxTotal(CacheKit.get(Cache.CONFIG, "maxActive"));
        //最大空闲连接
        config.setMaxIdle(CacheKit.get(Cache.CONFIG, "maxIdle"));
        //最大阻塞等待时间
        config.setMaxWaitMillis(CacheKit.get(Cache.CONFIG, "maxWait"));
        config.setTestOnBorrow(false);
        final String ip = CacheKit.get(Cache.CONFIG, "redisIp");
        final int port = CacheKit.get(Cache.CONFIG, "redisPort");
        jedisPool = new JedisPool(config, ip, port);
    }

    // 从连接池获取redis连接
    public static Jedis getJedis() {
        if (jedisPool == null) {
            initPool();
        }
        return jedisPool.getResource();
    }

    //回收redis连接
    private static void recycleJedis(Jedis jedis) {
        if (jedis != null) {
            jedis.close();
        }
    }

    //保存byte类型数据
    public static void setObject(byte[] key, byte[] value) {
        Jedis jedis = getJedis();
        if(jedis != null){
            try{
                if(!jedis.exists(key)){
                    jedis.set(key, value);
                }
                // redis中session过期时间
                int expireTime = 1800;
                jedis.expire(key, expireTime);
            } catch(Exception e){
                throw new JedisException("保存Redis缓存数据异常");
            } finally{
                recycleJedis(jedis);
            }
        }

    }

    // 获取byte类型数据
    public static byte[] getObject(byte[] key) {
        Jedis jedis = getJedis();
        byte[] bytes = null;
        if(jedis != null){
            try{
                bytes = jedis.get(key);
            }catch(Exception e){
                throw new JedisException("获取Redis缓存数据异常");
            } finally{
                recycleJedis(jedis);
            }
        }
        return bytes;
    }

    //清除缓存
    public static void delString(String key) {
        Jedis jedis = getJedis();
        if(jedis != null){
            try{
                jedis.del(key);
            }catch(Exception e){
                throw new JedisException("删除Redis缓存数据异常");
            } finally{
                recycleJedis(jedis);
            }
        }

    }
}
