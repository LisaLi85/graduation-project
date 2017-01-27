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

    // window.onbeforeunload = ()=>{    
    // 	// 内容已经删除
    // }

    // let oldDataString = window.localStorage.getItem('myTodos')
    // let newTodoData = window.localStorage.getItem('newTodoData')

    // let oldData = JSON.parse(oldDataString)
    // let newTodo = JSON.parse(newTodoData)

    // this.todoList = oldData || []
    // this.newTodo = newTodo || ""

    // this.currentUser = this.getCurrentUser();

    this.currentUser = this.getCurrentUser();
    this.fetchTodos(); // 将原来的一坨代码取一个名字叫做 fetchTodos  

  },

  methods: {

  	fetchTodos: function(){
      if(this.currentUser){
        var query = new AV.Query('AllTodos');
        query.find()
          .then((todos) => {
            let avAllTodos = todos[0] // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
            let id = avAllTodos.id
            this.todoList = JSON.parse(avAllTodos.attributes.content) // 为什么有个 attributes？因为我从控制台看到的
            this.todoList.id = id // 为什么给 todoList 这个数组设置 id？因为数组也是对象啊
          }, function(error){
            console.error(error) 
          })
      }
    },

    updateTodos: function(){
      // 想要知道如何更新对象，先看文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
      let dataString = JSON.stringify(this.todoList) // JSON 在序列化这个有 id 的数组的时候，会得出怎样的结果？
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(()=>{
        console.log('更新成功')
      })
    },  	

  	saveTodos: function(){
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();

      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(),true) // 只有这个 user 能读
      acl.setWriteAccess(AV.User.current(),true) // 只有这个 user 能写

      avTodos.set('content', dataString);

      avTodos.setACL(acl) // 设置访问控制

      avTodos.save().then((todo) =>{
        this.todoList.id = todo.id  // 一定要记得把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
    //    alert('保存成功');
    	console.log('保存成功');
      }, function (error) {
    //    alert('保存失败');
    	console.log('保存失败');
      });
    },

    saveOrUpdateTodos: function(){
      if(this.todoList.id){
        this.updateTodos()
      }else{
        this.saveTodos()
      }
    },


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

      this.saveOrUpdateTodos() // 不能用 saveTodos 了
    },
    // 加了删除待办这个函数
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是 ES 5 新加的 API
      this.todoList.splice(index,1) // 不懂 splice？赶紧看 MDN 文档！
      this.saveOrUpdateTodos() // 不能用 saveTodos 了
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {//将function改成箭头函数，方便使用this
        this.currentUser = this.getCurrentUser()
      }, (error) => {
    //    alert('注册失败')
    	console.log('注册失败');
      });
    },
    login:function(){
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser();
        this.fetchTodos();	// // 登录成功后读取 todos
      },(error) => {
    //    alert('登录失败')
    	console.log('登录失败');
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