
/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: _______Aliyah Ighodaro_______________ Student ID: ____140961236__________ Date: ____Feb 16, 2025__________
*
********************************************************************************/
const siteData = require("../data/NHSiteData.json"); //array of objects
const provinceAndTerritoryData = require("../data/provinceAndTerritoryData.json"); //array of objects

let sites = [];

function initialize () {
    return new Promise((resolve, reject) =>{
        sites = siteData.map(site =>{
            let provinceObj = provinceAndTerritoryData.find(province => province.code === site.provinceOrTerritoryCode);
            return {...site, provinceOrTerritoryObj: provinceObj};
        })
        if(sites.length > 0){
            resolve();
        }
        else{
            reject("Failed to initialize");
        }
    })
}

function getAllSites(){
    return new Promise((resolve, reject) =>{
        sites = siteData.map(site =>{
            let provinceObj = provinceAndTerritoryData.find(province => province.code === site.provinceOrTerritoryCode);
            return {...site, provinceOrTerritoryObj: provinceObj};
        })
        if(sites.length > 0){
            resolve(sites);
        }
        else{
            reject("Failed to get all sites");
        }
    })
}

function getSiteById(id){
    return new Promise((resolve, reject) => {
        let site = sites.find(site => site.siteId === id);
        site ? resolve(site) : reject("Unable to retrieve requested site id");
   })
};

function getSitesBySubRegion(name){
    return new Promise((resolve, reject) => {
        let site = sites.filter(site => site.provinceOrTerritoryObj.name.toLowerCase().includes(name.toLowerCase()));
        site.length > 0 ? resolve(site) : reject("Unable to find requested province/territory");  
    })

}

function getSitesByRegion(region){
    return new Promise((resolve, reject) => {
        let site = sites.filter(site => site.provinceOrTerritoryObj.region.toLowerCase().includes(region.toLowerCase()));
        site.length > 0 ? resolve(site) : reject("Unable to retrieve requested region");
    })

}
module.exports = { initialize, getAllSites, getSiteById, getSitesBySubRegion, getSitesByRegion };