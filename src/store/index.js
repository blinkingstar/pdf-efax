import Vue from "vue";
import Vuex from "vuex";
import Store from 'electron-store';

Vue.use(Vuex);


const persistentStore = new Store({defaults: {
  addressbook: {},
  config: {
    host: "",
    port: 0,
    secure: false,
    username: "",
    password: "",
    from: "",
    defaultcc: "81",
    jsonstorage: ""
  }
}});


async function uploadaddressbook (state,data) {
  let jsonstorage = state.config.jsonstorage;
  if (jsonstorage) {
    const uploaded = await (async () => {
      try {
        await fetch(
          'https://jsonstorage.net/api/items/' + jsonstorage, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
          }
        );
        console.log('uploaded');
        return 'updated';
      } catch (e) {
        console.log(e);
        return e;
      }
    })();
    return uploaded;
  }
  else {
    return 'not configured';
  }
}

const store = new Vuex.Store({
  state: {
    config: persistentStore.get('config') || {},
    addressbook: persistentStore.get('addressbook') || {},
    uploadfile: ""
  },
  mutations: {
    saveconfig(state,newconfig) {
      console.log(newconfig)
      state.newconfig = { ...newconfig };
      Vue.nextTick();
      persistentStore.set('config',newconfig)
    },
    setfile(state,file) {
      console.log('setfile: ' + file);
      state.uploadfile = file;
      Vue.nextTick();
    },
    setaddressbook(state,payload) {
      console.log(state);
      persistentStore.set('addressbook',payload)
      state.addressbook = { ...payload };
      Vue.nextTick();
    },
  },
  actions: {
    async deleteaddressbook({ commit, state }, tel) {
      let addressbook = state['addressbook'];
      delete addressbook[tel];
      commit('setaddressbook',addressbook);
      const uploaded = await uploadaddressbook(state,addressbook);
      return uploaded;
    },
    async updateaddressbook({ commit, state }, payload) {
      let oldtel = payload.oldtel;
      let newtel = payload.newtel;
      let title = payload.title;
      let addressbook = state.addressbook;
      if (!newtel.match(/^[0-9]{1,4}-[0-9]+/)){
        console.log('not a tel number');
      }
      else {
        if (!newtel) {
          console.log('Why did you come here?');
        }
        else if (!title) {// newtel exists and newtitle doesnt exit
          console.log('Did not acccess from addressbook or want to delete?');
          // delete addressbook[oldtel];
        }
        else if (!oldtel){ // newtel and newtitle exists
          addressbook[newtel] = title;
        }
        else {// oldtel, newtel and newtitle exists
          if (oldtel == newtel) {
            addressbook[oldtel] = title;
          }
          else {
            // delete addressbook[oldtel];
            addressbook[newtel] = title;
          }
        }
        commit('setaddressbook',addressbook);
        const uploaded = await uploadaddressbook(state,addressbook);
        return uploaded;
      }
    },
    async resetaddressbook({ commit, state }) {
      console.log(state);
      commit('setaddressbook',{});
    },
    
  },
});

export default store;