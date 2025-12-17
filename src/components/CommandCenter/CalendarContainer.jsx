import React from 'react';
import { useSelector } from 'react-redux';
import WeeklyCalendar from './WeeklyCalendar';
import MonthlyCalendar from './MonthlyCalendar';

const CalendarContainer = () => {
    const { navigation } = useSelector(state => state.app);
    const calendarView = navigation?.calendarView || 'week';

    return (
        <>
            {calendarView === 'week' ? <WeeklyCalendar /> : <MonthlyCalendar />}
        </>
    );
};

export default CalendarContainer;
