
//1
const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const rows = 10;
const cols = 10;



const spreadsheet = []; //빈 배열을 생성함
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'k', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


const exportBtn = document.querySelector('#export-btn');







// for 반복문을 써서 행과 열을 생성함.
function createSpreadSheet() {
    for (let i = 0; i < rows; i++) {
        let spreadRows = [];
        for (let j = 0; j < cols; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            //4. 헤더를 만들어서 알파벳과 번호를 넣어준다.
            if(j === 0) {
                isHeader = true;
                cellData = i;
                disabled = true;
            }
            if(i === 0) {
                isHeader = true;
                cellData = alphabets[j - 1];
                disabled = true;

            }
            if(cellData <= 0 ) {
                cellData = "";
            }
            if(!cellData) {
                cellData = "";
            }
           
            const rowName = i;
            const columnName = alphabets[j - 1];                                                                        //cellData 변수를 만들어 data 에 넣어준다
            const cell = new Cell(isHeader, disabled, cellData,i, j, rowName, columnName,false); 
            //인스턴스 생성해줌 객체
            spreadRows.push(cell);// 아이템을 0-1 0-2 이런식으로 출력함. 그냥 문자열 에서 => cell 인스턴스를 넣어준다
        }
        spreadsheet.push(spreadRows);
    }
    drawSheet();
} 






//2.각각의 셀이 객체가 되어야한다.
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.rowName = rowName;//6. rowName columnName 변수를 만들어줌
        this.column = column;
        this.columnName = columnName;
        this.active = active;
    }
}



exportBtn.onclick = (e) => {
    let csv ='';
    for(let i = 0; i < spreadsheet.length; i++) {
        if(i===0) continue;//  다운로드해서 엑셀 켰을때 윗줄에 한칸 띄워져셔 나오니깐 skip
        csv += 
            spreadsheet[i]
                .filter((item) => !item.isHeader)
                .map((item) => item.data)
                .join(',') + '\r\n';
    }

    const csvObj = new Blob([csv]);
    //내보내고 싶은 데이터 변수 생성
    const csvUrl = URL.createObjectURL(csvObj);//엑셀요소로 내보내줌
    console.log("csv", csvUrl);

    const a = document.createElement('a');// link url 
    a.href = csvUrl;
    a.download = "SpreadSheet name.csv";
    a.click();


}
createSpreadSheet();



//3.인풋요소 셀 생성
function createCell(cell) {
    const cellEl= document.createElement('input');
    cellEl.className = 'cell'; //클래스 객체
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => cellClick(cell); 
    cellEl.onchange = (e) => onChangeInput(e.target.value, cell); //입력값 반환

    return cellEl; //cellEl을 반환해준다

}


function onChangeInput(data, cell){
    cell.data = data;
}



function cellClick(cell) { //각 열과 행 겹치는 부분을 클릭할때 표시가 되도록 만들어 줌.

    clearSheet(); //다시 클릭 될때 이전의 상태를 clear 해주는 함수.   
    const columnHeader =  spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    //행과 열 헤더의 위치 좌표 가져오기.

    const columnHeaderEl = rowColEl(columnHeader.row, columnHeader.column);
    const rowHeaderEl = rowColEl(rowHeader.row, rowHeader.column);
    //위치를 표시해주는 함수 넣어준다


    columnHeaderEl.classList.add("active");
    rowHeaderEl.classList.add("active");
    //클래스를 넣어서 색상을 보이게 한다.


    document.querySelector("#cell-status").innerHTML = " " + cell.columnName + " " + cell.rowName;


}

function rowColEl (row, col){
    return document.querySelector('#cell_' + row + col);  
}//함수를 이용해서 html 요소의 id를 이용해서 가져온다.


function clearSheet() {
    const headerEl = document.querySelectorAll('.header');

    headerEl.forEach(el => el.classList.remove('active'));

}




//스프레드시트 엘리먼트 렌더링하기
function drawSheet() {
    for (let i=0; i <  spreadsheet.length; i++) {
        const rowContainerEl = document.createElement('div');
        rowContainerEl.className = 'cell-row';

        for (let j=0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCell(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  } 

}


