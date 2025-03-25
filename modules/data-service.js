//require
require('dotenv').config();
require('pg'); 
const Sequelize = require('sequelize');

// set up sequelize to point to database
const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_xh0o8JXfHzTl', {
  host: 'ep-billowing-flower-a5nl51g5-pooler.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});
//connect to database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

//define models
  const ProvinceOrTerritory = sequelize.define('ProvinceOrTerritory', {
    code: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    region: Sequelize.STRING,
    capital: Sequelize.STRING
  }, {
    createdAt: false,
    updatedAt: false
  });
  
  const Site = sequelize.define('Site', {
    siteId: { type: Sequelize.STRING, primaryKey: true },
    site: Sequelize.STRING,
    description: Sequelize.TEXT,
    date: Sequelize.INTEGER,
    dateType: Sequelize.STRING,
    image: Sequelize.STRING,
    location: Sequelize.STRING,
    latitude: Sequelize.FLOAT,
    longitude: Sequelize.FLOAT,
    designated: Sequelize.INTEGER,
    provinceOrTerritoryCode: Sequelize.STRING
  }, {
    createdAt: false,
    updatedAt: false
  });

  //setup foreign key: each province/territory has a site(s)
  Site.belongsTo(ProvinceOrTerritory, { foreignKey: 'provinceOrTerritoryCode' });

  
////-------------


function initialize() {
    return sequelize.sync();
  }

  function getAllSites() {
    return Site.findAll({ include: [ProvinceOrTerritory] });
  }

  function getSiteById(id) {
    return Site.findAll({
      include: [ProvinceOrTerritory],
      where: { siteId: id }
    }).then(data => {
      if (data.length > 0) return data[0];
      else throw new Error("Unable to find requested site");
    });
  }

  function getSitesByProvinceOrTerritoryName(provinceOrTerritory) {
    return Site.findAll({
      include: [ProvinceOrTerritory],
      where: {
        '$ProvinceOrTerritory.name$': {
          [Sequelize.Op.iLike]: `%${provinceOrTerritory}%`
        }
      }
    }).then(data => {
      if (data.length > 0) return data;
      else throw new Error("Unable to find requested sites");
    });
  }

  function getSitesByRegion(region) {
    return Site.findAll({
      include: [ProvinceOrTerritory],
      where: {
        '$ProvinceOrTerritory.region$': region
      }
    }).then(data => {
      if (data.length > 0) return data;
      else throw new Error("Unable to find requested sites");
    });
  }

  function getAllProvincesAndTerritories() {
    return ProvinceOrTerritory.findAll();
  }
  
  function addSite(siteData) {
    return Site.create(siteData)
      .then(() => {})
      .catch(err => {
        throw err.errors[0].message;
      });
  }

  function editSite(id, siteData) {
    return Site.update(siteData, {
      where: { siteId: id }
    }).then(() => {})
      .catch(err => {
        throw err.errors[0].message;
      });
  }

  function deleteSite(id) {
    return Site.destroy({
      where: { siteId: id }
    }).then(() => {})
      .catch(err => {
        throw err.errors?.[0]?.message || err.message;
      });
  }

  
  
  
module.exports = { initialize, getAllSites, getSiteById, getSitesByRegion, getSitesByProvinceOrTerritoryName, addSite, getAllProvincesAndTerritories, editSite, deleteSite };
