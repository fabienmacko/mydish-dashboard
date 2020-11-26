import React, {useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import {
  Input,
} from "reactstrap";
import Swal from 'sweetalert2';

import {FETCH_SETTINGS_QUERY} from '../../utils/graphql';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const hours = ["00:00", "00:30", "01:00","01:30", "02:00","02:30", "03:00","03:30", "04:00","04:30", "05:00","05:30", "06:00","06:30", "07:00","07:30", "08:00","08:30", "09:00","09:30", "10:00","10:30", "11:00","11:30", "12:00","12:30", "13:00","13:30", "14:00","14:30", "15:00","15:30", "16:00","16:30", "17:00","17:30", "18:00","18:30", "19:00","19:30", "20:00","20:30", "21:00","21:30", "22:00","22:30", "23:00","23:30"];

// Used components
const HourSelector = ({defaultValue, onChange}) => {

  return (
    <Input onChange={onChange} style={{border: 'none',width: 'auto', fontSize: '.875rem', padding: '0', margin: '0 4px'}} type="select" name="hourSelector" id="hourSelector" defaultValue={defaultValue.replace(":", '')}>
      {
        hours.map((hour) => (
          <option key={'hour'+hour} value={hour.replace(":", '')}>{hour}</option>
        ))
      }
    </Input>
  )
};

const OpenCloseButton = ({type, onClick}) => {
return (
      <div onClick={onClick} style={{
        color: 'white',
        cursor: 'pointer',
        backgroundColor: type === 'Open' ? 'green' : 'red',
        padding: '7px',
        fontWeight: 'bold'
    }}>{type}</div>
  )
}

const OpenHoursRow = ({midday, evening, weekday, setShouldLoaderAppear}) => {

  const weekdayUpperCase = weekday[0].toUpperCase() + weekday.slice(1);

  const middayOpenHour = midday.open.substr(0, 2);
  const middayOpenMin = midday.open.substr(2, 4);
  const middayCloseHour = midday.close.substr(0, 2);
  const middayCloseMin = midday.close.substr(2, 4);

  const eveningOpenHour = evening.open.substr(0, 2);
  const eveningOpenMin = evening.open.substr(2, 4);
  const eveningCloseHour = evening.close.substr(0, 2);
  const eveningCloseMin = evening.close.substr(2, 4);

  const stringFormattedMidday = midday.close === "Closed" ? "Closed" : `${middayOpenHour}:${middayOpenMin} - ${middayCloseHour}:${middayCloseMin}`;
  const stringFormattedEvening = evening.close === "Closed" ? "Closed" : `${eveningOpenHour}:${eveningOpenMin} - ${eveningCloseHour}:${eveningCloseMin}`;

  const [updatableRow, setUpdatableRow] = useState(false);

  // Midday
  const [middayOpenHourState, setMiddayOpenHourState] = useState(midday.open);
  const [middayCloseHourState, setMiddayCloseHourState] = useState(midday.close);
  const [isMiddayClosedState, setIsMiddayClosedState] = useState(midday.close === "Closed");

  // Evening
  const [eveningOpenHourState, setEveningOpenHourState] = useState(evening.open);
  const [eveningCloseHourState, setEveningCloseHourState] = useState(evening.close);  
  const [isEveningClosedState, setIsEveningClosedState] = useState(evening.close === "Closed");

  const [updateSetting] = useMutation(UPDATE_SETTING_MUTATIONS, {
    variables: {
      weekday: weekday,
      openTimes: {
        midday: {
          open: middayOpenHourState,
          close: middayCloseHourState
        },
        evening: {
          open: eveningOpenHourState,
          close: eveningCloseHourState
        },
      }
    },
    update(cache,result) {

      cache.writeQuery({query: FETCH_SETTINGS_QUERY, data: {
        settings: result.data.updateOpenHour
      }});
    },
    onCompleted() {
      setShouldLoaderAppear(false);
    }
  });


  // Logic
  const isOpenHoursValid = () => middayOpenHourState < middayCloseHourState && eveningOpenHourState < eveningCloseHourState;


  // Event handlers

  const saveOpeningHoursModifications = async () => {
    setShouldLoaderAppear(true);
    setUpdatableRow(false);

    await updateSetting();

    Toast.fire({
      icon: 'success',
      title: `Open hours saved for ${weekdayUpperCase}`
    })
  }

  const errorOpeningHoursModifications = () => {
    Toast.fire({
      icon: 'error',
      title: `The "Open" time should be before the "Close" time.`
    })
  };

  const closeOpenHours = (e, dayPeriod) => {

    if (dayPeriod === "Midday") {
      setMiddayOpenHourState("Closed");
      setMiddayCloseHourState("Closed");
      setIsMiddayClosedState(true);
    } else if (dayPeriod === "Evening") {
      setEveningOpenHourState("Closed");
      setEveningCloseHourState("Closed");
      setIsEveningClosedState(true);
    }
  }

  const openOpenHours = (e, dayPeriod) => {

    if (dayPeriod === "Midday") {
      setMiddayOpenHourState("0000");
      setMiddayCloseHourState("0000");
      setIsMiddayClosedState(false);
    } else if (dayPeriod === "Evening") {
      setEveningOpenHourState("0000");
      setEveningCloseHourState("0000");
      setIsEveningClosedState(false);
    }

  }

  return (
    <>
      <tr>
        <td>{weekdayUpperCase}</td>
        {
          updatableRow ? (
            <>
              <td>
                <div style={{display: 'flex', alignItems:'center', justifyContent: 'flex-start'}}>
                  {
                    isMiddayClosedState ? (
                      <>
                        <div style={{marginRight: '5px'}}>Closed</div>
                      
                        <OpenCloseButton type="Open" onClick={e => openOpenHours(e,'Midday')} />
                      </>
                      ) : (
                        <>
                          <HourSelector defaultValue={`${middayOpenHour}:${middayOpenMin}`} onChange={e => setMiddayOpenHourState(e.target.value)} /> - <HourSelector defaultValue={`${middayCloseHour}:${middayCloseMin}`} onChange={e => setMiddayCloseHourState(e.target.value)} />
                          
                          <OpenCloseButton type="Closed" onClick={e => closeOpenHours(e,'Midday')} />
                        </>
                      )
                  }
                </div>
              </td>

              <td>
                <div style={{display: 'flex', alignItems:'center', justifyContent: 'flex-start'}}>
                  {
                    isEveningClosedState ? (
                      <>
                        <div style={{marginRight: '5px'}}>Closed</div>
                      
                        <OpenCloseButton type="Open" onClick={e => openOpenHours(e,'Evening')} />
                      </>
                      ) : (
                        <>
                          <HourSelector defaultValue={`${eveningOpenHour}:${eveningOpenMin}`} onChange={e => setEveningOpenHourState(e.target.value)} /> - <HourSelector defaultValue={`${eveningCloseHour}:${eveningCloseMin}`} onChange={e => setEveningCloseHourState(e.target.value)} />
                          
                          <OpenCloseButton type="Closed" onClick={e => closeOpenHours(e,'Evening')} />
                        </>
                      )
                  }
                </div>
              </td>
            </>
          ) : (
            <>
              <td>{stringFormattedMidday}</td>
              <td>{stringFormattedEvening}</td>
            </>
          )
        }

        <td>
          {
            updatableRow ? (
              <i style={{
                color: 'green',
                cursor: 'pointer'
            }} className="far fa-check-square fa-2x" onClick={() => isOpenHoursValid() ? saveOpeningHoursModifications() : errorOpeningHoursModifications()}></i>
            ) : (
              <i style={{
                color: 'yellow',
                cursor: 'pointer'
            }} className="fas fa-edit fa-2x" onClick={() => setUpdatableRow(true)}></i>
            )
          }
        </td>

      </tr>
    </>
  )
}

const UPDATE_SETTING_MUTATIONS = gql`
mutation updateSetting($weekday: String!, $openTimes: OpenTimesInput!) {
  updateOpenHour(
    weekday: $weekday
    openTimes: $openTimes
  ) {
    openHours {
      monday {
        midday {
          open
          close
        }
        evening {
          open
          close
        }
      }
      tuesday{
        midday {
          open
          close
        }
        evening {
          open
          close
        }
      }
      wednesday{
        midday {
          open
          close
        }
        evening {
          open
          close
        }
      }
      thursday{
        midday {
          open
          close
        }
        evening {
          open
          close
        }
      }
      friday{
        midday {
          open
          close
        }
        evening {
          open
          close
        }
      }
      saturday{
        midday {
          open
          close
        }
        evening {
          open
          close
        }
      }
      sunday{
        midday {
          open
          close
        }
        evening {
          open
          close
        }
      }
    }
  }
}
`

export default OpenHoursRow;