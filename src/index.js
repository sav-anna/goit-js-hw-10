// Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою

import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  const country = e.target.value.trim();

  if (!country) {
    cleanSearch(refs.searchInput);
    cleanSearch(refs.countryList);
    return;
  }
  fetchCountries(country)
    .then(countryName => {
      if (countryName.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        cleanSearch(refs.countryList);
        cleanSearch(refs.countryInfo);
        return;
      }
      renderCountry(countryName);
    })
    .catch(error => {
      Notiflix.Notify.info('Oops, there is no country with that name');

      console.log(error);
    });
}
function renderCountry(country) {
  if (country.length === 1) {
    cleanSearch(refs.countryList);
    const markup = createCountryCardInfo(country);
    refs.countryInfo.innerHTML = markup;
  } else {
    cleanSearch(refs.countryInfo);
    const markup = createCountryList(country);
    refs.countryList.innerHTML = markup;
  }
}

function createCountryCardInfo(country) {
  return country.map(
    ({ name, capital, population, flags, languages }) => `<h1>
    <img src="${flags.svg}" alt="${name.official}" width="40" height="40">
    ${name.official}</h1>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages)}</p>`
  );
}

function createCountryList(country) {
  return country
    .map(
      ({ flags, name }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width="40" height="40"><span>${name.official}</span></li>`
    )
    .join('');
}

function cleanSearch(NameOfCountry) {
  NameOfCountry.innerHTML = '';
}
