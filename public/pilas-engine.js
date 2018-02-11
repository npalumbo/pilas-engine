var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Actores = (function () {
    function Actores(pilas) {
        this.pilas = pilas;
    }
    Actores.prototype.Caja = function (x, y) {
        return new Caja(this.pilas, x, y, "caja");
    };
    Actores.prototype.Aceituna = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return new Aceituna(this.pilas, x, y);
    };
    return Actores;
}());
var Camara = (function () {
    function Camara(pilas) {
        this.pilas = pilas;
    }
    Camara.prototype.vibrar = function (intensidad, tiempo) {
        if (intensidad === void 0) { intensidad = 1; }
        if (tiempo === void 0) { tiempo = 1; }
        this.pilas.game.camera.shake(0.05 * intensidad, 250 * tiempo);
    };
    Object.defineProperty(Camara.prototype, "x", {
        get: function () {
            return this.pilas.game.camera.x;
        },
        set: function (x) {
            this.pilas.game.camera.x = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camara.prototype, "y", {
        get: function () {
            return -this.pilas.game.camera.y;
        },
        set: function (y) {
            this.pilas.game.camera.y = -y;
        },
        enumerable: true,
        configurable: true
    });
    return Camara;
}());
var Control = (function () {
    function Control(pilas) {
        this.pilas = pilas;
        this.teclaIzquierda = pilas.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.teclaDerecha = pilas.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.teclaArriba = pilas.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.teclaAbajo = pilas.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    }
    Object.defineProperty(Control.prototype, "izquierda", {
        get: function () {
            return this.teclaIzquierda.isDown;
        },
        set: function (v) {
            this.pilas.utilidades.acceso_incorrecto(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "derecha", {
        get: function () {
            return this.teclaDerecha.isDown;
        },
        set: function (v) {
            this.pilas.utilidades.acceso_incorrecto(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "arriba", {
        get: function () {
            return this.teclaArriba.isDown;
        },
        set: function (v) {
            this.pilas.utilidades.acceso_incorrecto(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "abajo", {
        get: function () {
            return this.teclaAbajo.isDown;
        },
        set: function (v) {
            this.pilas.utilidades.acceso_incorrecto(v);
        },
        enumerable: true,
        configurable: true
    });
    return Control;
}());
var Depurador = (function () {
    function Depurador(pilas) {
        this.pilas = pilas;
        this.modo_posicion_activado = false;
        this.mostrar_fps = true;
    }
    return Depurador;
}());
var Escenas = (function () {
    function Escenas(pilas) {
        this.escena_actual = null;
        this.pilas = pilas;
    }
    Escenas.prototype.Normal = function () {
        this.escena_actual = new Normal(this.pilas);
        return this.escena_actual;
    };
    Escenas.prototype.vincular = function (escena) {
        var _this = this;
        this[escena.name] = function () {
            _this.escena_actual = new escena(_this.pilas);
            return _this.escena_actual;
        };
    };
    return Escenas;
}());
var Log = (function () {
    function Log(pilas) {
        this.pilas = pilas;
    }
    Log.prototype.debug = function () {
        var mensaje = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mensaje[_i] = arguments[_i];
        }
        console.debug.apply(console, ["DEBUG"].concat(mensaje));
    };
    Log.prototype.info = function () {
        var mensaje = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mensaje[_i] = arguments[_i];
        }
        console.info.apply(console, ["INFO"].concat(mensaje));
    };
    return Log;
}());
var HOST = "file://";
if (window.location.host) {
    HOST = "http://" + window.location.host;
}
var Pilas = (function () {
    function Pilas() {
        this.log = new Log(this);
        this.agregar_manejador_de_eventos();
        this.capturar_errores_y_reportarlos_al_editor();
        this.depurador = new Depurador(this);
    }
    Pilas.prototype.iniciar = function () {
        this.game.state.add("editorState", EstadoEditor);
        this.game.state.add("estadoEjecucion", EstadoEjecucion);
        this.game.state.add("estadoPausa", EstadoPausa);
        this.game.scale.trackParentInterval = 1;
        this.conectar_atajos_de_teclado();
        this.control = new Control(this);
        this.actores = new Actores(this);
        this.escenas = new Escenas(this);
        this.utilidades = new Utilidades(this);
        pilas.game.camera.bounds = null;
        this.escenas.Normal();
    };
    Pilas.prototype.obtener_entidades = function () {
        return this.game.state.getCurrentState()["entidades"];
    };
    Pilas.prototype.escena_actual = function () {
        return this.escenas.escena_actual;
    };
    Object.defineProperty(Pilas.prototype, "camara", {
        get: function () {
            return this.escena_actual().camara;
        },
        enumerable: true,
        configurable: true
    });
    Pilas.prototype.conectar_atajos_de_teclado = function () {
        var _this = this;
        this.game.input.keyboard.onUpCallback = function (evento) {
            if (evento.keyCode == Phaser.Keyboard.ESC && (_this.game.state.current === "estadoEjecucion" || _this.game.state.current === "estadoPausa")) {
                _this.emitir_mensaje_al_editor("cuando_pulsa_escape", {});
            }
        };
    };
    Pilas.prototype.agregar_manejador_de_eventos = function () {
        var _this = this;
        window.addEventListener("message", function (e) { return _this.antender_mensaje_desde_el_editor(e); }, false);
    };
    Pilas.prototype.emitir_error_y_detener = function (error) {
        this.emitir_mensaje_al_editor("error", { mensaje: error.message, stack: error.stack });
        this.game.paused = true;
        console.error(error);
    };
    Pilas.prototype.capturar_errores_y_reportarlos_al_editor = function () {
    };
    Pilas.prototype.antender_mensaje_desde_el_editor = function (e) {
        var _this = this;
        if (e.origin != HOST) {
            return;
        }
        if (e.data.tipo === "define_escena") {
            this.game.state.start("editorState", true, false, {
                pilas: this,
                escena: e.data.escena,
                cuando_termina_de_mover: function (datos) {
                    _this.emitir_mensaje_al_editor("termina_de_mover_un_actor", datos);
                },
                cuando_comienza_a_mover: function (datos) {
                    _this.emitir_mensaje_al_editor("comienza_a_mover_un_actor", datos);
                }
            });
        }
        if (e.data.tipo === "ejecutar_proyecto") {
            this.game.state.start("estadoEjecucion", true, false, {
                pilas: this,
                proyecto: e.data.proyecto,
                nombre_de_la_escena_inicial: e.data.nombre_de_la_escena_inicial,
                codigo: e.data.codigo
            });
        }
        if (e.data.tipo === "ejecutar_escena") {
            this.game.state.start("estadoEjecucion", true, false, {
                pilas: this,
                escena: e.data.escena,
                codigo: e.data.codigo
            });
        }
        if (e.data.tipo === "cambiar_posicion") {
            var pos = +e.data.posicion;
            if (this.game.state.getCurrentState()["actualizarPosicionDeFormaExterna"]) {
                this.game.state.getCurrentState()["actualizarPosicionDeFormaExterna"](pos);
            }
        }
        if (e.data.tipo === "selecciona_actor_desde_el_editor") {
            var id = +e.data.id;
            var actores = this.obtener_actores();
            var sprites = this.game.state.getCurrentState()["obtener_sprites"]();
            var sprite = sprites[id];
            if (sprite) {
                sprite.destacar();
            }
        }
        if (e.data.tipo === "actualizar_actor_desde_el_editor") {
            var id = +e.data.id;
            var datos = e.data.actor;
            var actores = this.obtener_actores();
            var sprites = this.game.state.getCurrentState()["obtener_sprites"]();
            var sprite = sprites[id];
            if (sprite) {
                sprite.actualizar_desde_el_editor(datos);
            }
        }
        if (e.data.tipo === "pausar_escena") {
            var historia = this.game.state.getCurrentState()["historia"];
            this.game.state.start("estadoPausa", true, false, {
                pilas: this,
                historia: historia,
                cuando_cambia_posicion: function (datos) {
                    _this.emitir_mensaje_al_editor("cambia_posicion_dentro_del_modo_pausa", datos);
                }
            });
            var t = historia.length - 1;
            var datos = { minimo: 0, posicion: t, maximo: t };
            this.emitir_mensaje_al_editor("comienza_a_depurar_en_modo_pausa", datos);
        }
        if (e.data.tipo === "iniciar_pilas") {
            this.iniciar_pilas_desde_el_editor(+e.data.ancho, +e.data.alto);
        }
        if (e.data.tipo === "definir_estados_de_depuracion") {
            this.depurador.modo_posicion_activado = e.data.pos;
            this.depurador.mostrar_fps = e.data.fps;
        }
    };
    Pilas.prototype.iniciar_pilas_desde_el_editor = function (ancho, alto) {
        var _this = this;
        this._ancho = ancho;
        this._alto = alto;
        this.game = new Phaser.Game(this._ancho, this._alto, Phaser.AUTO, "game", {
            preload: function (e) { return _this._preload(); },
            create: function (e) { return _this._create(); }
        });
    };
    Pilas.prototype._preload = function () { };
    Pilas.prototype._create = function () {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.disableVisibilityChange = true;
        this.game.renderer.renderSession.roundPixels = true;
        this.game.load.onLoadStart.add(this._cuando_comienza_a_cargar, this);
        this.game.load.onFileComplete.add(this._cuando_carga_archivo, this);
        this.game.load.onLoadComplete.add(this._cuando_termina_de_cargar, this);
        this.start();
    };
    Pilas.prototype.start = function () {
        this.game.load.image("ember", "imagenes/ember.png");
        this.game.load.image("pelota", "imagenes/pelota.png");
        this.game.load.image("logo", "imagenes/logo.png");
        this.game.load.image("sin_imagen", "imagenes/sin_imagen.png");
        this.game.load.image("caja", "imagenes/caja.png");
        this.game.load.image("aceituna", "imagenes/aceituna.png");
        this.game.load.image("plano", "imagenes/fondos/plano.png");
        this.game.load.start();
    };
    Pilas.prototype._cuando_comienza_a_cargar = function () { };
    Pilas.prototype._cuando_carga_archivo = function (progreso) {
        this.emitir_mensaje_al_editor("progreso_de_carga", { progreso: progreso });
    };
    Pilas.prototype._cuando_termina_de_cargar = function () {
        this.iniciar();
        this.emitir_mensaje_al_editor("finaliza_carga_de_recursos", {});
    };
    Pilas.prototype.emitir_mensaje_al_editor = function (nombre, datos) {
        datos = datos || {};
        datos.tipo = nombre;
        window.parent.postMessage(datos, HOST);
    };
    Pilas.prototype.emitir_excepcion_al_editor = function (error) {
        var detalle = {
            mensaje: error.message,
            stack: error.stack.toString()
        };
        this.emitir_mensaje_al_editor("error_de_ejecucion", detalle);
        console.error(error);
    };
    Pilas.prototype.obtener_actores = function () {
        return pilas.game.world.children.map(function (s) { return s["actor"]; }).filter(function (s) { return s !== undefined; });
    };
    Pilas.prototype.obtener_cantidad_de_actores = function () {
        return this.obtener_actores().length;
    };
    Pilas.prototype.obtener_actores_en = function (_x, _y) {
        var actores = this.obtener_actores();
        var _a = this.convertir_coordenada_de_pilas_a_phaser(_x, _y), x = _a.x, y = _a.y;
        return actores.filter(function (actor) {
            return actor.sprite.getBounds().contains(x - actor.sprite.x, y - actor.sprite.y);
        });
    };
    Pilas.prototype.convertir_coordenada_de_pilas_a_phaser = function (x, y) {
        return { x: x + this._ancho / 2, y: this._alto / 2 - y };
    };
    Pilas.prototype.convertir_coordenada_de_phaser_a_pilas = function (x, y) {
        return { x: x - this._ancho / 2, y: this._ancho / 2 - y };
    };
    Pilas.prototype.obtener_oscilacion = function (velocidad, intensidad) {
        if (velocidad === void 0) { velocidad = 1; }
        if (intensidad === void 0) { intensidad = 100; }
        return this.escena_actual().obtener_oscilacion(velocidad, intensidad);
    };
    return Pilas;
}());
var pilas = new Pilas();
var Utilidades = (function () {
    function Utilidades(pilas) {
        this.pilas = pilas;
        this.id = 1;
    }
    Utilidades.prototype.obtener_id_autoincremental = function () {
        this.id = this.id + 1;
        return this.id;
    };
    Utilidades.prototype.acceso_incorrecto = function (v) {
        console.error("No se puede definir esta propiedad (valor " + v + ") porque es de solo lectura.");
    };
    Utilidades.prototype.obtener_rampa_de_colores = function () {
        var colores = ["#82E0AA", "#F8C471", "#F0B27A", "#F4F6F7", "#B2BABB", "#85C1E9", "#BB8FCE", "#F1948A", "#D98880"];
        return colores;
    };
    Utilidades.prototype.obtener_color_al_azar = function (opacidad) {
        var colores = this.obtener_rampa_de_colores();
        var cantidad_de_colores = colores.length;
        return colores[Math.floor(Math.random() * cantidad_de_colores)] + opacidad;
    };
    return Utilidades;
}());
var ActorBase = (function () {
    function ActorBase(pilas, x, y, imagen) {
        if (imagen === void 0) { imagen = "sin_imagen"; }
        var _this = this;
        this.pilas = pilas;
        this.sprite = new Phaser.Sprite(pilas.game, 0, 0, imagen);
        this.x = x;
        this.y = y;
        this.rotacion = 0;
        this.escala_x = 1;
        this.escala_y = 1;
        this.id_color = this.generar_color_para_depurar();
        this.pilas.game.world.add(this.sprite);
        this.sprite["actor"] = this;
        this.iniciar();
        this.sprite.update = function () {
            try {
                _this.actualizar();
            }
            catch (e) {
                _this.pilas.emitir_error_y_detener(e);
            }
        };
        this.pilas.escena_actual().agregar_actor(this);
    }
    ActorBase.prototype.iniciar = function () { };
    ActorBase.prototype.serializar = function () {
        return {
            tipo: this.tipo,
            x: Math.round(this.x),
            y: Math.round(this.y),
            centro_x: this.centro_x,
            centro_y: this.centro_y,
            rotacion: this.rotacion,
            escala_x: this.escala_x,
            escala_y: this.escala_y,
            imagen: this.sprite.key,
            id_color: this.id_color
        };
    };
    ActorBase.prototype.generar_color_para_depurar = function () {
        var opacidad = "FF";
        return this.pilas.utilidades.obtener_color_al_azar(opacidad);
    };
    ActorBase.prototype.actualizar = function () { };
    Object.defineProperty(ActorBase.prototype, "imagen", {
        get: function () {
            return this.sprite.frameName;
        },
        set: function (nombre) {
            this.sprite.loadTexture(nombre);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorBase.prototype, "x", {
        get: function () {
            var x = this.pilas.convertir_coordenada_de_phaser_a_pilas(this.sprite.x, 0).x;
            return x;
        },
        set: function (_x) {
            var x = this.pilas.convertir_coordenada_de_pilas_a_phaser(_x, 0).x;
            this.sprite.x = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorBase.prototype, "y", {
        get: function () {
            var y = this.pilas.convertir_coordenada_de_phaser_a_pilas(0, this.sprite.y).y;
            return y;
        },
        set: function (_y) {
            var y = this.pilas.convertir_coordenada_de_pilas_a_phaser(0, _y).y;
            this.sprite.y = y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorBase.prototype, "rotacion", {
        get: function () {
            return -this.sprite.angle % 360;
        },
        set: function (angulo) {
            this.sprite.angle = -(angulo % 360);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorBase.prototype, "escala_x", {
        get: function () {
            return this.sprite.scale.x;
        },
        set: function (s) {
            this.sprite.scale.x = s;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorBase.prototype, "escala_y", {
        get: function () {
            return this.sprite.scale.y;
        },
        set: function (s) {
            this.sprite.scale.y = s;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorBase.prototype, "centro_y", {
        get: function () {
            return this.sprite.anchor.y;
        },
        set: function (y) {
            this.sprite.anchor.y = y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorBase.prototype, "centro_x", {
        get: function () {
            return this.sprite.anchor.x;
        },
        set: function (x) {
            this.sprite.anchor.x = x;
        },
        enumerable: true,
        configurable: true
    });
    ActorBase.prototype.toString = function () {
        var clase = this.constructor["name"];
        return "<" + clase + " en (" + this.x + ", " + this.y + ")>";
    };
    return ActorBase;
}());
var Actor = (function (_super) {
    __extends(Actor, _super);
    function Actor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Actor.prototype.iniciar = function () {
    };
    Actor.prototype.actualizar = function () {
    };
    return Actor;
}(ActorBase));
var Aceituna = (function (_super) {
    __extends(Aceituna, _super);
    function Aceituna() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Aceituna.prototype.iniciar = function () {
        this.imagen = "aceituna";
    };
    return Aceituna;
}(Actor));
var Caja = (function (_super) {
    __extends(Caja, _super);
    function Caja() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Caja.prototype.iniciar = function () {
        this.sprite.game.physics.p2.enable([this.sprite], true);
        this.sprite.body.static = false;
    };
    return Caja;
}(Actor));
var Pelota = (function (_super) {
    __extends(Pelota, _super);
    function Pelota() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pelota.prototype.iniciar = function () {
    };
    return Pelota;
}(Actor));
var ActorDentroDelEditor = (function (_super) {
    __extends(ActorDentroDelEditor, _super);
    function ActorDentroDelEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActorDentroDelEditor.prototype.iniciar = function (pilas, entidad) {
        this.key = entidad.imagen;
        this.id = entidad.id;
        this.pilas = pilas;
        var _a = this.pilas.convertir_coordenada_de_pilas_a_phaser(entidad.x, entidad.y), x = _a.x, y = _a.y;
        this.x = x;
        this.y = y;
        this.rotacion = entidad.rotacion;
        this.scale.x = entidad.escala_x;
        this.scale.y = entidad.escala_y;
        this.anchor.x = entidad.centro_x;
        this.anchor.y = entidad.centro_y;
        this.inputEnabled = true;
        this.input.enableDrag();
        this.crear_sombra();
        this.conectar_eventos_arrastrar_y_soltar();
    };
    ActorDentroDelEditor.prototype.conectar_eventos_arrastrar_y_soltar = function () {
        this.events.onDragStart.add(this.cuando_comienza_a_mover, this);
        this.events.onDragStart.add(this.activar_sombra, this);
        this.events.onInputOver.add(this.cuando_posiciona_el_mouse_sobre_el_actor, this);
        this.events.onInputOut.add(this.cuando_deja_de_posicionar_el_mouse_sobre_el_actor, this);
        this.events.onDragStop.add(this.ocultar_sombra, this);
        this.events.onDragStop.add(this.cuando_termina_de_mover, this);
    };
    ActorDentroDelEditor.prototype.al_terminar_de_arrastrar = function (a) { };
    ActorDentroDelEditor.prototype.al_comenzar_a_arrastrar = function (a) { };
    ActorDentroDelEditor.prototype.cuando_comienza_a_mover = function () {
        if (this.al_comenzar_a_arrastrar) {
            var _a = this.pilas.convertir_coordenada_de_phaser_a_pilas(this.x, this.y), x = _a.x, y = _a.y;
            this.definir_puntero("-webkit-grabbing");
            this.al_comenzar_a_arrastrar({ id: this.id, x: x, y: y });
        }
    };
    ActorDentroDelEditor.prototype.cuando_posiciona_el_mouse_sobre_el_actor = function () {
        this.definir_puntero("-webkit-grab");
    };
    ActorDentroDelEditor.prototype.cuando_deja_de_posicionar_el_mouse_sobre_el_actor = function () {
        this.definir_puntero("default");
    };
    ActorDentroDelEditor.prototype.cuando_termina_de_mover = function () {
        if (this.al_terminar_de_arrastrar) {
            var _a = this.pilas.convertir_coordenada_de_phaser_a_pilas(this.x, this.y), x = _a.x, y = _a.y;
            this.definir_puntero("-webkit-grab");
            this.al_terminar_de_arrastrar({ id: this.id, x: x, y: y });
        }
    };
    ActorDentroDelEditor.prototype.definir_puntero = function (nombre) {
        this.game.canvas.style.cursor = nombre;
    };
    ActorDentroDelEditor.prototype.activar_sombra = function () {
        this.shadow.alpha = 0.3;
    };
    ActorDentroDelEditor.prototype.ocultar_sombra = function () {
        this.shadow.alpha = 0.0;
    };
    ActorDentroDelEditor.prototype.update = function () {
        this.shadow.key = this.key;
        this.shadow.anchor.x = this.anchor.x;
        this.shadow.anchor.y = this.anchor.y;
        this.shadow.x = this.x + 10;
        this.shadow.y = this.y + 10;
        this.shadow.scale = this.scale;
        this.shadow.angle = -this.rotacion;
    };
    ActorDentroDelEditor.prototype.crear_sombra = function () {
        this.shadow = this.game.add.sprite(10, 10, this.key);
        this.shadow.tint = 0x000000;
        this.shadow["ocultar_posicion"] = true;
        this.ocultar_sombra();
    };
    ActorDentroDelEditor.prototype.actualizar_desde_el_editor = function (datos) {
        var _a = this.pilas.convertir_coordenada_de_pilas_a_phaser(datos.x, datos.y), x = _a.x, y = _a.y;
        this.x = x;
        this.y = y;
        this.scale.x = datos.escala_x;
        this.scale.y = datos.escala_y;
        this.anchor.x = datos.centro_x;
        this.anchor.y = datos.centro_y;
        this.rotacion = datos.rotacion;
    };
    Object.defineProperty(ActorDentroDelEditor.prototype, "rotacion", {
        get: function () {
            return -this.angle;
        },
        set: function (r) {
            this.angle = -r;
        },
        enumerable: true,
        configurable: true
    });
    ActorDentroDelEditor.prototype.destacar = function () {
        var ex = this.scale.x;
        var ey = this.scale.y;
        var i = Phaser.Easing.Linear.None;
        var y0 = ey;
        var y1 = ey + 0.05;
        var y2 = ey - 0.05;
        var x0 = ex;
        var x1 = ex - 0.05;
        var x2 = ex + 0.05;
        var t = 70;
        var a = this.game.add.tween(this.scale).to({ y: y1, x: x1 }, t, i);
        var b = this.game.add.tween(this.scale).to({ y: y0, x: x0 }, t, i);
        var c = this.game.add.tween(this.scale).to({ y: y2, x: x2 }, t, i);
        var d = this.game.add.tween(this.scale).to({ y: y0, x: x0 }, t, i);
        a.chain(b);
        b.chain(c);
        c.chain(d);
        a.start();
    };
    return ActorDentroDelEditor;
}(Phaser.Sprite));
var EscenaBase = (function () {
    function EscenaBase(pilas) {
        this.pilas = pilas;
        this.actores = [];
        this.pilas.utilidades.obtener_id_autoincremental();
        this.camara = new Camara(pilas);
    }
    EscenaBase.prototype.agregar_actor = function (actor) {
        this.actores.push(actor);
    };
    return EscenaBase;
}());
var Escena = (function (_super) {
    __extends(Escena, _super);
    function Escena() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cuadro = 0;
        return _this;
    }
    Escena.prototype.iniciar = function () { };
    Escena.prototype.actualizar = function () {
        this.cuadro += 1;
    };
    Escena.prototype.obtener_oscilacion = function (velocidad, intensidad) {
        return Math.sin(this.cuadro * velocidad * 0.1) * intensidad;
    };
    return Escena;
}(EscenaBase));
var Normal = (function (_super) {
    __extends(Normal, _super);
    function Normal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Normal.prototype.iniciar = function () {
        console.log("ha iniciando la escena!");
    };
    return Normal;
}(Escena));
var Estado = (function (_super) {
    __extends(Estado, _super);
    function Estado() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Estado.prototype.render = function () {
        var _this = this;
        function dibujarPuntoDeControl(bitmap, x, y, x_de_pilas, y_de_pilas) {
            bitmap.ctx.beginPath();
            bitmap.ctx.stroke();
            bitmap.ctx.strokeStyle = "black";
            bitmap.ctx.lineWidth = 4;
            bitmap.ctx.fillStyle = "white";
            bitmap.ctx.font = "12px verdana";
            bitmap.ctx.strokeText("×", x - 5, y + 3);
            bitmap.ctx.fillText("×", x - 5, y + 3);
            var coordenada = "(" + x_de_pilas + ", " + y_de_pilas + ")";
            bitmap.ctx.strokeText(coordenada, x + 15, y + 15);
            bitmap.ctx.fillText(coordenada, x + 15, y + 15);
            bitmap.ctx.closePath();
        }
        this.canvas.bringToTop();
        this.bitmap.clear();
        if (this.pilas.depurador.modo_posicion_activado) {
            this.game.world.children.forEach(function (sprite) {
                if (!sprite["ocultar_posicion"]) {
                    var _x = Math.round(sprite.x);
                    var _y = Math.round(sprite.y);
                    var _a = _this.pilas.convertir_coordenada_de_phaser_a_pilas(_x, _y), x = _a.x, y = _a.y;
                    dibujarPuntoDeControl(_this.bitmap, _x, _y, x, y);
                }
            });
        }
        if (this.pilas.depurador.mostrar_fps) {
            this.game.debug.text("Cuadros por segundo: " + this.game.time.fps, 4, 16, "#ffffff");
        }
    };
    Estado.prototype.create = function () {
        this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        this.canvas = this.bitmap.addToWorld(0, 0);
        this.texto = this.game.make.text(0, 0, "...", { font: "12px Verdana", fill: "#ffffff" });
        this.game.time.advancedTiming = true;
    };
    Estado.prototype.obtener_sprites = function () {
        return this.sprites;
    };
    Estado.prototype.actualizarPosicionDeFormaExterna = function (pos) { };
    Estado.prototype.dibujar_todos_los_puntos_de_las_posiciones_recorridas = function () {
        var _this = this;
        var bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        var canvas = bitmap.addToWorld(0, 0);
        this.historia.map(function (historia) {
            historia.map(function (entidad) {
                var _a = _this.pilas.convertir_coordenada_de_pilas_a_phaser(entidad.x, entidad.y), x = _a.x, y = _a.y;
                bitmap.circle(x, y, 1, entidad.id_color);
            });
        });
        return canvas;
    };
    return Estado;
}(Phaser.State));
var EstadoEditor = (function (_super) {
    __extends(EstadoEditor, _super);
    function EstadoEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EstadoEditor.prototype.init = function (datos) {
        this.pilas = datos.pilas;
        this.entidades = datos.escena.actores;
        this.cuando_termina_de_mover = datos.cuando_termina_de_mover;
        this.cuando_comienza_a_mover = datos.cuando_comienza_a_mover;
        this.sprites = {};
        this.crear_texto_con_posicion_del_mouse();
        var fondo = this.game.add.tileSprite(-100, -100, this.game.width + 200, this.game.height + 200, "plano");
        fondo.fixedToCamera = true;
        this.fondo = fondo;
    };
    EstadoEditor.prototype.cuando_termina_de_mover = function (a) { };
    EstadoEditor.prototype.cuando_comienza_a_mover = function (a) { };
    EstadoEditor.prototype.crear_texto_con_posicion_del_mouse = function () {
        var style = {
            font: "16px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "top"
        };
        var texto = this.game.add.text(0, 5, "", style);
        texto.setShadow(1, 1, "rgba(0, 0, 0, 0.5)", 3);
        texto["ocultar_posicion"] = true;
        this.texto = texto;
    };
    EstadoEditor.prototype.create = function () {
        _super.prototype.create.call(this);
        this.game.stage.backgroundColor = "5b5";
    };
    EstadoEditor.prototype.update = function () {
        var _this = this;
        this.fondo.tilePosition.x = -pilas.game.camera.x;
        this.fondo.tilePosition.y = -pilas.game.camera.y;
        this.entidades = this.entidades.map(function (e) {
            var sprite = null;
            if (!_this.sprites[e.id]) {
                sprite = new ActorDentroDelEditor(_this.game, 0, 0, e.imagen);
                sprite.iniciar(pilas, e);
                sprite.al_terminar_de_arrastrar = _this.cuando_termina_de_mover;
                sprite.al_comenzar_a_arrastrar = _this.cuando_comienza_a_mover;
                _this.world.add(sprite);
                _this.sprites[e.id] = sprite;
            }
            else {
                sprite = _this.sprites[e.id];
            }
            return e;
        });
        if (this.pilas.depurador.modo_posicion_activado) {
            this.actualizar_texto_con_posicion_del_mouse();
        }
        else {
            this.texto.text = "";
        }
    };
    EstadoEditor.prototype.actualizar_texto_con_posicion_del_mouse = function () {
        var _x = Math.round(this.input.mousePointer.x);
        var _y = Math.round(this.input.mousePointer.y);
        var _a = this.pilas.convertir_coordenada_de_phaser_a_pilas(_x, _y), x = _a.x, y = _a.y;
        if (x !== -1 && y !== -1) {
            this.texto.text = "  Mouse: (" + x + ", " + y + ") ";
        }
        this.game.world.bringToTop(this.texto);
    };
    return EstadoEditor;
}(Estado));
var EstadoEjecucion = (function (_super) {
    __extends(EstadoEjecucion, _super);
    function EstadoEjecucion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.proyecto = {};
        _this.nombre_de_la_escena_inicial = null;
        return _this;
    }
    EstadoEjecucion.prototype.init = function (datos) {
        this.pilas = datos.pilas;
        this.nombre_de_la_escena_inicial = datos.nombre_de_la_escena_inicial;
        this.proyecto = datos.proyecto;
        this.codigo = datos.codigo;
        var codigoDeExportacion = this.obtener_codigo_para_exportar_clases(this.codigo);
        var codigo_completo = this.codigo + codigoDeExportacion;
        try {
            this.clases = eval(codigo_completo);
        }
        catch (e) {
            this.pilas.emitir_excepcion_al_editor(e);
        }
        this.sprites = {};
        this.historia = [];
        this.actores = [];
    };
    EstadoEjecucion.prototype.obtener_codigo_para_exportar_clases = function (codigo) {
        var re_creacion_de_clase = /var (.*) \= \/\*\* @class/g;
        var re_solo_clase = /var\ (\w+)/;
        var lista_de_clases = [];
        if (codigo.match(re_creacion_de_clase)) {
            lista_de_clases = codigo.match(re_creacion_de_clase).map(function (e) { return e.match(re_solo_clase)[1]; });
        }
        var diccionario = {};
        for (var i = 0; i < lista_de_clases.length; i++) {
            var item = lista_de_clases[i];
            diccionario[item] = item;
        }
        var diccionario_como_cadena = JSON.stringify(diccionario).replace(/"/g, "");
        return "\n__clases = " + diccionario_como_cadena + ";\n__clases;";
    };
    EstadoEjecucion.prototype.create = function () {
        _super.prototype.create.call(this);
        this.game.stage.backgroundColor = "F99";
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 400;
        this.game.physics.p2.restitution = 0.75;
        this.game.physics.p2.friction = 499;
        try {
            this.instanciar_escena(this.nombre_de_la_escena_inicial);
        }
        catch (e) {
            this.pilas.emitir_excepcion_al_editor(e);
        }
        this.pilas.emitir_mensaje_al_editor("termina_de_iniciar_ejecucion", {});
    };
    EstadoEjecucion.prototype.instanciar_escena = function (nombre) {
        var _this = this;
        var escena = this.proyecto.escenas.filter(function (e) { return e.nombre == nombre; })[0];
        this.actores = escena.actores.map(function (e) {
            return _this.crear_actor(e);
        });
    };
    EstadoEjecucion.prototype.crear_actor = function (entidad) {
        var x = entidad.x;
        var y = entidad.y;
        var imagen = entidad.imagen;
        var actor = null;
        var clase = this.clases[entidad.tipo];
        if (clase) {
            actor = new this.clases[entidad.tipo](this.pilas, x, y, imagen);
            actor.tipo = entidad.tipo;
            actor.rotacion = entidad.rotacion;
            actor.sprite.anchor.set(entidad.centro_x, entidad.centro_y);
            actor.escala_x = entidad.escala_x;
            actor.escala_y = entidad.escala_y;
            actor.iniciar();
            this.world.add(actor.sprite);
        }
        else {
            console.error(this.clases);
            throw new Error("No existe c\u00F3digo para crear un actor de la clase " + entidad.tipo);
        }
        return actor;
    };
    EstadoEjecucion.prototype.preRender = function () {
        try {
            this.guardar_foto_de_entidades();
        }
        catch (e) {
            this.pilas.emitir_mensaje_al_editor("error_de_ejecucion", { mensaje: e.message, stack: e.stack.toString() });
        }
    };
    EstadoEjecucion.prototype.update = function () {
        this.pilas.escena_actual().actualizar();
    };
    EstadoEjecucion.prototype.guardar_foto_de_entidades = function () {
        var entidades = this.actores.map(function (actor) {
            return actor.serializar();
        });
        this.historia.push(entidades);
    };
    return EstadoEjecucion;
}(Estado));
var EstadoPausa = (function (_super) {
    __extends(EstadoPausa, _super);
    function EstadoPausa() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EstadoPausa.prototype.init = function (datos) {
        this.pilas = datos.pilas;
        this.historia = datos.historia;
        this.posicion = this.historia.length - 1;
        this.total = this.historia.length - 1;
        this.sprites = [];
        this.cuando_cambia_posicion = datos.cuando_cambia_posicion;
        this.izquierda = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.derecha = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.crear_texto();
    };
    EstadoPausa.prototype.create = function () {
        _super.prototype.create.call(this);
        this.game.stage.backgroundColor = "555";
        this.crear_sprites_desde_historia(this.posicion);
        this.actualizar_texto();
        this.canvas_lineas_de_recorrido = this.dibujar_todos_los_puntos_de_las_posiciones_recorridas();
    };
    EstadoPausa.prototype.crear_texto = function () {
        var style = {
            font: "16px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "top"
        };
        var texto = this.game.add.text(0, 5, "", style);
        texto.setShadow(1, 1, "rgba(0, 0, 0, 0.5)", 3);
        this.texto = texto;
    };
    EstadoPausa.prototype.crear_sprites_desde_historia = function (posicion) {
        var _this = this;
        var entidades = this.historia[posicion];
        this.sprites.map(function (sprite) { return sprite.destroy(); });
        this.sprites = entidades.map(function (entidad) {
            return _this.crear_sprite_desde_entidad(entidad);
        });
    };
    EstadoPausa.prototype.update = function () {
        var debeActualizar = false;
        if (this.izquierda.isDown) {
            this.posicion -= 1;
            debeActualizar = true;
        }
        if (this.derecha.isDown) {
            this.posicion += 1;
            debeActualizar = true;
        }
        if (debeActualizar) {
            this.posicion = Math.min(this.posicion, this.total);
            this.posicion = Math.max(this.posicion, 0);
            this.cuando_cambia_posicion({ posicion: this.posicion });
            this.crear_sprites_desde_historia(this.posicion);
            this.actualizar_texto();
        }
        this.pilas.game.world.bringToTop(this.canvas);
        this.pilas.game.world.bringToTop(this.canvas_lineas_de_recorrido);
    };
    EstadoPausa.prototype.actualizarPosicionDeFormaExterna = function (posicion) {
        this.posicion = posicion;
        this.posicion = Math.min(this.posicion, this.total);
        this.posicion = Math.max(this.posicion, 0);
        this.crear_sprites_desde_historia(this.posicion);
        this.actualizar_texto();
        this.game.world.bringToTop(this.canvas);
    };
    EstadoPausa.prototype.actualizar_texto = function () {
        var ayuda = "Cambiar con las teclas izquierda y derecha";
        var texto = " Posici\u00F3n " + this.posicion + "/" + this.total + " - " + ayuda;
        this.texto.text = texto;
    };
    EstadoPausa.prototype.crear_sprite_desde_entidad = function (entidad) {
        var _a = this.pilas.convertir_coordenada_de_pilas_a_phaser(entidad.x, entidad.y), x = _a.x, y = _a.y;
        var sprite = new Phaser.Sprite(this.game, x, y, entidad.imagen);
        sprite.angle = -entidad.rotacion;
        sprite.anchor.set(entidad.centro_x, entidad.centro_y);
        sprite.scale.x = entidad.escala_x;
        sprite.scale.y = entidad.escala_y;
        this.world.add(sprite);
        return sprite;
    };
    return EstadoPausa;
}(Estado));
