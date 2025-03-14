/*********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: _____Aliyah Ighodaro_________________ Student ID: __140961236____________ Date: ___Mar. 11, 2025___________
*
* Published (web app) URL: https://assignments-web.vercel.app
*
********************************************************************************/

const siteData = require("./modules/data-service");
const express = require("express");
const app = express();
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname +
'/public'));

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");



siteData.initialize()
.then(()=>{
    app.listen(HTTP_PORT, () => console.log("Express http server listening on: " + HTTP_PORT));
}).catch((err)=>{
    console.log("Error: ", err)
});

app.get("/", (req, res) => {
    res.render("home", { page: "/" });
  });
  

app.get("/home", (req,res) => {
    res.sendFile(__dirname.join())
});

app.get("/about", (req, res) => {
    res.render("about", { page: "/about" });
  });  


  app.get("/sites", async (req, res) => {
    try {
        let sites;
        if (req.query.region) {
            sites = await siteData.getSitesByRegion(req.query.region);
        } else if (req.query.provinceOrTerritory) {
            sites = await siteData.getSitesBySubRegion(req.query.provinceOrTerritory);
        } else {
            sites = await siteData.getAllSites();
        }

        res.render("sites", { sites, page: "/sites" });
    } catch (error) {
        res.status(404).render("404", { message: "No matching sites found." });
    }
});




app.get("/sites/:id", async (req, res) => {
    try {
        const site = await siteData.getSiteById(req.params.id); 
        if (!site) {
            return res.status(404).render("404", { message: "Site not found" });
        }

        const response = await fetch("http://quotable.io/random");
        if (!response.ok) {
            throw new Error("Failed to fetch quote");
        }
        const quote = await response.json();
        res.render("site", { site, quote });

    } catch (error) {
        res.status(500).render("404", { message: "Error retrieving site data." });
    }
});


  


  app.use((req, res) => {
    res.status(404).render("404", { message: "Page not found" });
  });
  
