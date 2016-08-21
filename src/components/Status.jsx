import React, {Component} from 'react';
import {getStatus} from '../actions/status';
import {Chart} from 'react-d3-core';
import {LineChart, BarHorizontalChart} from 'react-d3-basic';

export default class Status extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.socket = io();
	}

	componentDidMount(){
		if (this && this.setState) {
			getStatus(this.initMetric.bind(this));
			this.socket.on('metric', this.initMetric.bind(this));
		}
	}

	componentWillUnmount(){
		this.socket.off('metric');
	}

	initMetric(data) {
		this.setState({
			usage: data.usage,
			time: data.time
		});
	}

	getUsageChart() {
		const data = this.state.usage;
		if (!data || !data.length) return null;
		const x = (d) => {
			return new Date(d.time);
		};
		const chartSeries = [
			{
				field: 'used',
				name: 'Memory Used',
				color: '#ff7f0e'
			}
		];
		return (
			<LineChart
				title={'Memory usage'}
				width={600}
				height={400}
				data={data}
				chartSeries={chartSeries}
				x={x}
				xScale={'time'}
				xLabel= {'Time'}
				yLabel = {'Memory'}
			/>);
	}

	getTimeChart() {
		const data = this.state.time;
		if (!data || !data.length) return null;
		const x = (d) => {
			return d.fileName;
		};
		const chartSeries = [
			{
				field: 'time',
				name: 'Execution time'
			}
		];
		return (<BarHorizontalChart
				title={'Execution time'}
				data={data}
				width={600}
				height={400}
				chartSeries={chartSeries}
				y={x}
				yScale= {"ordinal"}
				xLabel={'Time'}
				xTicks={[5]}
		/>);
	}

	render() {
		return (<div className={'row'}>
			<div className={'col-md-6'}>
				{this.getUsageChart()}
			</div>
			<div className={'col-md-6'}>
				{this.getTimeChart()}
			</div>
		</div>);
	}
}