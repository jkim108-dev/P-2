console.log("script loaded");

const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const section = document.querySelector(".jay");
const carList = document.getElementById("carList");
const moreText = document.getElementById("moreText");

if (moreText) {
  moreText.style.opacity = "0";
  moreText.style.visibility = "hidden";
}


let audioContext;
let analyser;
let microphone;

let currentCategory = null;

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

function applyFrequency(frequency) {
  let carType = "";
  let imageSrc = "";

  if (frequency < 80) {
    carType = "Ultra Low (Cybertruck)";
    imageSrc =
      "https://cdn.prod.website-files.com/5ec85520c4dfff034b036be2/656a0b823b501878d0faf1fe_teslacybertruck4.webp";
  } else if (frequency < 150) {
    carType = "Low (Porsche Cayenne)";
    imageSrc =
      "https://cimg3.ibsrv.net/ibimg/hgm/1920x1080-1/100/821/2021-porsche-cayenne-gts_100821371.jpg";
  } else if (frequency < 200) {
    carType = "Mid (Audi A6)";
    imageSrc =
      "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/gallery-images/original/1143000/300/1143385.jpg?q=50";
  } else if (frequency < 250) {
    carType = "High (Mclaren)";
    imageSrc =
      "https://i.ebayimg.com/images/g/jeAAAOSw3gJZEs-1/s-l1200.jpg";
  } else {
    carType = "Very High (F1 Car)";
    imageSrc =
      "https://www.goodwood.com/globalassets/.road--racing/race/historic/2020/9-september/list-best-f1-cars/best-f1-cars-of-all-time-6-red-bull-rb9-f1-2013-usa-sebastian-vettel-steve-etherington-mi-goodwood-07092020.jpg?rxy=0.5,0.5";
  }

  section.style.backgroundImage = `url(${imageSrc})`;

  result.textContent = `${frequency.toFixed(1)} Hz — ${carType}`;

  currentCategory = carType;
  renderCarList(carType);
  carList.style.display = "grid";


const carListSection = document.querySelector(".car-list");

    if (carListSection) {
  console.log("car-list shown");
}

  if (moreText) {
  moreText.style.opacity = "1";
  moreText.style.visibility = "visible";
  moreText.style.transform = "translateY(0)";
  console.log("car-list:", document.querySelector(".car-list"));

}
  
}

window.addEventListener("keydown", e => {
  if (e.key === "1") applyFrequency(60);
  if (e.key === "2") applyFrequency(120);
  if (e.key === "3") applyFrequency(180);
  if (e.key === "4") applyFrequency(230);
  if (e.key === "5") applyFrequency(280);
});

async function startMic() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);

  detectPitch();
}

function detectPitch() {
  if (!analyser) return;

  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);

  const frequency = autoCorrelate(buffer, audioContext.sampleRate);
  if (frequency !== -1 && frequency <= 300) {
    applyFrequency(frequency);
    const moreText = document.getElementById("moreText");
moreText.style.opacity = "1";
moreText.style.transform = "translateY(0)";

  }

  requestAnimationFrame(detectPitch);
}

if (startBtn) {
  startBtn.addEventListener("click", startMic);
}

function autoCorrelate(buffer, sampleRate) {
  let SIZE = buffer.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < 0.2) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < 0.2) {
      r2 = SIZE - i;
      break;
    }
  }

  buffer = buffer.slice(r1, r2);
  SIZE = buffer.length;

  const c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] += buffer[j] * buffer[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  return sampleRate / maxpos;
}

function renderCarList(category) {
  carList.innerHTML = "";

  if (!carDatabase[category]) return;

  carDatabase[category].forEach(car => {
    const item = document.createElement("div");
    item.className = "car-item show"; 
    item.innerHTML = `
      <img src="${car.img}" />
      <p>${car.name}</p>
    `;
    carList.appendChild(item);
  });
}


const carDatabase = {
  "Ultra Low (Cybertruck)": [
    {
      name: "Peterbilt 379",
      img: "https://d1moysbdfluzeo.cloudfront.net/uploads/production/Optimus-Prime-1.JPG"
    },
    {
      name: "Rivian R1T",
      img: "https://www.slashgear.com/img/gallery/5-of-the-most-luxurious-pickup-trucks-in-2024/intro-1712765167.webp"
    }
  ],
  "Low (Porsche Cayenne)": [
    {
      name: "Lamborghini Urus",
      img: "https://www.topgear.com/sites/default/files/2024/10/1-Lamborghini-Urus-SE-review-2024.jpg"
    },
    {
      name: "Ferrari Purosangue",
      img: "https://hips.hearstapps.com/hmg-prod/images/2024-ferrari-purosangue-pr-102-69405145b4e60.jpg"
    }
  ],
  "Mid (Audi A6)": [
    {
      name: "Mercedes S-Class",
      img: "https://www.goodcarbadcar.net/wp-content/uploads/2011/01/Mercedes-S-Class.webp"
    },
    {
      name: "BMW 7 Series",
      img: "https://di-uploads-pod23.dealerinspire.com/bmwofowingsmills/uploads/2023/09/ezgif.com-gif-maker-2023-09-22T110155.495.jpg"
    }
  ],
  "High (Mclaren)": [
    {
      name: "Porsche 911",
      img: "https://a.storyblok.com/f/322327/5760x2850/487d3ceaf7/cz26w11ox0001-911-turbo-s-cabrio-side-desktop.jpg"
    },
    {
      name: "Lamborghini Aventador",
      img: "https://hips.hearstapps.com/hmg-prod/amv-prod-cad-assets/images/16q2/667349/2016-lamborghini-aventador-lp750-4-superveloce-test-review-car-and-driver-photo-667354-s-original.jpg"
    }
  ],
  "Very High (F1 Car)": [
    {
      name: "Ferrari F1",
      img: "https://media.formula1.com/image/upload/t_16by9Centre/c_lfill,w_3392/q_auto/v1740000000/fom-website/2026/Red%20Bull/SI202601150723.webp"
    },
    {
      name: "Audi F1",
      img: "https://media.formula1.com/image/upload/c_fit,h_1200/q_auto/v1740000000/fom-website/2026/Audi/16x9%20single%20image%20(39).webp"
    }
  ]
};
