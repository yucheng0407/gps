package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeInstanceDao;
import net.ruixin.dao.plat.workflow.ISysTaskDao;
import net.ruixin.dao.plat.workflow.IWorkflowDao;
import net.ruixin.dao.plat.workflow.IWorkflowInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.enumerate.plat.*;
import net.ruixin.service.plat.workflow.IDiagramService;
import net.ruixin.util.tools.Dom4jUtil;
import net.ruixin.util.workflow.constant.NodeType;
import net.ruixin.util.workflow.draw.activiti.ProcessDiagramGenerator;
import net.ruixin.util.workflow.draw.bpmn.BPMNEdge;
import net.ruixin.util.workflow.draw.bpmn.BPMNShap;
import net.ruixin.util.workflow.draw.bpmn.BPMNShapType;
import net.ruixin.util.workflow.draw.entity.FlowImageStyle;
import net.ruixin.util.workflow.draw.util.FlowStatusColorUtil;
import net.ruixin.util.workflow.model.def.BpmDefLayout;
import net.ruixin.util.workflow.model.def.BpmNodeLayout;
import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.geom.Point2D;
import java.io.InputStream;
import java.util.*;

@Service
public class DiagramService implements IDiagramService {
    @Autowired
    private IWorkflowDao workflowDao;

    @Autowired
    private IWorkflowInstanceDao workflowInstanceDao;

    @Autowired
    private ISysNodeInstanceDao nodeInstanceDao;

    @Autowired
    private ISysTaskDao taskDao;

    @Override
    public BpmDefLayout buildBpmDefLayout(String bpmnXml) {
        BpmDefLayout bpmDefLayout = new BpmDefLayout();
        List<BpmNodeLayout> nodeLayoutlist = new ArrayList<>();
        List<BPMNShap> shaps = ProcessDiagramGenerator.extractBPMNShap(bpmnXml);
        List<BPMNEdge> edges = ProcessDiagramGenerator.extractBPMNEdge(bpmnXml);
        Point2D.Double[] points = ProcessDiagramGenerator.caculateCanvasSize(shaps, edges);
        double shiftX = points[0].getX() < 0.0D ? points[0].getX() : 0.0D;
        double shiftY = points[0].getY() < 0.0D ? points[0].getY() : 0.0D;
        float width = (float) Math.round(points[1].getX() + 10.0D - shiftX);
        float height = (float) Math.round(points[1].getY() + 10.0D - shiftY);
        float minX = (float) Math.round(points[0].getX() - shiftX);
        float minY = (float) Math.round(points[0].getY() - shiftY);
        minX = minX <= 5.0F ? 5.0F : minX;
        minY = minY <= 5.0F ? 5.0F : minY;
        float originalWidth = width - minX + 5;
        float originalHeight = height - minY + 5;
        bpmnXml = bpmnXml.replace("xmlns=\"http://www.omg.org/spec/BPMN/20100524/MODEL\"", "");
        Document doc = Dom4jUtil.loadXml(bpmnXml);
        Element root = doc.getRootElement();
        List<?> sequenceFlows = root.selectNodes("//sequenceFlow");
        Map<String, String> seqIdandName = new HashMap<>();
        Iterator var21 = sequenceFlows.iterator();

        while (var21.hasNext()) {
            Object node = var21.next();
            String id = ((Element) node).attributeValue("id");
            String name = ((Element) node).attributeValue("name");
            seqIdandName.put(id, name);
        }

        List<?> list = root.selectNodes("//bpmndi:BPMNShape");
        int subProcessNum = 1;
        Map<String, Integer> parentZIndexes = new HashMap<>();

        for (int i = 0; i < list.size(); ++i) {
            Element el = (Element) list.get(i);
            String id = el.attributeValue("bpmnElement");
            Element component = (Element) root.selectSingleNode("//*[@id='" + id + "']");
            if (component != null && !component.getName().equalsIgnoreCase("participant") && !component.getName().equalsIgnoreCase("lane")) {
                Element procEl = (Element) root.selectSingleNode("//process/descendant::*[@id='" + id + "']");
                if (procEl != null) {
                    Element tmp = (Element) el.selectSingleNode(".//dc:Bounds");
                    float x = Float.parseFloat(tmp.attributeValue("x"));
                    float y = Float.parseFloat(tmp.attributeValue("y"));
                    float w = Float.parseFloat(tmp.attributeValue("width"));
                    float h = Float.parseFloat(tmp.attributeValue("height"));
                    x = (float) ((double) (x - minX + 5.0F) - shiftX);
                    y = (float) ((double) (y - minY + 5.0F) - shiftY);
                    String type = procEl.getName();
                    if (type.equals(BPMNShapType.END_EVENT.getKey())) {
                        type = NodeType.END.getKey();
                    }

                    if (type.equals(BPMNShapType.START_EVENT.getKey())) {
                        type = NodeType.START.getKey();
                    }

                    if (!BPMNShapType.SUB_PROCESS.getKey().equals(type) && !BPMNShapType.CALL_ACTIVITY.getKey().equals(type)) {
                        Element multiObj = procEl.element("multiInstanceLoopCharacteristics");
                        if (multiObj != null) {
                            type = NodeType.SIGNTASK.getKey();
                        }
                    }

                    String name;
//                    if (type.equals(BPMNShapType.SERVICE_TASK.getKey())) {
//                        name = procEl.attributeValue("sertype");
//                        if (ServiceTaskType.MESSAGE.getKey().equals(name)) {
//                            type = NodeType.RECEIVETASK.getKey();
//                        } else if (ServiceTaskType.SCRIPT.getKey().equals(name)) {
//                            type = NodeType.SCRIPTTASK.getKey();
//                        } else {
//                            type = NodeType.SERVICETASK.getKey();
//                        }
//                    }
                    if (type.equals(BPMNShapType.TEXT_ANNOTATION.getKey())) {
                        name = procEl.selectSingleNode("text").getStringValue();
                    } else {
                        name = procEl.attributeValue("name");
                    }
                    Element parent = procEl.getParent();
                    int zIndex = 10;
                    String parentName = parent.getName();
                    String parentId = "";
                    if (parentName.equals(BPMNShapType.SUB_PROCESS.getKey())) {
                        parentId = parent.getParent().attributeValue("id");
                        if (parent.getParent().getName().equals(BPMNShapType.SUB_PROCESS.getKey())) {
                            ++subProcessNum;
                        }
                        if (type.equalsIgnoreCase(BPMNShapType.SUB_PROCESS.getKey())) {
                            zIndex = parentZIndexes.get(parent.attributeValue("id")) + 1;
                            parentZIndexes.put(id, zIndex);
                        } else if (!type.equalsIgnoreCase(BPMNShapType.START_EVENT.getKey()) && !type.equalsIgnoreCase(BPMNShapType.END_EVENT.getKey())) {
                            zIndex = 10 + subProcessNum;
                        }
                    } else if (type.equalsIgnoreCase(BPMNShapType.SUB_PROCESS.getKey())) {
                        parentZIndexes.put(id, zIndex);
                    }

                    BpmNodeLayout bpmNodeLayout = new BpmNodeLayout(id, name, NodeType.get(type), parentId, x, y, w, h);
                    nodeLayoutlist.add(bpmNodeLayout);
                }
            }
        }

//        bpmDefLayout.setDefId(po.getDefId());
//        bpmDefLayout.setName(po.getName());
        bpmDefLayout.setWidth(width);
        bpmDefLayout.setHeight(height);
        bpmDefLayout.setOriginalWidth(originalWidth);
        bpmDefLayout.setOriginalHeight(originalHeight);
        bpmDefLayout.setListLayout(nodeLayoutlist);
        return bpmDefLayout;
    }


    @Override
    public InputStream genImage(Long instId, Long wfId) {
        InputStream is = null;
        if (instId != null) {
            SysWorkflowInstance workflowInstance = workflowInstanceDao.get(instId);
            if (workflowInstance != null) {
                is = this.getDiagramByInstance(workflowInstance);
            }
        } else {
            SysWorkflow workflow = workflowDao.get(wfId);
            is = this.getDiagramByDefId(workflow, null);
        }
        return is;
    }

    private InputStream getDiagramByInstance(SysWorkflowInstance workflowInstance) {
        //查询流程实例当前各环节状态生成对应样式
        Map<String, FlowImageStyle> styleMap = this.getProcInstStatus(workflowInstance);
        return this.getDiagramByDefId(workflowInstance.getWorkflow_id(), styleMap);
    }

    private InputStream getDiagramByDefId(SysWorkflow workflow, Map<String, FlowImageStyle> styleMap) {
        //获取流程定义bpmn xml
        String bpmnXml = workflow.getBpmnDef();
        return this.getProcessImageByBpmnXml(bpmnXml, styleMap);
    }

    private InputStream getProcessImageByBpmnXml(String bpmnXml, Map<String, FlowImageStyle> styleMap) {
        return ProcessDiagramGenerator.generatePngDiagram(bpmnXml, styleMap);
    }

    /**
     * 获取流程运行实例各环节状态
     *
     * @param workflowInstance 流程实例
     * @return
     */
    private Map<String, FlowImageStyle> getProcInstStatus(SysWorkflowInstance workflowInstance) {
        Map<String, String> statusColorMap = FlowStatusColorUtil.getStatusColorMap();
        //在办样式
        FlowImageStyle pendingFlowImageStyle = new FlowImageStyle();
        pendingFlowImageStyle.setBorderColor(statusColorMap.get("pending"));
        //已办样式
        FlowImageStyle doneFlowImageStyle = new FlowImageStyle();
        doneFlowImageStyle.setBorderColor(statusColorMap.get("agree"));
        //退回样式
        FlowImageStyle rejectFlowImageStyle = new FlowImageStyle();
        rejectFlowImageStyle.setBorderColor(statusColorMap.get("reject"));
        //被撤回
        FlowImageStyle withdrawnFlowImageStyle = new FlowImageStyle();
        withdrawnFlowImageStyle.setBorderColor(statusColorMap.get("withdrawn"));
        //挂起样式
//        FlowImageStyle suspendFlowImageStype = new FlowImageStyle();
//        suspendFlowImageStype.setBorderColor(statusColorMap.get("suspend"));
        //获取任务实例列表
        List<Map<String, Object>> taskList = taskDao.getLatestTaskInstanceList(workflowInstance.getId());
        Map<String, FlowImageStyle> colourMap = new HashMap<>();
        //根据环节实例和任务实例状态显示自定义样式
        for (Map<String, Object> task : taskList) {
            //环节实例状态
            String nodeInstanceStatus = task.get("NI_STATUS").toString();
            //任务状态
            String taskStatus = task.get("STATUS").toString();
            //环节对应的 DOM ID
            String domId = task.get("DOM_ID").toString();
            if (nodeInstanceStatus.equals(NodeInstanceStatus.RUNNING.getId())) {
                //环节实例运行中，显示为“在办”状态
                colourMap.put(domId, pendingFlowImageStyle);
            } else {
                //环节实例已完成，根据任务状态判断
                //动作
                String action = task.get("ACTION").toString();
                if (action.equals(TaskAction.RETURN.getValue())) {
                    //退回
                    colourMap.put(domId, rejectFlowImageStyle);
                } else if (task.get("STATUS").equals(TaskStatus.BE_WITHDRAW.getValue())) {
                    //被撤回
                    colourMap.put(domId, withdrawnFlowImageStyle);
                } else if (taskStatus.equals(TaskStatus.FINISHED.getValue()) ||
                        taskStatus.equals(TaskStatus.PREEMPTION_STOP.getValue()) ||
                        taskStatus.equals(TaskStatus.COUNTERSIGN_STOP.getValue())) {
                    //已办
                    colourMap.put(domId, doneFlowImageStyle);
                }
            }
        }
        //获取嵌套环节实例
        List<Map<String, Object>> nestedNodeInstanceList = nodeInstanceDao.getNestedNodeInstanceList(workflowInstance.getId());
        if (nestedNodeInstanceList.size() > 0) {
            for (Map<String, Object> nestNodeInstance : nestedNodeInstanceList) {
                //环节对应的 DOM ID
                String domId = nestNodeInstance.get("DOM_ID").toString();
                if (nestNodeInstance.get("NI_STATUS").equals(NodeInstanceStatus.RUNNING.id)) {
                    //环节实例运行中，显示为“在办”状态
                    colourMap.put(domId, pendingFlowImageStyle);
                } else {
                    String wfInsStatus = nestNodeInstance.get("STATUS").toString();
                    if (wfInsStatus.equals(WorkflowInstanceStatus.TERMINATION_RETURN.getId())) {
                        //退回终止
                        colourMap.put(domId, rejectFlowImageStyle);
                    } else if (wfInsStatus.equals(WorkflowInstanceStatus.TERMINATION_WITHDRAWAL.getId())) {
                        //撤回终止
                        colourMap.put(domId, withdrawnFlowImageStyle);
                    } else {
                        colourMap.put(domId, doneFlowImageStyle);
                    }
                }
            }
        }
        return colourMap;
    }
}
