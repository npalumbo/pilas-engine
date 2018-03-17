import Service from "@ember/service";
import config from "pilas-engine/config/environment";
import Ember from "ember";
import { task, timeout } from "ember-concurrency";

export default Service.extend({
  iniciado: false,
  data: null,
  lista_de_actores: [1],

  tareaConseguirActores: task(function*() {
    yield timeout(500);

    let metadata = yield Ember.$.ajax({
      mimeType: "application/json",
      dataType: "json",
      url: `${config.rootURL}actores/actores.json`
    });

    let codigo_del_actor_base = yield Ember.$.ajax({
      url: `${config.rootURL}actores/-actor-base.ts`
    });

    let propiedades_base = this.extraer_diccionario("propiedades_base", codigo_del_actor_base);

    for (let i = 0; i < metadata.actores.length; i++) {
      let actor = metadata.actores[i];

      let codigo = yield Ember.$.ajax({
        url: `${config.rootURL}actores/${actor.archivo}`
      });

      actor.codigo = codigo;


      let propiedades = this.extraer_diccionario("propiedades", codigo);
      actor.propiedades = this.combinar_propiedades(propiedades_base, propiedades);
    }

    this.set("lista_de_actores", metadata.actores);

    return metadata;
  }).drop(),

  extraer_diccionario(diccionario, codigo) {
    let regex = new RegExp(`${diccionario}\\s+=\\s+(\\{[\\s\\S]*?\\})`, "g");
    let resultado = regex.exec(codigo)

    let propiedades = {};

    if (resultado && resultado.length > 1) {
      propiedades = eval("(" + resultado[1] + ")")
    }

    return propiedades;
  },

  combinar_propiedades(propiedades_iniciales, propiedades) {
    function extend(obj, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
      }
      return obj;
    }

    return extend(JSON.parse(JSON.stringify(propiedades_iniciales)), propiedades);
  },


  iniciar() {
    return this.get("tareaConseguirActores").perform();
  }
});
