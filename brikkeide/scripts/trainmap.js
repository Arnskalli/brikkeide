import {getStations,getCrossings, getLines,getTrainstat} from "./traindata.js";

document.addEventListener("DOMContentLoaded", async () => {

  const trainmap = document.querySelector(".trainmap");
  let trains = [],
    stationsxy = [],
    crossingsxy = [],
    lines = [],
    st = [],
    stations = [],
    crossings = [];

  class Station {
    constructor(x, y, nr) {
      this.y = y;
      this.x = x;
      this.visual = document.createElement("div");
      this.visual.classList.add("station");
      this.visual.style.left = `${this.x}px`;
      this.visual.style.bottom = `${this.y}px`;
      this.visual.innerText = nr;
      trainmap.appendChild(this.visual);
    }
  }

  async function createStations() {
    try {
      // const response = await fetch("http://127.0.0.1:3000/get_stations");
      // let data = await response.json();
      // stationsxy = data["data"];
      stationsxy = getStations.data; // leser fra fil istedenfor database
      console.log("Stations: ");
      console.log(stationsxy);
    } catch (error) {
      console.error("Error fetching stations:", error);
      alert("Failed to load station data");
    }

    let num = Object.keys(stationsxy).length;
    for (let i = 0; i < num; i++) {
      let newStation = new Station(stationsxy[i][0], stationsxy[i][1], i);
      stations.push(newStation);
    }
    console.log(stations);
  }

  class Crossing {
    constructor(x, y, nr) {
      this.y = y;
      this.x = x;
      this.visual = document.createElement("div");
      this.visual.classList.add("crossing");
      this.visual.style.left = `${this.x}px`;
      this.visual.style.bottom = `${this.y}px`;
      this.visual.innerText = nr;
      trainmap.appendChild(this.visual);
    }
  }

  async function createCrossing() {
    try {
      // const response = await fetch("http://127.0.0.1:3000/get_crossings");
      // let data = await response.json();
      // crossingsxy = data["data"];
      crossingsxy = getCrossings.data; //leser fra fil istedenfor database
      console.log("Crossings: ");
      console.log(crossingsxy);
    } catch (error) {
      console.error("Error fetching crossings:", error);
    }

    let num = Object.keys(crossingsxy).length;
    for (let i = 0; i < num; i++) {
      let newCrossing = new Crossing(crossingsxy[i][0], crossingsxy[i][1], i);
      crossings.push(newCrossing);
    }
    console.log(crossings);
  }

  async function createLines() {
    try {
      // const response = await fetch("http://127.0.0.1:3000/get_lines");
      // let data = await response.json();
      // lines = data["data"];
      lines = getLines.data;
      console.log("Lines: ");
      console.log(lines);
    } catch (error) {
      console.error("Error fetching lines:", error);
    }
  }

  class Train {
    constructor(left, bottom, nr) {
      this.left = left;
      this.dx = left;
      this.bottom = bottom;
      this.dy = bottom;
      this.visual = document.createElement("div");
      this.visual.classList.add("train");
      this.visual.id = `train-${nr}`;
      this.visual.style.left = `${this.left}px`;
      this.visual.style.bottom = `${this.bottom}px`;
      this.visual.innerText = nr;
      trainmap.appendChild(this.visual);
    }
  }

  async function createTrains() {
    try {
      // const response = await fetch("http://127.0.0.1:3000/get_trainstat");
      // let data = await response.json();
      // st = data["data"];
      st = getTrainstat.data
      console.log("Trains: ");
      console.log(st);
    } catch (error) {
      console.error("Error fetching train data:", error);
    }

    for (let i = 0; i < st.length; i++) {
      let p = st[i]["stations"][st[i].sindex];
      let newTrain = new Train(stationsxy[p][0], stationsxy[p][1], i);
      trains.push(newTrain);
    }
    console.log(trains);
  }

  function moveTrains() {
    let n = 0;

    trains.forEach((train) => {
      let dx = train.dx - train.left;
      let dy = train.dy - train.bottom;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 0.1) {
        distance = 0.1;
      }
      let speed = Math.min(2, distance);

      if (
        Math.abs(train.left - train.dx) < 3 &&
        Math.abs(train.bottom - train.dy) < 3
      ) {
        if (st[n].lindex >= lines[st[n].line].length - 1) {
          st[n].lindex = 0;
          st[n].sindex = (st[n].sindex + 1) % st[n].stations.length;
          st[n].line = `${st[n].stations[st[n].sindex]}${
            st[n].stations[(st[n].sindex + 1) % st[n].stations.length]
          }`;
        } else {
          st[n].lindex += 1;
        }

        if (st[n].lindex == 0) {
          train.dx = stations[st[n].stations[st[n].sindex]].x;
          train.dy = stations[st[n].stations[st[n].sindex]].y;
        } else if (st[n].lindex < lines[st[n].line].length - 1) {
          let nextCrossingIndex = lines[st[n].line][st[n].lindex];
          train.dx = crossingsxy[nextCrossingIndex][0];
          train.dy = crossingsxy[nextCrossingIndex][1];
        } else {
          let nextStationIndex =
            st[n].stations[(st[n].sindex + 1) % st[n].stations.length];
          train.dx = stations[nextStationIndex].x;
          train.dy = stations[nextStationIndex].y;
        }
      }

      // train.left += train.dx > train.left ? 2 : -2;
      // train.bottom += train.dy > train.bottom ? 2 : -2;
      train.left += (dx / distance) * speed;
      train.bottom += (dy / distance) * speed;

      train.visual.style.left = `${train.left}px`;
      train.visual.style.bottom = `${train.bottom}px`;

      n++;
    });
  }

  await createStations();
  await createCrossing();
  await createLines();
  await createTrains();

  let trainId = setInterval(moveTrains, 30);
});
