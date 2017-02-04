import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'wclgS15f7YC6jxBAs697s2Ba-gzGzoHsz';
var APP_KEY = 'IvojIWtA2UIwXkUP6x2EAs7O';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello World!'
// }).then(function(object) {
//   alert('LeanCloud Rocks!');
// })

var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    currentUser:null,
    actionType:'signUp',
    formData:{
      username:'',
      password:''
    }
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

    this.currentUser = this.getCurrentUser();

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
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => { // 将 function 改成箭头函数，方便使用 this
        this.currentUser = this.getCurrentUser() 
      }, (error) => {
        alert('注册失败') 
      });
    },
    login:function(){
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      },(error) => {
        alert('登录失败')
      });
    },
    getCurrentUser:function(){
      let current = AV.User.current()
      if(current){
        let{id,createdAt,attributes:{username}} = current
        return {id, username, createdAt}
      }else{
        return null
      }
    },
    logout: function () {
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
    }
  }
})