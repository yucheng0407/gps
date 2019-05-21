package net.ruixin.controller.gps;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/main")
public class GpsMapping {

    @RequestMapping("/sbst")
    public String sbst() {
        return "/gps/sbst/sbst";
    }
    @RequestMapping("/gjbf")
    public String gjbf() {
        return "/gps/gjbf/gjbf";
    }
    @RequestMapping("/sbbhTree")
    public String sbbhTree() {
        return "/gps/sbbhTree/sbbhTree";
    }
    @RequestMapping("/sbxx")
    public String sbxx() {
        return "/gps/sbxx/sbxx";
    }
}
