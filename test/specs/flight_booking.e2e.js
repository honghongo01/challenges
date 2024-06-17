import {expect} from '@wdio/globals'
import FlightBooking from '../pageobjects/flight_booking.page.js'
describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await FlightBooking.open();
        await FlightBooking.bookFlight("Hà Nội","Hồ Chí Minh","20/6","25/6");
    })
})

