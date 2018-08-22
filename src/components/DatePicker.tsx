import * as React from 'react';
import './styles/DatePicker.css';
import { TextField, Dialog, DialogActions, DialogContent, Button, IconButton } from '@material-ui/core';
import * as moment from 'moment';

class DatePicker extends React.Component<any, any, any> {
  static defaultProps = {
    startDateSelected: moment(),
    endDateSelected: moment().add(1, "day"),
    dateSelected: moment(),
    range: false,
    dateLabel: "Date",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    datePickerText: "Select a date below:",
    startDateLimit: undefined,
    endDateLimit: undefined,
  }

  private months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  private daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  public constructor(props) {
    super(props);

    this.checkProps(props);

    this.state = {
      startDate: props.startDateSelected,
      endDate: props.endDateSelected,
      date: props.dateSelected,
      isOpen: false,
      currentSelectorMonth: props.range ? props.startDateSelected.month() : props.dateSelected.month(),
      currentSelectorYear: props.range ? props.startDateSelected.year() : props.dateSelected.year(),
      currentSelectorDate: props.dateSelected,
      currentSelectorStartDate: props.startDateSelected,
      currentSelectorEndDate: props.endDateSelected,
    };
  }

  private checkProps = props => {
    if (props.startDateLimit && props.endDateLimit && props.startDateLimit.isAfter(props.endDateLimit)) {
      throw new Error("Prop 'startDateLimit' comes after prop 'endDateLimit'. The end date should always come after the start date.");
    }

    if (props.range) {
      if (props.startDateSelected && props.startDateLimit && props.endDateLimit && (props.startDateSelected.isBefore(props.startDateLimit) || props.startDateSelected.isAfter(props.endDateLimit))) {
        console.warn("Prop 'startDateSelected' is outside of the date limits 'startDateLimit' or 'endDateLimit'. This could be a prop that was passed in or because the default value of 'startDateSelected' is moment(). 'startDateLimit' will be used as the selected start date instead.");
      }
      if (props.endDateSelected && props.startDateLimit && props.endDateLimit && (props.endDateSelected.isBefore(props.startDateLimit) || props.endDateSelected.isAfter(props.endDateLimit))) {
        console.warn("Prop 'endDateSelected' is outside of the date limits 'startDateLimit' or 'endDateLimit'. This could be a prop that was passed in or because the default value of 'endDateSelected' is moment().add(1, 'day'). 'endDateLimit' will be used as the selected end date instead.");
      }
      if (props.startDateSelected && props.endDateSelected && (props.startDateSelected.isAfter(props.endDateSelected))) {
        throw new Error("Prop 'startDateSelected' comes after prop 'endDateSelected'. The end date should always come after the start date.");
      }
    } else {
      if ((props.startDateLimit && props.dateSelected.isBefore(props.startDateLimit)) || (props.endDateLimit && props.dateSelected.isAfter(props.endDateLimit))) {
        console.warn("Prop 'dateSelected' is outside of the date limits 'startDateLimit' or 'endDateLimit'. This could be a prop that was passed in or because the default value of 'dateSelected' is moment(). 'startDateLimit' will be used as the selected date instead.");
      }
    }
  }
  private getCalendarDays = () => {
    let firstDayOfWeek = moment().year(this.state.currentSelectorYear).month(this.state.currentSelectorMonth).date(1).get('day');
    let weeks = [] as any[];
    let currentDay = moment().year(this.state.currentSelectorYear).month(this.state.currentSelectorMonth).date(1).subtract(firstDayOfWeek, "days");

    for (let i = 0; i < 5; i++) {
      let currentWeek = [] as any[];
      for (let j = 0; j < 7; j++) {
        let selected = false;

        if (currentDay.isSame(this.state.date, "day") && currentDay.isSame(this.state.date, "month") && currentDay.isSame(this.state.date, "year")) {
          selected = true;
        }

        let outOfRange = false;

        if (this.props.startDateLimit && this.props.endDateLimit) {
          outOfRange = this.props.startDateLimit.isAfter(currentDay) || this.props.endDateLimit.isBefore(currentDay);
        } else if (this.props.startDateLimit) {
          outOfRange = this.props.startDateLimit.isAfter(currentDay);
        } else if (this.props.endDateLimit) {
          outOfRange = this.props.endDateLimit.isBefore(currentDay);
        }

        currentWeek.push({
          day: moment().year(currentDay.year()).month(currentDay.month()).date(currentDay.date()),
          outOfCurrentMonth: currentDay.month() !== this.state.currentSelectorMonth, 
          selected,
          outOfRange,
        });

        currentDay.add(1, "days");
      }
      weeks.push(currentWeek);
    }

    if (currentDay.date() <= this.daysInMonth[currentDay.month()] && currentDay.date() > 25) {
      let currentWeek = [] as any[];
      for (let j = 0; j < 7; j++) {
        let selected = false;

        if (currentDay.isSame(this.state.date, "day") && currentDay.isSame(this.state.date, "month") && currentDay.isSame(this.state.date, "year")) {
          selected = true;
        }

        let outOfRange = false;

        if (this.props.startDateLimit && this.props.endDateLimit) {
          outOfRange = this.props.startDateLimit.isAfter(currentDay) || this.props.endDateLimit.isBefore(currentDay);
        } else if (this.props.startDateLimit) {
          outOfRange = this.props.startDateLimit.isAfter(currentDay);
        } else if (this.props.endDateLimit) {
          outOfRange = this.props.endDateLimit.isBefore(currentDay);
        }

        currentWeek.push({
          day: moment().year(currentDay.year()).month(currentDay.month()).date(currentDay.date()),
          outOfCurrentMonth: currentDay.month() !== this.state.currentSelectorMonth, 
          selected,
          outOfRange,
        });

        currentDay.add(1, "days");
      }
      weeks.push(currentWeek);
    }

    console.log(weeks);

    return (
      <div className="calendar-days-of-month">
        {weeks.map((element, index) => {
          return <div key={index} className="calendar-week">{element.map((elem, i) => {
            return <button key={i} disabled={elem.outOfRange} onClick={(event) => {this.handleSelectDate(event, elem.day)}} className={`calendar-day${elem.selected ? ' selected' : ''}${elem.outOfCurrentMonth ? ' out-of-month' : ''}${elem.outOfRange ? ' out-of-range' : ''}`}><span className="calendar-day-label">{elem.day.date()}</span></button>
          })}</div>
        })}
      </div>
    );
  }

  private getDateRangeSelector = () => {
    return (
      <div>
        <Dialog
          open={this.state.isOpen}
          onClose={this.closeDatePicker}
          aria-labelledby="alert-dialog-description"
          aria-describedby="alert-dialog-description"
        >
        </Dialog>
      </div>
    );
  }

  private getDateSelector = () => {
    return (
      <div>
        <Dialog
          open={this.state.isOpen}
          onClose={this.closeDatePicker}
          aria-labelledby="alert-dialog-description"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="calendar-dialog-text" id="alert-dialog-description">
              {this.props.datePickerText}
            </div>
            <div className="calendar-wrapper">
              <div className="calendar-month-selector">
                <IconButton 
                  className="month-selector"
                  onClick={this.handleBackMonth}
                  disabled={this.props.startDateLimit && this.state.currentSelectorMonth === this.props.startDateLimit.month() && this.state.currentSelectorYear === this.props.startDateLimit.year()}
                >
                  <i className="material-icons">chevron_left</i>
                </IconButton>
                <div className="calendar-month-display">{`${this.months[this.state.currentSelectorMonth]} ${this.state.currentSelectorYear}`}</div>
                <IconButton 
                  className="month-selector"
                  onClick={this.handleForwardMonth}
                  disabled={this.props.endDateLimit && this.state.currentSelectorMonth === this.props.endDateLimit.month() && this.state.currentSelectorYear === this.props.endDateLimit.year()}
                >
                  <i className="material-icons">chevron_right</i>
                </IconButton>
              </div>
              <div className="calendar-days-of-week">
                <div className="day-of-the-week">S</div>
                <div className="day-of-the-week">M</div>
                <div className="day-of-the-week">T</div>
                <div className="day-of-the-week">W</div>
                <div className="day-of-the-week">T</div>
                <div className="day-of-the-week">F</div>
                <div className="day-of-the-week">S</div>
              </div>
              {this.getCalendarDays()}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDatePicker} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  private getDateRangeAnchor = () => {
    return (
      <div>
        <TextField 
          style={{width: "120px"}}
          label={this.props.startDateLabel}
          value={`${this.state.startDate.month() + 1}/${this.state.startDate.date()}/${this.state.startDate.year()}`}
          type="text"
          id="startDate"
          margin="normal"
          onClick={this.openDatePicker}
          classes={{root: "field-background"}}
          InputProps={{ 
            classes: {
              input: "date-input"
            }
          }}
        />
        <TextField 
          style={{width: "120px"}}
          label={this.props.endDateLabel}
          value={`${this.state.endDate.month() + 1}/${this.state.endDate.date()}/${this.state.endDate.year()}`}
          type="text"
          id="endDate"
          margin="normal"
          onClick={this.openDatePicker}
          classes={{root: "field-background"}}
          InputProps={{ 
            classes: {
              input: "date-input"
            }
          }}
        />
      </div>
    );
  }

  private getDateAnchor = () => {
    return (
      <div>
        <TextField 
          style={{width: "120px"}}
          label={this.props.dateLabel}
          value={`${this.state.date.month() + 1}/${this.state.date.date()}/${this.state.date.year()}`}
          type="text"
          id="date"
          margin="normal"
          onClick={this.openDatePicker}
          classes={{root: "field-background"}}
          InputProps={{ 
            classes: {
              input: "date-input"
            }
          }}
        />
      </div>
    );
  }

  private handleBackMonth = (event) => {
    event.stopPropagation();
    event.preventDefault();

    let previousMonth = moment().year(this.state.currentSelectorYear).month(this.state.currentSelectorMonth).date(1).subtract(1, "months");
    this.setState({currentSelectorMonth: previousMonth.month(), currentSelectorYear: previousMonth.year()});
  }

  private handleForwardMonth = (event) => {
    event.stopPropagation();
    event.preventDefault();

    let nextMonth = moment().year(this.state.currentSelectorYear).month(this.state.currentSelectorMonth).date(1).add(1, "months");
    this.setState({currentSelectorMonth: nextMonth.month(), currentSelectorYear: nextMonth.year()});
  }

  private handleSelectDate = (event, value) => {
    (event.target as HTMLInputElement).blur();

    this.setState({
      date: value, 
      currentSelectorDate: value
    });
    this.closeDatePicker(event);
  }

  private openDatePicker = (event) => {
    event.stopPropagation();
    event.preventDefault();

    // (event.target as HTMLInputElement).blur();

    this.setState({
      isOpen: true,
      currentSelectorMonth: !this.props.range ? this.state.currentSelectorDate.month() : this.state.currentSelectorStartDate.month(),
      currentSelectorYear: !this.props.range ? this.state.currentSelectorDate.year() : this.state.currentSelectorStartDate.year(),
    });
  }

  private closeDatePicker = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      isOpen: false, 
    });
  }

  public render() {
    return (
      <div className="DatePicker">
        {this.props.range ? this.getDateRangeAnchor() : this.getDateAnchor()}
        {this.props.range ? this.getDateRangeSelector() : this.getDateSelector()}
      </div>
    );
  }
}

export default DatePicker;