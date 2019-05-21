package net.ruixin.controller.plat.workflow;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/transactor")
public class TransactorMapping {

    @RequestMapping(value = "/transactorList")
    public String transactorList() {
        return "plat/workflow/transactor/transactorList";
    }

    @RequestMapping(value = "/transactorEdit")
    public String transactorEdit() {
        return "plat/workflow/transactor/transactorEdit";
    }

    @RequestMapping(value = "/transactorSelect")
    public String transactorSelect() {
        return "plat/workflow/transactor/transactorSelect";
    }

    @RequestMapping(value = "/transactorSourceSelect")
    public String transactorSourceSelect() {
        return "plat/workflow/transactor/transactorSourceSelect";
    }

    @RequestMapping(value = "/userEdit")
    public String userEdit() {
        return "plat/workflow/transactor/userEdit";
    }

    @RequestMapping(value = "/organEdit")
    public String organEdit() {
        return "plat/workflow/transactor/organEdit";
    }

    @RequestMapping(value = "/organSelect")
    public String organSelect() {
        return "plat/workflow/transactor/organSelect";
    }

    @RequestMapping(value = "/roleEdit")
    public String roleEdit() {
        return "plat/workflow/transactor/roleEdit";
    }

    @RequestMapping(value = "/conditionEdit")
    public String conditionEdit() {
        return "plat/workflow/transactor/conditionEdit";
    }

    @RequestMapping(value = "/ruleEdit")
    public String ruleEdit() {
        return "plat/workflow/transactor/ruleEdit";
    }

}
