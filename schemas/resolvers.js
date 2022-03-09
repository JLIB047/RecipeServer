// resolvers.js file

const {User}= require('../models');
const { AuthenticationError } = require('apollo-server-errors');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

       login:async(parent ,{email,password})=>{

      const user =await User.findOne({email});

      if (!user){throw new AuthenticationError('Incorrect credentials')}

      const correctPw = await user.isCorrectPassword(password);

      if(!correctPw){ throw new AuthenticationError('Incorrect credentials') }
       const token = signToken(user);
      return  {user,token};
    },


        // saveRecipe: async (parent, { recipeData }, context) => {
        //     console.log("SavedRecipe",recipeData)
        //     if (context.user) {
        //         const updatedUser = await User.findOneAndUpdate(
        //             { _id: context.user._id },
        //             { $addToSet: { savedRecipes: recipeData } },
        //             { new: true }
        //         )
        //         return updatedUser;
        //     }
        //     throw new AuthenticationError('You need to be logged in first!')
        // },
        saveRecipe: async (parent, args, context) => {
            if (context.user) {
            //   const savedBook = await Book.create({ ...args, username: context.user.username });
          
             const updatedUser =  await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedRecipes: args.input } },
                { new: true }
              );
          
            return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },


        removeRecipe: async (parent, args, context) => {
            if(context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedRecipes: { idMeal: args.idMeal } } },
                { new: true }
            );

            return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    
    }
};

module.exports = resolvers;