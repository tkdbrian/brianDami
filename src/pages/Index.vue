<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input filled  label="Buscar..." v-model="filtro" />
    
    <!-- Editor -->
    <q-editor v-if="!modoEdicion"
  v-model="editor"
  flat
      content-class="bg-amber-3"
      toolbar-text-color="white"
      toolbar-toggle-color="yellow-8"
      toolbar-bg="primary"
      
  :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'guardar',
          
          handler: saveWork
        }
      }"
  :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
/>




<q-editor v-else
  v-model="editor"
  :definitions="{
        save: {
          tip: 'actualizar nota',
          icon: 'save',
          label: 'actualizar',
          handler: updateWork
        }
      }"
  :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
/>
    <!-- Donde se pinta -->
<q-card
  flat bordered  class="row justify-between"  v-for="(item, index) in flask" :key="index"
>
  <q-card-section
    v-html="item.texto"
    class="col"
    :class="item.estado ? 'tachar' : ''"
  >
    :class="item.estado ? 'tachar' : ''"
  >
  </q-card-section>
  <q-btn flat color="yellow" @click="editar(index, item.id)">actualizar</q-btn>
  <q-btn flat color="green" @click="item.estado = !item.estado">TAREA REALIZADA</q-btn>
  <q-btn flat color="red" @click="eliminar(index)">Eliminar</q-btn>
  <q-space />
</q-card>
<div v-if="tasks.length == 0" class="flex flex-center">
  <p class="text-h10">SIN NOTAS PENDIENTES</p>
</div>
  </div>
</template>
<script>







import { db } from "boot/firebase"; // no olvidar importar db
export default {
    data() {
      return {
        editor: "No te olvides de tus tareas, escribilas aca",
          tasks: [  ],
          index: null,
          texto: ' ',
          modoEdicion: false, 
          arrayFiltrado:[] 
           

      }
  },

  computed:{
  filtro:{
    get(){
      return this.texto
    },
    set(value){
      
      value = value.toLowerCase();

      this.arrayFiltrado = this.tasks.filter(
        item=> item.texto.toLowerCase().indexOF(VALUE)!==-1)
      this.texto = value
    }
  }
},
created(){
  this.listarTareas();
  this.notasFiltradas = this.tasks
},
  created(){
  this.listarTareas()
},

methods:{
async updateWork(){
  try {
    const resDB = await db.collection('tarea').doc(this.id).update({
      texto: this.editor
    })

    this.tasks[this.index].texto = this.editor;
    this.$q.notify({
      message: 'Tarea actualizada con éxito!',
      color: 'dark',
      textColor: 'white',
      icon: 'cloud_done'
    })
  } catch (error) {
    console.log(error);
     this.$q.notify({
      message: error,
      color: 'red',
      textColor: 'white',
      icon: 'clear'
     })
  }finally{
  this.editor = ''
  this.index = null;
  this.modoEdicion = false;  
  this.id = null;
    }
},
 editar(index, id){
  this.editor = this.tasks[index].texto
  this.index = index;
  this.modoEdicion = true;  
  this.id = id;
},
async listarTareas(){
  try {
   this.$q.loading.show()
    const resDB = await db.collection('tarea').get();

    resDB.forEach(res => {
     // console.log(res.id);
      const tarea ={
        id: res.id,
        texto: res.data().texto,
        estado:res.data().estado
      }
      this.tasks.push(tarea)
    });
  } catch (error) {
    console.log(error);
  } finally {
    this.$q.loading.hide()
  }
},



  async saveWork () {
    
    try {
      this.$q.loading.show()
    const resDB = await db.collection('tarea').add({
      texto: this.editor,
      estado: false
    })
      
    } catch (error) {
      
    }
    this.tasks.push({
      texto: this.editor,
      estado:false
    })
    this.$q.notify({
      message: 'Tarea guardada',
      color: 'green-12',
      textColor: 'black',
      icon: 'cloud_done'
    })
  },
  eliminar(index){
  this.$q.dialog({
    title: 'Cuidado!',
    message: 'Desea eliminar la nota?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    this.tasks.splice(index, 1);
  })
}
}

}
</script>

<style>
  .tachar {
    text-decoration: line-through;
  }
  
</style>
