document.addEventListener("DOMContentLoaded", async () => {
  const postData = async function(url, data) {
    const response = await fetch(url, {
      method: `POST`,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  };

  const pagetitle = document.querySelector(`.section-header`).innerText.slice(7).toLowerCase();
  console.log(pagetitle);
  const response = await postData('/cars', {type: `${pagetitle}`});
  const orderedCars = await postData('/orderedCars', {title: `202`});

  let template = document.querySelector(`.truck-template`).content.querySelector('li');
  let parent = document.querySelector('.services-types ul');

  for (let i = 0; i < response.length; i++) {
      const element = template.cloneNode(true);
      const b64encoded = btoa(
          String.fromCharCode.apply(null, response[i].img.data)
      );
      element.querySelector('img').src = `data:image/jpg;base64,${b64encoded}`;
      element.querySelector('img').setAttribute('data-id', response[i].id);
      element.setAttribute('data-id', response[i].id);
      parent.appendChild(element);
  }

  let carImages = document.querySelectorAll(`.services-types ul li`);
  carImages = Array.prototype.slice.call(carImages);

  orderedCars.forEach(item => {
    document.querySelector(`.services-types ul li[data-id='${item.truck_id}']`).classList.add('ordered');
    document.querySelector(`.services-types ul li img[data-id='${item.truck_id}']`).classList.add('ordered');
  })
  
  carImages.forEach(item => {
    item.addEventListener('click', async e => {
      if (e.target.classList[0] !== `ordered`) {
        const userData = prompt('Введите информацию', 'Иванов Иван Иванович, +375 (##) ###-##-##');
        const indexDelimiter = userData.indexOf(',');
        const userDataName = userData.slice(0, indexDelimiter);
        const userDataPhone = userData.slice(indexDelimiter + 2);

        item.classList.add('ordered');
        item.querySelector('img').classList.add('ordered');

        const sendOrder = await postData('/orders', {truck_id: `${e.target.getAttribute('data-id')}`, userDataName: `${userDataName}`, userDataPhone: `${userDataPhone}`});
      }
    })
  })
  
//   if (pagetitle === 'тент-фургон') {

//   } else if (pagetitle === 'борт') {

//   } else if (pagetitle === 'тент-борт-термо-рефрижератор') {

//   }
})