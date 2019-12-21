// Define all functions above so they can be used without issue with our data fetchers

const findProductsInPriceRange = (products, range) => {
  return products.filter(
    ({ suggestedPrice }) =>
      suggestedPrice >= range.min && suggestedPrice <= range.max
  );
};

const groupCompaniesByLetter = companies => {
  const result = {};
  companies.forEach(company => {
    const firstLetter = company.name[0];
    if (firstLetter in result) {
      result[firstLetter].push(company);
    } else {
      result[firstLetter] = [company];
    }
  });
  return result;
};

const groupCompaniesByState = companies => {
  const result = {};
  companies.forEach(company => {
    if (company.state in result) {
      result[company.state].push(company);
    } else {
      result[company.state] = [company];
    }
  });
  return result;
};

const processOfferings = (companies, products, offerings) => {
  return offerings.map(offering => {
    const copy = { ...offering };
    copy.company = companies.find(company => company.id === copy.companyId);
    copy.product = products.find(product => product.id === copy.productId);
    return copy;
  });
};

const getCompaniesByNumberOfOfferings = (
  companies,
  offerings,
  numOfferings
) => {
  return companies.filter(company => {
    let count = 0;
    offerings.forEach(offering => {
      if (offering.companyId === company.id) {
        count++;
      }
    });
    return count >= numOfferings;
  });
};

const processProducts = (products, offerings) => {
  return products.map(product => {
    let count = 0;
    const total = offerings.reduce((acc, curr) => {
      if (product.id === curr.productId) {
        count++;
        return acc + curr.price;
      } else {
        return acc + 0;
      }
    }, 0);
    product.averagePrice = (total / count).toFixed(2);
    return product;
  });
};

// Get the data from each endpoint
const grabCompanies = () => {
  return fetch(
    'https://acme-users-api-rev.herokuapp.com/api/companies'
  ).then(response => response.json());
};

const grabProducts = () => {
  return fetch(
    'https://acme-users-api-rev.herokuapp.com/api/products'
  ).then(response => response.json());
};

const grabOfferings = () => {
  return fetch(
    'https://acme-users-api-rev.herokuapp.com/api/offerings'
  ).then(response => response.json());
};

// Getting my IDs for display of data (this is not part of the assignment, I just wanted to do it)

const one = document.getElementById('problem-one');
const two = document.getElementById('problem-two');
const three = document.getElementById('problem-three');
const four = document.getElementById('problem-four');
const five = document.getElementById('problem-five');
const six = document.getElementById('problem-six');

// Go ahead and wait for all of the data to return so that we can invoke every function
// without needing to make separate calls for each function.
Promise.all([grabCompanies(), grabProducts(), grabOfferings()]).then(data => {
  const companies = data[0];
  const products = data[1];
  const offerings = data[2];
  // render problem one answer
  one.querySelector('.result-json').innerHTML = JSON.stringify(
    findProductsInPriceRange(products, { min: 1, max: 3 }),
    null,
    1
  );

  // render problem two answer
  two.querySelector('.result-json').innerHTML = JSON.stringify(
    groupCompaniesByLetter(companies),
    null,
    1
  );

  // render problem three answer
  three.querySelector('.result-json').innerHTML = JSON.stringify(
    groupCompaniesByState(companies),
    null,
    1
  );

  // render problem four answer
  four.querySelector('.result-json').innerHTML = JSON.stringify(
    processOfferings(companies, products, offerings),
    null,
    1
  );

  // render problem five answer
  five.querySelector('.result-json').innerHTML = JSON.stringify(
    getCompaniesByNumberOfOfferings(companies, offerings, 3),
    null,
    1
  );

  // render problem six answer
  six.querySelector('.result-json').innerHTML = JSON.stringify(
    processProducts(products, offerings),
    null,
    1
  );
});
