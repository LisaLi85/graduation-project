import Vue from 'vue'

var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: []
  },
  // created: function(){
  //   let i = 0
  //   setInterval(()=>{
  //     this.newTodo = i // this.newTodo 就是 data.newTodo，实际上 this.newTodo 是 data.newTodo 的代理
  //     i+= 1
  //   },1000)
  // }
  // created: function(){
  //   setInterval(()=>{
  //     console.log(this.newTodo)
  //   },1000)
  // }
  created: function(){
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList) 
      let newTodoData = JSON.stringify(this.newTodo)
      window.localStorage.setItem('myTodos', dataString) 
      window.localStorage.setItem('newTodoData',newTodoData)
    }

    let oldDataString = window.localStorage.getItem('myTodos')
    let newTodoData = window.localStorage.getItem('newTodoData')

    let oldData = JSON.parse(oldDataString)
    let newTodo = JSON.parse(newTodoData)

    this.todoList = oldData || []
    this.newTodo = newTodo || ""

  },
  methods: {
    addTodo: function(){
      var date = new Date();
      var year = date.getFullYear(),
          month = parseInt(date.getMonth()+1),
          month1 =(month<10 ? "0"+month:month),
          day = date.getDate(),
          day1 =(day<10 ? "0"+day:day),
          hour = date.getHours(),
          hour1 =(hour<10 ? "0"+hour:hour),
          min = date.getMinutes(),
          min1 =(min<10 ? "0"+min:min),
          second = date.getSeconds(),
          second1 =(second<10 ? "0"+second:second);
      var result=year+'/'+month1+'/'+day1+' '+hour1+':'+min1+':'+second1 ;
      this.todoList.push({
        title: this.newTodo,
        createdAt: result,
        done:false   //添加一个done属性
      })
      this.newTodo = ''  // 变成空
    },
    // 加了删除待办这个函数
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是 ES 5 新加的 API
      this.todoList.splice(index,1) // 不懂 splice？赶紧看 MDN 文档！
    }
  }
})