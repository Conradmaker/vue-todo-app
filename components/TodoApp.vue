<template>
    <div>
        <todo-item v-for='todo in todos' :key='todo.id' :todo='todo' @update-todo='updateTodo' @deleteTodo='deleteTodo' />
        <hr>
        <todo-creator @create-todo="createTodo"/>
    </div>
</template>
<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _cloneDeep from 'lodash/cloneDeep'
import cryptoRandomString from 'crypto-random-string'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null,
      todos: []
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    initDB () {
      const adapter = new LocalStorage('todo-app') // todo-app이라는 이름으로 생성
      this.db = lowdb(adapter)

      const hasTodos = this.db.has('todos').value() // DB있는지 체크
      if (hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos)
        console.log(this.todos)
      } else {
        // DB초기화
        this.db.defaults({
          todos: []
        }).write() // db작성하는 lowdb메소드
      }
    },
    createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }), // 10개단어로 랜덤 단어 생성
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }
      this.db
        .get('todos') // lodash todos라는 저장소를 불러와서
        .push(newTodo) // lodash newTodo객체를 넣어준다.
        .write() // lowdb db에 기록
    },
    updateTodo () {
      console.log('update')
    },
    deleteTodo () {
      console.log('delete')
    }
  }
}
</script>
