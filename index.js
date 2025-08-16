import "dotenv/config";
import express from "express";
import path from "path";
import * as url from "url";
import { fileURLToPath } from "url";
import db from "./modules/lynx/db.js"; //load db.js

const __dirname=url.fileURLToPath(new URL(".",import.meta.url));

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views")); //the first "views" is the setting name
//the second value above is the path: __dirname/views
app.set("view engine", "pug");

app.disable("view cache");

app.set("view cache", false);

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));


//USE PAGE ROUTES FROM ROUTER(S)
app.get("/", async (request, res) => {
   console.log("Rendering index.pug now");
  let productList = await db.getProducts();
  console.log("Products before init:", productList);
  console.log("Products:", productList);
  let categoryList = await db.getCategories();
  console.log("Categories before init:", categoryList);
  // Initialize if either collection is empty
  if (!productList.length) {
    await db.initializeProducts();
    productList = await db.getProducts();
     productList = await db.getProducts();
    console.log("Products after init:", productList);
  }
  if (!categoryList.length) {
    await db.initializeCategories();
    categoryList = await db.getCategories();
    categoryList = await db.getCategories();
    console.log("Categories after init:", categoryList);
  }

  res.render("index", {
    title: "Home | Lynx",
    products: productList,
    categories: categoryList
  });
});


app.get("/about",(request,res)=>{
    res.render("about",{title : "About"});
});
// Products
app.get("/api/products", async (request, response) => {
  let productList= await db.getProducts();
  //if there's nothing in the products collection, initialize with some content then get the products again
  if (!productList.length) {
    await db.initializeProducts(); 
    productList = await db.getProducts();
  }
  response.json(productList);
});
app.get("/products", async (request, response) => {
  let productList= await db.getProducts();
  //if there's nothing in the products collection, initialize with some content then get the products again
  if (!productList.length) {
    await db.initializeProducts(); 
    productList = await db.getProducts();
  }
  response.render("products", { products: productList });
});
app.get("/addProduct", async (request, response) => {
  //add a product
  await db.addProduct(0,"Textured Asymmetrical Off Shoulder Top Plaid Cropped Button-Up Top", 12.5, "/images/addTop.png");
  response.redirect("/products");
});
app.get("/updateProduct", async (request, response) => {
  //update something
  await db.updateProductPrice("Los Angeles Graphic Mesh Jersey Dress", 20.00)
  response.redirect("/products");
});
app.get("/deleteProduct", async (request, response) => {
  //delete by id
  await db.deleteProductsById(0);
  response.redirect("/products");
});

// Categories
app.get("/api/categories", async (request, response) => {
  let categoryList= await db.getCategories();
  //if there's nothing in the categories collection, initialize with some content then get the categories again
  if (!categoryList.length) {
    await db.initializeCategories(); 
    categoryList = await db.getCategories();
  }
  response.json(categoryList);
});
app.get("/categories", async (request, response) => {
  let categoryList= await db.getCategories();
  //if there's nothing in the categories collection, initialize with some content then get the categories again
  if (!categoryList.length) {
    await db.initializeCategories(); 
    categoryList = await db.getCategories();
  }
  response.render("categories", { categories: categoryList });
});
app.get("/addCategory", async (request, response) => {
  //add a category
  await db.addCategory(0,"Shoes", "A versatile range of footwear including sneakers, boots, and sandals designed for comfort, style, and every occasion.");
  response.redirect("/categories");
});
app.get("/updateCategory", async (request, response) => {
  //update something
  await db.updateCategoryDescription("Tee's", "Casual and comfy t-shirts for all styles.")
  response.redirect("/categories");
});
app.get("/deleteCategory", async (request, response) => {
  //delete by id
  await db.deleteCategoriesById(0);
  response.redirect("/categories");
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
}); 






