import React, {useState} from 'react';
import {
  Button,
  FormGroup,
  Form,
  Input,
  Label,
  CustomInput
} from "reactstrap";

const HourSelector = ({midday, evening}) => {
  const hours = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

  return (
    <Input style={{border: 'none',width: 'auto', fontSize: '.875rem', padding: '0', margin: '0 4px'}} type="select" name="hourSelector" id="hourSelector" defaultValue={evening.open}>
      {
        hours.map((hour) => (
          <option key={'hour'+hour} value={hour}>{hour+'h'}</option>
        ))
      }
    </Input>
  )
};

const OpenHoursRow = ({midday, evening, weekday}) => {


  const [updatableRow, setUpdatableRow] = useState(false);

  // Midday
  const [middayOpenHour, setMiddayOpenHour] = useState(midday.open);
  const [middayCloseHour, setMiddayCloseHour] = useState(midday.close);

  // Evening
  const [eveningOpenHour, setEveningOpenHour] = useState(evening.open);
  const [eveningCloseHour, setEveningCloseHour] = useState(evening.close);  

  return (
    <tr>
      <td>{weekday[0].toUpperCase() + weekday.slice(1) /* Uppercase the first letter */}</td>
      {
        updatableRow ? (
          <>
            <td>
              <div style={{display: 'flex', alignItems:'center', justifyContent: 'flex-start'}}>
                <HourSelector midday={midday} evening={evening} /> - <HourSelector midday={midday} evening={evening} />
              </div>
            </td>

            <td>
              <div style={{display: 'flex', alignItems:'center', justifyContent: 'flex-start'}}>
                <HourSelector midday={midday} evening={evening} /> - <HourSelector midday={midday} evening={evening} />
              </div>
            </td>
          </>
        ) : (
          <>
            <td>{midday.open}h - {midday.close}h</td>
            <td>{evening.open}h - {evening.close}h</td>
          </>
        )
      }
      <td><i style={{
        color: 'yellow',
        cursor: 'pointer'
    }} className="fas fa-edit" onClick={() => setUpdatableRow(true)}></i></td>
    </tr>
  )
}

export default OpenHoursRow;