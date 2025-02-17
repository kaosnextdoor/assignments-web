/*********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: _____Aliyah Ighodaro_________________ Student ID: __140961236____________ Date: ___Feb. 17, 2025___________
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


siteData.initialize()
.then(()=>{
    app.listen(HTTP_PORT, () => console.log("Express http server listening on: " + HTTP_PORT));
}).catch((err)=>{
    console.log("Error: ", err)
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
  });
  

app.get("/home", (req,res) => {
    res.sendFile(__dirname.join())
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
  });

  app.get("/sites", (req, res) => {
    let { region, provinceOrTerritory } = req.query;

    if (region) {
        siteData.getSitesByRegion(region)
            .then(data => res.json(data))
            .catch(err => res.status(500).send(err));
        return;
    }

    if (provinceOrTerritory) {
        siteData.getSitesBySubRegion(provinceOrTerritory)
            .then(data => res.json(data))
            .catch(err => res.status(500).send(err));
        return;
    }

    siteData.getAllSites()
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});


app.get("/sites/:siteId", (req, res) => {
    siteData.getSiteById(req.params.siteId)
        .then(site => {
            if (site) {
                res.json(site);
            } else {
                res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
            }
        })
        .catch(err => res.status(500).send(err));
});


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
