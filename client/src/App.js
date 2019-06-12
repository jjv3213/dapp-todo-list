import React, { Component } from "react";
import Web3 from "web3";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./config";
import TodoList from "./TodoList";

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    this.setState({ todoList });
    const taskCount = await todoList.methods.taskCount().call();
    this.setState({ taskCount });
    for (let i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call();
      this.setState({
        tasks: [...this.state.tasks, task]
      });
    }
    this.setState({ loading: false });
  }

  state = {
    account: "",
    taskCount: 0,
    tasks: [],
    loading: true
  };

  createTask = content => {
    this.setState({ loading: true });
    this.state.todoList.methods
      .createTask(content)
      .send({ from: this.state.account })
      .once("receipt", receipt => {
        this.setState({ loading: false });
      });
  };

  toggleCompleted = taskId => {
    this.setState({ loading: true });
    this.state.todoList.methods
      .toggleCompleted(taskId)
      .send({ from: this.state.account })
      .once("receipt", receipt => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div>
        <p>User: {this.state.account}</p>
        {this.state.loading ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <TodoList
            tasks={this.state.tasks}
            createTask={this.createTask}
            toggleCompleted={this.toggleCompleted}
          />
        )}
      </div>
    );
  }
}

export default App;
