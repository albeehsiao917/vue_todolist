var app = new Vue({
  el: '#app',
  data: { //這裡放的是原本的資料，過濾後的資料是放在computed裡
    newTodo: '',
    todos: [ //先生假資料
      {
        id: '1',
        title: 'hello',
        completed: false
      }
    ],
    cacheTodo: {}, //暫存編輯的todo物件
    cacheTitle: '', //暫存編輯的title內容
    visibility: 'all' //目前待辦事項的狀態
  },
  methods: {
    getTodo() { //取得localStorage資料
      console.log(window.location.todoList);
      if(localStorage.todoList !== undefined) {
        this.todos = JSON.parse(localStorage.todoList);
      };
    },
    saveTodo() { //儲存資料至localStorage
      let vm = this;
      localStorage.setItem('todoList',JSON.stringify(vm.todos));
      console.log('savetodos', window.localStorage.todoList);
    },
    addTodo: function() { //新增待辦事項
      let value = this.newTodo.trim(); //儲存input裡輸入的內容 //trim() 刪除兩邊多餘的空白鍵
      let timestamp = Math.floor(Date.now()); //利用時間當list的ID //Date.now()取得目前時間 //Math.floor() 將Date.now轉成正整數
      if(!value){ //如果value沒有內容則不能新增
        return;
      };
      this.todos.push({ //新增資料進todos裡
        id: timestamp,
        title: value,
        completed: false
      });
      this.newTodo = ''; //newTodo內容新增後清空
      this.saveTodo();
    },
    removeTodo: function(id){ //刪除待辦事項 
      let index = this.todos.findIndex(item => item.id == id);
      this.todos.splice(index,1);
      this.saveTodo();
    },
    editTodo: function(item){ //編輯待辦事項
      this.cacheTodo = item;
      this.cacheTitle = item.title; //用做編輯時的預設內容
    },
    cancleEdit: function(){ //取消編輯
      this.cacheTodo = {};
    },
    doneEdit: function(item){ //編輯完成
      item.title = this.cacheTitle;
      this.cacheTitle = '';
      this.cacheTodo = {};
    },
    deleteAll: function(){ //清除所有任務
      this.todos = [];
      localStorage.clear();
    }
  },
  computed: { //存放過濾後的資料（原始資料存放在data裡）
    filteredTodo: function(){ //過濾後的待辦事項
      if(this.visibility == 'all'){ //狀態＝全部
        this.saveTodo();
        return this.todos;
      }else if(this.visibility == 'active'){ //狀態＝進行中
        let activeTodo = [] //存放todos裡completed狀態=false的事項
        this.todos.forEach(function(item){
          if(!item.completed){ 
            activeTodo.push(item);
          };
        });
        this.saveTodo();
        return activeTodo;
      }else if(this.visibility == 'completed'){ //狀態＝已完成
        let completedTodo = [] //存放todos裡completed狀態=true的事項
        this.todos.forEach(function(item){
          if(item.completed){ 
            completedTodo.push(item);
          };
        });
        this.saveTodo();
        return completedTodo;
      };
    },
    totalActive: function(){ //還有幾筆資料未完成
      let currentActive = [];
      this.todos.forEach(function(item){
        if(!item.completed){ 
          currentActive.push(item);
        };
      });
      return currentActive.length;
    }
  },
  created() {
    this.getTodo();
  },
});