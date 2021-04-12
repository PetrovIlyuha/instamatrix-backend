export default {
  Comment: {
    createdByMe: ({ id }, args, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
  },
};
