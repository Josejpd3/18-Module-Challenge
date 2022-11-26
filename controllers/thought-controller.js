const { Thought, User } = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find()
          .then((thoughts) => res.json(thoughts))
          .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
          return thought.findOneAndUpdate(
            { _id: req.body.thoughtId },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
          );
        })
        .then((thought) =>
          !thought
            ? res.status(404).json({
              message: 'thought not found',
            })
            : res.status(200).json('New thought')
        )
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
          )
            .then((thought) =>
              !thought
                ? res.status(404).json({ message: 'No thought with this id!' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
        )
        .then((user) =>
          !user
            ? res
              .status(404)
              .json({ message: 'User not found' })
            : res.status(200).json({ message: 'Thought deleted!' })
        )
        .catch((err) => res.status(500).json(err));
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
          )
            .then((thought) =>
              !thought
                ? res.status(404).json({ message: 'Thought not found!' })
                : res.status(200).json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
          )
            .then((thought) =>
              !thought
                ? res.status(404).json({ message: 'Thought not found!' })
                : res.status(200).json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
}

module.exports = thoughtController;