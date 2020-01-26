(function() {
    var e;
    null == (e = window.GitHub).DDD && (e.DDD = {})
}
).call(this);
(function() {
    var e, t = function(e, t) {
        function i() {
            this.constructor = e
        }
        for (var n in t)
            r.call(t, n) && (e[n] = t[n]);
        i.prototype = t.prototype;
        e.prototype = new i;
        e.__super__ = t.prototype;
        return e
    }, r = {}.hasOwnProperty, i = [].slice;
    e = window.GitHub.DDD;
    e.Utils = {
        defer: function(e) {
            return setTimeout(function(t) {
                return function() {
                    return e()
                }
            }(this), 0)
        }
    };
    window.GitHub.DDD.Error = function(e) {
        function r(e) {
            this.message = e;
            r.__super__.constructor.call(this, this.message)
        }
        t(r, e);
        return r
    }(Error);
    THREE.EventDispatcher.prototype.once = function(t, r) {
        var n;
        n = function(o) {
            return function() {
                var a;
                a = 1 <= arguments.length ? i.call(arguments, 0) : [];
                r.apply(null, a);
                return e.Utils.defer(function() {
                    return o.removeEventListener(t, n)
                })
            }
        }(this);
        return this.addEventListener(t, n)
    }
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty, n = [].slice;
    e = window.GitHub.DDD;
    e.Viewer = function(o) {
        function a(r, i, o) {
            var s, l;
            this.container = r;
            null == i && (i = {});
            null == o && (o = function() {}
            );
            this.$ = t(this.$, this);
            this.selectRenderer = t(this.selectRenderer, this);
            this.updateGrid = t(this.updateGrid, this);
            this.updateLight = t(this.updateLight, this);
            this.objectLoadHandler = t(this.objectLoadHandler, this);
            this.init = t(this.init, this);
            this.watchdog = t(this.watchdog, this);
            this.resize = t(this.resize, this);
            this.height = t(this.height, this);
            this.width = t(this.width, this);
            this.destructor = t(this.destructor, this);
            this.load = t(this.load, this);
            this.draw = t(this.draw, this);
            a.__super__.constructor.call(this);
            if (this.$().length && !this.$().data("bound")) {
                i instanceof Function && (l = [{}, i],
                i = l[0],
                o = l[1]);
                this.doctor = new window.Render.Doctor(this.container);
                this.status = new window.Render.Status("solid");
                this.objects = {};
                this.once("loaded", function(e) {
                    return function() {
                        return e.draw(!0)
                    }
                }(this));
                this.addEventListener("loaded", this.objectLoadHandler);
                this.addEventListener("load", s = function(e) {
                    return function(t) {
                        var r;
                        r = t.data;
                        return "error" === r || "error:fatal" === r ? e.status.set(r) : "finish" === r ? e.removeEventListener("load", s) : void 0
                    }
                }(this));
                this.once("error", function(t) {
                    return function(r) {
                        t.status.set("error");
                        throw new e.Error(r)
                    }
                }(this));
                this.once("loaded", this.resize);
                $(window).on("resize", this.resize);
                this.init(i, function(e) {
                    return function() {
                        var t;
                        t = 1 <= arguments.length ? n.call(arguments, 0) : [];
                        e.$container.data("bound", !0);
                        return o.call.apply(o, [e].concat(n.call(t)))
                    }
                }(this))
            }
        }
        r(a, o);
        a.prototype.draw = function(e) {
            var t, r;
            r = function(e) {
                return function(t) {
                    e.dispatchEvent({
                        type: "tick",
                        data: t
                    });
                    e.updateLight(e.camera.position);
                    return e.renderer.render(e.scene, e.camera)
                }
            }(this);
            t = function(e) {
                return function(i) {
                    null == i && (i = 0);
                    r(i);
                    return e.running ? requestAnimationFrame(t) : void 0
                }
            }(this);
            if (e === !1)
                return this.running = !1;
            if (e === !0) {
                if (this.running)
                    return;
                this.running = !0;
                return t()
            }
            return r()
        }
        ;
        a.prototype.load = function(t, r) {
            var n, o, a, s;
            null == r && (r = {});
            a = {};
            for (n in r)
                if (i.call(r, n)) {
                    s = r[n];
                    a[n] = s
                }
            null == a.url && (a.url = t);
            null == a.name && (a.name = t);
            null == a.center && (a.center = !0);
            null == a.autoscale && (a.autoscale = !1);
            this.dispatchEvent({
                type: "load",
                data: "start"
            });
            o = e.GenericLoader.loaderForUrl(this.status, t);
            a.side = o.side();
            o.addEventListener("load", function(t) {
                return function(r) {
                    t.dispatchEvent({
                        type: "load",
                        data: "finish"
                    });
                    return t.dispatchEvent({
                        type: "loaded",
                        object: new e.Renderable(r.content,a)
                    })
                }
            }(this));
            o.addEventListener("error", function(e) {
                return function(t) {
                    e.dispatchEvent({
                        type: "load",
                        data: "error"
                    });
                    return debug("Load Error:", t)
                }
            }(this));
            o.addEventListener("error:fatal", function(e) {
                return function(t) {
                    e.dispatchEvent({
                        type: "load",
                        data: "error:fatal"
                    });
                    return debug("Load Error:", t)
                }
            }(this));
            return o.load(t)
        }
        ;
        a.prototype.destructor = function() {
            return this.draw(!1)
        }
        ;
        a.prototype.width = function() {
            return (window.parent === window ? $(window).innerWidth() : void 0) || this.$().width() || $(window).width() || 500
        }
        ;
        a.prototype.height = function() {
            return (window.parent === window ? $(window).innerHeight() : void 0) || (this.$().height() || $(window).height() || 500) - $(".js-render-bar").outerHeight()
        }
        ;
        a.prototype.resize = function() {
            var e, t, r;
            t = [this.width(), this.height()],
            r = t[0],
            e = t[1];
            if (r && e) {
                this.camera.aspect = r / e;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(r, e);
                this.dispatchEvent({
                    type: "resize",
                    data: {
                        width: r,
                        height: e
                    }
                });
                return debug("Viewport now " + r + "x" + e)
            }
        }
        ;
        a.prototype.watchdog = function() {
            var e;
            e = $(this.container).length > 0;
            return e ? $(document).one("pageUpdate", this.watchdog) : this.destructor()
        }
        ;
        a.prototype.init = function(t, r) {
            var i, n;
            null == t && (t = {});
            null == r && (r = function(e) {
                return function() {}
            }(this));
            if (!this.$container.data("initialized")) {
                t instanceof Function && (n = [{}, t],
                t = n[0],
                r = n[1]);
                i = function(e) {
                    return function(t) {
                        null == t && (t = "unknown");
                        r(t || "unknown", e);
                        return e.dispatchEvent({
                            type: "error",
                            data: t
                        })
                    }
                }(this);
                this.once("loaded", function(t) {
                    return function() {
                        return null != t.controls ? t.controls : t.controls = new e.Controls(t)
                    }
                }(this));
                this.once("init", function(e) {
                    return function() {
                        return e.$container.data("initialized", !0)
                    }
                }(this));
                this.once("init", this.watchdog);
                this.once("init", this.doctor.updateHealth);
                this.once("init", function(e) {
                    return function() {
                        return e.resize()
                    }
                }(this));
                this.once("init", function(e) {
                    return function() {
                        return r(!1, e)
                    }
                }(this));
                if (!(this.renderer = this.selectRenderer()))
                    return i() && void 0;
                this.renderer.setSize(this.width(), this.height());
                this.$().append(this.renderer.domElement);
                this.scene = new THREE.Scene;
                this.scene.up.set(0, 0, 1);
                this.cameraFOV = 50;
                this.camera = new THREE.PerspectiveCamera(this.cameraFOV,this.width() / this.height(),.01,1e4);
                this.camera.up.set(0, 0, 1);
                this.scene.add(this.camera);
                this.updateGrid();
                return this.dispatchEvent({
                    type: "init",
                    data: "finished"
                })
            }
        }
        ;
        a.prototype.objectLoadHandler = function(t) {
            var r, i, n, o, a;
            if (t && (o = t.object) && o.name && null == this.objects[o.name]) {
                this.objects[o.name] = o;
                if (1 !== o.info.scale) {
                    r = o.info.scale > 1 ? "up" : "down";
                    this.doctor.addProblem("Object has been scaled " + r + " to fit the view")
                }
                a = 4 * o.geometry.boundingSphere.radius;
                this.camera.far > a || (this.camera.far = a);
                this.camera.updateProjectionMatrix();
                this.updateGrid(2 * o.geometry.boundingSphere.radius);
                if (/^file\d+$/.test(o.name)) {
                    if (null == this.objects.diff && this.objects.file1 && this.objects.file2) {
                        i = this.objects.file1;
                        n = this.objects.file2;
                        new e.Diff(this,i,n,function(e) {
                            return function(t) {
                                e.objects.diff = t;
                                e.scene.add(t);
                                e.dispatchEvent({
                                    type: "added",
                                    data: t
                                });
                                e.dispatchEvent({
                                    type: "diff:ready",
                                    data: t
                                });
                                e.status.set("ready");
                                return debug("Loaded diff:", t)
                            }
                        }(this))
                    }
                } else {
                    this.scene.add(o);
                    this.dispatchEvent({
                        type: "added",
                        data: o
                    });
                    this.status.set("ready")
                }
                return debug("Loaded:", o)
            }
        }
        ;
        a.prototype.updateLight = function(e) {
            var t, r, i;
            t = e.x;
            r = e.y;
            i = e.z;
            if (null != this.light)
                return this.light.position.set(t, r, i);
            this.scene.add(new THREE.AmbientLight(4210752));
            this.light = new THREE.DirectionalLight(16777215);
            this.light.position.set(t, r, i);
            return this.scene.add(this.light)
        }
        ;
        a.prototype.updateGrid = function(e) {
            var t, r, i, n, o, a, s, l, c;
            null == e && (e = 1);
            r = 10;
            c = 1.1 * e;
            s = Math.ceil(c / r) + 10;
            n = r * s;
            a = (new THREE.Matrix4).makeTranslation(0, 0, -.001);
            i = 100;
            if (s > i) {
                s = i;
                this.doctor.addProblem("The grid is being scaled because your model is too large")
            }
            if (null == this.grid) {
                l = new THREE.PlaneGeometry(n,n,s,s);
                l.applyMatrix(a);
                o = new THREE.MeshBasicMaterial({
                    color: 3355443,
                    wireframe: !0
                });
                this.grid = new THREE.Mesh(l,o);
                return this.scene.add(this.grid)
            }
            this.grid.geometry.computeBoundingSphere();
            t = this.grid.geometry.boundingSphere.radius;
            if (n > t) {
                l = new THREE.PlaneGeometry(n,n,s,s);
                l.applyMatrix(a);
                o = this.grid.material;
                this.scene.remove(this.grid);
                this.grid.geometry.dispose();
                this.grid = new THREE.Mesh(l,o);
                return this.scene.add(this.grid)
            }
        }
        ;
        a.prototype.selectRenderer = function(e) {
            var t;
            null == e && (e = !0);
            if (!e || null == window.WebGLRenderingContext) {
                this.doctor.addProblem("WebGL powered hardware support not available");
                return new THREE.CanvasRenderer
            }
            try {
                return new THREE.WebGLRenderer({
                    antialias: !0,
                    sortObjects: !1
                })
            } catch (r) {
                t = r;
                debug("Failed to create WebGLRenderer:", t);
                return this.selectRenderer(!1)
            }
        }
        ;
        a.prototype.$ = function() {
            return null != this.$container ? this.$container : this.$container = $(this.container)
        }
        ;
        return a
    }(THREE.EventDispatcher)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    };
    e = window.GitHub.DDD;
    e.ControlMode = function() {
        function r(r, i) {
            this.controls = r;
            null == i && (i = !1);
            this.deactivate = t(this.deactivate, this);
            this.activate = t(this.activate, this);
            this.active = !1;
            this.init();
            i && e.Utils.defer(this.activate);
            this.controls.addEventListener("tick", function(e) {
                return function(t) {
                    return e.active ? e.tick(t) : void 0
                }
            }(this))
        }
        r.prototype.activate = function() {
            if (!this.active) {
                this.active = !0;
                return this.onActivate()
            }
        }
        ;
        r.prototype.deactivate = function() {
            if (this.active) {
                this.active = !1;
                return this.onDeactivate()
            }
        }
        ;
        r.prototype.init = function() {
            return "Called when subclasses are created to avoid super()"
        }
        ;
        r.prototype.tick = function(e) {
            return "Called every frame if the mode is active"
        }
        ;
        r.prototype.onActivate = function() {
            return "Called when the control mode is activated"
        }
        ;
        r.prototype.onDeactivate = function() {
            return "Called when the control mode is deactivated"
        }
        ;
        return r
    }()
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.AttractMode = function(e) {
        function i() {
            this.tick = t(this.tick, this);
            return i.__super__.constructor.apply(this, arguments)
        }
        r(i, e);
        i.prototype.delay = 3e3;
        i.prototype.onActivate = function() {
            this.requested = Date.now();
            return this.spinRate = .01
        }
        ;
        i.prototype.tick = function(e) {
            if (this.requested + this.delay <= Date.now()) {
                this.controls.orbitRight(this.controls.orbitIncrement / 2 * this.spinRate);
                return this.spinRate < 1 ? this.spinRate *= 1.03 : void 0
            }
        }
        ;
        return i
    }(e.ControlMode)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.MouseMode = function(e) {
        function i() {
            this.mouseOrbit = t(this.mouseOrbit, this);
            this.mouseTranslate = t(this.mouseTranslate, this);
            this.mouseUp = t(this.mouseUp, this);
            this.mouseMove = t(this.mouseMove, this);
            this.bindHandlers = t(this.bindHandlers, this);
            this.onScroll = t(this.onScroll, this);
            this.mouseDown = t(this.mouseDown, this);
            this.keyChange = t(this.keyChange, this);
            this.release = t(this.release, this);
            this.hold = t(this.hold, this);
            this.init = t(this.init, this);
            return i.__super__.constructor.apply(this, arguments)
        }
        r(i, e);
        i.prototype.init = function() {
            this.translating = !1;
            this.shift = !1;
            this.drag = {
                sensitivity: .4,
                start: new THREE.Vector2,
                end: new THREE.Vector2
            };
            this.controls.$().on("mousewheel DOMMouseScroll", this.onScroll);
            this.controls.$().on("mousedown", this.mouseDown);
            this.controls.$().on("contextmenu", function(e) {
                return e.preventDefault()
            });
            return $(window).on("keydown keyup", this.keyChange)
        }
        ;
        i.prototype.hold = function() {
            return "function" == typeof this.onUse ? this.onUse() : void 0
        }
        ;
        i.prototype.release = function() {
            return "function" == typeof this.onRelease ? this.onRelease() : void 0
        }
        ;
        i.prototype.keyChange = function(e) {
            if (16 === e.keyCode) {
                "keydown" === e.type && (this.shift = this.translating = !0);
                if ("keyup" === e.type)
                    return this.shift = this.translating = !1
            }
        }
        ;
        i.prototype.mouseDown = function(e) {
            this.active || "function" == typeof this.onUse && this.onUse();
            e.preventDefault();
            this.bindHandlers(!0);
            this.drag.start.set(e.clientX, e.clientY);
            return 3 === e.which ? this.translating = !0 : void 0
        }
        ;
        i.prototype.onScroll = function(e) {
            var t, r;
            this.active || "function" == typeof this.onUse && this.onUse();
            e.stopPropagation();
            e.preventDefault();
            r = e.originalEvent;
            t = r.wheelDelta || -40 * r.detail;
            t > 0 ? this.controls.changeZoom(.1) : this.controls.changeZoom(-.1);
            return this.active && "function" == typeof this.onRelease ? this.onRelease() : void 0
        }
        ;
        i.prototype.bindHandlers = function(e) {
            var t;
            null == e && (e = !0);
            t = e === !0 ? "on" : "off";
            this.controls.$()[t]("mousemove", this.mouseMove);
            return this.controls.$()[t]("mouseup", this.mouseUp)
        }
        ;
        i.prototype.mouseMove = function(e) {
            return this.translating ? this.mouseTranslate(e) : this.mouseOrbit(e)
        }
        ;
        i.prototype.mouseUp = function(e) {
            this.active && "function" == typeof this.onRelease && this.onRelease();
            this.bindHandlers(!1);
            return this.translating && !this.shift ? this.translating = !1 : void 0
        }
        ;
        i.prototype.mouseTranslate = function(e) {
            var t;
            t = this.drag.end.set(e.clientX, e.clientY).clone().sub(this.drag.start).multiplyScalar(this.drag.sensitivity);
            this.drag.start.copy(this.drag.end);
            this.controls.translateUp(t.y);
            return this.controls.translateRight(t.x)
        }
        ;
        i.prototype.mouseOrbit = function(e) {
            var t;
            t = this.drag.end.set(e.clientX, e.clientY).clone().sub(this.drag.start).multiplyScalar(this.drag.sensitivity);
            this.drag.start.copy(this.drag.end);
            this.controls.orbitUp(this.controls.orbitIncrement * t.y);
            return this.controls.orbitRight(this.controls.orbitIncrement * -t.x)
        }
        ;
        return i
    }(e.ControlMode)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.Controls = function(n) {
        function o(e) {
            var r;
            this.viewer = e;
            this.updateCenter = t(this.updateCenter, this);
            this.update = t(this.update, this);
            this.translateRight = t(this.translateRight, this);
            this.translateDown = t(this.translateDown, this);
            this.orbitDown = t(this.orbitDown, this);
            this.orbitLeft = t(this.orbitLeft, this);
            this.changeZoom = t(this.changeZoom, this);
            this.translateLeft = t(this.translateLeft, this);
            this.translateUp = t(this.translateUp, this);
            this.orbitUp = t(this.orbitUp, this);
            this.orbitRight = t(this.orbitRight, this);
            this.orbitDistance = t(this.orbitDistance, this);
            this.initModeMenu = t(this.initModeMenu, this);
            this.initControlModes = t(this.initControlModes, this);
            this.selectMode = t(this.selectMode, this);
            this.$ = t(this.$, this);
            this.viewer.addEventListener("added", this.updateCenter);
            this.viewer.addEventListener("tick", this.update);
            this.renderer = this.viewer.renderer;
            this.camera = this.viewer.camera;
            this.center = new THREE.Vector3(0,0,0);
            r = this.orbitDistance();
            this.camera.position.set(0, -(r / 2), r).setLength(r);
            this.initModeMenu();
            this.initControlModes();
            this.updateCenter()
        }
        r(o, n);
        o.prototype.orbitIncrement = Math.PI / 180;
        o.prototype.$ = function() {
            return null != this.$container ? this.$container : this.$container = $(this.renderer.domElement)
        }
        ;
        o.prototype.selectMode = function(e) {
            var t, r, n, o;
            debug("Switching to " + e + " mode");
            n = this.viewer.objects;
            o = [];
            for (t in n)
                if (i.call(n, t)) {
                    r = n[t];
                    o.push(r.switchMode(e))
                }
            return o
        }
        ;
        o.prototype.initControlModes = function() {
            this.modes = {
                attract: new e.AttractMode(this,!0),
                mouse: new e.MouseMode(this)
            };
            this.modes.mouse.onUse = function(e) {
                return function() {
                    var t, r, n;
                    n = e.modes;
                    for (r in n)
                        if (i.call(n, r)) {
                            t = n[r];
                            t.deactivate()
                        }
                    return e.modes.mouse.activate()
                }
            }(this);
            return this.modes.mouse.onRelease = function(e) {
                return function() {
                    var t, r, n;
                    n = e.modes;
                    for (r in n)
                        if (i.call(n, r)) {
                            t = n[r];
                            t.deactivate()
                        }
                    return e.modes.attract.activate()
                }
            }(this)
        }
        ;
        o.prototype.initModeMenu = function() {
            return new window.Render.ModeSwitcher(this.selectMode)
        }
        ;
        o.prototype.orbitDistance = function() {
            var e, t, r, n, o;
            o = 2.4;
            n = function(e) {
                return e.geometry.boundingSphere.radius || 0
            }
            ;
            e = Math.max.apply(Math, function() {
                var e, o;
                e = this.viewer.objects;
                o = [];
                for (t in e)
                    if (i.call(e, t)) {
                        r = e[t];
                        o.push(n(r))
                    }
                return o
            }
            .call(this));
            return e > 0 ? e * o : 100
        }
        ;
        o.prototype.withoutOriginOffset = function(e, t, r) {
            e.position.sub(t);
            r();
            return e.position.add(t)
        }
        ;
        o.prototype.orbitRight = function(e) {
            return this.withoutOriginOffset(this.camera, this.center, function(t) {
                return function() {
                    var r;
                    r = new THREE.Vector3(0,0,1);
                    t.camera.position.applyAxisAngle(r, e);
                    return t.camera.up.applyAxisAngle(r, e)
                }
            }(this))
        }
        ;
        o.prototype.orbitUp = function(e) {
            return this.withoutOriginOffset(this.camera, this.center, function(t) {
                return function() {
                    var r;
                    r = t.camera.position.clone().cross(t.camera.up).normalize();
                    t.camera.position.applyAxisAngle(r, e);
                    return t.camera.up.applyAxisAngle(r, e)
                }
            }(this))
        }
        ;
        o.prototype.translateUp = function(e) {
            var t;
            t = this.camera.up.clone().normalize().multiplyScalar(e);
            this.camera.position.add(t);
            return this.center.add(t)
        }
        ;
        o.prototype.translateLeft = function(e) {
            var t, r, i;
            i = this.camera.up.clone().normalize();
            t = this.camera.position.clone().normalize();
            r = i.cross(t).multiplyScalar(e);
            this.camera.position.add(r);
            return this.center.add(r)
        }
        ;
        o.prototype.changeZoom = function(e) {
            return this.withoutOriginOffset(this.camera, this.center, function(t) {
                return function() {
                    return e > 0 ? t.camera.position.multiplyScalar(1.02) : 0 > e ? t.camera.position.multiplyScalar(.98) : void 0
                }
            }(this))
        }
        ;
        o.prototype.orbitLeft = function(e) {
            return this.orbitRight(-e)
        }
        ;
        o.prototype.orbitDown = function(e) {
            return this.orbitUp(-e)
        }
        ;
        o.prototype.translateDown = function(e) {
            return this.translateUp(-e)
        }
        ;
        o.prototype.translateRight = function(e) {
            return this.translateLeft(-e)
        }
        ;
        o.prototype.update = function() {
            this.camera.lookAt(this.center);
            return this.dispatchEvent({
                type: "tick",
                data: 0
            })
        }
        ;
        o.prototype.updateCenter = function() {
            var e;
            e = void 0;
            this.viewer.scene.traverse(function(t) {
                return function(t) {
                    var r;
                    if (null == t.mesh && null != t.geometry) {
                        (r = t.geometry).computeBoundingBox();
                        if (null == e)
                            return e = r.boundingBox.clone();
                        e.expandByPoint(r.boundingBox.min);
                        return e.expandByPoint(r.boundingBox.max)
                    }
                }
            }(this));
            null != e && (this.center = e.center().clone());
            return debug("Center updated, now:", this.center)
        }
        ;
        return o
    }(THREE.EventDispatcher)
}
).call(this);
GitHub.DDD.BinaryReader = function(e) {
    this._buffer = e;
    this._pos = 0
}
;
GitHub.DDD.BinaryReader.prototype = {
    readInt8: function() {
        return this._decodeInt(8, !0)
    },
    readUInt8: function() {
        return this._decodeInt(8, !1)
    },
    readInt16: function() {
        return this._decodeInt(16, !0)
    },
    readUInt16: function() {
        return this._decodeInt(16, !1)
    },
    readInt32: function() {
        return this._decodeInt(32, !0)
    },
    readUInt32: function() {
        return this._decodeInt(32, !1)
    },
    readFloat: function() {
        return this._decodeFloat(23, 8)
    },
    readDouble: function() {
        return this._decodeFloat(52, 11)
    },
    readChar: function() {
        return this.readString(1)
    },
    readString: function(e) {
        this._checkSize(8 * e);
        var t = this._buffer.substr(this._pos, e);
        this._pos += e;
        return t
    },
    seek: function(e) {
        this._pos = e;
        this._checkSize(0)
    },
    getPosition: function() {
        return this._pos
    },
    getSize: function() {
        return this._buffer.length
    },
    _decodeFloat: function(e, t) {
        var r = e + t + 1
          , i = r >> 3;
        this._checkSize(r);
        var n = Math.pow(2, t - 1) - 1
          , o = this._readBits(e + t, 1, i)
          , a = this._readBits(e, t, i)
          , s = 0
          , l = 2
          , c = 0;
        do
            for (var h = this._readByte(++c, i), u = e % 8 || 8, f = 1 << u; f >>= 1; ) {
                h & f && (s += 1 / l);
                l *= 2
            }
        while (e -= u);this._pos += i;
        return a == (n << 1) + 1 ? s ? NaN : o ? -(1 / 0) : +(1 / 0) : (1 + -2 * o) * (a || s ? a ? Math.pow(2, a - n) * (1 + s) : Math.pow(2, -n + 1) * s : 0)
    },
    _decodeInt: function(e, t) {
        var r = this._readBits(0, e, e / 8)
          , i = Math.pow(2, e)
          , n = t && r >= i / 2 ? r - i : r;
        this._pos += e / 8;
        return n
    },
    _shl: function(e, t) {
        for (++t; --t; e = 1073741824 == (1073741824 & (e %= 2147483648)) ? 2 * e : 2 * (e - 1073741824) + 2147483647 + 1)
            ;
        return e
    },
    _readByte: function(e, t) {
        return 255 & this._buffer.charCodeAt(this._pos + t - e - 1)
    },
    _readBits: function(e, t, r) {
        var i = (e + t) % 8
          , n = e % 8
          , o = r - (e >> 3) - 1
          , a = r + (-(e + t) >> 3)
          , s = o - a
          , l = this._readByte(o, r) >> n & (1 << (s ? 8 - n : t)) - 1;
        s && i && (l += (this._readByte(a++, r) & (1 << i) - 1) << (s-- << 3) - n);
        for (; s; )
            l += this._shl(this._readByte(a++, r), (s-- << 3) - n);
        return l
    },
    _checkSize: function(e) {
        if (!(this._pos + Math.ceil(e / 8) < this._buffer.length))
            throw new Error("Index out of bound")
    }
};
(function() {
    var e, t = function(e, t) {
        function i() {
            this.constructor = e
        }
        for (var n in t)
            r.call(t, n) && (e[n] = t[n]);
        i.prototype = t.prototype;
        e.prototype = new i;
        e.__super__ = t.prototype;
        return e
    }, r = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.Diff = function(i) {
        function n(t, i, o, a) {
            var s;
            this.viewer = t;
            n.__super__.constructor.call(this);
            this.slider = new window.Render.Slider({
                mouseDown: function(e) {
                    return function() {
                        return e.viewer.controls.modes.mouse.hold()
                    }
                }(this),
                slide: function(e) {
                    return function(t) {
                        return e.adjustMaterialOpacity(t / 100)
                    }
                }(this),
                mouseUp: function(e) {
                    return function() {
                        return e.viewer.controls.modes.mouse.release()
                    }
                }(this)
            },{
                percentage: 100
            });
            this.viewer.addEventListener("resize", this.slider.setDragger);
            s = new e.PollingLoader({
                status: this.viewer.status
            });
            s.load({
                added: this.viewer.$().data("added"),
                removed: this.viewer.$().data("removed"),
                unchanged: this.viewer.$().data("unchanged")
            }, function(t) {
                return function(i, n) {
                    var o, s, l, c, h;
                    if (i)
                        return t.viewer.dispatchEvent({
                            type: "error",
                            data: null != (c = event.data) ? c : "Load error"
                        });
                    l = n.parts;
                    t.diffModes = {
                        highlight: new e.Renderable(l.unchanged.geom,{
                            center: !0,
                            name: "highlight",
                            mode: "wireframe",
                            color: 5592405,
                            specular: 0,
                            parts: [new e.Renderable(l.added.geom,{
                                name: "added",
                                center: !1,
                                color: 65280
                            }), new e.Renderable(l.removed.geom,{
                                name: "removed",
                                center: !1,
                                color: 16711680
                            })]
                        }),
                        slider: new e.Renderable(l.unchanged.geom,{
                            center: !0,
                            name: "slider",
                            parts: [new e.Renderable(l.added.geom,{
                                name: "added",
                                center: !1,
                                transparent: !0,
                                color: e.DefaultColor
                            }), new e.Renderable(l.removed.geom,{
                                name: "removed",
                                center: !1,
                                transparent: !0,
                                opacity: 0,
                                color: e.DefaultColor
                            })],
                            color: e.DefaultColor
                        })
                    };
                    h = t.diffModes;
                    for (s in h)
                        if (r.call(h, s)) {
                            o = h[s];
                            t.add(o)
                        }
                    t.switchMode("highlight");
                    return a(t)
                }
            }(this))
        }
        t(n, i);
        n.prototype.opacitySlider = function() {
            var e, t, i;
            this.slider.show();
            i = this.diffModes;
            for (t in i)
                if (r.call(i, t)) {
                    e = i[t];
                    e.toggle(!1)
                }
            return this.diffModes.slider.toggle(!0)
        }
        ;
        n.prototype.removeOpacitySlider = function() {
            this.slider.hide();
            return this.diffModes.slider.toggle(!1)
        }
        ;
        n.prototype.adjustMaterialOpacity = function(e) {
            var t, r;
            t = .03;
            if (e > 1 - t) {
                this.diffModes.slider.getObjectByName("removed").toggle(!1);
                this.diffModes.slider.getObjectByName("added").toggle(!0);
                return this.diffModes.slider.getObjectByName("added").updateMaterials({
                    opacity: 1
                })
            }
            if (t > e) {
                this.diffModes.slider.getObjectByName("added").toggle(!1);
                this.diffModes.slider.getObjectByName("removed").toggle(!0);
                return this.diffModes.slider.getObjectByName("removed").updateMaterials({
                    opacity: 1
                })
            }
            this.diffModes.slider.toggle(!0);
            r = e;
            this.diffModes.slider.getObjectByName("removed").updateMaterials({
                opacity: 1 - e
            });
            return this.diffModes.slider.getObjectByName("added").updateMaterials({
                opacity: e
            })
        }
        ;
        n.prototype.wireframe = function() {
            var e, t, i;
            i = this.diffModes;
            for (t in i)
                if (r.call(i, t)) {
                    e = i[t];
                    e.toggle(!1)
                }
            return this.diffModes.highlight.toggle(!0)
        }
        ;
        n.prototype.removeWireframe = function() {
            return this.diffModes.highlight.toggle(!1)
        }
        ;
        n.prototype.switchMode = function(e) {
            null == e && (e = "highlight");
            switch (e) {
            case "highlight":
                this.removeOpacitySlider();
                return this.wireframe();
            case "slider":
                this.removeWireframe();
                return this.opacitySlider()
            }
        }
        ;
        return n
    }(THREE.Object3D)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        function i() {
            this.constructor = e
        }
        for (var n in t)
            r.call(t, n) && (e[n] = t[n]);
        i.prototype = t.prototype;
        e.prototype = new i;
        e.__super__ = t.prototype;
        return e
    }, r = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.GenericLoader = function(r) {
        function i(e) {
            this.status = e;
            i.__super__.constructor.call(this)
        }
        t(i, r);
        i.extensions = {};
        i.loaderForUrl = function(t, r) {
            var i, n, o, a, s;
            a = r.split("?"),
            o = a[0],
            i = a[1];
            if (s = o.match(/\.([^\.]*)$/)) {
                n = s[1].toLowerCase();
                if (null != this.extensions[n])
                    return new this.extensions[n](t)
            }
            if (null == r || "" === r.trim())
                return new e.NULLLoader(t);
            throw new Error("No fitting loader for url [" + r + "]")
        }
        ;
        i.prototype.calculateNormal = function(e, t, r, i) {
            var n, o;
            n = (new THREE.Vector3).subVectors(e.vertices[t], e.vertices[r]);
            o = (new THREE.Vector3).subVectors(e.vertices[t], e.vertices[i]);
            return (new THREE.Vector3).crossVectors(n, o).normalize()
        }
        ;
        i.prototype.side = function() {
            return THREE.BackSide
        }
        ;
        i.prototype.load = function(e, t) {
            null == t && (t = {});
            debug("Attempting to load URL: [" + e + "]");
            return this.status.load(e, {
                attempts: t.attempts,
                success: function(e) {
                    return function(t, r) {
                        var i;
                        i = e.parse(t);
                        return null != i ? e.dispatchEvent({
                            type: "load",
                            content: i
                        }) : e.dispatchEvent({
                            type: "error:fatal",
                            message: "Model not valid."
                        })
                    }
                }(this),
                error: function(t) {
                    return function(r, i) {
                        var n, o;
                        n = i.status;
                        o = 403 === n ? "error:fatal" : "error";
                        return t.dispatchEvent({
                            type: o,
                            message: "Could not load URL [" + e + "] [" + n + "]"
                        })
                    }
                }(this),
                before: function(e) {
                    return function(e) {
                        return e.overrideMimeType("text/plain; charset=x-user-defined")
                    }
                }(this)
            })
        }
        ;
        return i
    }(THREE.EventDispatcher)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.NULLLoader = function(e) {
        function i() {
            this.parse = t(this.parse, this);
            this.load = t(this.load, this);
            return i.__super__.constructor.apply(this, arguments)
        }
        r(i, e);
        i.prototype.load = function(e, t) {
            return this.dispatchEvent({
                type: "load",
                content: this.parse()
            })
        }
        ;
        i.prototype.parse = function(e) {
            var t;
            t = new THREE.Geometry;
            t.computeFaceNormals();
            t.computeCentroids();
            t.computeBoundingBox();
            t.computeBoundingSphere();
            return t
        }
        ;
        return i
    }(e.GenericLoader)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.OBJLoader = function(e) {
        function i() {
            this.parse = t(this.parse, this);
            return i.__super__.constructor.apply(this, arguments)
        }
        r(i, e);
        i.prototype.side = function() {
            return THREE.BackSide
        }
        ;
        i.prototype.parse = function(e) {
            var t, r, i, n, o, a, s, l, c, h;
            t = new THREE.Geometry;
            h = [];
            s = /^(f|g|o|vn|vt|v) +(.*[^ ]) *$/;
            i = {
                f: function(e) {
                    return function(r) {
                        var i, n, o, a, s, l;
                        i = function() {
                            var e, t, i, n;
                            i = r.split(" ");
                            n = [];
                            for (e = 0,
                            t = i.length; t > e; e++) {
                                a = i[e];
                                n.push(a.split("/"))
                            }
                            return n
                        }();
                        o = [parseInt(i[0][0]) - 1, parseInt(i[1][0]) - 1, parseInt(i[2][0]) - 1, null != i[3] ? parseInt(i[3][0]) - 1 : void 0];
                        l = [parseInt(i[0][1]) - 1, parseInt(i[1][1]) - 1, parseInt(i[2][1]) - 1, null != i[3] ? parseInt(i[3][1]) - 1 : void 0];
                        s = e.calculateNormal(t, o[0], o[1], o[2]);
                        t.faces.push(new THREE.Face3(o[0],o[1],o[2],s));
                        n = null != l[0] && !isNaN(l[0]);
                        n && t.faceVertexUvs[0].push([h[l[0]], h[l[1]], h[l[2]]]);
                        if (4 === i.length) {
                            s = e.calculateNormal(t, o[0], o[2], o[3]);
                            t.faces.push(new THREE.Face3(o[2],o[3],o[0],s));
                            if (n)
                                return t.faceVertexUvs[0].push([h[l[2]], h[l[3]], h[l[0]]])
                        }
                    }
                }(this),
                g: function(e) {
                    return function(e) {}
                }(this),
                o: function(e) {
                    return function(e) {
                        return t.name = e
                    }
                }(this),
                vn: function(e) {
                    return function(e) {}
                }(this),
                vt: function(e) {
                    return function(e) {
                        var t, r;
                        r = function() {
                            var r, i, n, o;
                            n = e.split(" ");
                            o = [];
                            for (r = 0,
                            i = n.length; i > r; r++) {
                                t = n[r];
                                o.push(parseFloat(t))
                            }
                            return o
                        }();
                        return h.push(new THREE.Vector2(r[0],r[1]))
                    }
                }(this),
                v: function(e) {
                    return function(e) {
                        var r, i;
                        i = function() {
                            var t, i, n, o;
                            n = e.split(" ");
                            o = [];
                            for (t = 0,
                            i = n.length; i > t; t++) {
                                r = n[t];
                                o.push(parseFloat(r))
                            }
                            return o
                        }();
                        return t.vertices.push(new THREE.Vector3(i[0],i[2],i[1]))
                    }
                }(this)
            };
            l = e.split("\n");
            for (r = 0,
            n = l.length; n > r; r++) {
                o = l[r];
                if (c = o.match(s)) {
                    a = i[c[1]];
                    null != a && a(c[2])
                }
            }
            t.computeFaceNormals();
            t.computeCentroids();
            t.computeBoundingBox();
            t.computeBoundingSphere();
            return t
        }
        ;
        return i
    }(e.GenericLoader);
    e.GenericLoader.extensions.obj = e.OBJLoader
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.PollingLoader = function(n) {
        function o(e) {
            null == e && (e = {});
            this.failPart = t(this.failPart, this);
            this.completePart = t(this.completePart, this);
            this.maybeFinished = t(this.maybeFinished, this);
            this.incompleteCount = t(this.incompleteCount, this);
            this.reset = t(this.reset, this);
            this.load = t(this.load, this);
            o.__super__.constructor.call(this);
            this.reset();
            null == e.timeout && (e.timeout = 10);
            null == e.tries && (e.tries = 10);
            null == e.maxLateJobs && (e.maxLateJobs = 1);
            this.timeout = e.timeout,
            this.tries = e.tries,
            this.status = e.status,
            this.maxLateJobs = e.maxLateJobs;
            this.addEventListener("ready", function(e) {
                return function() {
                    e.cb(!1, e);
                    return e.cb = function() {}
                }
            }(this));
            this.addEventListener("error", function(e) {
                return function() {
                    e.cb(!0, e);
                    return e.cb = function() {}
                }
            }(this))
        }
        r(o, n);
        o.prototype.load = function(t, r) {
            var n, o, a;
            this.reset();
            null != r && (this.cb = r);
            this.time.start = Date.now();
            this.time.end = void 0;
            o = [];
            for (n in t)
                if (i.call(t, n)) {
                    a = t[n];
                    o.push(function(t) {
                        return function(r, i) {
                            var n;
                            n = t.parts[r] = {
                                name: r,
                                url: i,
                                geom: void 0,
                                loader: e.GenericLoader.loaderForUrl(t.status, i),
                                load: function() {
                                    return n.loader.load(n.url, {
                                        attempts: t.tries
                                    })
                                }
                            };
                            n.loader.addEventListener("load", function(e) {
                                return t.completePart(n, e.content)
                            });
                            n.loader.addEventListener("error", function(e) {
                                return t.failPart(n)
                            });
                            n.loader.addEventListener("error:fatal", function(e) {
                                return t.failPart(n)
                            });
                            return n.load()
                        }
                    }(this)(n, a))
                }
            return o
        }
        ;
        o.prototype.reset = function() {
            this.parts = {};
            this.time = {
                start: void 0,
                end: void 0
            };
            return null != this.cb ? this.cb : this.cb = function() {}
        }
        ;
        o.prototype.incompleteCount = function() {
            var e, t, r, n, o, a;
            e = 0;
            a = 0;
            o = this.parts;
            t = function(t) {
                return function(t, r) {
                    a += 1;
                    return null != r.geom ? e += 1 : void 0
                }
            }(this);
            for (r in o)
                if (i.call(o, r)) {
                    n = o[r];
                    t(r, n)
                }
            return a - e
        }
        ;
        o.prototype.maybeFinished = function(e) {
            var t, r, n, o, a;
            null == e && (e = function() {}
            );
            if (Date.now() >= this.time.start + 1e3 * this.timeout && this.incompleteCount() > this.maxLateJobs)
                return this.dispatchEvent({
                    type: "error",
                    data: "timeout"
                });
            t = !0;
            a = this.parts;
            r = function(e) {
                return function(e, r) {
                    return t = t && !(null == r.geom)
                }
            }(this);
            for (n in a)
                if (i.call(a, n)) {
                    o = a[n];
                    r(n, o)
                }
            if (t) {
                this.time.end = Date.now();
                debug("All parts Ready");
                return this.dispatchEvent({
                    type: "ready",
                    info: this
                })
            }
            return e()
        }
        ;
        o.prototype.completePart = function(e, t) {
            debug("completePart:", e, t);
            e.geom = t;
            return this.maybeFinished()
        }
        ;
        o.prototype.failPart = function(e) {
            debug("failPart():", e);
            return this.dispatchEvent({
                type: "error",
                info: "Too many tries for " + e.url
            })
        }
        ;
        return o
    }(THREE.EventDispatcher)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.Renderable = function(e) {
        function n(e, r) {
            var i, o, a, s, l, c, h, u, f, p, d, m;
            this.info = null != r ? r : {};
            this.switchMode = t(this.switchMode, this);
            this.center = t(this.center, this);
            this.updateMaterials = t(this.updateMaterials, this);
            this.toggle = t(this.toggle, this);
            n.__super__.constructor.call(this);
            this.geometry = this.info.clone ? e.clone() : e;
            this.url = null != (c = this.info.url) ? c : "x-renderable://" + this.id;
            this.name = null != (h = null != (u = this.info.name) ? u : this.info.url) ? h : "model-" + this.id;
            null == (i = this.info).center && (i.center = !0);
            this.info.scale = 1;
            if (this.info.autoscale) {
                null == (o = this.info).scaleTo && (o.scaleTo = 100);
                this.geometry.computeBoundingSphere();
                if (this.geometry.boundingSphere.radius > this.info.scaleTo) {
                    this.info.scale = this.info.scaleTo / this.geometry.boundingSphere.radius;
                    m = (new THREE.Matrix4).makeScale(this.info.scale, this.info.scale, this.info.scale);
                    this.geometry.applyMatrix(m);
                    this.geometry.computeBoundingSphere()
                }
            }
            this.mesh = new THREE.Mesh(this.geometry);
            this.mesh.name = this.name;
            this.add(this.mesh);
            p = null != (f = this.info.parts) ? f : [];
            for (a = 0,
            s = p.length; s > a; a++) {
                l = p[a];
                this.add(l)
            }
            this.info.center && this.center();
            this.switchMode(null != (d = this.info.mode) ? d : "solid")
        }
        r(n, e);
        n.prototype.toggle = function(e) {
            return this.traverse(function(t) {
                return t.visible = e
            })
        }
        ;
        n.prototype.updateMaterials = function(e) {
            return null != e ? this.traverse(function(t) {
                return function(t) {
                    var r, n, o, a, s;
                    a = [];
                    for (r in e)
                        if (i.call(e, r)) {
                            s = e[r];
                            a.push(null != t && null != (n = t.mesh) && null != (o = n.material) ? o[r] = s : void 0)
                        }
                    return a
                }
            }(this)) : void 0
        }
        ;
        n.prototype.center = function() {
            var e, t, r, i, n;
            t = void 0;
            this.traverse(function(e) {
                return function(e) {
                    var r;
                    if ((r = e.geometry) && r.vertices.length > 0) {
                        r.computeBoundingBox();
                        if (null != t) {
                            t.expandByPoint(r.boundingBox.min);
                            return t.expandByPoint(r.boundingBox.max)
                        }
                        return t = r.boundingBox.clone()
                    }
                }
            }(this));
            e = t.clone();
            r = t.center().negate();
            i = t.min.negate();
            debug("Total centering transform: " + r.x + ", " + r.y + ", " + i.z);
            debug("Bounds: ", e);
            n = (new THREE.Matrix4).makeTranslation(r.x, r.y, i.z);
            this.traverse(function(e) {
                return function(e) {
                    if (null == e.mesh && null != e.geometry) {
                        e.geometry.applyMatrix(n);
                        e.geometry.computeCentroids();
                        e.geometry.computeBoundingBox();
                        return e.geometry.computeBoundingSphere()
                    }
                }
            }(this));
            return this
        }
        ;
        n.prototype.switchMode = function(e) {
            var t, r, i, n, o;
            null == e && (e = "solid");
            t = {
                color: null != (r = this.info.color) ? r : 16752762,
                specular: null != (i = this.info.specular) ? i : 10066329,
                transparent: null != (n = this.info.transparent) ? n : !1,
                opacity: null != (o = this.info.opacity) ? o : 1
            };
            switch (e) {
            case "wireframe":
                this.mesh.material = new THREE.MeshPhongMaterial(t);
                this.mesh.material.wireframe = !0;
                break;
            case "solid":
                this.mesh.material = new THREE.MeshPhongMaterial(t);
                this.mesh.material.wireframe = !1;
                break;
            case "normal":
                this.mesh.material = new THREE.MeshNormalMaterial(t);
                this.mesh.material.wireframe = !1
            }
            this.mesh.material.side = this.info.side;
            this.mesh.material.needsUpdate = !0;
            this.geometry.buffersNeedUpdate = !0;
            return this.geometry.uvsNeedUpdate = !0
        }
        ;
        return n
    }(THREE.Object3D)
}
).call(this);
(function() {
    var e, t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }, r = function(e, t) {
        function r() {
            this.constructor = e
        }
        for (var n in t)
            i.call(t, n) && (e[n] = t[n]);
        r.prototype = t.prototype;
        e.prototype = new r;
        e.__super__ = t.prototype;
        return e
    }, i = {}.hasOwnProperty;
    e = window.GitHub.DDD;
    e.STLLoader = function(i) {
        function n() {
            this.parseBinary = t(this.parseBinary, this);
            this.parse = t(this.parse, this);
            return n.__super__.constructor.apply(this, arguments)
        }
        r(n, i);
        n.prototype.side = function() {
            return THREE.FrontSide
        }
        ;
        n.prototype.parse = function(t) {
            var r;
            r = function(t) {
                return function(t) {
                    var r, i, n, o;
                    o = new e.BinaryReader(t);
                    o.seek(80);
                    i = 50;
                    n = o.readUInt32();
                    r = 84 + n * i;
                    return r === o.getSize()
                }
            }(this);
            return r(t) ? this.parseBinary(t) : this.parseASCII(t)
        }
        ;
        n.prototype.parseBinary = function(t) {
            var r, i, n, o, a, s, l, c, h, u, f, p, d, m, E;
            f = new e.BinaryReader(t);
            u = function(e) {
                return function() {
                    return [f.readFloat(), f.readFloat(), f.readFloat()]
                }
            }(this);
            f.seek(80);
            l = f.readUInt32();
            n = new THREE.Geometry;
            for (i = o = 0,
            p = l; p >= 0 ? p > o : o > p; i = p >= 0 ? ++o : --o) {
                E = u();
                h = new THREE.Vector3(E[0],E[1],E[2]);
                for (a = 1; 3 >= a; a++) {
                    E = u();
                    n.vertices.push(new THREE.Vector3(E[0],E[1],E[2]))
                }
                r = f.readUInt16();
                s = n.vertices.length;
                d = (new THREE.Vector3).subVectors(n.vertices[s - 3], n.vertices[s - 2]);
                m = (new THREE.Vector3).subVectors(n.vertices[s - 3], n.vertices[s - 1]);
                c = (new THREE.Vector3).crossVectors(d, m).normalize();
                n.faces.push(new THREE.Face3(s - 3,s - 2,s - 1,c))
            }
            n.computeCentroids();
            n.computeBoundingBox();
            n.computeBoundingSphere();
            return n
        }
        ;
        n.prototype.parseASCII = function(e) {
            var t, r, i, n, o, a, s, l, c, h, u;
            t = new THREE.Geometry;
            o = /facet([\s\S]*?)endfacet/g;
            for (; null != (l = o.exec(e)); ) {
                c = l[0];
                a = /normal[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
                for (; null != (l = a.exec(c)); )
                    n = new THREE.Vector3(parseFloat(l[1]),parseFloat(l[3]),parseFloat(l[5]));
                s = /vertex[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
                for (; null != (l = s.exec(c)); )
                    t.vertices.push(new THREE.Vector3(parseFloat(l[1]),parseFloat(l[3]),parseFloat(l[5])));
                r = t.vertices.length;
                h = (new THREE.Vector3).subVectors(t.vertices[r - 3], t.vertices[r - 2]);
                u = (new THREE.Vector3).subVectors(t.vertices[r - 3], t.vertices[r - 1]);
                i = (new THREE.Vector3).crossVectors(h, u).normalize();
                i = this.calculateNormal(t, r - 3, r - 2, r - 1);
                t.faces.push(new THREE.Face3(r - 3,r - 2,r - 1,i))
            }
            t.computeCentroids();
            t.computeBoundingBox();
            t.computeBoundingSphere();
            return t
        }
        ;
        return n
    }(e.GenericLoader);
    e.GenericLoader.extensions.stl = e.STLLoader
}
).call(this);
(function() {
    var e;
    e = window.GitHub.DDD;
    $(function() {
        e.DefaultColor = parseInt($(".render-shell").data("color")) || 4293572;
        debug("Color is: " + e.DefaultColor);
        return new e.Viewer("#solid-viewer",function(t, r) {
            var i, n;
            try {
                i = null != r.$().data("file1");
                if (i) {
                    r.load(r.$().data("file1"), {
                        name: "file1",
                        center: !1,
                        color: e.DefaultColor
                    });
                    return r.load(r.$().data("file2"), {
                        name: "file2",
                        center: !1,
                        color: e.DefaultColor
                    })
                }
                return r.load(r.$().data("file"), {
                    autoscale: !0,
                    scaleTo: 100,
                    color: e.DefaultColor
                })
            } catch (o) {
                n = o;
                this.status.set("error");
                throw n
            }
        }
        )
    })
}
).call(this);
