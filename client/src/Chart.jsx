import React, { Component } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend} from 'recharts';
import { redA200, redA500, blueA200, blue300, greenA100, grey300, blueA100, fullWhite, fullBlack, darkBlack, white, redA100 } from 'material-ui/styles/colors';
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
          <RadialBarChart innerRadius='50%' outerRadius='100%' 
          data={[{ name: 'TrumpTweets', number: totalUsers, fill: redA100 }, 
          { name: 'People Contributing to Change', number: totalNumTweets, fill: blueA100 },
          { name: 'Number of Donations', number: totalDonated, fill: greenA100 },]} 
          startAngle={180} endAngle={-179}>
            <RadialBar minAngle={0} label={{ fill: '#ffffff', position: 'insideStart'}} background clockWise={true} dataKey= 'number' />
            <Legend layout='vertical' verticalAlign='top' wrapperStyle={style}/>
          </RadialBarChart>
        </ResponsiveContainer>
    );
  }
}
export default Chart;