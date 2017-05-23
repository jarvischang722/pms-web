/**
 * Created by Jun on 2017/5/23.
 */
waitingDialog.hide();


    $(function() {


        // 交通接駁設定-接 dataGrid
        $('#trafficConnect-get-table').datagrid({
            singleSelect:true,
            collapsible:true,
            // 從json 撈
            url:'/jsonData/trafficConnection-get.json',
            method:'get',
            columns:[[
                {field:'code',title:'代號',width:100},
                {field:'connectPlace',title:'接駁地點',width:100},
                {field:'connectTime',title:'接駁時間',width:100},
                {field:'Mon',title:'Mon',width:50},
                {field:'Tue',title:'Tue',width:50},
                {field:'Wed',title:'Wed',width:50},
                {field:'Thu',title:'Thu',width:50},
                {field:'Fri',title:'Fri',width:50},
                {field:'Sat',title:'Sat',width:50},
                {field:'Sun',title:'Sun',width:50},
                {field:'companyRemark',title:'公司備註',width:300},
                {field:'remark',title:'備註',width:300}
            ]]

        });

        // 交通接駁設定-送 dataGrid
        $('#trafficConnect-giveAway-table').datagrid({
            singleSelect:true,
            collapsible:true,
            // 從json 撈
            url:'/jsonData/trafficConnection-giveAway.json',
            method:'get',
            columns:[[
                {field:'code',title:'代號',width:100},
                {field:'startPlace',title:'出發地點',width:100},
                {field:'startTime',title:'出發時間',width:100},
                {field:'arrivePlace',title:'抵達地點',width:100},
                {field:'arriveTime',title:'抵達時間',width:100},
                {field:'Mon',title:'Mon',width:50},
                {field:'Tue',title:'Tue',width:50},
                {field:'Wed',title:'Wed',width:50},
                {field:'Thu',title:'Thu',width:50},
                {field:'Fri',title:'Fri',width:50},
                {field:'Sat',title:'Sat',width:50},
                {field:'Sun',title:'Sun',width:50},
                {field:'companyRemark',title:'公司備註',width:300},
                {field:'remark',title:'備註',width:300}
            ]]

        });

    });