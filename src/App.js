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
    filter: 'SHOW_COMPLETED'

})
let nextTodoId = 0;
class App extends Component {
    render() {
        return (
            <div>
                <input ref={node => {
                        this.input = node
                    }}/>
                <button onClick={()=>{
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoId ++
                    })
                    this.input.value = '';
                }}>
                    Add TODO
                </button>
                <ul>
                    {this.props.todos.map(todo =>
                        <li key={todo.id} onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                })
                            }}
                            style={{
                                textDecoration: todo.completed ? 'line-through' : 'none'
                            }}>
                            {todo.text}
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <App todos={store.getState().todos} />,
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
