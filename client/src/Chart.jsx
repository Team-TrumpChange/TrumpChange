import React, { Component } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend} from 'recharts';
import { redA200, redA500, blueA200, blue300, greenA100, grey300, blueA100, fullWhite, fullBlack, darkBlack, white, redA100 } from 'material-ui/styles/colors';
    

const data = [
  { name: 'Number of Donations', uv: 26.69, number: 325, fill: redA100 },
  { name: 'TrumpTweets', uv: 31.47, number: 41, fill: blueA100},
  { name: 'People Contributing to Change', uv: 15.69, number: 28, fill: greenA100 },
];


class Chart extends Component {

	render () {
    const style = {
      top: 20,
      left: 50,
      lineHeight: '24px',
      fontSize: '13px'
    }; 

  	return (
      <ResponsiveContainer>
        <RadialBarChart innerRadius='50%' outerRadius='100%' data={data} startAngle={180} endAngle={-179}>
          <RadialBar minAngle={0} label={{ fill: '#fff', position: 'insideStart'}} background clockWise={true} dataKey= 'number' />
          <Legend layout='vertical' verticalAlign='top' wrapperStyle={style}/>
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }
}
export default Chart;