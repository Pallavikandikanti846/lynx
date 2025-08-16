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

app.use(express.urlencoded({ extended: true }));


//USE PAGE ROUTES FROM ROUTER(S)
app.get("/", async (request, res) => {
   console.log("Rendering index.pug now");
  let productList = await db.getProducts();
  let categoryList = await db.getCategories();
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
  response.render("addProduct", { title: "Add Product" });
});

// Handle form submission
app.post("/products/add", async (request, response) => {
  const { id, title, price, image } = request.body;
  await db.addProduct(id, title, price, image);
  response.redirect("/products");
});

app.get("/products/edit/:id", async (request, response) => {
  const product = (await db.getProducts()).find(p => p.id == request.params.id);
  if (!product) return response.status(404).send("Product not found");
  response.render("editProduct", { title: "Edit Product", product });
});

app.post("/products/edit/:id", async (request, response) => {
  const { title, price, image } = request.body;
  await db.updateProductDetails(request.params.id, title, price, image);
  response.redirect("/products");
});

app.get("/products/delete/:id", async (request, response) => {
  await db.deleteProductsById(request.params.id);
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
    response.render("addCategory", { title: "Add category" });
});
app.post("/categories/add", async (request, response) => {
  const { id, name,description } = request.body;
  await db.addCategory(id, name, description);
  response.redirect("/categories");
});
app.get("/categories/edit/:id", async (request, response) => {
  const category = (await db.getCategories()).find(p => p.id == request.params.id);
  if (!category) return response.status(404).send("Category not found");
  response.render("editCategory", { title: "Edit Category", category });
});

app.post("/categories/edit/:id", async (request, response) => {
  const { name, description } = request.body;
  await db.updateCategoryDetails(request.params.id, name, description);
  response.redirect("/categories");
});
app.get("/categories/delete/:id", async (request, response) => {
  await db.deleteCategoriesById(request.params.id);
  response.redirect("/categories");
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
}); 






