var workingTable = {
   html: {
      nameInput: document.querySelector('#table-name'),
      columnCountInput: document.querySelector('#c-cnt'),
      columnNameSpan: document.querySelector('#name-columns'),
      rowContainter: document.querySelector('#row-cont'),
      dynamicColumnNames: [],
   },
   _: {
      name: '',
      ccnt: 0,
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
};

workingTable.html.nameInput.addEventListener('keyup', e => {
   workingTable.name;
});

workingTable.html.columnCountInput.addEventListener('keyup', e => {
   // workingTable.name;
   try{
      let c = Number(workingTable.html.columnCountInput.value);
      workingTable._.ccnt = c;
      workingTable._.cols = new Array(c);
      
      // Generate/replace column name slots
      workingTable.html.dynamicColumnNames = [];
      workingTable.html.columnNameSpan.innerHTML = 'Col names: ';
      for(let i = 0; i < c; i ++){
         let n = document.createElement('input');
         n.type = 'text';
         let N = i + 1;
         N --;
         n.addEventListener('keyup', f => {
            workingTable._.cols[N] = n.value;
         });
         workingTable.html.dynamicColumnNames.push(n);
         workingTable.html.columnNameSpan.appendChild(n);
      }
   }catch(err){
      console.error(err);
      workingTable.html.columnCountInput.value = '';
   }
});