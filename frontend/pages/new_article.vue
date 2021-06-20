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
    <b-button @click.prevent="$store.dispatch('clearArticle')"> Очистить информацию о статье</b-button>
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
        {id : 0, type : 'square', style : 'border : 1px solid black; width : 50px; height : 50px;',complex : false,annotation : 'Четырехугольник', properties : [
          {property : 'border', params : [
            {annotation : 'Толщина', default : '1px', value : '1px'},
            {annotation : 'Тип рамки', default : 'solid', value : 'solid', variants : []},
            {annotation : 'Цвет рамки(rgb или словесная анотация)', default : 'black', value : 'black'}
          ]},
          {
            property : 'height', params : [
              { default : '50px', value : '50px'}
            ]
          },
          {
            property : 'width', params : [
              { default : '50px', value : '50px'}
            ]
          }
      ]
        },
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
      },
      canvas_desktop_objects_count : 0,
      canvas_mobile_objects_count : 0,
      canvas_laptop_objects_count : 0,
    }
  },
  methods : {
    onDragStart(e, item) {
      this.$store.dispatch('changeCurrentItem',item) // помещаем в хранилище текущий редактируемый объект
      // добавить проверку десктоп или мобил
    },
    onDrop(e) { // событие, когда на канве была отпущена клавиша мыши(с нужным элементом, который помещается в store.currentItem, cм. onDragStart).
      console.log(e)
      switch(e.target.id) { // на какую конву был помещен объект
        case 'desktop_canvas' : { // если объект был помещен на декстопный канвас
          let desktopCanvas = document.getElementById('desktop_canvas')
          let newElement = document.createElement('div')
          let positionProperties = {}
          let currentItemProperties = Object.entries(this.getCurrentItem)
          let canvasProperties = Object.entries({canvas_type : 'desktop_canvas',canvas_inner_id : this.canvas_desktop_objects_count})
          for(let [prop,value] of _.merge(currentItemProperties,canvasProperties)) {
             if(prop == 'style') { // изменяем позиционирование элемента на абсолютное, для вольного размещения по канве
               value += `position:absolute;top:${e.clientY}px;left:${e.clientX}px;` // размещаем элемент на той позиции, куда установлен курсор на момент дропа
             }
             newElement.setAttribute(prop,value)
             positionProperties[prop] = value // информация о координатах объекта
          }
          let currentItem = { ..._.merge(this.getCurrentItem,positionProperties) }
          console.log(currentItem)
          this.canvas_desktop_objects_count++
          this.$store.dispatch('clearCurrentItem')
          this.$store.dispatch('newArticleItem',currentItem)
          desktopCanvas.appendChild(newElement)
          //desktopCanvas.addEventListener('click', (e) => {console.log(e)})

          // также открыть редактор элемента
        }
      }
    },
    jsonToCss(obj) { // парсинг значений в строку со стилями
      let result = ''
      for(let [key,value] of Object.entries(obj)) {
        result += key + ':' + value + ';'
      }
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
