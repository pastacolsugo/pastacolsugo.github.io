const lecture_codes = {
  '00819': {
    'anno': 1,
    'css_class': 'programmazione',
    'nome': 'programmazione',
  },
  '58414': {
    'anno': 1,
    'css_class': 'aeg',
    'nome': 'algebra',
  },
  '69731': {
    'anno': 1,
    'css_class': 'architetture',
    'nome': 'architetture',
  },
  '11929': {
    'anno': 1,
    'css_class': 'algo',
    'nome': 'algoritmi',
  },
  '66736': {
    'anno': 2,
    'css_class': 'metodi',
    'nome': 'metodi',
  },
  '10906': {
    'anno': 2,
    'css_class': 'db',
    'nome': 'db',
  },
  '00405': {
    'anno': 2,
    'css_class': 'fisica',
    'nome': 'fisica',
  },
  '70226': {
    'anno': 2,
    'css_class': 'reti1',
    'nome': 'prog_reti',
  },
  '08574': {
    'anno': 2,
    'css_class': 'os',
    'nome': 'sistemi_operativi',
  },
  '70219': {
    'anno': 2,
    'css_class': 'oop',
    'nome': 'oop',
  },
  '14015': {
    'anno': 3,
    'css_class': 'critto',
    'nome': 'crittografia',
  },
  '72787': {
    'anno': 3,
    'css_class': 'mobile',
    'nome': 'mobile',
  },
  '72796': {
    'anno': 3,
    'css_class': 'data-intensive',
    'nome': 'data_intensive',
  },
  '96642': {
    'anno': 3,
    'css_class': 'virtualizzazione',
    'nome': 'virtualizzazione',
  },
  '00884': {
    'anno': 3,
    'css_class': 'ric-op',
    'nome': 'ricerca_operativa',
  },
  '84339': {
    'anno': 3,
    'css_class': 'adb',
    'nome': 'advanced_db',
  },
  '17634': {
    'anno': 3,
    'css_class': 'visione',
    'nome': 'visione',
  },
  '41731': {
    'anno': 3,
    'css_class': 'tec-web',
    'nome': 'tecnologie_web',
  },
  '70227': {
    'anno': 3,
    'css_class': 'diritto',
    'nome': 'diritto',
  },
  '72778': {
    'anno': 3,
    'css_class': 'hpc',
    'nome': 'hpc',
  }
};

let hidden_lecture_codes = [];
let orario_della_giornata = [];
const year_css_class = ['', 'first_year', 'second_year', 'third_year'];

function saveToOrario(lecture_json) {
  orario_della_giornata.push(lecture_json);
}

function renderOrario() {
  orario_della_giornata.filter(filterLectures).forEach(drawTimeBox);
}

function getYearClassNameFromLecture(lecture_json) {
  const lecture_code = lecture_json['cod_modulo'].split('_')[0];
  const lecture_year = lecture_codes[lecture_code].anno;
  return year_css_class[lecture_year];
}

function drawTimeBox(lecture_json) {
  const lecture_code = lecture_json['cod_modulo'].split('_')[0];
  let start = lecture_json['time'].split('-')[0].trimEnd();
  let end = lecture_json['time'].split('-')[1].trimStart();
  let name = lecture_json['title'].split('/')[0].trimEnd();
  let hall = lecture_json['aule'].map(aula => aula['des_edificio']).join(' ');
  let year = lecture_codes[lecture_code].anno;


  let timetable = document.getElementsByClassName('timetable')[0];
  if (timetable == null) {
    console.log('Error: timetable not found');
  }

  let timebox = document.createElement('div');
  timebox.classList.add('timebox');
  timebox.classList.add(getYearClassNameFromLecture(lecture_json));

  let minutes_start = parseInt(start.split(':')[1]);

  timebox.style.gridRowStart = String(start.split(':')[0] - 7);
  if (minutes_start >= 8 && minutes_start <= 22) {
    timebox.classList.add('start_15');
  } else if (minutes_start > 22 && minutes_start <= 37) {
    timebox.classList.add('start_30');
  } else if (minutes_start > 37) {
    timebox.classList.add('start_45');
  }

  let minutes_end = parseInt(end.split(':')[1]);

  if (minutes_end >= 8) {
    timebox.style.gridRowEnd = String(end.split(':')[0] - 6);

    if (minutes_end <= 22) {
      timebox.classList.add('end_15');
    } else if (minutes_end <= 37) {
      timebox.classList.add('end_30');
    } else {
      timebox.classList.add('end_45');
    }
  } else {
    timebox.style.gridRowEnd = String(end.split(':')[0] - 7);
  }

  timebox.classList.add(lecture_codes[lecture_code].css_class);

  let lecture_title = document.createElement('span');
  lecture_title.innerText = name.toLowerCase().replace(/(^.|\s+.)/g, m => m.toUpperCase());
  lecture_title.classList.add('lecture_title');
  if (lecture_title.innerText == "Reti Di Telecomunicazione") {
    lecture_title.innerText = lecture_title.innerText.slice(0, 17);
  }

  let lecture_time = document.createElement('span');
  lecture_time.innerText = start + ' - ' + end;
  lecture_time.classList.add('lecture_time');

  let lecture_hall = document.createElement('span');
  lecture_hall.innerText = hall;
  lecture_hall.classList.add('lecture_hall');

  timebox.appendChild(lecture_title);
  timebox.appendChild(lecture_time);
  timebox.appendChild(lecture_hall);

  timetable.appendChild(timebox);
}

function filterLectures(lecture_json) {
  // // lecture codes are in form
  // // "CODE_X"
  // // where X is an extra numerical identifier, for example OOP has '70219_1', '70219_2', '70219_3'
  // // we can remove it to keep it simpler
  // const deny_lectures_codes = [
  //   '00819', // programmazione
  //   '08574', // sistemi operativi
  //   '70219', // OOP
  //   '41731', // tec web
  //   '70227', // diritto
  //   '72778', // hpc
  // ];
  // return !deny_lectures_codes.includes(lecture['cod_modulo'].split('_')[0]);
  return !hidden_lecture_codes.includes(lecture_json['cod_modulo'].split('_')[0]);
}

function handleResponse(json) {
  // json.filter(filterLectures).forEach(makeTimeBox);
  json.forEach(saveToOrario);
  renderOrario();
}

function fetchOrari(year, start, end) {
  let url = `https://corsi.unibo.it/laurea/IngegneriaScienzeInformatiche/orario-lezioni/@@orario_reale_json?anno=${year}&curricula=&start=${start}&end=${end}`;

  fetch(url, {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-fetch-mode": "cors",
    },
    "body": null,
    "method": "GET",
  }).then(res => res.json()).then(data => handleResponse(data));
}

function getWeekdayString(day) {
  const n = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  if (day >= 0 && day <= 6)
    return n[day];
  return '';
}

function clearTimeboxes() {
  document.querySelectorAll(".timebox").forEach(el => el.remove());
}

function loadNewDate() {
  orario_della_giornata = [];
  clearTimeboxes();

  let displayDate = [
    getWeekdayString(date.getDay()),
    String(date.getDate()),
    String(new Intl.DateTimeFormat('it-IT', { month: 'long' }).format(date)),
    String(date.getFullYear())
  ].join(' ');
  document.getElementsByClassName('datebox')[0].innerText = displayDate;

  let dateString = [
    String(date.getFullYear()),
    date.getMonth() >= 10 ? String(date.getMonth() + 1) : '0' + String(date.getMonth() + 1),
    date.getDate() >= 10 ? String(date.getDate()) : '0' + String(date.getDate()),
  ].join('-');
  for (let anno = 1; anno <= 3; anno++) {
    fetchOrari(anno, dateString, dateString);
  }
}

function updateLectureSetting(event) {
  const lecture_code = event.srcElement.id;
  const checked = event.srcElement.checked;
  if (!checked) {
    hidden_lecture_codes.push(lecture_code);
    return;
  }
  hidden_lecture_codes = hidden_lecture_codes.filter(code => code != lecture_code);
}

function saveSettingsToLocalstorage() {
  // take list of lectures to be hidden
  // serialize to json
  // encode in base64
  // save to localstorage
  localStorage.setItem('hidden_lecture_codes', btoa(JSON.stringify(hidden_lecture_codes)));
}

function retrieveSettingsFromLocalstorage() {
  if (localStorage.getItem('hidden_lecture_codes') == null) return;
  hidden_lecture_codes = JSON.parse(atob(localStorage.getItem('hidden_lecture_codes')));
}

function renderSettings() {
  function addSettingCheckbox([code, values], i) {
    let settingsElement = document.querySelector('#settings');

    let newLabel = document.createElement('label');
    newLabel.setAttribute('for', values.nome);
    newLabel.innerText = values.nome.replace('_', ' ');

    let newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type', 'checkbox');
    newCheckbox.setAttribute('name', values.nome);
    newCheckbox.setAttribute('id', code);
    newCheckbox.checked = !hidden_lecture_codes.includes(code);

    if (i % 2) {
      newLabel.classList.add('light_gray_setting');
      newCheckbox.classList.add('light_gray_setting');
    }

    newCheckbox.addEventListener('click', updateLectureSetting);
    settingsElement.appendChild(newLabel);
    settingsElement.appendChild(newCheckbox);
  }

  function alphabeticNameCompare(a, b) {
    return (a[1].nome < b[1].nome) ? -1 : 1;
  }

  let i = 0
  Object.entries(lecture_codes).sort(alphabeticNameCompare).forEach(addSettingCheckbox, i++);
}

function showSettings() {
  let timetable = document.querySelector('main.timetable');
  let settings = document.querySelector('main.settings');
  timetable.classList.add('hidden');
  settings.classList.remove('hidden');
}

function hideSettings() {
  let timetable = document.querySelector('main.timetable');
  let settings = document.querySelector('main.settings');
  timetable.classList.remove('hidden');
  settings.classList.add('hidden');

  saveSettingsToLocalstorage();
  clearTimeboxes();
  renderOrario();
}

document.querySelector('#settings-icon').addEventListener('click', showSettings);
document.querySelector('#settings-done').addEventListener('click', hideSettings);


retrieveSettingsFromLocalstorage();
var date = new Date();
loadNewDate();

document.getElementById('back_arrow').addEventListener('click', function () {
  date.setDate(date.getDate() - 1);
  loadNewDate();
});
document.getElementById('forward_arrow').addEventListener('click', function () {
  date.setDate(date.getDate() + 1);
  loadNewDate();
});

renderSettings();