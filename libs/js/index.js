let map, markers, polyline;
let currentExchangeRate = 1; // Default exchange rate
const latDefault = 51.50722; // Default latitude
const lngDefault = -0.1275; // Default longitude

function initMap() {
  map = L.map("map").setView([latDefault, lngDefault], 13);
  addTileLayer();
  initializeMarkerCluster();
  addEasyButtons();
  getCurrentLocation();
  populateCountryDropdown();
}

function addTileLayer() {
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    maxZoom: 14,
    attribution: "Your Attribution Here",
  }).addTo(map);
}

function initializeMarkerCluster() {
  markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
  });

  addDefaultMarker();
}

// Add default marker to the map
function addDefaultMarker() {
  const defaultIcon = L.ExtraMarkers.icon({
    icon: "fa-home",
    markerColor: "green",
    shape: "square",
    prefix: "fa",
  });

  L.marker([latDefault, lngDefault], { icon: defaultIcon }).addTo(markers);
  map.addLayer(markers);
}

function addEasyButtons() {
  const buttons = [
    { src: "img/info.png", target: "#staticBackdrop" },
    { src: "img/wikipedia.png", target: "#staticBackdrop4" },
    { src: "img/cloudy.png", target: "#staticBackdrop1" },
    { src: "img/economic.png", target: "#staticBackdrop2" },
    { src: "img/calc.png", target: "#staticBackdrop3" },
    { src: "img/bigstar.png", target: "#staticBackdrop4" },
  ];

  buttons.forEach((button) => {
    L.easyButton(
      `<img src="${button.src}" style="width:26px; position: relative; right:3.5px; bottom: 2px">`,
      (event) => {
        event.button.dataset.bsToggle = "modal";
        event.button.dataset.bsTarget = button.target;
      }
    ).addTo(map);
  });
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    console.error("Geolocation is not available in this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchUserCountryCode(latitude, longitude);
    },
    (error) => {
      console.error("Error getting user's location:", error.message);
    }
  );
}

async function fetchUserCountryCode(lat, lng) {
  try {
    const result = await $.ajax({
      url: "api/getUserCountryCode.php",
      type: "GET",
      dataType: "json",
      data: { lat, lng },
    });

    $("#countryDropdown").val(result.data);
    fetchCountryData();
  } catch (error) {
    console.error(error);
  }
}

async function getGeonames(country) {
  try {
    const result = await $.ajax({
      url: "api/getGeonames.php",
      type: "POST",
      dataType: "json",
      data: {
        country: country,
      },
    });
    return result.data[0];
  } catch (error) {
    console.log("Failure fetching Geonames", error);
  }
}

async function getWeather(north, south, east, west, countryCode) {
  try {
    const result = await $.ajax({
      url: "api/getWeather.php",
      type: "POST",
      dataType: "json",
      data: { north, south, east, west },
    });

    if (result && result.data && result.data.length > 0) {
      const { clouds, datetime, temperature, humidity } = result.data[0];

      $("#txtClouds").text(clouds);
      $("#txtDatetime").text(datetime);
      $("#txtTemperature").text(temperature);
      $("#txtHumidity").text(humidity);

      $("#myImage").attr(
        "src",
        "https://www.geonames.org/flags/x/" + countryCode.toLowerCase() + ".gif"
      );
    } else {
      console.log("awaiting country selection");
    }
  } catch (error) {
    console.error("Error in AJAX request:", error);
  }
}

async function getOpenCage(capital, country) {
  try {
    const result = await $.ajax({
      url: "api/getOpenCage.php",
      type: "POST",
      dataType: "json",
      data: {
        q: capital,
        countrycode: country,
      },
    });

    if (!result.data || !result.data.results || !result.data.results.length) {
      console.error("Invalid data structure", result);
      return; // Exit the function if the data structure is not as expected
    }

    return result.data.results;
  } catch (error) {
    console.log("Failure fetching Opencage", error);
  }
}

async function getCurrency(IsoCode) {
  try {
    const result = await $.ajax({
      url: "api/getCurrency.php",
      type: "POST",
      dataType: "json",
      data: {
        symbols: IsoCode,
      },
    });

    return result;
  } catch (error) {
    console.log("Failure fetching Currency", error);
  }
}

async function getGdp(Iso) {
  try {
    const result = await $.ajax({
      url: "api/getGdp.php",
      type: "POST",
      dataType: "json",
      data: {
        country: Iso,
      },
    });

    return result;
  } catch (error) {
    console.log("Failure fetching GDP", error);
  }
}

async function getCountryBorder(country) {
  try {
    const result = await $.ajax({
      url: "api/getCountryBorder.php",
      type: "POST",
      dataType: "json",
      data: { iso: country },
    });

    return result;
  } catch (error) {
    console.log("Failure fetching Countryborder", error);
  }
}

async function getCountryWikiSummary(lat, lng) {
  try {
    const result = await $.ajax({
      url: "api/getCountryWikiSummary.php",
      type: "POST",
      dataType: "json",
      data: {
        lat,
        lng,
      },
    });

    return result;
  } catch (error) {
    console.log("Failure fetching Countryborder", error);
  }
}

async function getCities(country) {
  try {
    const result = await $.ajax({
      url: "api/getCities.php",
      type: "POST",
      dataType: "json",
      data: {
        country,
      },
    });

    return result;
  } catch (error) {
    console.log("Failure fetching Cities", error);
  }
}

async function getPointsOfInterest(country, featureCode) {
  try {
    const result = await $.ajax({
      url: "api/getPointsOfInterest.php",
      type: "POST",
      dataType: "json",
      data: {
        country,
        featureCode,
      },
    });

    return result;
  } catch (error) {
    console.log("Failure fetching Points of Interest", error);
  }
}

async function populateCountryDropdown() {
  try {
    const response = await fetch("countryBorders.geo.json");
    const data = await response.json();
    const countries = data.features
      .map((feature) => ({
        name: feature.properties.name,
        iso_a2: feature.properties.iso_a2,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const countryDropdown = document.getElementById("countryDropdown");
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.iso_a2;
      option.textContent = country.name;
      countryDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading GeoJSON file:", error);
  }
}

function clearLayers() {
  if (polyline) {
    map.removeLayer(polyline);
    polyline = null;
  }
  markers?.clearLayers();
}

function calculateConversion() {
  const baseAmount = parseFloat($("#baseAmount").val());
  const convertedAmount = (baseAmount * currentExchangeRate).toFixed(2);
  $("#convertedAmount").text(baseAmount ? convertedAmount : "--");
}

async function fetchCountryData() {
  const selectedCountry = $("#countryDropdown").val();

  if (!selectedCountry) {
    console.log("No country selected yet.");
    return;
  }

  // Clear Highlight and markers on map
  clearLayers();

  const {
    capital,
    population,
    areaInSqKm,
    north,
    south,
    east,
    west,
    countryCode,
  } = await getGeonames(selectedCountry);

  await getWeather(north, south, east, west, countryCode);

  const populationNumber = parseFloat(population);
  const areaNumber = parseFloat(areaInSqKm);

  $("#txtCapital").text(capital);
  $("#txtPopulation").text(populationNumber.toLocaleString());
  $("#txtAreaInSqKm").text(areaNumber.toLocaleString());

  try {
    const cages = await getOpenCage(capital, selectedCountry);
    const firstResult = cages[0];

    if (!firstResult.components || !firstResult.annotations) {
      console.error(
        "Missing components or annotations in the first result:",
        firstResult
      );
      return; // Exit the function if components or annotations are missing
    }

    const Iso = firstResult.components["ISO_3166-1_alpha-2"];
    const IsoCode = firstResult.annotations.currency["iso_code"];
    const latitude = firstResult.geometry.lat;
    const longitude = firstResult.geometry.lng;

    if (!Iso || !IsoCode) {
      console.error("ISO or IsoCode is undefined:", Iso, IsoCode);
      return;
    }

    $("#txtIso").text(Iso);
    $("#txtIsoCode").text(Iso);

    map.panTo(new L.LatLng(latitude, longitude));
    let marker = L.marker(map.getCenter(), { draggable: true });
    marker.addTo(markers);
    marker.bindPopup("You are now here").openPopup();

    let countryMarker = L.marker([latitude, longitude]); // Create a marker at the capital's coordinates
    countryMarker.bindPopup("Capital");
    markers.addLayer(countryMarker);

    const currency = await getCurrency(IsoCode);
    currentExchangeRate =
      currency.data.rates[Object.keys(currency.data.rates)[0]];

    const currencyKey = Object.keys(currency.data.rates)[0];
    const rates = currencyKey + " " + currentExchangeRate + " = $1 ";
    const timestamp = currency["data"]["timestamp"];

    $("#txtSymbol").text(rates);
    $("#txtSymbol-converter").text(rates);
    $("#txtCurrencyName").text(currencyKey);
    $("#convertedCurrency").text(IsoCode);

    calculateConversion();

    const gdp = await getGdp(Iso);

    let GdpDate2022 = gdp.data[1][0].date;
    let GdpDate2021 = gdp.data[1][1].date;
    let GdpDate2020 = gdp.data[1][2].date;

    let GdpValue2022 = "$" + gdp.data[1][0].value.toLocaleString();
    let GdpValue2021 = "$" + gdp.data[1][1].value.toLocaleString();
    let GdpValue2020 = "$" + gdp.data[1][2].value.toLocaleString();

    $("#txtGdpDate2022").text(GdpDate2022);
    $("#txtGdpValue2022").text(GdpValue2022);

    $("#txtGdpDate2021").text(GdpDate2021);
    $("#txtGdpValue2021").text(GdpValue2021);

    $("#txtGdpDate2020").text(GdpDate2020);
    $("#txtGdpValue2020").text(GdpValue2020);

    const countryBorder = await getCountryBorder(selectedCountry);

    polyline = L.geoJSON(countryBorder.data, { color: "red" }).addTo(map);
    map.fitBounds(polyline.getBounds());

    const wikiSummary = await getCountryWikiSummary(latitude, longitude);

    const summary1 = wikiSummary.data[0]["summary"];
    const summary2 = wikiSummary.data[1]["summary"];
    const summary3 = wikiSummary.data[2]["summary"];
    const summary4 = wikiSummary.data[3]["summary"];
    const wikiUrlLink = wikiSummary.data[0]["wikipediaUrl"];

    $("#txtSummary1").text(summary1);
    $("#txtSummary2").text(summary2);
    $("#txtSummary3").text(summary3);
    $("#txtSummary4").text(summary4);
    $("#txtWikiUrl").text(wikiUrlLink);
    $("#myLink").attr("href", "https://" + wikiUrlLink);

    const citiesData = await getCities(selectedCountry);

    citiesData.data.forEach((city) => {
      console.log("Adding marker for city:", city.name);
      let cityMarker = L.marker([city.lat, city.lng]);
      cityMarker.bindPopup(city.name);
      markers.addLayer(cityMarker);
    });

    const featureCodeDescriptions = {
      PPL: "Popular Place",
      PPLR: "Rural Place",
      ADMF: "Administrative Facility",
      BANK: "Bank",
      CTRS: "Center",
      STNB: "Station",
    };

    const featureCodes = ["PPL", "PPLR", "ADMF", "BANK", "CTRS", "STNB"];
    const limitPerCode = 2;

    try {
      for (let i = 0; i < featureCodes.length; i++) {
        const featureCode = featureCodes[i];

        const pointsOfInterest = await getPointsOfInterest(
          selectedCountry,
          featureCode
        );

        console.log(`Points of Interest for ${featureCode}`, pointsOfInterest);

        pointsOfInterest.data.slice(0, limitPerCode).forEach((poi) => {
          const description =
            featureCodeDescriptions[featureCode] || featureCode;
          console.log(`Adding marker for ${description}:`, poi.name);
          let poiMarker = L.marker([poi.lat, poi.lng]);
          poiMarker.bindPopup(`${poi.name} (${description})`); // Popup shows name and feature code
          markers.addLayer(poiMarker); // Assuming 'markers' is a LayerGroup or similar
        });
      }
    } catch (error) {
      console.error(error);
    }

    let markerCurrent = L.marker([latitude, longitude]);
    markers.addLayer(markerCurrent);
    map.addLayer(markers);
  } catch (error) {
    console.error(error);
  }
}

initMap();
$("#baseAmount").on("input", calculateConversion);
