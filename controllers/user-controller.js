const { User, Thought } = require('../models');

const userController ={
    getUsers(req, res){
        User.find()
          .then((users) => res.json(users))
          .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.UserId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
        .then((User) =>
          !User
            ? res.status(404).json({ message: 'No User with that ID' })
            : res.json(User)
        )
        .catch((err) => res.status(500).json(err));
    },
}