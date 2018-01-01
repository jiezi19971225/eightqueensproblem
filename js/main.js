//数据结构栈
stack={
	data:[],
	push:function(e){
		this.data[this.data.length++] = e;
	},
	pop:function(){
		this.data.length--;
	},
	empty:function(){
		return this.data.length === 0;
	},
	top:function(){
		return this.data[this.data.length - 1];
	},
	clear:function(){
		this.data.length = 0;
	}
}
//方向数组
mov=[
	[-1,-2],
	[-2,-1],
	[-2,1],
	[-1,2],
	[1,2],
	[2,1],
	[2,-1],
	[1,-2],
];
//路径数组
path=[
	[],[],[],[],[],[],[],[]
];
//可行数数组
accessible=[
	[],[],[],[],[],[],[],[]
]
//存储答案
resolution = [];

cnt=0;
//状态对象构造函数
Statu=function(row,col,step){
	this.row = row;
	this.col = col;
	this.step = step;
	this.currentMoveWay = 0;
	this.order= [];
}
//初始化函数
function init(){
	stack.clear();
	initSupportArray();
	var beginStatu = generateRandomPositon();
	stack.push(beginStatu);
}
//初始化辅助数组
function initSupportArray(){
	for(var i = 0;i < 8;i++){
		for(var j = 0;j < 8;j++){
			path[i][j] = 0;
			accessible[i][j] = 0;
			for(var k = 0;k < 8;k++){
				var newI=i + mov[k][0];
				var newJ=j + mov[k][1];
				if(newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8){
					accessible[i][j]++;
				} 
			}
		}
	}	
}
//冒泡排序
function bubbleSort(access,order){
	for(var i = 0;i < 7;i++){
		for(var j = 0;j < 7 - i;j++){
			if(access[j]>access[j+1]){
				var temp = order[j];
				order[j] = order[j+1];
				order[j+1] = temp;
				temp = access[j];
				access[j] = access[j+1];
				access[j+1] = temp;
			}
		}
	}
}
//生成随机初始位置
function generateRandomPositon(){
	var rrow = Math.floor(Math.random()*8);
	var rcol = Math.floor(Math.random()*8);
	var beginStatu = new Statu(rrow,rcol,1);
	handleStatuAccessible(beginStatu);
	path[rrow][rcol]=1;
	return beginStatu;
}
//记录可行方案
function recordResolution(){
	var res=[];
	for(var i = 0;i < 8;i++){
		res[i]=[];
	}
	for(var i = 0;i < 8;i++){
		for(var j = 0;j < 8;j++){
			res[i][j] = path[i][j];
		}
	}
	resolution.push(res);
}
//处理状态的可行性数组
function handleStatuAccessible(statu){
	var access = [];
	var order = [0,1,2,3,4,5,6,7];
	for(var i = 0;i < 8;i++){
		var newRow = statu.row + mov[i][0];
		var newCol = statu.col + mov[i][1];
		if(newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !path[newRow][newCol]){
				access[i] =  accessible[newRow][newCol] - 1;
		}else{
			access[i] = 0;
		}
	}
	bubbleSort(access,order);
	var cur = 0;
	while(access[cur] == 0 && cur < 8){
		cur++;
	}
	statu.currentMoveWay = cur;
	statu.order = order;

	if(cur == 8){
		return false;
	}
	return true;
}
//调整可行性
function adjust(row,col){
	for(var i = 0;i <8;i++){
		var newRow = row + mov[i][0]; 
		var newCol = col + mov[i][1];
		if(newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8){
			accessible[newRow][newCol]--;
		} 
	}
}
function rollBack(row,col){
	for(var i = 0;i <8;i++){
		var newRow = row + mov[i][0]; 
		var newCol = col + mov[i][1];
		if(newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8){
			accessible[newRow][newCol]++;
		} 
	}
}
//生成一组答案
function solve(){
	while(!stack.empty()){
		var currentStatu = stack.top();
		var haveNextStatu = 0;
		var currentMoveWay = currentStatu.currentMoveWay;
		if(currentStatu.step == 63){
			console.log("ok");
			path[currentStatu.row][currentStatu.col] = 0;
			rollBack(currentStatu.row,currentStatu.col);
			stack.pop();
			return;
		}
		for(var i = currentStatu.currentMoveWay;i < 8;i++){
			moveMay = currentStatu.order[i];
			var newRow = currentStatu.row + mov[moveMay][0];
			var newCol = currentStatu.col + mov[moveMay][1];
			newStatu = new Statu(newRow,newCol,currentStatu.step+1);
			
			if(handleStatuAccessible(newStatu)){
				haveNextStatu = 1;
				stack.push(newStatu);
				adjust(newRow,newCol);
				path[newRow][newCol] = currentStatu.step + 1;
				currentStatu.currentMoveWay += 1;
				break;	
			}
		}
		if(!haveNextStatu){
			path[currentStatu.row][currentStatu.col] = 0;
			rollBack(currentStatu.row,currentStatu.col);
			stack.pop();
		}
	}
}
function generateGraph(){
	var chessboard = $(".chessboard");
	for(var i = 0;i < 8;i++){
		for(var j=0;j < 8;j++){
			var gird = $("<div class='gird gird-"+i+"-"+j+"'></div>");
			gird.css({
				"width": "75px",
				"height": "75px", 
				"float": "left",
			});
			chessboard.append(gird);
		}
	}
}
function drawPath(){
	for(var i = 0;i < 8;i++){
		for(var j = 0;j < 8;j++){
			var gird = $(".gird-"+i+"-"+j);
			if(path[i][j]==0){
				gird.text(64);
			}else{
				gird.text(path[i][j]);
			}
		}
	}
}
$(document).ready(function(){
	generateGraph();
	$(".newRandomBtn").click(function(){
		init();
	});
	$(".nextAnswerBtn").click(function(){
		solve();
		drawPath();
	});
});