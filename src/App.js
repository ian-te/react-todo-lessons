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
    store
}) => {
    let input;
    return (
        <div>
            <input ref={node => {
                    input = node
                }}/>
            <button onClick={()=>{
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text: input.value
                })
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
const Link = ({
    active,
    children,
    onClick
}) => {
    if(active) {
        return <span>{children}</span>
    }
    return (
        <a href=""
            onClick={e => {
                e.preventDefault();
                onClick()
            }}>
            {children}
        </a>
    )
}
class FilterLink extends Component {
    componentDidMount () {
        const store = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        })
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        const props = this.props;
        const store = this.context;
        const state = store.getState();
        return (
            <Link
                active={
                    props.filter === state.visibilityFilter
                }
                onClick={() => {
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    })
                }}
            >
                {props.children}
            </Link>
        );
    }
}
const Footer = (
    {store}
) => (
    <footer>
        <FilterLink
            store={store}
            filter='SHOW_ALL'
            >
            All
        </FilterLink>
        <FilterLink
            store={store}
            filter='SHOW_ACTIVE'
            >
            Active
        </FilterLink>
        <FilterLink
            store={store}
            filter='SHOW_COMPLETED'
            >
            Completed
        </FilterLink>
    </footer>
)
class VisibleTodoList extends Component {
    componentDidMount () {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        })
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return (
            <TodoList
                todos={
                    getVisibleTodos(
                        state.todos,
                        state.visibilityFilter
                    )
                }
                onTodoClick={id =>
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })
                }
            ></TodoList>
        )
    }
}
VisibleTodoList.contextTypes = {
    store: React.PropTypes.object
}


let nextTodoId = 0;
const App = ({
    store
}) => (
    <div>
        <AddTodo store={store}/>
        <VisibleTodoList store={store} />
        <Footer store={store}/>
    </div>
)

class Provider extends Component {
    getChildContext() {
        return {
            store: this.props.store
        }
    }
    render() {
        return this.props.children
    }
}
Provider.childContextTypes = {
    store: React.PropTypes.object
}

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <App />
    </Provider>,
    document.getElementById('root')
)

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
