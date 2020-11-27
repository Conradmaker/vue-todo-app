<template>
    <div class='todo-app'>
      <div class="todo-app__actions">
        <div class="filters">
          <!-- '/todos/'를 생략할수 있다. -->
          <router-link to='/todos/all' tag='button' >모든 항목 ({{total}})</router-link>
          <router-link to='/todos/active' tag='button' >해야 할 항목 ({{activeCount}})</router-link>
          <router-link to='/todos/completed' tag='button' >완료된 항목 ({{completedCount}})</router-link>
        </div>
        <div class="actions clearfix">
          <div class="float--left">
            <label><input v-model='allDone' type="checkbox"><span class='icon'><i class="material-icons">done_all</i></span></label>
          </div>
          <div class="float--right clearfix">
            <button class='btn float--left' @click='scrollToTop'>
              <i class="material-icons">expand_less</i>
            </button>
            <button class='btn float--left' @click='scrollToBottom'>
              <i class="material-icons">expand_more</i>
            </button>
            <button class='btn btn--danger float--left' @click='clearCompleted'><i class="material-icons">delete_sweep</i></button>
          </div>
        </div>
      </div>
      <div class="todo-app__list">
        <todo-item v-for='todo in filterdTodos' :key='todo.id' :todo='todo' @update-todo='updateTodo' @delete-todo='deleteTodo' />
      </div>
        <todo-creator class='todo-app__creator' @create-todo="createTodo"/>
    </div>
</template>
<script>
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import scrollTo from 'scroll-to'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  computed: {
    filterdTodos () {
      switch (this.$route.params.id) {
        case 'all':
        default:
          return this.todos
        case 'active': // 해야할 항목
          return this.todos.filter(v => !v.done)
        case 'completed': // 완료된 항목
          return this.todos.filter(v => v.done)
      }
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
    deleteTodo (todo) {
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()

      // _remove(this.todos, { id: todo.id }) 실제로 지워지긴하지만 mutable해서 안된디ㅏ.
      const foundIndex = _findIndex(this.todos, { id: todo.id })
      this.$delete(this.todos, foundIndex) // (1번인자의 2번인자인덱스값을 지운다.)
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

      _forEachRight(this.todos, v => {
        if (v.done) {
          this.deleteTodo(v)
        }
      })
    },
    scrollToTop () {
      scrollTo(0, 0, {
        ease: 'linear'
      })
    },
    scrollToBottom () {
      scrollTo(0, document.body.scrollHeight, { ease: 'linear' })
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/style';

  .filters button.router-link-active{
    background:royalblue;
  }
</style>
