// FIND A WAY TO MAKE THIS WORK WITHOUT BEING TIED TO THE HTML
// will allow for access on other pages, which in turn
// will allow for a JS script that can read from a (CJI?) database and automatically make tables without needing to define them per-page

// alt., could just hide the HTML stuff since this can manage the HTML on its own, but that would be messy and annoying
// could use omnipresent to autocreate & delete it when needed though

var workingTable = {
   html: {
      nameInput: document.querySelector('#table-name'),
      columnCountInput: document.querySelector('#c-cnt'),
      columnNameSpan: document.querySelector('#name-columns'),
      rowContainer: document.querySelector('#row-cont'),
      tablePreview: document.querySelector('#table-preview'),
      buildTablePreviewButton: document.querySelector('#build-preview-table'),
      outputTableButton: document.querySelector('#output-table-html'),
      outputTableExtraTabs: document.querySelector('#extra-tab-table-output'),
      tableImportFile: document.querySelector('#import-table'),
      tableImportConfirm: document.querySelector('#process-import-table'),
      tableExportCJI: document.querySelector('#export-table-as-cji'),
      tableExportTXT: document.querySelector('#export-table-as-txt'),
      tableCJIOutput: document.querySelector('#output-table-cji'),
      metaLibrary: document.querySelector('#table-meta-library'),
      metaLibraryFull: document.querySelector('#table-meta-libraryFull'),
      metaType: document.querySelector('#table-meta-type'),
      metaIsDevTool: document.querySelector('#table-meta-isDevTool'),
      metaIsCustom: document.querySelector('#table-meta-isCustom'),
      metaCustomLibrary: document.querySelector('#table-meta-customLibrary'),
      metaCJIVer: document.querySelector('#table-meta-cjiVer'),
      metaOutTab: document.querySelector('#table-meta-outTab'),
      convertCJIToGSheets: document.querySelector('#cji-to-Gsheets'),
      convertCJIToGSheetsData: document.querySelector('#user-data-convert-cji-to-Gsheets'),
      convertFileToGSheets: document.querySelector('#file-to-Gsheets'),
      dynamicColumnNames: [],
      dynamicRowData: [],
      showImportPreview: false,
      rowsFilter: [['<br />', '; ']],
      rowsFilter_data:[[/(?<!\\);\s/, '<br />']],
      // ^ not the cleanest way of doing that
   },
   _: {
      name: '',
      ccnt: 1,
      cols: [],
      rows: [],
      importData: {
         library: 'dictionary-table',
         libraryFull: 'importDataDefaultLibrary_dictionaryTable',
         type: 'default',
         isDevTool: true,
         isCustom: false,
         customLibrary: false,
         cjiVer: 1,
         // outputTabChar: '\t',
         // ^ For some reason, this doesn't display properly,
         // so whatever ℣ is is my stand in for tabs
         outputTabChar: '℣',
      },
   },
   get name(){
      let n = workingTable.html.nameInput.value;
      workingTable._.name = n;
      return n;
   },
   updateMetaMonitor: function(){
      workingTable.html.metaLibrary.value = workingTable._.importData.library;
      workingTable.html.metaLibraryFull.value = workingTable._.importData.libraryFull;
      workingTable.html.metaType.value = workingTable._.importData.type;
      workingTable.html.metaIsDevTool.value = workingTable._.importData.isDevTool;
      workingTable.html.metaIsCustom.value = workingTable._.importData.isCustom;
      workingTable.html.metaCustomLibrary.value = workingTable._.importData.customLibrary;
      workingTable.html.metaCJIVer.value = workingTable._.importData.cjiVer;
      workingTable.html.metaOutTab.value = workingTable._.importData.outputTabChar;
   },
   fromMetaMonitor: function(){
      workingTable._.importData.library = workingTable.html.metaLibrary.value;
      workingTable._.importData.libraryFull = workingTable.html.metaLibraryFull.value;
      workingTable._.importData.type = workingTable.html.metaType.value;
      workingTable._.importData.isDevTool = workingTable.html.metaIsDevTool.value;
      workingTable._.importData.isCustom = workingTable.html.metaIsCustom.value;
      workingTable._.importData.customLibrary = workingTable.html.metaCustomLibrary.value;
      workingTable._.importData.cjiVer = workingTable.html.metaCJIVer.value;
      workingTable._.importData.outputTabChar = workingTable.html.metaOutTab.value;
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
      // d.addEventListener('composition')
      d.addEventListener('keydown', e => {
         let x = Number(d.id.split('-')[0]);
         let y = Number(d.id.split('-')[1]);
         // document.getElementById('dummy').innerHTML = JSON.stringify(workingTable.html.dynamicRowData);
         
         if(e.code == 'Tab'){
            if(x == workingTable._.ccnt - 1 && y == workingTable._.rows.length - 1){
               workingTable.createNewRow();
            }
         }
         // v Does not work when using JP IME - enter confirms selection
         if(e.code == 'Enter' || e.code == 'NumpadEnter'){
            if(!e.isComposing){
               workingTable.createNewRow();
               if(!e.shiftKey){
                  workingTable.html.dynamicRowData[y + 1][x].focus();
                  workingTable.html.dynamicRowData[y + 1][x].select();
               }
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
         
         /*let v = workingTable._.rows[M][i];
         d.value = v === undefined ? '' : v;*/
         // ^ Will try to use current rows data to fill the new row
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
            // console.log(v);
            let vfilter, vfilter_data;
            if(v !== undefined){
               vfilter = v;
               vfilter_data = v;
               for(let f of workingTable.html.rowsFilter){
                  vfilter = vfilter.split(f[0]).join(f[1]);
                  // console.log('f', f);
               }
               for(let f of workingTable.html.rowsFilter_data){
                  vfilter_data = vfilter_data.split(f[0]).join(f[1]);
                  // console.log('f _data', f);
               }
               // console.log('vfilter', vfilter);
               // console.log('vfilter_data', vfilter_data);
            }
            d.value = v === undefined ? '' : vfilter;
            row.appendChild(d);
            rarray[j] = d;
            // workingTable._.rows[i][j] = vfilter_data;
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
      group.setAttribute('data-dt-export', workingTable._.importData.isDevTool);
      group.setAttribute('data-dt-cji_ver', workingTable._.importData.cjiVer);
      if(!workingTable._.importData.isCustom){
         group.setAttribute('data-dt-library', workingTable._.importData.libraryFull + ' [' + workingTable._.importData.library + ']');
         group.setAttribute('data-dt-type', workingTable._.importData.type);
      }
      else{
         group.setAttribute('data-dt-is_custom', 'true');
         group.setAttribute('data-dt-custom_library', workingTable._.importData.customLibrary);
      }
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
      return container;
   },
   generatePreview: function(){
      workingTable.refreshRows();
      // workingTable.html.buildTablePreviewButton.style.marginBottom = '0';
      // workingTable.html.outputTableButton.style.marginBottom = '5px';
      workingTable.html.tablePreview.innerHTML = '';
      // workingTable.html.tablePreview.appendChild(document.createElement('p'));
      workingTable.html.tablePreview.appendChild(workingTable.buildTable());
      // workingTable.html.tablePreview.style.marginTop = '50px';
   },
};

workingTable.html.nameInput.addEventListener('keyup', e => {
   workingTable.name;
});

workingTable.html.columnCountInput.addEventListener('keyup', handleTableColumnInput);

workingTable.html.metaLibrary.addEventListener('keyup', workingTable.fromMetaMonitor);
workingTable.html.metaLibraryFull.addEventListener('keyup', workingTable.fromMetaMonitor);
workingTable.html.metaType.addEventListener('keyup', workingTable.fromMetaMonitor);
workingTable.html.metaIsDevTool.addEventListener('keyup', workingTable.fromMetaMonitor);
workingTable.html.metaIsCustom.addEventListener('keyup', workingTable.fromMetaMonitor);
workingTable.html.metaCustomLibrary.addEventListener('keyup', workingTable.fromMetaMonitor);
workingTable.html.metaCJIVer.addEventListener('keyup', workingTable.fromMetaMonitor);

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
      let wdatal = `calc(${wdata}% - 4px)`;
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

workingTable.html.buildTablePreviewButton.addEventListener('click', e => {
   workingTable.generatePreview()
   workingTable.html.buildTablePreviewButton.style.marginBottom = '6px';
});

handleTableColumnInput();
workingTable.createNewRow();
workingTable.updateMetaMonitor();
// document.getElementById('dummy').innerHTML = JSON.stringify(workingTable.html.dynamicRowData);


// TODO
// maybe add these functions to the workingTable object? may make it more consistent
// alt., may just make other things a different file since this ones already so long

function outputTableHTML(){
   workingTable.refreshRows();
   let tabExtra = 0;
   if(+workingTable.html.outputTableExtraTabs.value > 0){
      tabExtra = +workingTable.html.outputTableExtraTabs.value;
   }
   tabExtra ++;
   let xpoTable = workingTable.buildTable('default').innerHTML;
   xpoTable = xpoTable.replace(/(?<=^.*?\<(?<p>p(?=\s)).*?\<\/(\k<p>).*?\>)(?=\<(?<table>table))/, '\n');
   xpoTable = xpoTable.replace(/(?<=^.*?\<(?<div>div(?=\s)).*?\>)(?=\<(?<p>p))/, '\n');
   xpoTable = xpoTable.replace(/(?<=\<(?<ttable>table)(?=\s).*?\>)(?<=\<(?<tag>\w+)(?=\s).*?\>)(?![^\<]+)(?!\<\/\k<tag>)(?!$)/gm, '\n\t');
   xpoTable = xpoTable.replace(/(?<=\t\<(?<outtag>\w+(?=\s))[^\<]*?\n)^(?!\<\/*\k<outtag>(?=\s))/gm, '\t');
   xpoTable = xpoTable.replace(/(?<=^\t(?<otab>\t*)\<(?<tag>\w+(?=\s))[^]*?)(?=\k<otab>\<\k<tag>)/gm, '\t');
   xpoTable = xpoTable.replace(/(?<=^\<(?<tag>\w+(?=\s))[^]*)(?=\<\/\k<tag>)/gm, '');
   // I used to like regex
   xpoTable = xpoTable.split('\t').join(workingTable._.importData.outputTabChar);
   xpoTable = xpoTable.split('\n');
   let tabs = [];
   for(let inefficient = 0; inefficient < tabExtra; inefficient++){
      tabs.push(workingTable._.importData.outputTabChar);
   }
   tabs = tabs.join('');
   xpoTable.forEach((l, i) => {
      xpoTable[i] = tabs + xpoTable[i];
   })
   xpoTable[0] = xpoTable[0].substring(1);
   xpoTable[xpoTable.length - 2] = xpoTable[xpoTable.length - 2].substring(1);
   xpoTable[xpoTable.length - 1] = xpoTable[xpoTable.length - 1].substring(2);
   
   console.group('Table HTML output');
   console.log(xpoTable);
   console.groupEnd();
   // document.getElementById('dummy').innerText = '\n';
   document.getElementById('dummy').innerText = '';
   for(let line of xpoTable){
      document.getElementById('dummy').appendChild(document.createTextNode(line));
      document.getElementById('dummy').appendChild(document.createElement('br'));
   }
   // document.getElementById('dummy').appendChild(document.createTextNode('a'));
}
workingTable.html.outputTableButton.addEventListener('click', outputTableHTML);

async function processImportDataTable(){
   let data = await workingTable.html.tableImportFile.files[0].text();
   
   let getver = /(?<=cjiver(?<!\\)\[).*?(?=(?<!\\)\])/gm;
   let cjiver = getver.test(data) ? data.match(getver)[0] : 1;
   
   // unparsed data
   let up = {
      cjiversion: cjiver,
      meta: '',
      cols: '',
      rows: [],
   };
   // parsed data
   let pd = {
      // extrapolation
      xpol: {
         ccnt: 1,
         rcnt: 1,
         cols: [],
         take: [],
         rows: [],
      },
      meta: {
         cjiversion: cjiver,
         title: '',
         lib: '',
         type: '',
         cols: [],
      },
   };
   
   // General purpose RegExp for getting non-nested data (cji version 0)
   // (if nested data is using {{ or }} instead of { or }):
   // /(?<=\w+(?<!(?<!\\)(?<!\\)\{)(?<!\\)\{(?!\{)).*?(?=(?<!(?<!\\)\})(?<!\\)\}(?!(?<!\\)\}))/mg
   
   // ^ probably outdated but im too lazy to check
   //   safer to use CJIReader anyway
   
   // Unparsed data
   let meta = /m(?<!\\)\[.*?(?:(?<!\\))(?<!\\)\]/m;
   if(meta.test(data)){
      up.meta = data.match(meta)[0];
   }
   let d_meta = up.meta;
   
   let defaults = {
      library: workingTable._.importData.library,
      libraryFull: workingTable._.importData.libraryFull,
      type: workingTable._.importData.type,
      isDevTool: workingTable._.importData.isDevTool,
      isCustom: workingTable._.importData.isCustom,
      customLibrary: workingTable._.importData.customLibrary,
      cjiVer: workingTable._.importData.cjiVer,
   };
   
   let libPing = workingTable._.importData.library;
   let backupLibPing = workingTable._.importData.libraryFull;
   let typePing = workingTable._.importData.type;
   let getLib = new CJIReader('lib', ['{', '}'], cjiver);
   let getFullLib = new CJIReader('libfull', ['{', '}'], cjiver);
   let getType = new CJIReader('type', ['{', '}'], cjiver);
   libPing = getLib.test(d_meta) ? getLib.pull(d_meta) : libPing;
   backupLibPing = getFullLib.test(d_meta) ? getFullLib.pull(d_meta) : backupLibPing;
   typePing = getType.test(d_meta) ? getType.pull(d_meta) : typePing;
   let Library = pokeLibrary(libPing, backupLibPing, workingTable._.importData.library, workingTable._.importData.libraryFull);
   
   let checkForOverride = /(?<=use-default\{).*?(?=\})/gm;
   let m_default = checkForOverride.test(d_meta) ? /true|1/gmi.test(d_meta.match(checkForOverride)[0]) : true;
   
   /*
      Columns format by cji version:
        version  |  formatting notes
      -----------+--------------------
            0    |  uses double squggly braces ({{ and }}) for nested data
            1    |  no special formatting for nested braces
   */
   let columns, d_cols, d_rows;
   switch(cjiver){
      default:
      case '0':
         columns = /(?<=cols(?<!(?<!\\)\{)(?<!\\)\{(?!\{)).*?(?=(?<!(?<!\\)\})(?<!\\)\}(?!(?<!\\)\}))/mg;
         break;
      case '1':
         columns = /(?<=cols(?<!\\)\{).*?(?=(?<=\}[^\{]*)\})/mg;
         break;
   }
   if(columns.test(d_meta)){
      d_cols = d_meta.match(columns)[0];
      up.cols = d_cols;
   }
   let rows = /(?<!\w+)(?<!\\)\[.*?(?:(?<!\\))(?<!\\)\]/gm;
   if(rows.test(data)){
      d_rows = [...data.match(rows)];
      up.rows = d_rows;
   }
   
   // Parsed data
   let dp_title, dp_lib, dp_type, dp_col;
   pd.xpol.rcnt = d_rows.length;
   let title = /(?<=title(?<!\\)\{).*?(?=(?<!\\)\})/;
   if(title.test(d_meta)){
      dp_title = d_meta.match(title)[0];
      pd.meta.title = dp_title;
   }
   let type = /(?<=type(?<!\\)\{).*?(?=(?<!\\)\})/;
   if(type.test(d_meta)){
      dp_type = d_meta.match(type)[0];
      pd.meta.type = dp_type;
   }
   // console.log('type ', dp_type);
   
   // Update workingTable library &c.
   workingTable._.importData.library = libPing[0];
   workingTable._.importData.libraryFull = backupLibPing[0];
   workingTable._.importData.type = typePing[0];
   workingTable._.importData.isDevTool = 'true';
   workingTable._.importData.isCustom = !m_default;
   workingTable._.importData.customLibrary = !m_default ? d_cols : false;
   workingTable._.importData.customLibrary = cjiver;
   workingTable.updateMetaMonitor();
   
   // Override explicit columns with default, if found
   let cjiver_columns = cjiver;
   let usecols = d_cols;
   if(Object.keys(Library).includes(pd.meta.type) && m_default){
      cjiver_columns = '0';
      d_cols = Library[pd.meta.type];
      up.cols = Library[pd.meta.type];
      usecols = Library[pd.meta.type];
      console.log('Using default column layout for ' + pd.meta.type);
   }else{ console.log('Using custom column layout for ' + pd.meta.type) };
   // console.log('cji version: ', cjiver);
   /*let colpnest;
   switch(cjiver_columns){
      default:
      case '0':
      case '1':
         colpnest = /\w(?<!\\)\{+.*?(?<!\\)\}+/gm;
         break;
   }*/
   let colp = /\d\<.*?\>/mg;
   // These 3 work with cji version 0 & 1
   let colpnest = /\w(?<!\\)\{+.*?(?<!\\)\}+/gm;
   let ndnget = /\w(?=(?<!\\)\{+)/gm;
   let ndvget = /(?<=(?<!\\)\{+(?!\{)).*?(?=(?<!\\)\}+)/gm
   if(colp.test(d_cols)){
      let colpro = [...d_cols.match(colp)];
      pd.xpol.ccnt = colpro.length;
      pd.meta.cols.length = colpro.length;
      colpro.forEach(c => {
         let i = c.split('<')[0];
         pd.meta.cols[i] = {};
         let ndname = c.match(ndnget);
         let ndvalue = c.match(ndvget);
         [...c.match(colpnest)].forEach((nd, j) => {
            pd.meta.cols[i][ndname[j]] = ndvalue[j];
         });
      });
   }
   // console.log(pd.meta.cols);
   let rowp = /(?<=(?<colID>\w+)\{).*?(?=\})/gm;
   pd.xpol.cols.length = pd.xpol.ccnt;
   pd.xpol.rows.length = d_rows.length;
   let rowSplit = {};
   for(let i = 0; i < pd.meta.cols.length; i ++){
      pd.xpol.cols[i] = pd.meta.cols[i].n;
      pd.xpol.take[i] = pd.meta.cols[i].s;
      // pd.xpol.rows[i] = new Array(pd.meta.ccnt);
      rowSplit[pd.meta.cols[i].s] = new Array(pd.xpol.rcnt);
      for(let k = 0; k < pd.xpol.rcnt; k ++){
         rowSplit[pd.meta.cols[i].s][k] = [];
         for(let l = 0; l < rowSplit[pd.meta.cols[i].s][k].length; l ++){
            rowSplit[pd.meta.cols[i].s][k].push('');
         }
      }
      // rowSplit[pd.meta.cols[i].s].fill((new Array(pd.xpol.ccnt)).fill('', 0), 0);
   }
   // console.log('rowSplit ', rowSplit);
   let dataLost = [];
   for(let j = 0; j < d_rows.length; j ++){
      let rowHand = [...d_rows[j].matchAll(rowp)];
      // console.log('rowHand ', rowHand);
      let curRow = new Array(pd.xpol.ccnt);
      for(let k = 0; k < pd.xpol.ccnt; k ++){
         curRow[k] = [];
      }
      for(let rowDat of rowHand){
         if(pd.xpol.take.indexOf(rowDat[1]) < 0){
            dataLost.push({
               tag: rowDat[1],
               'tag index': pd.xpol.take.indexOf(rowDat[1]),
               'tag value': rowDat[0]
            });
            continue;
         }
         // console.log(rowDat[1], pd.xpol.take.indexOf(rowDat[1]), curRow);
         curRow[pd.xpol.take.indexOf(rowDat[1])].push(rowDat[0]);
      }
      pd.xpol.rows[j] = curRow;
   }
   if(dataLost.length > 0){
      console.group('Data lost in import');
      console.warn('Invalid tags! Ignored the following data:')
      console.table(dataLost);
      console.table(pd.meta.cols);
      console.groupEnd();
   }
   // console.log('rowSplit ', rowSplit);
   
   // Update HTML to show new table input
   /*
      nameInput: document.querySelector('#table-name'),
      columnCountInput: document.querySelector('#c-cnt'),
      columnNameSpan: document.querySelector('#name-columns'),
      rowContainer: document.querySelector('#row-cont'),
      dynamicColumnNames: [],
      dynamicRowData: [],
   */
   workingTable.html.nameInput.value = pd.meta.title;
   workingTable.html.columnCountInput.value = pd.xpol.ccnt;
   handleTableColumnInput();
   for(let cname = 0; cname < workingTable.html.dynamicColumnNames.length; cname ++){
      workingTable._.cols[cname] = pd.xpol.cols[cname];
      workingTable.html.dynamicColumnNames[cname].value = pd.xpol.cols[cname];
      handleTableColumnInput();
   }
   workingTable.html.rowContainer.innerHTML = '';
   workingTable.html.dynamicRowData = [];
   workingTable._.rows = [];
   for(let r = 0; r < pd.xpol.rcnt; r ++){
      workingTable.createNewRow();
   }
   for(let j = 0; j < pd.xpol.rcnt; j ++){
      for(let i = 0; i < pd.xpol.ccnt; i ++){
         let mask = pd.xpol.rows[j][i].length == 1 ? pd.xpol.rows[j][i][0] : pd.xpol.rows[j][i].join('`/<n>');
         mask = mask.split('`/<n>');
         // mask = mask.split('~<n>').join('\n');
         workingTable.html.dynamicRowData[j][i].value = mask.join('; ');
         workingTable._.rows[j][i] = mask.join('<br />');
         // console.log(pd.xpol.rows[j][i], mask);
      }
   }
   
   // console.log(up);
   // console.log(pd);
   // console.log(data)
}
workingTable.html.tableImportConfirm.addEventListener('click', processImportDataTable);

// Convert an HTML table (back) into a CJI file
function convertHTMLTableToCJI(html, /*l, f, t,*/ version = '0'){
   // l = library      f = libraryFull      t = type
   // May not even end up using them though, huh?
   
   // Declare the main data to convert
   let _UseDefault, _Version, _Title, _Library, _LibraryFull, _Type, _CustomLibrary;
   _Use_Default = true;
   
   let dummy, L;
   L = html;
   if(typeof html == 'string'){
      dummy = document.createElement('span');
      dummy.innerHTML = html;
      L = dummy.children[0];
   }
   
   if(!L.getAttribute('data-dt-export') == 'true'){
      console.warn('Provided table may not be convertable into a CJI file!');
   }
   
   // Get main HTML elements
   let header, table;
   let foundHeader = false;
   for(let l of L.children){
      if(l.nodeName == 'P' && l.classList.contains('ih') && !foundHeader){
         header = l;
         foundHeader = true;
      }
   }
   let foundTable = false;
   for(let l of L.children){
      if(l.nodeName == 'TABLE' && l.classList.contains('info-table') && !foundTable){
         table = l;
         foundTable = true;
      }
   }
   
   // Get metadata
   _UseDefault = L.getAttribute('data-dt-is_custom') == 'true' ? false : true;
   _Version = L.getAttribute('data-dt-cji_ver') != null ? L.getAttribute('data-dt-cji_ver') : version;
   _Title = header.innerText;
   _Library = _UseDefault ? L.getAttribute('data-dt-library').split(/\s\[|\]/)[1] : false;
   _LibraryFull = _UseDefault ? L.getAttribute('data-dt-library').split(/\s\[|\]/)[0] : false;
   _Type = _UseDefault ? L.getAttribute('data-dt-type') : false;
   _CustomLibrary = !_UseDefault ? L.getAttribute('data-dt-custom_library') : false;
   
   console.log('_UseDefault', _UseDefault);
   console.log('_Version', _Version);
   console.log('_Title', _Title);
   console.log('_Library', _Library);
   console.log('_LibraryFull', _LibraryFull);
   console.log('_Type', _Type);
   console.log('_CustomLibrary', _CustomLibrary);
   
   let innerBrackets = [];
   innerBrackets[0] = version == '0' ? '{{' : '{';
   innerBrackets[1] = version == '0' ? '}}' : '}';
   let lbra = innerBrackets[0];
   let rbra = innerBrackets[1];
   
   let metaConstruct = [];
   if(_UseDefault){
      metaConstruct.push(`use-default{${_UseDefault}}`);
   }
   if(_Title){
      metaConstruct.push(`title{${_Title}}`);
   }
   if(_Library){
      metaConstruct.push(`lib{${_Library}}`);
   }
   if(_LibraryFull){
      metaConstruct.push(`libfull{${_LibraryFull}}`);
   }
   if(_Type){
      metaConstruct.push(`type{${_Type}}`);
   }
   if(_CustomLibrary){
      metaConstruct.push(`cols{${_CustomLibrary}}`);
   }
   
   // Start building output file
   let lines = [];
   lines.push(`cjiver[${_Version}]`);
   lines.push(`m[${metaConstruct.join('')}]`);
   
   // Get column data
   // v Stolen from processImportDataTable and slightly modified
   let cols = [];
   let tags = [];
   let d_cols = _UseDefault ? pokeLibrary(_Library, _LibraryFull, '', '')[_Type] : _CustomLibrary;
   let colp = /\d\<.*?\>/mg;
   // v For CJI ver 0 & 1
   let colpnest = /\w(?<!\\)\{+.*?(?<!\\)\}+/gm;
   let ndnget = /\w(?=(?<!\\)\{+)/gm;
   let ndvget = /(?<=(?<!\\)\{+(?!\{)).*?(?=(?<!\\)\}+)/gm
   if(colp.test(d_cols)){
      let colpro = [...d_cols.match(colp)];
      // pd.xpol.ccnt = colpro.length;
      // pd.meta.cols.length = colpro.length;
      colpro.forEach(c => {
         let i = c.split('<')[0];
         cols[i] = {};
         let ndname = c.match(ndnget);
         let ndvalue = c.match(ndvget);
         [...c.match(colpnest)].forEach((nd, j) => {
            cols[i][ndname[j]] = ndvalue[j];
         });
      });
   }
   cols.forEach(d => {
      tags.push(d.s);
   });
   
   console.log(table.childNodes);
   let tr = Array.from(table.childNodes[0].childNodes);
   // v From before using Array.from(...), left just in case needed for future logic
   /*for(let r in table.children[0].children){
      tr[Number(r)] = table.children[0].children[r];
   }*/
   tr.shift();
   console.log(tr);
   for(let r of tr){
      let c = r.children;
      let row = [];
      row.push('[');
      for(let i = 0; i < c.length; i ++){
         // console.log(c[i].innerText);
         cprime = c[i].innerHTML.split(/\<br(?:\s\/)*\>/);
         for(let data of cprime){
            row.push(`${tags[i]}{${data}}`);
         }
      }
      row.push(']');
      // console.log(row.join(''));
      lines.push(row.join(''));
   }
   
   // console.log(lines.join('\n'));
   return lines.join('\n');
}
async function exportHTMLAs(type, html){
   // let text = convertHTMLTableToCJI(workingTable.buildTable().innerHTML);
   let text = convertHTMLTableToCJI(html);
   let file = new Blob([text], {type: 'plain'});
   
   try{
      let handle = await showSaveFilePicker({
          suggestedName: `${workingTable._.name}.${type}`,
          types: [{
              description: 'Text file',
              accept: {'text/plain': ['.txt', '.cji']},
          }],
      });
      
      let writableStream = await handle.createWritable();
      await writableStream.write(file);
      await writableStream.close();
   }catch(err){
      console.warn('Could not run showSaveFilePicker: ', err);
      console.log('Using boring download instead');
      
      let a = document.createElement("a");
      let url = URL.createObjectURL(file);
      a.href = url;
      a.download = `${workingTable._.name}.${type}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
         document.body.removeChild(a);
         window.URL.revokeObjectURL(url);
      }, 0);
   }
}
function outputHTMLAsCJI(html){
   let text = convertHTMLTableToCJI(html);
   // document.getElementById('dummy').appendChild(document.createElement('br'));
   // document.getElementById('dummy').appendChild(document.createTextNode(text));
   // document.getElementById('dummy').innerText = '\n\n' + text;
   document.getElementById('dummy').innerText = text;
}
workingTable.html.tableExportCJI.addEventListener('click', () => { exportHTMLAs('cji', workingTable.buildTable().innerHTML) });
workingTable.html.tableExportTXT.addEventListener('click', () => { exportHTMLAs('txt', workingTable.buildTable().innerHTML) });
workingTable.html.tableCJIOutput.addEventListener('click', () => { outputHTMLAsCJI(workingTable.buildTable().innerHTML) });

function convertCJIToGoogleSheetsData(str){
   let E, e, S;
   // [E]ntries (un-trimmed), [e]ntries, [S]trings (all),      << UNUSED >>: [s]tring, [t]ag, [d]ata
   
   let c = {         // compiled data ...
      a: {           // ... as array
         t: [],
         d: [],
      },
      s: {           // ... as string
         t: '',
         d: '',
      },
   };
   
   E = str.split('\n');
   e = E.filter(entry => Array.from(entry)[0] == '[');
   S = Array.from(e, n => n.split(/\[|\]/).join('').split(/(?<=\{)(?=\})/).join(' ').split(/(?<=\{)|(?=\{)|(?<=\})|(?=\})/).join('\n').split('\n'));
   S.forEach(s => {
      let t = s.filter((n, i) => i % 4 == 0);
      t.unshift('[');
      t.push(']');
      t = t.join('\n');
      c.a.t.push(t);
      
      let d = s.filter((n, i) => i % 4 == 2);
      d.unshift(' ');
      d.push(' ');
      d = d.join('\n');
      c.a.d.push(d);
   });
   c.s.t = c.a.t.join('\n');
   c.s.d = c.a.d.join('\n');
   
   // console.log(e, S);
   console.table(c);
   
   let D = document.getElementById('dummy');
   D.innerText = '';
   D.innerHTML = '';
   
   let out = document.createElement('table');
   out.classList.add('info-table');
   let heO = document.createElement('tr');      // header for out
   heO.classList.add('info-table-row');
   let he1, he2, he3;
   he1 = document.createElement('th');
   he1.classList.add('info-table-header');
   he1.innerText = 'ENTRY TAGS COLUMN';
   he2 = document.createElement('th');
   he2.classList.add('info-table-header');
   he2.innerText = 'BRACKET FILL COL.';
   he3 = document.createElement('th');
   he3.classList.add('info-table-header');
   he3.innerText = 'ENTRY DATA COLUMN';
   heO.appendChild(he1);
   heO.appendChild(he2);
   heO.appendChild(he3);
   out.appendChild(heO);
   
   let R = [[], [], Array.from('!FIX BRACKET FUNCTION! ')];
   R[0] = c.s.t.split('\n');
   R[1] = c.s.d.split('\n');
   
   for(let i = 0; i < R[0].length; i ++){
      let row;
      let row_tag, row_fix, row_dat;
      
      row = document.createElement('tr');
      row.classList.add('info-table-row');
      
      row_tag = document.createElement('td');
      row_tag.classList.add('info-table-data');
      row_tag.innerText = R[0][i];
      row_fix = document.createElement('td');
      row_fix.classList.add('info-table-data');
      row_fix.innerText = R[2][i % R[2].length];
      row_dat = document.createElement('td');
      row_dat.classList.add('info-table-data');
      row_dat.innerText = R[1][i];
      
      row.appendChild(row_tag);
      row.appendChild(row_fix);
      row.appendChild(row_dat);
      out.appendChild(row);
   }
   
   D.appendChild(out);
}

workingTable.html.convertFileToGSheets.addEventListener('click', e => {
   let text = convertHTMLTableToCJI(workingTable.buildTable().innerHTML);
   convertCJIToGoogleSheetsData(text);
});
workingTable.html.convertCJIToGSheetsData.addEventListener('keydown', e => {
   workingTable.html.convertCJIToGSheetsData.rows = workingTable.html.convertCJIToGSheetsData.value.split('\n').length + 1;
});
workingTable.html.convertCJIToGSheetsData.addEventListener('keyup', e => {
   workingTable.html.convertCJIToGSheetsData.rows = workingTable.html.convertCJIToGSheetsData.value.split('\n').length + 1;
});
workingTable.html.convertCJIToGSheets.addEventListener('click', e => {
   convertCJIToGoogleSheetsData(workingTable.html.convertCJIToGSheetsData.value);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// TODO
// Make a function/object/class/whatever for quickly accessing things for different CJI versions
// (main example being the v0/v1 diff. of inset brackets)
//
// ALSO something relevant
// add a ver. tracker for escape sequences
// currently using `/<~~> to escape ~~,
// but i was never too happy with that so may change it in future CJI versions
//
/*
   THINGS TO ADD TO CJI VERSION THING
   nested brackets
   handling of many entries per tag per listing
   escape keys/sequences
*/

// Instead of an ignore argument, just use a CJIReader to cut out unwanted parts
class CJIReader extends RegExp{
   constructor(tag, bracket, version, flag = 'mg'/*, ignore = [{}], escape = '`/'*/){
      // /(?<=cols(?<!(?<!\\)\{)(?<!\\)\{(?!\{)).*?(?=(?<!(?<!\\)\})(?<!\\)\}(?!(?<!\\)\}))/mg;
      // /(?<=cols(?<!\\)\{).*?(?=(?<=\}[^\{]*)\})/mg;
      // /(?<=(?<colID>\w+)\{).*?(?=\})/gm
      let temp = {};
      temp.cjiVersion = version;
      temp.RegExp = new RegExp('');
      let lbra, rbra;
      lbra = bracket[0];
      rbra = bracket[1];
      
      let re_argument = `(?<=(?<!\\w)${tag}(?<!(?<!\\\\)\\${lbra})(?<!\\\\)\\${lbra}(?!\\${lbra})).*?(?=(?<!(?<!\\\\)\\${rbra})(?<!\\\\)\\${rbra}(?!(?<!\\\\)\\${rbra}))`
      // let re_argument = `(?<=${tag}(?<!\\\\)\\${lbra}).*?(?=(?<=\\${rbra}[^\\${lbra}]*)\\${rbra})`;
      // let re_argument = `(?<=(${tag})\\${lbra}).*?(?=\\${rbra})`;
      let re = new RegExp(re_argument, flag);
      temp.RegExp = re;
      
      super(re_argument, flag);
      
      Object.assign(this, temp);
   }
   
   pull(str){
      return str.match(this);
   }
   
   [Symbol.pullCJIData](str){
      /*String.prototype.pullCJIData = function(e){
         let temp = Array.from(this).join('');
         console.log(temp);
         return e[Symbol.pullCJIData](temp);
      }*/
      return str.match(this);
   }
   
   // Dunno why, but supering alone doesn't fix all RegExp things
   // v This is a wworkaround
   [Symbol.match](str){
      return RegExp.prototype[Symbol.match].call(this, str);
   }
   [Symbol.matchAll](str){
      return RegExp.prototype[Symbol.matchAll].call(this, str);
   }
   [Symbol.replace](str, rpl){
      return RegExp.prototype[Symbol.replace].call(this, str, rpl);
   }
   [Symbol.search](str){
      return RegExp.prototype[Symbol.search].call(this, str);
   }
   [Symbol.split](str, lim){
      return RegExp.prototype[Symbol.split].call(this, str, lim);
   }
   get [Symbol.valueOf](){
      return this.RegExp.__proto__.valueOf;
   }
   
   // Doubt I'll ever need this but
   // ooh shiny
   get [Symbol.toStringTag]() {
      return 'CJIReader';
   }
}

class ImportDataLibrary{
   constructor(defaultSet){
      this.__family__ = defaultSet.__family__;
      for(let def in defaultSet){
         if(def == '__family__'){
            continue;
         }
         this[def] = defaultSet[def];
         if(Array.isArray(defaultSet[def])){
            this[def] = this.__family__[defaultSet[def][0]];
         }
      }
   }
   
   get [Symbol.toStringTag]() {
      return 'CJIDataLibrary';
   }
}
const importDataDefaultLibrary_default = new ImportDataLibrary({
   __family__: {
      'default': '0<n{{\\s}}s{{0}}>1<n{{\\s}}s{{1}}>2<n{{\\s}}s{{2}}>',
   },
   'default': ['default'],
});
const importDataDefaultLibrary_dictionaryTable = new ImportDataLibrary({
   __family__: {
      'dictionary_verb': '0<n{{kanji}}s{{k}}>1<n{{reading(s)}}s{{r}}>2<n{{meaning}}s{{d}}>3<n{u-/ru-verb}s{u}>4<n{{particle(s)}}s{{p}}>5<n{{lesson #}}s{{l}}>',
      'dictionary_adjective': '0<n{{kanji}}s{{k}}>1<n{{reading(s)}}s{{r}}>2<n{{meaning}}s{{d}}>3<n{i-/na-/no-adjective}s{u}>4<n{{lesson #}}s{{l}}>',
      'dictionary_hasParticle': '0<n{{kanji}}s{{k}}>1<n{{reading(s)}}s{{r}}>2<n{{meaning}}s{{d}}>3<n{{particle(s)}}s{{p}}>4<n{{lesson #}}s{{l}}>',
      'dictionary_basic': '0<n{{kanji}}s{{k}}>1<n{{reading(s)}}s{{r}}>2<n{{meaning}}s{{d}}>3<n{{lesson #}}s{{l}}>',
      'dictionary_noParticle': '0<n{{kanji}}s{{k}}>1<n{{reading(s)}}s{{r}}>2<n{{meaning}}s{{d}}>3<n{{lesson #}}s{{l}}>',
      'dictionary_all': '0<n{{kanji}}s{{k}}>1<n{{reading(s)}}s{{r}}>2<n{{meaning}}s{{d}}>3<n{type}s{u}>4<n{{particle(s)}}s{{p}}>5<n{{lesson #}}s{{l}}>'
   },
   'default': ['dictionary_all'],
   'dictionary': ['dictionary_all'],
   'dictionary-adjective': ['dictionary_adjective'],
   'dictionary-noun': ['dictionary_basic'],
   'dictionary-verb': ['dictionary_verb'],
   'dictionary-a': ['dictionary_adjective'],
   'dictionary-n': ['dictionary_basic'],
   'dictionary-v': ['dictionary_verb'],
});

const libraryLibrary = {
   'default': importDataDefaultLibrary_default,
   'dictionary-table': importDataDefaultLibrary_dictionaryTable,
}
function pokeLibrary(s, f, ds, df, onfail = 'default'){
   // d_ = default _
   let shrtLib = Object.keys(libraryLibrary);
   let fullLib = Object.values(libraryLibrary);
   if(shrtLib.includes(s)){ return libraryLibrary[s]; }
   if(fullLib.includes(f)){ return libraryLibrary[shrtLib[fullLib.indexOf(f)]]; }
   if(shrtLib.includes(ds)){ return libraryLibrary[ds]; }
   if(shrtLib.includes(df)){ return libraryLibrary[shrtLib[fullLib.indexOf(df)]]; }
   return libraryLibrary[onfail] ?? libraryLibrary['default'];
}
/*function pingLibrary(s, f, ds, df, onfail = 'default'){
   return libraryLibrary[pokeLibrary(s, f, ds, df, onfail)];
}*/

// I don't give a shit if this is good practice or not
// It somehow does what I want it to so it stays
// But most importantly it feels cool to edit prototypes like this
String.prototype.pullCJIData = function(e){
   let temp = Array.from(this).join('');
   // console.log(temp);
   return e[Symbol.pullCJIData](temp);
}