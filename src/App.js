import React, { Component } from "react";
import Chart from "./Chart";

import "chartjs-plugin-zoom";
import "./app.scss";

class App extends Component {
  state = {
    ChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "BTC-USD",
          backgroundColor: "#FFF2F2",
          borderColor: "#FF8B8B",
          pointBackgroundColor: "#FF6161",
          pointBorderColor: "#FF6363",
          borderWidth: "2",
          lineTension: 0.45,
          data: [],
        },
      ],
    },
    ChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 5,
            },
          },
        ],
      },
      // plugins: {
      //   zoom: {
      //     pan: {
      //       enabled: true,
      //       speed: 20,
      //       threshold: 10,
      //       mode: "x",
      //     },
      //     zoom: {
      //       enabled: true,
      //       mode: "x",
      //       speed: 0.5,
      //     },
      //   },
      // },
    },
    btcprice: "",
  };

  componentDidMount() {
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["BTC-USD"],
        },
      ],
    };

    this.ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    this.ws.onmessage = (e) => {
      const value = JSON.parse(e.data);
      if (value.type !== "ticker") {
        return;
      }

      const oldBtcDataSet = this.state.ChartData.datasets[0];
      const newBtcDataSet = { ...oldBtcDataSet };
      newBtcDataSet.data.push(value.price);
      this.setState({ btcprice: value.price });

      const newChartData = {
        ...this.state.ChartData,
        datasets: [newBtcDataSet],
        labels: this.state.ChartData.labels.concat(
          new Date().toLocaleTimeString()
        ),
      };
      this.setState({ ChartData: newChartData });
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return (
      <>
        <div className="header">
          <div className="logo">
            <i className="fab fa-bitcoin"></i>BTC-USD Tracker
          </div>
        </div>
        <div className="chart-container">
          <Chart
            data={this.state.ChartData}
            options={this.state.ChartOptions}
          />
        </div>
        <h3>Real time BTC-USD price tracker</h3>
        <h4>
          <span>Current price: </span>
          {this.state.btcprice}
        </h4>
        <footer>
          Developed by <a href="https://deevoid.netlify.app/">Dev</a>
        </footer>
      </>
    );
  }
}

export default App;
