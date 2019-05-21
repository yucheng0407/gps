package net.ruixin.domain.gps;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.domain.plat.auth.SysGlbRole;
import net.ruixin.domain.rule.Restrict;
import net.ruixin.domain.rule.Rule;
import net.ruixin.enumerate.plat.SfyxSt;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 组织机构实体
 *
 * @author Pitcher
 */
@SuppressWarnings("unused")
@Table(name = "T_GEO_JLZY_JBXX")
@Entity
@DynamicInsert
@DynamicUpdate
public class Sbxx extends BaseDomain {
    @Id

    @SequenceGenerator(name = "SEQ_GEO_JLZY_JBXX", sequenceName = "SEQ_GEO_JLZY_JBXX", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_GEO_JLZY_JBXX")
    private Long id;
    //组织编码
    @Column(name = "ZYID")
    private String zyid;
    //组织简称
    @Column(name = "SBBH")
    private String sbbh;
    //组织全称
    @Column(name = "SBLX")
    private String sblx;
    //上级组织
    @Column(name = "TBMC")
    private String tbmc;
    @Column(name = "SSPCSDM")
    private String sspcsdm;
    @Column(name = "SSPCSMC")
    private String sspcsmc;
    @Column(name = "SBMC")
    private String sbmc;
    @Column(name = "JC")
    private String jc;
    @Column(name = "BZ")
    private String bz;
    //创建时间
    @Temporal(TemporalType.DATE)
    @Column(name = "XZSJ")
    private Date xzsj;
    //修改人
    @Column(name = "CZYH")
    private Long czyh;
    //修改人
    @Column(name = "CZBS")
    private String czbs;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZyid() {
        return zyid;
    }

    public void setZyid(String zyid) {
        this.zyid = zyid;
    }

    public String getSbbh() {
        return sbbh;
    }

    public void setSbbh(String sbbh) {
        this.sbbh = sbbh;
    }

    public String getSblx() {
        return sblx;
    }

    public void setSblx(String sblx) {
        this.sblx = sblx;
    }

    public String getTbmc() {
        return tbmc;
    }

    public void setTbmc(String tbmc) {
        this.tbmc = tbmc;
    }

    public String getSspcsdm() {
        return sspcsdm;
    }

    public void setSspcsdm(String sspcsdm) {
        this.sspcsdm = sspcsdm;
    }

    public String getSspcsmc() {
        return sspcsmc;
    }

    public void setSspcsmc(String sspcsmc) {
        this.sspcsmc = sspcsmc;
    }

    public String getSbmc() {
        return sbmc;
    }

    public void setSbmc(String sbmc) {
        this.sbmc = sbmc;
    }

    public Date getXzsj() {
        return xzsj;
    }

    public void setXzsj(Date xzsj) {
        this.xzsj = xzsj;
    }

    public Long getCzyh() {
        return czyh;
    }

    public void setCzyh(Long czyh) {
        this.czyh = czyh;
    }

    public String getJc() {
        return jc;
    }

    public void setJc(String jc) {
        this.jc = jc;
    }

    public String getBz() {
        return bz;
    }

    public void setBz(String bz) {
        this.bz = bz;
    }

    public String getCzbs() {
        return czbs;
    }

    public void setCzbs(String czbs) {
        this.czbs = czbs;
    }
}
