"use strict";
const mongoose = require("mongoose");

//? I created this index.js as an experiment and probably learn something new - because i've done this lab today before class,
//? is this the rework of it.
//? as well trying to get understanding/practice of "use strict";

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

const myRecipe = {
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
};

// Connection to the database
const connectDB = async (db = mongoose) => {
  try {
    const x = await db.connect(MONGODB_URI);
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
};

//Function for checking inserted documents and their titles
const checkInsert = async insertData => {
  try {
    const insertionData = await Recipe.find({}, "title", { projection: { _id: 0, title: 1 } });
    console.log(" * * * Check after Insert * * * ");
    console.log(`Collection: 'recipes', contains now ${insertData.length} documents:`);
    insertionData.forEach(element => {
      console.log(` → '${element.title}'`);
    });
  } catch (error) {
    console.log("Error during checking of inserted data in collection", error);
  }
};

// Iteration 2
const addMyRecipe = async myRecipeData => {
  try {
    const insert = await Recipe.create(myRecipeData);
    console.log(`'${insert.title}' document successfully added to collection`);
    await checkInsert([insert]);
  } catch (error) {
    console.log("Error inserting 'recipe' document in 'recipe-app' collection", error);
  }
};

// Iteration 3
const insertJsonData = async jsonData => {
  try {
    const insert = await Recipe.insertMany(jsonData);
    console.log("Documents from JSON.data object inserted in Collection 'recipes'");
    await checkInsert(insert);
  } catch (error) {
    console.log("Error during insertion of JSON.data", error);
  }
};

//Iteration 4
const updateRecipe = async () => {
  try {
    const updated = await Recipe.findOneAndUpdate({ title: "Rigatoni alla Genovese" }, { duration: 100, $inc: { __v: 1 } }, { new: true });
    console.log(`Successfully updated ${updated.title} duration to ${updated.duration} - document version is now: ${updated.__v}!`);
  } catch (error) {
    console.log("Error occurred during update of 'duration' ", error);
  }
};

// Iteration 5
const rmRecipeByTitle = async titleData => {
  try {
    const rm = await Recipe.deleteOne({ title: titleData });
    console.log(`Successfully deleted ${rm.deletedCount} document from collection`);
  } catch (error) {
    console.log("Error when try to remove 'recipe' document from collection", error);
  }
};

// Iteration 6
const disconnectDB = (db = mongoose) => {
  db.disconnect();
};

const doAll = async () => {
  await connectDB();
  await addMyRecipe(myRecipe);
  await insertJsonData(data);
  await updateRecipe();
  await rmRecipeByTitle("Carrot Cake");
  disconnectDB();
};

doAll() //.finally(() => mongoose.connection.close());
  .finally(() => console.log("* * * Everything done - now disconnected from DB * * *"));
