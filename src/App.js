import deepFreeze from 'deep-freeze';
import React, { Component  } from 'react';
import ReactDOM from 'react-dom'


import expect from 'expect';
import {
    createStore,
    // combineReducers
} from 'redux';



const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state
            }
            return {
                ...state,
                completed: !state.completed
            }
        default:
            return state
    }
}


const todos = (state = [], action) => {
    switch (action.type) {
    case 'ADD_TODO':
        return  [
            ...state,
            todo(undefined, action)
        ]
        break;
    case 'TOGGLE_TODO':
        return state.map(t => todo(t, action))
    default:
        return state;
    }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter || state
        default:
            return state
    }
}

const combineReducers = (reducers) => {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](
                    state[key],
                    action
                );
                return nextState;
            },
            {}
        )
    }
}

const todoApp = combineReducers({
    todos,
    visibilityFilter
})


const store = createStore(todoApp)

store.dispatch({
    type: 'SET_VISIBILITY_FILTER'
})

console.log(store.getState());

store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_ALL'

})

const getVisibleTodos = (todos, filter) => {

    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        default:
            return todos
    }
}


const AddTodo = ({
    onAddClick
}) => {
    let input;
    return (
        <div>
            <input ref={node => {
                    input = node
                }}/>
            <button onClick={()=>{
                onAddClick(input.value)
                input.value = '';
            }}>
                Add TODO
            </button>
        </div>
    )
}

const Todo = ({
    onClick,
    completed,
    text
}) => (
    <li onClick={onClick}
        style={{
            textDecoration: completed ? 'line-through' : 'none'
        }}>
        {text}
    </li>
)
const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />)}
    </ul>
)
const FilterLink = ({
    filter,
    currentFilter,
    children,
    onClick
}) => {
    if(filter==currentFilter) {
        return <span>{children}</span>
    }
    return (
        <a href=""
            onClick={e => {
                e.preventDefault();
                onClick(filter)
            }}>
            {children}
        </a>
    )
}

const Footer = (
    visibilityFilter,
    onFilterClick
) => (
    <footer>
        <FilterLink
            filter='SHOW_ALL'
            currentFilter={visibilityFilter}
            onClick={onFilterClick}>
            All
        </FilterLink>
        <FilterLink
            filter='SHOW_ACTIVE'
            currentFilter={visibilityFilter}
            onClick={onFilterClick}>
            Active
        </FilterLink>
        <FilterLink
            filter='SHOW_COMPLETED'
            currentFilter={visibilityFilter}
            onClick={onFilterClick}>
            Completed
        </FilterLink>
    </footer>
)
let nextTodoId = 0;
const App = ({
    todos,
    visibilityFilter
}) => (
    <div>
        <AddTodo
            onAddClick={ text =>
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text
                })}
            />
        <TodoList
            todos={
                getVisibleTodos(
                    todos,
                    visibilityFilter
                )
            }
            onTodoClick={id =>
                store.dispatch({
                    type: 'TOGGLE_TODO',
                    id
                })
            }
        />
        <Footer
            visibilityFilter={visibilityFilter}
            onFilterClick={ (filter) => {
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                })
            }}
            />
    </div>
)

const render = () => {
    ReactDOM.render(
        <App {...store.getState()} />,
        document.getElementById('root')
    )
}

store.subscribe(render);
render();


export default App

// class App extends Component {
//     constructor() {
//         super()
//         this.state = {
//
//             todos: [
//                 {id: 1, name: 't1', isComplete: true},
//                 {id: 2, name: 't2', isComplete: false},
//                 {id: 3, name: 't3', isComplete: false}
//             ],
//             currentTodo: 'new'
//         }
//         this.handleInputChange = this.handleInputChange.bind(this);
//     }
//     handleInputChange(e){
//         this.setState({
//             currentTodo: e.target.value
//         })
//     }
//     getOpeningComment(width) {
//         return '<table><tr><td width="' + width + '">';
//     }
//     render() {
//         return (
//             <div className="App">
//                 <h2>test app</h2>
//                 <Text>Some text <b>from</b> component </Text>
//                 <HtmlComment text={this.getOpeningComment(400)} />
//                 <div className="Todo-App">
//                     <div className="Todo-List">
//                         <ul>
//                             {this.state.todos.map(todo =>
//                                 <li key={todo.id}>
//                                     <input defaultChecked={todo.isComplete} type="checkbox"/>{todo.name}
//                                 </li>)}
//                         </ul>
//                     </div>
//                 </div>
//                 <HtmlComment text="</td></tr></table>" />
//             </div>
//         );
//     }
// }
//
// export default App;
