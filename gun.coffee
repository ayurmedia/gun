(->
  Gun = (opt) -> # the starting point to using GUN! Should be called once per page load.
    gun = this
    # if this is not a GUN instance,
    return new Gun(opt)  unless Gun.is(gun) # then make it so.
    # if opt is a GUN instance,
    return gun  if Gun.is(opt) # then return a new chain, reusing the existing options.
    gun.opt opt # update the instance's options.
  # some reserved key words, these are not the only ones.
  # a soul is a UUID of a node but it always points to the "latest" data known.
  # all metadata of the node is stored in the meta property on the node.
  # other than the soul, we store HAM metadata.
  # GUN specific utilities.
  # initialize standard javascript utilities.
  # does Travis allow us to dynamically update package.json and npm publish?
  # check to see if it is a GUN instance.
  # Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
  # "deletes", nulling out fields.
  # we want this to be, but JSON does not support it, sad face.
  # by "binary" we mean boolean.
  # by "text" we mean strings.
  # simple values are valid.
  # is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
  # check if it is a valid value and return the value if so,
  # else return null.
  # this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
  # must be an object.
  # map over the object...
  # if ID is already defined AND we're still looping through the object, it is considered invalid.
  # the field should be '#' and have a text value.
  # we found the soul!
  # if there exists anything else on the object that isn't the soul, then it is considered invalid.
  # a valid id was found.
  # yay! Return it.
  # the value was not a valid soul relation.
  # convenience function to check to see if there is a soul on a node and return it.
  # checks to see if an object is a valid node.
  # must be an object.
  # must have a soul on it.
  # we invert this because the way we check for this is via a negation.
  # skip over the metadata.
  # it is true that this is an invalid node.
  # optionally callback each field/value.
  # nope! This was not a valid node.
  # checks to see if an object is a valid graph.
  # must be an object.
  # we invert this because the way we check for this is via a negation.
  # it is true that this is an invalid graph.
  # optional callback for each node.
  # where we then have an optional callback for each field/value.
  # makes sure it wasn't an empty object.

  # Gun.ify // the serializer is too long for right here, it has been relocated towards the bottom.
  # merge two graphs into the first.
  # disjoint // TODO: Maybe not correct? BUG, probably.

  #context.nodes[change._[Gun._.soul]] = change;
  #context('change').fire(change);
  #(ctx.drift = Gun.time.is()) > (Gun.time.now.last || -Infinity)? ctx.drift : Gun.time.now.last;
  # this error should never happen.
  # signals that there are still future modifications.
  # TODO: Should HAM handle empty updates? YES.
  # TODO: Lester's comments on roll backs could be vulnerable to divergence, investigate!

  # the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.

  # the incoming value is within the boundary of the machine's state, but not within the range.

  # the incoming value is within both the boundary and the range of the machine's state.
  # Note: while these are practically the same, the deltas could be technically different

  #
  #						The following is a naive implementation, but will always work.
  #						Never change it unless you have specific needs that absolutely require it.
  #						If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
  #						As a result, it is highly discouraged to modify despite the fact that it is naive,
  #						because convergence (data integrity) is generally more important.
  #						Any difference in this algorithm must be given a new and different name.
  #
  # String only works on primitive values!
  # String only works on primitive values!

  # events are fundamentally different, being synchronously 1 to N fan out,
  # than req/res/callback/promise flow, which are asynchronously 1 to 1 into a sink.
  # idempotently update or put options
  # create a gun chain from this GUN instance.
  # back link it.
  # inherit the instance level configurations.
  # create an event emitter for this new chain.
  # TODO: BUG! the on event emitter should be passed as the this, apparently it isn't. :(
  # emit immediately, not async.
  # get opens up a reference to a node and loads it.
  # create the new chain and have a scoped context.
  # if key is text, then key, else false.
  # if key is a soul, then the soul, else false.
  # force a load regardless of whether it is a key or soul!
  # if we have a soul that is...
  # in memory, then
  # add it to our graph context.
  # call the callback with a copy of the graph.
  # override our context with empty nodes as end markers, per the wire protocol.
  # call the end nodes, and wire end.
  # not in memory, then load it.
  # either way we know the soul, so make sure it is in our graph so it can be referenced.
  # emit the soul to the chain!
  # if it is a key, then
  # once we have a soul
  # grab the graph corresponding to the key.
  # iterate over each node
  # put empty nodes as an end marker, per the wire protocol.
  # emit each soul to the chain!
  # and finally, call the graph, the end nodes, and the wire end.
  # check if it is in memory, else
  # if it will be in memory, then TODO: convert this to use the meta system instead if possible, seems cleaner.
  # subscribe to when that happens.
  # else it is not in memory, load it.
  # load a key or soul.
  # if we have a hook...
  # listen to callbacks, which will be called multiple times.
  # if error, call it and be done. TODO: emit error!
  # if there is no data...
  # make sure we don't have context data, if we do, don't go further.
  # call that we have null data, since nodejs callback style does not differentiate between error, null, and data.
  # set the end marker. TODO: convert this to use the meta system instead if possible, seems cleaner.
  # TODO: cover all edge cases, uniqueness?
  # once called, clear out our flag.
  # emit the soul to the chain.
  # emit the null to the chain!
  # create a data context.
  # call the wire end and be done.
  # iterate over each node in the data graph
  # union it, or error.
  # if it was on a key, then add this node to the key graph.
  # and emit each soul to the chain!
  # if the data isn't a graph, error out.
  # TODO: Hmm, this should be called before the chain emit, but I don't want to do 2 map operations. As long as union is called before, does this matter that it is after?
  # if there is no hook...
  # politely notify people.
  # Technically no error, but no way we can get data.
  # and emit the null to the chain!
  # TODO: Have opt that will aggregate.
  # force inject // TODO: BUG! WRITE A TEST FOR THIS!
  # TODO: Ought this be fulfilled from self as well?
  # will be injected via a put
  # TODO: once per soul in graph. (?)
  # This is in memory success, hardly "success" at all.
  # TODO: BUG! We need to create all!
  # TODO: BUG!! Need to handle souls too!
  # assign it to this virtual node.
  # frozen copy
  # call the hook
  # this is multiple

  #
  #			how many different ways can we return something? ONLY THE FIRST ONE IS SUPPORTED, the others might become plugins.
  #			Find via a singular path
  #				.path('blah').val(blah);
  #			Find via multiple paths with the callback getting called many times
  #				.path('foo', 'bar').val(fooOrBar);
  #			Find via multiple paths with the callback getting called once with matching arguments
  #				.path('foo', 'bar').val(foo, bar)
  #			Find via multiple paths with the result aggregated into an object of pre-given fields
  #				.path('foo', 'bar').val({foo: foo, bar: bar}) || .path({a: 'foo', b: 'bar'}).val({a: foo, b: bar})
  #			Find via multiple paths where the fields and values must match
  #				.path({foo: val, bar: val}).val({})
  #			Path ultimately should call .val each time, individually, for what it finds.
  #			Things that wait and merge many things together should be an abstraction ontop of path.
  #
  # TODO: Make it so you can adjust how many terminations!
  # TODO: BUG! `chain` here is incorrect on unknowns. This has been fixed at an API level.

  #(on = on || {off:function(){}}).off();
  # if the current node is a child of the parent that we were subscribing to a field on.
  #on = (this || {off:function(){}}); // TODO: BUG? is var node = thing || node safe in old IE?

  # TODO: BUG! Shouldn't `.val` pseudo union check that each node in the key graph is ended? Current thought: Not necessarily! Since `.val` is first come first serve until we provide configurable end options.
  #on.off(); // TODO: Fix the bug with at for this to be on.
  # TODO: Add opt to change number of terminations.
  #on.off(); // TODO: Fix the bug with at for this to be on.
  # on subscribes to any changes related to the chain.
  # reuse the current chain and have a scoped context.
  # .on(fn, true) gives you delta pairs.
  # subscribe to soul events on the chain.
  # check to see if we have a root level listener for changes on this soul.
  # then do nothing, unless the options request all raw events.
  # call it with the node and the event. TODO: we get duplicate ons, once here and once from HAM.
  # if there isn't a root level listener for changes on the soul, then
  # mark that we are adding one.
  # use the pass event or reuse the the chain's event.
  # just make sure that things match for safety purposes.
  # if the chain is on a field, then check if the field value is a relation.
  # why do we do this again? To prevent recursion or something I think?
  # subscribe to root level emitter for the soul.
  # call ourselves.

  # TODO: do we need to load it? what about that $.gun context?
  # if raw events are requested, call it with all the pieces we have.
  # ignore end nodes unless otherwise requested.
  # if there are multiple nodes on the key, then do a pseudo union across all nodes in the key graph to create a temporary abstract form of the data.
  # if we want only the change, prioritize the delta over the node.
  # call the callback with a snapshot of the data!
  # call ourselves immediately!
  # and finally, actually subscribe to the root level emitter for this soul.

  #
  #			ACID compliant? Unfortunately the vocabulary is vague, as such the following is an explicit definition:
  #			A - Atomic, if you put a full node, or nodes of nodes, if any value is in error then nothing will be put.
  #				If you want puts to be independent of each other, you need to put each piece of the data individually.
  #			C - Consistency, if you use any reserved symbols or similar, the operation will be rejected as it could lead to an invalid read and thus an invalid state.
  #			I - Isolation, the conflict resolution algorithm guarantees idempotent transactions, across every peer, regardless of any partition,
  #				including a peer acting by itself or one having been disconnected from the network.
  #			D - Durability, if the acknowledgement receipt is received, then the state at which the final persistence hook was called on is guaranteed to have been written.
  #				The live state at point of confirmation may or may not be different than when it was called.
  #				If this causes any application-level concern, it can compare against the live data by immediately reading it, or accessing the logs if enabled.
  #
  # TODO: handle case where val is a gun context!
  # TODO: refactor Gun.roulette!
  # TODO: every instance of gun maybe should have their own version of time.

  #var hash = $.from? ($.from + ($.at || '')) : ($.soul + ($.field || ''));
  # no else!
  # TODO: refactor Gun.roulette!
  # TODO: clean this up.
  # WAS ON
  # now iterate through those nodes to a persistence layer and get a callback once all are saved
  # This is in memory success, hardly "success" at all.
  # maybe filter against known fields. Huh?

  # TODO: BUG? What if we re-assign a field to a different soul or value? Shouldn't we disable the previous listener? Do we need to check if we already made a listener so we don't recursively add up more and more listeners that get called? Etc. ?
  # {node: true} maps over only sub nodes.
  # TODO: every gun instance should maybe have their own version of time.
  # TODO: Make this configurable!

  # TODO: BUG? Removed a start flag check and tests passed, but is that an edge case?
  # TODO: refactor Gun.roulette
  # WAS ON!
  # WARNING: dud was depreciated.
  Util = (Util) ->
    Util.fns = {}
    Util.fns.is = (fn) ->
      (if (fn instanceof Function) then true else false)

    Util.fns.sum = (done) -> # combine with Util.obj.map for some easy parallel async operations!
      context =
        task: {}
        data: {}

      context.end = (e, v) ->
        done(e, v)
        done = ->

      context.add = (fn, id) ->
        context.task[id = id or ((if Gun.text.is(fn) then fn else Gun.text.random()))] = false
        each = (err, val) ->
          context.task[id] = true
          (context.err = context.err or {})[id] = err  if err
          context.data[id] = val
          # it is true if we are NOT done yet, then invert.
          done context.err, context.data  unless Gun.obj.map(context.task, (val) ->
            true  unless val
          )

        c = context
        (if Gun.fns.is(fn) then ->
          fn.apply
            task: c.task
            data: c.data
            end: c.end
            done: each
          , arguments
        else each)

context

Util.bi = {}
Util.bi.is = (b) ->
  (if (b instanceof Boolean or typeof b is "boolean") then true else false)

Util.num = {}
Util.num.is = (n) ->
  not Util.list.is(n) and (Infinity is n or n - parseFloat(n) + 1 >= 0) # jquery doesn't check for Infinity.

Util.text = {}
Util.text.is = (t) ->
  (if typeof t is "string" then true else false)

Util.text.ify = (t) ->
  return t  if Util.text.is(t)
  return JSON.stringify(t)  if JSON
  (if (t and t.toString) then t.toString() else t)

Util.text.random = (l, c) ->
  s = ""
  l = l or 24 # you are not going to make a 0 length random number, so no need to check type
  c = c or "0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz"
  while l > 0
    s += c.charAt(Math.floor(Math.random() * c.length))
    l--
  s

Util.list = {}
Util.list.is = (l) ->
  (if (l instanceof Array) then true else false)

Util.list.slit = Array::slice
Util.list.sort = (k) -> # creates a new sort function based off some field
  (A, B) ->
    return 0  if not A or not B
    A = A[k]
    B = B[k]
    if A < B
      -1
    else if A > B
      1
    else
      0

Util.list.map = (l, c, _) ->
  Util.obj.map l, c, _

Util.list.index = 1 # change this to 0 if you want non-logical, non-mathematical, non-matrix, non-convenient array notation
Util.obj = {}
Util.obj.is = (o) ->
  (if (o instanceof Object and not Util.list.is(o) and not Util.fns.is(o)) then true else false)

Util.obj.del = (o, k) ->
  return  unless o
  o[k] = null
  delete o[k]

  true

Util.obj.ify = (o) ->
  return o  if Util.obj.is(o)
  try
    o = JSON.parse(o)
  catch e
    o = {}
  o

Util.obj.copy = (o) -> # because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
  (if not o then o else JSON.parse(JSON.stringify(o))) # is shockingly faster than anything else, and our data has to be a subset of JSON anyways!

Util.obj.has = (o, t) ->
  o and Object::hasOwnProperty.call(o, t)

Util.obj.empty = (o, n) ->
  return true  unless o
  (if Util.obj.map(o, (v, i) ->
    return  if n and (i is n or (Util.obj.is(n) and Util.obj.has(n, i)))
    true  if i
  ) then false else true)

Util.obj.map = (l, c, _) ->
  u = undefined
  i = 0
  ii = 0
  x = undefined
  r = undefined
  rr = undefined
  f = Util.fns.is(c)
  t = (k, v) ->
    if v isnt u
      rr = rr or {}
      rr[k] = v
      return
    rr = rr or []
    rr.push k

  if Util.list.is(l)
    x = l.length
    while i < x
      ii = (i + Util.list.index)
      if f
        r = (if _ then c.call(_, l[i], ii, t) else c(l[i], ii, t))
        return r  if r isnt u
      else

#if(Util.test.is(c,l[i])){ return ii } // should implement deep equality testing!
        return ii  if c is l[i] # use this for now
      i++
  else
    for i of l
      if f
        if Util.obj.has(l, i)
          r = (if _ then c.call(_, l[i], i, t) else c(l[i], i, t))
          return r  if r isnt u
      else

#if(a.test.is(c,l[i])){ return i } // should implement deep equality testing!
        return i  if c is l[i] # use this for now
  (if f then rr else (if Util.list.index then 0 else -1))

Util.time = {}
Util.time.is = (t) ->
  (if t then t instanceof Date else (+new Date().getTime()))

Util.time.now = (t) ->
  ((if (t = t or Util.time.is()) > (Util.time.now.last or -Infinity) then (Util.time.now.last = t) else Util.time.now(t + 1))) + (Util.time.now.drift or 0)
Gun._ =
  soul: "#"
  meta: "_"
  HAM: ">"

((Gun) ->
  Util Gun
  Gun.version = 0.2
  Gun.is = (gun) ->
    (if (gun instanceof Gun) then true else false)

  Gun.is.value = (v) ->
    return true  if v is null
    return false  if v is Infinity
    return true  if Gun.bi.is(v) or Gun.num.is(v) or Gun.text.is(v)
    Gun.is.soul(v) or false

  Gun.is.value.as = (v) ->
    (if Gun.is.value(v) then v else null)

  Gun.is.soul = (v) ->
    if Gun.obj.is(v)
      id = undefined
      Gun.obj.map v, (soul, field) ->
        return id = false  if id
        if field is Gun._.soul and Gun.text.is(soul)
          id = soul
        else
          id = false

      return id  if id
    false

  Gun.is.soul.on = (n) ->
    (n and n._ and n._[Gun._.soul]) or false

  Gun.is.node = (node, cb, t) ->
    soul = undefined
    return false  unless Gun.obj.is(node)
    if soul = Gun.is.soul.on(node)
      return not Gun.obj.map(node, (value, field) ->
        return  if field is Gun._.meta
        return true  unless Gun.is.value(value)
        cb.call t, value, field, node._, soul  if cb
      )
    false

  Gun.is.graph = (graph, cb, fn, t) ->
    exist = false
    return false  unless Gun.obj.is(graph)
    not Gun.obj.map(graph, (node, soul) ->
      return true  if not node or soul isnt Gun.is.soul.on(node) or not Gun.is.node(node, fn)
      (cb or ->
      ).call t, node, soul, (fn) ->
        Gun.is.node node, fn, t  if fn

      exist = true
    ) and exist

  Gun.union = (gun, prime, cb) ->
    ctx =
      count: 0
      cb: ->
        cb = (if cb then cb() and null else null)

    ctx.graph = gun.__.graph
    ctx.err = err: Gun.log("No graph!")  unless ctx.graph
    ctx.err = err: Gun.log("No data to merge!")  unless prime
    if ctx.soul = Gun.is.soul.on(prime)
      ctx.tmp = {}
      ctx.tmp[ctx.soul] = prime
      prime = ctx.tmp
    Gun.is.graph prime, null, (val, field, meta) ->
      ctx.err = err: Gun.log("No state on " + field + "!")  if not meta or not (meta = meta[Gun._.HAM]) or not Gun.num.is(meta[field])

    return ctx  if ctx.err
    (union = (graph, prime) ->
      ctx.count += 1
      Gun.obj.map prime, (node, soul) ->
        soul = Gun.is.soul.on(node)
        return  unless soul
        ctx.count += 1
        vertex = graph[soul]
        unless vertex
          Gun.on("union").emit gun, graph[soul] = node
          gun.__.on("union").emit node
          gun.__.on(soul).emit node
          ctx.count -= 1
          return
        Gun.HAM(vertex, node, ->
        , (vertex, field, value) ->
          return  unless vertex
          change = {}
          change._ = change._ or {}
          change._[Gun._.soul] = Gun.is.soul.on(vertex)
          if field
            change._[Gun._.HAM] = change._[Gun._.HAM] or {}
            vertex[field] = change[field] = value
            (vertex._[Gun._.HAM] = vertex._[Gun._.HAM] or {})[field] = change._[Gun._.HAM][field] = node._[Gun._.HAM][field]
          Gun.on("union").emit gun, change
          gun.__.on("union").emit change
          gun.__.on(Gun.is.soul.on(change)).emit change
        , ->
        ) ->
          ctx.cb()  unless ctx.count -= 1


      ctx.count -= 1
    ) ctx.graph, prime
    ctx.cb()  unless ctx.count
    ctx

  Gun.union.pseudo = (soul, graph, vertex) ->
    c = 0
    s = undefined
    ((vertex = vertex or {})._ = {})[Gun._.soul] = soul
    Gun.is.graph graph, (node, ss) ->
      c += 1
      s = ss
      Gun.HAM vertex, node, (->
      ), ((vertex, field, value) ->
        (vertex._[Gun._.HAM] = vertex._[Gun._.HAM] or {})[field] = (node._[Gun._.HAM] = node._[Gun._.HAM] or {})[field]
        vertex[field] = value
      ), ->


    return  if 1 is c
    vertex

  Gun.HAM = (vertex, delta, lower, now, upper) ->
    HAM = (machineState, incomingState, currentState, incomingValue, currentValue) ->
      return amnesiaQuarantine: true  if machineState < incomingState
      return quarantineState: true  if incomingState < currentState
      if currentState < incomingState
        return (
          converge: true
          incoming: true
        )
      if incomingState is currentState
        return state: true  if incomingValue is currentValue
        if String(incomingValue) < String(currentValue)
          return (
            converge: true
            current: true
          )
        if String(currentValue) < String(incomingValue)
          return (
            converge: true
            incoming: true
          )
      err: "you have not properly handled recursion through your data or filtered it as JSON"
    upper.max = -Infinity
    now.end = true
    Gun.obj.map delta, update = (incoming, field) ->
      return  if field is Gun._.meta
      now.end = false
      ctx =
        incoming: {}
        current: {}

      state = undefined
      ctx.drift = Gun.time.now()
      ctx.incoming.value = Gun.is.soul(incoming) or incoming
      ctx.current.value = Gun.is.soul(vertex[field]) or vertex[field]
      ctx.incoming.state = (if Gun.num.is(ctx.tmp = ((delta._ or {})[Gun._.HAM] or {})[field]) then ctx.tmp else -Infinity)
      ctx.current.state = (if Gun.num.is(ctx.tmp = ((vertex._ or {})[Gun._.HAM] or {})[field]) then ctx.tmp else -Infinity)
      upper.max = (if ctx.incoming.state > upper.max then ctx.incoming.state else upper.max)
      state = HAM(ctx.drift, ctx.incoming.state, ctx.current.state, ctx.incoming.value, ctx.current.value)
      if state.err
        root.console.log ".!HYPOTHETICAL AMNESIA MACHINE ERR!.", state.err
        return
      if state.state or state.quarantineState or state.current
        lower.call state, vertex, field, incoming
        return
      if state.incoming
        now.call state, vertex, field, incoming
        return
      if state.amnesiaQuarantine
        upper.wait = true
        upper.call state, vertex, field, incoming
        Gun.schedule ctx.incoming.state, ->
          update incoming, field
          if ctx.incoming.state is upper.max
            (upper.last or ->
            )()


    now.call {}, vertex  if now.end
    (fn) ->
      upper.last = fn or ->

      upper.last()  unless upper.wait

  Gun.on = (->
    On = (where) ->
      (if where then (On.event = On.event or On.create())(where) else On.create())
    On.is = (on_) ->
      (if (On instanceof on_) then true else false)

    On.create = ->
      chain = new On.chain()
      chain.$ = (where) ->
        chain.where = where
        chain

    On.sort = Gun.list.sort("i")
    On.chain = (->
      Chain = ->
        new Chain()  unless this instanceof Chain
      Chain.chain = Chain::
      Chain.chain.emit = (what) ->
        me = this
        where = me.where
        args = arguments
        on_ = (me._ = me._ or {})[where] = me._[where] or []
        Gun.obj.del on_, where  unless me._[where] = Gun.list.map(on_, (hear, i, map) ->
          return  if not hear or not hear.as
          map hear
          hear.as.apply hear, args
        )

      Chain.chain.event = (as, i) ->
        return  unless as
        me = this
        where = me.where
        args = arguments
        on_ = (me._ = me._ or {})[where] = me._[where] or []
        e =
          as: as
          i: i or 0
          off: ->
            not (e.as = false)

        on_.push(e)
        on_.sort(On.sort)
        e

      Chain.chain.once = (as, i) ->
        me = this
        once = ->
          @off()
          as.apply this, arguments

        me.event once, i

      Chain
      ())
    On
    ())
  Gun.roulette = (l, c) ->
    gun = (if Gun.is(this) then this else {})
    if gun._ and gun.__.opt and gun.__.opt.uuid
      return gun.__.opt.uuid(l, c)  if Gun.fns.is(gun.__.opt.uuid)
      l = l or gun.__.opt.uuid.length
    Gun.text.random l, c
) Gun
((Chain) ->
  Chain.opt = (opt, stun) ->
    gun = this
    gun._ = gun._ or {}
    gun.__ = gun.__ or {}
    opt = opt or {}
    gun.__.opt = gun.__.opt or {}
    gun.__.flag = gun.__.flag or
      start: {}
      end: {}

    gun.__.key = gun.__.key or
      s: {}
      ed: {}

    gun.__.graph = gun.__.graph or {}
    gun.__.on = gun.__.on or Gun.on.create()
    gun.__.meta = gun.__.meta or (s) ->
        gun.__.meta[s] = gun.__.meta[s] or {}

    opt = peers: opt  if Gun.text.is(opt)
    opt = peers: opt  if Gun.list.is(opt)
    opt.peers = [ opt.peers ]  if Gun.text.is(opt.peers)
    if Gun.list.is(opt.peers)
      opt.peers = Gun.obj.map(opt.peers, (n, f, m) ->
        m n, {}
      )
    gun.__.opt.peers = opt.peers or gun.__.opt.peers or {}
    gun.__.opt.uuid = opt.uuid or gun.__.opt.uuid or {}
    gun.__.opt.cb = gun.__.opt.cb or ->

    gun.__.opt.hooks = gun.__.opt.hooks or {}
    Gun.obj.map opt.hooks, (h, f) ->
      return  unless Gun.fns.is(h)
      gun.__.opt.hooks[f] = h

    Gun.on("opt").emit gun, opt  unless stun
    gun

  Gun.chain.chain = (from) ->
    from = from or this
    gun = Gun(from)
    gun.back = from
    gun.__ = from.__
    gun._ = on: Gun.on.create()
    gun._.at = (e) ->
      proxy = (cb, i, chain) ->
        on_ = gun._.on(e)
        at = undefined
        if at = ((on_ = gun._.on(e)).e = on_.e or {})[e]
          setTimeout (->
            cb.call on_, at
          ), 0
        on_[chain] ((at) ->
          cb.call on_, at
        ), i

      proxy.event = (cb, i) ->
        proxy cb, i, "event"

      proxy.once = (cb, i) ->
        proxy cb, i, "once"

      proxy.emit = (at, on_) ->
        ((on_ = gun._.on(e)).e = on_.e or {})[e] = at
        gun._.on(e).emit at

      proxy

    gun

  Chain.get = (key, cb, opt) ->
    load = (key) ->
      if Gun.fns.is(ctx.hook = gun.__.opt.hooks.get)
        ctx.hook key, ((err, data) ->
          console.log "chain.get ", key, "from hook", err, data, "\n"
          return cb.call(gun, err, null)  if err
          unless data
            return  if ctx.data
            cb.call gun, null, null
            return gun.__.flag.end[ctx.key or ctx.soul] = gun.__.flag.end[ctx.key or ctx.soul] or ($) ->
                delete gun.__.flag.end[ctx.key or ctx.soul]

                gun._.at("soul").emit $

            gun._.at("null").emit(
              key: ctx.key
              soul: ctx.soul
              GET: "NULL"
            )
          dat = ctx.data = {}
          return cb.call(gun, null, data)  if Gun.obj.empty(data)
          unless Gun.is.graph(data, (node, soul, map) ->
            return cb.call(gun, err, data)  if err = Gun.union(gun, node).err
            (gun.__.key.s[ctx.key] = gun.__.key.s[ctx.key] or {})[soul] = gun.__.graph[soul]  if ctx.key
            gun._.at("soul").emit
            soul: soul
            key: ctx.key
            GET: "SOUL"

          )
            return cb.call(gun,
              err: Gun.log("Not a valid graph!")
            , data)
          cb.call gun, null, data
        ), opt
      else
        console.Log "Warning! You have no persistence layer to get from!"
        cb.call gun, null, null
        gun._.at("null").emit
          key: ctx.key
          GET: "NULL"

    gun = @chain()
    ctx = {}
    unless key
      return cb.call(gun,
        err: Gun.log("No key or relation to get!")
      )
      gun
    ctx.key = Gun.text.is(key) and key
    ctx.soul = Gun.is.soul(key)
    cb = cb or ->

    opt = opt or {}
    if opt.force
      load key
    else if ctx.soul
      if ctx.node = gun.__.graph[ctx.soul]
        (ctx.graph = {})[ctx.soul] = ctx.node
        cb.call gun, null, Gun.obj.copy(ctx.graph)
        (ctx.graph = {})[ctx.soul] = Gun.union.pseudo(ctx.soul)
        cb.call gun, null, ctx.graph
        cb.call gun, null, {}
      else
        load key
      ctx.node = gun.__.graph[ctx.soul] = gun.__.graph[ctx.soul] or Gun.union.pseudo(ctx.soul)
      gun._.at("soul").emit
        soul: ctx.soul
        GET: "SOUL"

    else if ctx.key
      get = (soul) ->
        graph = gun.__.key.s[ctx.key]
        end = {}
        Gun.is.graph graph, (node, soul) ->
          end[soul] = Gun.union.pseudo(soul)
          gun._.at("soul").emit
            soul: soul
            key: ctx.key
            GET: "SOUL"


        cb.call gun, null, Gun.obj.copy(graph)
        cb.call gun, null, end
        cb.call gun, null, {}
      if gun.__.key.s[ctx.key]
        get()
      else if ctx.flag = gun.__.flag.start[ctx.key]
        ctx.flag.once get
      else
        load key
    else
      cb.call gun,
        err: Gun.log("No key or relation to get!")

    gun

  Chain.key = (key, cb, opt) ->
    index = ($) ->
      if Gun.fns.is(ctx.hook = gun.__.opt.hooks.key)
        ctx.hook key, $.soul, ((err, data) ->
          cb.call gun, err, data
        ), opt
      else
        console.Log "Warning! You have no key hook!"
        cb.call gun, null
    gun = this
    ctx = {}
    unless key
      return cb.call(gun,
        err: Gun.log("No key!")
      )
      gun
    gun = gun.chain()  unless gun.back
    console.Log "Warning! Key already used!"  if gun.__.key.s[key]
    cb = cb or ->

    opt = (if Gun.text.is(opt) then soul: opt else opt or {})
    opt.soul = opt.soul or opt[Gun._.soul]
    if opt.soul
      ((gun.__.graph[opt.soul] = {})._ = {})[Gun._.soul] = opt.soul  unless gun.__.graph[opt.soul]
      (gun.__.key.s[key] = gun.__.key.s[key] or {})[opt.soul] = gun.__.graph[opt.soul]
      gun.__.flag.end[key] soul: opt.soul  if gun.__.flag.end[key]
      index soul: opt.soul
    else
      (gun.__.flag.start[key] = gun._.at("soul")).once (($) ->
        console.log "chain.key", key, "\n"
        (gun.__.key.s[key] = gun.__.key.s[key] or {})[$.soul] = gun.__.graph[$.soul]
        delete gun.__.flag.start[key]
      ), -1
      gun._.at("soul").event index
    gun

  Chain.all = (key, cb) ->
    gun = @chain()
    return gun
    cb = cb or ->

    gun.shot.next (next) ->
      Gun.obj.map gun.__.key.s, (node, key) ->
        if node = Gun.is.soul.on(node)
          (cb.vode = cb.vode or {})[key] = {}
          cb.vode[key][Gun._.soul] = node

      if cb.vode
        gun._.node = cb.vode
        cb.call(gun, null, Gun.obj.copy(gun._.node))
        next()
      else if Gun.fns.is(gun.__.opt.hooks.all)
        gun.__.opt.hooks.all (err, data) ->

      else
        console.Log "Warning! You have no all hook!"
        cb.call(gun)
        next()

    gun

  Chain.path = (path, cb, opt) ->
    gun = @chain()
    cb = cb or ->

    opt = opt or {}
    unless Gun.text.is(path = (if Gun.text.is(path) then path or null else (if Gun.num.is(path) then (path + "") else (if Gun.list.is(path) then path.join(".") else path))))
      return cb.call(gun,
        err: Gun.log("Invalid path '" + path + "'!")
      )
      gun
    unless gun.back._.at
      return cb.call(gun,
        err: Gun.log("No context!")
      )
      gun
    gun.back.on (($, node) ->
      return  unless node = node or gun.__.graph[$.soul]
      chain = this or gun
      src = opt.src or gun
      ctx = path: path.split(".")
      field = Gun.text.ify(ctx.path.shift())
      val = node[field]
      soul = Gun.is.soul(val)
      if not field and not ctx.path.length
        cb.call chain, null, node, field
        return (if opt.step then src._.at("soul").emit(
          soul: $.soul
          field: null
          from: opt.step.soul
          at: opt.step.field
          gun: chain
          PATH: "SOUL"
        ) else src._.at("soul").emit(
          soul: $.soul
          field: null
          gun: chain
          PATH: "SOUL"
        ))
      unless Gun.obj.has(node, field)
        if opt.end or (not ctx.path.length and gun.__.meta($.soul).end)
          cb.call chain, null, null, field
          src._.at("null").emit
            soul: $.soul
            field: field
            gun: chain
            PATH: "NULL"

        return
      if soul
        return gun.get(val, (err, data) ->
          cb.call chain, err  if err
        ).path(ctx.path, cb,
          src: src
          step:
            soul: $.soul
            field: field

          path: path
        )
      cb.call chain, null, val, field
      src._.at("soul").emit
        soul: $.soul
        field: field
        gun: chain
        PATH: "SOUL"

    ),
      raw: true

    gun

  Chain.val = (->
    Gun.on("union").event (gun, data, end) ->
      return  unless Gun.obj.empty(data, Gun._.meta)
      (end = gun.__.meta(Gun.is.soul.on(data))).end = (end.end or 0) + 1
      gun.__.on(Gun.is.soul.on(data) + ".end").emit data

    (cb, opt) ->
      gun = this
      ctx = {}
      args = Array::slice.call(arguments)
      cb = (if Gun.fns.is(cb) then cb else (val, field) ->
        root.console.log.apply root.console, args.concat([ field and (field += ":"), val ])
      )
      opt = opt or {}
      gun.on (($, delta, on_) ->
        node = gun.__.graph[$.soul]
        return ctx[$.soul + ".end"](node, $)  if ctx[$.soul + ".end"]
        ctx[$.soul + ".end"] = (data, $$) ->
          $$ = $$ or $
          soul = undefined
          field = undefined
          if not $$.field and $$.from
            soul = $$.from
            field = $$.at
          else
            soul = $$.soul
            field = $$.field or ""
          hash = soul + field
          node = gun.__.graph[$$.soul] or data or node
          node = Gun.union.pseudo($.key, gun.__.key.s[$.key]) or node  if $$.key
          if $$.field
            return  if not Gun.obj.has(node, $$.field) or ctx[hash] or Gun.is.soul(node[$$.field])
            ctx[hash] = true
            return cb.call($$.gun or gun, node[$$.field], $$.field)
          return  if not gun.__.meta($$.soul).end or (ctx[hash] or ($$.key and ctx[$$.key]))
          ctx[hash] = ctx[$$.soul] = ctx[$$.key] = true
          cb.call $$.gun or gun, Gun.obj.copy(node), field

        return ctx[$.soul + ".end"](node, $)  if not $.field or Gun.obj.has(node, $.field)  if gun.__.meta($.soul).end
        gun.__.on($.soul + ".end").event ctx[$.soul + ".end"]
      ),
        raw: true

      gun
    ())
  Chain.on = (cb, opt) ->
    gun = this
    ctx = {}
    opt = (if Gun.obj.is(opt) then opt else change: opt)
    cb = cb or ->

    gun._.at("soul").event ($) ->
      if ctx[$.soul]
        ctx[$.soul].call this, gun.__.graph[$.soul], $  if opt.raw
      else
        (ctx[$.soul] = (delta, $$) ->
          $$ = $$ or $
          node = gun.__.graph[$$.soul]
          soul = undefined
          return  if delta and $$.soul isnt Gun.is.soul.on(delta)
          if $$.field and (soul = Gun.is.soul(node[$$.field]))
            (ctx[$$.soul + $$.field] or off: ->
            ).off()
            ctx[$$.soul + $$.field] = gun.__.on(soul).event((delta) ->
              ctx[$$.soul] delta,
                soul: soul
                field: null
                from: $$.soul
                at: $$.field

            )
            return
          return cb.call($$.gun or gun, $$, delta, this)  if opt.raw
          return  if not opt.end and Gun.obj.empty(delta, Gun._.meta)
          node = Gun.union.pseudo($.key, gun.__.key.s[$.key]) or node  if $$.key
          node = delta or node  if opt.change
          cb.call $$.gun or gun, Gun.obj.copy((if $$.field then node[$$.field] else node)), $$.field or $$.at
        ).call this, gun.__.graph[$.soul], $
        gun.__.on($.soul).event ctx[$.soul]  unless opt.once

    gun

  Chain.put = (val, cb, opt) ->
    gun = @chain()
    call = ($) ->
      gun.back._.at("soul").emit
        soul: $.soul or Gun.is.soul.on(val) or Gun.roulette.call(gun)
        field: $.field
        empty: true
        gun: $.gun
        PUT: "SOUL"


    drift = Gun.time.now()
    cb = cb or ->

    opt = opt or {}
    unless gun.back.back
      gun = gun.chain()
      call {}
    if gun.back.not
      gun.back.not call,
        raw: true

    gun.back._.at("soul").event ($) ->
      chain = $.gun or gun
      ctx = {}
      obj = val
      $ = Gun.obj.copy($)
      hash = (if $.field then $.soul + $.field else ((if $.from then $.from + ($.at or "") else $.soul)))
      return  if call[hash]
      call[hash] = true
      console.log "chain.put", val, "\n"
      if Gun.is.value(obj)
        if $.from and $.at
          $.soul = $.from
          $.field = $.at
        unless $.field
          return cb.call(gun,
            err: Gun.log("No field exists for " + (typeof obj) + "!")
          )
        else if gun.__.graph[$.soul]
          ctx.tmp = {}
          ctx.tmp[ctx.field = $.field] = obj
          obj = ctx.tmp
        else
          return cb.call(gun,
            err: Gun.log("No node exists to put " + (typeof obj) + " in!")
          )
      if Gun.obj.is(obj)
        if $.field and not ctx.field
          ctx.tmp = {}
          ctx.tmp[ctx.field = $.field] = obj
          obj = ctx.tmp
        Gun.ify(obj, (env, cb) ->
          at = undefined
          return  if not env or not (at = env.at) or not env.at.node
          at.node._ = {}  unless at.node._
          unless Gun.is.soul.on(at.node)
            if obj is at.obj
              env.graph[at.node._[Gun._.soul] = at.soul = $.soul] = at.node
              cb at, at.soul
            else
              path = (err, data) ->
                return  if at.soul
                at.soul = Gun.is.soul.on(data) or Gun.is.soul.on(at.obj) or Gun.roulette.call(gun)
                env.graph[at.node._[Gun._.soul] = at.soul] = at.node
                cb at, at.soul
              (if ($.empty and not $.field) then path() else chain.back.path(at.path or [], path,
                once: true
                end: true
              ))
          at.node._[Gun._.HAM] = {}  unless at.node._[Gun._.HAM]
          return  unless at.field
          at.node._[Gun._.HAM][at.field] = drift
        ) (err, ify) ->
          console.log "chain.put PUT <----", ify.graph, "\n"
          return cb.call(gun, err or ify.err)  if err or ify.err
          return cb.call(gun, err)  if err = Gun.union(gun, ify.graph).err
          if $.from = Gun.is.soul(ify.root[$.field])
            $.soul = $.from
            $.field = null
          Gun.obj.map ify.graph, (node, soul) ->
            Gun.union gun, Gun.union.pseudo(soul)

          gun._.at("soul").emit
            soul: $.soul
            field: $.field
            key: $.key
            PUT: "SOUL"
            WAS: "ON"

          if Gun.fns.is(ctx.hook = gun.__.opt.hooks.put)
            ctx.hook ify.graph, ((err, data) ->
              return cb.call(gun, err)  if err
              cb.call gun, null, data
            ), opt
          else
            console.Log "Warning! You have no persistence layer to save to!"
            cb.call gun, null


    gun

  Chain.map = (cb, opt) ->
    gun = @chain()
    ctx = {}
    opt = ((if Gun.obj.is(opt) then opt else ((if opt then node: true else {}))))
    cb = cb or ->

    gun.back.on ((node) ->
      soul = Gun.is.soul.on(node)
      console.log "chain.map", node, "\n"
      Gun.is.node node, ((val, field) ->
        s = Gun.is.soul(val)
        if s
          ctx[s] = gun.get(val).on((d, f) ->
            cb.call this, d, f or field
            gun._.at("soul").emit
              soul: s
              field: null
              from: soul
              at: field
              MAP: "SOUL"
              gun: this

          )
        else
          return  if opt.node
          cb.call this, val, field
          gun._.at("soul").emit
            soul: soul
            field: field
            MAP: "SOUL"

      ), this or gun
    ), true
    gun

  Chain.set = (val, cb, opt) ->
    gun = this
    ctx = {}
    drift = Gun.text.ify(Gun.time.now() or 0).replace(".", "D")
    cb = cb or ->

    opt = opt or {}
    gun = gun.put({})  unless gun.back
    gun = gun.not((key) ->
      (if key then @put({}).key(key) else @put({}))
    )
    return gun  if not val and not Gun.is.value(val)
    obj = {}
    index = "I" + drift + "R" + Gun.text.random(5)
    obj[index] = val
    (if Gun.is.value(val) then gun.put(obj, cb) else gun.put(obj, cb).path(index))

  Chain.not = (cb, opt) ->
    gun = this
    ctx = {}
    cb = cb or ->

    opt = opt or {}
    gun._.at("null").once ($) ->
      return  if $.key and ($.soul or gun.__.key.s[$.key])
      return  if $.field and Gun.obj.has(gun.__.graph[$.soul], $.field)
      kick = (next) ->
        return Gun.log("Warning! Multiple `not` resumes!")  if ++c
        next._.at("soul").once ($) ->
          $.N0T = "KICK SOUL"
          gun._.at("soul").emit $


      chain = gun.chain()
      next = cb.call(chain, (if opt.raw then $ else ($.field or $.key)), kick)
      c = -1
      kick next  if Gun.is(next)
      gun.__.graph[kick.soul = $.soul or Gun.roulette.call(chain)] = gun.__.graph[kick.soul] or Gun.union.pseudo(kick.soul)
      chain._.at("soul").emit
        soul: kick.soul
        empty: true
        key: $.key
        field: $.field
        N0T: "SOUL"
        WAS: "ON"


    gun

  Chain.err = (dud) ->
    @_.err = (if Gun.fns.is(dud) then dud else ->
    )
    this
) Gun.chain = Gun::
((schedule) -> # maybe use lru-cache
  schedule.waiting = []
  schedule.soonest = Infinity
  schedule.sort = Gun.list.sort("when")
  schedule.set = (future) ->
    return  if Infinity <= (schedule.soonest = future)
    now = Gun.time.now() # WAS time.is() TODO: Hmmm, this would make it hard for every gun instance to have their own version of time.
    future = (if (future <= now) then 0 else (future - now))
    clearTimeout schedule.id
    schedule.id = setTimeout(schedule.check, future)

  schedule.check = ->
    now = Gun.time.now() # WAS time.is() TODO: Same as above about time. Hmmm.
    soonest = Infinity
    schedule.waiting.sort schedule.sort
    schedule.waiting = Gun.list.map(schedule.waiting, (wait, i, map) ->
        return  unless wait
        if wait.when <= now
          if Gun.fns.is(wait.event)
            setTimeout (->
              wait.event()
            ), 0
        else
          soonest = (if (soonest < wait.when) then soonest else wait.when)
          map wait
      ) or []
    schedule.set soonest

  Gun.schedule = (state, cb) ->
    schedule.waiting.push
      when: state
      event: cb or ->

    return  if schedule.soonest < state
    schedule.set state
) {}
Gun.ify = ((Serializer) ->
  ify = (data, cb, opt) ->
    opt = opt or {}
    cb = cb or (env, cb) -> # TODO: refactor Gun.roulette
        cb env.at, Gun.roulette()

    end = (fn) ->
      ctx.end = fn or ->

      if ctx.err
        return ctx.end(ctx.err, ctx)
        ctx.end = ->
      unique ctx

    ctx =
      at:
        path: []
        obj: data

      root: {}
      graph: {}
      queue: []
      seen: []
      loop: true

    unless data
      return ctx.err = Gun.log("Serializer does not have correct parameters.")
      end
    ctx.at.node = ctx.root
    while ctx.loop and not ctx.err
      seen ctx, ctx.at
      map ctx, cb
      if ctx.queue.length
        ctx.at = ctx.queue.shift()
      else
        ctx.loop = false
    end
  map = (ctx, cb) ->
    rel = (at, soul) ->
      at.soul = at.soul or soul
      Gun.list.map at.back, (rel) ->
        rel[Gun._.soul] = at.soul

      unique ctx # could we remove the setTimeot?

    it = undefined
    Gun.obj.map ctx.at.obj, (val, field) ->
      ctx.at.val = val
      ctx.at.field = field
      it = cb(ctx, rel) or true
      if field is Gun._.meta
        ctx.at.node[field] = Gun.obj.copy(val) # TODO: BUG! Is this correct?
        return
      # TODO: BUG! Do later for ACID "consistency" guarantee.
      return ctx.err = err: Gun.log("Invalid field name on " + ctx.at.path.join("."))  if false and notValidField(field)
      unless Gun.is.value(val)
        at =
          obj: val
          node: {}
          back: []
          path: [ field ]

        tmp = {}
        was = undefined
        at.path = (ctx.at.path or []).concat(at.path or [])
        return ctx.err = err: Gun.log("Invalid value at " + at.path.join(".") + "!")  unless Gun.obj.is(val)
        if was = seen(ctx, at)
          tmp[Gun._.soul] = Gun.is.soul.on(was.node) or null
          (was.back = was.back or []).push ctx.at.node[field] = tmp
        else
          ctx.queue.push at
          tmp[Gun._.soul] = null
          at.back.push ctx.at.node[field] = tmp
      else
        ctx.at.node[field] = Gun.obj.copy(val)

    cb ctx, rel  unless it
  unique = (ctx) ->
    if ctx.err or not Gun.list.map(ctx.seen, (at) ->
      true  unless at.soul
    ) and not ctx.loop
      ctx.end(ctx.err, ctx)
      ctx.end = ->
  seen = (ctx, at) ->
    Gun.list.map(ctx.seen, (has) ->
      has  if at.obj is has.obj
    ) or (ctx.seen.push(at) and false)
  ify
  ({}))
window.Gun = Gun  if typeof window isnt "undefined"
module.exports = Gun  if typeof module isnt "undefined" and module.exports
root = this or {} # safe for window, global, root, and 'use strict'.
root.console = root.console or log: (s) -> # safe for old browsers
    s

console =
  log: Gun.log = (s) ->
    (Gun.log.verbose and root.console.log.apply(root.console, arguments))
    s

  Log: (s) ->
    (not Gun.log.squelch and root.console.log.apply(root.console, arguments))
    s
) {}
((tab) ->
  return  unless @Gun
  throw new Error("Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js")  unless window.JSON # for old IE use
  Gun.on("opt").event (gun, opt) ->
    opt = opt or {}
    tab = gun.tab = gun.tab or {}
    tab.store = tab.store or store
    tab.request = tab.request or request
    tab.headers = opt.headers or {}
    tab.headers["gun-sid"] = tab.headers["gun-sid"] or Gun.text.random() # stream id
    tab.prefix = tab.prefix or opt.prefix or "gun/"
    tab.prekey = tab.prekey or opt.prekey or ""
    tab.prenode = tab.prenode or opt.prenode or "_/nodes/"
    tab.get = tab.get or (key, cb, opt) ->
        return  unless key
        cb = cb or ->

        cb.GET = true
        (opt = opt or {}).url = opt.url or {}
        opt.headers = Gun.obj.copy(tab.headers)
        if Gun.is.soul(key)
          opt.url.query = key
        else
          opt.url.pathname = "/" + key
        getPrefix = (if (opt.prefix) then opt.prefix else tab.prefix) # allows users to provide a prefix for the get operation
        Gun.log "tab get --->", key
        (local = (key, cb) ->
          path = (if (path = Gun.is.soul(key)) then getPrefix + tab.prenode + path else getPrefix + tab.prekey + key)
          node = tab.store.get(path)
          graph = undefined
          soul = undefined
          if Gun.is.node(node)
            (cb.graph = cb.graph or {})[soul = Gun.is.soul.on(node)] = (graph = {})[soul] = cb.node = node
            cb null, graph
            (graph = {})[soul] = Gun.union.pseudo(soul) # end.
            cb null, graph
          else if Gun.obj.is(node)
            Gun.obj.map node, (rel) ->
              local rel, cb  if Gun.is.soul(rel)

            cb null, {}
        ) key, cb
        unless cb.local = opt.local
          Gun.obj.map opt.peers or gun.__.opt.peers, (peer, url) ->
            p = {}
            tab.request url, null, tab.error(cb, "Error: Get failed through " + url, (reply) ->
              if not p.graph and not Gun.obj.empty(cb.graph) # if we have local data
                tab.put p.graph = cb.graph, ((e, r) -> # then sync it if we haven't already
                  Gun.log "Stateless handshake sync:", e, r
                ),
                  peers: tab.peers(url) # to the peer. // TODO: This forces local to flush again, not necessary.

              unless Gun.is.soul(key)
                Gun.is.graph reply.body or gun.__.key.s[key], (node, soul) -> # make sure for each received node or nodes of our key
                  tab.key key, soul, -> # that the key points to it.


              setTimeout (-> # and flush the in memory nodes of this graph to localStorage after we've had a chance to union on it.
                tab.put reply.body, (->
                ),
                  local: true

              ), 1
            ), opt
            cb.peers = true

        tab.peers cb

    tab.put = tab.put or (graph, cb, opt) ->
        cb = cb or ->

        opt = opt or {}
        putPrefix = (if (opt.prefix) then opt.prefix else tab.prefix) # allows users to provide a prefix for the put operation
        Gun.is.graph graph, (node, soul) ->
          gun.__.on(soul).emit node  unless opt.local # TODO: Should this be in core?
          return  unless gun.__.graph[soul]
          tab.store.put putPrefix + tab.prenode + soul, gun.__.graph[soul]

        unless cb.local = opt.local
          Gun.obj.map opt.peers or gun.__.opt.peers, (peer, url) ->
            tab.request url, graph, tab.error(cb, "Error: Put failed on " + url),
              headers: tab.headers

            cb.peers = true

        tab.peers cb

    tab.key = tab.key or (key, soul, cb, opt) ->
        meta = {}
        opt = opt or {}
        cb = cb or ->

        keyPrefix = (if (opt.prefix) then opt.prefix else tab.prefix) # allows users to provide a prefix for the key operation
        meta[Gun._.soul] = soul = Gun.is.soul(soul) or soul
        return cb(err: Gun.log("No soul!"))  unless soul
        ((souls) ->
          (souls = tab.store.get(keyPrefix + tab.prekey + key) or {})[soul] = meta
          tab.store.put keyPrefix + tab.prekey + key, souls
        )()
        unless cb.local = opt.local or opt.soul
          Gun.obj.map opt.peers or gun.__.opt.peers, (peer, url) ->
            tab.request url, meta, tab.error(cb, "Error: Key failed to be made on " + url),
              url:
                pathname: "/" + key

              headers: tab.headers

            cb.peers = true

        tab.peers cb

    tab.error = (cb, error, fn) ->
      (err, reply) ->
        reply.body = reply.body or reply.chunk or reply.end or reply.write
        return cb(err: Gun.log(err or error))  if err or not reply or (err = reply.body and reply.body.err)
        fn reply  if fn
        cb null, reply.body

    tab.peers = (cb, o) ->
      if Gun.text.is(cb)
        return (o = {})[cb] = {}
        o
      if cb and not cb.peers
        setTimeout (->
          console.log "Warning! You have no peers to connect to!"  unless cb.local
          cb()  unless cb.graph or cb.node
        ), 1

    tab.server = tab.server or (req, res) ->
        return  if not req or not res or not req.url or not req.method
        req.url = (if req.url.href then req.url else document.createElement("a"))
        req.url.href = req.url.href or req.url
        req.url.key = (req.url.pathname or "").replace(tab.server.regex, "").replace(/^\//i, "") or ""
        req.method = (if req.body then "put" else "get")
        return tab.server.get(req, res)  if "get" is req.method
        tab.server.put req, res  if "put" is req.method or "post" is req.method

    tab.server.json = "application/json"
    tab.server.regex = gun.__.opt.route = gun.__.opt.route or opt.route or /^\/gun/i
    tab.server.get = ->

    tab.server.put = (req, cb) ->
      reply = headers:
        "Content-Type": tab.server.json

      unless req.body
        return cb(
          headers: reply.headers
          body:
            err: "No body"
        )

      # TODO: Re-emit message to other peers if we have any non-overlaping ones.
      return  if tab.server.put.key(req, cb)
      if Gun.is.node(req.body) or Gun.is.graph(req.body, (node, soul) ->
        gun.__.flag.end[soul] = true # TODO: Put this in CORE not in TAB driver?
      )

#console.log("tran.put", req.body);
        if req.err = Gun.union(gun, req.body, (err, ctx) ->
          if err
            return cb(
              headers: reply.headers
              body:
                err: err or "Union failed."
            )
          ctx = ctx or {}
          ctx.graph = {}
          Gun.is.graph req.body, (node, soul) ->
            ctx.graph[soul] = gun.__.graph[soul]

          gun.__.opt.hooks.put ctx.graph, ((err, ok) ->
            if err
              return cb(
                headers: reply.headers
                body:
                  err: err or "Failed."
              )
            cb
            headers: reply.headers
            body:
              ok: ok or "Persisted."

          ),
            local: true

        ).err
          cb
            headers: reply.headers
            body:
              err: req.err or "Union failed."


    tab.server.put.key = (req, cb) ->
      return  if not req or not req.url or not req.url.key or not Gun.obj.has(req.body, Gun._.soul)
      index = req.url.key
      soul = Gun.is.soul(req.body)

      #console.log("tran.key", index, req.body);
      gun.key index, ((err, reply) ->
        if err
          return cb(
            headers:
              "Content-Type": tab.server.json

            body:
              err: err
          )
        cb # TODO: Fix so we know what the reply is.
          headers:
            "Content-Type": tab.server.json

          body: reply

      ), soul
      true

    Gun.obj.map gun.__.opt.peers, -> # only create server if peers and do it once by returning immediately.
      tab.server.able = tab.server.able or tab.request.createServer(tab.server) or true

    gun.__.opt.hooks.get = gun.__.opt.hooks.get or tab.get
    gun.__.opt.hooks.put = gun.__.opt.hooks.put or tab.put
    gun.__.opt.hooks.key = gun.__.opt.hooks.key or tab.key

  store = (->
    s = ->
    store = window.localStorage or
      setItem: ->

      removeItem: ->

      getItem: ->

    s.put = (key, val) ->
      store.setItem key, Gun.text.ify(val)

    s.get = (key) ->
      Gun.obj.ify store.getItem(key) or null

    s.del = (key) ->
      store.removeItem key

    s
    ())
  request = (->
    r = (base, body, cb, opt) ->
      opt = opt or ((if base.length then base: base else base))
      opt.base = opt.base or base
      opt.body = opt.body or body
      return  unless opt.base
      r.transport opt, cb
    r.createServer = (fn) ->
      r.createServer.s.push fn

    r.createServer.ing = (req, cb) ->
      i = r.createServer.s.length
      while i--
        (r.createServer.s[i] or ->
        ) req, cb

    r.createServer.s = []
    r.transport = (opt, cb) ->

#Gun.log("TRANSPORT:", opt);
      return  if r.ws(opt, cb)
      r.jsonp opt, cb

    r.ws = (opt, cb) ->
      ws = undefined
      WS = window.WebSocket or window.mozWebSocket or window.webkitWebSocket
      return  unless WS
      if ws = r.ws.peers[opt.base]
        unless ws.readyState
          return setTimeout(->
            r.ws opt, cb
          , 10)
          true
        req = {}
        req.headers = opt.headers  if opt.headers
        req.body = opt.body  if opt.body
        req.url = opt.url  if opt.url
        req.headers = req.headers or {}
        r.ws.cbs[req.headers["ws-rid"] = "WS" + (+new Date()) + "." + Math.floor((Math.random() * 65535) + 1)] = (err, res) ->
          delete r.ws.cbs[req.headers["ws-rid"]]  if res.body or res.end
          cb err, res

        ws.send JSON.stringify(req)
        return true
      return  if ws is false
      ws = r.ws.peers[opt.base] = new WS(opt.base.replace("http", "ws"))
      ws.onopen = (o) ->
        r.ws opt, cb

      ws.onclose = window.onbeforeunload = (c) ->
        return  unless c
        ws.close()  if ws and ws.close instanceof Function
        if 1006 is c.code # websockets cannot be used
          ws = r.ws.peers[opt.base] = false
          r.transport opt, cb
          return
        ws = r.ws.peers[opt.base] = null # this will make the next request try to reconnect
        setTimeout (->
          console.log "!!!!! WEBSOCKET DICONNECTED !!!!!! ATTEMPTING INFINITE RETRY WITH NO BACKOFF !!!!!!!"
          r.ws opt, -> # opt here is a race condition, is it not? Does this matter?

        ), 50 # make this an exponential backoff.

      ws.onmessage = (m) ->
        return  if not m or not m.data
        res = undefined
        try
          res = JSON.parse(m.data)
        catch e
          return
        return  unless res
        res.headers = res.headers or {}
        if res.headers["ws-rid"]
          return (r.ws.cbs[res.headers["ws-rid"]] or ->
          )(null, res)
        Gun.log "We have a pushed message!", res
        if res.body # emit extra events.
          r.createServer.ing res, ->


      ws.onerror = (e) ->
        console.log "!!!! WEBSOCKET ERROR !!!!", e
        Gun.log e

      true

    r.ws.peers = {}
    r.ws.cbs = {}
    r.jsonp = (opt, cb) ->

#Gun.log("jsonp send", opt);
      r.jsonp.ify opt, (url) ->

#Gun.log(url);
        return  unless url
        r.jsonp.send url, ((reply) ->

#Gun.log("jsonp reply", reply);
          cb null, reply
          r.jsonp.poll opt, reply
        ), opt.jsonp


    r.jsonp.send = (url, cb, id) ->
      js = document.createElement("script")
      js.src = url
      window[js.id = id] = (res) ->
        cb res
        cb.id = js.id
        js.parentNode.removeChild js
        window[cb.id] = null # TODO: BUG: This needs to handle chunking!
        try
          delete window[cb.id]

      js.async = true
      document.getElementsByTagName("head")[0].appendChild js
      js

    r.jsonp.poll = (opt, res) ->
      return  if not opt or not opt.base or not res or not res.headers or not res.headers.poll
      (r.jsonp.poll.s = r.jsonp.poll.s or {})[opt.base] = r.jsonp.poll.s[opt.base] or setTimeout(-> # TODO: Need to optimize for Chrome's 6 req limit?
#Gun.log("polling again");
          o =
            base: opt.base
            headers:
              pull: 1

          r.each opt.headers, (v, i) ->
            o.headers[i] = v

          r.jsonp o, (err, reply) ->
            delete r.jsonp.poll.s[opt.base]

            while reply.body and reply.body.length and reply.body.shift # we're assuming an array rather than chunk encoding. :(
              res = reply.body.shift()

              #Gun.log("-- go go go", res);
              if res and res.body # emit extra events.
                r.createServer.ing res, ->


        , res.headers.poll)

    r.jsonp.ify = (opt, cb) ->
      uri = encodeURIComponent
      q = "?"
      q = opt.url.pathname + q  if opt.url and opt.url.pathname
      q = opt.base + q
      r.each (opt.url or {}).query, (v, i) ->
        q += uri(i) + "=" + uri(v) + "&"

      q += uri("`") + "=" + uri(JSON.stringify(opt.headers)) + "&"  if opt.headers
      return cb()  if r.jsonp.max < q.length
      q += uri("jsonp") + "=" + uri(opt.jsonp = "P" + Math.floor((Math.random() * 65535) + 1))
      if opt.body
        q += "&"
        w = opt.body
        wls = (w, l, s) ->
          uri("%") + "=" + uri(w + "-" + (l or w) + "/" + (s or w)) + "&" + uri("$") + "="

        unless typeof w is "string"
          w = JSON.stringify(w)
          q += uri("^") + "=" + uri("json") + "&"
        w = uri(w)
        i = 0
        l = w.length
        s = r.jsonp.max - (q.length + wls(l.toString()).length)
        return cb()  if s < 0
        while w
          cb q + wls(i, (i = i + s), l) + w.slice(0, i)
          w = w.slice(i)
      else
        cb q

    r.jsonp.max = 2000
    r.each = (obj, cb) ->
      return  if not obj or not cb
      for i of obj
        cb obj[i], i  if obj.hasOwnProperty(i)

    r
    ())
) {}