<template>
   <div id="topbar">
     <div class="wrapper">
        <span class="logo">Resumer</span>
        <div class="actions">
          <!-- <button class="primary">保存</button>
          <button>预览</button> -->
          <div v-if="logined" class="userActions">
            <span class="welcome">你好，{{user.username}}</span>
            <a class="button" href="#" @click.prevent="signOut">登出</a>
          </div>
          <div v-else class="userActions">
            <a class="button primary" href="#" @click.prevent="signUpDialogVisible = true">注册</a>
            <!-- <MyDialog title="注册" :visible="signUpDialogVisible" v-show="signUpDialogVisible" @close="signUpDialogVisible = false"> -->
              <!-- 我就是 slot 内容 -->
              <!-- <SignUpForm @success="signIn($event)"/>
            </MyDialog> -->
            <a class="button" href="#" @click.prevent="signInDialogVisible = true">登录</a>
            <!-- <MyDialog title="登录" :visible="signInDialogVisible" @close="signInDialogVisible = false">
              <SignInForm/>
            </MyDialog> -->
          </div>
          <!-- <button class="button primary">保存</button>
          <button class="button">预览</button> -->
        </div>
     </div>
     <MyDialog title="注册" :visible="signUpDialogVisible" v-show="signUpDialogVisible" @close="signUpDialogVisible = false">
         <!-- 我就是 slot 内容 -->
          <SignUpForm @success="signIn($event)"/>
     </MyDialog>
     <MyDialog title="登录" :visible="signInDialogVisible" v-show="signInDialogVisible" @close="signInDialogVisible = false">
          <SignInForm @success="signIn($event)"></SignInForm>
     </MyDialog>
   </div>
</template>

<script>
 import MyDialog from './MyDialog'
 import SignUpForm from './SignUpForm'
 import SignInForm from './SignInForm'


 import AV from '../lib/leancloud'

 export default {
   name: 'Topbar',
   data(){
    return {
      signUpDialogVisible:false,//false点击的时候注册框才会出现
      signInDialogVisible:false
    }
   },
   computed: {//computed相当于属性的一个实时计算,如果实时计算里关联了对象,那么当对象的某个值改变的时候,同事会出发实时计算
    user(){
      return this.$store.state.user
    },
    logined(){
      return this.user.id
    }
   },
   components: {
    MyDialog, SignUpForm, SignInForm
   },
   methods: {
    signOut(){
      AV.User.logOut()
      this.$store.commit('removeUser')
    },
    signIn(user){
      this.signUpDialogVisible = false
      this.signInDialogVisible = false
      this.$store.commit('setUser', user)
    }
   }
 }
</script>

<style scoped lang="scss">
// 自行查阅 scoped 的功能
// 见：https://cn.vuejs.org/v2/guide/comparison.html#CSS-的组件作用域
   #topbar{
     background:#fff;
     box-shadow:0 1px 3px 0 rgba(0,0,0,0.25);
     >.wrapper{
       min-width: 1024px;
       max-width: 1440px;
       margin: 0 auto;
       height:64px;
     }
     >.wrapper{
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding:16px;
     }
    .logo{
       font-size:24px;
       color:#000000;
     }
   }
   .button{// 由于加了 scoped， 所以这个 button 选择器只在本组件内有效，不会影响其他组件
     width:72px;
     height:32px;
     line-height:32px;
     border:none;
     cursor:pointer;
     font-size:18px;// 设计稿上是 20px，看起来太大，就改成 18px 了
     background:#3da2f3;
     color:white;
     text-decoration:none;
     display:inline-flex;
     justify-content:center;
     vertical-align:middle;
     &:hover{
        box-shadow:1px 1px 1px hsla(0,0,0,0.50);
     }
     &.primary{
        background:#02af5f;
        color:white;
     }
   }
   .actions{
     displya:flex;
     .userActions{
       margin-right:3em;
       .welcome{
        margin-right:0.5em;
       }
     }
   }
</style>