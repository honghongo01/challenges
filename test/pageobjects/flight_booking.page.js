// import {$} from '@wdio/globals'
// import Page from './page.js';
//
// /**
//  * sub page containing specific selectors and methods for a specific page
//  */
// class FlightBooking extends Page {
//     /**
//      * Returns an input element with the specified placeholder text.
//      * @param {string} placeholderText The text of the placeholder attribute to search for.
//      * @returns {WebdriverIO.Element} WebdriverIO element representing the input field.
//      */
//     async clickInputFieldWithPlaceholder(placeholderText) {
//         $(`//input[@placeholder="${placeholderText}"]`).click();
//     }
//
//     get btnSubmit() {
//         return $("button=Tìm chuyến bay");
//     }
//
//     get getValue() {
//         return $("button=Tìm chuyến bay");
//     }
//
//     async selectAirports(airportName){
//         const airportOption = await $(`//p[contains(text(), "${airportName}")]`);
//         await airportOption.wait
//         await airportOption.click();
//     }
//
//     async selectDepartureAndDestination(departure,departureAirport,destination,destinationAirport) {
//         const xpathInputField = "//div[contains(@class,'flight_from_auto')]//input[@data-id='flight_from']";
//         // await this.clickInputFieldWithPlaceholder("Chọn điểm đi");
//         // await $(xpathInputField).setValue(departure);
//         // await this.selectAirports(departureAirport);
//         await this.clickInputFieldWithPlaceholder("Chọn điểm đến");
//         await $(xpathInputField).setValue(destination);
//         await this.selectAirports(destinationAirport);
//         await this.btnSubmit.click();
//     }
// }
//
// export default new FlightBooking();

import {$} from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class FlightBooking extends Page {

    async open() {
        await browser.url('https://www.bestprice.vn/');
    }

    /**
     * Returns an input element with the specified placeholder text.
     * @param {string} placeholderText The text of the placeholder attribute to search for.
     * @returns {WebdriverIO.Element} WebdriverIO element representing the input field.
     */
    async inputFieldWithPlaceholder(placeholderText) {
        const inputField = await $(`//input[@placeholder="${placeholderText}"]`);
        return inputField;
    }


    get btnSubmit() {
        return $("button=Tìm chuyến bay");
    }

    async selectAirports(placeholder, airportName, xpath) {
        const inputField = await this.inputFieldWithPlaceholder(placeholder);
        const xpathInputField = `//div[@data-id="flight_${xpath}"]//input[@data-id="flight_${xpath}"]`;
        await inputField.click();
        await $(xpathInputField).setValue(airportName);
        await browser.pause(3000); // Wait for suggestions to load
        const airportOption = await $(`//div[@class="tt-suggestion"]//strong[contains(text(), "${airportName}")]`);
        await airportOption.click();
    }

    async selectDates(date) {
        const data = date.split('/')
        const xpathDateSelect = `//td[@data-handler="selectDay" and @data-month="${data[1]}"]//span[@class='ui-datepicker-day ' and normalize-space()="${data[0]}"]`;
        await $(xpathDateSelect).click();
    }

    async selectInfoCustomer(lable, dataType) {
        const xpathDataType = `//div[@class="popover-content"]//label[contains(text(),"${lable}")]//parent::div//following-sibling::div//div[@data-type="${dataType}"]`;
        await $(xpathDataType).click();
    }

    async bookFlight(departureAirport, destinationAirport, departureDate, returnDate) {
        await this.open();
        await this.selectAirports("Chọn điểm đi", departureAirport, "from");
        await this.selectAirports("Chọn điểm đến", destinationAirport, "to");
        const xpathDateFrom = "//div[@class='search-form__content__date']//i[@class='icon-search-form ico-calendar']";
        const xpathDateTo = "//div[@class='search-form__content__date search-form__content__date--to']//i[@class='icon-search-form ico-calendar']";
        await $(xpathDateFrom).click()
        await this.selectDates(departureDate);
        await $(xpathDateTo).click();
        await this.selectDates(returnDate);
        const xpathCustomer = "//label[normalize-space()='Hành khách' and @for='flight_passenger']"
        await $(xpathCustomer).click();
        await this.selectInfoCustomer("Người lớn","plus");
        await this.selectInfoCustomer("Trẻ em","plus")
        await this.btnSubmit.click();
    }
}

export default new FlightBooking();
