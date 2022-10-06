"use strict";

const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    // Run your code here, after you have insured that the connection was made
    return Recipe.create({
      title: "Vegan Spaghetti code",
      level: "Amateur Chef",
      ingredients: [
        "1 green Node.js server, running",
        "2 1/2 cups of JS code",
        "1 semisweet MongoDB, connected",
        "1 pinch of mongoose pepper",
        "1 spoon chopped fresh JSON files",
      ],
      cuisine: "International",
      dishType: "main_course",
      duration: 42,
      creator: "Artur Baumeister",
    });
  })
  .then(() => Recipe.find({}, null, { projection: { _id: 0, title: 1 } }))
  .then(result => {
    const [{ title: recipe_name }] = result; // A bit redudant if I was using ".findOne()"
    console.log(`"${recipe_name}" was successfully added to Collection 'recipes'`);
    return Recipe.insertMany(data);
  })
  .then(() => {
    console.log("data.json inserted in Collection 'recipes'");
    return Recipe.find({}, "title", { projection: { _id: 0, title: 1 } });
  })
  .then(results => {
    console.log("DB: 'recipe-app', Collection: 'recipes' contains following documents:");
    for (const document of results) {
      console.log(` → ${document.title}`);
    }
    return Recipe.findOneAndUpdate({ title: "Rigatoni alla Genovese" }, { duration: 100 }, { new: true });
  })
  .then(updatedRec => {
    console.log(`Successfully updated ${updatedRec.title} duration to ${updatedRec.duration}!`);
    return Recipe.deleteOne({ title: "Carrot Cake" });
  })
  .then(x => {
    console.log(`Successfully deleted ${x.deletedCount} document from collection`);
    return mongoose.disconnect();
  })
  .then(() => console.log("X Successfully disconnected from MongoDB - exit program X"))
  .catch(error => console.error("Error - Something went wrong", error));
