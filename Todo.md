Todo
* Init services first
* Add micro pub sub
  import mitt from 'mitt'

  let emitter = mitt()
  -- Behavior
  -- Get global
  -- Error emitter
  -- Views??
  -- Fetch??
  Redo store - using ramda -> models? -> views
  Add - onmessage -> listen to all messages? - ok on CTX and app inc.alias
  Store - get? - ok
  Global State? - ok
  Logging - ok
  Context Base
    -add App methods - ok getService, asSubModule
  Convenience addModule, addService - OK
  Stacks - - working
    services singleton - ok
                                              Dependencies <<-major
      Global API - ok
      Application Services (Pub Sub) - ok
    Module Init per instance - ok
      Dependencies
      No API
      Local State - Redux?
      Context > Element @ Init
        this.Element
        this.subscribe / on ?
        this.publish  / off ?
        this.store ?
          this.store.set
          this.store.get ??
          Context - > composed?
      Application Services (pub Sub)
    Behaviors - N/A
    Plug Ins - Jquery Init?

  Pubsub - OK
  ./scripts/build -- src/compose.js src/curry.js src/chain.js src/pipe.js src/when.js src/lens.js src/set.js > dist/ramda.custom2.js
  File Size?
  Views
  XXX- Routing??
  AJAX