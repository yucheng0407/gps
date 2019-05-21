package net.ruixin.util.cache;

import net.sf.ehcache.Element;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * 通用缓存接口
 */
public interface ICache {

    void put(String cacheName, Object key, Object value);

    void put(String cacheName,Object key,Object value,Integer liveSeconds);

    <T> T get(String cacheName, Object key);

    @SuppressWarnings("rawtypes")
    List getKeys(String cacheName);

    Map<Object, Element> getAll(String cacheName);

    void remove(String cacheName, Object key);

    void removeAll(String cacheName);

    void putAll(String cacheName, Collection<Element> elements);
}
