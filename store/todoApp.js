import Vue from 'vue'
import cryptoRandomString from 'crypto-random-string'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  namespaced: true,
  state: () => ({
    db: null,
    todos: [],
    filter: 'all'
  }),
  getters: {
    filterdTodos (state) {
      switch (state.filter) {
        case 'all':
        default:
          return state.todos
        case 'active': // 해야할 항목
          return state.todos.filter((v) => !v.done)
        case 'completed': // 완료된 항목
          return state.todos.filter((v) => v.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter((v) => !v.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  mutations: {
    assignDB (state, db) {
      state.db = db
    },
    createDB (state, newTodo) {
      state.db
        .get('todos') // lodash todos라는 저장소를 불러와서
        .push(newTodo) // lodash newTodo객체를 넣어준다.
        .write() // lowdb db에 기록
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex) // (1번인자의 2번인자인덱스값을 지운다.)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  actions: {
    initDB ({ state, commit }) {
      const adapter = new LocalStorage('todo-app') // todo-app이라는 이름으로 생성
      // state.db = lowdb(adapter);
      commit('assignDB', lowdb(adapter))

      const hasTodos = state.db.has('todos').value() // DB있는지 체크
      if (hasTodos) {
        // state.todos = _cloneDeep(state.db.getState().todos);
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      } else {
        // DB초기화
        state.db
          .defaults({
            todos: []
          })
          .write() // db작성하는 lowdb메소드
      }
    },
    createTodo ({ commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }), // 10개단어로 랜덤 단어 생성
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      // create DB
      commit('createDB', newTodo)
      // create Client
      commit('pushTodo', newTodo)
    },
    updateTodo (context, { todo, value }) {
      context.commit('updateTodo', { todo, value })
      // create Client
      const foundTodo = _find(context.state.todos, { id: todo.id })
      context.commit('assignTodo', { foundTodo, value })
    },
    deleteTodo (context, todo) {
      context.commit('deleteDB', todo)

      const foundIndex = _findIndex(context.state.todos, { id: todo.id })
      context.commit('deleteTodo', foundIndex)
    },
    completeAll (context, checked) {
      // DB갱신
      const newTodos = context.state.db
        .get('todos')
        .forEach((todo) => {
          // v.done = checked;
          context.commit('updateTodo', {
            todo,
            key: 'done',
            value: checked
          })
        })
        .write()
      // LOCAL갱신
      // context.state.todos = _cloneDeep(newTodos);
      context.commit('assignTodos', _cloneDeep(newTodos))
    },
    clearCompleted (context) {
      _forEachRight(context.state.todos, (todo) => {
        if (todo.done) {
          context.dispatch('deleteTodo', todo)
        }
      })
    }
  }
}
