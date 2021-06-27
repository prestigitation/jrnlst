<template>
  <div class="m-4">
    <client-only>
      <div class="editor position-fixed fixed-bottom fixed-left p-2" v-if="getCurrentItem">
        <h6>Редактор элемента </h6>
        <div v-for="item in getCurrentItem" :key="item">
          <div v-for="property in item.properties" :key="property">
            <u class="lead">{{property.annotation}}</u>
              <div v-for="param in property.params" :key="param">
                  <b-form-input v-if="param.input_type=='text'" :class="'editor_' + getCurrentItem[0].canvas_type + '_'+ getCurrentItem[0].canvas_inner_id" type="text" :placeholder='param.annotation' class="my-2">{{param.default}}</b-form-input>
                  <b-form-select v-model="editor_select" :class="'editor_' + getCurrentItem[0].canvas_type + '_'+ getCurrentItem[0].canvas_inner_id"  v-else-if="param.input_type=='select'" :options="param.variants" class="my-2">{{param.annotation}}</b-form-select>
              </div>
           </div>
        </div>
        <div class="d-flex">
          <b-button variant='success' class='my-2 mx-1 mx-auto w-auto justify-content-center' @click.prevent='editItem'>Применить стили</b-button>
          <b-button variant='danger' class='my-2  mx-1 mx-auto w-auto justify-content-center' @click.prevent="deleteItem"> Удалить элемент </b-button>
        </div>
      </div>
      <div class='d-flex'>
        <b-form-input type="text" v-model="title" placeholder="Введите название статьи" class="w-25"/>
        <div class='mx-3 d-flex align-items-center'> Помещайте на рабочую область нужные объекты при помощи мыши:</div>
        <div v-for="element in objects" :key="element.id" class="mx-3 d-flex align-items-center justify-content-center">
          <img v-if="element.img" :src="element.img.src" width="35" height="40">
          <div :style="element.style" :id='element.id' draggable="true" @dragstart="onDragStart($event, element)">{{ element.content }}</div>
        </div>
      </div>
      <div id="desktop_canvas" class="mt-3" @dragover.prevent @dragenter.prevent @drop="onDrop($event)" :style="jsonToCss(desktop_canvas_style)">
      </div>
      <b-button @click.prevent="$store.dispatch('clearArticle');$store.dispatch('clearCurrentItem')" class="w-25 mx-auto"> Очистить информацию о статье</b-button>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _merge from 'lodash'
export default {
  data() {
    return{
        title: '',
        editorForm: '',
        objects: [{
                id: 0,
                type: 'square',
                style: 'border : 1px solid black; width : 50px; height : 50px;',
                complex: false,
                annotation: 'Четырехугольник',
                properties: [{
                        property: 'border',
                        annotation: 'Четырехугольник',
                        params: [
                          { annotation: 'Толщина', default: '1px', value: '1px', input_type: 'text' },
                          {
                                annotation: 'Тип рамки',
                                default: 'solid',
                                value: 'solid',
                                variants: [
                                    { value: null, text: 'Тип границы', disabled: true },
                                    { value: 'dotted', text: 'dotted' },
                                    { value: 'dashed', text: 'dashed' },
                                    { value: 'solid', text: 'solid' },
                                    { value: 'double', text: 'double' },
                                    { value: 'groove', text: 'groove' }
                                ],
                                input_type: 'select',
                          },
                          { annotation: 'Цвет рамки(rgb или словесная анотация)', default: 'black', value: 'black', input_type: 'text' }
                        ]},
                        {
                            property: 'height',
                            params: [
                                {annotation : 'Высота', default: '50px', value: '50px',input_type : 'text'}
                            ],

                        },
                        {
                            property: 'width',
                            params: [
                                {annotation : 'Ширина', default: '50px', value: '50px',input_type : 'text'}
                            ],
                        }
                ]
            },
            { id: 1, type: 'circle', style: 'border-radius : 25px;border : 1px solid black; padding : 25px;', annotation : 'Окружность', complex: false, properties: [
                        {
                        property: 'border',
                        annotation: 'Круг',
                        params: [
                          { annotation: 'Толщина', default: '1px', value: '1px', input_type: 'text' },
                          {
                                annotation: 'Тип рамки',
                                default: 'solid',
                                value: 'solid',
                                variants: [
                                    { value: null, text: 'Тип границы', disabled: true },
                                    { value: 'dotted', text: 'dotted' },
                                    { value: 'dashed', text: 'dashed' },
                                    { value: 'solid', text: 'solid' },
                                    { value: 'double', text: 'double' },
                                    { value: 'groove', text: 'groove' }
                                ],
                                input_type: 'select',
                          },
                          { annotation: 'Цвет рамки(rgb или словесная анотация)', default: 'black', value: 'black', input_type: 'text' }
                        ]},
                        {
                            property: 'padding',
                            params: [
                                {annotation : 'Внтуренний отступ', default: '25px', value: '25px',input_type : 'text'}
                            ],
                        },
                        {
                            property: 'border-radius',
                            params: [
                                {annotation : 'Радиус круга', default: '25px', value: '25px',input_type : 'text'}
                            ],
                        },
            ]
            },
            { id: 2, type: 'text', content: 'Text', style: 'font-weight: bold;text-decoration:underline;', img: { src: './text_cursor.png' }, complex: false },
        ],
        currentObject: undefined,
        desktop_canvas_style: {
            'height': '720px',
            'width': '1280px',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'border': '2px dotted black'
        },
        canvas_desktop_objects_count: 0,
        canvas_mobile_objects_count: 0,
        canvas_laptop_objects_count: 0,
        editor_select: null
    }
  },
  methods : {
    deleteItem() {},
    isStyleCompatible() {}, // соответствие регулярке, определенное в свойстве объекта
    editItem() {
      let currentItem = this.getCurrentItem[0]
      let {canvas_type,canvas_inner_id,properties} = currentItem
      let editedElements = document.getElementsByClassName('editor_' +  canvas_type + '_' + canvas_inner_id)
      // Элементы редактора имеют класс, подобный шаблону в строке выше. Находим все элементы для поcледующего итерирования
      let editedProperties = [] // Массив значений, затронутых редактором
      let counter = 0;
      properties.forEach(property =>{
          for(let index in property.params) {
            // для select  полей _value , для текста - value
            property.params[index].value = editedElements[counter].value ? editedElements[counter].value : editedElements[counter]._value
            counter++
        }
        editedProperties.push(property)
      })
      let mergedProperties = _.merge(_.merge(currentItem.properties,editedProperties),currentItem.properties)
      // сливаем полученные свойства объекта с измененными
      console.log(mergedProperties)
      currentItem.properties = mergedProperties
      let editedItem = currentItem
      console.log(editedItem)
      this.$store.dispatch('replace', editedItem) // заменяем предыдущий элемент статьи на отредактированный
      this.$store.dispatch('changeCurrentItem',editedItem) // устанавливаем отредактированный объект как текущий
      this.replaceEditedItemStyle(editedItem) // изменяем стили отредактированному объекту
    },
    replaceEditedItemStyle(item) {
      let canvasElements = document.getElementById(item.canvas_type).getElementsByTagName('div')
      let editedElement
      for(let i=0;i<canvasElements.length;i++) {
        if(canvasElements[i].getAttribute('canvas_inner_id') == item.canvas_inner_id) {
          editedElement = canvasElements[i]
        }
      }
      editedElement.style = this.parseObjectStyles()
    },
    parseObjectStyles() {
      let properties = this.getCurrentItem.properties
      let currentItemStyle = this.getCurrentItem.style
      console.log(properties)
      let result = ''
      for(let index in properties) {
        let params = properties[index].params
          if(params.length > 1) {
            result += `${properties[index].property}:`
            for(let param in params) {
              result+=`${params[param].value} `
              if(param == params.length - 1) {  // если выбран последний элемент, добавляем ;
                result+= ';'
              }
            }
          } else
          if(properties[index].property)
            result += `${properties[index].property}:`
          if(params[0]._value) {
            result += ` ${params[0]._value}`
          } else if(params[0].value) {
            result += `${params[0].value} `
          }
          result +=';'
      }
      result += currentItemStyle.slice(currentItemStyle.indexOf('position')) // приплетаем стили из текущего объекта хранилища
      // путем поиска в строке подстроки, начинающейся с position, т.к нам необходима позиция и следующие за ней координаты объекта
      return result
    },
    onDragStart(e, item) {
      this.$store.dispatch('changeCurrentItem',item) // помещаем в хранилище текущий редактируемый объект
    },
    onDrop(e) {
          let desktopCanvas = document.getElementById(e.target.id)
          let newElement = document.createElement('div')
          let currentItemProperties = this.getCurrentItem
          let positionProperties = {canvas_type : 'desktop_canvas',canvas_inner_id : e.target.id == 'desktop_canvas' ? this.canvas_desktop_objects_count : this.canvas_mobile_objects_count   } // REFACTOR
          for(let [prop,value] of Object.entries(_.merge(currentItemProperties,positionProperties))) {
             if(prop == 'style') {
               // изменяем позиционирование элемента на абсолютное, для вольного размещения по канве
               value += `position:absolute;top:${e.clientY}px;left:${e.clientX}px;`
               // размещаем элемент на той позиции, куда установлен курсор на момент дропа
             }
             newElement.setAttribute(prop,value)
             positionProperties[prop] = value // информация о координатах объекта
          }
          let desktopProperties = {...this.getCurrentItem, canvas_inner_id : e.target.id == 'desktop_canvas' ? this.canvas_desktop_objects_count : this.canvas_mobile_objects_count, canvas_type : e.target.id }
          let currentItem = { ..._.merge(desktopProperties,positionProperties) } // REFACTOR
          if(e.target.id =='desktop_canvas') {
            this.canvas_desktop_objects_count++
          } else if (e.target.id == 'mobile_canvas') {
            this.canvas_mobile_objects_count++
          }
          this.$store.dispatch('clearCurrentItem')
          this.$store.dispatch('newArticleItem',currentItem)
          desktopCanvas.appendChild(newElement)
          newElement.addEventListener('click',e => {
            e.preventDefault()
            this.$store.dispatch('getEditedElement',e.target.getAttribute('canvas_inner_id'),e.target.id)
            // при клике на элемент он помечается как текущий редактируенмый объект
          })
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
    ...mapGetters(['getCurrentItem','getArticle']),
  },
  destroyed() {
    this.$store.dispatch('clearArticle')
  }
}
</script>

<style>
  .editor {
    width: 350px;
    height: auto;
    border: 1px solid black;
    background-color: white;
  }
</style>
