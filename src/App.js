import deepFreeze from 'deep-freeze';
import expect from 'expect';

const todos = (state = [], action) => {
    switch (action.type) {
    case 'ADD_TODO':
        return  [
            ...state,
            {
                id: action.id,
                text: action.text,
                completed: false
            }
        ]
        break;
    default:
        return state;

    }
}

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
