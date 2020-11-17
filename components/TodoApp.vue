<template>
    <div>
        <todo-item/>
        <todo-creator/>
    </div>
</template>
<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'
export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data(){
      return{
          db:null
      }
  },
  created(){
      this.initDB()
  },
  methods:{
      initDB(){
          const adapter = new LocalStorage('todo-app') //todo-app이라는 이름으로 생성
          this.db=lowdb(adapter)

          this.db.defaults({
            todos: []
          }).write() //db작성하는 lowdb메소드
      }
  }
}
</script>
