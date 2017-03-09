Todo
* Init services first
* Add micro pub sub
  import mitt from 'mitt'

  let emitter = mitt()


  Store - get? - ok
  Global State? - ok
  Logging - ok
  Context Base
    
  Stacks - - working
    services singleton
      Dependencies
      Global API
      Application Services (Pub Sub)
    Module Init per instance
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

  Pubsub
  
  File Size?
  Views
  Routing??
  AJAX