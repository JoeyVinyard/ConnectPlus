
var FB = require('fb'),
id = '146089319399243';
FB.api('4', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  console.log(res.id);
  console.log(res.name);
});


FB.api('4', { fields: [id, 'Calvin Henry'] }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res.id);
  console.log(res.name);
  console.log(res);
});