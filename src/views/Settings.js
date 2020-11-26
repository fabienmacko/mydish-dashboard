/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useState} from "react";
import { useQuery } from '@apollo/client';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

import OpenHoursRow from '../components/OpenHoursRow';
import {FETCH_SETTINGS_QUERY} from '../utils/graphql';
import Loader from '../components/Loader';

const weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const Settings = () => {

  const { loading: settingLoading, error: settingError, data: settingsData } = useQuery(FETCH_SETTINGS_QUERY);

  const [shouldLoaderAppear, setShouldLoaderAppear] = useState(false);

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle>Open hours (when the users can use your shopping interface)</CardTitle>
              </CardHeader>
              <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Weekday</th>
                    <th>Midday</th>
                    <th>Evening</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    settingsData && weekdays.map((weekday, index) => {
                      
                      // Mid day
                      const middayOpeningHour = settingsData.settings.openHours[weekday].midday.open == 'Closed' ? 'Closed' : settingsData.settings.openHours[weekday].midday.open;
                      const middayClosingHour = settingsData.settings.openHours[weekday].midday.close == 'Closed' ? 'Closed' : settingsData.settings.openHours[weekday].midday.close;

                      // Evening
                      const eveningOpeningHour = settingsData.settings.openHours[weekday].evening.open == 'Closed' ? 'Closed' : settingsData.settings.openHours[weekday].evening.open;
                      const eveningClosingHour = settingsData.settings.openHours[weekday].evening.close == 'Closed' ? 'Closed' : settingsData.settings.openHours[weekday].evening.close;

                      return (
                        <OpenHoursRow setShouldLoaderAppear={setShouldLoaderAppear} midday={{open: middayOpeningHour, close: middayClosingHour}} evening={{open: eveningOpeningHour, close: eveningClosingHour}} weekday={weekday} key={weekday+index} />
                      )
                    })
                  }
                </tbody>
              </Table>
              </CardBody>
            </Card>
            {shouldLoaderAppear && <Loader />}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Settings;
