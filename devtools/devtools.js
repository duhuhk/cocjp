var workingTable = {
   html: {
      nameInput: document.querySelector('#table-name'),
      columnCountInput: document.querySelector('#c-cnt'),
      columnNameSpan: document.querySelector('#name-columns'),
      rowContainer: document.querySelector('#row-cont'),
      tablePreview: document.querySelector('#table-preview'),
      dynamicColumnNames: [],
      dynamicRowData: [[]],
   },
   _: {
      name: '',
      ccnt: 1,
      cols: [],
      rows: [[]],
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
      let wdatal = `calc(${wdata}% - 6px)`;
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
         if(e.code == 'Tab'){
            if(N == workingTable._.ccnt){
               workingTable.createNewRow();
            }
         }
         if(e.code == 'Enter'){
            workingTable.createNewRow();
         }
      });
      return d;
   },
   createNewRow: function(){
      let M = workingTable._.rows.length + 1;
      M -= 2;
      let row = new Array(workingTable._.ccnt);
      try{
      for(let i = 0; i < workingTable._.ccnt; i ++){
         let N = i + 1;
         N --;
         let d = workingTable.createDataSlot(M, N);
         
         let v = workingTable._.rows[M][i];
         d.value = v === undefined ? '' : v;
         d.value = '';
         workingTable.html.rowContainer.appendChild(d);
      }
      workingTable.html.dynamicRowData.push(row);
      }catch(err){console.error(err);}
   },
   refreshRows: function(){
      workingTable.html.rowContainer.innerHTML = '';
      let wdata = (1 / workingTable._.ccnt) * 100;
      let wdatal = `calc(${wdata}% - 6px)`;
      for(let i = 0; i < workingTable._.rows.length; i ++){
         let row = document.createElement('span');
         workingTable._.rows[i].length = workingTable._.ccnt;
         for(let j = 0; j < workingTable._.rows[i].length; j ++){
            let N = j + 1;
            N --;
            let M = i + 1;
            M --;
            let d = workingTable.createDataSlot(M, N);
            
            let v = workingTable._.rows[i][j];
            d.value = v === undefined ? '' : v;
            row.appendChild(d);
         }
         row.appendChild(document.createElement('br'));
         workingTable.html.rowContainer.appendChild(row);
         workingTable.html.dynamicRowData.push(row);
      }
   },
};

workingTable.createNewRow();

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
      /*for(let j = 0; j < workingTable.html.dynamicRowData.length; j ++){
         workingTable.html.dynamicRowData[j].length = c;
         workingTable._.rows[j].length = c;
      }*/
      /*workingTable.html.dynamicRowData = [];
      workingTable._.rows = [];
      workingTable.createNewRow();*/
   }
   catch(err){
      console.error(err);
      workingTable.html.columnCountInput.value = '';
   }
}

handleTableColumnInput();