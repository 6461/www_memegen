"use strict";

Vue.component(
  'list', {
    template: '\
    <li class="collection-item avatar">\
      <i class="material-icons circle">folder</i>\
      <a v-bind:href="/meme/ + meme._id" class="title">{{ meme.name }}</a>\
      <p>{{ meme.date }}<br>{{ meme.caption }}</p>\
      <a href="#!" class="secondary-content" v-on:click="$emit(\'remove\')"><i class="material-icons red-text">delete_forever</i></a>\
    </li>',
    props: ['meme']
})

var vm = new Vue({
  el: '#app',

  data: {
    meme_list: [],
	loading: true,
	errored: false
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      axios
        .get('/meme/list')
        .then(response => {
          this.meme_list = response.data;
          // Format times to Finnish locale
          this.meme_list.forEach(function(meme, index) {
            let date_f = new Date(this[index].date);
            date_f = date_f.toLocaleString('fi-FI');
            this[index].date = date_f;
          }, this.meme_list);
	    })
        .catch(error => {
		    console.log(error);
		    this.errored = true;
	    })
        .finally(() => this.loading = false);
	},
	
    removeMeme(index) {
      axios
        .get('/meme/' + this.meme_list[index]._id + '/delete')
        .then(response => this.meme_list.splice(index, 1))
        .catch(error => {
			console.log(error);
		});
    }
  }
});
