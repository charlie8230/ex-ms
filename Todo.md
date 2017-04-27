Todo
# Event Delegation ??
  - Basic ... need to pass in eventType :P (needs a wrapper***) (no wrapper needed)
   - Tracking handlers! - done
   - Lastly - need to start individual module!
   # Support vdom view layer
   # Support extensions
   
## Need get x-config - done
## Still need life cycle - done
   
   # Stop a module - removed ref - ok
  # Stop module - remove handlers!
# Start module? already started or START
--Done
#### FINISH simplify stack state
# rename Global config ##
## Process common JS modules too - done
## fixed moduleRefs stack


  Event delegation adapter - done
  Streams? Pass in elem type?
  Actions - unique??
# Get global adapter - done
#expose unique ID utility
# Get Module config as store? or just object?
  or data-config
  # More error handling?
  # Fire outside events?
  # destroy module should release event handlers, call passed in cb & call context.destroy
# do not use class system

/*

  Needs Plugin system - requires conventions be followed returns chainable
  Services -
    Public - done
    require done
    Singleton done
  Needs States - done
  Needs stacks - done
  Needs Modules - done
  Modules - run init! - done
  Use fetch ponyfill;
    Module should return init within a closure??
                    Module context should be able to request plugin or submodule
  Needs config - done
  Needs data-* - done
  Has Mini Pub Sub - done
  Allows Views (how does data flow?)
  Allows Streams
  Allows delegation
  Enable custom build
  Allows composition (rambda?)

  todo:
    short hand query All

  What about?
    XHR - fetch


*/
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