const log = d => {
    console.log('response json', d)
    return d;
};
const parse = response =>  {
  if(response.status >=200 || response.status < 300){
    return response.json()
  }
  return response.text();
};

const HEADERS = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

module.exports = {
  log,
  parse,
  HEADERS
}
