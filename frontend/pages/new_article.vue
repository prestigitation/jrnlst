<template>
  <div class="m-4">
    <client-only>
      <div class='d-flex'>
        <b-form-input type="text" v-model="title" placeholder="Введите название статьи" class="w-25"/>
        <div class='mx-3 d-flex align-items-center'> Помещайте на рабочую область нужные объекты при помощи мыши:</div>
        <div v-for="element in objects" :key="element.id" class="mx-3 d-flex align-items-center justify-content-center">
          <img v-if="element.img" :src="element.img.src" width="35" height="40">
          <div :style="element.style" :id='element.id' draggable="true" @dragstart="onDragStart($event, element)">{{ element.content }}</div>
        </div>
      </div>
    </client-only>
    <div id="desktop_canvas" class="mt-3" @dragover.prevent @dragenter.prevent @drop="onDrop($event)" :style="jsonToCss(desktop_canvas_style)">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _merge from 'lodash'
export default {
  data() {
    return {
      title : '',
      objects : [
        {id : 0, type : 'square', style : 'border : 1px solid black; width : 50px; height : 50px;',complex : false},
        {id : 1, type : 'circle', style : 'border-radius : 25px;border : 1px solid black; padding : 25px;',complex : false},
        {id : 2, type: 'text', content : 'Text' ,style : 'font-weight: bold;text-decoration:underline;', img : { src : './text_cursor.png'},complex : false},
      ],
      currentObject : undefined,
      desktop_canvas_style : {
        'height' : '720px',
        'width' : '1280px',
        'margin-left' : 'auto',
        'margin-right' : 'auto',
        'border' : '2px dotted black'
      }
    }
  },
  mounted() {
    const obj1 = {
      desktop_canvas : {
        width: "200",
        height: "200"
      }
};
const obj2 = {
  desktop_canvas : {
    test : '300'
  }
};
    console.log(_.merge(obj1,obj2))
  },
  methods : {
    onDragStart(e, item) {
      /*e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('itemId', item.id.toString())*/
      this.$store.dispatch('changeCurrentItem',item) // помещаем в хранилище текущий редактируемый объект
      // добавить проверку десктоп или мобил
    },
    onDrop(e) { // событие, когда на канве была отпущена клавиша мыши(с нужным элементом, который помещается в store.currentItem, cм. onDragStart).
      console.log(e)
      switch(e.target.id) { // на какую конву был помещен объект
        case 'desktop_canvas' : { // если объект был помещен на декстопный канвас
          let desktopCanvas = document.getElementById('desktop_canvas')
          let newElement = document.createElement('div')
          let currentItem = this.getCurrentItem
          for(let [prop,value] of Object.entries(this.getCurrentItem)) {
             if(prop == 'style') { // изменяем позиционирование элемента на абсолютное, для вольного размещения по канве
               value += `position:absolute;top:${e.clientY}px;left:${e.clientX}px;` // размещаем элемент на той позиции, куда установлен курсор на момент дропа
               console.log(value)
             }
             newElement.setAttribute(prop,value)
          }
          this.$store.dispatch('clearCurrentItem')
         // this.$store.dispatch('newArticleItem',item,'canvas')
          desktopCanvas.appendChild(newElement)
          // также открыть редактор элемента
          //this.$store.dispatch('newArticleItem',item);
        }
      }
    },
    jsonToCss(obj) { // парсинг значений в строку со стилями
      let result = ''
      for(let [key,value] of Object.entries(obj)) {
        result += key + ':' + value + ';'
      }
      console.log(typeof result)
      return result
    }
  },
  computed: {
    ...mapGetters(['getCurrentItem','getArticle'])
  }
}
</script>

<style>

</style>
