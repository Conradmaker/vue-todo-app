<template>
    <div class="todo-item">

        <div v-if='isEditMode' class="item__inner item--edit">
            <input :value='editedTitle' type="text" @input="editedTitle=$event.target.value" @keypress.enter="editedTodo" @keypress.esc="offEditMode">
            <div class="item__actions">
                <button @click='editedTodo'>완료</button>
                <button @click='offEditMode'>취소</button>
            </div>
        </div>
        <div v-else class="item__inner item--normal">
            <input type="checkbox" v-model="done">
            <div class='item__title-wrap'>
                <div class="item__title">
                    {{todo.title}}
                </div>
                <div class="item__data">
                    {{date}}
                </div>
            </div>
            <div class='item__actions'>
                <button @click="onEditMode">수정</button>
                <button @click="deleteTodo">삭제</button>
            </div>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  props: {
    todo: Object
  },
  data () {
    return { isEditMode: false, editedTitle: '' }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
    date () {
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt) // 날짜 같은지 비교
      if (isSame) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
    }
  },
  methods: {
    editedTodo () {

    },
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.title
    },
    offEditMode () {
      this.isEditMode = false
    },
    updateTodo (value) {
      this.$emit('update-todo', this.todo, value)
    },
    deleteTodo () {
      this.$emit('delete-todo', this.todo)
    }
  }
}
</script>
