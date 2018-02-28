import React, { Component } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend} from 'recharts';
import {
  blue200, blue400, blue600, fullWhite, fullBlack, darkBlack, white } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
class Chart extends Component {

	render () {
    const style = {
      top: 10,
      left: 10,
      lineHeight: '18px',
      fontSize: '13px',
    };

    const totalDonated = this.props.totalDonated
    const totalUsers = this.props.totalUsers
    const totalNumTweets = this.props.totalNumTweets
   
  	return (
        <ResponsiveContainer>
          <RadialBarChart innerRadius='55%' outerRadius='100%' 
          data={[{
            name: 'Number of Donations', number: totalDonated, fill: blue200 },
          { name: 'TrumpTweets', number: totalUsers, fill: blue400 },
          { name: 'People Contributing to Change', number: totalNumTweets, fill: blue600 }
          ]} 
          startAngle={180} endAngle={-179}>
            <RadialBar minAngle={0} label={{ fill: '#ffffff', position: 'insideStart'}} background clockWise={true} dataKey= 'number' />
            <Legend layout='vertical' verticalAlign='top' wrapperStyle={style}/>
          </RadialBarChart>
        </ResponsiveContainer>
    );
  }
}
export default Chart;