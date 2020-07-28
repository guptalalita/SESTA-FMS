import React, { Component } from "react";
import Layout from "../../hoc/Layout/Layout";
import auth from "../../components/Auth/Auth";
import axios from "axios";

class Dashboard extends Component {
  async componentDidMount() {}

  render() {
    const userInfo = auth.getUserInfo();
    return (
      <Layout>
        <h3>Welcome {userInfo.username}</h3>
      </Layout>
    );
  }
}

export default Dashboard;
