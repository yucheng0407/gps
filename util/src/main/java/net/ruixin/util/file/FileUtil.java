package net.ruixin.util.file;

import net.ruixin.util.exception.BizExceptionEnum;
import net.ruixin.util.exception.BussinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.Objects;

public class FileUtil {

    private static final Logger log = LoggerFactory.getLogger(FileUtil.class);

    /**
     * NIO way
     */
    public static byte[] toByteArray(String filename) {
        File f = new File(filename);
        if (!f.exists()) {
            log.error("文件未找到！" + filename);
            throw new BussinessException(BizExceptionEnum.FILE_NOT_FOUND, filename);
        }
        try (FileInputStream fs = new FileInputStream(f);
             FileChannel channel = fs.getChannel()) {
            ByteBuffer byteBuffer = ByteBuffer.allocate((int) channel.size());
            while ((channel.read(byteBuffer)) > 0) {
            }
            return byteBuffer.array();
        } catch (IOException e) {
            throw new BussinessException(BizExceptionEnum.FILE_READING_ERROR, filename);
        }
    }
}