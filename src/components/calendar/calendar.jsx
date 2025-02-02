import React, { Component } from "react";
import { Button } from "@material-ui/core";
import FilterBox from "./filterModal";
import { Calendar as CalendarBox, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import FeedPost from '../feed/feedPost'
import ReactDOM from 'react-dom'
import axios from "axios";

const localizer = momentLocalizer(moment);
let allViews = Object.keys(Views).map(k => Views[k])

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

var id_fetched = '';

const routing = (
  <Router>
      <div>
          <Route path="/:id_fetched" render={props => <FeedPost 
          post={{event: {title: "Hello",start_time:"12:23:12",end_time:"14:12:12",date:"2019-08-09",venue:"RM101",description:"asad",summary:"wdusi"},tag:{name:"asa",tag_id:"9"}}}></FeedPost>}></Route>      
      </div>
  </Router>
)

const sampleEvents = {
  id: 3,
  title: "Lecture on Bash and Git",
  start: new Date(2015, 4, 12),
  end: new Date(2015, 4, 15),
};

class Calendar extends Component {
    
  // state = {
  //   events: [
  //     {
  //       id: 0,
  //       title: 'All Day Event very long title',
  //       allDay: true,
  //       start: new Date(2015, 3, 0),
  //       end: new Date(2015, 3, 1),
  //     },
  //     {
  //       id: 1,
  //       title: 'Long Event',
  //       start: new Date(2015, 3, 7),
  //       end: new Date(2015, 3, 10),
  //     },
      
  //     {
  //       id: 2,
  //       title: 'DTS STARTS',
  //       start: new Date(2016, 2, 13, 0, 0, 0),
  //       end: new Date(2016, 2, 20, 0, 0, 0),
  //     }
  //   ],
  //   filterBoxOpen: false
  // };

  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount() {
    this.getItems();
  }  

  openFilterBox = () => {this.setState({filterBoxOpen: true})};
  handleClose = () => {
    this.setState({filterBoxOpen: false});
  }
  
  getItems() {
    axios
      .get("http://localhost:8000/events/view/month/", { withCredentials: true })
      .then(res => {
        const events = res.data;
        events.forEach(event => {
          event.id = event.event_id;
          event.start = event.date;
          event.end = event.date;
        })
        this.setState({ events: events });
      }
        )
      .catch(err => console.log(err));
  }

  render() {
    return (
      <React.Fragment>
        {/* <div> */}
        <div style={{padding: "5px", textAlign: "right"}}>
          <Button
              onClick={this.openFilterBox }
              variant="contained"
              color="primary"
              // style={{ width: 105, margin: 10 }}
            >
              Filter
          </Button>
          </div>
          {console.log(this.state.events)}
        <CalendarBox
          events={this.state.events}
          views={allViews}
          step={60}
          showMultiDayTimes
          defaultDate={new Date(2015, 3, 1)}
          components={{
            timeSlotWrapper: ColoredDateCellWrapper,
          }}
          localizer={localizer}
          onSelectEvent={(e, event) => { id_fetched = e['id']; console.log(id_fetched); window.location.replace(id_fetched)}}
          //onDrillDown={(e,e1) => {console.log(e);console.log(e1);}}
        />
        <FilterBox open={this.state.filterBoxOpen} onClose={this.handleClose}></FilterBox>
      </React.Fragment>
    );
  }
}
ReactDOM.render(routing, document.getElementById('root'))
export default Calendar;
