'use client'
import React, { useState, useEffect } from 'react'
import { Calendar } from './ui/calendar'
import { formatDateTime } from '@/lib/utils'
import { getAppointmentsByDate } from '@/lib/actions/appointment.actions'

interface AppointmentDatePickerProps {
  selectedDoctorId: string
  appointment?: any
  onDateTimeSelect: (date: Date) => void
}

const AppointmentDatePicker: React.FC<AppointmentDatePickerProps> = ({
  selectedDoctorId,
  appointment,
  onDateTimeSelect
}) => {
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (appointment?.schedule) {
      const date = new Date(appointment.schedule)
      setSelectedDate(date)
      setSelectedTime(formatDateTime(date).time)
    }
  }, [appointment])


  useEffect(() => {
    if (selectedDate && selectedDoctorId) {
      fetchBookedAppointments(selectedDate, selectedDoctorId)
    }
  }, [selectedDate, selectedDoctorId])


  const fetchBookedAppointments = async (date: Date, doctorId: string) => {
    setIsLoading(true)
    try {
      console.log("🔄 Fetching booked appointments for:", date, "Doctor ID:", doctorId)
      const bookedTimes = await getAppointmentsByDate(date, doctorId)
      console.log("📌 Fetched booked times:", bookedTimes)
      const availableSlots = generateAvailableTimes(bookedTimes)
      console.log("✅ Available slots after filtering:", availableSlots)
      setAvailableTimes(availableSlots)
    } catch (error) {
      console.error("❌ Error fetching booked slots:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAvailableTimes = (bookedTimes: string[]) => {
    const startHour = 8
    const endHour = 18
    const interval = 30
    const times: string[] = []
    const bookedSet = new Set(bookedTimes)

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        if (!bookedSet.has(timeSlot)) {
          times.push(timeSlot)
        }
      }
    }
    return times
  }

  return (
    <div className="w-full relative">
      <input
        type="text"
        readOnly
        value={selectedDate && selectedTime ? `${formatDateTime(selectedDate).date} ${selectedTime}` : 'Select a date and time'}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full  rounded-md p-2 cursor-pointer border_unv bg-black/80 text-white outline-none focus:border-[#482acc]"
      />

      {isOpen && (
        <div className="calendar-container absolute top-12 left-0 w-full bg-black/90 p-2 rounded-lg border border-dark-500 shadow-lg z-50">
          <div className="calendar-wrapper">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date)
                  fetchBookedAppointments(date, selectedDoctorId)
                }
              }}
              disabled={(date) => date && date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="bg-transparent text-white border border-dark-500 rounded-md p-2"
            />

            <div className="w-auto flex flex-col mt-2">
              {isLoading ? (
                <p className="text-gray-300">Loading available times...</p>
              ) : availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      className={`border border-dark-500 rounded-md px-2 py-2 text-center bg-transparent text-white hover:bg-gray-800 ${selectedTime === time ? 'bg-blue-500' : ''}`}
                      onClick={() => {
                        setSelectedTime(time)
                        setIsOpen(false)
                        if (selectedDate) {
                          const [hour, minute] = time.split(':').map(Number)
                          const selectedDateTime = new Date(selectedDate)
                          selectedDateTime.setHours(hour, minute)
                          onDateTimeSelect(selectedDateTime)
                        }
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No available times for this date</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentDatePicker