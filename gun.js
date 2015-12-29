;(function () {


    //require('queue');

    // ***** CLASS Queue ************* //
    var /* class */ Queue = function() {
        // prevent this by always using new Queue.
        // make it private so nobody calls it then we dont need to check.
        if (!(this instanceof Queue)) {
            return new Queue();
        }
        this.emit = function (what) {
            var _this = this;

            var where = _this.where;
            var args = arguments;

            if (!_this._)  _this._ = {};
            if (!_this._[where])  _this._[where] = [];

            var on = _this._[where];

            // delete node if it exists on no peer anymore
            if (!( _this._[where] = GunStore.list.map(on, function (hear, i, map) {
                    if (!hear || !hear.as) {
                        return
                    }
                    map(hear);
                    hear.as.apply(hear, args);
                }))) {
                GunStore.obj.del(on, where)
            }
        };
        this.event = function (as, i) {
            if (!as) {
                return
            }

            var me = this;
            var where = me.where;
            var args = arguments;
            var on = (me._ = me._ || {})[where] = me._[where] || [];
            var e = {
                as: as, i: i || 0, off: function () {
                    return !(e.as = false)
                }
            };

            on.push(e);
            on.sort(QueueEvent.sort);

            return e;
        };
        this.once = function (as, i) {
            var me = this
                , once = function () {
                this.off();
                as.apply(this, arguments)
            };
            return me.event(once, i)
        };
        this.get = function (key, cb, opt) { // get opens up a reference to a node and loads it.
            var gun = this.queue(), ctx = {}; // create the new queue and have a scoped context.
            if (!key) {
                return cb.call(gun, {err: GunStore.log("No key or relation to get!")}), gun
            }
            ctx.key = GunStore.text.is(key) && key; // if key is text, then key, else false.
            ctx.soul = GunStore.is.soul(key); // if key is a soul, then the soul, else false.
            cb = cb || function () {
                };
            opt = opt || {};

            if (opt.force) {
                load(key)
            } else // force a load regardless of whether it is a key or soul!
            if (ctx.soul) { // if we have a soul that is...
                if (ctx.node = gun.__.graph[ctx.soul]) { // in memory, then
                    (ctx.graph = {})[ctx.soul] = ctx.node; // add it to our graph context.
                    cb.call(gun, null, GunStore.obj.copy(ctx.graph)); // call the callback with a copy of the graph.
                    (ctx.graph = {})[ctx.soul] = GunStore.union.pseudo(ctx.soul); // override our context with empty nodes as end markers, per the wire protocol.
                    cb.call(gun, null, ctx.graph);
                    cb.call(gun, null, {}); // call the end nodes, and wire end.
                } else {
                    load(key)
                } // not in memory, then load it.
                ctx.node = gun.__.graph[ctx.soul] = gun.__.graph[ctx.soul] || GunStore.union.pseudo(ctx.soul); // either way we know the soul, so make sure it is in our graph so it can be referenced.
                gun._.at('soul').emit({soul: ctx.soul, GET: 'SOUL'}); // emit the soul to the queue!
            } else if (ctx.key) { // if it is a key, then
                function get(soul) { // once we have a soul
                    var graph = gun.__.key.s[ctx.key], end = {}; // grab the graph corresponding to the key.
                    GunStore.is.graph(graph, function (node, soul) { // iterate over each node
                        end[soul] = GunStore.union.pseudo(soul); // put empty nodes as an end marker, per the wire protocol.
                        gun._.at('soul').emit({soul: soul, key: ctx.key, GET: 'SOUL'}); // emit each soul to the queue!
                    });
                    cb.call(gun, null, GunStore.obj.copy(graph));
                    cb.call(gun, null, end);
                    cb.call(gun, null, {}); // and finally, call the graph, the end nodes, and the wire end.
                }

                if (gun.__.key.s[ctx.key]) {
                    get()
                } // check if it is in memory, else
                else if (ctx.flag = gun.__.flag.start[ctx.key]) { // if it will be in memory, then TODO: convert this to use the meta system instead if possible, seems cleaner.
                    ctx.flag.once(get); // subscribe to when that happens.
                } else {
                    load(key)
                } // else it is not in memory, load it.
            } else {
                cb.call(gun, {err: GunStore.log("No key or relation to get!")})
            }

            function load(key) { // load a key or soul.
                if (GunStore.fns.is(ctx.hook = gun.__.opt.hooks.get)) { // if we have a hook...
                    ctx.hook(key, function (err, data) { // listen to callbacks, which will be called multiple times.
                        console.log("queue.get ", key, "from hook", err, data, '\n');
                        if (err) {
                            return cb.call(gun, err, null)
                        } // if error, call it and be done. TODO: emit error!
                        if (!data) { // if there is no data...
                            if (ctx.data) {
                                return
                            } // make sure we don't have context data, if we do, don't go further.
                            cb.call(gun, null, null); // call that we have null data, since nodejs callback style does not differentiate between error, null, and data.
                            return gun.__.flag.end[ctx.key || ctx.soul] = gun.__.flag.end[ctx.key || ctx.soul] || function ($) { // set the end marker. TODO: convert this to use the meta system instead if possible, seems cleaner.
                                    // TODO: cover all edge cases, uniqueness?
                                    delete gun.__.flag.end[ctx.key || ctx.soul]; // once called, clear out our flag.
                                    gun._.at('soul').emit($); // emit the soul to the queue.
                                }, gun._.at('null').emit({key: ctx.key, soul: ctx.soul, GET: 'NULL'}); // emit the null to the queue!
                        }
                        var dat = ctx.data = {}; // create a data context.
                        if (GunStore.obj.empty(data)) {
                            return cb.call(gun, null, data)
                        } // call the wire end and be done.
                        if (!GunStore.is.graph(data, function (node, soul, map) { // iterate over each node in the data graph
                                if (err = GunStore.union(gun, node).err) {
                                    return cb.call(gun, err, data)
                                } // union it, or error.
                                if (ctx.key) {
                                    (gun.__.key.s[ctx.key] = gun.__.key.s[ctx.key] || {})[soul] = gun.__.graph[soul]
                                } // if it was on a key, then add this node to the key graph.
                                gun._.at('soul').emit({soul: soul, key: ctx.key, GET: 'SOUL'}); // and emit each soul to the queue!
                            })) {
                            return cb.call(gun, {err: GunStore.log('Not a valid graph!')}, data)
                        } // if the data isn't a graph, error out.
                        cb.call(gun, null, data); // TODO: Hmm, this should be called before the queue emit, but I don't want to do 2 map operations. As long as union is called before, does this matter that it is after?
                    }, opt);
                } else { // if there is no hook...
                    console.Log("Warning! You have no persistence layer to get from!"); // politely notify people.
                    cb.call(gun, null, null); // Technically no error, but no way we can get data.
                    gun._.at('null').emit({key: ctx.key, GET: 'NULL'}); // and emit the null to the queue!
                }
            }

            return gun;
        };
        this.key = function (key, cb, opt) {
            var gun = this, ctx = {};
            if (!key) {
                return cb.call(gun, {err: GunStore.log('No key!')}), gun
            }
            if (!gun.back) {
                gun = gun.queue()
            }
            if (gun.__.key.s[key]) {
                console.Log("Warning! Key already used!")
            } // TODO: Have opt that will aggregate.
            cb = cb || function () {
                };
            opt = GunStore.text.is(opt) ? {soul: opt} : opt || {};
            opt.soul = opt.soul || opt[GunStore._.soul];
            if (opt.soul) { // force inject // TODO: BUG! WRITE A TEST FOR THIS!
                if (!gun.__.graph[opt.soul]) {
                    ((gun.__.graph[opt.soul] = {})._ = {})[GunStore._.soul] = opt.soul;
                }
                (gun.__.key.s[key] = gun.__.key.s[key] || {})[opt.soul] = gun.__.graph[opt.soul];
                if (gun.__.flag.end[key]) { // TODO: Ought this be fulfilled from self as well?
                    gun.__.flag.end[key]({soul: opt.soul});
                }
                index({soul: opt.soul});
            } else { // will be injected via a put
                (gun.__.flag.start[key] = gun._.at('soul')).once(function ($) {
                    console.log("queue.key", key, '\n');
                    (gun.__.key.s[key] = gun.__.key.s[key] || {})[$.soul] = gun.__.graph[$.soul];
                    delete gun.__.flag.start[key];
                }, -1);
                gun._.at('soul').event(index);
            }
            function index($) { // TODO: once per soul in graph. (?)
                if (GunStore.fns.is(ctx.hook = gun.__.opt.hooks.key)) {
                    ctx.hook(key, $.soul, function (err, data) {
                        return cb.call(gun, err, data);
                    }, opt);
                } else {
                    console.Log("Warning! You have no key hook!");
                    cb.call(gun, null); // This is in memory success, hardly "success" at all.
                }
            }

            return gun;
        };
        this.all = function (key, cb) {
            var gun = this.queue();
            return gun; // TODO: BUG! We need to create all!
            cb = cb || function () {};
            gun.shot.next(function (next) {
                GunStore.obj.map(gun.__.key.s, function (node, key) { // TODO: BUG!! Need to handle souls too!
                    if (node = GunStore.is.soul.on(node)) {
                        (cb.vode = cb.vode || {})[key] = {};
                        cb.vode[key][GunStore._.soul] = node;
                    }
                });
                if (cb.vode) {
                    gun._.node = cb.vode; // assign it to this virtual node.
                    cb.call(gun, null, GunStore.obj.copy(gun._.node)), next(); // frozen copy
                } else if (GunStore.fns.is(gun.__.opt.hooks.all)) {
                    gun.__.opt.hooks.all(function (err, data) { // call the hook
                        // this is multiple
                    });
                } else {
                    console.Log("Warning! You have no all hook!");
                    return cb.call(gun), next();
                }
            });
            return gun;
        };
        /*
         how many different ways can we return something? ONLY THE FIRST ONE IS SUPPORTED, the others might become plugins.
         Find via a singular path
         .path('blah').val(blah);
         Find via multiple paths with the callback getting called many times
         .path('foo', 'bar').val(fooOrBar);
         Find via multiple paths with the callback getting called once with matching arguments
         .path('foo', 'bar').val(foo, bar)
         Find via multiple paths with the result aggregated into an object of pre-given fields
         .path('foo', 'bar').val({foo: foo, bar: bar}) || .path({a: 'foo', b: 'bar'}).val({a: foo, b: bar})
         Find via multiple paths where the fields and values must match
         .path({foo: val, bar: val}).val({})
         Path ultimately should call .val each time, individually, for what it finds.
         Things that wait and merge many things together should be an abstraction ontop of path.
         */
        this.path = function (path, cb, opt) {
            var gun = this.queue();
            cb = cb || function () {
                };
            opt = opt || {};
            if (!GunStore.text.is(path = GunStore.text.is(path) ? path || null : GunStore.num.is(path) ? (path + '') : GunStore.list.is(path) ? path.join('.') : path)) {
                return cb.call(gun, {err: GunStore.log("Invalid path '" + path + "'!")}), gun
            }
            if (!gun.back._.at) {
                return cb.call(gun, {err: GunStore.log("No context!")}), gun
            }
            gun.back.on(function ($, node) {
                if (!(node = node || gun.__.graph[$.soul])) {
                    return
                }
                var queue = this || gun, src = opt.src || gun;
                var ctx = {path: path.split('.')}, field = GunStore.text.ify(ctx.path.shift());
                var val = node[field], soul = GunStore.is.soul(val);
                if (!field && !ctx.path.length) {
                    cb.call(queue, null, node, field);
                    return opt.step ? src._.at('soul').emit({
                        soul: $.soul,
                        field: null,
                        from: opt.step.soul,
                        at: opt.step.field,
                        gun: queue,
                        PATH: 'SOUL'
                    })
                        : src._.at('soul').emit({soul: $.soul, field: null, gun: queue, PATH: 'SOUL'});
                }
                if (!GunStore.obj.has(node, field)) {
                    if (opt.end || (!ctx.path.length && gun.__.meta($.soul).end)) { // TODO: Make it so you can adjust how many terminations!
                        // TODO: BUG! `queue` here is incorrect on unknowns. This has been fixed at an API level.
                        cb.call(queue, null, null, field);
                        src._.at('null').emit({soul: $.soul, field: field, gun: queue, PATH: 'NULL'});
                    }
                    return;
                }
                if (soul) {
                    return gun.get(val, function (err, data) {
                        if (err) {
                            return cb.call(queue, err)
                        }
                    }).path(ctx.path, cb, {src: src, step: {soul: $.soul, field: field}, path: path});
                }
                cb.call(queue, null, val, field);
                return src._.at('soul').emit({soul: $.soul, field: field, gun: queue, PATH: 'SOUL'});
            }, {raw: true});

            return gun;
        };
        this.val = (function () {
            GunStore.on('union').event(function (gun, data, end) {
                if (!GunStore.obj.empty(data, GunStore._.meta)) {
                    return
                }
                (end = gun.__.meta(GunStore.is.soul.on(data))).end = (end.end || 0) + 1;
                gun.__.on(GunStore.is.soul.on(data) + '.end').emit(data);
            });
            return function (cb, opt) {
                var gun = this, ctx = {}, args = Array.prototype.slice.call(arguments);
                cb = GunStore.fns.is(cb) ? cb : function (val, field) {
                    root.console.log.apply(root.console, args.concat([field && (field += ':'), val]))
                };
                opt = opt || {};

                gun.on(function ($, delta, on) {
                    var node = gun.__.graph[$.soul];
                    if (ctx[$.soul + '.end']) {
                        return ctx[$.soul + '.end'](node, $)
                    }
                    //(on = on || {off:function(){}}).off();
                    ctx[$.soul + '.end'] = function (data, $$) {
                        $$ = $$ || $;
                        var soul, field;
                        if (!$$.field && $$.from) { // if the current node is a child of the parent that we were subscribing to a field on.
                            soul = $$.from;
                            field = $$.at;
                        } else {
                            soul = $$.soul;
                            field = $$.field || '';
                        }
                        var hash = soul + field;
                        var node = gun.__.graph[$$.soul] || data || node; //on = (this || {off:function(){}}); // TODO: BUG? is var node = thing || node safe in old IE?
                        if ($$.key) {
                            // TODO: BUG! Shouldn't `.val` pseudo union check that each node in the key graph is ended? Current thought: Not necessarily! Since `.val` is first come first serve until we provide configurable end options.
                            node = GunStore.union.pseudo($.key, gun.__.key.s[$.key]) || node;
                        }
                        if ($$.field) {
                            if (!GunStore.obj.has(node, $$.field) || ctx[hash] || GunStore.is.soul(node[$$.field])) {
                                return
                            }
                            ctx[hash] = true; //on.off(); // TODO: Fix the bug with at for this to be on.
                            return cb.call($$.gun || gun, node[$$.field], $$.field);
                        }
                        if (!gun.__.meta($$.soul).end || (ctx[hash] || ($$.key && ctx[$$.key]))) {
                            return
                        } // TODO: Add opt to change number of terminations.
                        ctx[hash] = ctx[$$.soul] = ctx[$$.key] = true; //on.off(); // TODO: Fix the bug with at for this to be on.
                        cb.call($$.gun || gun, GunStore.obj.copy(node), field);
                    };
                    if (gun.__.meta($.soul).end) {
                        if (!$.field || GunStore.obj.has(node, $.field)) {
                            return ctx[$.soul + '.end'](node, $)
                        }
                    }
                    gun.__.on($.soul + '.end').event(ctx[$.soul + '.end']);
                }, {raw: true});

                return gun;
            }
        }());
        this.on = function (cb, opt) { // on subscribes to any changes related to the queue.
            var gun = this, ctx = {}; // reuse the current queue and have a scoped context.
            opt = GunStore.obj.is(opt) ? opt : {change: opt}; // .on(fn, true) gives you delta pairs.
            cb = cb || function () {
                };
            gun._.at('soul').event(function ($) { // subscribe to soul events on the queue.
                if (ctx[$.soul]) { // check to see if we have a root level listener for changes on this soul.
                    if (opt.raw) { // then do nothing, unless the options request all raw events.
                        ctx[$.soul].call(this, gun.__.graph[$.soul], $); // call it with the node and the event. TODO: we get duplicate ons, once here and once from HAM.
                    }
                } else { // if there isn't a root level listener for changes on the soul, then
                    (ctx[$.soul] = function (delta, $$) { // mark that we are adding one.
                        $$ = $$ || $;
                        var node = gun.__.graph[$$.soul], soul; // use the pass event or reuse the the queue's event.
                        if (delta && $$.soul != GunStore.is.soul.on(delta)) {
                            return
                        } // just make sure that things match for safety purposes.
                        if ($$.field && (soul = GunStore.is.soul(node[$$.field]))) { // if the queue is on a field, then check if the field value is a relation.
                            (ctx[$$.soul + $$.field] || {
                                off: function () {
                                }
                            }).off(); // why do we do this again? To prevent recursion or something I think?
                            ctx[$$.soul + $$.field] = gun.__.on(soul).event(function (delta) { // subscribe to root level emitter for the soul.
                                ctx[$$.soul](delta, {soul: soul, field: null, from: $$.soul, at: $$.field}); // call ourselves.
                            });
                            // TODO: do we need to load it? what about that $.gun context?
                            return;
                        }
                        if (opt.raw) {
                            return cb.call($$.gun || gun, $$, delta, this)
                        } // if raw events are requested, call it with all the pieces we have.
                        if (!opt.end && GunStore.obj.empty(delta, GunStore._.meta)) {
                            return
                        } // ignore end nodes unless otherwise requested.
                        if ($$.key) {
                            node = GunStore.union.pseudo($.key, gun.__.key.s[$.key]) || node
                        } // if there are multiple nodes on the key, then do a pseudo union across all nodes in the key graph to create a temporary abstract form of the data.
                        if (opt.change) {
                            node = delta || node
                        } // if we want only the change, prioritize the delta over the node.
                        cb.call($$.gun || gun, GunStore.obj.copy($$.field ? node[$$.field] : node), $$.field || $$.at); // call the callback with a snapshot of the data!
                    }).call(this, gun.__.graph[$.soul], $); // call ourselves immediately!
                    if (!opt.once) {
                        gun.__.on($.soul).event(ctx[$.soul])
                    } // and finally, actually subscribe to the root level emitter for this soul.
                }
            });

            return gun;
        };
        /*
         ACID compliant? Unfortunately the vocabulary is vague, as such the following is an explicit definition:
         A - Atomic, if you put a full node, or nodes of nodes, if any value is in error then nothing will be put.
         If you want puts to be independent of each other, you need to put each piece of the data individually.
         C - Consistency, if you use any reserved symbols or similar, the operation will be rejected as it could lead to an invalid read and thus an invalid state.
         I - Isolation, the conflict resolution algorithm guarantees idempotent transactions, across every peer, regardless of any partition,
         including a peer acting by itself or one having been disconnected from the network.
         D - Durability, if the acknowledgement receipt is received, then the state at which the final persistence hook was called on is guaranteed to have been written.
         The live state at point of confirmation may or may not be different than when it was called.
         If this causes any application-level concern, it can compare against the live data by immediately reading it, or accessing the logs if enabled.
         */
        this.put = function (val, cb, opt) { // TODO: handle case where val is a gun context!
            var gun = this.queue(), call = function ($) {
                gun.back._.at('soul').emit({
                    soul: $.soul || GunStore.is.soul.on(val) || GunStore.roulette.call(gun),
                    field: $.field,
                    empty: true,
                    gun: $.gun,
                    PUT: 'SOUL'
                }); // TODO: refactor GunStore.roulette!
            }, drift = GunStore.time.now(); // TODO: every instance of gun maybe should have their own version of time.
            cb = cb || function () {
                };
            opt = opt || {};
            if (!gun.back.back) {
                gun = gun.queue();
                call({});
            }
            if (gun.back.not) {
                gun.back.not(call, {raw: true})
            }

            gun.back._.at('soul').event(function ($) {
                var queue = $.gun || gun;
                var ctx = {}, obj = val, $ = GunStore.obj.copy($);
                var hash = $.field ? $.soul + $.field : ($.from ? $.from + ($.at || '') : $.soul);
                //var hash = $.from? ($.from + ($.at || '')) : ($.soul + ($.field || ''));
                if (call[hash]) {
                    return
                }
                call[hash] = true;
                console.log("queue.put", val, '\n');
                if (GunStore.is.value(obj)) {
                    if ($.from && $.at) {
                        $.soul = $.from;
                        $.field = $.at;
                    } // no else!
                    if (!$.field) {
                        return cb.call(gun, {err: GunStore.log("No field exists for " + (typeof obj) + "!")});
                    } else if (gun.__.graph[$.soul]) {
                        ctx.tmp = {};
                        ctx.tmp[ctx.field = $.field] = obj;
                        obj = ctx.tmp;
                    } else {
                        return cb.call(gun, {err: GunStore.log("No node exists to put " + (typeof obj) + " in!")});
                    }
                }
                if (GunStore.obj.is(obj)) {
                    if ($.field && !ctx.field) {
                        ctx.tmp = {};
                        ctx.tmp[ctx.field = $.field] = obj;
                        obj = ctx.tmp;
                    }
                    GunStore.ify(obj, function (env, cb) {
                        var at;
                        if (!env || !(at = env.at) || !env.at.node) {
                            return
                        }
                        if (!at.node._) {
                            at.node._ = {};
                        }
                        if (!GunStore.is.soul.on(at.node)) {
                            if (obj === at.obj) {
                                env.graph[at.node._[GunStore._.soul] = at.soul = $.soul] = at.node;
                                cb(at, at.soul);
                            } else {
                                function path(err, data) {
                                    if (at.soul) {
                                        return
                                    }
                                    at.soul = GunStore.is.soul.on(data) || GunStore.is.soul.on(at.obj) || GunStore.roulette.call(gun); // TODO: refactor GunStore.roulette!
                                    env.graph[at.node._[GunStore._.soul] = at.soul] = at.node;
                                    cb(at, at.soul);
                                }

                                ($.empty && !$.field) ? path() : queue.back.path(at.path || [], path, {
                                    once: true,
                                    end: true
                                }); // TODO: clean this up.
                            }
                        }
                        if (!at.node._[GunStore._.HAM]) {
                            at.node._[GunStore._.HAM] = {};
                        }
                        if (!at.field) {
                            return
                        }
                        at.node._[GunStore._.HAM][at.field] = drift;
                    })(function (err, ify) {
                        console.log("queue.put PUT <----", ify.graph, '\n');
                        if (err || ify.err) {
                            return cb.call(gun, err || ify.err)
                        }
                        if (err = GunStore.union(gun, ify.graph).err) {
                            return cb.call(gun, err)
                        }
                        if ($.from = GunStore.is.soul(ify.root[$.field])) {
                            $.soul = $.from;
                            $.field = null
                        }
                        GunStore.obj.map(ify.graph, function (node, soul) {
                            GunStore.union(gun, GunStore.union.pseudo(soul))
                        });
                        gun._.at('soul').emit({soul: $.soul, field: $.field, key: $.key, PUT: 'SOUL', WAS: 'ON'}); // WAS ON
                        if (GunStore.fns.is(ctx.hook = gun.__.opt.hooks.put)) {
                            ctx.hook(ify.graph, function (err, data) { // now iterate through those nodes to a persistence layer and get a callback once all are saved
                                if (err) {
                                    return cb.call(gun, err)
                                }
                                return cb.call(gun, null, data);
                            }, opt);
                        } else {
                            console.Log("Warning! You have no persistence layer to save to!");
                            cb.call(gun, null); // This is in memory success, hardly "success" at all.
                        }
                    });
                }
            });

            return gun;
        };
        this.map = function (cb, opt) {
            var gun = this.queue(), ctx = {};
            opt = (GunStore.obj.is(opt) ? opt : (opt ? {node: true} : {}));
            cb = cb || function () {
                };

            gun.back.on(function (node) {
                var soul = GunStore.is.soul.on(node);
                console.log("queue.map", node, '\n');
                GunStore.is.node(node, function (val, field) { // maybe filter against known fields. Huh?
                    var s = GunStore.is.soul(val);
                    if (s) {
                        // TODO: BUG? What if we re-assign a field to a different soul or value? Shouldn't we disable the previous listener? Do we need to check if we already made a listener so we don't recursively add up more and more listeners that get called? Etc. ?
                        ctx[s] = gun.get(val).on(function (d, f) {
                            cb.call(this, d, f || field);
                            gun._.at('soul').emit({soul: s, field: null, from: soul, at: field, MAP: 'SOUL', gun: this})
                        });
                    } else {
                        if (opt.node) {
                            return
                        } // {node: true} maps over only sub nodes.
                        cb.call(this, val, field);
                        gun._.at('soul').emit({soul: soul, field: field, MAP: 'SOUL'});
                    }
                }, this || gun);
            }, true);

            return gun;
        };
        this.set = function (val, cb, opt) {
            var gun = this, ctx = {}, drift = GunStore.text.ify(GunStore.time.now() || 0).replace('.', 'D'); // TODO: every gun instance should maybe have their own version of time.
            cb = cb || function () {
                };
            opt = opt || {};

            if (!gun.back) {
                gun = gun.put({})
            }
            gun = gun.not(function (key) {
                return key ? this.put({}).key(key) : this.put({})
            });
            if (!val && !GunStore.is.value(val)) {
                return gun
            }
            var obj = {}, index = 'I' + drift + 'R' + GunStore.text.random(5); // TODO: Make this configurable!
            obj[index] = val;
            return GunStore.is.value(val) ? gun.put(obj, cb) : gun.put(obj, cb).path(index);
        };
        this.not = function (cb, opt) {
            var gun = this, ctx = {};
            cb = cb || function () {
                };
            opt = opt || {};

            gun._.at('null').once(function ($) {
                if ($.key && ($.soul || gun.__.key.s[$.key])) {
                    return
                }
                if ($.field && GunStore.obj.has(gun.__.graph[$.soul], $.field)) {
                    return
                }
                // TODO: BUG? Removed a start flag check and tests passed, but is that an edge case?
                var kick = function (next) {
                    if (++c) {
                        return GunStore.log("Warning! Multiple `not` resumes!");
                    }
                    next._.at('soul').once(function ($) {
                        $.N0T = 'KICK SOUL';
                        gun._.at('soul').emit($)
                    });
                }, queue = gun.queue(), next = cb.call(queue, opt.raw ? $ : ($.field || $.key), kick), c = -1;
                if (GunStore.is(next)) {
                    kick(next)
                }
                gun.__.graph[kick.soul = $.soul || GunStore.roulette.call(queue)] = gun.__.graph[kick.soul] || GunStore.union.pseudo(kick.soul); // TODO: refactor GunStore.roulette
                queue._.at('soul').emit({
                    soul: kick.soul,
                    empty: true,
                    key: $.key,
                    field: $.field,
                    N0T: 'SOUL',
                    WAS: 'ON'
                }); // WAS ON!
            });

            return gun;
        };
        this.err = function (dud) { // WARNING: dud was depreciated.
        this._.err = GunStore.fns.is(dud) ? dud : function () {};
        return this;
    };
    }

    // ***** CLASS QueueEvent ******** //

    //require('queue_event');

    /**
     * QueueEvent handles gun.on(), gets put into queue and then processed async with all peers
     *
     * events are fundamentally different, being synchronously 1 to N fan out,
     * than req/res/callback/promise flow, which are asynchronously 1 to 1 into a sink.
     *
     * @param where
     * @returns {Queue.queue.event|*|proxy.event|Event|string}
     * @constructor
     */
    /**
     *
     * @constructor
     */
    var /* class */ QueueEvent = function()   {
        this.handleOn = function(where) {
            var event = QueueEvent.event || QueueEvent.create();
            return event(where);
        };
        this.is = function (event) {
            return !!(event instanceof QueueEvent)
        };
        this.create = function () {
            var queue = new QueueEvent.queue();
            return queue.$ = function (where) {
                queue.where = where;
                return queue;
            }
        };
        this.sort = GunStore.list.sort('i');
        this.queue = Queue; // singleton (global), will create new on first call.
    }

    /**
     * creates connection to GunStore
     *
     * @constructor
     *
     * @param options
     * @returns {GunStore}
     *
     * usage: var gun = new GunStore('http://localhost/gun');
     */
    var /* public: factory */ Gun = function (options) {
        return new GunStore(options);
    };

    /**
     * Class GunStore, Main
     *
     * @constructor
     * @param options
     *
     * @returns {GunStore}
     */
    var /* private */ GunStore /* extends Queue */ = function (options) {
            this.opt(options);
            return this;
        };

    /**
     *
     * @type {{soul: string, meta: string, HAM: string}}
     * @private
     */

    /**
     * private variables
     *
     * @type {{soul: string, meta: string, HAM: string}}
     * @private
     */
    GunStore.version = 0.2; // does Travis allow us to dynamically update package.json and npm publish?
    GunStore._ = { // some reserved key words, these are not the only ones.
        soul: '#' // a soul is a UUID of a node but it always points to the "latest" data known.
        , meta: '_' // all metadata of the node is stored in the meta property on the node.
        , HAM: '>' // other than the soul, we store HAM metadata.
    };
    GunStore.init = function (options) {
        // see Queue.opt(opt);
        // this should never happen, options is different type than gun !
        if (options instanceof GunStore) {
            return this; // then return a new queue, reusing the existing options.
        }
    };
    GunStore.util = {
        "fns": {
            "is": function (fn) {
                return !!(fn instanceof Function)
            },
            "sum": function (done) { // combine with Util.obj.map for some easy parallel async operations!
                var context = {task: {}, data: {}};
                context.end = function (e, v) {
                    done(e, v);
                    return done = function () {
                    }
                };
                context.add = function (fn, id) {
                    context.task[id = id || (GunStore.text.is(fn) ? fn : GunStore.text.random())] = false;
                    var each = function (err, val) {
                        context.task[id] = true;
                        if (err) {
                            (context.err = context.err || {})[id] = err
                        }
                        context.data[id] = val;
                        if (!GunStore.obj.map(context.task, function (val) {
                                if (!val) {
                                    return true
                                }
                            })) { // it is true if we are NOT done yet, then invert.
                            done(context.err, context.data);
                        }
                    }, c = context;
                    return GunStore.fns.is(fn) ? function () {
                        return fn.apply({task: c.task, data: c.data, end: c.end, done: each}, arguments)
                    } : each;
                };
                return context;
            }
        },
        "bi": {
            "is": function (b) {
                return !!(b instanceof Boolean || typeof b == 'boolean')
            }
        },
        "num": {
            "is": function (n) {
                return !Util.list.is(n) && (Infinity === n || n - parseFloat(n) + 1 >= 0); // jquery doesn't check for Infinity.
            }
        },
        "text": {
            "is": function (t) {
                return typeof t == 'string'
            },
            "ify": function (t) {
                if (Util.text.is(t)) {
                    return t
                }
                if (JSON) {
                    return JSON.stringify(t)
                }
                return (t && t.toString) ? t.toString() : t;
            },
            "random": function (l, c) {
                var s = '';
                l = l || 24; // you are not going to make a 0 length random number, so no need to check type
                c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
                while (l > 0) {
                    s += c.charAt(Math.floor(Math.random() * c.length));
                    l--
                }
                return s;
            }
        },
        "list": {
            "is": function (l) {
                return !!(l instanceof Array)
            },
            "split": Array.prototype.slice,
            "sort": function (k) { // creates a new sort function based off some field
                return function (A, B) {
                    if (!A || !B) {
                        return 0
                    }
                    A = A[k];
                    B = B[k];
                    if (A < B) {
                        return -1
                    } else if (A > B) {
                        return 1
                    }
                    else {
                        return 0
                    }
                }
            },
            "map": function (l, c, _) {
                return Util.obj.map(l, c, _)
            },
            "index": 1
        },
        "obj": {
            "is": function (o) {
                return (o instanceof Object && !Util.list.is(o) && !Util.fns.is(o)) ? true : false
            }
            , "del": function (o, k) {
                if (!o) {
                    return
                }
                o[k] = null;
                delete o[k];
                return true;
            },

            "ify": function (o) {
                if (Util.obj.is(o)) {
                    return o
                }
                try {
                    o = JSON.parse(o);
                } catch (e) {
                    o = {}
                }
                return o;
            },

            "copy": function (o) { // because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
                return !o ? o : JSON.parse(JSON.stringify(o)); // is shockingly faster than anything else, and our data has to be a subset of JSON anyways!
            },

            "has": function (o, t) {
                return o && Object.prototype.hasOwnProperty.call(o, t)
            }
            , "empty": function (o, n) {
                if (!o) {
                    return true
                }
                return Util.obj.map(o, function (v, i) {
                    if (n && (i === n || (Util.obj.is(n) && Util.obj.has(n, i)))) {
                        return
                    }
                    if (i) {
                        return true
                    }
                }) ? false : true;
            }
            , "map": function (l, c, _) {
                var u, i = 0, ii = 0, x, r, rr, f = Util.fns.is(c),
                    t = function (k, v) {
                        if (v !== u) {
                            rr = rr || {};
                            rr[k] = v;
                            return;
                        }
                        rr = rr || [];
                        rr.push(k);
                    };
                if (Util.list.is(l)) {
                    x = l.length;
                    for (; i < x; i++) {
                        ii = (i + Util.list.index);
                        if (f) {
                            r = _ ? c.call(_, l[i], ii, t) : c(l[i], ii, t);
                            if (r !== u) {
                                return r
                            }
                        } else {
                            //if(Util.test.is(c,l[i])){ return ii } // should implement deep equality testing!
                            if (c === l[i]) {
                                return ii
                            } // use this for now
                        }
                    }
                } else {
                    for (i in l) {
                        if (f) {
                            if (Util.obj.has(l, i)) {
                                r = _ ? c.call(_, l[i], i, t) : c(l[i], i, t);
                                if (r !== u) {
                                    return r
                                }
                            }
                        } else {
                            //if(a.test.is(c,l[i])){ return i } // should implement deep equality testing!
                            if (c === l[i]) {
                                return i
                            } // use this for now
                        }
                    }
                }
                return f ? rr : Util.list.index ? 0 : -1;
            },
        },
        "time": {
            "is": function (t) {
                return t ? t instanceof Date : (+new Date().getTime())
            }
            , "now": function (t) {
                return ((t = t || Util.time.is()) > (Util.time.now.last || -Infinity) ? (Util.time.now.last = t) : Util.time.now(t + 1)) + (Util.time.now.drift || 0);
            }
        }
    };

    Gunstore.opt = function (opt, stun) { // idempotently update or put options
    var gun = this;
    gun._ = gun._ || {};
    gun.__ = gun.__ || {};
    opt = opt || {};
    gun.__.opt = gun.__.opt || {};
    gun.__.flag = gun.__.flag || {start: {}, end: {}};
    gun.__.key = gun.__.key || {s: {}, ed: {}};
    gun.__.graph = gun.__.graph || {};
    gun.__.on = gun.__.on || GunStore.on.create();
    gun.__.meta = gun.__.meta || function (s) {
            return gun.__.meta[s] = gun.__.meta[s] || {}
        };
    if (GunStore.text.is(opt)) {
        opt = {peers: opt}
    }
    if (GunStore.list.is(opt)) {
        opt = {peers: opt}
    }
    if (GunStore.text.is(opt.peers)) {
        opt.peers = [opt.peers]
    }
    if (GunStore.list.is(opt.peers)) {
        opt.peers = GunStore.obj.map(opt.peers, function (n, f, m) {
            m(n, {})
        })
    }
    gun.__.opt.peers = opt.peers || gun.__.opt.peers || {};
    gun.__.opt.uuid = opt.uuid || gun.__.opt.uuid || {};
    gun.__.opt.cb = gun.__.opt.cb || function () {
        };
    gun.__.opt.hooks = gun.__.opt.hooks || {};
    GunStore.obj.map(opt.hooks, function (h, f) {
        if (!GunStore.fns.is(h)) {
            return
        }
        gun.__.opt.hooks[f] = h;
    });
    if (!stun) {
        GunStore.on('opt').emit(gun, opt)
    }
    };
    GunStore.is = function (gun) {
        return !!(gun instanceof GunStore)
    }; // check to see if it is a GUN instance.
    GunStore.is.value = function (v) { // Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
        if (v === null) {
            return true
        } // "deletes", nulling out fields.
        if (v === Infinity) {
            return false
        } // we want this to be, but JSON does not support it, sad face.
        if (GunStore.bi.is(v) // by "binary" we mean boolean.
            || GunStore.num.is(v)
            || GunStore.text.is(v)) { // by "text" we mean strings.
            return true; // simple values are valid.
        }
        return GunStore.is.soul(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
    };
    GunStore.is.value.as = function (v) { // check if it is a valid value and return the value if so,
        return GunStore.is.value(v) ? v : null; // else return null.
    };
    GunStore.is.soul = function (v) { // this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
        if (GunStore.obj.is(v)) { // must be an object.
            var id;
            GunStore.obj.map(v, function (soul, field) { // map over the object...
                if (id) {
                    return id = false
                } // if ID is already defined AND we're still looping through the object, it is considered invalid.
                if (field == GunStore._.soul && GunStore.text.is(soul)) { // the field should be '#' and have a text value.
                    id = soul; // we found the soul!
                } else {
                    return id = false; // if there exists anything else on the object that isn't the soul, then it is considered invalid.
                }
            });
            if (id) { // a valid id was found.
                return id; // yay! Return it.
            }
        }
        return false; // the value was not a valid soul relation.
    };
    GunStore.is.soul.on = function (n) {
        return (n && n._ && n._[GunStore._.soul]) || false
    }; // convenience function to check to see if there is a soul on a node and return it.
    GunStore.is.node = function (node, cb, t) { // checks to see if an object is a valid node.
        var soul;
        if (!GunStore.obj.is(node)) {
            return false
        } // must be an object.
        if (soul = GunStore.is.soul.on(node)) { // must have a soul on it.
            return !GunStore.obj.map(node, function (value, field) { // we invert this because the way we check for this is via a negation.
                if (field == GunStore._.meta) {
                    return
                } // skip over the metadata.
                if (!GunStore.is.value(value)) {
                    return true
                } // it is true that this is an invalid node.
                if (cb) {
                    cb.call(t, value, field, node._, soul)
                } // optionally callback each field/value.
            });
        }
        return false; // nope! This was not a valid node.
    };
    GunStore.is.graph = function (graph, cb, fn, t) { // checks to see if an object is a valid graph.
        var exist = false;
        if (!GunStore.obj.is(graph)) {
            return false
        } // must be an object.
        return !GunStore.obj.map(graph, function (node, soul) { // we invert this because the way we check for this is via a negation.
                if (!node || soul !== GunStore.is.soul.on(node) || !GunStore.is.node(node, fn)) {
                    return true
                } // it is true that this is an invalid graph.
                (cb || function () {
                }).call(t, node, soul, function (fn) { // optional callback for each node.
                    if (fn) {
                        GunStore.is.node(node, fn, t)
                    } // where we then have an optional callback for each field/value.
                });
                exist = true;
            }) && exist; // makes sure it wasn't an empty object.
    };
    // GunStore.ify // the serializer is too long for right here, it has been relocated towards the bottom.
    GunStore.union = function (gun, prime, cb) { // merge two graphs into the first.
        var ctx = {
            count: 0, cb: function () {
                cb = cb ? cb() && null : null
            }
        };
        ctx.graph = gun.__.graph;
        if (!ctx.graph) {
            ctx.err = {err: GunStore.log("No graph!")}
        }
        if (!prime) {
            ctx.err = {err: GunStore.log("No data to merge!")}
        }
        if (ctx.soul = GunStore.is.soul.on(prime)) {
            ctx.tmp = {};
            ctx.tmp[ctx.soul] = prime;
            prime = ctx.tmp;
        }
        GunStore.is.graph(prime, null, function (val, field, meta) {
            if (!meta || !(meta = meta[GunStore._.HAM]) || !GunStore.num.is(meta[field])) {
                return ctx.err = {err: GunStore.log("No state on " + field + "!")}
            }
        });
        if (ctx.err) {
            return ctx
        }
        (function union(graph, prime) {
            ctx.count += 1;
            GunStore.obj.map(prime, function (node, soul) {
                soul = GunStore.is.soul.on(node);
                if (!soul) {
                    return
                }
                ctx.count += 1;
                var vertex = graph[soul];
                if (!vertex) { // disjoint // TODO: Maybe not correct? BUG, probably.
                    GunStore.on('union').emit(gun, graph[soul] = node);
                    gun.__.on('union').emit(node);
                    gun.__.on(soul).emit(node);
                    ctx.count -= 1;
                    return;
                }
                GunStore.HAM(vertex, node, function () {
                }, function (vertex, field, value) {
                    if (!vertex) {
                        return
                    }
                    var change = {};
                    change._ = change._ || {};
                    change._[GunStore._.soul] = GunStore.is.soul.on(vertex);
                    if (field) {
                        change._[GunStore._.HAM] = change._[GunStore._.HAM] || {};
                        vertex[field] = change[field] = value;
                        (vertex._[GunStore._.HAM] = vertex._[GunStore._.HAM] || {})[field] = change._[GunStore._.HAM][field] = node._[GunStore._.HAM][field];
                    }
                    //context.nodes[change._[GunStore._.soul]] = change;
                    //context('change').fire(change);
                    GunStore.on('union').emit(gun, change);
                    gun.__.on('union').emit(change);
                    gun.__.on(GunStore.is.soul.on(change)).emit(change);
                }, function () {
                })(function () {
                    if (!(ctx.count -= 1)) {
                        ctx.cb()
                    }
                });
            });
            ctx.count -= 1;
        })(ctx.graph, prime);
        if (!ctx.count) {
            ctx.cb()
        }
        return ctx;
    };
    GunStore.union.pseudo = function (soul, graph, vertex) {
        var c = 0, s;
        ((vertex = vertex || {})._ = {})[GunStore._.soul] = soul;
        GunStore.is.graph(graph, function (node, ss) {
            c += 1;
            s = ss;
            GunStore.HAM(vertex, node, function () {
            }, function (vertex, field, value) {
                (vertex._[GunStore._.HAM] = vertex._[GunStore._.HAM] || {})[field] = (node._[GunStore._.HAM] = node._[GunStore._.HAM] || {})[field];
                vertex[field] = value;
            }, function () {
            });
        });
        if (1 == c) {
            return
        }
        return vertex;
    };
    GunStore.HAM = function (vertex, delta, lower, now, upper) {
        upper.max = -Infinity;
        now.end = true;
        GunStore.obj.map(delta, function update(incoming, field) {
            if (field === GunStore._.meta) {
                return
            }
            now.end = false;
            var ctx = {incoming: {}, current: {}}, state;
            ctx.drift = GunStore.time.now(); //(ctx.drift = GunStore.time.is()) > (GunStore.time.now.last || -Infinity)? ctx.drift : GunStore.time.now.last;
            ctx.incoming.value = GunStore.is.soul(incoming) || incoming;
            ctx.current.value = GunStore.is.soul(vertex[field]) || vertex[field];
            ctx.incoming.state = GunStore.num.is(ctx.tmp = ((delta._ || {})[GunStore._.HAM] || {})[field]) ? ctx.tmp : -Infinity;
            ctx.current.state = GunStore.num.is(ctx.tmp = ((vertex._ || {})[GunStore._.HAM] || {})[field]) ? ctx.tmp : -Infinity;
            upper.max = ctx.incoming.state > upper.max ? ctx.incoming.state : upper.max;
            state = HAM(ctx.drift, ctx.incoming.state, ctx.current.state, ctx.incoming.value, ctx.current.value);
            if (state.err) {
                root.console.log(".!HYPOTHETICAL AMNESIA MACHINE ERR!.", state.err); // this error should never happen.
                return;
            }
            if (state.state || state.quarantineState || state.current) {
                lower.call(state, vertex, field, incoming);
                return;
            }
            if (state.incoming) {
                now.call(state, vertex, field, incoming);
                return;
            }
            if (state.amnesiaQuarantine) {
                upper.wait = true;
                upper.call(state, vertex, field, incoming); // signals that there are still future modifications.
                GunStore.schedule(ctx.incoming.state, function () {
                    update(incoming, field);
                    if (ctx.incoming.state === upper.max) {
                        (upper.last || function () {
                        })()
                    }
                });
            }
        });
        if (now.end) {
            now.call({}, vertex)
        } // TODO: Should HAM handle empty updates? YES.
        function HAM(machineState, incomingState, currentState, incomingValue, currentValue) { // TODO: Lester's comments on roll backs could be vulnerable to divergence, investigate!
            if (machineState < incomingState) {
                // the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.
                return {amnesiaQuarantine: true};
            }
            if (incomingState < currentState) {
                // the incoming value is within the boundary of the machine's state, but not within the range.
                return {quarantineState: true};
            }
            if (currentState < incomingState) {
                // the incoming value is within both the boundary and the range of the machine's state.
                return {converge: true, incoming: true};
            }
            if (incomingState === currentState) {
                if (incomingValue === currentValue) { // Note: while these are practically the same, the deltas could be technically different
                    return {state: true};
                }
                /*
                 The following is a naive implementation, but will always work.
                 Never change it unless you have specific needs that absolutely require it.
                 If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
                 As a result, it is highly discouraged to modify despite the fact that it is naive,
                 because convergence (data integrity) is generally more important.
                 Any difference in this algorithm must be given a new and different name.
                 */
                if (String(incomingValue) < String(currentValue)) { // String only works on primitive values!
                    return {converge: true, current: true};
                }
                if (String(currentValue) < String(incomingValue)) { // String only works on primitive values!
                    return {converge: true, incoming: true};
                }
            }
            return {err: "you have not properly handled recursion through your data or filtered it as JSON"};
        }

        return function (fn) {
            upper.last = fn || function () {
                };
            if (!upper.wait) {
                upper.last()
            }
        }
    };
    GunStore.on = QueueEvent.handleOn;
    GunStore.roulette = function (l, c) {
        var gun = GunStore.is(this) ? this : {};
        if (gun._ && gun.__.opt && gun.__.opt.uuid) {
            if (GunStore.fns.is(gun.__.opt.uuid)) {
                return gun.__.opt.uuid(l, c);
            }
            l = l || gun.__.opt.uuid.length;
        }
        return GunStore.text.random(l, c);
    };
    GunStore.queue = function (from) {
        from = from || this;
        var gun = GunStore(from); // create a gun queue from this GUN instance.
        gun.back = from; // back link it.
        gun.__ = from.__; // inherit the instance level configurations.
        gun._ = {on: GunStore.on.create()}; // create an event emitter for this new queue.
        gun._.at = function (e) {
            var proxy = function (cb, i, queue) {
                var on = gun._.on(e), at; // TODO: BUG! the on event emitter should be passed as the this, apparently it isn't. :(
                if (at = ((on = gun._.on(e)).e = on.e || {})[e]) {
                    setTimeout(function () {
                        cb.call(on, at)
                    }, 0)
                }
                on[queue](function (at) {
                    cb.call(on, at);
                }, i);
            };
            proxy.event = function (cb, i) {
                return proxy(cb, i, 'event')
            };
            proxy.once = function (cb, i) {
                return proxy(cb, i, 'once')
            };
            proxy.emit = function (at, on) { // emit immediately, not async.
                ((on = gun._.on(e)).e = on.e || {})[e] = at;
                gun._.on(e).emit(at);
            };
            return proxy;
        };
        return gun;
    };
    GunStore.ify = (function (Serializer) {
        function ify(data, cb, opt) {
            opt = opt || {};
            cb = cb || function (env, cb) {
                    cb(env.at, GunStore.roulette())
                }; // TODO: refactor GunStore.roulette
            var end = function (fn) {
                ctx.end = fn || function () {
                    };
                if (ctx.err) {
                    return ctx.end(ctx.err, ctx), ctx.end = function () {
                    }
                }
                unique(ctx);
            }, ctx = {at: {path: [], obj: data}, root: {}, graph: {}, queue: [], seen: [], loop: true};
            if (!data) {
                return ctx.err = GunStore.log('Serializer does not have correct parameters.'), end
            }
            ctx.at.node = ctx.root;
            while (ctx.loop && !ctx.err) {
                seen(ctx, ctx.at);
                map(ctx, cb);
                if (ctx.queue.length) {
                    ctx.at = ctx.queue.shift();
                } else {
                    ctx.loop = false;
                }
            }
            return end;
        }

        function map(ctx, cb) {
            var rel = function (at, soul) {
                at.soul = at.soul || soul;
                GunStore.list.map(at.back, function (rel) {
                    rel[GunStore._.soul] = at.soul;
                });
                unique(ctx); // could we remove the setTimeot?
            }, it;
            GunStore.obj.map(ctx.at.obj, function (val, field) {
                ctx.at.val = val;
                ctx.at.field = field;
                it = cb(ctx, rel) || true;
                if (field === GunStore._.meta) {
                    ctx.at.node[field] = GunStore.obj.copy(val); // TODO: BUG! Is this correct?
                    return;
                }
                if (false && notValidField(field)) { // TODO: BUG! Do later for ACID "consistency" guarantee.
                    return ctx.err = {err: GunStore.log('Invalid field name on ' + ctx.at.path.join('.'))};
                }
                if (!GunStore.is.value(val)) {
                    var at = {obj: val, node: {}, back: [], path: [field]}, tmp = {}, was;
                    at.path = (ctx.at.path || []).concat(at.path || []);
                    if (!GunStore.obj.is(val)) {
                        return ctx.err = {err: GunStore.log('Invalid value at ' + at.path.join('.') + '!')};
                    }
                    if (was = seen(ctx, at)) {
                        tmp[GunStore._.soul] = GunStore.is.soul.on(was.node) || null;
                        (was.back = was.back || []).push(ctx.at.node[field] = tmp);
                    } else {
                        ctx.queue.push(at);
                        tmp[GunStore._.soul] = null;
                        at.back.push(ctx.at.node[field] = tmp);
                    }
                } else {
                    ctx.at.node[field] = GunStore.obj.copy(val);
                }
            });
            if (!it) {
                cb(ctx, rel)
            }
        }

        function unique(ctx) {
            if (ctx.err || !GunStore.list.map(ctx.seen, function (at) {
                    if (!at.soul) {
                        return true
                    }
                }) && !ctx.loop) {
                return ctx.end(ctx.err, ctx), ctx.end = function () {
                }
            }
        }

        function seen(ctx, at) {
            return GunStore.list.map(ctx.seen, function (has) {
                    if (at.obj === has.obj) {
                        return has
                    }
                }) || (ctx.seen.push(at) && false);
        }

        return ify;
    }({}));

    ;(function (schedule) { // maybe use lru-cache
        schedule.waiting = [];
        schedule.soonest = Infinity;
        schedule.sort = GunStore.list.sort('when');
        schedule.set = function (future) {
            if (Infinity <= (schedule.soonest = future)) {
                return
            }
            var now = GunStore.time.now(); // WAS time.is() TODO: Hmmm, this would make it hard for every gun instance to have their own version of time.
            future = (future <= now) ? 0 : (future - now);
            clearTimeout(schedule.id);
            schedule.id = setTimeout(schedule.check, future);
        };
        schedule.check = function () {
            var now = GunStore.time.now(), soonest = Infinity; // WAS time.is() TODO: Same as above about time. Hmmm.
            schedule.waiting.sort(schedule.sort);
            schedule.waiting = GunStore.list.map(schedule.waiting, function (wait, i, map) {
                    if (!wait) {
                        return
                    }
                    if (wait.when <= now) {
                        if (GunStore.fns.is(wait.event)) {
                            setTimeout(function () {
                                wait.event()
                            }, 0);
                        }
                    } else {
                        soonest = (soonest < wait.when) ? soonest : wait.when;
                        map(wait);
                    }
                }) || [];
            schedule.set(soonest);
        };
        GunStore.schedule = function (state, cb) {
            schedule.waiting.push({
                when: state, event: cb || function () {
                }
            });
            if (schedule.soonest < state) {
                return
            }
            schedule.set(state);
        }
    }({}));
    if (typeof window !== "undefined") {
        window.GunStore = GunStore;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GunStore;
    }
    var root = this || {}; // safe for window, global, root, and 'use strict'.
    root.console = root.console || {
            log: function (s) {
                return s
            }
        }; // safe for old browsers
    var console = {
        log: GunStore.log = function (s) {
            return (GunStore.log.verbose && root.console.log.apply(root.console, arguments)), s
        },
        Log: function (s) {
            return (!GunStore.log.squelch && root.console.log.apply(root.console, arguments)), s
        }
    };
}({}));

(function (tab) {
    if(!this.Gun){ return }
	if(!window.JSON){ throw new Error("Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js") } // for old IE use
	Gun.on('opt').event(function(gun, opt){
		opt = opt || {};
		var tab = gun.tab = gun.tab || {};
		tab.store = tab.store || store;
		tab.request = tab.request || request;
		tab.headers = opt.headers || {};
		tab.headers['gun-sid'] = tab.headers['gun-sid'] || Gun.text.random(); // stream id
		tab.prefix = tab.prefix || opt.prefix || 'gun/';
		tab.prekey = tab.prekey || opt.prekey || '';
		tab.prenode = tab.prenode || opt.prenode || '_/nodes/';
		tab.get = tab.get || function(key, cb, opt){
			if(!key){ return }
			cb = cb || function(){};
			cb.GET = true;
			(opt = opt || {}).url = opt.url || {};
			opt.headers = Gun.obj.copy(tab.headers);
			if(Gun.is.soul(key)){
				opt.url.query = key;
			} else {
				opt.url.pathname = '/' + key;
			}
			var getPrefix = (opt.prefix) ? opt.prefix: tab.prefix; // allows users to provide a prefix for the get operation
			Gun.log("tab get --->", key);
			(function local(key, cb){
				var path = (path = Gun.is.soul(key))? getPrefix + tab.prenode + path
					: getPrefix + tab.prekey + key, node = tab.store.get(path), graph, soul;
				if(Gun.is.node(node)){
					(cb.graph = cb.graph || {}
					)[soul = Gun.is.soul.on(node)] = (graph = {})[soul] = cb.node = node;
					cb(null, graph); 
					(graph = {})[soul] = Gun.union.pseudo(soul); // end.
					return cb(null, graph);
				} else 
				if(Gun.obj.is(node)){
					Gun.obj.map(node, function(rel){ if(Gun.is.soul(rel)){ local(rel, cb) } });
					cb(null, {});
				}
			}(key, cb));
			if(!(cb.local = opt.local)){
				Gun.obj.map(opt.peers || gun.__.opt.peers, function(peer, url){ var p = {};
					tab.request(url, null, tab.error(cb, "Error: Get failed through " + url, function(reply){
						if(!p.graph && !Gun.obj.empty(cb.graph)){ // if we have local data
							tab.put(p.graph = cb.graph, function(e,r){ // then sync it if we haven't already
								Gun.log("Stateless handshake sync:", e, r);
							}, {peers: tab.peers(url)}); // to the peer. // TODO: This forces local to flush again, not necessary.
						}
						if(!Gun.is.soul(key)){
							Gun.is.graph(reply.body || gun.__.key.s[key], function(node, soul){ // make sure for each received node or nodes of our key
								tab.key(key, soul, function(){}); // that the key points to it.
							});
						}
						setTimeout(function(){ tab.put(reply.body, function(){}, {local: true}) },1); // and flush the in memory nodes of this graph to localStorage after we've had a chance to union on it.
					}), opt);
					cb.peers = true;
				});
			} tab.peers(cb);
		};
		tab.put = tab.put || function(graph, cb, opt){
			cb = cb || function(){};
			opt = opt || {};
			var putPrefix = (opt.prefix) ? opt.prefix: tab.prefix; // allows users to provide a prefix for the put operation
			Gun.is.graph(graph, function(node, soul){
				if(!opt.local){ gun.__.on(soul).emit(node) } // TODO: Should this be in core?
				if(!gun.__.graph[soul]){ return }
				tab.store.put(putPrefix + tab.prenode + soul, gun.__.graph[soul]);
			});
			if(!(cb.local = opt.local)){
				Gun.obj.map(opt.peers || gun.__.opt.peers, function(peer, url){
					tab.request(url, graph, tab.error(cb, "Error: Put failed on " + url), {headers: tab.headers});
					cb.peers = true;
				});
			} tab.peers(cb);
		};
		tab.key = tab.key || function(key, soul, cb, opt){
			var meta = {};
			opt = opt || {};
			cb = cb || function(){};
			var keyPrefix = (opt.prefix) ? opt.prefix: tab.prefix; // allows users to provide a prefix for the key operation
			meta[Gun._.soul] = soul = Gun.is.soul(soul) || soul;
			if(!soul){ return cb({err: Gun.log("No soul!")}) }
			(function(souls){
				(souls = tab.store.get(keyPrefix + tab.prekey + key) || {})[soul] = meta;
				tab.store.put(keyPrefix + tab.prekey + key, souls);
			}());
			if(!(cb.local = opt.local || opt.soul)){
				Gun.obj.map(opt.peers || gun.__.opt.peers, function(peer, url){
					tab.request(url, meta, tab.error(cb, "Error: Key failed to be made on " + url), {url: {pathname: '/' + key }, headers: tab.headers});
					cb.peers = true;
				}); 
			} tab.peers(cb);
		};
		tab.error = function(cb, error, fn){
			return function(err, reply){
				reply.body = reply.body || reply.chunk || reply.end || reply.write;
				if(err || !reply || (err = reply.body && reply.body.err)){
					return cb({err: Gun.log(err || error) });
				}
				if(fn){ fn(reply) }
				cb(null, reply.body);
			}
		};
		tab.peers = function(cb, o){
			if(Gun.text.is(cb)){ return (o = {})[cb] = {}, o }
			if(cb && !cb.peers){ setTimeout(function(){
				if(!cb.local){ console.log("Warning! You have no peers to connect to!") }
				if(!(cb.graph || cb.node)){ cb() }
			},1)}
		};
		tab.server = tab.server || function(req, res){
			if(!req || !res || !req.url || !req.method){ return }
			req.url = req.url.href? req.url : document.createElement('a');
			req.url.href = req.url.href || req.url;
			req.url.key = (req.url.pathname||'').replace(tab.server.regex,'').replace(/^\//i,'') || '';
			req.method = req.body? 'put' : 'get';
			if('get' == req.method){ return tab.server.get(req, res) }
			if('put' == req.method || 'post' == req.method){ return tab.server.put(req, res) }
		};
		tab.server.json = 'application/json';
		tab.server.regex = gun.__.opt.route = gun.__.opt.route || opt.route || /^\/gun/i;
		tab.server.get = function(){};
		tab.server.put = function(req, cb){
			var reply = {headers: {'Content-Type': tab.server.json}};
			if(!req.body){ return cb({headers: reply.headers, body: {err: "No body"}}) }
			// TODO: Re-emit message to other peers if we have any non-overlaping ones.
			if(tab.server.put.key(req, cb)){ return }
			if(Gun.is.node(req.body) || Gun.is.graph(req.body, function(node, soul){
				gun.__.flag.end[soul] = true; // TODO: Put this in CORE not in TAB driver?
			})){
				//console.log("tran.put", req.body);					
				if(req.err = Gun.union(gun, req.body, function(err, ctx){
					if(err){ return cb({headers: reply.headers, body: {err: err || "Union failed."}}) }
					var ctx = ctx || {}; ctx.graph = {};
					Gun.is.graph(req.body, function(node, soul){ ctx.graph[soul] = gun.__.graph[soul] });
					gun.__.opt.hooks.put(ctx.graph, function(err, ok){
						if(err){ return cb({headers: reply.headers, body: {err: err || "Failed."}}) }
						cb({headers: reply.headers, body: {ok: ok || "Persisted."}});
					}, {local: true});
				}).err){ cb({headers: reply.headers, body: {err: req.err || "Union failed."}}) }
			}
		};
		tab.server.put.key = function(req, cb){
			if(!req || !req.url || !req.url.key || !Gun.obj.has(req.body, Gun._.soul)){ return }
			var index = req.url.key, soul = Gun.is.soul(req.body);
			//console.log("tran.key", index, req.body);
			gun.key(index, function(err, reply){
				if(err){ return cb({headers: {'Content-Type': tab.server.json}, body: {err: err}}) }
				cb({headers: {'Content-Type': tab.server.json}, body: reply}); // TODO: Fix so we know what the reply is.
			}, soul);
			return true;
		};
		Gun.obj.map(gun.__.opt.peers, function(){ // only create server if peers and do it once by returning immediately.
			return (tab.server.able = tab.server.able || tab.request.createServer(tab.server) || true);
		});
		gun.__.opt.hooks.get = gun.__.opt.hooks.get || tab.get;
		gun.__.opt.hooks.put = gun.__.opt.hooks.put || tab.put;
		gun.__.opt.hooks.key = gun.__.opt.hooks.key || tab.key;
	});
	var store = (function(){
		function s(){}
		var store = window.localStorage || {setItem: function(){}, removeItem: function(){}, getItem: function(){}};
		s.put = function(key, val){ return store.setItem(key, Gun.text.ify(val)) };
		s.get = function(key){ return Gun.obj.ify(store.getItem(key) || null) };
		s.del = function(key){ return store.removeItem(key) };
		return s;
	}());
	var request = (function(){
		function r(base, body, cb, opt){
			opt = opt || (base.length? {base: base} : base);
			opt.base = opt.base || base;
			opt.body = opt.body || body;
			if(!opt.base){ return }
			r.transport(opt, cb);
		}
		r.createServer = function(fn){ r.createServer.s.push(fn) };
		r.createServer.ing = function(req, cb){
			var i = r.createServer.s.length;
			while(i--){ (r.createServer.s[i] || function(){})(req, cb) }
		};
		r.createServer.s = [];
		r.transport = function(opt, cb){
			//Gun.log("TRANSPORT:", opt);
			if(r.ws(opt, cb)){ return }
			r.jsonp(opt, cb);
		};
		r.ws = function(opt, cb){
			var ws, WS = window.WebSocket || window.mozWebSocket || window.webkitWebSocket;
			if(!WS){ return }
			if(ws = r.ws.peers[opt.base]){
				if(!ws.readyState){ return setTimeout(function(){ r.ws(opt, cb) },10), true }
				var req = {};
				if(opt.headers){ req.headers = opt.headers }
				if(opt.body){ req.body = opt.body }
				if(opt.url){ req.url = opt.url }
				req.headers = req.headers || {};
				r.ws.cbs[req.headers['ws-rid'] = 'WS' + (+ new Date()) + '.' + Math.floor((Math.random()*65535)+1)] = function(err,res){
					if(res.body || res.end){ delete r.ws.cbs[req.headers['ws-rid']] }
					cb(err,res);
				};
				ws.send(JSON.stringify(req));
				return true;
			}
			if(ws === false){ return }
			ws = r.ws.peers[opt.base] = new WS(opt.base.replace('http','ws'));
			ws.onopen = function(o){ r.ws(opt, cb) };
			ws.onclose = window.onbeforeunload = function(c){
				if(!c){ return }
				if(ws && ws.close instanceof Function){ ws.close() }
				if(1006 === c.code){ // websockets cannot be used
					ws = r.ws.peers[opt.base] = false;
					r.transport(opt, cb);
					return;
				}
				ws = r.ws.peers[opt.base] = null; // this will make the next request try to reconnect
				setTimeout(function(){
					console.log("!!!!! WEBSOCKET DICONNECTED !!!!!! ATTEMPTING INFINITE RETRY WITH NO BACKOFF !!!!!!!");
					r.ws(opt, function(){}); // opt here is a race condition, is it not? Does this matter?
				}, 50); // make this an exponential backoff.
			};
			ws.onmessage = function(m){
				if(!m || !m.data){ return }
				var res;
				try{res = JSON.parse(m.data);
				}catch(e){ return }
				if(!res){ return }
				res.headers = res.headers || {};
				if(res.headers['ws-rid']){ return (r.ws.cbs[res.headers['ws-rid']]||function(){})(null, res) }
				Gun.log("We have a pushed message!", res);
				if(res.body){ r.createServer.ing(res, function(){}) } // emit extra events.
			};
			ws.onerror = function(e){ console.log("!!!! WEBSOCKET ERROR !!!!", e); Gun.log(e); };
			return true;
		};
		r.ws.peers = {};
		r.ws.cbs = {};
		r.jsonp = function(opt, cb){
			//Gun.log("jsonp send", opt);
			r.jsonp.ify(opt, function(url){
				//Gun.log(url);
				if(!url){ return }
				r.jsonp.send(url, function(reply){
					//Gun.log("jsonp reply", reply);
					cb(null, reply);
					r.jsonp.poll(opt, reply);
				}, opt.jsonp);
			});
		};
		r.jsonp.send = function(url, cb, id){
			var js = document.createElement('script');
			js.src = url;
			window[js.id = id] = function(res){
				cb(res);
				cb.id = js.id;
				js.parentNode.removeChild(js);
				window[cb.id] = null; // TODO: BUG: This needs to handle chunking!
				try{delete window[cb.id];
				}catch(e){}
			};
			js.async = true;
			document.getElementsByTagName('head')[0].appendChild(js);
			return js;
		};
		r.jsonp.poll = function(opt, res){
			if(!opt || !opt.base || !res || !res.headers || !res.headers.poll){ return }
			(r.jsonp.poll.s = r.jsonp.poll.s || {})[opt.base] = r.jsonp.poll.s[opt.base] || setTimeout(function(){ // TODO: Need to optimize for Chrome's 6 req limit?
				//Gun.log("polling again");
				var o = {base: opt.base, headers: {pull: 1}};
				r.each(opt.headers, function(v,i){ o.headers[i] = v });
				r.jsonp(o, function(err, reply){
					delete r.jsonp.poll.s[opt.base];
					while(reply.body && reply.body.length && reply.body.shift){ // we're assuming an array rather than chunk encoding. :(
						var res = reply.body.shift();
						//Gun.log("-- go go go", res);
						if(res && res.body){ r.createServer.ing(res, function(){}) } // emit extra events.
					}
				});
			}, res.headers.poll);
		};
		r.jsonp.ify = function(opt, cb){
			var uri = encodeURIComponent, q = '?';
			if(opt.url && opt.url.pathname){ q = opt.url.pathname + q; }
			q = opt.base + q;
			r.each((opt.url||{}).query, function(v, i){ q += uri(i) + '=' + uri(v) + '&' });
			if(opt.headers){ q += uri('`') + '=' + uri(JSON.stringify(opt.headers)) + '&' }
			if(r.jsonp.max < q.length){ return cb() }
			q += uri('jsonp') + '=' + uri(opt.jsonp = 'P'+Math.floor((Math.random()*65535)+1));
			if(opt.body){
				q += '&';
				var w = opt.body, wls = function(w,l,s){
					return uri('%') + '=' + uri(w+'-'+(l||w)+'/'+(s||w))  + '&' + uri('$') + '=';
				};
				if(typeof w != 'string'){
					w = JSON.stringify(w);
					q += uri('^') + '=' + uri('json') + '&';
				}
				w = uri(w);
				var i = 0, l = w.length
				, s = r.jsonp.max - (q.length + wls(l.toString()).length);
				if(s < 0){ return cb() }
				while(w){
					cb(q + wls(i, (i = i + s), l) + w.slice(0, i));
					w = w.slice(i);
				}
			} else {
				cb(q);
			}
		};
		r.jsonp.max = 2000;
		r.each = function(obj, cb){
			if(!obj || !cb){ return }
			for(var i in obj){
				if(obj.hasOwnProperty(i)){
					cb(obj[i], i);
				}
			}
		};
		return r;
	}());
}({}));
