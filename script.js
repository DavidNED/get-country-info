const countryContainer = document.querySelector('.countries');
const cityContainer = document.querySelector('.city');

const getPosition = function () {
  return new Promise((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const renderCity = function (res) {
  const html = `<article class="city">
  <div class="city__data">
  <h3 class="city__name">${res.city}</h3>
    <h4 class="city__region">${res.region}</h4>
    <p class="city__row"><span>👫</span>${res.adminareas.admin8.population} people</p>
  </div>
</article>`;

  cityContainer.insertAdjacentHTML('afterbegin', html);
};

const population = function (pop) {
  if (pop.length === 4 || pop.length === 5 || pop.length === 6)
    return 'thousand';
  if (pop.length > 6) return 'million';
};

const renderCountry = function (res) {
  const country = res[0];
  console.log(country.population);
  const html = `<article class="country">
  <img class="country__img" src="${country.flag}" />
  <div class="country__data">
    <h3 class="country__name">${country.name}</h3>
    <h4 class="country__region">${country.region}</h4>
    <p class="country__row"><span>👫</span>${country.population} ${population(
    String(country.population)
  )} people</p>
    <p class="country__row"><span>🗣️</span>${country.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${country.currencies[0].name}</p>
  </div>
</article>`;

  countryContainer.insertAdjacentHTML('afterbegin', html);
  countryContainer.style.opacity = 1;
};

const getJSON = async function (url) {
  const posObjGeo = await fetch(url);
  const resJSON = await posObjGeo.json();
  return resJSON;
};

const whereAmILocated = async function () {
  const posObj = await getPosition();
  const { latitude, longitude } = posObj.coords;

  // Reverse geo-coding
  const resCityJSON = await getJSON(
    `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=105550322406220270442x3850`
  );

  // Render city
  renderCity(resCityJSON);

  // Get country based on city object
  const { country } = resCityJSON;

  const resCountryJSON = await getJSON(
    `https://restcountries.com/v2/name/${country}`
  );

  // Render country
  renderCountry(resCountryJSON);
};

whereAmILocated();
