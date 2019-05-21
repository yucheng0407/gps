package net.ruixin.controller.plat.update;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.attachment.Attachment;
import net.ruixin.service.plat.attachment.IAttachmentService;
import net.ruixin.service.plat.update.IUpdateService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.exception.BizExceptionEnum;
import net.ruixin.util.exception.UploadException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;

@Controller
@RequestMapping("/appUpdate")
public class UpdateController extends BaseController {

    @Autowired
    private IUpdateService updateService;

    @Autowired
    private IAttachmentService attachmentService;

    private static final Logger LOGGER = LoggerFactory.getLogger(UpdateController.class);

    /**
     * 验证是否需要更新
     */
    @RequestMapping(value = "/updateVali", method = RequestMethod.POST)
    @ResponseBody
    public AjaxReturn updateVali() {
        AjaxReturn aj = new AjaxReturn();
        String hash = super.getPara("hash").trim();
        String userroleid = super.getPara("userroleid").trim();
        return aj.setSuccess(true).setData(updateService.getUpdateVali(hash, userroleid));
    }

    /**
     * 通过附件id下载附件
     *
     * @param id 附件id
     * @return ResponseEntity
     */
    @RequestMapping("/downloadApp")
    public void download(HttpServletResponse response, Long id, Long pid) {
        BufferedInputStream bins = null;
        OutputStream outs = null;
        BufferedOutputStream bouts = null;
        long currentLen = 0;// 已读取文件大小
        long totleLen = 0L;// 总文件大小
        double percent = 0.0; //下载进度
        byte[] content = null;
        try {
            Attachment attachment = attachmentService.getAttachmentById(id);
            if (attachment != null) {
                content = attachmentService.getContent(attachment);
                totleLen = content.length;
            } else {
                throw new UploadException(BizExceptionEnum.FILE_NOT_FOUND, "附件id:" + id);
            }
            bins = new BufferedInputStream(new ByteArrayInputStream(content));
            outs = response.getOutputStream();// 获取文件输出IO流
            bouts = new BufferedOutputStream(outs);
            response.setContentType("application/x-download");// 设置response内容的类型
            response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(attachment.getName(), "UTF-8"));// 设置头部信息
            response.setHeader("Content-Length", "" + totleLen);
            int bytesRead = 0;
            byte[] buffer = new byte[1024];
            // 开始向网络传输文件流
            while ((bytesRead = bins.read(buffer)) != -1) {
                currentLen += bytesRead;
                bouts.write(buffer, 0, bytesRead);
            }
            bouts.flush();// 这里一定要调用flush()方法
            // 获取下载进度
            percent = Math.ceil(currentLen * 1.0 / totleLen * 10000);
            if (percent == 10000) {
                //插入完成日志
                updateService.updateDownloadTimes(pid);
            }
        } catch (Exception e) {
            if (totleLen > 0) {
                percent = Math.ceil(currentLen * 1.0 / totleLen * 10000);
            }
            LOGGER.error("下载中断或者网络异常表示没下载完,当前下载进度:{};{}", percent / 100.0 + "%", e.getMessage(), e);
        } finally {
            try {
                if (bins != null) {
                    bins.close();
                }
                if (outs != null) {
                    outs.close();
                }
                if (bouts != null) {
                    bouts.close();
                }
            } catch (IOException e) {
                LOGGER.error("流关闭失败", e);
            }
        }

    }

}
