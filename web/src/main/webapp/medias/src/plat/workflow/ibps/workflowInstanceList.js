var wfInsVm;
$(function () {
    wfInsVm = new Rxvm({
        el: '.base_box',
        data: {list: RX.page.param.list}
    });
});