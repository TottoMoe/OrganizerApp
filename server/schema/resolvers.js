const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/aut");
const { User, Event, Booking } = require("../models");


const resolvers = {
  Query: {
    events: async () => {
      return await Event.find({}).populate("bookings").populate({
        path: "bookings",
        populate: "user",
      });
    },
    bookings: async () => {
      return await Booking.find({}).populate("user");
    },
  },

  Mutation: {
    createEvent: async (parent, { title, description, date, creator }) => {
      const event = await Event.create({ title, description, date, creator });

      const token = signToken(event);
      return { token, event };
    },
    createUser: async (parent, args, context) => {
      const user = await User.create(args);

      if (!User) {
        return console.error("No User found!");
      }
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        return console.error("Wrong password!");
      }
      const token = signToken(user);
      return { token, user };
    },
    bookEvent: async (parent, { eventId, booking }) => {
      return Event.findOneandUpdate(
        { _id: eventId },
        { $addToSet: { bookings: booking } },
        { new: true, runValidators: true }
      );
    },
    //-------- delete event
    // removeEvent: async (parent, { eventId }) => {
    //   return Event.findOneAndDelete({ _id: eventId });
    // },
    cancelBooking: async (parent, args, context) => {
      const booking = await Booking.findById(args.bookingId).populate("event");
      await Booking.deleteOne({ _id: args.bookingId });

      return Event.findOneandUpdate(
        { _id: eventId },
        { $pull: { bookings: booking } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;