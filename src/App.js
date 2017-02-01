import deepFreeze from 'deep-freeze';
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
    type: 'ADD_TODO',
    id: 0,
    text: 'Something'
})
store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED'

})

console.log(store.getState());


const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn something cool'
    };

    const stateAfter = [{
        id: 0,
        text: 'Learn something cool',
        completed: false
    }];
    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(todos(stateBefore, action))
        .toEqual(stateAfter)
}

const testToggleTodo = () => {
    const stateBefore = [{
        id: 0,
        text: 'Some cool todo',
        completed: false
    },{
        id: 1,
        text: 'Go shopping',
        completed: false
    }]
    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    }
    const stateAfter = [{
        id: 0,
        text: 'Some cool todo',
        completed: false
    },{
        id: 1,
        text: 'Go shopping',
        completed: true
    }]

    deepFreeze(stateBefore)
    deepFreeze(action)

    expect(todos(stateBefore, action))
        .toEqual(stateAfter)
}

testToggleTodo()
testAddTodo()

console.log('test OK')


// import React, {Component} from 'react';
// import './App.css';
// import Text from './components/Text'
// import HtmlComment from './components/HtmlComment'
//
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
