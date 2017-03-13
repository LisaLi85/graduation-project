<template>
	<div>
	  <div class="page">
	     <header>
	        <Topbar/>      
	     </header>
	     <main>
	         <ResumeEditor/>
	         <ResumePreview/>       
	     </main>
	  </div>
	</div>
</template>

<script>
  import 'normalize.css/normalize.css'
  import './assets/reset.css'

  import Topbar from './components/Topbar'
  import ResumeEditor from './components/ResumeEditor'
  import ResumePreview from './components/ResumePreview'
  import icons from './assets/icons'

  import store from './store/index'
  import AV from './lib/leancloud'
  import getAVUser from './lib/getAVUser'


  export default {
    name: 'app',
    store,
    components: { Topbar, ResumeEditor, ResumePreview},//组件
    created() {
  	  document.body.insertAdjacentHTML('afterbegin', icons) // 
  	  let state = localStorage.getItem('state')//数据保存到localStorage
  	  if(state){
  	  	state = JSON.parse(state)
  	  }
  	  this.$store.commit('initState',state)
  	  this.$store.commit('setUser', getAVUser())
    }
  }
</script>

<style lang="scss">
  	.page{
        height: 100vh;
        display: flex;
        flex-direction: column;/* 决定项目的排列方向 */
        background: #EAEBEC;
  	    >main{
       		flex-grow: 1; /*属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大*/
  		}
  		>main{
	       min-width: 1024px;
	       max-width: 1440px;
	       margin-top: 16px;
	       margin-bottom: 16px;
	       display: flex;
	       justify-content: space-between;/*属性定义了项目在主轴上的对齐方式,两端对齐，项目之间的间隔都相等*/
	       padding: 0 16px;
	       width: 100%; /* 试试不加这句会怎样 */
	       align-self: center;/*允许单个项目有与其他项目不一样的对齐方式*/
	  	}
	}

  	#resumeEditor{
       	   min-width: 35%;//用min-width代替width
           background: #444;
    }    
  	#resumePreview{
           /*width: 61.66667%;*/
           flex-grow: 1;
           margin-left: 16px;
           background: #777;
    }
    svg.icon{
	    height: 1em;
	    width: 1em;
	    fill: currentColor;
	    vertical-align: -0.1em;
	    font-size:16px;
    }
</style>
