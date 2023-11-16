const bookingService = require("../services/booking-service");
const hotelService = require("../services/hotel-service");

class BookingControllers {
  async bookHotel(req, res) {
    const hotelId = req.params.id;
    const { roomType, checkIn, checkOut } = req.body;
    if (!hotelId || !checkIn || !checkOut || !roomType) {
      return res.status(400).json({
        error: true,
        message: "The request is missing a required parameter",
        success: false,
        data: {},
      });
    }
    let hotel;
    try {
      hotel = await hotelService.getHotel(hotelId);
      if (!hotel) {
        return res.status(404).json({
          error: true,
          message: "The request is missing a required parameter",
          success: false,
          data: {},
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal server error 1",
        success: false,
        data: {},
      });
    }

    const { available, roomTypeExist } = await hotelService.isRoomTypeExist(
      hotel,
      roomType
    );
    if (!roomTypeExist) {
      return res.status(404).json({
        error: true,
        message: "This type of room is not exist in our hotel",
        success: false,
        data: {},
      });
    }
    if (!available) {
      return res.status(404).json({
        error: true,
        message: "All rooms are booked",
        success: false,
        data: {},
      });
    }

    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const difference = date2.getTime() - date1.getTime();
    const differenceInDays = difference / (1000 * 3600 * 24);
    const pricePerday = await hotelService.getPricePerDay(hotel, roomType);
    const netPrice = pricePerday * differenceInDays;

    let booking;
    try {
      booking = await hotelService.bookHotel(
        req.user,
        hotel._id,
        roomType,
        checkIn,
        checkOut,
        netPrice
      );
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
        success: false,
        data: {},
      });
    }
    res.status(200).json({
      error: true,
      message: "Pay to confirm your room",
      success: false,
      data: booking,
    });
  }

  async getAllConfirmedBooking(req, res) {
    const id  = req.user._id;
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "The request is missing a required parameter",
        success: false,
        data: {},
      });
    }
    try {
      const bookings = await bookingService.getAllConfirmedBookings(id);
      res.status(200).json({
        error: false,
        message: "Confirmed bookings: ",
        success: true,
        data: bookings
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
        success: false,
        data: {},
      });
    }
  }

  async getAllCanceledBookings(req,res){
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "The request is missing a required parameter",
        success: false,
        data: {},
      });
    }
    try {
      const bookings = bookingService.getAllCanceledBookings(id);
      res.status(200).json({
        error: true,
        message: "Pay to confirm your room",
        success: false,
        data: bookings
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
        success: false,
        data: {},
      });
    }
  }
}
module.exports = new BookingControllers();
