<template>
    <div class='todo-app'>
      <div class="todo-app__actions">
        <div class="filters">
          <button :class='{active:filter==="all"}' @click='changeFilter("all")'>모든 항목 ({{total}})</button>
          <button :class='{active:filter==="active"}' @click='changeFilter("active")'>해야 할 항목 ({{activeCount}})</button>
          <button :class='{active:filter==="completed"}' @click='changeFilter("completed")'>완료된 항목 ({{completedCount}})</button>
        </div>
        <div class="actions">
          <input v-model='allDone' type="checkbox">
          <button @click='clearCompleted'>완료된 항목 삭제</button>
        </div>
      </div>
      <div class="todo-app__list">
        <todo-item v-for='todo in filterdTodos' :key='todo.id' :todo='todo' @update-todo='updateTodo' @delete-todo='deleteTodo' />
      </div>
        <hr>
        <todo-creator class='todo-app__creator' @create-todo="createTodo"/>
    </div>
</template>
<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
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
      todos: [],
      filter: 'all'
    }
  },
  computed: {
    filterdTodos () {
      switch (this.filter) {
        case 'all':
        default:
          return this.todos
        case 'active': // 해야할 항목
          return this.todos.filter(v => !v.done)
        case 'completed': // 완료된 항목
          return this.todos.filter(v => v.done)
      }
    },
    total () {
      return this.todos.length
    },
    activeCount () {
      return this.todos.filter(v => !v.done).length
    },
    completedCount () {
      return this.total - this.activeCount
    },
    allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
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

      // create DB
      this.db
        .get('todos') // lodash todos라는 저장소를 불러와서
        .push(newTodo) // lodash newTodo객체를 넣어준다.
        .write() // lowdb db에 기록

      // create Client
      this.todos.push(newTodo)
    },
    updateTodo (todo, value) {
      this.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()

      // create Client
      const foundTodo = _find(this.todos, { id: todo.id })
      _assign(foundTodo, value)
    },
    deleteTodo (todo) {
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()

      // _remove(this.todos, { id: todo.id }) 실제로 지워지긴하지만 mutable해서 안된디ㅏ.
      const foundIndex = _findIndex(this.todos, { id: todo.id })
      this.$delete(this.todos, foundIndex) // (1번인자의 2번인자인덱스값을 지운다.)
    },
    changeFilter (filter) {
      this.filter = filter
    },
    completeAll (checked) {
      // DB갱신
      const newTodos = this.db
        .get('todos')
        .forEach(v => {
          v.done = checked
        })
        .write()
      // LOCAL갱신
      this.todos = _cloneDeep(newTodos)
    },
    clearCompleted () {
      // 네이티브 로직
      // this.todos.reduce((list, todo, index) => {
      //   if (todo.done) {
      //     list.push(index)
      //   }
      //   return list
      // }, [])
      //   .reverse()
      //   .forEach(v => {
      //     this.deleteTodo(this.todos[v])
      //   })

      // lodash
      // _forEachRight(this.todos, v => {
      //   if (v.done) {
      //     this.deleteTodo(v)
      //   }
      // })
      this.todos = this.todos.filter(v => v.done === false)
    }
  }
}
</script>
<style lang="scss" scoped>
button.active{
  font-weight: bold;
}
</style>
