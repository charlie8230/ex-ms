// entry
let {
  createStore,
  combineReducers
} = Redux;

// shape
var s = {
  visibilityFilter: 'SHOW_ALL',
  todos: [{
    text: '',
    completed: false
  }]
}

// constants
const ADD_TODO = 'ADD_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER',
  VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
  };

//actions
let nextTodoId = 0;

const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
}

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

const toggleTodo = (id) => {
    return {
      type: 'TOGGLE_TODO',
      id
    }
  }
  // reducers
const todo = (state = {}, action) => {
  console.log('@todo reducer');
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return Object.assign({}, state, {
        completed: !state.completed
      });
    default:
      return state;
  }
}

const todos = (state = [], action) => {
  console.log('@todos reducer');
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state;
  }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  console.log('@visibility filter reducer'+state);
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

const todoApp = combineReducers({visibilityFilter, todos});
let store = createStore(todoApp);

let unsubscribe = store.subscribe(()=>console.log(store.getState()));

store.dispatch(addTodo('Learn about actions'));
store.dispatch(toggleTodo(0));
store.dispatch(toggleTodo(1));
store.dispatch(addTodo('Learning about stores'));

store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED));

unsubscribe();

store.dispatch(addTodo('Learning adddddout storess'));

