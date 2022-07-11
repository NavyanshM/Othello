let x = 2;
const radios = document.querySelectorAll('input[type=radio][name="AI1"]')

console.log(x);

radios.forEach(radio => radio.addEventListener('change', () => x = radio.value));

export {x}; 

//event listener and export