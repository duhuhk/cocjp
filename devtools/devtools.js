var workingTable = {
   html: {
      nameInput: document.querySelector('#table-name'),
      columnCountInput: document.querySelector('#c-cnt'),
      columnNameSpan: document.querySelector('#name-columns'),
      rowContainer: document.querySelector('#row-cont'),
      tablePreview: document.querySelector('#table-preview'),
      buildTablePreviewButton: document.querySelector('#build-preview-table'),
      dynamicColumnNames: [],
      dynamicRowData: [],
   },
   _: {
      name: '',
      ccnt: 1,
      cols: [],
      rows: [],
   },
   get name(){
      let n = workingTable.html.nameInput.value;
      workingTable._.name = n;
      return n;
   },
   /*refreshColumnNameField: function(){
      
   },*/
   createDataSlot: function(M, N){
      let wdata = (1 / workingTable._.ccnt) * 100;
      let wdatal = `calc(${wdata}% - 4px)`;
      let d = document.createElement('input');
      d.type = 'text';
      d.id = `${N}-${M}`;
      d.style.width = wdatal;
      d.style.margin = '2px';
      d.style.padding = '1px';
      d.style.boxSizing = 'border-box';
      d.addEventListener('keyup', e => {
         workingTable._.rows[M][N] = d.value;
      });
      d.addEventListener('keydown', e => {
         let x = Number(d.id.split('-')[0]);
         let y = Number(d.id.split('-')[1]);
         document.getElementById('dummy').innerHTML = JSON.stringify(workingTable.html.dynamicRowData);
         
         if(e.code == 'Tab'){
            if(x == workingTable._.ccnt - 1 && y == workingTable._.rows.length - 1){
               workingTable.createNewRow();
            }
         }
         if(/*e.code == 'Enter' || */e.code == 'NumpadEnter'){
            workingTable.createNewRow();
            if(e.shiftKey){
               workingTable.html.dynamicRowData[y + 1][x].focus();
               workingTable.html.dynamicRowData[y + 1][x].select();
            }
         }
         
         if(e.code == 'ArrowUp' && e.ctrlKey && e.altKey){
            if(y > 0) workingTable.html.dynamicRowData[y - 1][x].focus();
            if(y > 0) workingTable.html.dynamicRowData[y - 1][x].select();
         }
         if(e.code == 'ArrowLeft' && e.ctrlKey && e.altKey){
            if(x > 0) workingTable.html.dynamicRowData[y][x - 1].focus();
            if(x > 0) workingTable.html.dynamicRowData[y][x - 1].select();
         }
         if(e.code == 'ArrowDown' && e.ctrlKey && e.altKey){
            if(y < workingTable._.rows.length - 1) workingTable.html.dynamicRowData[y + 1][x].focus();
            if(y < workingTable._.rows.length - 1) workingTable.html.dynamicRowData[y + 1][x].select();
         }
         if(e.code == 'ArrowRight' && e.ctrlKey && e.altKey){
            if(x < workingTable._.rows[0].length - 1) workingTable.html.dynamicRowData[y][x + 1].focus();
            if(x < workingTable._.rows[0].length - 1) workingTable.html.dynamicRowData[y][x + 1].select();
         }
      });
      return d;
   },
   createNewRow: function(){
      workingTable._.rows.push(new Array(workingTable._.ccnt));
      let M = workingTable._.rows.length + 1;
      M -= 2;
      let rarray = new Array(workingTable._.ccnt);
      let row = document.createElement('span');
      try{
      for(let i = 0; i < workingTable._.ccnt; i ++){
         let N = i + 1;
         N --;
         let d = workingTable.createDataSlot(M, N);
         
         // let v = workingTable._.rows[M][i];
         // d.value = v === undefined ? '' : v;
         d.value = '';
         row.appendChild(d);
         rarray[i] = d;
      }
      workingTable.html.rowContainer.appendChild(row);
      workingTable.html.rowContainer.appendChild(document.createElement('br'));
      workingTable.html.dynamicRowData.push(rarray);
      
      }catch(err){console.error(err);}
   },
   refreshRows: function(){
      workingTable.html.rowContainer.innerHTML = '';
      // workingTable.html.dynamicRowData = [];
      for(let i = 0; i < workingTable._.rows.length; i ++){
         workingTable._.rows[i].length = workingTable._.ccnt;
         workingTable.html.dynamicRowData[i].length = workingTable._.ccnt;
         let rarray = new Array(workingTable._.ccnt);
         let row = document.createElement('span');
         for(let j = 0; j < workingTable._.rows[i].length; j ++){
            let N = j + 1;
            N --;
            let M = i + 1;
            M --;
            let d = workingTable.createDataSlot(M, N);
            
            let v = workingTable._.rows[i][j];
            d.value = v === undefined ? '' : v;
            row.appendChild(d);
            rarray[j] = d;
         }
         workingTable.html.rowContainer.appendChild(row);
         workingTable.html.rowContainer.appendChild(document.createElement('br'));
         workingTable.html.dynamicRowData[i] = rarray;
      }
   },
   buildTable: function(){
      let container = document.createElement('span');
      let group = document.createElement('div');
      group.classList.add('info-group');
      let groupHeader = document.createElement('p');
      groupHeader.classList.add('info-group-header');
      groupHeader.classList.add('ih');
      groupHeader.innerHTML = workingTable._.name;
      group.appendChild(groupHeader);
      
      let table = document.createElement('table');
      table.classList.add('info-table');
      c = workingTable._.ccnt;
      let thr = document.createElement('tr');
      thr.classList.add('info-table-row');
      for(let i = 0; i < c; i ++){
         let th = document.createElement('th');
         th.classList.add('info-table-header');
         th.innerHTML = workingTable._.cols[i];
         thr.appendChild(th);
      }
      table.appendChild(thr);
      
      for(let j = 0; j < workingTable._.rows.length; j ++){
         let tr = document.createElement('tr');
         tr.classList.add('info-table-row');
         for(let i = 0; i < c; i ++){
            let td = document.createElement('td');
            td.classList.add('info-table-data');
            td.innerHTML = workingTable._.rows[j][i];
            tr.appendChild(td);
         }
         table.appendChild(tr);
      }
      
      group.appendChild(table);
      container.appendChild(group);
      return group;
   },
   generatePreview: function(){
      workingTable.html.tablePreview.innerHTML = '';
      workingTable.html.tablePreview.appendChild(workingTable.buildTable());
   },
};

workingTable.html.nameInput.addEventListener('keyup', e => {
   workingTable.name;
});

workingTable.html.columnCountInput.addEventListener('keyup', handleTableColumnInput);

function handleTableColumnInput(){
   workingTable.name;
   try{
      let c = Number(workingTable.html.columnCountInput.value);
      if(!(c >= 1)){throw 'cant do 0 cols'}
      
      workingTable._.ccnt = c;
      workingTable._.cols.length = c;
      
      // Generate/replace column name slots
      workingTable.html.dynamicColumnNames = [];
      workingTable.html.columnNameSpan.innerHTML = 'Col names: <br />';
      let wdata = (1 / workingTable._.ccnt) * 100;
      let wdatal = `calc(${wdata}% - 6px)`;
      for(let i = 0; i < c; i ++){
         let n = document.createElement('input');
         n.type = 'text';
         n.style.width = wdatal;
         n.style.margin = '2px';
         n.style.padding = '1px';
         n.style.boxSizing = 'border-box';
         
         let v = workingTable._.cols[i];
         // console.log(v);
         n.value = v === undefined ? '' : v;
         let N = i + 1;
         N --;
         n.addEventListener('keyup', f => {
            workingTable._.cols[N] = n.value;
         });
         workingTable.html.dynamicColumnNames.push(n);
         workingTable.html.columnNameSpan.appendChild(n);
         
      }
      
      // Create row data entry fields
      workingTable.refreshRows();
   }
   catch(err){
      console.error(err);
      // workingTable.html.columnCountInput.value = '';
   }
}

workingTable.html.buildTablePreviewButton.onclick = workingTable.generatePreview;

handleTableColumnInput();
workingTable.createNewRow();
document.getElementById('dummy').innerHTML = JSON.stringify(workingTable.html.dynamicRowData);