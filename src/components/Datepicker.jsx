import { useCallback, useMemo, useState } from 'react'

function Datepicker() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const formattedDate = useMemo(() => {
    return selectedDate ? selectedDate.toLocaleDateString() : ''
  }, [selectedDate])

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const daysInMonth = useCallback((year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }, [])

  const calendarDays = useMemo(() => {
    const days = []
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        otherMonth: true,
      })
    }

    const thisMonthDays = daysInMonth(currentYear, currentMonth)
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        otherMonth: false,
      })
    }

    const nextDays = 42 - days.length
    for (let i = 1; i <= nextDays; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        otherMonth: true,
      })
    }

    return days
  }, [currentMonth, currentYear, daysInMonth])

  const currentMonthName = useMemo(() => {
    return new Date(currentYear, currentMonth).toLocaleString('default', {
      month: 'long',
    })
  }, [currentMonth, currentYear])

  const toggleCalendar = useCallback(() => {
    setShowCalendar((prev) => !prev)
  }, [])

  const prevMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }, [])

  const isSameDate = (a, b) => {
    return (
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    )
  }

  const selectDate = useCallback(
    (day) => {
      if (day.otherMonth) return
      setSelectedDate(day.date)
      setShowCalendar(false)
    },
    []
  )

  return (
    <div className="relative inline-block">
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={toggleCalendar}
        placeholder="Select date"
        className="w-40 p-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded">
              &lt;
            </button>
            <span className="font-medium">{currentMonthName} {currentYear}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded">
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {weekdays.map((day) => (
              <span key={day} className="font-semibold text-gray-700">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((day) => {
              const isSelected = isSameDate(day.date, selectedDate)
              return (
                <span
                  key={day.date.toISOString()}
                  onClick={() => selectDate(day)}
                  className={[
                    'p-2 cursor-pointer rounded-full',
                    day.otherMonth ? 'text-gray-400' : '',
                    isSelected ? 'bg-blue-500 text-white' : '',
                    !day.otherMonth && !isSelected ? 'hover:bg-blue-100' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {day.date.getDate()}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Datepicker


